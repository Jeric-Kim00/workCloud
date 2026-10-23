// 파트너 포털과 본사 관리자 화면이 함께 쓰는 데모 데이터와 정책 계산.
// 데이터는 브라우저 localStorage에만 저장된다.
var TPN = (function () {
  var DEALS_KEY = 'timely-partner-demo-v2-deals';
  var LOG_KEY = 'timely-partner-demo-v2-log';
  var PARTNER = '데모리셀러(주)';

  var SAMPLE_DEALS = [
    { id: 'D-1001', customer: '미래금융', segment: '기업 (B2B2C)', ai: 260000000, router: 50000000, close: '2026-06', stage: '계약 완료', status: '승인', approvedAt: '2026-02-10', extended: true, merge: '개별', mergeWith: null },
    { id: 'D-1002', customer: '스타트커머스', segment: '기업 (B2B2C)', ai: 0, router: 48000000, close: '2026-09', stage: '계약 완료', status: '승인', approvedAt: '2026-05-02', extended: false, merge: '개별', mergeWith: null },
    { id: 'D-1003', customer: '한빛제조', segment: '기업 (B2B2C)', ai: 120000000, router: 0, close: '2026-11', stage: '협상', status: '승인', approvedAt: '2026-09-01', extended: false, merge: '개별', mergeWith: null },
    { id: 'D-1004', customer: '한빛제조', segment: '기업 (B2B2C)', ai: 90000000, router: 0, close: '2026-12', stage: '제안', status: '검토 중', approvedAt: null, extended: false, merge: '검토 전', mergeWith: null },
    { id: 'D-1005', customer: '○○시청', segment: '공공기관 (B2G2C)', ai: 250000000, router: 0, close: '2027-02', stage: '제안', status: '검토 중', approvedAt: null, extended: false, merge: '검토 전', mergeWith: null }
  ];
  var SAMPLE_LOG = [
    { id: 'L-1', type: 'rebate', at: '2026-07-05', by: '김파트너 (파트너팀)', partner: PARTNER, period: '2026 상반기',
      metrics: { sales: 358000000, closedDeals: 2 },
      qualitative: '공동 영업 적극 참여, 금융권 레퍼런스 확보. 고객 만족도 양호.',
      decision: '지급', amount: 5000000, publicNote: '상반기 금융권 레퍼런스 확보 기여' }
  ];

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return JSON.parse(JSON.stringify(fallback));
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  // Timely AI 계약금액 기준 할인율. 10억 원 이상은 별도 협의(null).
  function discountRate(amount) {
    if (amount >= 1000000000) return null;
    if (amount >= 500000000) return 0.15;
    if (amount >= 200000000) return 0.12;
    if (amount >= 50000000) return 0.08;
    return 0.05;
  }

  function root(deals, d) {
    var seen = {};
    while (d && d.merge === '합산' && d.mergeWith && !seen[d.id]) {
      seen[d.id] = true;
      var next = deals.filter(function (x) { return x.id === d.mergeWith; })[0];
      if (!next) break;
      d = next;
    }
    return d;
  }
  // 본사가 '합산'으로 판단한 딜끼리 Timely AI 금액을 합쳐 할인 구간을 정한다.
  function bandBase(deals, d) {
    var r = root(deals, d);
    return deals.filter(function (x) { return root(deals, x).id === r.id; })
      .reduce(function (a, x) { return a + Number(x.ai || 0); }, 0);
  }
  function aiRate(deals, d) {
    if (!d.ai) return undefined;
    return discountRate(bandBase(deals, d));
  }
  function rateLabel(deals, d) {
    var r = aiRate(deals, d);
    if (r === undefined) return '-';
    return r === null ? '별도 협의' : Math.round(r * 100) + '%';
  }

  function addDays(iso, days) {
    var t = new Date(iso + 'T00:00:00');
    t.setDate(t.getDate() + days);
    return t.toISOString().slice(0, 10);
  }
  function protectionEnd(d) {
    if (!d.approvedAt) return null;
    return addDays(d.approvedAt, d.extended ? 180 : 90);
  }

  function won(n) {
    n = Number(n) || 0;
    if (n >= 100000000) return (n / 100000000).toFixed(2).replace(/\.?0+$/, '') + '억 원';
    return Math.round(n / 10000).toLocaleString('ko-KR') + '만 원';
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function today() { return new Date().toISOString().slice(0, 10); }
  function product(d) {
    return [d.ai ? 'Timely AI' : '', d.router ? 'Timely Router' : ''].filter(Boolean).join(' + ');
  }

  return {
    PARTNER: PARTNER,
    loadDeals: function () { return read(DEALS_KEY, SAMPLE_DEALS); },
    saveDeals: function (v) { write(DEALS_KEY, v); },
    loadLog: function () { return read(LOG_KEY, SAMPLE_LOG); },
    saveLog: function (v) { write(LOG_KEY, v); },
    reset: function () { write(DEALS_KEY, SAMPLE_DEALS); write(LOG_KEY, SAMPLE_LOG); },
    discountRate: discountRate, aiRate: aiRate, rateLabel: rateLabel, bandBase: bandBase,
    protectionEnd: protectionEnd, won: won, esc: esc, today: today, product: product
  };
})();
