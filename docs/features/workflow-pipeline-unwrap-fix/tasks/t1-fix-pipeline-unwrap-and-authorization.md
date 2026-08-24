---
id: T1
title: "Fix per-task pipeline unwrap, authorization field, and null-propagation; add Gotcha blockquote"
layer: "docs"
deps: []
acs: ["AC-01", "AC-02", "AC-03", "AC-03b", "AC-04"]
files_hint: ["skills/implement/references/workflow-exec.md"]
owner: "Fork maintainer"
estimate: "S"
status: "todo"
---

# T1 — Fix per-task pipeline unwrap, authorization field, and null-propagation; add Gotcha blockquote

## Why

Derives from [spec §1](../spec.md), [spec AC-01/AC-02/AC-03/AC-03b/AC-04](../spec.md#5-acceptance-criteria), and [sad §4 decisions 2–5](../sad.md#4-solution-strategy): the current `.then(res => { if (res?.gate_green) done.add(t.id); return {t, res}; })` in `skills/implement/references/workflow-exec.md`'s "Generated script shape" reads `res` as a bare object when `pipeline([t], ...)` actually resolves to a 1-element array, and checks a field (`gate_green`) that doesn't exist on the pipeline's final `review` stage output (`REVIEW_VERDICT`).

## What

In `skills/implement/references/workflow-exec.md`, within the "Generated script shape" section:

- Change the per-task `.then()` to destructure the single-element array: `.then(([res]) => ...)`.
- Check `res?.ac_satisfied` (the final `review` stage's `REVIEW_VERDICT` field) instead of `res?.gate_green` (which only exists on the earlier `green`/`verify` stages' `GATE_VERDICT`).
- Preserve `filter(Boolean)`-safe null-propagation: return `null` (not `{t, res: null}`) when the array element is falsy (task dropped past retries — AC-02); return `{t, res}` when `res` resolved, regardless of `ac_satisfied` (a resolved-but-`ac_satisfied: false` review is retained, not nulled — AC-03b).
- Add a Gotcha blockquote directly above the code block (not appended after the existing bullet list below it) naming the array-always invariant and covering both known compositions that have caused a production incident: the bare `pipeline([t], ...).then()` case, and the `parallel(...).map(() => pipeline([t], ...))` → flat-spread case. State that a dropped array element resolves to `null`, never a rejected promise, so no `.catch()` is needed.
- Do not change the `RED_VERDICT`/`GATE_VERDICT`/`REVIEW_VERDICT` schemas or the 4-stage `red → green → verify → review` shape ([sad §2](../sad.md) constraint).

## Definition of Done

- [ ] The code block's `.then()` destructures `[res]` and checks `res?.ac_satisfied`, never `res?.gate_green`, to call `done.add(t.id)` (AC-01, AC-03).
- [ ] A dropped task (falsy array element) maps to `null`; a resolved task (any `ac_satisfied` value) maps to `{t, res}` (AC-02, AC-03b).
- [ ] A Gotcha blockquote sits directly above the code block and names both the bare-`pipeline()` and the `parallel(...)`-spread compositions, and states the null-not-rejected contract (AC-04).
- [ ] The `RED_VERDICT`/`GATE_VERDICT`/`REVIEW_VERDICT` schemas and the 4-stage shape are unchanged (sad §2 constraint, verified by diff review).

## Notes

Shares `skills/implement/references/workflow-exec.md` with T2 — same file, so T2 is serialized after this task. Verification is code-review-only for this XS fix; no automated harness executes the embedded JS ([spec §3](../spec.md) non-goal).
