# implement-ios-consultant — manual fixture verification (T14)

Manual fixture verification, following the precedent set by
[`../design-ios-consultant/README.md`](../design-ios-consultant/README.md) — not a `run.sh`-style
automated scenario (no `prompt.txt` / `rubric.md` / `fixture/` tree, no judge). Each fixture was
run against the finished `implement` wiring (T2, T4, T5, T6), in an isolated throwaway workdir
loading this repo's plugin via `claude -p --plugin-dir`.

## Fixture

One shared fixture feature, [`spec.md`](./spec.md) + [`sad.md`](./sad.md) +
[`tasks.json`](./tasks.json): 4 independent, trivial tasks chosen so each carries a different (or
absent, or combined) iOS-consultant signal, per `_shared/consultant-trigger.md`'s `implement` row
(detection against a task's own title + `acs` + `dod`):

| Task | Signal | Expected consultant(s) |
|---|---|---|
| T-A — render a SwiftUI badge view | UI-class | SwiftUI consultant |
| T-B — async refresh on an actor-isolated cache | async-class | Swift-concurrency consultant |
| T-C — pure input validator | none | none (AC-09 no-op) |
| T-D — dedicated actor-isolation test, "coverage approach" wording | test-strategy-class **and** async-class | both swift-testing-consultant and Swift-concurrency consultant |

Four `.claude/sdd.local.md` variants select the mode under test: `single` (`max_parallel_agents:1`
+ `isolation:inplace`, clamps to SEQUENTIAL), `team` (`team_mode:true` + `isolation:worktree`),
`workflow` (`workflow_mode:auto` + `isolation:worktree`), and `conflict` (same as `single`, used
for the settings-reconciliation case, working only task T-D).

## Results

| Run | Mode requested | Mode that actually ran | AC(s) | Verdict | Evidence |
|---|---|---|---|---|---|
| single-agent | sequential (forced) | sequential | AC-02, AC-09 | **PASS** | Committed all 4 tasks (`b49cf60`…`ab2f41f`). Final report: T-A → SwiftUI consultant, T-B → Swift-concurrency consultant, T-C → **no consult** (explicit no-op), T-D → **both** swift-testing + Swift-concurrency consultants (combined signal), with a project-wins note when the testing consultant's suggestion (Swift Testing `@Test`) conflicted with the repo already standardizing on XCTest. Each task's own body carried only its own brief — no cross-task bleed. |
| settings-conflict | sequential (forced), T-D only | sequential | AC-02, AC-06 | **PASS** | Commit `0b7d8cd` (T-D/AC-04-in-fixture). The report states explicitly: consultant brief recommended an **integration-level** concurrency test against a live dependency; project settings (`require_integration: never`, `gate_lint: false`) reject that shape; **project setting won** — the folded guidance instead specified an in-process unit-level `TaskGroup` test with no external dependency, which is what landed in `Tests/BadgeStateTests.swift`. |
| team-mode | AGENT TEAM (`TeamCreate`) | **sequential (graceful fallback)** | AC-02, AC-09 | **PASS** (with a documented environment limit) | `TeamCreate` is not available inside a nested headless `claude -p` subprocess in this sandbox (confirmed via `ToolSearch` in-run — the tool never surfaces) — the engine correctly named this and fell through to sequential per its own documented graceful-degrade rule (`decision-tree.md`), rather than silently claiming team mode ran. All 4 tasks still committed (`fc59eb5`…`12efe68`) with the identical task-scoped consultant pattern as the single-agent run (T-A/T-B/T-D branch, T-C none). |
| workflow-mode | DYNAMIC WORKFLOW (`Workflow`) | **sequential (graceful fallback)**, but the generated script was captured | AC-02, AC-05, AC-09 | **PASS** (with a documented environment limit) | The `Workflow` tool call was **denied** by the nested subprocess's sandbox (captured directly in the run's `permission_denials`, not merely inferred) — a genuine environment limitation of this eval harness, not a defect in `workflow-exec.md`'s own logic. The **denied call's own `script` argument is the direct evidence for this task's precompute wiring**: the generated `TASKS` array carries T-A's `consultant_brief` (a real, detailed SwiftUI-consultant brief), T-B's (a Swift-concurrency brief), T-C's **`consultant_brief: null`**, and T-D's (a swift-testing-consultant brief) — computed by the *main session*, before the script was ever handed to `Workflow`, exactly as T5 specifies. `redPrompt(t)`'s `briefBlock(t)` helper renders the brief text when present and the literal `"No iOS-consultant brief applies to this task"` when `null` — this is `AC-09` rendered structurally, verified from the actual generated source, not paraphrased. After the denial, the engine gracefully degraded to sequential (named in the banner) and still committed all 4 tasks (`95c3d51`…`73959af`) with the same task-scoped pattern. |

Every run's `git log` was inspected directly in the fixture workdir; `agents/test-author.md` and
`agents/implementer.md` in this repo were confirmed untouched throughout (the fixture workdirs are
separate throwaway trees that never write back into this checkout — `--plugin-dir` mounts it
read-only for skill/agent definitions).

## Notes — team/workflow mode's honest scope

Neither `TeamCreate` nor `Workflow` could actually **execute** inside this eval harness's nested
headless `claude -p` subprocess (the harness itself, not the `implement` skill, is the constraint
— a `claude -p` session run from inside another `claude -p` session's `Bash` tool does not appear
to expose these two orchestration mechanisms the same way a top-level interactive/headless session
does). Two consequences, both handled correctly by the engine rather than papered over:

1. **The decision tree's own graceful-degrade guard fired as designed** — `decision-tree.md` /
   `implement/SKILL.md` §5 already document "if `Workflow`/`TeamCreate` is unavailable at runtime,
   fall through to sequential"; both fixture runs hit exactly this path and said so plainly in
   their banners, rather than silently claiming a mode that didn't run.
2. **The precompute step still ran correctly** — because `team-exec.md`'s and `workflow-exec.md`'s
   consultant precompute happens in the **main session**, before a teammate/script is ever
   dispatched (ADR-0001/ADR-0002), the task-scoped brief-baking logic executed and was verified
   regardless of whether the downstream orchestration tool itself could run. The workflow run's
   captured (denied) `Workflow` call is direct proof of this for the generated-script path.

Attempting a live `TeamCreate`/`Workflow` execution proof (rather than the precompute-into-a-
captured-script proof above) would require running this fixture from a top-level session with
those tools genuinely available — out of reach for a nested manual-fixture harness. This is
recorded here rather than silently assumed passing.

Several runs across this feature's fixtures (T13–T16) hit a transient
`API Error: Connection closed mid-response` on their first attempt and needed a retry — an
infrastructure blip in the nested session unrelated to the wiring under test (confirmed by the
identical fixture+prompt passing cleanly on retry). The team/workflow runs additionally needed a
tighter prompt (explicitly forbidding `Package.swift`/`swift build` setup) after an initial attempt
wandered into trying to stand up a real Swift toolchain instead of treating the missing toolchain
as a stated environment limitation.
