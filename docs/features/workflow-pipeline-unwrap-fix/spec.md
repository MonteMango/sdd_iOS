---
status: Draft
owner: "Vitalii Lytvynov"
reviewers: ["Fork maintainer"]
updated_at: "2026-08-19"
feature_size: "XS"
---

# Spec — workflow-pipeline-unwrap-fix

> **Glossary:** [CONTEXT](../../../CONTEXT.md) — roles `Fork maintainer`, `Pipeline operator` already defined; no new terms needed.
> **Reference module / docs / channels used:** `bug-workflow-single-item-pipeline-unwrap.md` (bug report); `skills/implement/references/workflow-exec.md` (live target, read directly — its "Generated script shape" section now has 4 stages, not the 3 the bug report quotes); the installed plugin's own copy at `~/.claude/plugins/cache/sdd/sdd/1.17.0/skills/implement/references/workflow-exec.md` (confirmed byte-for-byte the same unpatched pattern upstream); a repo-wide grep for `pipeline(` and `done` (confirms this is the only occurrence and that the `done` Set is currently write-only); `evals/scenarios/implement-ios-consultant/sdd-local-variants/workflow.claude-sdd.local.md` (confirms no existing eval asserts on generated-script result shape).

## 1. Context

`skills/implement/references/workflow-exec.md`'s "Generated script shape" section is the worked example that the SDD engine (Claude, at `/sdd:implement` time) reads and adapts into a real `Workflow` script whenever a feature's task DAG routes to dynamic-workflow execution mode. The example's per-task pipeline chains `.then(res => { if (res?.gate_green) done.add(t.id); return {t, res}; })` directly onto `pipeline([t], stageA, stageB, stageC, stageD)`. This has two independent defects. First: per the `Workflow` tool's own documented contract, `pipeline(items, ...)` always resolves to an array — one entry per item — even when `items` holds exactly one element, so `res` inside that callback is really a 1-element array, not the bare final-stage verdict object. Second, and independent of the first: even a correctly unwrapped `res` would still never satisfy the check, because the pipeline's final stage is `review`, which returns a `REVIEW_VERDICT { ac_satisfied, issues[] }` — a shape with no `gate_green` field at all (that field exists only on the earlier `green`/`verify` stages' `GATE_VERDICT`). Either defect alone is enough to make `done.add(t.id)` silently never fire for any task. This is for the `Fork maintainer`, who owns this template, and the `Pipeline operator`, who runs `/sdd:implement` and depends on the generated script's own completion tracking and final summary step being correct.

This is not hypothetical: it was hit during a real `/sdd:implement view-viewmodel-boundary-fix` run (13-task DAG, `elf` project, 2026-08-19). The engine wrote its own hand-rolled variant of the same shape one level up — `results.push(...layerResults)`, where `layerResults` came from `parallel(layer.map(t => () => pipeline([t], ...)))` — and a downstream `r.t.id` dereference threw, crashing the run's final summary step after all 25 `agent()` dispatches (13 tasks × RED+GREEN against real `xcodebuild test` runs, ~10.8M ms of real work) had already completed successfully. The implementation work was entirely intact; only the last aggregation step failed, and recovering it required first diagnosing that the fault was in the orchestration script, not the TDD work itself.

