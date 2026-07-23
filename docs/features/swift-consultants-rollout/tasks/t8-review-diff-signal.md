---
id: T8
title: "review: diff-visible signal detection (ADR-0005)"
layer: "app"
deps: ["T1"]
acs: ["AC-07", "AC-09"]
files_hint: ["skills/review/SKILL.md"]
owner: "Fork maintainer"
estimate: "M"
status: "todo"
---

# T8 — review: diff-visible signal detection (ADR-0005)

## Why

Resolves spec §8's open question and §6's previously-`TBD` NFR row: `review` must not fire on ordinary `async`/`await` syntax. ADR-0005 fixes the mechanism as an AND-gate between the existing spec-visible signal (reused verbatim from `design`'s mechanism) and a new diff-visible signal. This task builds the diff-visible half. Derives from [spec §3 non-goal 2, §6 NFR, §8 OQ 1](../spec.md), [sad §4/§6/§10](../sad.md), [ADR-0005](../adr/0005-review-trigger-and-gate.md).

## What

In `skills/review/SKILL.md`, before step 2 (dispatch): scope `git diff <base>..HEAD` to added lines in `.swift` files only (no context/deleted-line noise, per ADR-0005's cheap-scoping consequence). For each of the 3 classes, run `../_shared/consultant-trigger.md`'s keyword set against those added lines, **plus** a second model-inference pass reading the diff's actual code (catches semantic signal a keyword miss — e.g. a `Task {}` block with no literal "async" keyword). A class's diff-visible signal affirms only when either the keyword match or the model-inference pass affirms for that class. This produces one diff-visible boolean per class, read by [T9](./t9-review-preconsult-inject.md) to complete the AND-gate.

## Definition of Done

- [ ] On a manual sample of ≥5 non-UI/non-async fixture diffs (pure backend/logic changes), the diff-visible signal is false for the UI and async classes in ≥90% of the sample (ADR-0005's ≤10% false-fire ceiling, measured at this signal's own layer).
- [ ] A fixture diff with genuine `async`/`await`/actor-hop `.swift` additions shows the async class's diff-visible signal true.
- [ ] A fixture diff touching only non-`.swift` files shows every class's diff-visible signal false, regardless of spec content.

## Notes

This task produces the diff-visible signal only — it does not yet gate anything or dispatch a consultant; [T9](./t9-review-preconsult-inject.md) combines it with the spec-visible signal (AND) and acts on the result. Keep this task's diff scoped to the detection function/section, not the pre-consult flow.
