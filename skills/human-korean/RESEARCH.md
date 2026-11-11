# 한국어 HUMAN 결과물 작성 스킬 조사 및 설계

조사일: 2026-11-11. 공개 GitHub 저장소 10개의 README 또는 SKILL.md 및 일부 참고 파일을 읽고, Reddit·Hacker News·GeekNews 게시물을 교차 확인했다. 검색에 나온 모든 저장소를 검토한 전수조사는 아니다. 아래 평가는 공개 지침의 설계 비교이며 동일 모델로 실행한 성능 순위가 아니다. main 브랜치 내용은 이후 달라질 수 있다.

## 결론

사용자가 정정한 핵심 목표는 “이 스킬을 쓰면 AI 결과물이 조금 더 가독성 좋은 사람 느낌 나는 문장이 된다”이다. 기본 동작은 원문 없는 결과물 작성과 출력 전 문장 점검이다. 업무/일상은 문체 옵션이고 개인 말투 샘플은 필수가 아니다. 기존 글 윤문은 보조 기능이다.

이에 따라 fluent-korean의 명확한 한국어 출력 원칙을 중심에 놓고, humanizer 계열의 반복·상투 표현·번역투 검수와 독자·매체 구분을 작성 과정에 결합한다. 의미 보존 규칙은 내용 품질을 지키는 장치로 사용한다. 이 구성의 효과는 아직 비교 실험으로 검증하지 않았다.

## 후보 비교