The committed approach is the bug report's own recommendation, corrected against the current file and hardened by an adversarial pass run during this spec's drafting: (a) fix the per-task pipeline's `.then()` to destructure the single-element array — `.then(([res]) => ...)` — against the template's **current 4-stage shape** (`red → green → verify → review`; the bug report's own Option A snippet still shows the pre-edit 3-stage form and would silently drop the `verify` stage if pasted as-is); (b) check the field that actually exists on the final stage's own verdict — `res?.ac_satisfied` (from `REVIEW_VERDICT`), not `res?.gate_green` (which only ever existed on an earlier stage's `GATE_VERDICT`) — and preserve `filter(Boolean)`-safe null-propagation for a dropped task (return `null`, not `{t, res: null}`, when the array element is falsy; a task whose review resolved but reported `ac_satisfied: false` is a distinct case — see AC-03b — and is retained, not nulled); and (c) add a "Gotcha" callout, placed as a blockquote directly above the code block (not appended after the existing bullet list below it, so it is seen before anyone copies the pattern, not only by someone who reads past the code), naming the array-always invariant explicitly and covering **both** compositions that have actually caused a production incident — the bare `pipeline([t], ...).then()` case, and the `parallel(...).map(() => pipeline([t], ...))` → flat-spread case that is what actually crashed the `elf` run. The callout also states, citing the `Workflow` tool's own contract, that a dropped array element is a resolved falsy value (`null`) inside the pipeline's result array — never a rejected promise — so no `.catch()` is needed around the per-task `.then()`. This fix adds no new aggregation/summary code block to the template: the "gathered from several such calls into one list" composition (AC-04) is covered by the Gotcha callout's prose alone, matching how the `elf`-run engine actually hand-rolled it; AC-01's "final summary step" refers to a future generated run's own summary step (built by the engine at `/sdd:implement` time), not to any code shown in this worked example.

A repository-wide grep confirms this is the only `pipeline(` call site in `skills/**/*.md`, and the installed plugin cache (`sdd` v1.17.0) shows the identical unpatched pattern — this is an upstream-inherited defect, not something this fork introduced, and the fork carries no local pattern for the "drop dependents from `done`" behavior the template's own prose (line 63) describes but never implements; the fix stays scoped to correcting what the shown code claims to do, not building the unimplemented behavior from scratch (§3, §8).

## 2. Goals

- The generated-script template's per-task pipeline result is consumed with its correct shape and the field that actually authorizes completion (the final review stage's `ac_satisfied`, not an earlier stage's `gate_green` read off an unwrapped array) so `done`-tracking reflects what actually happened.
- A future author — human or engine — adapting this template into a hand-rolled variant is warned, at the point where they would naturally copy the pattern, about both known singleton-array-unwrap compositions that have already caused a production incident.
- A task that is dropped (fails past retries) is never mistaken for a completed one downstream, closing the exact `results.filter(Boolean)`-defeat class the live incident nearly hit a second way.

## 3. Non-goals

- Implementing the skip-cascade behavior the template's own prose describes ("the engine removes it from `done`, so every transitively-dependent task is skipped") is out of scope — it exists in neither this fork nor the upstream plugin, so building it would be new design work, not a bug fix; tracked as §8 OQ-1 (the prose itself still gets a visible not-yet-implemented caveat — see AC-04b — so it is never mistaken for delivered behavior).
- Reworking `pipeline()`/`parallel()`'s own return-shape contract (e.g., a keyed/dictionary return-shape alternative that would remove the singleton-array ambiguity structurally) is out of scope — that changes the `Workflow` tool itself, not this template.
- Adding automated test or lint coverage for the generated-script template's embedded JS is out of scope for this XS fix — there is no harness in this repo that executes a markdown-embedded snippet in isolation (`evals/` drives full `/sdd:<skill>` sessions over fixtures, not individual template blocks); verification here is code-review-only. Extending `evals/` to assert on generated-script result shape is tracked as §8 OQ-2. The ship-time Definition of Done for AC-01–AC-05 is satisfied by code-review reasoning over the corrected template (does the shown code, given each AC's Given, produce the stated Then) — not by observing a live dynamic-workflow run; this fix adds no new emission or logging of the `done` Set, which stays exactly as write-only as §1 found it (§6 row 1 and §7 KPI-1's "next 3 runs" figures are post-ship monitoring, not a ship gate).
- Proposing this fix upstream to the canonical SDD plugin project (confirmed to carry the identical unpatched pattern) is out of scope for this spec, which covers only this fork's local copy; tracked as §8 OQ-3.
- Extending the array-always-invariant warning beyond `skills/implement/references/workflow-exec.md` — e.g., into `skills/implement/SKILL.md` or `agents/*.md` to make it an enforced rule rather than a documented callout — is out of scope for this XS fix; the diff stays confined to this one file.

## 4. User stories

### US-01: Correct the generated-script template

**As a** Fork maintainer
**I want** the "Generated script shape" example in `workflow-exec.md` to unwrap each per-task `pipeline()` result to its actual verdict object, check the completion field that the pipeline's own final (review) stage actually returns, and name the array-always invariant explicitly at the point a future author would copy the pattern
**So that** nobody who copies or adapts this template — including the engine itself, generating its own script — reintroduces the tracking bug that already reached production once

### US-02: Reliable completion tracking with no late-stage crash

**As a** Pipeline operator
**I want** my dynamic-workflow `/sdd:implement` run to correctly track which tasks actually finished cleanly, to never count a dropped task as done, and to reach its final summary step without crashing on a mis-shaped pipeline result
**So that** I can trust the run's own completion reporting and never lose a long-running implementation pass to a last-step aggregation error after all the real work already succeeded

## 5. Acceptance criteria

### AC-01 (US-02) — happy path

**Given** a Pipeline operator's dynamic-workflow run where every task in a layer completes its pipeline and the final review stage reports the acceptance criteria satisfied
**When** the run's per-task pipeline step evaluates that outcome
**Then** every one of those tasks is recorded in the run's completed-task tracking, and the run proceeds to its final summary step without error

### AC-02 (US-02) — error / failure handling

**Given** a task whose pipeline is dropped because a stage fails past its retry limit
**When** the run's per-task completion check and any later step that filters completed results run
**Then** that task is never recorded as completed, and it is excluded — not silently retained as a falsely-truthy entry — from any downstream list of completed results

### AC-03 (US-02) — authorization (which outcome may mark a task done)

**Given** a task whose earlier stage (for example, the implementation gate) has already passed
**When** the run's per-task completion check evaluates that task
**Then** an earlier stage's own pass (e.g. `gate_green`) never by itself authorizes marking the task done — only the final review stage's own outcome (`ac_satisfied`) does

### AC-03b (US-02) — negative-but-resolved review

**Given** a task whose final review stage has completed and explicitly reported the acceptance criteria as not satisfied
**When** the run's per-task completion check runs
**Then** the task is not recorded as completed, but its result — including the reported issues — is retained in the run's aggregated results (not silently dropped to `null`), distinguishing it from a task dropped by exhausting its retry limit (AC-02)

### AC-04 (US-01) — domain invariant

**Given** the documented invariant that the pipeline helper always resolves to an array — one entry per item — regardless of how many items were passed, whether consumed directly or gathered from several such calls into one list
**When** a Fork maintainer or an engine inspects the template's per-task example for how it consumes that result
**Then** the example's own code visibly respects the invariant (it unwraps the array rather than treating it as a bare object), and the surrounding text names the invariant for both the direct single-call case and the gathered-into-one-list case, so it cannot be missed by someone adapting the pattern rather than copying it verbatim

### AC-04b (US-01) — no false implication of unimplemented behavior

**Given** the same paragraph in `workflow-exec.md` states, immediately after the fixed `done`-tracking behavior, that a dropped task's transitively-dependent tasks are also skipped
**When** a Fork maintainer applies this fix
**Then** that skip-cascade sentence carries a visible caveat marking it as not-yet-implemented (cross-referencing §8 OQ-1), so a reader does not mistake it for behavior this fix also delivers

### AC-05 (US-01) — cross-context (this template vs. every other reference doc)

**Given** the singleton-array pattern this fix corrects could in principle appear in any other skill's reference documentation, not only this one file
**When** a Fork maintainer greps `skills/**/*.md` for the literal call `pipeline(` after applying this fix
**Then** they can confirm — as this spec's own drafting did — that this template is the only place the pattern occurs; if a second occurrence is found, it is out of scope for this XS fix and is tracked as a new §8 Open Question (or a separate fix) rather than folded into this diff

## 6. Non-functional requirements

<!-- N/A rationale: this is a documentation/template correctness fix, not a running service — there is no request path, so standard latency/throughput/availability rows don't apply. The rows below are the closest measurable equivalents for a generated-script template. -->

| Aspect | Target | Measurement |
|---|---|---|
| Regression recurrence of this exact bug class | 0 occurrences across the next 3 dynamic-workflow `/sdd:implement` runs after this fix ships (post-ship monitoring — not a ship gate; the ship gate is the code-review check in §3) | manual review of each run's final summary step and completed-task tracking (no automated harness exists — §8 OQ-2) |
| Gotcha-warning composition coverage | 2 of 2 known array-unwrap compositions named in a blockquote directly above the code block (the bare singleton-`pipeline()` case and the `parallel(...)`-spread case) | code review at fix time |

## 6.1 Security / privacy

- **Data classification:** N/A — internal engineering documentation; no data is stored or transmitted by this artifact.
- **Personal data touched:** none.
- **AuthZ/AuthN impact:** N/A — no runtime authorization boundary is touched; write access to this template is governed by normal repository permissions, unchanged by this fix.
- **Abuse cases:** N/A — the file has no externally reachable surface; tampering with it is an existing repository-integrity concern (covered by git history/review) that this fix neither introduces nor changes.
- **Security review:** N/A — XS documentation fix, no new authorization boundary, no personal data, per the classify-size XS + `quick` route.

## 7. Metrics / KPIs

- **Dynamic-workflow runs with correct `done`-tracking** — baseline: 0% (every run before this fix populates `done` incorrectly, confirmed by code inspection of the live template), target: 100% within the next 3 dynamic-workflow `/sdd:implement` runs after the fix ships (post-ship monitoring metric — not a ship gate).
- **Late-stage aggregation crashes attributable to this bug class** — baseline: 1 confirmed incident (`elf` project, 13-task DAG, 2026-08-19), target: 0 additional incidents within 90 days of the fix shipping.
- **Hand-rolled reintroduction of the singleton-array-unwrap pattern** — baseline: 1 confirmed reintroduction (the `elf`-run engine's own `results.push(...layerResults)` variant), target: 0 reintroductions observed in code review of future dynamic-workflow-generated scripts (tracked qualitatively — no telemetry exists for this, per §8 OQ-2).

## 8. Open questions

- [ ] Should the skip-cascade behavior the template's prose describes (removing a dropped task's dependents from being run) actually be implemented, given neither this fork nor upstream currently does so? Default now: do not build the behavior here — the prose sentence itself does get a visible not-yet-implemented caveat now (AC-04b), only the cascading skip mechanism stays deferred. — owner: Fork maintainer, due: before the next revision of `workflow-exec.md`'s execution-mode section
- [ ] Should `evals/` be extended to assert on the generated-script's result shape (the existing `implement-ios-consultant` scenario already captures the script text for a different assertion, so the capture point exists), closing the "no automated backstop" gap this fix otherwise leaves open? Default now: out of scope for this XS fix; verification stays code-review-only. — owner: Fork maintainer, due: before the next edit to this template's pipeline/`done` block
- [ ] Should this fix be proposed upstream to the canonical SDD plugin project, which carries the identical unpatched pattern (confirmed against the installed plugin cache, v1.17.0)? Default now: fork-local fix only; not proposed upstream by this spec. — owner: Fork maintainer, due: before the next upstream SDD release is merged into this fork
