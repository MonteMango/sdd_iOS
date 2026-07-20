---
id: T11
title: "Close DoD/anti-patterns/References across the 4 stages"
layer: "docs"
deps: ["T4", "T5", "T6", "T7", "T9", "T10"]
acs: ["AC-01", "AC-02", "AC-03", "AC-07", "AC-08"]
files_hint: ["skills/implement/SKILL.md", "skills/plan-tests/SKILL.md", "skills/review/SKILL.md", "skills/sequences/SKILL.md"]
owner: "Fork maintainer"
estimate: "S"
status: "todo"
---

# T11 — Close DoD/anti-patterns/References across the 4 stages

## Why

Matches the precedent (`design-swift-consultants` T6): each stage's own Definition of Done, Anti-patterns, and References sections must reflect the new consultant wiring, citing the AC/ADR it derives from — otherwise the protocol addition is undocumented at the one place operators actually read before running the stage. Derives from [spec §5 AC set](../spec.md), [sad §9 ADR index](../sad.md).

## What

In each of `skills/implement/SKILL.md`, `skills/plan-tests/SKILL.md`, `skills/review/SKILL.md`, `skills/sequences/SKILL.md`: add a Definition-of-Done bullet naming the observable-trace-or-fallback-marker guarantee for that stage (mirroring `design/SKILL.md`'s existing bullet — "either an observable trace... or a fallback marker... never neither, never both silently missing"); add an Anti-patterns bullet for that stage's own version of "letting a code-level consultant-brief item into the artifact" (or, for `review`, "letting a structural-altitude item become a citable finding"); add a References pointer to `../_shared/consultant-trigger.md` and `../_shared/consultant-fold.md` (and, for `review`, to wherever T8/T9 documented the diff-visible detection, if it lives in a `references/` file rather than inline).

## Definition of Done

- [ ] Each of the 4 `SKILL.md` files has a DoD bullet, an Anti-patterns bullet, and a References pointer for the new consultant wiring.
- [ ] Each bullet cites the AC(s) and/or ADR it derives from, matching the style already used in `design/SKILL.md`.

## Notes

Depends on T4–T10 completing so this task documents the actually-shipped behavior, not a plan. Shares files with those tasks (overlapping `files_hint`) — expect this to serialize behind them in the same lane per the tasks.json contract.