| 후보와 읽은 자료 | 가져올 장점 | 그대로 가져오지 않을 부분 |
| --- | --- | --- |
| [blader/humanizer — SKILL](https://github.com/blader/humanizer/blob/main/SKILL.md) | 단어뿐 아니라 빈 대조, 극적인 마무리, 반복 구조를 점검. 글 샘플을 우선하고 의미를 대조 | 영어 중심 규칙과 기본 출력의 초안→진단→최종본 반복. 개인 글에 반응을 더하도록 허용하는 부분은 충실한 윤문에 부적합 |
| [nathankim0/humanize-korean — SKILL](https://github.com/nathankim0/humanize-korean/blob/main/humanize-korean/SKILL.md), [README](https://github.com/nathankim0/humanize-korean) | 사실·조건·확실성·근거 경계 보호. 교정/윤문/문체 전환 구분. 장문 누락 검수 | 짧은 메일에도 작업표와 복잡한 파이프라인을 적용할 필요는 없음. 변경률은 의미 보존의 충분조건이 아님 |
| [hjongc/humanizer-kr — SKILL](https://github.com/hjongc/humanizer-kr/blob/main/skills/humanizer-kr/SKILL.md) | 독자·장르부터 판단. 높임, 구체적인 행동, 따뜻함, 무난하지만 밋밋한 결과까지 점검 | 근거가 약한 원문 주장을 편집자가 약화하는 규칙은 단순 윤문과 분리해야 함 |
| [amondnet/yoonmoon — README](https://github.com/amondnet/yoonmoon), [문체 가이드](https://github.com/amondnet/yoonmoon/blob/main/skills/restyle/references/register-guide.md) | 교정·번역투·윤문·문체 변경의 역할 구분. 종결어미와 어휘·호칭을 함께 조정. 지나친 생략도 교정 | 모든 단계 실행과 매번 상세 진단은 무거움. 한국어의 자연스러운 합니다/해요 혼용까지 일괄 금지할 필요는 없음 |
| [epoko77-ai/im-not-ai — README](https://github.com/epoko77-ai/im-not-ai) | 문제 구간 중심 수정, 장르 유지, 과윤문·숫자 변화 검수. 입력 상태에 따라 작업량 조절 | 많은 패턴과 다단계 실행을 기본으로 쓰지 않음. 30%·50% 변경률 문턱은 문체 전환에 그대로 적용하지 않음 |
| [IsaacEryn/humanizer-ko — SKILL](https://github.com/IsaacEryn/humanizer-ko/blob/main/SKILL.md) | 한국어 이중 피동·번역투와 공문/개조식 예외를 함께 다룸. 확신·서법 보호 | 고정 빈도 문턱과 대시 전면 제거는 편집 취향의 성격도 있음. 글의 작성자를 단정하는 표현은 채택하지 않음 |
| [hannsxpeter/humanizer — SKILL](https://github.com/hannsxpeter/humanizer/blob/main/SKILL.md) | 사용자 말투 샘플, 과교정 복구, 구체적인 경험·감정 보존. 허구의 인물 설정 금지 | 일반적인 윤문에 의견을 넣는 모드를 자동 적용하지 않음. 모든 작업에 문자 위생 검사와 상태 헤더는 불필요 |
| [Aboudjem/humanizer-skill — SKILL](https://github.com/Aboudjem/humanizer-skill/blob/main/skills/humanizer/SKILL.md) | 목적과 목소리를 분리한 선택 구조, 인용·코드·전문용어 보호 | 전문적인 말투에 위트를 기본 장착하거나 직설적인 말투에서 유보를 제거하는 규칙은 한국어 업무용 기본값으로 부적합. 0–100 점수는 품질 증명이 아님 |
| [DaleSeo/korean-skills — README](https://github.com/DaleSeo/korean-skills) | 윤문·문법·문서 일관성을 별도 관점으로 점검. 용어와 표기 통일 | 격식체 균일성을 신호로 삼아 인위적으로 변주하면 업무 문체가 흔들릴 수 있음. 인용한 탐지 연구의 AUC는 이 스킬의 윤문 성능이 아님 |
| [snflkd/fluent-korean — README](https://github.com/snflkd/fluent-korean) | 조사·어미 탈락, 명사 나열, 비유어로 뜻을 흐리는 과도한 압축 방지 | 정정된 목표에 가장 직접적으로 맞는 역할. Claude 전용 설정 자체보다 문장 원칙을 작성 과정에 적용 |

상위 후보끼리도 계보가 겹친다. nathankim0는 epoko77-ai, amondnet, Turtle-Hwan 프로젝트를 기반으로 명시하고, IsaacEryn은 blader를 한국어에 맞게 재설계했다고 설명한다. 같은 원칙이 여러 저장소에 나온다고 독립된 성능 검증이 여러 번 이루어진 것은 아니다.

## 커뮤니티에서 얻은 실용적인 관찰

- [Reddit: 어떤 humanizer가 좋은가](https://www.reddit.com/r/claudeskills/comments/1v8wa5r/whats_the_best_humanizer_skill_out_there/)에는 여러 스킬을 합쳐 자기 용도로 바꾸거나 개인 목소리 프로필을 사용하는 경험담이 있다. 추천 댓글과 실험 결과는 구분해야 한다.
- [Reddit: 인간적인 문체와 웹 카피](https://www.reddit.com/r/claudeskills/comments/1wx0076/whats_your_favorite_skill_for_more_humanlike/)에서는 실제 글 샘플을 사용하고, 참고용 샘플과 평가용 샘플을 분리하자는 구체적인 제안이 나온다. 이를 개인화 검증 방식에 채택했다. 스킬과 기본 출력 설정 중 무엇을 사용할지에 대해서는 의견이 갈린다.
- [Hacker News: 웹 카피를 계속 AI 문체로 되돌리는 문제](https://news.ycombinator.com/item?id=48983839)에는 직접 작성한 문구가 다른 작업 중 반복적으로 재작성된다는 경험담이 있다. 편집 범위와 이미 좋은 문장의 보존을 명시할 이유가 된다.
- [GeekNews: Humanizer 소개](https://news.hada.io/topic?id=26063)는 도구의 초기 소개를 확인하는 데 도움이 됐다. 한국어 윤문 품질의 직접 비교 실험 자료는 아니다. 게시물에 등장하는 탐지 정확도 숫자는 검증 근거로 사용하지 않았다.

## 논문을 인용한 홍보 문구의 해석

[KatFishNet 원 논문 소개](https://aclanthology.org/2025.acl-long.1030/)는 한국어의 띄어쓰기, 품사 다양성, 쉼표 사용을 분석한 탐지 연구다. 소개에 따르면 데이터는 네 LLM과 세 장르를 포함한다. 이것만으로 특정 SKILL.md의 윤문 품질, 모든 한국어 장르의 자연스러움, 쉼표를 줄이는 편집의 효과를 입증하지 않는다. 따라서 이번 초안은 탐지 AUC나 AI 확률을 평가 점수로 가져오지 않는다.

## 이번 초안에 채택한 설계

1. 초안을 요구하지 않고 AI가 새 답변·문서를 작성할 때부터 적용한다.
2. 요청을 충실하게 수행하고 출력 전에 가독성과 자연스러움을 점검한다.
3. 업무/일상은 표현 옵션으로 두고 독자와 매체에 따라 선택한다.
4. 개인 글 샘플은 선택적 확장으로 둔다.
5. 단어 금지보다 문맥, 중복, 추상성, 독자에게 필요한 정보를 본다.
6. 가짜 경험이나 감정을 보태지 않고 익숙한 한국어와 자연스러운 흐름으로 쓴다.
7. 간결하게 쓰면서도 중요한 설명·근거·조건을 충분히 담는다.
8. 완성된 결과물을 바로 출력하고 별도 적용 보고는 하지 않는다.

## 1.0 산출물과 검증 범위

`SKILL.md`, `references/modes.md`, `references/examples.md`는 위 비교를 바탕으로 새로 작성했고, 새 결과물 작성 중심으로 정리해 1.0으로 패키징했다. README와 Codex용 표시 정보, 경계 사례 검토 기록을 포함한다. 외부 실행 스크립트는 포함하지 않았다. 현재 클라우드의 Codex 사용자 스킬 경로에 설치했다. 1.0.1에는 개인 PC와 다른 환경을 위한 설치기를 추가했다. 개인 PC 실행 여부는 별도로 확인해야 한다.

본문과 예시는 직접 작성했다. 향후 외부 파일을 복사해 배포하는 경우에는 해당 저장소의 LICENSE와 THIRD_PARTY_NOTICES를 확인해야 한다.

지침의 경계 사례를 자체 검토하고 패키지 구조를 검사했다. 별도 모델 실행으로 효과를 비교하지는 않았다. 후속 품질 평가는 원문과 개인 말투 샘플 없이 같은 작성 요청을 스킬 적용 전후로 수행해 비교한다. 정확성과 충분함을 유지하면서 읽기 편하고 자연스러워지는지가 기준이다. 상세 기록은 `evals/review.md`에 있다.
