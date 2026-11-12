# HUMAN 1.0.1

**이 스킬을 적용하면 AI 결과물이 조금 더 읽기 편하고 사람이 쓴 듯 자연스러운 한국어 문장이 되도록 합니다.**

평소처럼 메일, 보고서, 설명, 메시지 작성을 요청하면 됩니다. 원문이나 개인 글 샘플은 필요하지 않습니다. 작성 과정에서 번역투·상투어·반복을 줄이고, 출력 전에 문장의 흐름과 필요한 정보가 빠지지 않았는지 확인합니다. 기존 글을 다듬는 데에도 사용할 수 있습니다.

## 사용 방법

설치 후 새 Codex 세션에서 작업 요청에 `$human-korean`을 붙입니다.

```text
$human-korean 이 내용을 팀장에게 보고할 메일로 써줘: …
```

```text
$human-korean 데이터베이스 인덱스를 처음 배우는 사람에게 설명해줘.
```

```text
$human-korean 오늘 이사 도와준 친구한테 고맙다고 짧게 써줘.
```

```text
$human-korean 이 보고서를 업무용 문체로 다듬어줘: …
```

업무용·일상용을 지정할 수 있고 생략하면 요청의 맥락에 맞춥니다. 자동 호출 여부는 사용하는 도구에 따라 달라지므로, 적용하려는 작업에서 스킬 이름을 지정하면 명확합니다.

| 상황 | 작성 방향 |
| --- | --- |
| 업무 메일·안내 | 용건과 요청을 명확하게 전달하고 정중함 유지 |
| 보고서·제안서 | 근거와 조건을 구별하고 필요한 수치·표·구조 유지 |
| 일상 메시지 | 상대와의 관계에 맞는 말투와 자연스러운 호흡 |
| 일반 설명 | 익숙한 말로 설명하되 필요한 깊이와 예외 포함 |

문장을 자연스럽게 만드는 과정에서도 사실·수치·조건·불확실성은 유지합니다. 개인 말투 재현은 선택 기능입니다.

## 설치

현재 제공하는 설치기는 **Codex 사용자 범위**에 스킬을 설치합니다. 같은 PC에서 동일한 사용자와 `CODEX_HOME`을 사용하는 Codex 프로젝트에 적용되며 관리자 권한은 필요하지 않습니다.

PC와 클라우드는 별개의 실행 환경입니다. 한쪽에 설치해도 다른 쪽으로 자동 복사되지 않습니다. 새 클라우드 환경에서는 사용자 스킬 경로가 보존되어 있는지 확인하고 필요하면 다시 설치하세요.

### 1. 저장소 내려받기

저장소는 비공개이므로 접근 가능한 GitHub 계정이 필요합니다. Git과 GitHub CLI(`gh`)를 사용할 수 있는 터미널에서 실행합니다. 아직 로그인하지 않았다면 먼저 `gh auth login`을 실행하세요.

```bash
gh repo clone Jeric-Kim00/workCloud workCloud-human -- --branch main
cd workCloud-human/skills/human-korean
```

이미 `workCloud-human` 폴더가 있다면 기존 저장소를 업데이트하거나 다른 빈 경로에 내려받으세요. GitHub 웹에서 로그인한 뒤 **Code → Download ZIP**으로 받아도 됩니다. 이 경우 압축을 푼 저장소의 `skills/human-korean` 폴더에서 다음 단계를 진행합니다.

### 2. 현재 환경에 설치

