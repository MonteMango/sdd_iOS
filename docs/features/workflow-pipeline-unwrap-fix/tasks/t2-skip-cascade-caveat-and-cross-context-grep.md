---
id: T2
title: "Add not-yet-implemented caveat to skip-cascade prose; confirm cross-context uniqueness"
layer: "docs"
deps: ["T1"]
acs: ["AC-04b", "AC-05"]
files_hint: ["skills/implement/references/workflow-exec.md"]
owner: "Fork maintainer"
estimate: "S"
status: "todo"
---

# T2 — Add not-yet-implemented caveat to skip-cascade prose; confirm cross-context uniqueness

## Why

Derives from [spec AC-04b/AC-05](../spec.md#5-acceptance-criteria) and [spec §3 non-goal 1](../spec.md): the "Fail drops the subtree" bullet in `workflow-exec.md` states, immediately after the fixed `done`-tracking behavior, that a dropped task's transitively-dependent tasks are also skipped — behavior that exists in neither this fork nor upstream. Left uncaveated, a reader could mistake it for behavior T1's fix also delivers. Separately, spec §1 and AC-05 require confirming this is still the only `pipeline(` call site in `skills/**/*.md` after the fix lands.

## What

In `skills/implement/references/workflow-exec.md`:

- In the "Fail drops the subtree" bullet, add a visible caveat to the skip-cascade sentence ("the engine removes it from `done`, so every transitively-dependent task is skipped") marking it as not-yet-implemented, cross-referencing [spec §8 OQ-1](../spec.md#8-open-questions). Do not implement the skip-cascade behavior itself — that stays out of scope ([spec §3](../spec.md) non-goal).
- Run `grep -rn "pipeline(" skills/**/*.md` across the repo and confirm `workflow-exec.md` is still the only occurrence (AC-05). If a second occurrence is found, do not fold it into this diff — record it as a new §8 Open Question or a separate fix, per AC-05.

## Definition of Done

- [ ] The skip-cascade sentence in the "Fail drops the subtree" bullet carries a visible not-yet-implemented caveat cross-referencing spec §8 OQ-1 (AC-04b).
- [ ] No skip-cascade behavior is added to the script — only the prose caveat changes.
- [ ] `grep -rn "pipeline(" skills/**/*.md` confirms `workflow-exec.md` remains the only occurrence, or a new out-of-scope occurrence is logged as a follow-up rather than fixed here (AC-05).

## Notes

Shares `skills/implement/references/workflow-exec.md` with T1 — serialized after it. Verification is code-review-only for this XS fix ([spec §3](../spec.md) non-goal).
