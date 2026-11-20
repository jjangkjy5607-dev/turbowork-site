// 파이프라인 모션 그래픽 v3: CSS 3D "제품 필름" 무대 (외부 라이브러리 없음, three.js 안 씀).
// 원근 와이어프레임 바닥 위 빛나는 길을 따라 Step 카드(두께 있는 유리 카드)가 정거장
// (실행기·Claude Code·기계 검사·GPT 규약 검수·GPT 최종 검수·사람 확인·커밋, 뒤쪽에 실패 랙)을 지나간다.
// 장면마다 카메라 샷(전경 → 밀어 들어가기 → 다음 정거장으로 휘돌기 → 커밋에서 물러나기), 짧은 자막 타이틀,
// HUD(타임코드·카메라 좌표·단계 번호), 지시선 설명, 데이터 패킷, PASS 불꽃, FAIL 글리치.
// 정거장에 닿으면 그 정거장의 앱 창 하나만 솟아올라 장면을 보여 주고 다시 접힌다.
// 매 프레임 시각 t에서 상태를 처음부터 계산하고 transform/opacity만 바꾼다(타임코드 글자만 0.1초마다 갱신).
// 진행 숫자는 설명용 예시 값이며 실제 통계가 아니다. 실제 회사 로고·브랜드 색은 쓰지 않는다.
(() => {
  "use strict";

  const TXT = {
    en: {
      aria: "3D animated demo: a Step card travels a glowing track through the Runner, the LLM session (Claude Code), machine checks and two audit LLMs (Rule, Final; GPT from a different vendor). Blockers make it FAIL: the notes go to Failure RAG and the card returns with higher Effort. Non-blockers go to Known issues and the Step moves on; a Defect analyst links them to a later Step, and a milestone Final audit (full) clears them in one patch.",
      st: { runner: "Runner", claude: "LLM Session", checks: "Machine checks", rule: "Audit LLM · Rule", final: "Audit LLM · Final",
        rack: "Failure RAG", gate: "Human gate", commit: "Commit", known: "Known issues", analyst: "Defect analyst" },
      stsub: { claude: "Claude Code", rule: "GPT · different vendor", final: "GPT · different vendor" },
      sub: { runner: "dispatch · relay · retry", claude: "one step per session", checks: "lint · size · complexity", rule: "auditor · written rules",
        final: "auditor · independent", rack: "read by the next session", gate: "Playtest approval", commit: "audited tree only",
        known: "non-blocker defects", analyst: "subagent · groups & assigns" },
      win: { runner: "Runner", claude: "LLM Session · Claude Code", checks: "Machine checks", rule: "Audit LLM · Rule (GPT)", final: "Audit LLM · Final (GPT)",
        rack: "Failure RAG", commit: "Commit · git log" },
      titles: { write: "Writing code", check: "Automatic checks",
        audit: "Sent to Final audit", fail: "3 Blockers found", ship: "Passed — Commit", human: "Human gate",
        known: "Blocker 0 · Known issue 1", milestone: "Final audit (full)" },
      rag: { title: "Vector DB · RAG server", sF: ["Failure RAG", "failure records"], sS: ["Skill RAG", "success patterns"], dim: "dim 1,536 · cosine", sub: "Failure RAG · Skill RAG: keeps records, brings them back for the next task", rate: "First-try pass rate", ex: "example",
        dF: "Failure RAG", dFs: "lessons from failures", dS: "Skill RAG", dSs: "patterns that passed", load3: "RAG: loaded 3 related records", load2: "RAG: loaded 2 related records",
        key: "Key — what to look for", keyL: ["tags: empty input · boundary", "step: Step 4 · order parsing", "similarity: 0.82"],
        val: "Value — what comes back", valL: ["F-031 · write boundary tests first", "Skill · input validation pattern", "F-044 · error message format"],
        pin: "F-055 · empty input · boundary test added", bld: "Skill · empty-input guard pattern" },
      effort: "Effort", progress: "Done", demo: "Illustrative demo values — not real statistics",
      r0: "$ harness run --project demo", r1: "Steps 1–3 committed", r2: "Step 4 · session start (Effort low)",
      rq: "audit_request.json → GPT Final audit", r3: "verdict FAIL → retry 1/3 (Effort medium)",
      c1: "> Step 4 · build to the locked spec", c7: "> New session · Failure RAG: 3 Blockers to fix", c8: "> Step 5 · build to the locked spec",
      cReq: "audit_request.json written",
      k0: "$ hooks on save", k1: "lint", k2: "file size ≤ 200 lines", k3: "complexity ≤ 5", k4: "all checks passed",
      u4: "Rule check: Step 4 (diff + tests)", ruleOk: "No rule violations found.",
      f0: "Review Step 4 (diff + test log)", f0b: "Review Step 4 again", f5: "Review Step 5 (diff + test log)",
      f1: "Blockers 3 · Known issues 0", d1: "empty input crashes parse_order", d2: "spec: currency field ignored",
      d3: "no test for 1-item orders", f2: "All 3 Blockers fixed. None new.", f3: "Blocker 0 · Known issue 1",
      f5k: "HUD numbers 1px off", f5v: "VERDICT: PASS → next Step", vf: "VERDICT: FAIL (Blocker 3)",
      eg: { title: "Effort", lv: ["low", "medium", "high"], note: "retry 1/3 · new session" },
      an: { title: "Defect analyst · subagent", l1: "2 issues touch hud.py", l2: "→ fix together in Step 7" },
      ghost: { t: "Step 7", s: "queued" },
      ms: { m0: "Milestone 1 · full audit of Steps 1–5", m1: "Known issues 1 → one consolidated patch", m2: "VERDICT: PASS · Known issues 0" },
      rackHead: "# read by the next session", rk4: "#4  Step 1 · off-by-one → boundary test",
      rk5: "#5  Step 2 · null input → guard test", rk6: "#6  Step 4 · 3 Blockers → 3 new tests",
      gitHead: "$ git log --oneline", g2: "9d07b13  Step 2: load config [PASS]",
      g3: "c41e0a2  Step 3: export csv [PASS]", g4: "a1f3c9e  Step 4: parse orders [PASS]", g5: "7b2d04f  Step 5: HUD screen [PASS]",
      pk: { req: "audit request · 1.1 KB", call: "diff 2.4 KB + test log", note: "fail note · 3 Blockers", vFail: "verdict · FAIL", vPass: "verdict · PASS",
        known: "Known issue · minor", group: "Known issues 3", assign: "2 → Step 7", sweep: "Known issues 1", patch: "consolidated patch",
        reqI: "audit_request.json · Step 4 · 1.1 KB", callI: "audit_request.json · Step 4 · diff + test log",
        vFailI: "Blocker 3 → retry 1/3 · Effort up", vPassI: "Blocker 0 → Commit", spec: "step04.md · spec",
        r0: "2 notes", r1: "2 differences", r2: "part check ✓ → merge", r3: "re-check ✓", r4: "part fix ✓ → merge", r5: "0 notes", r6: "0 differences" },
      sa: { main: "Main", tag: "Sub-LLM", n: [["reviewer", "reads the diff → ≤3 notes", "2 notes"], ["comparer", "compares with reference image/clip", "2 differences"],
        ["worker", "builds one part · 3D effect", "part check ✓"]], skill: ["skill · m2-harness", "skill · m1-review"], hook: "hook · lint ✓ size ✓",
        tk: { fix: ["re-reads the patch", "", "fixes one part"], s5: ["reads the diff → ≤3 notes", "compares with reference clip", ""] },
        rt: { fix: ["re-check ✓", "", "part check ✓"], s5: ["0 notes", "0 differences", ""] } },
      phone: { t1: "Playtest ready", t2: "Step 5 — approve?", ap: "Approve", later: "Later", ok: "Approved ✓" },
      stamp: "COMMIT ✓",
      cap: {
        ff: "Steps 1–3 go by quickly; let's look at Step 4.",
        rag: "Before the LLM session starts, three related records are pulled from Failure RAG and Skill RAG.",
        rag2: "Step 5 also starts by pulling two related records.",
        fixsub: "In the fix session the Sub-LLMs work again: reviewer re-reads the patch, worker fixes one part.",
        fastsub: "Step 5 uses two Sub-LLMs (reviewer · comparer); they only return notes.",
        rsign: "The RAG server keeps Failure RAG and Skill RAG records and finds similar ones before each task.",
        ragfail: "This failure is added to Failure RAG: a new data block rises from the ground.",
        ragskill: "The fix that passed is stored in Skill RAG as a new data block.",
        dispatch: "The Runner opens a new LLM session (Main · Claude Code) and hands it the Step 4 spec.",
        skill: "The LLM session loads the skill this Step needs (m2-harness).",
        claude: "The LLM session writes the code; on every save a hook checks lint and size.",
        sub: "The Main LLM session spawns three Sub-LLMs to split the work: reviewer · comparer · worker.",
        subret: "Results return to the Main session. Sub-LLMs never decide PASS/FAIL; that stays with the Runner and the audit LLMs.",
        skill2: "For the audit stage it loads the review skill (m1-review).",
        checks: "Every save is checked automatically: lint, file size, complexity.",
        rule: "Rule audit: an LLM from a different vendor (GPT) compares the change with the written rules.",
        request: "The LLM session doesn't grade its own work. It leaves an audit request, and the Runner sends it to the Final audit LLM.",
        fail: "Final audit sorts findings into Blockers and the rest. 3 Blockers, all reported at once.",
        rack: "The Blockers go into Failure RAG so the next session can read them.",
        retry: "The FAIL verdict goes back to the Runner.",
        effort: "The Runner raises Effort one level (low → medium) and opens a new session.",
        fix: "The new session reads Failure RAG and fixes all 3 Blockers in one patch.",
        recheck: "The same checks run again, then the Runner asks for another Final audit.",
        pass: "The second Final audit passes.",
        commit: "Only audited code is committed. Step 4 is done.",
        next: "Step 5 starts in another new session.",
        fast: "Step 5 passes every check on the first try.",
        known: "Blocker 0, one minor issue: it goes to Known issues and the Step moves on.",
        analyst: "The Defect analyst (a subagent) groups Known issues and links two to Step 7, which edits the same file.",
        gate: "This Step needs a Playtest, so it waits at the Human gate.",
        gateok: "Approved and committed.",
        milestone: "At each milestone, Final audit (full) sweeps the remaining Known issues into one consolidated patch.",
        loop: "Back to Step 4.",
      },
      pause: "Pause", play: "Play", replay: "Replay",
      pauseA: "Pause animation", playA: "Play animation", replayA: "Replay animation from the start",
      staticNote: "Reduced motion is on — showing a static frame (Final audit returns FAIL with all Blockers).",
      seekA: "Playback position", chapH: "Chapters",
      chap: { ff: "Runner hands out the Step", skill: "Writing code · RAG lookup", sub: "Sub-agents help out", checks: "Machine checks · Rule audit",
        request: "Sent to Final audit", fail: "FAIL · 3 Blockers", retry: "Retry with higher Effort", pass: "PASS → Commit",
        next: "Next Step, fast pass", known: "Known issues", gate: "Human gate", milestone: "Milestone · full audit" },
    },
    ko: {
      aria: "3D 애니메이션 데모: Step 카드가 빛나는 길을 따라 Runner, LLM 세션(Claude Code), 기계 검사, Audit LLM(Rule·Final, GPT · 다른 회사 모델)을 지난다. Blocker가 있으면 FAIL: 기록은 Failure RAG로 가고 Effort를 올려 되돌아간다. Blocker가 아닌 결함은 Known issues에 쌓이고 Step은 계속되며, Defect analyst가 뒤 Step에 연결하고 마일스톤의 Final audit (full)이 한 패치로 정리한다.",
      st: { runner: "Runner", claude: "LLM Session", checks: "기계 검사", rule: "Audit LLM · Rule", final: "Audit LLM · Final",
        rack: "Failure RAG", gate: "Human gate", commit: "Commit", known: "Known issues", analyst: "Defect analyst" },
      stsub: { claude: "Claude Code", rule: "GPT · 다른 회사 모델", final: "GPT · 다른 회사 모델" },
      sub: { runner: "배정 · 중계 · 재시도", claude: "세션 하나에 Step 하나", checks: "린트 · 크기 · 복잡도", rule: "검수관 · 적어 둔 규칙",
        final: "검수관 · 독립 검수", rack: "다음 세션이 읽는 기록", gate: "Playtest 승인", commit: "검수한 트리 그대로",
        known: "Blocker 아닌 결함", analyst: "subagent · 묶어서 배정" },
      win: { runner: "Runner", claude: "LLM Session · Claude Code", checks: "기계 검사", rule: "Audit LLM · Rule (GPT)", final: "Audit LLM · Final (GPT)",
        rack: "Failure RAG", commit: "Commit · git log" },
      titles: { write: "코드 작성", check: "자동 검사",
        audit: "Final audit에 검수 요청", fail: "Blocker 3건 발견", ship: "통과 — Commit", human: "Human gate",
        known: "Blocker 0 · Known issue 1", milestone: "Final audit (full)" },
      rag: { title: "Vector DB · RAG 서버", sF: ["Failure RAG", "실패 기록"], sS: ["Skill RAG", "성공 패턴"], dim: "dim 1,536 · cosine", sub: "Failure RAG·Skill RAG 기록을 쌓아 다음 작업에 불러옵니다", rate: "첫 시도 통과율", ex: "예시 값",
        dF: "Failure RAG", dFs: "실패에서 배운 기록", dS: "Skill RAG", dSs: "통과한 방법", load3: "RAG: 관련 기록 3건 불러옴", load2: "RAG: 관련 기록 2건 불러옴",
        key: "키 — 찾는 조건", keyL: ["태그: 빈 입력 · 경계값", "단계: Step 4 · 주문 파싱", "가까운 정도: 0.82"],
        val: "값 — 불러온 내용", valL: ["F-031 · 경계 시험 먼저 쓰기", "Skill · 입력 검증 패턴", "F-044 · 오류 문구 형식"],
        pin: "F-055 · 빈 입력 처리 · 경계 시험 추가", bld: "Skill · 빈 입력 방어 패턴" },
      effort: "Effort", progress: "완료", demo: "예시 값(데모) — 실제 통계가 아님",
      r0: "$ harness run --project demo", r1: "Step 1~3 커밋 완료", r2: "Step 4 · 세션 시작 (Effort low)",
      rq: "audit_request.json → GPT Final audit 호출", r3: "판정 FAIL → 재시도 1/3 (Effort medium)",
      c1: "> Step 4 · 잠긴 명세대로 구현", c7: "> 새 세션 · Failure RAG: 고칠 Blocker 3건", c8: "> Step 5 · 잠긴 명세대로 구현",
      cReq: "audit_request.json 작성",
      k0: "$ 저장 훅 실행", k1: "린트", k2: "파일 크기 ≤ 200줄", k3: "복잡도 ≤ 5", k4: "모든 검사 통과",
      u4: "Rule audit: Step 4 (diff + 테스트)", ruleOk: "규칙 위반 없음.",
      f0: "Step 4 검수 요청 (diff + 테스트 로그)", f0b: "Step 4 재검수 요청", f5: "Step 5 검수 요청 (diff + 테스트 로그)",
      f1: "Blocker 3 · Known issue 0", d1: "빈 입력에서 parse_order 오류", d2: "명세의 통화 필드 무시",
      d3: "1개짜리 주문 테스트 없음", f2: "Blocker 3건 모두 수정됨. 새 Blocker 없음.", f3: "Blocker 0 · Known issue 1",
      f5k: "HUD 숫자 1px 어긋남", f5v: "VERDICT: PASS → 다음 Step으로", vf: "VERDICT: FAIL (Blocker 3)",
      eg: { title: "Effort", lv: ["low", "medium", "high"], note: "재시도 1/3 · 같은 Step, 새 세션" },
      an: { title: "Defect analyst · subagent", l1: "2건 모두 hud.py 관련", l2: "→ Step 7에서 같은 파일 수정 때 함께 해결" },
      ghost: { t: "Step 7", s: "대기 중" },
      ms: { m0: "Milestone 1 · Step 1~5 전체 검수", m1: "Known issues 1건 → 한 패치로 정리", m2: "VERDICT: PASS · Known issues 0" },
      rackHead: "# 다음 세션이 읽는다", rk4: "#4  Step 1 · 경계 오류 → 경계 시험",
      rk5: "#5  Step 2 · 빈 값 → 방어 시험", rk6: "#6  Step 4 · Blocker 3건 → 새 시험 3개",
      gitHead: "$ git log --oneline", g2: "9d07b13  Step 2: 설정 읽기 [PASS]",
      g3: "c41e0a2  Step 3: CSV 내보내기 [PASS]", g4: "a1f3c9e  Step 4: 주문 파싱 [PASS]", g5: "7b2d04f  Step 5: HUD 화면 [PASS]",
      pk: { req: "검수 요청 · 1.1 KB", call: "diff 2.4 KB + 테스트 로그", note: "Failure RAG · Blocker 3건", vFail: "판정 · FAIL", vPass: "판정 · PASS",
        known: "Known issue · minor", group: "Known issues 3건", assign: "2건 → Step 7", sweep: "Known issues 1건", patch: "통합 patch",
        reqI: "audit_request.json · Step 4 · 1.1 KB", callI: "audit_request.json · Step 4 · diff + 테스트 로그",
        vFailI: "Blocker 3 → 재시도 1/3 · Effort 올림", vPassI: "Blocker 0 → Commit", spec: "step04.md · 명세",
        r0: "메모 2건", r1: "차이 2곳", r2: "part check ✓ → merge", r3: "re-check ✓", r4: "part fix ✓ → merge", r5: "메모 0건", r6: "차이 0곳" },
      sa: { main: "Main", tag: "Sub-LLM", n: [["reviewer", "diff 읽기 → 메모 ≤3", "메모 2건"], ["comparer", "참조 이미지·클립과 비교", "차이 2곳"],
        ["worker", "부품 1개 제작 · 3D 효과", "part check ✓"]], skill: ["skill · m2-harness", "skill · m1-review"], hook: "hook · lint ✓ size ✓",
        tk: { fix: ["패치 다시 읽기", "", "부품 1개 수정"], s5: ["diff 읽기 → 메모 ≤3", "참조 클립과 비교", ""] },
        rt: { fix: ["re-check ✓", "", "part check ✓"], s5: ["메모 0건", "차이 0곳", ""] } },
      phone: { t1: "Playtest 준비됨", t2: "Step 5 — 승인할까요?", ap: "승인", later: "나중에", ok: "승인됨 ✓" },
      stamp: "커밋 ✓",
      cap: {
        ff: "Step 1~3은 넘기고 Step 4를 자세히 봅니다.",
        rag: "LLM 세션이 시작하기 전에 Failure RAG·Skill RAG에서 비슷한 기록 3건을 불러옵니다.",
        rag2: "Step 5도 시작 전에 관련 기록 2건을 불러옵니다.",
        fixsub: "고치는 세션에서도 Sub-LLM이 다시 일합니다: reviewer는 패치를 다시 읽고, worker는 부품 하나를 고칩니다.",
        fastsub: "Step 5는 Sub-LLM 2개(reviewer · comparer)를 씁니다. 결과는 메모로만 돌려줍니다.",
        rsign: "RAG 서버는 Failure RAG·Skill RAG 기록을 쌓아 두고, 작업마다 시작 전에 비슷한 기록을 찾아 줍니다.",
        ragfail: "이번 실패도 Failure RAG에 쌓입니다. 땅에서 새 데이터 상자가 솟아오릅니다.",
        ragskill: "고쳐서 통과한 방법은 Skill RAG에 새 데이터 상자로 쌓입니다.",
        dispatch: "Runner가 새 LLM 세션(Main · Claude Code)을 열고 Step 4 명세를 넘깁니다.",
        skill: "LLM 세션이 이 Step에 필요한 skill(m2-harness)을 불러옵니다.",
        claude: "LLM 세션이 코드를 쓰고, 저장할 때마다 hook이 lint·size를 바로 검사합니다.",
        sub: "Main LLM 세션이 Sub-LLM 3개를 띄워 일을 나눕니다: reviewer · comparer · worker.",
        subret: "결과는 Main 세션으로 돌아옵니다. Sub-LLM은 PASS/FAIL을 정하지 않습니다 — 판정은 Runner와 Audit LLM의 몫입니다.",
        skill2: "검수 단계에 맞춰 review skill(m1-review)을 불러옵니다.",
        checks: "저장할 때마다 린트·파일 크기·복잡도를 자동으로 검사합니다.",
        rule: "Rule audit: 다른 회사 모델(GPT)이 변경 내용을 정해 둔 규칙과 비교합니다.",
        request: "LLM 세션은 자기 작업을 채점하지 않습니다. 검수 요청만 남기면 Runner가 Final audit LLM에 넘깁니다.",
        fail: "Final audit가 결함을 Blocker와 나머지로 나눕니다. Blocker 3건을 한 번에 모두 알려 줍니다.",
        rack: "Blocker 내용은 다음 세션이 읽을 수 있게 Failure RAG에 남깁니다.",
        retry: "FAIL 판정이 Runner로 돌아갑니다.",
        effort: "Runner가 Effort를 한 단계 올려(low → medium) 새 세션을 엽니다.",
        fix: "새 세션이 Failure RAG를 읽고 Blocker 3건을 한 패치로 고쳐 다시 제출합니다.",
        recheck: "같은 검사를 다시 거치고, Runner가 다시 Final audit를 맡깁니다.",
        pass: "다시 받은 Final audit에서 통과했습니다.",
        commit: "검수받은 코드만 Commit합니다. Step 4 완료.",
        next: "Step 5는 또 새 세션에서 시작합니다.",
        fast: "Step 5는 첫 시도에 모든 검사를 통과합니다.",
        known: "Blocker 0 · Known issue 1: 작은 결함은 Known issues에 넣고 다음 Step으로 갑니다.",
        analyst: "Defect analyst(subagent)가 Known issues를 묶어, 같은 파일을 고치는 Step 7에서 함께 해결하도록 연결합니다.",
        gate: "Playtest가 필요한 단계라, Human gate에서 사람이 확인할 때까지 기다립니다.",
        gateok: "승인되어 Commit했습니다.",
        milestone: "마일스톤마다 Final audit (full)이 남은 Known issues를 한 패치로 모아 정리합니다.",
        loop: "Step 4부터 다시 봅니다.",
      },
      pause: "일시정지", play: "재생", replay: "다시 보기",
      pauseA: "애니메이션 일시정지", playA: "애니메이션 재생", replayA: "애니메이션 처음부터 다시 보기",
      staticNote: "움직임 줄이기 설정이 켜져 있어 정지 화면(Final audit가 Blocker를 모두 돌려주는 FAIL 장면)을 보여 줍니다.",
      seekA: "재생 위치", chapH: "장면",
      chap: { ff: "실행기가 Step 배정", skill: "코드 작성 · RAG 불러오기", sub: "하위 에이전트 투입", checks: "기계 검사 · 규약 검수",
        request: "최종 검수 요청", fail: "FAIL · Blocker 3개", retry: "Effort 올려 다시 고치기", pass: "PASS → Commit",
        next: "다음 Step 빠르게", known: "Known issues 쌓기", gate: "Human gate (사람 확인)", milestone: "마일스톤 전체 검수" },
    },
  };

  // 등장 주체별 강조색(실제 회사 브랜드 색 아님)
  const AC = { runner: "#ffb547", claude: "#2ee6c8", checks: "#b6f23a", rule: "#a77bff", final: "#ff4fd8", rack: "#ff4d5e", gate: "#4d8dff", commit: "#3ef08a",
    known: "#ffd84d", analyst: "#7ad7ff", sub: "#7ad7ff" };
  const hexA = (h, a) => `rgba(${parseInt(h.slice(1, 3), 16)},${parseInt(h.slice(3, 5), 16)},${parseInt(h.slice(5, 7), 16)},${a})`;
  const acv = (id) => `--ac:${AC[id]};--acA:${hexA(AC[id], 0.55)};--acB:${hexA(AC[id], 0.16)}`;
  const TITLE_AC = { write: "claude", check: "checks", audit: "final", fail: "rack", ship: "commit", human: "gate", known: "known", milestone: "final" };

  // ---------- 무대 좌표(월드 px). x 오른쪽, y 아래, z 보는 사람 쪽 ----------
  const LANE_IDS = ["runner", "claude", "checks", "rule", "final", "gate", "commit"];
  const ALL_IDS = LANE_IDS.concat(["rack", "known", "analyst"]);
  const SIDE = { known: { x: 300, z: -160 }, analyst: { x: 470, z: -450 } };
  const GH = { x: 1200, z: -160 }; // 앞으로 올 Step 7 카드(대기 중)
  // Subagent 자리(Claude Code 위로 가지를 뻗는다): reviewer · comparer · worker
  const SA_W = [{ x: -1365, y: -322, z: -120 }, { x: -1200, y: -382, z: -90 }, { x: -1035, y: -322, z: -120 }];
  const SA_N = [{ x: -1350, y: -326, z: -120 }, { x: -1200, y: -404, z: -90 }, { x: -1050, y: -326, z: -120 }];
  let SA = SA_W; // 좁은 화면이면 layout에서 SA_N으로 바꾼다(그리기 직전마다 그 인스턴스 것으로)
  const sine = (p) => 0.5 - 0.5 * Math.cos(Math.PI * p);
  const ss = (x) => x * x * (3 - 2 * x);
  const LANE = [[-1800, 0], [-1500, 0], [-1200, 0], [-900, 0], [-600, 0], [-300, 0], [600, 0], [900, 0], [1200, 0]];
  const ST_BACK = 160, RACK = { x: 0, z: -160 };
  const RAIL_Z = -92; // 정거장 앞을 잇는 빛 도관
  const CARD_Y = -84, CW = 136, CH = 88, CT = 14, NSPARK = 18;
  // 바닥 위 평면들은 높이를 나눠 겹침 깜빡임을 막는다(스캔 띠 -1)
  const Y = { pool: -2, ring: -3, ret: -5, lane: -7, chase: -9, shadow: -10 };
  // 소개: 기획서 자리와 PC(모니터 + 본체) 자리
  // 길 왼쪽 끝: 기획 자리 → PC(모니터 + 본체) → 길 시작. 길 뒤쪽: RAG 지식 지도
  const MAP = { x: -300, y: -8, z: -1180 };
  const mapW = (lx, ly) => ({ x: MAP.x - 900 + lx * 2, z: MAP.z - 380 + ly * 2 });
  const PINS = [[130, 120, 110, "F-031"], [260, 230, 80, "F-044"], [90, 290, 60, "F-012"], [330, 90, 130, "F-050"]];
  const NEWPIN = [220, 165, 150];
  const BLDS = [[520, 110, 60, 60, 120], [610, 95, 50, 70, 180], [700, 120, 70, 50, 90], [560, 240, 60, 60, 150], [660, 250, 80, 50, 110], [790, 170, 60, 70, 200]];
  const NEWBLD = [770, 295, 60, 60, 160];
  // v16 데이터 상자: Failure RAG(붉은)·Skill RAG(청록). 새 기록 상자는 솟아오른다
  const FBX = [[110, 135, 24, 24, 90], [180, 105, 22, 28, 150], [255, 140, 26, 22, 115], [150, 235, 24, 24, 175], [235, 250, 28, 24, 80], [315, 195, 22, 22, 128], [90, 300, 20, 20, 60]];
  const SBX = [[540, 120, 24, 24, 120], [612, 100, 22, 28, 185], [690, 132, 26, 22, 95], [565, 235, 24, 24, 150], [650, 252, 28, 22, 110], [762, 175, 22, 26, 205], [720, 262, 20, 20, 70]];
  const NEWF = [372, 255, 24, 24, 150], NEWS = [790, 300, 24, 24, 165];
  const boxTop = (b) => { const p = mapW(b[0], b[1]); return { x: p.x, y: MAP.y - 1 - b[4], z: p.z }; };
  const ICON = {
    runner: '<circle cx="12" cy="12" r="9"/><path d="M10 8l6 4-6 4z"/>',
    claude: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 10l3 2-3 2M12 15h5"/>',
    checks: '<path d="M4 7l2 2 3-3M4 15l2 2 3-3M12 8h8M12 16h8"/>',
    rule: '<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
    final: '<circle cx="11" cy="11" r="6"/><path d="M16 16l5 5"/>',
    rack: '<rect x="5" y="4" width="14" height="5" rx="1"/><rect x="5" y="10" width="14" height="5" rx="1"/><rect x="5" y="16" width="14" height="4" rx="1"/>',
    gate: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>',
    commit: '<circle cx="12" cy="12" r="3"/><path d="M3 12h6M15 12h6"/>',
    known: '<path d="M4 9l2-4h12l2 4v9H4z"/><path d="M4 9h5l1 2h4l1-2h5"/>',
    analyst: '<circle cx="7" cy="7" r="2.6"/><circle cx="17" cy="7" r="2.6"/><circle cx="12" cy="17" r="2.6"/><path d="M8.6 9.2l2.2 5.4M15.4 9.2l-2.2 5.4M9.6 7h4.8"/>',
  };
  const LEVELS = ["low", "medium", "high", "xhigh"];
  const LEVEL_BG = ["#8d9ab3", "#f2b46b", "#ff7a33", "#ff4d6d"];
  const X_LV = { en: ["low", "medium", "high"], ko: ["low", "medium", "high"] };

  const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const expo = (p) => (p <= 0 ? 0 : p >= 1 ? 1 : p < 0.5 ? Math.pow(2, 20 * p - 10) / 2 : (2 - Math.pow(2, -20 * p + 10)) / 2);
  const easeOut = (p) => 1 - Math.pow(1 - p, 3);
  const back = (p) => 1 + 2.70158 * Math.pow(p - 1, 3) + 1.70158 * Math.pow(p - 1, 2);
  const bump = (p, a) => (p >= a && p <= a + 0.25 ? Math.sin(Math.PI * (p - a) / 0.25) : 0);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const r1 = (v) => Math.round(v * 10) / 10;
  const r3 = (v) => Math.round(v * 1000) / 1000;

  // 길: 점들을 지나는 부드러운 곡선(Catmull-Rom). u = 정거장 번호(실행기 0 … 커밋 6), -1 입장, 7 퇴장
  function lanePt(u) {
    const k = clamp((u + 1) / 8) * 8;
    const i = Math.min(7, Math.floor(k)), f = k - i;
    const P = (j) => LANE[Math.max(0, Math.min(8, j))];
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const cr = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * f + (2 * a - 5 * b + 4 * c - d) * f * f + (-a + 3 * b - 3 * c + d) * f * f * f);
    return { x: cr(p0[0], p1[0], p2[0], p3[0]), z: cr(p0[1], p1[1], p2[1], p3[1]) };
  }
  function retPt(r) {
    const a = lanePt(4), b = lanePt(1);
    return { x: a.x + (b.x - a.x) * r, z: a.z + (b.z - a.z) * r + 250 * Math.sin(Math.PI * r) };
  }
  const stPos = (id) => {
    if (id === "rack") return { x: RACK.x, y: -150, z: RACK.z };
    if (SIDE[id]) return { x: SIDE[id].x, y: -150, z: SIDE[id].z };
    if (id === "s7") return { x: GH.x, y: -150, z: GH.z - 50 };
    if (id && id.startsWith("sa")) { const a = SA[+id[2]]; return { x: a.x, y: a.y + 20, z: a.z - 50 }; }
    const p = lanePt(LANE_IDS.indexOf(id));
    return { x: p.x, y: -150, z: p.z - ST_BACK };
  };
  const angDeg = (a, b) => Math.atan2(-(b.z - a.z), b.x - a.x) * 180 / Math.PI;

  // ---------- 대본(장면 순서) ----------
  function buildScript(X) {
    const S = { lines: [], pages: [], opens: [], packets: [], caps: [], segs: [], titles: [], bursts: [], glitch: [], marks: {} };
    const cur = {};
    let c = 0;
    const clear = (w) => { cur[w] = S.pages.length; S.pages.push({ win: w, t0: c }); };
    const line = (w, text, o = {}) => {
      const dur = o.dur === undefined ? 700 : o.dur;
      S.lines.push({ win: w, page: cur[w], t0: c, dur, text, mode: o.mode || "stream", cls: o.cls || "", hl: o.hl || "" });
      if (!o.par) c += dur + (o.gap === undefined ? 110 : o.gap);
    };
    const base = (w, text, cls, mode) => line(w, text, { dur: 0, gap: 0, mode: mode || "fade", cls: cls || "" });
    const open = (w) => { S.opens.push({ w, t0: c, t1: Infinity }); c += 380; };
    const close = (hold) => { c += hold || 0; S.opens[S.opens.length - 1].t1 = c; c += 300; };
    const cap = (k) => S.caps.push({ k, t0: c });
    const seg = (dur, fn) => { S.segs.push({ t0: c, dur, fn }); c += dur; };
    const par = (dur, fn, off) => S.segs.push({ t0: c + (off || 0), dur, fn });
    const wait = (d) => { c += d; };
    const title = (k, dur) => S.titles.push({ k, t0: c, dur: dur || 1250 });
    const BIGI = { [X.pk.req]: X.pk.reqI, [X.pk.call]: X.pk.callI, [X.pk.vFail]: X.pk.vFailI, [X.pk.vPass]: X.pk.vPassI };
    const send = (from, to, label, dur, kind, adv) => {
      S.packets.push({ from, to, label, t0: c, dur, kind: kind || from, big: !!BIGI[label], info: BIGI[label] }); if (adv !== false) c += dur;
    };
    // 근접 카메라가 따라가는 큰 패킷(이름표 + 내용 카드)
    const sendF = (from, to, label, dur, info, kind, adv) => {
      const P = { from, to, label, t0: c, dur, kind: kind || from, big: true, info };
      S.packets.push(P); if (adv !== false) c += dur; return P;
    };
    const mv = (a, b, dur, adv) => {
      // 짧은 이동은 카메라를 거의 휘돌리지 않는다(연달아 짧게 움직일 때 화면이 튀지 않게)
      const wa = clamp((dur - 500) / 700);
      const fn = (s, p) => { s.card.mode = "lane"; s.card.u = a + (b - a) * ease(p); s.whip = Math.sin(Math.PI * p) * Math.sign(b - a) * Math.min(1, Math.abs(b - a)) * wa; };
      if (adv === false) par(dur, fn); else seg(dur, fn);
    };
    const mark = (id, k) => par(260, (s, p) => { s.mark[id] = { k, v: p }; });
    const wide = (from, to, dur, off) => par(dur, (s, p) => { s.wide = from + (to - from) * expo(p); }, off);
    const checks = () => {
      line("checks", X.k0, { mode: "fade", dur: 150, cls: "mut" });
      ["k1", "k2", "k3"].forEach((k) => line("checks", X[k], { mode: "check", dur: 400, gap: 70 }));
      line("checks", X.k4, { mode: "fade", dur: 250, cls: "ok" });
    };
    const hook = () => par(650, (s, p) => { s.hk = Math.sin(Math.PI * p); });
    const skill = (i, dur) => par(dur || 800, (s, p) => { s.sk[i] = p; });
    const resetCard = (step) => seg(0, (s) => {
      s.sk = [0, 0];
      Object.assign(s.card, { step, effort: 0, red: 0, green: 0, stamp: 0, ep: 0, mode: "lane", u: -1 }); s.trail = 1;
      s.mark = {}; s.greenRun = 0;
    });

    const parAt = (off, dur, fn) => S.segs.push({ t0: c + off, dur, fn });
    // RAG: 작업 전에 불러오기 / 실패를 점으로 쌓기 / 고친 방법을 스킬로 쌓기
    const ragPull = (n) => {
      cap(n === 3 ? "rag" : "rag2");
      seg(0, (s) => { s.mapTx = -1; });
      seg(700, (s, p) => { s.mapv = ease(p); });
      if (n === 3) S.marks.rag = c + 900;
      seg(1100, (s, p) => { s.beam = ease(p); s.kv = clamp(p * 2); });
      wait(900);
      if (n === 3) {
        // RAG 서버 안내판을 가까이에서 읽을 수 있게 밀어 들어갔다가 돌아온다
        cap("rsign");
        seg(2100, (s, p) => { s.rs = sine(p); s.kv = 1 - clamp(p * 2); });
        S.marks.rsign = c + 300;
        seg(1500, (s, p) => { s.rsh = sine(p); });
        seg(2000, (s, p) => { s.rs = 1 - sine(p); });
      }
      seg(700, (s, p) => { s.mapv = 1 - ease(p); s.kv = n === 3 ? 0 : 1 - p; s.beam = 1 + p; });
      seg(0, (s) => { s.beam = 0; });
    };
    const ragFail = () => {
      cap("ragfail");
      seg(0, (s) => { s.mapTx = 0; });
      seg(650, (s, p) => { s.mapv = ease(p); });
      seg(1200, (s, p) => { s.newPin = ease(p); s.pinCard = clamp(p * 2 - 0.6); });
      S.marks.ragfail = c;
      wait(700);
      seg(650, (s, p) => { s.mapv = 1 - ease(p); s.pinCard = 1 - p; });
    };
    const ragSkill = () => {
      cap("ragskill");
      seg(0, (s) => { s.mapTx = 1; });
      seg(650, (s, p) => { s.mapv = ease(p); });
      seg(1200, (s, p) => { s.newBld = ease(p); s.bldCard = clamp(p * 2 - 0.6); });
      S.marks.ragskill = c;
      wait(700);
      seg(650, (s, p) => { s.mapv = 1 - ease(p); s.bldCard = 1 - p; });
    };
    ["runner", "claude", "checks", "rule", "final", "rack", "commit"].forEach(clear);
    base("runner", X.r0, "mut"); base("runner", X.r1, "mut");
    base("rack", X.rackHead, "mut"); base("rack", X.rk4); base("rack", X.rk5);
    base("commit", X.g2, "", "git"); base("commit", X.g3, "", "git");

    // ===== 처음 한 번: 길과 RAG 지도 전경(천천히 다가가며 길에 불이 들어옴) → Step 4 =====
    cap("ff");
    parAt(0, 2600, (s, p) => { s.est = 1 - ease(p); s.reveal = ease(clamp(p * 1.5)); });
    parAt(1000, 900, (s, p) => { s.prog = 0.3 * ease(p); s.pp = bump(p, 0.75); });
    wait(2600);
    S.I = c;
    const L0 = c;

    // ===== Step 4: 전경 샷 → 한 번 FAIL → 한 번에 고침 → PASS → 커밋에서 물러나기 =====
    resetCard(4); cap("dispatch");
    wide(1, 0, 2300);
    S.marks.establish = c + 500;
    mv(-1, 0, 2000);
    open("runner"); line("runner", X.r2, { dur: 900 }); close(500);
    send("runner", "claude", X.pk.spec, 1200, "runner", false);
    title("write"); mv(0, 1, 1200);
    cap("skill"); skill(0, 900); S.marks.skill = c + 700; wait(900);
    ragPull(3);
    cap("claude");
    clear("claude"); open("claude");
    line("claude", X.rag.load3, { mode: "fade", dur: 250, cls: "ok", gap: 120 });
    S.marks.typing = c + 2100;
    line("claude", X.c1, { dur: 700 });
    line("claude", "def parse_order(raw: str) -> Order:", { dur: 700, cls: "code" }); hook();
    line("claude", '    fields = raw.split(",")', { dur: 500, cls: "code" }); hook();
    line("claude", "    return Order.from_fields(fields)", { dur: 600, cls: "code" }); hook();
    line("claude", "$ pytest -q", { dur: 300, gap: 220 });
    line("claude", "  ✓ 12 passed", { mode: "fade", dur: 300, cls: "ok" });
    close(300);
    // Subagent 3개: Main session에서 가지를 뻗어 병렬로 일하고, 결과만 돌려준다
    cap("sub");
    seg(1100, (s, p) => { s.subc = sine(p); const v = ss(clamp(p * 1.3 - 0.15)); s.sa.a = [v, v, v]; });
    S.marks.sub = c + 1300;
    seg(2600, (s, p) => { s.subh = p; s.sa.pr = [clamp(p * 1.45), clamp(p * 1.2), clamp(p * 1.04)]; });
    seg(700, (s, p) => { s.sa.ck = p; });
    cap("subret");
    S.marks.subret = c + 900;
    send("sa0", "claude", X.pk.r0, 1000, "sub", false); wait(260);
    send("sa1", "claude", X.pk.r1, 1000, "sub", false); wait(260);
    send("sa2", "claude", X.pk.r2, 1000, "sub");
    seg(1000, (s, p) => { s.subc = 1 - sine(p); });
    cap("checks"); title("check"); mv(1, 2, 1100);
    clear("checks"); open("checks"); checks(); mark("checks", "ok"); close(300);
    cap("rule"); mv(2, 3, 950);
    clear("rule"); open("rule");
    line("rule", X.u4, { mode: "bubble", dur: 300, gap: 300 });
    line("rule", X.ruleOk, { dur: 700 });
    line("rule", "VERDICT: PASS", { dur: 400, cls: "pass" }); mark("rule", "ok"); close(350);
    cap("skill2"); wide(0, 1, 800); skill(1, 900); S.marks.skill2 = c + 700; wait(1000);
    // 검수 요청: Claude Code → 실행기 → GPT 최종 검수 (넓은 샷)
    cap("request"); title("audit");
    par(900, (s, p) => { const v = 1 - ss(p); s.sa.a = [v, v, v]; });
    line("claude", X.cReq, { dur: 0, gap: 0, cls: "ok" });
    S.marks.request = c + 600;
    const P1 = sendF("claude", "runner", X.pk.req, 1500, X.pk.reqI);
    par(650, (s, p) => { s.fpk = P1; s.fw = ease(p); }, -1500);
    S.marks.pkreq = c - 700;
    open("runner"); line("runner", X.rq, { dur: 800 }); close(200);
    const P2 = sendF("runner", "final", X.pk.call, 2400, X.pk.callI, "runner", false);
    par(0, (s) => { s.fpk = P2; });
    S.marks.pkcall = c + 1200;
    mv(3, 4, 2400); wide(1, 0, 900, -700);
    par(800, (s, p) => { s.fw = 1 - ease(p); });
    clear("final"); open("final");
    line("final", X.f0, { mode: "bubble", dur: 300, gap: 400 });
    line("final", X.f1, { dur: 500 });
    cap("fail");
    par(2600, (s, p) => { s.orb = sine(p); });
    line("final", [["[Blocker] ", "fail"], [X.d1, ""]], { dur: 800 });
    line("final", [["[Blocker] ", "fail"], [X.d2, ""]], { dur: 700 });
    line("final", [["[Blocker] ", "fail"], [X.d3, ""]], { dur: 700 });
    S.glitch.push(c + 250);
    line("final", X.vf, { dur: 400, cls: "fail", gap: 100 });
    par(450, (s, p) => { s.card.red = p; }); mark("final", "ng");
    S.marks.fail = c + 450;
    close(900);
    par(1200, (s, p) => { s.orb = 1 - sine(p); }, -900);
    cap("rack"); title("fail"); send("final", "rack", X.pk.note, 1100, "rack");
    open("rack"); line("rack", X.rk6, { mode: "slide", dur: 500, hl: "fail" }); S.marks.rack = c + 250; close(700);
    ragFail();
    cap("retry"); line("runner", X.r3, { dur: 0, gap: 0, cls: "med" });
    const P3 = sendF("final", "runner", X.pk.vFail, 1700, X.pk.vFailI, "rack");
    par(500, (s, p) => { s.fpk = P3; s.fw = ease(p); }, -1700);
    S.marks.pkfail = c - 800;
    seg(900, (s, p) => { s.pulse = p; });
    S.marks.retry = c + 500;
    par(1300, (s, p) => { s.fw = 1 - ease(p); });
    seg(1300, (s, p) => { s.pulse = -1; s.card.mode = "ret"; s.card.r = ease(p); s.card.red = 1 - ease(p); s.whip = -Math.sin(Math.PI * p) * 1.3; });
    seg(0, (s) => { s.card.mode = "lane"; s.card.u = 1; s.mark = {}; });
    // Effort 게이지: Claude Code 위에 떠서 low → medium으로 오르고, 잠깐 강조한 뒤 그대로 머문다
    cap("effort");
    seg(1800, (s, p) => {
      s.eg = clamp(p / 0.18); s.egk = ease(clamp((p - 0.25) / 0.4));
      s.card.effort = p > 0.5 ? 1 : 0; s.card.ep = Math.max(0, Math.sin(Math.PI * clamp((p - 0.45) / 0.45))); s.egp = Math.max(0, Math.sin(Math.PI * clamp((p - 0.5) / 0.45)));
    });
    S.marks.effort = c - 500;
    cap("fix");
    par(500, (s, p) => { s.sk[1] = 1 - p; });
    clear("claude"); open("claude");
    seg(0, (s) => { s.sa.pr = [0, 1, 0]; s.sa.ck = 0; s.sa.ses = "fix"; });
    par(600, (s, p) => { s.eg = 1 - p; }, 700);
    par(900, (s, p) => { const v = ss(p); s.sa.a[0] = v; s.sa.a[2] = v; }, 1200);
    par(2300, (s, p) => { s.sa.pr = [clamp(p * 1.2), 1, clamp(p * 1.05)]; }, 1500);
    line("claude", X.c7, { dur: 700 });
    S.marks.fix = c + 1500;
    line("claude", "+ if not raw: raise EmptyOrder", { dur: 600, cls: "add" }); hook();
    line("claude", "+ order.currency = parse_currency(raw)", { dur: 600, cls: "add" }); hook();
    line("claude", "+ def test_single_item_order(): ...", { dur: 600, cls: "add" }); hook();
    line("claude", "$ pytest -q", { dur: 300, gap: 200 });
    line("claude", "  ✓ 15 passed", { mode: "fade", dur: 300, cls: "ok" });
    cap("fixsub");
    par(500, (s, p) => { s.sa.ck = p; });
    S.marks.fixsub = c + 300;
    send("sa0", "claude", X.pk.r3, 900, "sub", false); wait(250);
    send("sa2", "claude", X.pk.r4, 900, "sub");
    close(300);
    cap("recheck");
    par(900, (s, p) => { const v = 1 - ss(p); s.sa.a[0] = v; s.sa.a[2] = v; });
    mv(1, 2, 700); mark("checks", "ok"); wait(200);
    mv(2, 3, 700); mark("rule", "ok"); wait(200);
    wide(0, 1, 700);
    send("claude", "runner", X.pk.req, 850);
    send("runner", "final", X.pk.call, 1100, "runner", false); mv(3, 4, 1100); wide(1, 0, 800, -500);
    cap("pass");
    clear("final"); open("final");
    line("final", X.f0b, { mode: "bubble", dur: 300, gap: 350 });
    line("final", X.f2, { dur: 850 });
    line("final", "VERDICT: PASS", { dur: 400, cls: "pass" });
    par(450, (s, p) => { s.card.green = p; }); mark("final", "ok");
    S.bursts.push({ t0: c + 100, u: 4 });
    S.marks.pass = c + 300;
    close(450);
    cap("commit"); title("ship");
    const P4 = sendF("final", "runner", X.pk.vPass, 1300, X.pk.vPassI, "commit");
    par(500, (s, p) => { s.fpk = P4; s.fw = ease(p); }, -1300);
    S.marks.pkpass = c - 600;
    par(1500, (s, p) => { s.fw = 1 - ease(p); }, 600);
    seg(700, (s, p) => { s.greenRun = ease(p); });
    mv(4, 6, 1500);
    open("commit"); line("commit", X.g4, { mode: "git", dur: 500, hl: "pass" });
    seg(650, (s, p) => { s.card.stamp = p; });
    S.bursts.push({ t0: c - 300, u: 6 });
    par(700, (s, p) => { s.prog = 0.3 + 0.1 * ease(p); s.pp = bump(p, 0.3); });
    S.marks.commit = c + 300;
    close(600);
    ragSkill();
    wide(0, 1, 1200); // 끝까지 전경으로 물러나야 다음 Step 카드가 처음으로 돌아갈 때 화면이 튀지 않는다
    par(1300, (s, p) => { s.trail = 1 - ease(p); });
    mv(6, 7, 1300);

    // ===== Step 5: 첫 시도 PASS, 사람 확인 =====
    resetCard(5); cap("next");
    wide(1, 0, 1800);
    mv(-1, 0, 1300); skill(0, 800); mv(0, 1, 900);
    ragPull(2);
    cap("fast");
    clear("claude"); open("claude");
    seg(0, (s) => { s.sa.pr = [0, 0, 1]; s.sa.ses = "s5"; });
    par(900, (s, p) => { const v = ss(p); s.sa.a[0] = v; s.sa.a[1] = v; });
    par(2600, (s, p) => { s.sa.pr = [clamp(p * 1.15), clamp(p * 1.05), 1]; }, 300);
    line("claude", X.rag.load2, { mode: "fade", dur: 250, cls: "ok", gap: 100 });
    line("claude", X.c8, { dur: 600 });
    line("claude", "def render_hud(state: Game) -> Hud:", { dur: 600, cls: "code" }); hook();
    line("claude", "    return Hud(hp=state.hp, ammo=state.ammo)", { dur: 700, cls: "code" }); hook();
    line("claude", "  ✓ 9 passed", { mode: "fade", dur: 300, cls: "ok" });
    cap("fastsub"); S.marks.fastsub = c + 300;
    send("sa0", "claude", X.pk.r5, 900, "sub", false); wait(250);
    send("sa1", "claude", X.pk.r6, 900, "sub");
    close(250);
    par(900, (s, p) => { const v = 1 - ss(p); s.sa.a[0] = v; s.sa.a[1] = v; });
    mv(1, 2, 650); mark("checks", "ok"); wait(150);
    mv(2, 3, 650); mark("rule", "ok"); wait(150);
    wide(0, 1, 500);
    send("claude", "runner", X.pk.req, 750);
    send("runner", "final", X.pk.call, 950, "runner", false); mv(3, 4, 950); wide(1, 0, 700, -400);
    clear("final"); open("final");
    line("final", X.f5, { mode: "bubble", dur: 300, gap: 300 });
    line("final", X.f3, { dur: 600 });
    line("final", [["[minor] ", "med"], [X.f5k, ""]], { dur: 600 });
    line("final", X.f5v, { dur: 450, cls: "pass" });
    par(450, (s, p) => { s.card.green = p; }); mark("final", "ok");
    close(300);
    // 작은 결함은 Known issues로 떨어지고 Step은 계속
    cap("known"); title("known", 1600);
    seg(0, (s) => { s.mapTx = 2; });
    par(900, (s, p) => { s.mapv = ease(p); });
    send("final", "known", X.pk.known, 1300, "known");
    S.marks.known = c;
    seg(500, (s, p) => { s.known = 2 + ease(p); });
    // Defect analyst(subagent): 묶어서 뒤 Step에 연결
    cap("analyst");
    send("known", "analyst", X.pk.group, 1000, "analyst");
    seg(1000, (s, p) => { s.link = ease(p); s.lnO = clamp(p * 4); s.anCard = clamp(p * 2 - 0.6); });
    S.marks.analyst = c + 600;
    send("analyst", "s7", X.pk.assign, 1100, "analyst", false);
    seg(1100, (s, p) => { s.known = 3 - 2 * ease(clamp((p - 0.05) / 0.5)); s.s7 = clamp(p * 1.6 - 0.6); });
    wait(700);
    seg(700, (s, p) => { s.anCard = 1 - p; s.lnO = 1 - p; s.mapv = 1 - ease(p); });
    cap("gate"); title("human");
    seg(500, (s, p) => { s.greenRun = 0.5 * ease(p); });
    mv(4, 5, 1100);
    open("gate");
    seg(450, (s, p) => { s.gate.card = ease(p); });
    S.marks.gate = c + 700;
    seg(1400, (s) => { s.gate.wait = 1; });
    seg(650, (s, p) => { s.gate.wait = 0; s.gate.tap = p; });
    seg(400, (s, p) => { s.gate.ok = p; }); mark("gate", "ok");
    S.bursts.push({ t0: c - 300, u: 5 });
    close(400);
    cap("gateok");
    seg(400, (s, p) => { s.greenRun = 0.5 + 0.5 * ease(p); });
    mv(5, 6, 900);
    open("commit"); line("commit", X.g5, { mode: "git", dur: 500, hl: "pass" });
    seg(650, (s, p) => { s.card.stamp = p; });
    S.bursts.push({ t0: c - 300, u: 6 });
    par(700, (s, p) => { s.prog = 0.4 + 0.1 * ease(p); s.pp = bump(p, 0.3); });
    par(900, (s, p) => { s.rate = Math.round(55 + 3 * ease(p)); s.rateP = bump(p, 0.4); });
    S.marks.commit2 = c + 300;
    close(500);
    wide(0, 1, 1600);
    mv(6, 7, 1300);
    // Milestone: Final audit (full)이 남은 Known issues를 한 번에 정리하고 진행 막대 한 구간을 채운다
    cap("milestone"); title("milestone", 1500);
    seg(0, (s) => { s.mapTx = 2; });
    seg(800, (s, p) => { s.mapv = ease(p); });
    send("known", "final", X.pk.sweep, 1100, "known", false);
    seg(1100, (s, p) => { s.known = 1 - ease(clamp(p / 0.4)); s.msk = p; });
    clear("final"); open("final");
    S.marks.milestone = c + 400;
    line("final", X.ms.m0, { mode: "bubble", dur: 300, gap: 300 });
    line("final", X.ms.m1, { dur: 700 });
    line("final", X.ms.m2, { dur: 450, cls: "pass" }); mark("final", "ok");
    close(450);
    send("final", "commit", X.pk.patch, 1000, "commit");
    S.bursts.push({ t0: c - 250, u: 6 });
    par(900, (s, p) => { s.ms = ease(p); s.pp = bump(p, 0.35); });
    seg(2600, (s, p) => { s.rev = sine(p); });
    S.marks.reveal = c - 300;
    cap("loop"); wait(500);
    S.D = c;
    // 반복 구간만 0.8배로(한 바퀴 약 61초). 소개는 그대로
    const K = (S.K = 0.8);
    const sc = (x) => (x >= L0 ? L0 + (x - L0) * K : x);
    [S.lines, S.pages, S.packets, S.caps, S.segs, S.titles].forEach((arr) => arr.forEach((o) => {
      if (o.t0 >= L0 && o.dur !== undefined) o.dur *= K;
      o.t0 = sc(o.t0);
    }));
    S.opens.forEach((o) => { o.t0 = sc(o.t0); o.t1 = sc(o.t1); });
    Object.keys(S.marks).forEach((k) => { S.marks[k] = sc(S.marks[k]); });
    S.L = (c - L0) * K;
    S.D = S.I + S.L;
    [S.lines, S.pages, S.packets, S.caps, S.segs, S.titles, S.opens].forEach((arr) => arr.sort((x, y) => x.t0 - y.t0));
    return S;
  }

  function baseState() {
    return { card: { mode: "lane", u: -1, r: 0, step: 4, effort: 0, ep: 0, red: 0, green: 0, stamp: 0 },
      mark: {}, pulse: -1, wide: 1, whip: 0, greenRun: 0, prog: 0, pp: 0, gate: { card: 0, wait: 0, tap: 0, ok: 0 },
      reveal: 0, est: 0, eg: 0, egk: 0, egp: 0, known: 2, link: 0, lnO: 0, anCard: 0, s7: 0, ms: 0, msk: 0, fw: 0, fpk: null, rs: 0, rsh: 0, trail: 1, orb: 0, subc: 0, subh: 0, rev: 0, hk: 0, sk: [0, 0],
      sa: { a: [0, 0, 0], pr: [0, 0, 0], ck: 0, ses: "a" },
      mapv: 0, mapTx: -1, beam: 0, kv: 0, newPin: 0, pinCard: 0, newBld: 0, bldCard: 0, rate: 55, rateP: 0 };
  }

  // ---------- DOM 만들기 ----------
  const T3 = (x, y, z) => `translate3d(${r1(x)}px,${r1(y)}px,${r1(z)}px)`;

  function stationHTML(id, X, i) {
    const p = stPos(id);
    return `<div class="pm3-st" data-k="st_${id}" style="${acv(id)}">
      <div class="pm3-refl" style="transform:translate3d(0,150px,0) scaleY(-1) translate(-110px,-70px)"><svg viewBox="0 0 24 24" aria-hidden="true">${ICON[id]}</svg></div>
      <div class="pm3-beam" data-k="bm_${id}" style="transform:translate3d(0,-47px,-75px) translate(-90px,-400px)"><i class="haze"></i><i class="bloom"></i><i class="core"></i></div>
      <div class="pm3-ped top" style="transform:translate3d(0,-46px,0) rotateX(90deg) translate(-85px,-55px)"></div>
      <div class="pm3-ped front" style="transform:translate3d(0,-26px,55px) translate(-85px,-20px)"><i class="led"></i></div>
      <div class="pm3-ped side" style="transform:translate3d(85px,-26px,0) rotateY(90deg) translate(-55px,-20px)"></div>
      <div class="pm3-ring" style="transform:translate3d(0,${Y.ring}px,0) rotateX(90deg) translate(-120px,-120px)"></div>
      <div class="pm3-pool" style="transform:translate3d(0,${Y.pool}px,40px) rotateX(90deg) translate(-150px,-70px)"></div>
      <div class="pm3-slab" data-k="sl_${id}" style="transform:translate3d(0,-150px,0) translate(-110px,-70px)">
        <div class="pm3-glow" data-k="sg_${id}"></div>
        <span class="pm3-sid">ST.${String(i).padStart(2, "0")}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">${ICON[id]}</svg>
        <div class="pm3-lbl">${esc(X.st[id])}</div>${X.stsub[id] ? `<div class="pm3-lsub">${esc(X.stsub[id])}</div>` : ""}
        <div class="pm3-mk ok" data-k="mk_${id}_ok">✓</div><div class="pm3-mk ng" data-k="mk_${id}_ng">✕</div>
        ${id === "claude" ? `<div class="pm3-main">${esc(X.sa.main)}</div>` : ""}
        ${id === "known" ? '<b class="pm3-kcnt" data-k="kcnt">2</b><div class="pm3-kchips"><i class="pm3-kchip" data-k="kc0"></i><i class="pm3-kchip" data-k="kc1"></i><i class="pm3-kchip" data-k="kc2"></i></div>' : ""}
      </div></div>`;
  }

  function laneHTML() {
    let h = "";
    const N = 40;
    for (let k = 0; k < N; k++) {
      const u0 = -1 + (8 * k) / N, u1 = -1 + (8 * (k + 1)) / N;
      const a = lanePt(u0), b = lanePt(u1);
      const len = Math.hypot(b.x - a.x, b.z - a.z) + 1.5;
      const nxt = LANE_IDS[Math.max(0, Math.min(6, Math.ceil(u0 + 0.001)))];
      h += `<div class="pm3-lane" data-lseg="${k}" style="width:${r1(len)}px;transform:${T3(a.x, Y.lane, a.z)} rotateY(${r1(angDeg(a, b))}deg) rotateX(90deg) translateY(-7px)">
        <i class="o" data-ln="${k}" style="${acv(nxt)}"></i><i class="g" data-lg="${k}"></i></div>`;
    }
    for (let k = 0; k < 14; k++) {
      const a = retPt(k / 14), b = retPt((k + 0.55) / 14);
      h += `<div class="pm3-ret" data-rt="${k}" style="width:${r1(Math.hypot(b.x - a.x, b.z - a.z))}px;transform:${T3(a.x, Y.ret, a.z)} rotateY(${r1(angDeg(a, b))}deg) rotateX(90deg) translateY(-2px)"></div>`;
    }
    for (let k = 0; k < 4; k++) h += `<div class="pm3-chase" data-k="ch${k}"></div>`;
    return h + railHTML();
  }

  function railHTML() {
    const xa = -1500, xb = 1200, L = xb - xa;
    let h = `<div class="pm3-rail top" style="width:${L}px;transform:${T3(xa, -13, RAIL_Z)} rotateX(90deg) translate(0,-7px)">${[0, 1, 2].map((k) => `<i data-k="rf${k}"></i>`).join("")}</div>
      <div class="pm3-rail front" style="width:${L}px;transform:${T3(xa, -13, RAIL_Z + 7)}"></div>`;
    const stops = ALL_IDS.filter((id) => id !== "analyst").map((id) => [id, stPos(id).x]).concat([["s7", GH.x]]);
    stops.forEach(([id, x]) => {
      const st = AC[id] ? acv(id) : "--ac:#9aa7bd;--acA:rgba(154,167,189,.55);--acB:rgba(154,167,189,.16)";
      h += `<div class="pm3-joint" style="${st};transform:${T3(x, -15, RAIL_Z)} rotateX(90deg) translate(-17px,-17px)"></div>
        <div class="pm3-stub" style="${st};transform:${T3(x - 12, -10, RAIL_Z - 11)} rotateX(90deg)"></div>`;
    });
    // Known issues → Defect analyst 갈래(바닥을 따라 뒤로)
    const kx = SIDE.known.x + 85, z0 = SIDE.known.z, z1 = SIDE.analyst.z + 55;
    h += `<div class="pm3-rail spur" style="width:${z0 - z1}px;transform:${T3(kx, -13, z0)} rotateY(90deg) rotateX(90deg) translate(0,-6px)"></div>`;
    return h;
  }

  // ---------- v14 지형: 끝이 보이지 않는 바닥, 바닥 전체 등고선, 점·입자, 먼 구조물, 부피 빛, RAG 신호선 ----------
  const FLOOR = { w: 1900, h: 1000, k: 3.75, z: -420 }; // 바닥 판(로컬) → 월드: x = (lx - w/2)·k, z = z0 + (ly - h/2)·k
  function floorHTML() {
    const C = [[870, 297, 11, 340, 150, 0.7], [420, 430, 7, 260, 130, 2.2], [1390, 380, 8, 300, 150, 3.1], [300, 760, 6, 260, 120, 1.7],
      [1520, 780, 7, 320, 140, 0.4], [960, 830, 5, 380, 110, 2.8], [1720, 190, 6, 210, 90, 1.1], [150, 190, 6, 190, 90, 2.6], [640, 120, 5, 220, 70, 1.9]];
    const d = C.map((c) => contours(...c)).join("");
    return `<div class="pm3-floor"><svg viewBox="0 0 ${FLOOR.w} ${FLOOR.h}" preserveAspectRatio="none" aria-hidden="true"><path d="${d}"/></svg></div>`;
  }
  const rnd = (j, a) => ((Math.sin(j * 127.1 + a * 311.7) * 43758.5453) % 1 + 1) % 1;
  // 파형 장: 지역 가운데 뒤쪽에 서서 살짝 뒤로 기운다. 로컬 점(lx,ly) → 월드
  const WF_W = 560, WF_H = 300, WF_T = 14;
  const WF = [{ k: "f", x: MAP.x - 900 + 460, y: -168, z: MAP.z - 380 + 360, warm: true }, { k: "s", x: MAP.x - 900 + 1300, y: -168, z: MAP.z - 380 + 330, warm: false }];
  const wfPt = (w, lx, ly) => { const a = WF_T * Math.PI / 180, ry = ly - WF_H / 2; return { x: w.x + lx - WF_W / 2, y: w.y + ry * Math.cos(a), z: w.z + ry * Math.sin(a) }; };
  const DOTS = Array.from({ length: 12 }, (_, j) => ({ x: -2600 + rnd(j, 1) * 5000, z: -330 - rnd(j, 2) * 2100, y: -6 - rnd(j, 3) * 70, n: 5 + (j % 6), ph: rnd(j, 4) * 6.28 }));
  function linkPts() {
    const mp = (lx, ly) => { const p = mapW(lx, ly); return { x: p.x, y: MAP.y - 3, z: p.z }; };
    const top = (id, dx) => { const p = stPos(id); return { x: p.x + (dx || 0), y: -224, z: p.z + 4 }; };
    const F = "#ff8fa0", K = "#5ff3b0", B = "#9fe9ff";
    return [
      [mp(230, 200), top("claude", -30), F, 7], [mp(650, 170), top("claude", 30), K, 9],            // 불러오기: Failure RAG·Skill RAG → Claude Code
      [top("final"), mp(270, 240), F, 8], [top("commit"), mp(700, 210), K, 6],                     // FAIL → Failure RAG, PASS·Commit → Skill RAG
      [mp(340, 150), mp(560, 140), B, 11, 1], [mp(560, 250), mp(330, 270), B, 10, 1],              // 두 구역 사이 교차 연결

    ];
  }
  function terrainHTML() {
    let h = `<div class="pm3-vglow" data-k="vgl" style="transform:${T3(-300, -520, -2100)} scale(10) translate(-200px,-80px)"></div>`;
    [[-2300, -2700, 260, 520], [-700, -3150, 340, 300], [950, -2850, 300, 600], [2200, -2900, 240, 640]]
      .forEach(([x, z, w, hh]) => { h += `<div class="pm3-far" style="width:${w}px;height:${hh}px;transform:${T3(x, -hh / 2, z)} translate(-${w / 2}px,-${hh / 2}px)"></div>`; });
    const N = [[90, 300], [240, 120], [380, 260], [520, 80], [640, 220], [800, 140], [930, 300], [1060, 90], [1180, 240], [300, 420], [700, 400], [1000, 410], [150, 60], [1240, 380]];
    const E = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [2, 9], [4, 10], [6, 11], [1, 12], [8, 13], [10, 11], [9, 10], [3, 5]];
    h += `<div class="pm3-net" style="transform:${T3(-250, -820, -3300)} scale(2) translate(-650px,-250px)"><svg viewBox="0 0 1300 500" aria-hidden="true">${E.map(([a, b]) => `<line x1="${N[a][0]}" y1="${N[a][1]}" x2="${N[b][0]}" y2="${N[b][1]}"/>`).join("")}${N.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 ? 4 : 7}"/>`).join("")}</svg></div>`;
    DOTS.forEach((d, j) => { h += `<div class="pm3-dot" data-k="dt${j}"></div>`; });
    linkPts().forEach(([A, B, col, , flat], j) => {
      const dx = B.x - A.x, dy = B.y - A.y, dz = B.z - A.z, hz = Math.hypot(dx, dz), L = Math.hypot(hz, dy);
      const base = `${T3(A.x, A.y, A.z)} rotateY(${r1(Math.atan2(-dz, dx) * 180 / Math.PI)}deg) rotateZ(${r1(Math.atan2(dy, hz) * 180 / Math.PI)}deg)`;
      h += `<div class="pm3-lk" style="--c:${col};width:${r1(L)}px;transform:${base} ${flat ? "rotateX(90deg) " : ""}translate(0,-1px)"></div>` +
        (flat ? "" : `<div class="pm3-lk" style="--c:${col};width:${r1(L)}px;transform:${base} rotateX(90deg) translate(0,-1px)"></div>`) +
        `<div class="pm3-dp" data-k="lp${j}a" style="--c:${col}"></div>` + (j < 6 ? `<div class="pm3-dp" data-k="lp${j}b" style="--c:${col}"></div>` : "");
    });
    return h;
  }

  // 등고선(지도 무늬): 흔들리는 닫힌 곡선 여러 겹
  function contours(cx, cy, n, rx, ry, seed) {
    let d = "";
    for (let k = 1; k <= n; k++) {
      const f = k / n;
      let pth = "";
      for (let a = 0; a <= 48; a++) {
        const th = (a / 48) * Math.PI * 2;
        const w = 1 + 0.12 * Math.sin(th * 3 + seed + k) + 0.07 * Math.sin(th * 5 + seed * 2);
        const x = cx + Math.cos(th) * rx * f * w, y = cy + Math.sin(th) * ry * f * w;
        pth += (a ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
      }
      d += pth + "Z";
    }
    return d;
  }

  // RAG 지식 지도: 받침 판(격자·등고선·두 구역) + 실패 점(빛기둥) + 스킬 건물 + 안내판 + 불러오기 빛줄기
  function mapHTML(X) {
    const R = X.rag, M = MAP;
    const cont = contours(230, 200, 8, 190, 150, 1.3) + contours(650, 170, 7, 170, 120, 2.1) + contours(120, 330, 4, 90, 40, 0.4) + contours(800, 330, 4, 80, 40, 3.2);
    let h = `<div class="pm3-mapt" data-g="map" style="transform:${T3(M.x, M.y, M.z)} rotateX(90deg) scale(2) translate(-450px,-190px)">
        <svg viewBox="0 0 900 380" preserveAspectRatio="none" aria-hidden="true"><path d="${cont}"/></svg>
        <div class="dist df"></div><div class="dist ds"></div></div>
      <div class="pm3-msweep" data-g="map" data-k="msw"></div>`;
    const pin = (lx, ly, H, k, isNew) => {
      const p = mapW(lx, ly), y = M.y - 1;
      const pa = isNew ? ` data-k="np_a"` : "", pb = isNew ? ` data-k="np_b"` : "";
      return `<div class="pm3-pinp" data-g="map"${pa} style="height:${H}px;transform:${T3(p.x, y, p.z)} translate(-2px,-${H}px)"></div>
        <div class="pm3-pinr${isNew ? " nw" : ""}" data-g="map" style="transform:${T3(p.x, M.y - 2, p.z)} rotateX(90deg) translate(-22px,-22px)"></div>
        <div class="pm3-pinh${isNew ? " nw" : ""}" data-g="map" data-k="${k}"><i></i></div>`;
    };
    PINS.forEach((pp, i) => { h += pin(pp[0], pp[1], pp[2], "ph" + i, false); });
    h += pin(NEWPIN[0], NEWPIN[1], NEWPIN[2], "np_h", true);
    const bld = (b, k) => {
      const p = mapW(b[0], b[1]), w = b[2] * 2, d = b[3] * 2, H = b[4];
      const fc = (tr, ww, hh, c) => `<div class="${c || "bf"}" style="width:${ww}px;height:${hh}px;transform:${tr}"></div>`;
      return `<div class="pm3-bld${k ? " nw" : ""}" data-g="map"${k ? ` data-k="${k}"` : ""} style="transform:${T3(p.x, M.y - 1, p.z)}">` +
        fc(`translate3d(0,0,${d / 2}px) translate(-${w / 2}px,-${H}px)`, w, H) +
        fc(`rotateY(90deg) translateZ(${w / 2}px) translate(-${d / 2}px,-${H}px)`, d, H) + fc(`rotateY(-90deg) translateZ(${w / 2}px) translate(-${d / 2}px,-${H}px)`, d, H) +
        fc(`translateY(-${H}px) rotateX(90deg) translate(-${w / 2}px,-${d / 2}px)`, w, d, "bt") + `</div>`;
    };
    h += bld(NEWBLD, "nb");
    // 데이터 상자: 구역마다 높이가 다른 유리 상자(새 기록 상자와 불러오기 상자는 이름이 붙는다)
    WF.forEach((w) => { h += `<div class="pm3-wpad ${w.k}" data-g="map" style="transform:${T3(w.x, MAP.y - 1.5, w.z + 20)} rotateX(90deg) translate(-300px,-90px)"></div>`; });
    const dbox = (b, kind, key, pulse) => {
      const p = mapW(b[0], b[1]), w = b[2] * 2, d = b[3] * 2, H = b[4];
      const f = (tr, ww, hh, c, k) => `<div class="${c}"${k ? ` data-k="${k}"` : ""} style="width:${ww}px;height:${hh}px;transform:${tr}"></div>`;
      return `<div class="pm3-dbx ${kind}" data-g="map"${key ? ` data-k="${key}"` : ""} style="transform:${T3(p.x, M.y - 1, p.z)}">` +
        f(`translate3d(0,0,${d / 2}px) translate(-${w / 2}px,-${H}px)`, w, H, "bf") +
        f(`rotateY(90deg) translateZ(${w / 2}px) translate(-${d / 2}px,-${H}px)`, d, H, "bf sd") + f(`rotateY(-90deg) translateZ(${w / 2}px) translate(-${d / 2}px,-${H}px)`, d, H, "bf sd") +
        f(`translateY(-${H}px) rotateX(90deg) translate(-${w / 2}px,-${d / 2}px)`, w, d, "bt") +
        f(`translateY(-${H + 2}px) rotateX(90deg) translate(-${w}px,-${d}px)`, w * 2, d * 2, "gl", key ? key + "g" : "") +
        (pulse ? f(`translateY(-${H + 4}px) rotateX(90deg) translate(-${w * 1.5}px,-${d * 1.5}px)`, w * 3, d * 3, "pl", pulse) : "") + `</div>`;
    };
    FBX.forEach((b, i) => { h += dbox(b, "f", "", i === 1 ? "fp1" : i === 3 ? "fp3" : ""); });
    SBX.forEach((b, i) => { h += dbox(b, "s", "", i === 1 ? "sp1" : ""); });
    h += dbox(NEWF, "f rise", "rbf", "") + dbox(NEWS, "s rise", "rbs", "");
    [[NEWF, "f"], [NEWS, "s"]].forEach(([b, k]) => { const p = mapW(b[0], b[1]); h += `<div class="pm3-rring ${k}" data-g="map" data-k="rr${k}" style="transform:${T3(p.x, M.y - 3, p.z)} rotateX(90deg) translate(-70px,-70px)"></div>`; });
    [[R.sF, "f", 230], [R.sS, "s", 650]].forEach(([t, k, lx]) => {
      const p = mapW(lx, 352);
      h += `<div class="pm3-dsign ${k}" data-g="map" style="transform:${T3(p.x, -104, p.z)} translate(-220px,-78px)"><em>${esc(t[1])}</em><b>${esc(t[0])}</b><small>${esc(R.dim)}</small><i class="lt"></i></div>`;
      [-160, 160].forEach((dx) => { h += `<div class="pm3-dpost" data-g="map" style="transform:${T3(p.x + dx, -13, p.z)} translate(-4px,-13px)"></div>`; });
      h += `<div class="pm3-dbase ${k}" data-g="map" style="transform:${T3(p.x, MAP.y - 2, p.z + 6)} rotateX(90deg) translate(-240px,-27px)"></div>`;
    });
    h += `<div class="pm3-rpost" data-g="map"></div>`;
    h += `<div class="pm3-rsign" data-g="map" style="transform:${T3(M.x - 1180, -200, M.z + 120)} rotateY(18deg) translate(-260px,-98px)"><em>${esc(R.title)}</em><b>${esc(R.sub)}</b>
      <span>${esc(R.rate)} <strong data-k="rateV">55%</strong> <small>(${esc(R.ex)})</small></span></div>`;
    for (let j = 0; j < 3; j++) h += `<div class="pm3-beam3" data-k="bm${j}a"></div><div class="pm3-beam3" data-k="bm${j}b"></div>`;
    return h;
  }

  // 화면 위 겹 카드(투영 위치에 지시선으로 연결): 키/값, 새 실패 점, 새 스킬
  function kvHTML(X) {
    const R = X.rag;
    const card = (k, cls, title, lines) => `<div class="pm3-kv ${cls}" data-k="${k}"><em>${esc(title)}</em>${lines.map((l) => `<p>${esc(l)}</p>`).join("")}<i class="bc"></i></div>`;
    const E = X.eg, N = X.an;
    const eg = `<div class="pm3-effg" data-k="effg"><i class="gl" data-k="egg"></i><div class="hd"><em>${esc(E.title)}</em><b class="lv" data-k="egv">${esc(E.lv[0])}</b></div>
      <div class="bar"><i class="fill" data-k="egf"></i>${E.lv.map((l) => `<span>${esc(l)}</span>`).join("")}</div><small>${esc(E.note)}</small></div>`;
    return eg + card("kvk", "key", R.key, R.keyL) + card("kvv", "val", R.val, R.valL) + card("pinc", "pin", R.dF, [R.pin]) + card("bldc", "bld", R.dS, [R.bld]) +
      card("anc", "an", N.title, [N.l1, N.l2]) + '<i class="pm3-kvln" data-k="anl"></i><i class="pm3-kvdot" data-k="and"></i>' +
      '<i class="pm3-kvln eg" data-k="egl"></i><i class="pm3-kvdot eg" data-k="egd"></i><i class="pm3-kvln link" data-k="lnk"></i><i class="pm3-kvdot link" data-k="lnkd"></i>' +
      ["kvkl", "kvvl", "pinl", "bldl"].map((k) => `<i class="pm3-kvln" data-k="${k}"></i>`).join("") +
      ["kvkd", "kvvd", "pind", "bldd"].map((k) => `<i class="pm3-kvdot" data-k="${k}"></i>`).join("");
  }

  const BGCODE = ["retrieve(query, k=3) -> records", "upsert(record, vector)", "for r in records:", "    context.append(r.value)", "score = similarity(key, r.key)",
    "if score > 0.75: keep(r)", "index.add(tags, coords)", "log.write(step, verdict)", "plan_map.lookup(item_id)", "steps[n].tasks >= 3",
    "audit_request.json", "session.start(effort)", "rack.read(next_session)", "skill.save(pattern)", "commit(tree)"].join("\\n");

  // Main session 곁의 skill 칩·hook 칩, Subagent 3개(진행 고리 + 결과)와 연결선
  function agentHTML(X) {
    const A = X.sa;
    let h = A.skill.map((k, i) => `<div class="pm3-skc" data-k="sk${i}"><i></i>${esc(k)}</div>`).join("");
    h += `<div class="pm3-hkc" data-k="hkc">${esc(A.hook)}</div>`;
    A.n.forEach((n, i) => {
      const ring = Array.from({ length: 12 }, (_, k) => `<i data-k="sa${i}r${k}" style="transform:rotate(${k * 30}deg) translateY(-30px)"></i>`).join("");
      h += `<div class="pm3-saln" data-k="sl${i}a"></div><div class="pm3-saln" data-k="sl${i}b"></div>
        <div class="pm3-sa" data-k="sa${i}"><div class="ring" data-k="sar${i}">${ring}</div><div class="core"><svg viewBox="0 0 24 24" aria-hidden="true">${ICON.analyst}</svg></div>
        <em>${esc(A.tag)}</em><b>${esc(n[0])}</b><span data-k="sa${i}tk">${esc(n[1])}</span><div class="res" data-k="sa${i}res">${esc(n[2])}</div></div>`;
    });
    return h;
  }

  function cardHTML(X) {
    const hw = CW / 2, hh = CH / 2, ht = CT / 2;
    return `<div class="pm3-card" data-k="card">
      <div class="f fr" style="transform:translateZ(${ht}px) translate(-${hw}px,-${hh}px)">
        <b data-k="cstep">Step 4</b><span class="pm3-ceff" data-k="ceff">${esc(X.effort)} low</span>
        <i class="bar b1"></i><i class="bar b2"></i><i class="bar b3"></i>
        <div class="tint red" data-k="cred"></div><div class="tint grn" data-k="cgrn"></div>
        <div class="stamp" data-k="cstamp">${esc(X.stamp)}</div>
      </div>
      <div class="f bk" style="transform:rotateY(180deg) translateZ(${ht}px) translate(-${hw}px,-${hh}px)"></div>
      <div class="f ed" style="width:${CW}px;height:${CT}px;transform:translateY(-${hh}px) rotateX(90deg) translate(-${hw}px,-${ht}px)"></div>
      <div class="f ed" style="width:${CW}px;height:${CT}px;transform:translateY(${hh}px) rotateX(90deg) translate(-${hw}px,-${ht}px)"></div>
      <div class="f ed" style="width:${CT}px;height:${CH}px;transform:translateX(-${hw}px) rotateY(90deg) translate(-${ht}px,-${hh}px)"></div>
      <div class="f ed" style="width:${CT}px;height:${CH}px;transform:translateX(${hw}px) rotateY(90deg) translate(-${ht}px,-${hh}px)"></div>
    </div>`;
  }

  function lineHTML(ln, i) {
    const content = Array.isArray(ln.text)
      ? ln.text.map(([t, k]) => `<span class="c-${k || "fg"}">${esc(t)}</span>`).join("")
      : esc(ln.text);
    const glyph = ln.mode === "check" ? '<i class="ck0"></i><i class="ck1">✓</i>' : "";
    const cov = ln.mode === "stream" ? '<i class="cov"></i><i class="cur"></i>' : "";
    return `<div class="pm3-ln m-${ln.mode} c-${ln.cls || "fg"}${ln.hl ? " hl-" + ln.hl : ""}" data-l="${i}">${glyph}<span class="tx">${content}</span>${cov}</div>`;
  }

  function windowHTML(id, S, X) {
    if (id === "gate") {
      const P = X.phone;
      return `<div class="pm3-win pm3-phone" data-w="gate" style="${acv("gate")}"><div class="notch"></div><div class="time">9:41</div>
        <div class="ncard" data-k="ph_card"><div class="pulse" data-k="ph_pulse"></div>
          <div class="nt"><i></i>${esc(P.t1)}</div><div class="ns">${esc(P.t2)}</div>
          <div class="nb"><span class="ap">${esc(P.ap)}<i class="tap" data-k="ph_tap"></i></span><span class="lt">${esc(P.later)}</span></div>
          <div class="nok" data-k="ph_ok">${esc(P.ok)}</div></div></div>`;
    }
    const lines = S.lines.map((ln, i) => (ln.win === id ? lineHTML(ln, i) : "")).join("");
    const eff = id === "claude" ? `<span class="pm3-weff" data-k="weff">${esc(X.effort)} low</span>` : "";
    const head = id === "commit" ? `<div class="pm3-ln c-mut gh">${esc(X.gitHead)}</div>` : "";
    return `<div class="pm3-win" data-w="${id}" style="${acv(id)}"><div class="pm3-tb"><i></i><i></i><i></i><b>${esc(X.win[id])}</b>${eff}</div>
      <div class="pm3-body">${head}<div class="pm3-scr" data-k="scr_${id}">${lines}</div></div></div>`;
  }

  function stageHTML(S, X) {
    const st = ALL_IDS.map((id, i) => stationHTML(id, X, i)).join("");
    const pk = S.packets.map((p, i) => p.big
      ? `<div class="pm3-pk big" data-k="pk${i}" style="${acv(AC[p.kind] ? p.kind : "runner")}"><i></i><span class="pl"><b>${esc(p.label)}</b>${p.info ? `<small>${esc(p.info)}</small>` : ""}</span></div>`
      : `<div class="pm3-pk" data-k="pk${i}" style="${acv(AC[p.kind] ? p.kind : "runner")}"><i></i>${esc(p.label)}</div>`).join("");
    const wins = ["runner", "claude", "checks", "rule", "final", "rack", "gate", "commit"].map((id) => windowHTML(id, S, X)).join("");
    const titles = S.titles.map((tt, i) => {
      const txt = X.titles[tt.k];
      return `<div class="pm3-sec" data-k="tt${i}" style="${acv(TITLE_AC[tt.k])}"><i class="ln"></i><em>${String(i + 1).padStart(2, "0")}</em><b>${esc(txt)}</b></div>`;
    }).join("");
    const callouts = ALL_IDS.map((id, i) => `<div class="pm3-co" data-k="co_${id}" style="${acv(id)}">
      <div class="lead" data-k="cl_${id}"><i class="dot"></i><i class="ln"></i></div>
      <div class="box" data-k="cb_${id}"><em>ST.${String(i).padStart(2, "0")} · ${esc(({ claude: "LLM SESSION", rule: "AUDIT LLM", final: "AUDIT LLM" })[id] || id.toUpperCase())}</em><b>${esc(X.st[id])}</b><span>${esc(X.sub[id])}</span></div></div>`).join("");
    return `<div class="pm3-hud"><b data-k="hstep">STEP 04</b><span class="track"><i data-k="pfill"></i><i class="ms" data-k="pms"></i><i class="mt"></i></span><span class="pv"><b data-k="pval">3</b> / 10 ${esc(X.progress)}</span><span class="tc" data-k="tc">00:00.0</span></div>
    <div class="pm3-stage" role="img" aria-label="${esc(X.aria)}">
      <pre class="pm3-bgcode" aria-hidden="true">${esc(BGCODE.replace(/\\n/g, "\n"))}
