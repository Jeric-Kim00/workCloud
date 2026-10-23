/**
 * 타임리 AI 도입 문의 현황 — 새 문의 행 메일 알림 (Google Apps Script)
 *
 * 동작
 *  - 10분마다 '도입 문의' 탭을 확인해, 아직 알리지 않은 새 문의 행을 RECIPIENTS에게 메일로 보낸다.
 *  - 직접 입력 / 복사·붙여넣기 / Google Form 연동 어느 경우든 동작한다.
 *  - 입력 도중에 메일이 나가지 않도록, 필수 칸이 채워지고 다음 확인 때까지 내용이 바뀌지 않은 행만 보낸다.
 *    (그래서 행 추가 후 메일까지 약 10~20분 걸린다.)
 *
 * 설치: 시트에서 확장 프로그램 → Apps Script → 이 코드 붙여넣기 → setup 실행 (sheet-alerts/README.md 참고)
 */

const CONFIG = {
  SHEET_NAME: '도입 문의',
  HEADER_ROW: 1,
  RECIPIENTS: 'mhkim@timely.kr', // 여러 명이면 쉼표로 구분
  INTERVAL_MINUTES: 10, // 1, 5, 10, 15, 30 중 하나
  // 이 칸이 모두 채워져야 '문의 건'으로 본다.
  REQUIRED_COLUMNS: ['접수일', '문의처', '담당자'],
  // 같은 건인지 구분하는 칸. 이 칸을 나중에 고치면 새 건으로 보고 한 번 더 알린다.
  KEY_COLUMNS: ['접수일', '문의처', '담당자'],
  // 메일 본문에 넣을 칸
  MAIL_COLUMNS: ['접수일', '도입현황', '문의 형태', '문의처', '지역', '상세', '소속·직급',
    '담당자', '전화번호', '이메일', '상담 내용'],
};

const SENT_PREFIX = 'SENT_';
const PENDING_PREFIX = 'PENDING_';
const ITEMS_PER_CHUNK = 220; // 항목 최대 34자(쉼표 포함) × 220 ≈ 7.5KB, 스크립트 속성 값 1개당 9KB 제한

/** 최초 1회 실행: 기존 행을 '이미 알림'으로 표시하고 10분 주기 트리거를 만든다. */
function setup() {
  const { rows } = readRows_();
  saveList_(SENT_PREFIX, rows.map(r => r.key));
  saveList_(PENDING_PREFIX, []);

  removeTriggers_();
  ScriptApp.newTrigger('checkNewRows')
    .timeBased()
    .everyMinutes(CONFIG.INTERVAL_MINUTES)
    .create();

  Logger.log('설정 완료: 기존 %s건은 알림 대상에서 제외, %s분마다 확인합니다.',
    rows.length, CONFIG.INTERVAL_MINUTES);
}

/** 알림 중지: 트리거만 지운다. */
function teardown() {
  removeTriggers_();
  Logger.log('트리거를 삭제했습니다.');
}

/** 테스트: 마지막 문의 행 1건으로 메일을 보내 본다(발송 기록에는 남기지 않음). */
function sendTestMail() {
  const { rows, sheet } = readRows_();
  if (!rows.length) throw new Error('보낼 문의 행이 없습니다.');
  sendMail_(sheet, rows[rows.length - 1], '[테스트] ');
}

/** 트리거가 주기적으로 호출한다. */
function checkNewRows() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30 * 1000)) return;
  try {
    const { rows, sheet } = readRows_();
    const sent = new Set(loadList_(SENT_PREFIX));
    const pending = new Set(loadList_(PENDING_PREFIX)); // 'key:fingerprint'
    const nextPending = [];
    let sentCount = 0;

    rows.forEach(row => {
      if (sent.has(row.key)) return;
      // 직전 확인 때와 내용이 같으면 입력이 끝난 것으로 보고 발송
      const entry = `${row.key}:${row.fingerprint}`;
      if (pending.has(entry)) {
        sendMail_(sheet, row, '');
        sent.add(row.key);
        sentCount++;
      } else {
        nextPending.push(entry);
      }
    });

    if (sentCount) saveList_(SENT_PREFIX, Array.from(sent));
    saveList_(PENDING_PREFIX, nextPending);
  } finally {
    lock.releaseLock();
  }
}

