---
id: T4
title: "implement: team-mode task-scoped consultant precompute"
layer: "app"
deps: ["T2"]
acs: ["AC-02", "AC-05"]
files_hint: ["skills/implement/SKILL.md", "skills/implement/references/team-exec.md"]
owner: "Fork maintainer"
estimate: "M"
status: "todo"
---

# T4 — implement: team-mode task-scoped consultant precompute

## Why

ADR-0001: `test-author`/`implementer` sub-agents cannot spawn a consultant themselves (no `Skill` tool, "the lead owns fan-out"), so team mode must precompute each signalled task's own brief at step 6, before dispatch. ADR-0002: the main session pre-consults and pastes the brief into the sub-agent's own dispatch prompt — `test-author`/`implementer` stay unedited. Derives from [spec US-02/AC-02, US-07/AC-05](../spec.md), [sad §4/§5](../sad.md), [ADR-0001](../adr/0001-hybrid-task-scoped-pre-consult.md), [ADR-0002](../adr/0002-pre-consult-injection-for-subagent-only-stages.md).

## What

`skills/implement/references/team-exec.md`: at TaskList-body generation, for each task carrying a UI/async/test-strategy signal (per `../_shared/consultant-trigger.md`'s "task title+acs+dod" detection row), spawn the matching consultant(s) scoped to that one task's own text, fold the returned brief at `implement`'s own altitude (full-code, per `../_shared/consultant-fold.md`), and bake the folded brief into *that task's own* TaskList body — never a brief shared across tasks. A task with no signal gets no brief (AC-09, already covered structurally — no extra code needed, the detection is the gate). `skills/implement/SKILL.md` step 6: add the one-line pointer describing this precompute happens for team mode. Fallback marker (spec §8 OQ default, sad §11): when an expected consultant doesn't fire or returns nothing usable for a signalled task, add a per-task line to that task's own TaskList body noting the miss, and mirror it in the stage-handoff's *What I did* (per-task line) — never block dispatch.

## Definition of Done

- [ ] A fixture DAG with one UI-signalled task, one async-signalled task, and one no-signal task, run in team mode, shows: the UI task's TaskList body carries only SwiftUI-consultant content, the async task's only Swift-concurrency content, the no-signal task none (AC-02).
- [ ] The dispatched `test-author`/`implementer` agent files (`agents/test-author.md`, `agents/implementer.md`) are unedited by this task (AC-05, spec §3 non-goal 7).
- [ ] A bundle-unavailable fixture on a signalled task produces the per-task fallback-marker line in the TaskList body and in the handoff, without blocking the run.

## Notes

Shares `skills/implement/SKILL.md` step 6 text with [T5](./t5-implement-workflow-precompute.md) (workflow mode) — coordinate the shared paragraph rather than each task rewriting it twice; the two are otherwise independent files (`team-exec.md` vs `workflow-exec.md`) and can proceed in parallel.