**Windows 개인 PC — PowerShell**

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\install.ps1
```

Python 설치 없이 실행할 수 있습니다. 실행 정책 옵션은 이 PowerShell 프로세스에만 적용되며 시스템 정책은 변경하지 않습니다.

**클라우드·Linux·macOS — Python 3**

```bash
python3 install.py
```

Python 표준 라이브러리만 사용하므로 추가 패키지는 필요하지 않습니다.

| 환경 | 기본 설치 위치 |
| --- | --- |
| Windows | `%USERPROFILE%\.codex\skills\human-korean` |
| 클라우드·Linux·macOS | `~/.codex/skills/human-korean` |
| `CODEX_HOME` 지정 시 | 해당 경로 아래 `skills/human-korean` |

설치기는 기존 파일과 같으면 변경하지 않습니다. 내용이 다르면 이전 설치를 `skills` 폴더와 같은 상위 경로의 `skill-backups`에 백업한 뒤 교체하고, 활성화 과정이 실패하면 이전 설치를 복구합니다.

### 3. 사용 확인

설치기가 `Installed:` 또는 `Already installed:`와 설치 경로를 출력하면 파일 배치가 끝난 것입니다. 같은 환경에서 새 Codex 세션을 열고 아래 요청으로 호출하세요.

```text
$human-korean 캐시가 무엇인지 쉽게 설명해줘.
```

스킬을 찾지 못하면 설치 출력에 표시된 경로에 `SKILL.md`가 있는지, 현재 Codex가 같은 사용자와 `CODEX_HOME`을 사용하는지 확인하세요. 파일 배치 성공과 실행 중인 앱의 스킬 인식은 별도로 확인해야 합니다.

### Codex에 설치를 맡기기

설치하려는 PC나 클라우드의 Codex 채팅에서 다음과 같이 요청할 수 있습니다. 해당 환경에서 파일과 명령을 실행할 수 있어야 합니다.

```text
Jeric-Kim00/workCloud 저장소의 main 브랜치에 있는
skills/human-korean 스킬을 현재 실행 환경의 Codex 사용자 범위에 설치해줘.
기존 설치가 있으면 백업하고, 설치 후 스킬이 인식되는지 확인해줘.
```

## 업데이트

내려받은 저장소의 최상위 폴더에서 최신 `main`을 받은 뒤 설치기를 다시 실행합니다. 직접 수정한 파일이 있다면 먼저 보존하세요.

```bash
git pull --ff-only origin main
cd skills/human-korean
```

Windows에서는 `install.ps1`, 클라우드·Linux·macOS에서는 `python3 install.py`를 위와 같이 실행합니다. 설치된 스킬을 직접 고친 내용은 업데이트 전에 백업되지만 새 버전에 자동 병합되지는 않습니다.

## 파일 구성

| 파일 | 역할 |
| --- | --- |
| [SKILL.md](SKILL.md) | 작성 원칙과 출력 전 점검 |
| [references/modes.md](references/modes.md) | 상황별 말투 조정 |
| [references/examples.md](references/examples.md) | 새 글 작성과 기존 글 윤문 예시 |
| [agents/openai.yaml](agents/openai.yaml) | Codex 표시 이름과 기본 호출 문구 |
| [install.ps1](install.ps1) / [install.py](install.py) | 사용자 범위 설치기 |
| [tests/test_install.py](tests/test_install.py) | 설치·백업·복구 검사 |
| [RESEARCH.md](RESEARCH.md) | 비교 자료와 설계 근거 |
| [evals/review.md](evals/review.md) | 검토 기록과 평가 범위 |

글을 생성할 때 별도 API나 실행 스크립트는 필요하지 않습니다. 생성은 사용하는 AI 모델이 수행합니다. 다른 도구에서는 `SKILL.md`의 작성 지침을 활용할 수 있지만, 포함된 설치기는 Codex용입니다.

## 검증 범위

- 스킬 YAML, 파일 참조, 배포 ZIP의 무결성을 확인했습니다.
- Python 설치기의 신규 설치, 재설치, 백업, 불완전 패키지 거부, 실패 복구 테스트 5개를 통과했습니다.
- 글쓰기 지침과 경계 사례는 자체 검토했습니다.
- Windows 설치기의 실제 실행과 별도 모델의 적용 전후 A/B 비교, 사용자 선호 검증은 아직 확인하지 않았습니다.

설치기 테스트는 `skills/human-korean` 폴더에서 실행할 수 있습니다.

```bash
python3 -m unittest discover -s tests -v
```

## 출처

공개 자료에서 얻은 설계 아이디어를 바탕으로 스킬 본문, 예시와 설치기를 새로 작성했습니다. 외부 저장소의 코드나 실행 파일을 복사해 포함하지 않았습니다. 비교한 자료는 [RESEARCH.md](RESEARCH.md)에 정리했습니다.