${esc(BGCODE.replace(/\\n/g, "\n"))}</pre>
      <div class="pm3-view" data-k="view"><div class="pm3-world" data-k="world">
        ${floorHTML()}${terrainHTML()}<div class="pm3-scan" data-k="scan"></div>${laneHTML()}
        <div class="pm3-shadow" data-k="shadow"></div><div class="pm3-cref" data-k="cref"></div>
        ${mapHTML(X)}${st}<div class="pm3-ghost" style="transform:${T3(GH.x, -150, GH.z)} translate(-110px,-70px)"><i class="gg" data-k="ghg"></i><b>${esc(X.ghost.t)}</b><small>${esc(X.ghost.s)}</small><span class="gb" data-k="ghb">+2</span></div>${agentHTML(X)}${cardHTML(X)}${pk}<div class="pm3-pulse" data-k="pulse"></div>
      </div></div>
      <div class="pm3-fog"></div><div class="pm3-haze"></div><div class="pm3-vig" data-k="vig"></div>
      <div class="pm3-cos">${callouts}</div>
      <div class="pm3-kvl">${kvHTML(X)}</div>
      <div class="pm3-titles">${titles}</div>
      <div class="pm3-wins">${wins}</div>
      <div class="pm3-fade" data-k="fade"></div>
    </div>`;
  }

  // ---------- DOM 쓰기(값이 바뀔 때만) ----------
  const cache = (el) => el._pm || (el._pm = {});
  const tf = (el, v) => { const c = cache(el); if (c.t !== v) { c.t = v; el.style.transform = v; } };
  const op = (el, v) => { v = r3(v); const c = cache(el); if (c.o !== v) { c.o = v; el.style.opacity = String(v); } };
  const tx = (el, v) => { const c = cache(el); if (c.x !== v) { c.x = v; el.textContent = v; } };
  const vis = (el, on) => { const c = cache(el); if (c.v !== on) { c.v = on; el.style.visibility = on ? "visible" : "hidden"; } };
  const disp = (el, on) => { const c = cache(el); if (c.d !== on) { c.d = on; el.style.display = on ? "" : "none"; } };
  const latest = (arr, t) => { let r = null; for (const e of arr) { if (e.t0 > t) break; r = e; } return r; };
  const pad = (n, w) => String(Math.abs(Math.round(n))).padStart(w, "0");
  const mmss = (ms) => { const s = Math.floor(ms / 1000); return `${Math.floor(s / 60)}:${pad(s % 60, 2)}`; };
  // 시간 막대 장면: 자막(cap) 키 기준. 첫 장면은 0초부터
  const CHAPS = ["ff", "skill", "sub", "checks", "request", "fail", "retry", "pass", "next", "known", "gate", "milestone"];

  // 불꽃 입자 방향(고정 난수)
  const SPARK = Array.from({ length: NSPARK }, (_, j) => {
    const a = (j / NSPARK) * Math.PI * 2 + ((j * 37) % 11) * 0.05, sp = 230 + ((j * 53) % 7) * 35;
    return { x: Math.cos(a) * sp, y: -150 - ((j * 29) % 5) * 45, z: Math.sin(a) * sp * 0.6 };
  });

  class Motion {
    constructor(root) {
      this.root = root;
      this.lang = (root.dataset.lang || document.documentElement.lang || "en").slice(0, 2) === "ko" ? "ko" : "en";
      this.X = TXT[this.lang];
      this.S = buildScript(this.X);
      this.D = this.S.D;
      this.pageEnd = this.S.pages.map((pg, i) => { const n = this.S.pages.slice(i + 1).find((q) => q.win === pg.win); return n ? n.t0 : Infinity; });
      this.elapsed = 0; this.running = false; this.userPaused = false; this.visible = false;
      this.mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
      this.light = false;
      this.mount();
      if (this.lang === "en" && window.matchMedia && window.matchMedia("(max-width: 640px)").matches) this.setLight(true);
      this.layout(root.clientWidth || 800);
      this.applyMode();
      this.watch();
    }

    mount() {
      const X = this.X, root = this.root;
      root.classList.add("is-live", "pm3");
      const wrap = document.createElement("div");
      wrap.innerHTML = stageHTML(this.S, X);
      this.hud = wrap.children[0];
      this.stage = wrap.children[1];
      const bar = document.createElement("div");
      bar.className = "pm-bar";
      bar.innerHTML = `<p class="pm-status" aria-hidden="true"></p><div class="pm-ctl">
        <button type="button" class="pm-btn" data-act="toggle" aria-label="${esc(X.pauseA)}"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1h3v10H2zM7 1h3v10H7z"/></svg><span>${esc(X.pause)}</span></button>
        <button type="button" class="pm-btn" data-act="replay" aria-label="${esc(X.replayA)}"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1.5a4.5 4.5 0 1 1-4.3 3.2h1.6A3 3 0 1 0 6 3v1.8L3 2.3 6 0z"/></svg><span>${esc(X.replay)}</span></button></div>`;
      const note = document.createElement("p");
      note.className = "pm-static-note";
      note.textContent = X.staticNote;
      root.insertBefore(note, root.firstChild);
      root.insertBefore(bar, root.firstChild);
      root.insertBefore(this.stage, root.firstChild);
      root.insertBefore(this.hud, root.firstChild);
      const demo = document.createElement("p");
      demo.className = "pm-demo";
      demo.textContent = X.demo;
      bar.after(demo);
      this.buildSeek(demo);
      this.statusEl = bar.querySelector(".pm-status");
      this.btnToggle = bar.querySelector('[data-act="toggle"]');
      this.btnToggle.addEventListener("click", () => { this.userPaused = !this.userPaused; this.syncButton(); this.update(); });
      bar.querySelector('[data-act="replay"]').addEventListener("click", () => { this.userPaused = false; this.elapsed = 0; this.wrapped = false; this.syncButton(); this.render(0); this.update(); });
      const q = (this.q = {});
      this.stage.querySelectorAll("[data-k]").forEach((el) => { q[el.getAttribute("data-k")] = el; });
      this.hud.querySelectorAll("[data-k]").forEach((el) => { q[el.getAttribute("data-k")] = el; });
      this.wins = {};
      this.stage.querySelectorAll("[data-w]").forEach((el) => { this.wins[el.getAttribute("data-w")] = el; });
      this.laneO = [...this.stage.querySelectorAll("[data-ln]")];
      this.laneG = [...this.stage.querySelectorAll("[data-lg]")];
      this.retEls = [...this.stage.querySelectorAll("[data-rt]")];
      this.laneSeg = [...this.stage.querySelectorAll("[data-lseg]")];
      this.wrapped = false;
      // 화면 밖 무리 숨기기용: 상태로 켜고 끄는 요소(data-k)는 각 그리기 함수가 무리 표시와 함께 처리
      this.gEls = { map: [] };
      this.gAll = { map: [] };
      this.stage.querySelectorAll("[data-g]").forEach((el) => {
        const g = el.getAttribute("data-g");
        this.gAll[g].push(el);
        if (!el.hasAttribute("data-k")) this.gEls[g].push(el);
      });
      this.gv = { map: true };
      // 지도는 갑자기 나타나지 않게 잎 요소 투명도로 서서히(건물은 면마다)
      this.mapFade = [...this.stage.querySelectorAll('[data-g="map"]:not(.pm3-bld):not(.pm3-dbx), .pm3-bld > div, .pm3-dbx > div:not(.pl)')];
      // 불러오기 빛줄기: 지도 점 → Claude Code 판 위(고정 경로, 길이만 자란다)
      const B = { x: stPos("claude").x, y: -228, z: stPos("claude").z + 4 };
      const pk = [boxTop(FBX[1]), boxTop(FBX[3]), boxTop(SBX[1])];
      const src = pk.map((p) => ({ x: p.x, z: p.z })), srcY = pk.map((p) => p.y);
      this.beamT = src.map((a0, j) => {
        const A = { x: a0.x, y: srcY[j], z: a0.z }, dx = B.x - A.x, dy = B.y - A.y, dz = B.z - A.z;
        const hz = Math.hypot(dx, dz), L = Math.hypot(hz, dy), yaw = Math.atan2(-dz, dx) * 180 / Math.PI, rz = Math.atan2(dy, hz) * 180 / Math.PI;
        q["bm" + j + "a"].style.width = q["bm" + j + "b"].style.width = Math.round(L) + "px";
        const base = `${T3(A.x, A.y, A.z)} rotateY(${r1(yaw)}deg) rotateZ(${r1(rz)}deg)`;
        return { a: `${base} translate(0,-1.5px)`, b: `${base} rotateX(90deg) translate(0,-1.5px)` };
      });
      this.anchors = {
        key: { x: src[0].x, y: srcY[0], z: src[0].z }, val: { x: src[2].x, y: srcY[2], z: src[2].z },
        pin: boxTop(NEWF), bld: boxTop(NEWS),
        claude: { x: stPos("claude").x, y: -226, z: stPos("claude").z + 4 },
      };
      this.lineEls = this.S.lines.map((ln, i) => {
        const g = this.stage.querySelector(`[data-l="${i}"]`);
        return { g, txt: g.querySelector(".tx"), cov: g.querySelector(".cov"), cur: g.querySelector(".cur"),
          ck0: g.querySelector(".ck0"), ck1: g.querySelector(".ck1"), len: 0,
          chars: Array.isArray(ln.text) ? ln.text.map((a) => a[0]).join("").length : String(ln.text).length };
      });
    }

    syncButton() {
      const X = this.X, paused = this.userPaused;
      this.btnToggle.setAttribute("aria-label", paused ? X.playA : X.pauseA);
      this.btnToggle.querySelector("span").textContent = paused ? X.play : X.pause;
      this.btnToggle.querySelector("path").setAttribute("d", paused ? "M2.5 1l8 5-8 5z" : "M2 1h3v10H2zM7 1h3v10H7z");
    }

    // 무대 크기가 바뀔 때만 실행(매 프레임 아님): 카메라 값, 창 크기, 글자 폭 재기
    layout(width) {
      const W = Math.round(width);
      if (this.W === W) return;
      this.W = W;
      const nar = W < 700;
      const H = nar ? Math.round(Math.min(660, Math.max(540, W * 1.66))) : Math.round(W * 0.56);
      this.H = H; this.nar = nar;
      this.root.setAttribute("data-layout", nar ? "narrow" : "wide");
      this.stage.style.height = H + "px";
      const ww = nar ? W - 16 : Math.min(460, Math.round(W * 0.44)), wh = nar ? 222 : 236;
      this.cam = nar
        ? { map: [{ tx: -920, ty: -110, tz: -650, yaw: -8, tilt: 32, D: 2100 }, { tx: -740, ty: -150, tz: -980, yaw: -6, tilt: 20, D: 1150 }, { tx: 100, ty: -150, tz: -1000, yaw: -6, tilt: 20, D: 1150 }, { tx: 560, ty: -170, tz: -360, yaw: -4, tilt: 26, D: 1750 }],
          rsF: { tx: -1500, ty: -200, tz: -1050, yaw: -26, tilt: 14, D: 300 }, pkF: { dx: 0, dy: 10, yaw: -10, tilt: 15, D: 360 },
          subF: { tx: -1225, ty: -290, tz: -140, yaw: -8, tilt: 9, D: 480 }, revF: { tx: -250, ty: -230, tz: -620, yaw: -4, tilt: 36, D: 4900 },
          P: 640, D: 700, Dc: 150, Dw: 2300, tilt: 22, tiltW: 33, yaw: -10, ox: W / 2, oy: H * 0.35, wx: W / 2, wy: H - 10 - wh / 2, ty: H * 0.2, coW: 150 }
        : { map: [{ tx: -650, ty: -110, tz: -650, yaw: -10, tilt: 30, D: 1450 }, { tx: -900, ty: -160, tz: -980, yaw: -8, tilt: 18, D: 640 }, { tx: -60, ty: -160, tz: -1000, yaw: -8, tilt: 18, D: 640 }, { tx: 160, ty: -190, tz: -360, yaw: -6, tilt: 22, D: 1050 }],
          rsF: { tx: -1610, ty: -175, tz: -1030, yaw: -26, tilt: 13, D: 230 }, pkF: { dx: -60, dy: 20, yaw: -12, tilt: 15, D: 210 },
          subF: { tx: -1400, ty: -290, tz: -140, yaw: -16, tilt: 9, D: 120 }, revF: { tx: -560, ty: -230, tz: -600, yaw: -4, tilt: 30, D: 2900 },
          P: 900, D: 640, Dc: 40, Dw: 1900, tilt: 20, tiltW: 32, yaw: -15, ox: W * 0.34, oy: H * 0.57, wx: W - 24 - ww / 2, wy: H * 0.53, ty: H * 0.3, coW: 180 };
      this.ww = ww; this.wh = wh;
      // RAG 서버 안내판: 좁은 화면에서는 폭을 줄여 줄을 바꾼다(근접 장면에서 글자를 크게 보이게)
      const rsn = this.stage.querySelector(".pm3-rsign"), RS = nar ? [360, 236] : [520, 196];
      rsn.style.width = RS[0] + "px"; rsn.style.height = RS[1] + "px";
      rsn.style.transform = `${T3(MAP.x - 1180, -200, MAP.z + 120)} rotateY(18deg) translate(-${RS[0] / 2}px,-${RS[1] / 2}px)`;
      const post = this.stage.querySelector(".pm3-rpost"), ph = Math.round(200 - RS[1] / 2);
      post.style.height = ph + "px";
      post.style.transform = `${T3(MAP.x - 1180, -ph, MAP.z + 120)} rotateY(18deg) translate(-5px,0)`;
      const v = this.q.view, w = this.q.world;
      v.style.perspective = this.cam.P + "px";
      v.style.perspectiveOrigin = `${r1(this.cam.ox)}px ${r1(this.cam.oy)}px`;
      w.style.left = r1(this.cam.ox) + "px"; w.style.top = r1(this.cam.oy) + "px";
      Object.values(this.wins).forEach((el) => { el.style.width = ww + "px"; el.style.height = wh + "px"; });
      this.wsz = {};
      Object.keys(this.wins).forEach((id) => { this.wsz[id] = id === "gate" ? (nar ? { w: 204, h: 222 } : { w: 214, h: 236 }) : { w: ww, h: wh }; });
      Object.values(this.q).forEach((el) => { if (el._pm) el._pm.t = undefined; });
      // 겹 카드 자리(화면 기준, 크기 바뀔 때만 계산)
      const kw = nar ? Math.round(W / 2 - 14) : 260;
      ["kvk", "kvv", "pinc", "bldc", "anc"].forEach((k) => { this.q[k].style.width = kw + "px"; });
      this.egW = this.q.effg.offsetWidth; this.egH = this.q.effg.offsetHeight;
      this.kvLay = { w: kw, kh: this.q.kvk.offsetHeight, vh: this.q.kvv.offsetHeight, ph: this.q.pinc.offsetHeight, bh: this.q.bldc.offsetHeight, ah: this.q.anc.offsetHeight,
        kx: nar ? 8 : Math.round(W * 0.04), vx: nar ? Math.round(W / 2 + 6) : Math.round(W * 0.70), y: nar ? 10 : Math.round(H * 0.06) };
      this.lineEls.forEach((e) => { if (e.cov) { e.len = e.txt.offsetWidth; e.cov.style.width = (e.len + 4) + "px"; } });
      this.render(this.frameTime());
    }

    mapT(e) { return e < this.D ? e : this.S.I + ((e - this.S.I) % this.S.L); }
    frameTime() { return this.isStatic() ? this.S.marks.fail : this.mapT(this.elapsed); }
    isStatic() { return !!this.mq.matches; }
    applyMode() { this.root.classList.toggle("is-static", this.isStatic()); this.render(this.frameTime()); this.update(); }

    watch() {
      if ("ResizeObserver" in window) {
        new ResizeObserver((es) => { const w = es[0].contentRect.width; if (w) this.layout(w); }).observe(this.root);
      }
      if ("IntersectionObserver" in window) {
        new IntersectionObserver((es) => { this.visible = es[es.length - 1].isIntersecting; this.update(); }, { threshold: 0.2 }).observe(this.root);
      } else { this.visible = true; }
      document.addEventListener("visibilitychange", () => this.update());
      const onMq = () => this.applyMode();
      if (this.mq.addEventListener) this.mq.addEventListener("change", onMq); else if (this.mq.addListener) this.mq.addListener(onMq);
    }

    update() {
      const go = this.visible && !document.hidden && !this.userPaused && !this.isStatic();
      if (go && !this.running) { this.running = true; this.last = performance.now(); this.raf = requestAnimationFrame((n) => this.tick(n)); }
      else if (!go && this.running) { this.running = false; cancelAnimationFrame(this.raf); }
    }

    tick(now) {
      if (!this.running) return;
      // 처음 2초 동안 프레임 수를 세어 너무 느리면 가벼운 모드로
      if (!this.probed) {
        const pb = this.pb || (this.pb = { t0: now, n: 0 });
        pb.n++;
        if (now - pb.t0 >= 2000) { this.probed = true; if ((pb.n * 1000) / (now - pb.t0) < 45) this.setLight(true); }
      }
      this.elapsed += Math.min(64, Math.max(0, now - this.last));
      this.last = now;
      this.wrapped = this.elapsed >= this.D;
      this.render(this.mapT(this.elapsed));
      this.raf = requestAnimationFrame((n) => this.tick(n));
    }

    // 유튜브식 시간 막대(장면 구간으로 나뉜 막대 + 장면 목록). 누르거나 끌면 그 시각으로 이동하고 재생 상태는 그대로 둔다
    buildSeek(after) {
      const X = this.X, S = this.S, D = this.D;
      const at = (k) => { const c = S.caps.find((o) => o.k === k); return c ? c.t0 : null; };
      const ch = (this.chaps = CHAPS.filter((k, i) => !i || at(k) !== null).map((k, i) => ({ k, t0: i ? at(k) : 0, name: X.chap[k] })));
      ch.forEach((c, i) => { c.t1 = i + 1 < ch.length ? ch[i + 1].t0 : D; });
      const pct = (v) => r3((v / D) * 100);
      const sk = document.createElement("div");
      sk.className = "pm-seek";
      sk.innerHTML = `<div class="pm-track" role="slider" tabindex="0" aria-label="${esc(X.seekA)}" aria-valuemin="0" aria-valuemax="${Math.round(D / 1000)}">${
        ch.map((c) => `<span class="pm-chap" style="left:${pct(c.t0)}%;width:${pct(c.t1 - c.t0)}%"><i></i></span>`).join("")
      }<span class="pm-knob"></span><span class="pm-tip" hidden><b></b><span></span></span></div><span class="pm-time"><b>0:00</b> / ${mmss(D)}</span>`;
      this.stage.after(sk);
      const ol = document.createElement("ol");
      ol.className = "pm-chlist";
      ol.setAttribute("aria-label", X.chapH);
      ol.innerHTML = ch.map((c, i) => `<li><button type="button" data-i="${i}"><time>${mmss(c.t0)}</time><span>${esc(c.name)}</span></button></li>`).join("");
      after.after(ol);
      const track = sk.querySelector(".pm-track");
      this.sk = { track, knob: sk.querySelector(".pm-knob"), tip: sk.querySelector(".pm-tip"), time: sk.querySelector(".pm-time b"),
        chEls: [...sk.querySelectorAll(".pm-chap")], fills: [...sk.querySelectorAll(".pm-chap i")], btns: [...ol.querySelectorAll("button")] };
      ol.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) this.seekTo(ch[+b.dataset.i].t0 + 1); });
      this.seekEvents(track);
    }

    seekEvents(track) {
      const E = this.sk, D = this.D;
      const tAt = (x) => { const r = track.getBoundingClientRect(); return clamp((x - r.left) / (r.width || 1)) * D; };
      const chAt = (t) => { let i = 0; this.chaps.forEach((c, j) => { if (t >= c.t0) i = j; }); return i; };
      const tip = (x, on) => {
        E.chEls.forEach((el) => el.classList.remove("is-hover"));
        if (!on) { E.tip.hidden = true; return; }
        const t = tAt(x), i = chAt(t), r = track.getBoundingClientRect();
        E.chEls[i].classList.add("is-hover");
        E.tip.children[0].textContent = mmss(t); E.tip.children[1].textContent = this.chaps[i].name; E.tip.hidden = false;
        const hw = E.tip.offsetWidth / 2;
        E.tip.style.left = Math.max(hw, Math.min(r.width - hw, x - r.left)) + "px";
      };
      let drag = false;
      track.addEventListener("pointerdown", (e) => { drag = true; track.classList.add("is-drag"); track.setPointerCapture(e.pointerId); this.seekTo(tAt(e.clientX)); tip(e.clientX, true); });
      track.addEventListener("pointermove", (e) => { if (drag) this.seekTo(tAt(e.clientX)); if (drag || e.pointerType === "mouse") tip(e.clientX, true); });
      const end = (e) => { drag = false; track.classList.remove("is-drag"); if (e.pointerType !== "mouse") tip(0, false); };
      track.addEventListener("pointerup", end);
      track.addEventListener("pointercancel", end);
      track.addEventListener("pointerleave", () => { if (!drag) tip(0, false); });
      track.addEventListener("keydown", (e) => {
        const t = this.mapT(this.elapsed), i = chAt(t);
        const go = { ArrowLeft: t - 5000, ArrowRight: t + 5000, Home: 0, End: D - 1,
          PageUp: this.chaps[Math.max(0, t - this.chaps[i].t0 < 1500 ? i - 1 : i)].t0 + 1, PageDown: (this.chaps[i + 1] || { t0: D - 1 }).t0 + 1 }[e.key];
        if (go === undefined) return;
        e.preventDefault(); this.seekTo(go);
      });
    }

    seekTo(ms) {
      const t = Math.max(0, Math.min(this.D - 1, ms));
      this.elapsed = t; this.wrapped = false; this.last = performance.now();
      this.render(t);
    }

    syncSeek(t) {
      const E = this.sk;
      if (!E) return;
      const v = Math.round((t / this.D) * 2000);
      if (v === E.v) return;
      E.v = v;
      E.knob.style.left = v / 20 + "%";
      let cur = 0;
      this.chaps.forEach((c, i) => {
        if (t >= c.t0) cur = i;
        const f = r3(clamp((t - c.t0) / (c.t1 - c.t0)));
        if (E.fills[i]._f !== f) { E.fills[i]._f = f; E.fills[i].style.transform = `scaleX(${f})`; }
      });
      const sec = Math.floor(t / 1000);
      if (sec !== E.sec) {
        E.sec = sec; E.time.textContent = mmss(t);
        E.track.setAttribute("aria-valuenow", String(sec));
        E.track.setAttribute("aria-valuetext", `${mmss(t)} · ${this.chaps[cur].name}`);
      }
      if (cur !== E.cur) { E.cur = cur; E.btns.forEach((b, i) => { if (i === cur) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current"); }); }
    }

    seek(ms) { this.userPaused = true; this.syncButton(); this.update(); this.elapsed = ms; this.wrapped = false; this.render(Math.min(ms, this.D - 1)); }

    // CSS 원근과 같은 계산으로 월드 점을 화면 좌표로
    project(p, C) {
      const x = p.x - C.tx, y = p.y - C.ty, z = p.z - C.tz;
      const ay = C.yaw * Math.PI / 180, ax = -C.tilt * Math.PI / 180;
      const x1 = x * Math.cos(ay) + z * Math.sin(ay), z1 = -x * Math.sin(ay) + z * Math.cos(ay);
      const y2 = y * Math.cos(ax) - z1 * Math.sin(ax), z2 = y * Math.sin(ax) + z1 * Math.cos(ax) - C.D;
      const ar = (C.roll || 0) * Math.PI / 180, xr = x1 * Math.cos(ar) - y2 * Math.sin(ar), yr = x1 * Math.sin(ar) + y2 * Math.cos(ar);
      const f = this.cam.P / (this.cam.P - z2);
      return { x: this.cam.ox + xr * f, y: this.cam.oy + yr * f + (this.vShift || 0) };
    }

    inView(pts, C) {
      let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
      const ay = C.yaw * Math.PI / 180, ax = -C.tilt * Math.PI / 180, P = this.cam.P;
      for (const p of pts) {
        const x = p[0] - C.tx, y = p[1] - C.ty, z = p[2] - C.tz;
        const x1_ = x * Math.cos(ay) + z * Math.sin(ay), z1 = -x * Math.sin(ay) + z * Math.cos(ay);
        const y2 = y * Math.cos(ax) - z1 * Math.sin(ax), z2 = y * Math.sin(ax) + z1 * Math.cos(ax) - C.D;
        if (P - z2 < 1) return true;
        const ar = (C.roll || 0) * Math.PI / 180, xr = x1_ * Math.cos(ar) - y2 * Math.sin(ar), yr = x1_ * Math.sin(ar) + y2 * Math.cos(ar);
        const f = P / (P - z2), sx = this.cam.ox + xr * f, sy = this.cam.oy + yr * f + (this.vShift || 0);
        x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy);
      }
      return !(x1 < -60 || x0 > this.W + 60 || y1 < -60 || y0 > this.H + 60);
    }

    // 패킷 위치: 유리판과 겹치지 않게 판 앞쪽에서 출발·도착, 큰 패킷은 낮게 난다
    pkPos(p, u, s, cp) {
      const a0 = p.from === "final" && (p.to === "rack" || p.to === "known") && s.card.u < 6.5 ? { x: cp.x, y: cp.y, z: cp.z } : stPos(p.from), b0 = stPos(p.to), k = ease(u);
      const off = p.big ? 140 : 50;
      const a = { x: a0.x, y: a0.y - 20, z: a0.z + off }, b = { x: b0.x, y: b0.y - 20, z: b0.z + off };
      return { x: a.x + (b.x - a.x) * k, z: a.z + (b.z - a.z) * k, y: a.y + (b.y - a.y) * k - (p.big ? 80 : 200) * Math.sin(Math.PI * k) };
    }

    cardPos(s) {
      const c = s.card;
      if (c.mode === "ret") { const p = retPt(c.r); return { x: p.x, y: CARD_Y - 50 * Math.sin(Math.PI * c.r), z: p.z }; }
      const p = lanePt(c.u);
      return { x: p.x, y: CARD_Y, z: p.z };
    }

    render(t) {
      const q = this.q, S = this.S, X = this.X, cam = this.cam;
      if (!cam) return;
      this.syncSeek(t);
      SA = this.nar ? SA_N : SA_W;
      const s = baseState();
      for (const g of S.segs) { if (g.t0 > t) break; g.fn(s, g.dur ? clamp((t - g.t0) / g.dur) : 1); }
      const still = this.isStatic(), intro = t < S.I;
      const lt = intro ? 0 : t - S.I; // 반복 구간 안 시각: 주기 움직임을 한 바퀴 길이에 맞춰 경계에서 끊기지 않게
      const per = (n) => Math.sin((2 * Math.PI * n * lt) / S.L);
      // 창 펼침 정도(카메라 밀어 들어가기에도 씀)
      const shown = {};
      let winK = 0;
      const RISE = 380 * S.K, FOLD = 300 * S.K;
      for (const o of S.opens) {
        if (t < o.t0 || t > o.t1 + FOLD) continue;
        const k = t < o.t1 ? ease(clamp((t - o.t0) / RISE)) : 1 - ease(clamp((t - o.t1) / FOLD));
        shown[o.w] = Math.max(shown[o.w] || 0, k); winK = Math.max(winK, k);
      }
      let push = 0;
      for (const o of S.opens) {
        if (t < o.t0) break;
        const pin = expo(clamp((t - o.t0) / (950 * S.K))), pout = t > o.t1 ? expo(clamp((t - o.t1) / (800 * S.K))) : 0;
        push = Math.max(push, pin * (1 - pout));
      }
      if (still) push = 1;
      // 좁은 화면: 창이 없을 때는 3D 무대를 아래로 내린다(창보다 늦고 느리게, 한꺼번에 움직이지 않게)
      let vk = 0;
      for (const o of S.opens) {
        if (t < o.t0) break;
        const vin = ease(clamp((t - o.t0) / (600 * S.K))), vout = t > o.t1 ? ease(clamp((t - o.t1 - 200 * S.K) / (1100 * S.K))) : 0;
        vk = Math.max(vk, vin * (1 - vout));
      }
      if (still) vk = 1;
      this.vShift = this.nar ? (1 - vk) * this.H * 0.17 : 0;
      // 카메라 샷: 전경(wide) ↔ 카드 따라가기, 창이 열리면 밀어 들어가고, 이동 중엔 휘돈다(whip)
      const cp = this.cardPos(s), wd = s.wide;
      const orbit = still ? 0 : per(18) * 4, dolly = still ? 0 : per(15) * 30;
      const Cl = {
        tx: cp.x + (-300 - cp.x) * wd, ty: -70 + 30 * wd - 42 * push * (1 - wd), tz: cp.z + (-300 - cp.z) * wd - 50 * push * (1 - wd),
        yaw: cam.yaw + orbit + s.whip * 11 - 8 * wd + 18 * s.orb, tilt: cam.tilt + (cam.tiltW - cam.tilt) * wd + 4 * s.orb,
        D: cam.D + dolly * (1 - push) + (cam.Dw - cam.D) * wd - (cam.D - cam.Dc) * push * (1 - wd) + 70 * s.orb,
      };
      // 소개 카메라(기획서 → PC)와 반복 구간 카메라를 섞는다(값이 끊기지 않게)
      const C = {};
      ["tx", "ty", "tz", "yaw", "tilt", "D"].forEach((f) => {
        const cm = cam.map[s.mapTx + 1][f];
        C[f] = Cl[f] + (cm - Cl[f]) * s.mapv;
      });
      C.roll = 0;
      // 위치는 먼저, 회전은 조금 늦게 따라가서 카메라가 곡선을 그리며 움직인다
      const blend = (F, w) => {
        if (w <= 0) return;
        const wr = ss(clamp((w - 0.15) / 0.85));
        ["tx", "ty", "tz", "D"].forEach((f) => { C[f] += (F[f] - C[f]) * w; });
        ["yaw", "tilt", "roll"].forEach((f) => { C[f] += ((F[f] || 0) - C[f]) * wr; });
      };
      // 처음: 높은 곳에서 크레인으로 내려오며 다가온다
      if (s.est > 0) { C.D += 520 * s.est; C.yaw += 7 * s.est; C.ty -= 420 * s.est; C.tilt += 18 * s.est; }
      // Subagent 장면: Main session 위로 올라가 가지들을 비스듬히 보며 천천히 돈다
      if (s.subc > 0) { const F = cam.subF, h = s.subh; blend({ tx: F.tx + 40 * h, ty: F.ty, tz: F.tz, yaw: F.yaw + 12 * h, tilt: F.tilt, D: F.D - 60 * h, roll: 0 }, s.subc); }
      // RAG 서버 안내판: 지도 위 실제 물체로 남겨 두고, 카메라가 비스듬히 날아가 가까이 본 뒤 천천히 흐른다
      if (s.rs > 0) {
        const F = cam.rsF, h = s.rsh;
        blend({ tx: F.tx + 50 * h, ty: F.ty, tz: F.tz, yaw: F.yaw + 9 * h, tilt: F.tilt - 3 * h, D: F.D - 45 * h, roll: 0 }, s.rs);
        const arc = Math.sin(Math.PI * s.rs);
        C.ty -= 150 * arc; C.roll += 2.5 * arc;
      }
      // 검수 요청·판정 패킷: 뒤에서 따라가는 추적 샷(조금 앞을 보고, 곡선에서 살짝 기운다)
      if (s.fw > 0 && s.fpk) {
        const P = s.fpk, u = clamp((t - P.t0) / P.dur), G = cam.pkF, bump = Math.sin(Math.PI * u);
        const A = this.pkPos(P, u, s, cp), B = this.pkPos(P, Math.min(1, u + 0.14), s, cp);
        const e0 = this.pkPos(P, 0, s, cp), e1 = this.pkPos(P, 1, s, cp), sg = Math.sign(e1.x - e0.x) || 1, ld = (this.nar ? 0 : 0.45) * bump;
        blend({ tx: A.x + (B.x - A.x) * ld + G.dx, ty: A.y + (B.y - A.y) * ld + G.dy, tz: A.z + (B.z - A.z) * ld, yaw: G.yaw + 16 * sg * bump,
          tilt: G.tilt, D: G.D + 60 * bump, roll: -4 * sg * bump }, s.fw);
      }
      // 마일스톤 끝: 크게 물러나며 길·지도·Known issues를 한 화면에
      if (s.rev > 0) blend(cam.revF, s.rev);
      tf(q.world, `translateZ(${r1(-C.D)}px) rotateZ(${r1(C.roll)}deg) rotateX(${r1(-C.tilt)}deg) rotateY(${r1(C.yaw)}deg) ${T3(-C.tx, -C.ty, -C.tz)}`);
      const bill = `rotateY(${r1(-C.yaw)}deg) rotateX(${r1(C.tilt)}deg) rotateZ(${r1(-C.roll)}deg)`;
      op(q.vig, still ? 0 : clamp(Math.max(s.rs * 0.9, s.fw * 0.7, s.subc * 0.6, s.orb * 0.5)));
      // 카드
      const ma = Math.max(s.mapv, 1 - vk); // 창이 닫힌 뒤 약 1초에 걸쳐 서서히
      const box = (xa, xb, ya, yb, za, zb) => [[xa, ya, za], [xb, ya, za], [xa, yb, za], [xb, yb, za], [xa, ya, zb], [xb, ya, zb], [xa, yb, zb], [xb, yb, zb]];
      this.gv = {
        map: ma > 0.01 && this.inView(box(MAP.x - 1450, MAP.x + 900, -330, -2, MAP.z - 380, MAP.z + 450), C),
      };
      // 화면 밖 무리는 3D 층 목록에서 아예 빠지게 display:none(바뀔 때만 한 번 씀)
      ["map"].forEach((g) => { this.gAll[g].forEach((el) => disp(el, this.gv[g])); this.gEls[g].forEach((el) => vis(el, this.gv[g])); });
      if (this.gv.map) this.mapFade.forEach((el) => op(el, ma));
      ALL_IDS.forEach((id) => { const el = q["st_" + id], fin = stPos(id); vis(el, true); tf(el, T3(fin.x, 0, fin.z)); });
      // 카드: 입장·퇴장 때 크기 0에서 자라고 줄어든다(순간 이동처럼 보이지 않게)
      const cs = s.card.mode === "lane" ? clamp((s.card.u + 1) / 0.45) * clamp((7 - s.card.u) / 0.45) : 1, csv = Math.max(0.01, cs);
      vis(q.card, cs > 0.01); vis(q.shadow, cs > 0.01); vis(q.cref, cs > 0.01);
      const bob = still ? 0 : per(117) * 5;
      tf(q.card, `${T3(cp.x, cp.y + bob, cp.z)} rotateY(${r1(-C.yaw * 0.55 + per(36) * 7 - s.whip * 10)}deg) rotateX(${r1(-6 + per(47) * 3)}deg) scale(${r3(csv)})`);
      tf(q.cref, `${T3(cp.x, -(cp.y + bob), cp.z)} rotateY(${r1(-C.yaw * 0.55)}deg) scale(${r3(csv)},${r3(-csv)}) translate(-68px,-44px)`);
      op(q.cref, 0.8 - 0.5 * s.card.red);
      tf(q.shadow, `${T3(cp.x, Y.shadow, cp.z)} rotateX(90deg) scale(${r3(csv * (1 - (cp.y - CARD_Y) / 220))}) translate(-80px,-28px)`);
      tx(q.cstep, "Step " + s.card.step);
      const ef = `${X.effort} ${LEVELS[s.card.effort]}`;
      tx(q.ceff, ef); tx(q.weff, ef);
      const efc = cache(q.ceff);
      if (efc.bg !== s.card.effort) { efc.bg = s.card.effort; q.ceff.style.background = LEVEL_BG[s.card.effort]; q.weff.style.background = LEVEL_BG[s.card.effort]; }
      tf(q.ceff, `scale(${r3(1 + 0.6 * s.card.ep)})`);
      op(q.cred, s.card.red * 0.85); op(q.cgrn, s.card.green * 0.8);
      op(q.cstamp, clamp(s.card.stamp * 2));
      tf(q.cstamp, `rotate(-9deg) scale(${r3(1.7 - 0.7 * back(s.card.stamp))})`);
      // 길: 지나온 곳은 정거장 색, PASS 뒤 남은 길은 초록불, 빛 줄기는 늘 흐른다
      const N = this.laneO.length, cu = s.card.mode === "lane" ? s.card.u : 1;
      for (let k = 0; k < N; k++) {
        const u0 = -1 + (8 * k) / N, du = 8 / N;
        op(this.laneSeg[k], clamp((s.reveal * 1.2 - (lanePt(u0 + du / 2).x + 1800) / 3000) / 0.15));
        tf(this.laneO[k], `scaleX(${r3(clamp((cu - u0) / du))})`); op(this.laneO[k], s.trail); op(this.laneG[k], s.trail);
        const g = u0 >= 4 && u0 < 6 ? clamp((s.greenRun * 2 - (u0 - 4)) / du) : 0;
        tf(this.laneG[k], `scaleX(${r3(g)})`);
      }
      for (let k = 0; k < 4; k++) {
        const u = (((still ? 0.3 : (lt * 18) / S.L) + k / 4) % 1) * 7.6 - 0.8, a = lanePt(u), b = lanePt(u + 0.02);
        tf(q["ch" + k], `${T3(a.x, Y.chase, a.z)} rotateY(${r1(angDeg(a, b))}deg) rotateX(90deg) translate(-27px,-4px)`);
        op(q["ch" + k], intro ? 0 : Math.sin(Math.PI * clamp((u + 0.8) / 7.6)));
      }
      tf(q.scan, `${T3(((still ? 0.4 : ((lt * 12) / S.L) % 1) * 3400) - 1700, -1, -120)} rotateX(90deg) translate(-110px,-700px)`);
      // 빨간 맥박이 되돌아가는 호를 달린다
      const pu = s.pulse;
      this.retEls.forEach((el, k) => { const d = Math.abs(k / 14 - pu); op(el, s.reveal * (pu >= 0 ? 0.25 + 0.75 * clamp(1 - d * 6) : 0.22)); });
      if (pu >= 0) {
        const p = retPt(pu);
        tf(q.pulse, `${T3(p.x, -18, p.z)} ${bill} translate(-16px,-16px)`);
        op(q.pulse, Math.min(1, pu * 8, (1 - pu) * 8));
      } else op(q.pulse, 0);
      // 정거장: 빛·빛기둥·✓/✕, 멀리 있는 정거장은 흐리게(피사계 심도 느낌)
      const glow = {};
      ALL_IDS.forEach((id) => {
        let gl = !LANE_IDS.includes(id) || intro ? 0 : clamp(1 - Math.abs(cu - LANE_IDS.indexOf(id)) * 1.6);
        if (id === "checks") gl = Math.max(gl, s.hk * 0.9);
        if (id === "claude" && !intro) gl = Math.max(gl, 0.2 + 0.14 * (0.5 + 0.5 * per(46)));
        if (id === "analyst" && !intro) gl = Math.max(gl, 0.18 + 0.16 * (0.5 + 0.5 * per(31)));
        if (s.card.mode === "ret") gl = id === "claude" ? s.card.r : id === "final" ? 1 - s.card.r : 0;
        if (shown[id]) gl = Math.max(gl, shown[id]);
        glow[id] = gl;
      });
      S.packets.forEach((p, i) => {
        const el = q["pk" + i], u = (t - p.t0) / p.dur;
        if (u < 0 || u > 1) { op(el, 0); vis(el, false); return; }
        vis(el, true);
        const { x, y, z } = this.pkPos(p, u, s, cp);
        tf(el, `${T3(x, y, z)} ${bill} translate(-50%,-50%)`);
        op(el, Math.min(1, u / 0.08, (1 - u) / 0.08));
        glow[p.from] = Math.max(glow[p.from] || 0, 1 - u * 2);
        glow[p.to] = Math.max(glow[p.to] || 0, u * 2 - 1);
      });
      ALL_IDS.forEach((id) => {
        const sp = stPos(id), far = clamp((Math.abs(sp.x - C.tx) - 380) / 800);
        op(q["sl_" + id], 1 - 0.55 * far * (1 - wd));
        op(q["sg_" + id], glow[id]);
        op(q["bm_" + id], (0.18 + 0.82 * glow[id]) * (1 - 0.6 * far) * (1 - s.rs));
        const m = s.mark[id];
        op(q[`mk_${id}_ok`], m && m.k === "ok" ? m.v : 0);
        op(q[`mk_${id}_ng`], m && m.k === "ng" ? m.v : 0);
        tf(q[`mk_${id}_ok`], `scale(${r3(m && m.k === "ok" ? back(m.v) : 0.5)})`);
      });
      // 지시선 설명: 창이 닫혀 있을 때 다가가는 정거장에
      ALL_IDS.forEach((id) => {
        const el = q["co_" + id];
        let v = !LANE_IDS.includes(id) ? 0 : clamp(1 - Math.abs(cu - LANE_IDS.indexOf(id)) * 1.5);
        if (id === "rack") v = s.card.mode === "lane" && Math.abs(cu - 4) < 0.3 && glow.rack > 0.5 ? 1 : 0;
        v *= (1 - winK) * (1 - wd) * (1 - s.mapv) * (1 - s.eg) * (1 - s.fw) * (1 - s.subc) * (1 - s.rs) * (1 - Math.max(Math.sin(Math.PI * s.sk[0]), Math.sin(Math.PI * s.sk[1])));
        if (v <= 0.01 || still || intro) { op(el, 0); return; }
        const sp = stPos(id), a = this.project({ x: sp.x + 110, y: -220, z: sp.z }, C);
        if (a.y < 140) { op(el, 0); return; } // 위쪽 공간이 모자라거나 타이틀이 떠 있으면 설명을 숨긴다
        const flip = a.x + 40 + cam.coW > this.W - 8;
        tf(el, `translate(${Math.round(a.x)}px,${Math.round(a.y)}px)`);
        tf(q["cl_" + id], flip ? "scaleX(-1)" : "none");
        tf(q["cb_" + id], `translate(${flip ? -(40 + cam.coW) : 40}px,-100%) translateY(-58px)`);
        op(el, v);
      });
      this.renderMap(s, t, C, bill);
      this.renderV10(s, t, C, still, glow);
      this.renderV12(s, t, C, bill, still);
      this.renderV14(s, t, C, bill, still, lt, ma);
      this.renderBoxes(s, lt, still, ma);
      for (let k = 0; k < 3; k++) tf(q["rf" + k], `translateX(${r1((((still ? 0.2 : (lt * 24) / S.L) + k / 3) % 1) * 2700)}px)`);
      // 구역 표시: 왼쪽 위에 작게, 옆으로 살짝 밀려 들어왔다가 사라진다(무대 가운데를 가리지 않게)
      S.titles.forEach((tt, i) => {
        const el = q["tt" + i], tau = t - tt.t0, hold = Math.max(tt.dur, 2200);
        if (tau < 0 || tau > hold || still) { op(el, 0); vis(el, false); return; }
        const pin = easeOut(clamp(tau / 420)), out = clamp((tau - (hold - 400)) / 400);
        vis(el, true); op(el, pin * (1 - out));
        tf(el, `translateX(${r1((1 - pin) * -14 + out * 6)}px)`);
        tf(el.firstChild, `scaleX(${r3(Math.max(0.01, pin))})`);
      });
      // HUD
      tf(q.pfill, `scaleX(${r3(s.prog)})`);
      tx(q.pval, String(Math.round(s.prog * 10)));
      tf(q.pval, `scale(${r3(1 + 0.35 * s.pp)})`);
      tx(q.hstep, `STEP ${pad(s.card.step, 2)}`);
      const tenth = Math.floor(t / 100);
      if (this._tenth !== tenth) {
        this._tenth = tenth;
        tx(q.tc, `${pad(Math.floor(t / 60000), 2)}:${pad(Math.floor(t / 1000) % 60, 2)}.${tenth % 10}`);
      }
      // 창 하나만: 정거장에서 솟아올랐다 접혀 들어간다
      Object.keys(this.wins).forEach((id) => {
        const el = this.wins[id], k = shown[id] || 0;
        if (k <= 0) { op(el, 0); vis(el, false); return; }
        vis(el, true);
        const o = this.project(stPos(id), C), sz = this.wsz[id];
        const x = o.x + (cam.wx - o.x) * k - sz.w / 2, y = o.y + (cam.wy - o.y) * k - sz.h / 2;
        // 다 열린 창은 정수 px에 두고 원근 변환을 빼서 글자가 흐려지지 않게
        if (k >= 0.999) tf(el, `translate(${Math.round(x)}px,${Math.round(y)}px)`);
        else tf(el, `translate(${r1(x)}px,${r1(y)}px) perspective(900px) rotateX(${r1((1 - k) * 68)}deg) scale(${r3(0.12 + 0.88 * k)})`);
        op(el, clamp(k * 1.6));
        if (id === "gate") this.renderPhone(s, t); else this.renderLines(id, t);
      });
      // 3D 그릇(view)에는 투명도를 쓰지 않고 위에 덮개를 둔다(납작해짐 방지)
      let fade = 0;
      if (!still) {
        if (intro) fade = 1 - clamp(t / 400);
        else {
          if (t > this.D - 500) fade = (t - (this.D - 500)) / 500;
          if (this.wrapped && lt < 400) fade = Math.max(fade, 1 - lt / 400);
        }
      }
      op(q.fade, fade); vis(q.fade, fade > 0);
      tf(q.view, `translateY(${r1(this.vShift)}px)`);
      // 자막
      const cpn = latest(S.caps, t);
      const msg = X.cap[cpn ? cpn.k : "ff"];
      if (this.statusEl._m !== msg) { this.statusEl._m = msg; this.statusEl.textContent = msg; }
      op(this.statusEl, still ? 1 : clamp((t - (cpn ? cpn.t0 : 0)) / 300));
    }

    lead(line, dot, Q, A, o) {
      const dx = A.x - Q.x, dy = A.y - Q.y, len = Math.hypot(dx, dy), ang = Math.atan2(dy, dx) * 180 / Math.PI;
      tf(line, `translate(${r1(Q.x)}px,${r1(Q.y)}px) rotate(${r1(ang)}deg) scaleX(${r3(len / 100)})`);
      tf(dot, `translate(${r1(A.x - 4)}px,${r1(A.y - 4)}px)`);
      op(line, o); op(dot, o);
    }

    // RAG 지도: 실패 점이 솟고, 스킬 건물이 오르고, 불러오기 빛줄기가 Claude Code로 간다. 겹 카드는 화면 위에 투영해 붙인다
    renderMap(s, t, C, bill) {
      const q = this.q, M = MAP, gm = this.gv.map;
      PINS.forEach((pp, i) => { vis(q["ph" + i], gm); if (!gm) return; const p = mapW(pp[0], pp[1]); tf(q["ph" + i], `${T3(p.x, M.y - 1 - pp[2] - 14, p.z)} ${bill} translate(-12px,-12px)`); });
      const np = s.newPin, npv = Math.max(0.001, np), P = mapW(NEWPIN[0], NEWPIN[1]), H = NEWPIN[2];
      [q.np_a, q.np_h].forEach((el) => vis(el, np > 0 && gm));
      tf(q.np_a, `${T3(P.x, M.y - 1, P.z)} scale(1,${r3(npv)}) translate(-2px,-${H}px)`);
      tf(q.np_h, `${T3(P.x, M.y - 1 - H * np - 14, P.z)} ${bill} translate(-12px,-12px)`);
      const nb = s.newBld, B = mapW(NEWBLD[0], NEWBLD[1]);
      vis(q.nb, nb > 0 && gm);
      tf(q.nb, `${T3(B.x, M.y - 1, B.z)} scale(1,${r3(Math.max(0.001, nb))})`);
      const bo = s.beam <= 0 ? 0 : s.beam <= 1 ? 1 : 2 - s.beam, bk = Math.min(1, s.beam);
      for (let j = 0; j < 3; j++) {
        const a = q["bm" + j + "a"], b = q["bm" + j + "b"];
        vis(a, bo > 0); vis(b, bo > 0);
        if (bo <= 0) continue;
        const kj = clamp(bk * 1.25 - j * 0.12);
        tf(a, `${this.beamT[j].a} scaleX(${r3(Math.max(0.001, kj))})`); tf(b, `${this.beamT[j].b} scaleX(${r3(Math.max(0.001, kj))})`);
        op(a, bo); op(b, bo * 0.7);
      }
      tx(q.rateV, `${s.rate}%`);
      tf(q.rateV, `scale(${r3(1 + 0.3 * s.rateP)})`);
      // 겹 카드
      const L = this.kvLay, A = this.anchors;
      const showKV = s.kv > 0.01, showP = s.pinCard > 0.01, showB = s.bldCard > 0.01;
      [q.kvk, q.kvv, q.kvkl, q.kvvl, q.kvkd, q.kvvd].forEach((el) => vis(el, showKV));
      [q.pinc, q.pinl, q.pind].forEach((el) => vis(el, showP));
      [q.bldc, q.bldl, q.bldd].forEach((el) => vis(el, showB));
      if (showKV) {
        const P = this.project(A.key, C), gap = 10, tw = L.w * 2 + gap;
        const x0 = Math.round(Math.min(this.W - tw - 8, Math.max(8, P.x - tw * 0.4))), y0 = Math.round(Math.max(8, P.y - Math.max(L.kh, L.vh) - 58));
        tf(q.kvk, `translate(${x0}px,${y0}px)`); tf(q.kvv, `translate(${x0 + L.w + gap}px,${y0}px)`);
        op(q.kvk, s.kv); op(q.kvv, s.kv);
        this.lead(q.kvkl, q.kvkd, { x: x0 + L.w * 0.5, y: y0 + L.kh }, P, s.kv);
        this.lead(q.kvvl, q.kvvd, { x: x0 + L.w + gap + L.w * 0.5, y: y0 + L.vh }, this.project(A.claude, C), s.kv);
      }
      const card = (el, ln, dot, h, anc, o) => {
        const a = this.project(anc, C);
        const x = Math.round(clamp((a.x + 30 - 8) / (this.W - L.w - 16)) * (this.W - L.w - 16) + 8), y = Math.round(Math.max(8, a.y - h - 70));
        tf(el, `translate(${x}px,${y}px)`); op(el, o);
        this.lead(ln, dot, { x: x + 14, y: y + h }, a, o);
      };
      if (showP) card(q.pinc, q.pinl, q.pind, L.ph, A.pin, s.pinCard);
      if (showB) card(q.bldc, q.bldl, q.bldd, L.bh, A.bld, s.bldCard);
    }

    // v10: Known issues 수, Defect analyst 연결선·카드, 대기 중 Step 7, Effort 게이지, 마일스톤 구간
    renderV10(s, t, C, still, glow) {
      const q = this.q, L = this.kvLay;
      const kn = s.known;
      tx(q.kcnt, String(Math.round(kn)));
      tf(q.kcnt, `scale(${r3(1 + 0.35 * Math.sin(Math.PI * (kn - Math.floor(kn))))})`);
      for (let i = 0; i < 3; i++) op(q["kc" + i], clamp(kn - i));
      op(q.ghb, s.s7);
      op(q.ghg, Math.max(s.s7 * 0.7, s.lnO * s.link * 0.9, glow.s7 || 0));
      const AN = stPos("analyst");
      const lo = s.lnO;
      vis(q.lnk, lo > 0.01); vis(q.lnkd, lo > 0.01);
      if (lo > 0.01) {
        const A = this.project({ x: AN.x, y: -226, z: AN.z }, C), B = this.project({ x: GH.x - 75, y: -150, z: GH.z }, C);
        this.lead(q.lnk, q.lnkd, A, { x: A.x + (B.x - A.x) * s.link, y: A.y + (B.y - A.y) * s.link }, lo);
      }
      const ao = s.anCard;
      [q.anc, q.anl, q.and].forEach((el) => vis(el, ao > 0.01));
      if (ao > 0.01) {
        const a = this.project({ x: GH.x, y: -200, z: GH.z }, C);
        const x = Math.round(Math.min(this.W - L.w - 8, Math.max(8, a.x - L.w * 0.6))), y = Math.round(Math.max(8, a.y - L.ah - 60));
        tf(q.anc, `translate(${x}px,${y}px)`); op(q.anc, ao);
        this.lead(q.anl, q.and, { x: x + L.w * 0.5, y: y + L.ah }, a, ao);
      }
      const eo = still ? 0 : s.eg;
      [q.effg, q.egl, q.egd].forEach((el) => vis(el, eo > 0.01));
      if (eo > 0.01) {
        const CLs = stPos("claude"), a = this.project({ x: CLs.x, y: -236, z: CLs.z }, C), w = this.egW, h = this.egH;
        const x = Math.round(Math.min(this.W - w - 8, Math.max(8, a.x - w / 2))), y = Math.round(Math.max(8, a.y - h - 48));
        tf(q.effg, `translate(${x}px,${y}px) scale(${r3(0.94 + 0.06 * eo + 0.08 * s.egp)})`); op(q.effg, eo);
        this.lead(q.egl, q.egd, { x: x + w / 2, y: y + h }, a, eo);
        tf(q.egf, `scaleX(${r3((1 + s.egk) / 3)})`);
        const lv = s.egk > 0.5 ? 1 : 0;
        tx(q.egv, X_LV[this.lang][lv]);
        const c = cache(q.egv);
        if (c.bg !== lv) { c.bg = lv; q.egv.style.background = LEVEL_BG[lv]; }
        op(q.egg, s.egp);
      }
      tf(q.pms, `scaleX(${r3(s.ms)})`);
    }

    // v12: skill 칩이 Main session에 끼워지고, 저장마다 hook 칩이 튀고, Subagent 3개가 가지를 뻗어 일한다
    renderV12(s, t, C, bill, still) {
      const q = this.q, CL = stPos("claude"), top = { x: CL.x, y: -224, z: CL.z + 2 };
      for (let i = 0; i < 2; i++) {
        const p = s.sk[i], el = q["sk" + i];
        vis(el, p > 0.001);
        if (p <= 0.001) continue;
        const e = back(p), dk = { x: CL.x, y: -250 - i * 30, z: CL.z + 4 };
        tf(el, `${T3(dk.x + (1 - e) * 230, dk.y - (1 - e) * 150, dk.z + (1 - e) * 40)} scale(${r3(0.5 + 0.5 * Math.min(1, e))}) translate(-75px,-12px)`);
        op(el, clamp(p * 3));
      }
      const hk = s.hk;
      vis(q.hkc, hk > 0.01);
      if (hk > 0.01) { tf(q.hkc, `${T3(CL.x - 150, -236 - 14 * hk, CL.z + 14)} scale(${r3(0.75 + 0.25 * hk)}) translate(-72px,-11px)`); op(q.hkc, hk); }
      const A = s.sa, X = this.X, tk = X.sa.tk[A.ses], rt = X.sa.rt[A.ses];
      for (let i = 0; i < 3; i++) {
        const el = q["sa" + i], la = q["sl" + i + "a"], lb = q["sl" + i + "b"], g = A.a[i], on = g > 0.001;
        vis(el, on); vis(la, on); vis(lb, on);
        if (!on) continue;
        const N = SA[i], P = { x: top.x + (N.x - top.x) * g, y: top.y + (N.y - top.y) * g, z: top.z + (N.z - top.z) * g };
        const pr = A.pr[i], done = i === 2 ? A.ck : clamp((pr - 0.92) / 0.08);
        tf(el, `${T3(P.x, P.y, P.z)} ${bill} scale(${r3(Math.max(0.01, 0.35 + 0.65 * g))}) translate(-50%,-50%)`);
        op(el, clamp(g * 1.6) * (1 - 0.2 * done));
        const dx = P.x - top.x, dy = P.y - top.y, dz = P.z - top.z, hz = Math.hypot(dx, dz), L = Math.max(0.01, Math.hypot(hz, dy));
        const base = `${T3(top.x, top.y, top.z)} rotateY(${r1(Math.atan2(-dz, dx) * 180 / Math.PI)}deg) rotateZ(${r1(Math.atan2(dy, hz) * 180 / Math.PI)}deg)`;
        tf(la, `${base} scaleX(${r3(L / 100)}) translate(0,-1px)`); tf(lb, `${base} rotateX(90deg) scaleX(${r3(L / 100)}) translate(0,-1px)`);
        op(la, clamp(g * 2) * 0.85); op(lb, clamp(g * 2) * 0.55);
        for (let k = 0; k < 12; k++) op(q[`sa${i}r${k}`], 0.18 + 0.82 * clamp(pr * 12 - k));
        tf(q["sar" + i], `rotate(${r1(still || pr >= 1 ? 0 : (t * 0.09 + i * 40) % 360)}deg)`);
        if (tk) { tx(q[`sa${i}tk`], tk[i]); tx(q[`sa${i}res`], rt[i]); } else { tx(q[`sa${i}tk`], X.sa.n[i][1]); tx(q[`sa${i}res`], X.sa.n[i][2]); }
        op(q[`sa${i}res`], done);
      }
    }

    // v14: 지형의 빛 알갱이(반복 한 바퀴에 맞춘 주기라 경계에서 끊기지 않음)
    renderV14(s, t, C, bill, still, lt, ma) {
      const q = this.q, S = this.S, ph = (n, o) => Math.sin((2 * Math.PI * n * lt) / S.L + o);
      if (!this.links) this.links = linkPts();
      this.links.forEach(([A, B, , n], j) => {
        (j < 6 ? ["a", "b"] : ["a"]).forEach((w, k) => {
          const el = q["lp" + j + w], f = still ? 0.35 + k * 0.3 : (((lt * n) / S.L) + k * 0.5 + j * 0.137) % 1;
          tf(el, `${T3(A.x + (B.x - A.x) * f, A.y + (B.y - A.y) * f, A.z + (B.z - A.z) * f)} ${bill} translate(-5px,-5px)`);
          op(el, Math.min(1, Math.sin(Math.PI * f) * 1.6) * 0.95);
        });
      });
      DOTS.forEach((d, j) => {
        const el = q["dt" + j];
        tf(el, `${T3(d.x, d.y, d.z)} ${bill} translate(-4px,-4px)`);
        op(el, 0.2 + 0.6 * (0.5 + 0.5 * ph(d.n, d.ph)));
      });
      if (this.gv.map) {
        PINS.forEach((_, i) => op(q["ph" + i], ma * (0.6 + 0.4 * (0.5 + 0.5 * ph(4 + i, i * 1.7)))));
        tf(q.msw, `${T3(MAP.x - 900 + (((still ? 0.3 : (lt * 6) / S.L)) % 1) * 1800, MAP.y - 1.5, MAP.z)} rotateX(90deg) translate(-100px,-380px)`);
      }
      op(q.vgl, 0.5 + 0.18 * ph(5, 0));
    }

    // 파형 장: 선마다 주파수·진폭·위상이 다르고(반복 한 바퀴에 맞춘 정수 주기), 뒤로 갈수록 위·옆으로 밀린 폭포형.
    // 새 기록은 맨 앞에 밝은 새 선으로 자라고, 밝은 봉우리 하나가 선을 따라 흐른다. 지도가 화면 밖이면 그리지 않는다.
    renderWaves(s, lt, still, ma) {
      if (!this.gv.map || ma < 0.01) return;
      if (!still && this._wlt !== undefined && Math.abs(lt - this._wlt) < 33) return;
      this._wlt = lt;
      const S = this.S, N = this.light ? 12 : 24, P = this.light ? 44 : 56;
      WF.forEach((w, wi) => {
        const cv = this.q["wv" + w.k], ctx = cv._ctx || (cv._ctx = cv.getContext("2d"));
        const k = cv._k, W = WF_W, H = WF_H;
        ctx.setTransform(k, 0, 0, k, 0, 0); ctx.globalCompositeOperation = "source-over"; ctx.clearRect(0, 0, W, H); ctx.globalCompositeOperation = "lighter";
        const T = still ? 0.37 : lt / S.L, nv = w.warm ? s.newPin : s.newBld;
        const line = (i, d, amp, alpha, col, lw) => {
          const y0 = H * 0.86 - d * H * 0.6, xo = 16 + d * 64, ww = W - 32 - d * 96;
          const n1 = 3 + ((i * 7 + wi * 3) % 11), n2 = 5 + ((i * 5 + wi) % 13), p1 = rnd(i, 7 + wi) * 6.283, p2 = rnd(i, 9 + wi) * 6.283;
          const k1 = (1.3 + 3.2 * rnd(i, 11 + wi)) * 6.283 / ww, k2 = (4 + 8 * rnd(i, 13 + wi)) * 6.283 / ww;
          ctx.beginPath();
          for (let j = 0; j <= P; j++) {
            const x = (j / P) * ww, env = Math.pow(Math.sin(Math.PI * j / P), 1.4);
            const y = y0 - amp * env * (0.65 * Math.sin(k1 * x + p1 + 6.283 * n1 * T) + 0.35 * Math.sin(k2 * x + p2 - 6.283 * n2 * T));
            if (j) ctx.lineTo(xo + x, y); else ctx.moveTo(xo + x, y);
          }
          ctx.globalAlpha = alpha; ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.stroke();
          return { y0, xo, ww, n1, n2, p1, p2, k1, k2 };
        };
        let front = null;
        for (let i = N - 1; i >= 0; i--) {
          const d = i / (N - 1), amp = (12 + 24 * rnd(i, 3 + wi)) * (1 - d * 0.45);
          const hue = w.warm ? 350 + 35 * d : 160 + 28 * d;
          const g = line(i, d, amp, 0.95 - d * 0.5, `hsl(${hue % 360},${w.warm ? 95 : 85}%,${64 - d * 10}%)`, i < 3 ? 2.1 : 1.4);
          if (i === 2) front = { g, amp };
        }
        if (nv > 0.001) line(99, -0.12, 30 * nv, nv, w.warm ? "#ffe2b8" : "#d9fff2", 2.2);
        // 선을 따라 흐르는 밝은 봉우리
        if (front) {
          const g = front.g, f = still ? 0.42 : ((T * (wi ? 5 : 4)) + wi * 0.31) % 1, x = f * g.ww, env = Math.pow(Math.sin(Math.PI * f), 1.4);
          const y = g.y0 - front.amp * env * (0.65 * Math.sin(g.k1 * x + g.p1 + 6.283 * g.n1 * T) + 0.35 * Math.sin(g.k2 * x + g.p2 - 6.283 * g.n2 * T));
          ctx.globalAlpha = 0.35 * env; ctx.fillStyle = w.warm ? "#ffb08a" : "#8fffe0"; ctx.beginPath(); ctx.arc(g.xo + x, y, 9, 0, 6.283); ctx.fill();
          ctx.globalAlpha = 0.95 * env; ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(g.xo + x, y, 3.2, 0, 6.283); ctx.fill();
        }
        ctx.globalAlpha = 1;
      });
    }

    // 데이터 상자: 새 기록은 바닥 고리 번쩍임 → 상자가 솟아오름(윗면 빛이 밝게) → 부드럽게 자리 잡음. 불러오기 때 해당 상자가 맥박친다
    renderBoxes(s, lt, still, ma) {
      const q = this.q, gm = this.gv.map;
      [["rbf", "rrf", s.newPin, NEWF], ["rbs", "rrs", s.newBld, NEWS]].forEach(([key, ring, v, b]) => {
        const el = q[key], rg = q[ring], on = v > 0.001 && gm;
        vis(el, on);
        const rk = clamp(v / 0.3), grow = ss(clamp((v - 0.15) / 0.65)), settle = clamp((v - 0.8) / 0.2);
        vis(rg, on && v < 0.999);
        if (!on) return;
        const p = mapW(b[0], b[1]);
        tf(el, `${T3(p.x, MAP.y - 1, p.z)} scale(1,${r3(Math.max(0.001, grow))})`);
        op(q[key + "g"], ma * (0.35 + 0.65 * (1 - settle) * clamp(grow * 3)));
        tf(rg, `${T3(p.x, MAP.y - 3, p.z)} rotateX(90deg) scale(${r3(0.55 + 0.75 * rk)}) translate(-70px,-70px)`);
        op(rg, ma * Math.max(Math.sin(Math.PI * rk) * 0.95, 0.35 * grow * (1 - settle)));
      });
      // 불러오기: 빛줄기가 보이는 동안 해당 상자 윗면이 맥박친다
      const bo = s.beam <= 0 ? 0 : s.beam <= 1 ? 1 : 2 - s.beam, pul = bo * (0.55 + 0.45 * Math.sin(lt * 0.012));
      ["fp1", "fp3", "sp1"].forEach((k) => { const el = q[k]; if (el) op(el, gm ? ma * pul : 0); });
    }

    // 가벼운 모드: 파형 선을 줄이고 입자를 숨긴다(휴대폰 영어판, 또는 처음 2초 측정 fps < 45)
    setLight(on) {
      if (this.light === on) return;
      this.light = on;
      DOTS.forEach((_, j) => { const el = this.q["dt" + j]; if (el) el.style.display = on ? "none" : ""; });
      // 영어 랜딩만: 장식 지형(먼 구조물·네트워크 그림·부피 빛·바닥 등고선)도 끈다. 정거장·도관·패킷·간판·파형은 그대로
      this.root.classList.toggle("pm3-light", on && this.lang === "en");
      this.render(this.frameTime());
    }

    renderPhone(s, t) {
      const q = this.q, G = s.gate;
      op(q.ph_card, G.card);
      tf(q.ph_card, `translateY(${r1((1 - G.card) * -24)}px)`);
      const ph = (t % 1200) / 1200;
      op(q.ph_pulse, G.wait * (1 - ph) * 0.9);
      tf(q.ph_pulse, `scale(${r3(1 + 0.07 * ph)})`);
      op(q.ph_tap, G.tap > 0 && G.tap < 1 ? 0.85 * (1 - G.tap) : 0);
      tf(q.ph_tap, `scale(${r3(0.3 + 1.6 * G.tap)})`);
      op(q.ph_ok, G.ok);
    }

    // 창 안의 줄: 지금 페이지(세션)만 보이고, 새 줄이 부드럽게 밀고 들어온다
    renderLines(id, t) {
      const S = this.S, els = this.lineEls;
      let pg = -1;
      S.pages.forEach((p, i) => { if (p.win === id && p.t0 <= t && t < this.pageEnd[i]) pg = i; });
      const vis = [];
      S.lines.forEach((ln, i) => { if (ln.win !== id) return; if (ln.page === pg && ln.t0 <= t) vis.push(i); else op(els[i].g, 0); });
      const hOf = (i) => (S.lines[i].mode === "bubble" ? 30 : S.lines[i].mode === "check" ? 21 : 18);
      const grow = (i) => ease(clamp((t - S.lines[i].t0) / 260));
      const isGit = id === "commit", top = isGit ? 30 : 10;
      const ys = {};
      let acc = 0;
      if (isGit) {
        for (let a = 0; a < vis.length; a++) { let off = 0; for (let b = a + 1; b < vis.length; b++) off += hOf(vis[b]) * grow(vis[b]); ys[vis[a]] = top + off; }
      } else vis.forEach((i) => { ys[i] = top + acc; acc += hOf(i) * grow(i); });
      const area = this.wh - 34 - 16;
      tf(this.q["scr_" + id], `translateY(${r1(-Math.max(0, acc - area))}px)`);
      vis.forEach((i) => {
        const ln = S.lines[i], el = els[i], p = ln.dur ? clamp((t - ln.t0) / ln.dur) : 1;
        let x = 0, o = 1, yy = ys[i];
        if (ln.mode === "fade" || ln.mode === "check") o = clamp(p * 3);
        if (ln.mode === "bubble") { o = p; yy += (1 - p) * 6; }
        if (ln.mode === "slide" || ln.mode === "git") { o = p; x = (1 - ease(p)) * -18; }
        tf(el.g, `translate(${r1(x)}px,${r1(yy)}px)`);
        op(el.g, o);
        if (el.cov) {
          const n = Math.max(1, Math.ceil(el.chars / 4)), r = el.len * (Math.floor(p * n) / n), W = el.len + 4;
          tf(el.cov, `translateX(${r1(r)}px) scaleX(${r3((W - r) / W)})`);
          op(el.cov, p >= 1 ? 0 : 1);
          const after = t - (ln.t0 + ln.dur), on = (p > 0 && p < 1) || (after >= 0 && after < 600);
          tf(el.cur, `translateX(${r1(r + 1)}px)`);
          op(el.cur, on ? (Math.floor(t / 380) % 2 ? 0.25 : 0.9) : 0);
        }
        if (el.ck0) {
          op(el.ck0, p < 1 ? 1 : 0); op(el.ck1, p >= 1 ? 1 : 0);
          tf(el.ck0, `rotate(${Math.round((t * 0.5) % 360)}deg)`);
        }
      });
    }
  }

  const instances = [];
  const init = () => {
    document.querySelectorAll("[data-pipeline-motion]").forEach((el) => {
      if (el._pmInst) return;
      try { el._pmInst = new Motion(el); instances.push(el._pmInst); } catch (err) { el.classList.remove("is-live"); if (window.console) console.warn("pipeline-motion:", err); }
    });
  };
  window.PipelineMotion = { instances, init };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