function readRows_() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) throw new Error(`'${CONFIG.SHEET_NAME}' 탭을 찾을 수 없습니다.`);

  const values = sheet.getDataRange().getDisplayValues();
  const headers = values[CONFIG.HEADER_ROW - 1].map(h => String(h).trim());
  const col = name => {
    const i = headers.indexOf(name);
    if (i < 0) throw new Error(`헤더에서 '${name}' 열을 찾을 수 없습니다.`);
    return i;
  };
  const required = CONFIG.REQUIRED_COLUMNS.map(col);
  const keyCols = CONFIG.KEY_COLUMNS.map(col);
  const mailCols = CONFIG.MAIL_COLUMNS.map(name => ({ name, i: col(name) }));

  const seen = {};
  const rows = [];
  for (let r = CONFIG.HEADER_ROW; r < values.length; r++) {
    const v = values[r].map(x => String(x).trim());
    if (required.some(i => !v[i])) continue;

    // 키 칸이 완전히 같은 행이 여러 개여도 구분되도록 순번을 붙인다.
    const base = keyCols.map(i => v[i]).join('|');
    seen[base] = (seen[base] || 0) + 1;
    rows.push({
      rowNumber: r + 1,
      key: hash_(`${base}#${seen[base]}`),
      fingerprint: hash_(v.join('␟')),
      fields: mailCols.map(({ name, i }) => ({ name, value: v[i] })),
    });
  }
  return { rows, sheet };
}

function sendMail_(sheet, row, subjectPrefix) {
  const get = name => (row.fields.find(f => f.name === name) || {}).value || '';
  const url = `${sheet.getParent().getUrl()}#gid=${sheet.getSheetId()}&range=A${row.rowNumber}`;
  const region = get('지역') ? ` (${get('지역')})` : '';
  const subject = `${subjectPrefix}[도입 문의] ${get('문의처')}${region} - ${get('접수일')}`;

  const tableRows = row.fields.map(f =>
    `<tr><th style="text-align:left;padding:4px 12px 4px 0;white-space:nowrap;vertical-align:top">${escape_(f.name)}</th>` +
    `<td style="padding:4px 0">${escape_(f.value) || '-'}</td></tr>`).join('');
  const htmlBody =
    `<p>'${escape_(CONFIG.SHEET_NAME)}' 탭에 새 문의가 등록되었습니다. (${row.rowNumber}행)</p>` +
    `<table style="border-collapse:collapse;font-size:14px">${tableRows}</table>` +
    `<p><a href="${url}">시트에서 보기</a></p>`;
  const body = row.fields.map(f => `${f.name}: ${f.value || '-'}`).join('\n') + `\n\n시트에서 보기: ${url}`;

  MailApp.sendEmail({
    to: CONFIG.RECIPIENTS,
    subject,
    body,
    htmlBody,
    name: '도입 문의 알림',
  });
}

/** 스크립트 속성 값 크기 제한 때문에 목록을 여러 속성(PREFIX0, PREFIX1, ...)에 나눠 저장한다. */
function loadList_(prefix) {
  const all = PropertiesService.getScriptProperties().getProperties();
  return Object.keys(all).filter(k => k.startsWith(prefix))
    .map(k => all[k]).join(',').split(',').filter(Boolean);
}

function saveList_(prefix, items) {
  const props = PropertiesService.getScriptProperties();
  const chunks = {};
  for (let i = 0; i < items.length; i += ITEMS_PER_CHUNK) {
    chunks[prefix + i / ITEMS_PER_CHUNK] = items.slice(i, i + ITEMS_PER_CHUNK).join(',');
  }
  Object.keys(props.getProperties())
    .filter(k => k.startsWith(prefix) && !(k in chunks))
    .forEach(k => props.deleteProperty(k));
  props.setProperties(chunks);
}

function removeTriggers_() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'checkNewRows')
    .forEach(t => ScriptApp.deleteTrigger(t));
}

function hash_(text) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, text, Utilities.Charset.UTF_8);
  return Utilities.base64EncodeWebSafe(bytes).slice(0, 16);
}

function escape_(text) {
  return String(text)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/\n/g, '<br>');
}
