---
id: T4
title: "Wire tasks' final step to write its pipeline-log section"
layer: "app"
deps: ["T1"]
acs: ["AC-01", "AC-01b", "AC-02", "AC-03", "AC-05"]
files_hint: ["skills/tasks/SKILL.md"]
owner: "Fork maintainer (Vitalii)"
estimate: "S"
status: "todo"
---

# T4 — Wire tasks' final step

## Why

`tasks` is a never-skippable backbone stage; it dispatches no sub-agents itself but must still record a
section with agent count 0 on every run — derives from [spec AC-01, AC-01b, AC-02](../spec.md),
[sad §5](../sad.md) (`tasks/SKILL.md` gains: write pipeline-log.md section).

## What

In `skills/tasks/SKILL.md`'s step 13 (alongside the existing commit + handoff), add: create
`pipeline-log.md` if absent, then write or replace only the `### tasks` section — agent count 0 (this
skill dispatches no sub-agents in its current protocol), plus prose noting the task count and route
used. Add `pipeline-log.md` to `tasks`'s handoff Review-before-continuing list.

## Definition of Done

- [ ] `tasks`'s step 13 references `skills/_shared/pipeline-log.md` and performs the write
- [ ] the section shows agent count 0 rather than being skipped (AC-01b)
- [ ] a re-run of `tasks` (scope change) replaces the `### tasks` section in place with the cumulative
      total (AC-03)
- [ ] `tasks` never writes a rollup section (AC-05)
- [ ] handoff's Review-before-continuing list includes `pipeline-log.md`

## Notes

Runs in parallel with T2, T3, T5–T9. This is the same skill file this breakdown itself was produced
by — the edit is self-referential but mechanically identical to the other six.
