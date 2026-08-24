# Changelog — workflow-pipeline-unwrap-fix

## workflow-pipeline-unwrap-fix — fix silent completion-tracking bug in the dynamic-workflow generated-script template

**What:** The "Generated script shape" worked example in `skills/implement/references/workflow-exec.md` — the template `/sdd:implement` reads and adapts whenever a feature's task DAG routes to dynamic-workflow execution — now correctly unwraps each per-task `pipeline([t], ...)` result (always a 1-element array, never a bare object) and checks the field the pipeline's own final (review) stage actually returns (`ac_satisfied`), instead of an earlier stage's `gate_green` read off the wrong shape. A dropped task (failed past retries) now propagates as `null`, `filter(Boolean)`-safe, while a task whose review resolved but reported `ac_satisfied: false` is retained in the aggregated results rather than nulled. A "Gotcha" blockquote directly above the code block now names both known singleton-array-unwrap compositions that have shipped production bugs.

**Why:** Either defect alone made `done.add(t.id)` silently never fire for any task. This was hit for real during a 13-task `/sdd:implement view-viewmodel-boundary-fix` run (`elf` project, 2026-08-19): the engine hand-rolled its own variant of the same shape one level up, and a downstream `r.t.id` dereference crashed the run's final summary step after all 25 `agent()` dispatches had already completed successfully — see [spec](../spec.md) §1.

**How to use:** No new interface — this is a documentation/template correctness fix consumed implicitly by the SDD engine whenever it generates a dynamic-`Workflow` script at `/sdd:implement` time. No `openapi.yaml` (feature has no runtime interface; see `contracts/api-sync-report.md`).

**Operational notes:**
- Migration: <!-- none -->
- Feature flag / config: <!-- none -->
- Rollback: revert the diff to `skills/implement/references/workflow-exec.md`.

**Acceptance criteria delivered:** AC-01 (happy-path completion tracking), AC-02 (dropped task never falsely retained), AC-03 (only the final review stage's `ac_satisfied` authorizes `done`, never an earlier `gate_green`), AC-03b (a resolved-but-unsatisfied review is retained, not nulled), AC-04 (array-always invariant named at the point of copy, both compositions), AC-04b (skip-cascade prose carries a visible not-yet-implemented caveat), AC-05 (confirmed the only `pipeline(` call site in `skills/**/*.md`).
