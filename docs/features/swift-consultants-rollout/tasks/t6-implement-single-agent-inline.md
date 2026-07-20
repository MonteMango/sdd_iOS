---
id: T6
title: "implement: single-agent inline consult + settings reconciliation"
layer: "app"
deps: ["T2"]
acs: ["AC-02", "AC-06"]
files_hint: ["skills/implement/references/tdd-loop.md"]
owner: "Fork maintainer"
estimate: "S"
status: "todo"
---

# T6 — implement: single-agent inline consult + settings reconciliation

## Why

ADR-0001: single-agent mode *can* self-consult (the main session does the work itself, with `Skill` available), and precomputing there would waste a consultant call on a task that might get dropped/blocked before it runs — so it consults inline, right before that task's own RED step, mirroring `design`'s own idiom. AC-06 requires the testing consultant's brief to never recommend a shape the project's own `tdd`/`gate_lint`/`cmd_test_unit` settings would reject. Derives from [spec US-02/AC-02, US-08/AC-06](../spec.md), [sad §4/§6](../sad.md), [ADR-0001](../adr/0001-hybrid-task-scoped-pre-consult.md).

## What

`skills/implement/references/tdd-loop.md`: right before the SELECT/RED step for a task carrying a UI/async/test-strategy signal, consult the matching consultant(s) inline, scoped to that one task's own text, passing in the project's already-read settings (`.claude/sdd.local.md`'s `tdd`/`gate_lint`/`cmd_test_unit`, per spec §8 OQ's stated default — same channel as `CLAUDE.md` project rules). Fold at full-code altitude; on a conflict between the testing consultant's brief and those settings, the settings win — the folded guidance never recommends a test shape those settings would reject (AC-06). Fold the result into the task's own inline working context, then proceed to RED. No signal → no consult (AC-09). Fallback marker: bundle-unavailable or degenerate brief → a per-task line noted in this task's own commit/handoff step, never blocking RED.

## Definition of Done

- [ ] A fixture task carrying a test-strategy signal, run single-agent, shows the testing consultant's brief passed into the same prompt/context as the project's `tdd`/`gate_lint`/`cmd_test_unit` settings, and a deliberately conflicting fixture brief (e.g. recommending a test shape `gate_lint: false` — actually any setting that would reject it) is overridden by the project setting (AC-06).
- [ ] A no-signal fixture task shows zero consultant calls, zero bundle loads (AC-09).
- [ ] A bundle-unavailable fixture on a signalled task shows the fallback marker surfacing without blocking RED.

## Notes

Distinct code path from [T4](./t4-implement-team-precompute.md)/[T5](./t5-implement-workflow-precompute.md) per ADR-0001's accepted tradeoff (two mechanisms, not one) — do not try to unify them into a shared precompute helper; that would contradict the ADR's stated reasoning.
