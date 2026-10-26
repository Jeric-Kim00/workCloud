# Timely Partner Network (검토용)

Timely AI · Timely Router 통합 리셀러/총판 파트너 프로그램 검토 자료입니다.

| 파일 | 내용 |
|---|---|
| [benchmark.md](benchmark.md) | AI 기업과 LLM 라우터 파트너 프로그램 벤치마킹, 설계 시사점, 정책안 |
| [demo/index.html](demo/index.html) | 파트너 프로그램 데모 웹 (한 페이지 안에 아래 네 화면) |

## 데모 화면

게시 주소: https://claude.ai/artifact/3yLjNeRUZbWvRJGR8iTn3b (조직 구성원만 열 수 있음)

| 화면 | 바로가기 | 내용 |
|---|---|---|
| 프로그램 소개 | `#home` | 새 파트너 / 기존 파트너 진입, 판매 제품, 혜택, 등급, 할인율, 참여 절차, FAQ |
| 파트너 신청 | `#apply` | 담당자 정보 → 회사 정보 → 파트너 프로필 → 동의·제출 (OpenAI 파트너 신청서 구성 참고) |
| 파트너 포털 | `#portal` | 승인 전: 심사 상태 안내 / 승인 후: 대시보드, 딜 등록·관리, 리베이트 결과, 교육·자료, 파트너 정보 |
| 관리자 | `#admin` | 개요, 파트너 신청 심사(승인·보류·반려), 파트너 관리(등급 조정), 딜 검토(승인·반려·보호 연장·동일 고객 합산), 리베이트 결정, 결정 기록 |

## 디자인 시스템

조직 기본 디자인 시스템인 [타임리 AI 디자인 시스템](https://claude.ai/artifact/TKYtZQh25DEXJooEKNHjji)을 그대로 씁니다.

- `components/bundle.css`: 토큰, 글자 클래스, Pretendard
- `components/bundle.js`: `window.Timely` React 컴포넌트. Button, Badge, Table, Modal, Tabs, Dropdown, TextInput, Checkbox, RadioButton, LabelContainer, DashboardSidebar를 사용합니다.
- 이 파일들은 게시할 때 디자인 시스템 아티팩트에서 복사합니다. 저장소에는 넣지 않았습니다.

## 데이터와 권한

신청서, 딜, 심사 결과는 아티팩트 공유 저장소(`db`)에 저장됩니다. 그래서 다른 사람이 낸 신청서도 관리자 화면에 바로 나타납니다.

| 경로 | 쓰는 사람 | 보는 사람 |
|---|---|---|
| `applications/<신청자>` | 신청자 본인 | 신청자 본인, 관리자 |
| `deals/<파트너>/items/*` | 파트너 본인 | 파트너 본인, 관리자 |
| `partners/<파트너>` (심사 결과·등급), `…/dealReviews/*`, `…/rebates/*` | 관리자 | 파트너 본인, 관리자 |
| `log/*` (결정 기록: 판단 근거, 정량 지표, 내부 의견) | 관리자 | 관리자 |

- 관리자는 이 페이지의 편집 권한이 있는 사람입니다.
- 파트너는 심사 결과나 딜 승인 상태를 직접 바꿀 수 없습니다.

## 한계

- 공유 저장소를 쓰는 페이지는 **조직 내부 전용**입니다. 외부 회사가 실제로 신청하려면 별도 웹 서비스(서버, DB, 로그인)로 구현해야 합니다.
- 등급·할인율·딜 보호 수치는 [benchmark.md 5장 정책안](benchmark.md)을 따릅니다. 검토 중인 안입니다.
