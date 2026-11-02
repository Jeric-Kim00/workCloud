# 작업 인계 — Router 본문 6장 덱 (클라우드 세션 → 로컬)

## 지금까지 한 일
- Lift Deck 스킬(Upstage 디자인 시스템)로 Purple 테마 HTML 덱을 만들었습니다.
- 원본: GPT가 만든 `Timely_Router_Upstage_SK_review.html` (7장, SK 자회사 대상 Router 사용 방법과 할인 안내)
- 결과: 표지를 뺀 본문 6장입니다. 사용자가 Upstage 전체 장표에 끼워 넣을 예정입니다.
  - `deck.html`: 작업 원본 / `deck.purple.html`: 빌드 결과 / `notes.md`: 발표자 노트(내부 보관용)
- 사용자 결정 사항
  - 검토용 문구("검토본", "적용 조건 확인 중", "SK 적용 승인 확인 필요")는 모두 뺍니다.
  - 할인율은 미확정입니다. 기본 할인과 추가 할인 모두 "별도 협의"로 적습니다(5%는 덱에서 뺐습니다).
  - 발표자 노트는 덱에서 빼고 notes.md로 보관합니다.

## 다음 할 일
1. 로그인된 크롬에서 https://timelyrouter.ai/spaces/9ad17f19-a582-4bfe-8d37-e48bba9c459f/projects 를 열고 아래 화면을 캡처합니다.
   ① 프로젝트 목록 ② 우측 상단 프로젝트 메뉴 ③ 팀 프로젝트 만들기 ④ API Key 생성
   - API Key 원문, 계정 이메일, 고객사 이름은 가립니다.
   - `decks/timely-router-sk/screens/01.png` ~ `04.png`로 저장합니다.
2. 덱에 넣습니다. 콘솔 접속 장과 프로젝트와 API Key 준비 장을 `.split` + `.screen-panel` 구조로 바꿔, 왼쪽에 단계 설명을 두고 오른쪽에 캡처를 둡니다. 캡처의 색과 비율은 바꾸지 않습니다.
   - 장 수가 바뀌는 경우(예: 콘솔 접속 A/B를 두 장으로 나누기)에는 사용자에게 먼저 확인합니다.
3. 빌드와 검사를 합니다. Lift Deck 스킬의 deck kit 스크립트를 씁니다.
   - `python3 <deck-root>/scripts/build.py decks/timely-router-sk/deck.html --theme purple`
   - `python3 <deck-root>/scripts/audit.py decks/timely-router-sk/deck.purple.html` (렌더 검사 포함)
   - 컨택트시트를 직접 보고 확인합니다.
4. 커밋하고 `claude/upbeat-planck-br7ecf` 브랜치에 푸시합니다.

## 규칙
- Lift Deck 스킬 문서(decks.md, layouts.md, brand-rules.md, writing.md)를 따릅니다.
- 인라인 style, hex 색 직접 지정, 로고 직접 그리기는 하지 않습니다.
- 확인되지 않은 사실, 수치, 할인 조건은 추가하지 않습니다.
- 사용자 요청이 불명확하면 추론하지 말고 먼저 질문합니다.
