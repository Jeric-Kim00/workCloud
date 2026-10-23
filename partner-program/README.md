# Timely Partner Network (검토용)

Timely AI · Timely Router 통합 리셀러/총판 파트너 프로그램 검토 자료입니다.

| 파일 | 내용 |
|---|---|
| [benchmark.md](benchmark.md) | AI 기업 및 LLM 라우터 파트너 프로그램 벤치마킹, 설계 시사점, 결정 필요 항목 |
| [demo/index.html](demo/index.html) | 파트너 모집 랜딩 페이지 데모 (소개, 혜택, 등급, 전문 영역, 절차, 신청 폼, FAQ) |
| [demo/portal.html](demo/portal.html) | 파트너 포털 데모 (대시보드, 딜 등록·관리, 리베이트 결과, 교육·인증, 자료실, 파트너 정보) |
| [demo/admin.html](demo/admin.html) | 본사 내부 관리자 데모 (딜 승인·보호 연장, 동일 고객 합산 판단, 리베이트 결정, 결정 기록) |
| [demo/data.js](demo/data.js) | 포털과 관리자 화면이 함께 쓰는 데모 데이터와 할인·보호 기간 계산 |

## 데모 실행

빌드 없이 정적 파일만으로 동작합니다.

```bash
cd partner-program/demo
python3 -m http.server 8000
# http://localhost:8000 접속
```

브라우저에서 `demo/index.html`을 직접 열어도 됩니다. 관리자 화면에서 처리한 내용이 파트너 포털에 반영되는지 보려면 같은 브라우저에서 `portal.html`과 `admin.html`을 함께 열어 보세요. 로컬 서버(위 방법)로 여는 것이 가장 확실합니다.

## 주의

- 데모의 등급·할인율·딜 보호 수치는 [benchmark.md 5장 정책안](benchmark.md#5-정책안-2026-10-23-검토-반영)을 따릅니다. 검토 중인 안이며 최종 확정된 정책은 아닙니다.
- 신청 폼과 로그인은 가짜입니다. 데이터는 어디로도 전송되지 않습니다. 포털에서 등록한 딜은 해당 브라우저의 localStorage에만 저장됩니다.
- 벤치마킹 자료 중 상당수는 2차 출처에 기반합니다. 정책에 반영하기 전에 각 사의 공식 페이지에서 다시 확인해야 합니다.
