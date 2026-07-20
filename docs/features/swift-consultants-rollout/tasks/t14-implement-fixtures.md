---
id: T14
title: "Verify implement fixtures (AC-02, AC-05, AC-06)"
layer: "tests"
deps: ["T4", "T5", "T6", "T11"]
acs: ["AC-02", "AC-05", "AC-06"]
files_hint: ["evals/scenarios/implement-ios-consultant/"]
owner: "Fork maintainer"
estimate: "M"
status: "todo"
---

# T14 — Verify implement fixtures (AC-02, AC-05, AC-06)

## Why

Closes the loop on [T4](./t4-implement-team-precompute.md)/[T5](./t5-implement-workflow-precompute.md)/[T6](./t6-implement-single-agent-inline.md)'s inline DoD checks with a recorded fixture run across all 3 execution modes — the highest-ROI stage per spec §1's traceability (`implement` MAX priority). Derives from [spec AC-02, AC-05, AC-06](../spec.md).

## What

Under `evals/scenarios/implement-ios-consultant/`, create fixture runs covering: (1) single-agent mode on a DAG with a UI-signalled task, an async-signalled task, and a no-signal task — expect each task's own inline consult (or none) per AC-02; (2) team mode on the same DAG shape — expect each TaskList body carrying its own task-scoped brief per AC-02/AC-05; (3) workflow mode on the same DAG shape — expect each generated `redPrompt(t)` carrying its own `consultant_brief` per AC-02/AC-05; (4) a single-agent task where the testing consultant's brief conflicts with a fixture `.claude/sdd.local.md` setting — expect the project setting to win (AC-06). Record a README per the precedent's format.

## Definition of Done

- [ ] 4 fixture runs exist under `evals/scenarios/implement-ios-consultant/` with a README recording AC-02/AC-05/AC-06 pass/fail per run.
- [ ] All 4 fixtures pass, and none shows `test-author.md`/`implementer.md` edited.

## Notes

Depends on all three of T4/T5/T6 (the three modes under test) and [T11](./t11-dod-antipatterns-closure.md).
