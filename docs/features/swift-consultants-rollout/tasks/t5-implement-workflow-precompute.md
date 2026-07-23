---
id: T5
title: "implement: workflow-mode task-scoped consultant precompute"
layer: "app"
deps: ["T2"]
acs: ["AC-02", "AC-05"]
files_hint: ["skills/implement/SKILL.md", "skills/implement/references/workflow-exec.md"]
owner: "Fork maintainer"
estimate: "M"
status: "todo"
---

# T5 — implement: workflow-mode task-scoped consultant precompute

## Why

Same driver as [T4](./t4-implement-team-precompute.md) — a `Workflow` script's sandbox exposes only `agent()`/`parallel()`/`pipeline()`, no `Skill` tool, so it cannot self-consult; the main session must precompute each task's brief before generating the script. Derives from [spec US-02/AC-02, US-07/AC-05](../spec.md), [sad §4/§5](../sad.md), [ADR-0001](../adr/0001-hybrid-task-scoped-pre-consult.md), [ADR-0002](../adr/0002-pre-consult-injection-for-subagent-only-stages.md).

## What

`skills/implement/references/workflow-exec.md`: at generated-script build time, for each task carrying a UI/async/test-strategy signal, spawn the matching consultant(s) scoped to that one task, fold at `implement`'s full-code altitude, and embed the result as that task's own `consultant_brief` variable — the generated `redPrompt(t)` function (or equivalent per-task prompt builder) interpolates `t.consultant_brief` so `test-author`'s dispatched RED-step prompt carries it. A task with no signal gets `consultant_brief = null` / omitted, and `redPrompt(t)` renders with no consultant section at all (AC-09). `skills/implement/SKILL.md` step 6: extend the same one-line pointer from T4 to cover workflow mode too. Fallback marker: when a signalled task's consultant call fails or returns nothing usable, `consultant_brief` carries the marker text instead of a brief, so it still surfaces inside the generated prompt / task log, and mirror it in the handoff's *What I did*.

## Definition of Done

- [ ] The generated `Workflow` script's per-task prompt for a signalled task includes that task's own `consultant_brief`; a differently-signalled (or unsignalled) task in the same run gets a different (or absent) one.
- [ ] `test-author`/`implementer` agent definitions remain unedited by this task.
- [ ] A bundle-unavailable fixture on a signalled task shows the fallback-marker text inside `consultant_brief` and in the handoff, with the workflow run completing (never blocked).

## Notes

Independent file from [T4](./t4-implement-team-precompute.md) (`workflow-exec.md` vs `team-exec.md`) — parallelizable once T2 lands; only the shared `SKILL.md` step-6 paragraph needs coordinating between the two.
