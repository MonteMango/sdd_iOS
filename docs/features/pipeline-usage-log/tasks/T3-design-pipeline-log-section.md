---
id: T3
title: "Wire design's final step to write its pipeline-log section"
layer: "app"
deps: ["T1"]
acs: ["AC-01", "AC-01b", "AC-02", "AC-03", "AC-05"]
files_hint: ["skills/design/SKILL.md"]
owner: "Fork maintainer (Vitalii)"
estimate: "S"
status: "todo"
---

# T3 — Wire design's final step

## Why

`design` is a never-skippable backbone stage and dispatches consultant sub-agents on trigger signals —
its section is the visible trace of that fan-out — derives from
[spec AC-01, AC-01b, AC-02](../spec.md), [sad §5](../sad.md) (`design/SKILL.md` gains: write
pipeline-log.md section).

## What

In `skills/design/SKILL.md`'s final protocol step, add: create `pipeline-log.md` if absent, then
write or replace only the `### design` section — agent count of this run's `Agent`-tool dispatches
(including any consultant dispatches per `consultant-trigger.md`, 0 if none), sub-agent tokens, agent-time
duration, plus prose on the interview depth and which ADRs were spawned. Add `pipeline-log.md` to
`design`'s handoff Review-before-continuing list.

## Definition of Done

- [ ] `design`'s final protocol step references `skills/_shared/pipeline-log.md` and performs the write
- [ ] a run with zero consultant/sub-agent dispatches still produces a section with agent count 0 (AC-01b)
- [ ] a re-run of `design` (e.g. after a critic loop-back) replaces the `### design` section in place
      with the cumulative total (AC-03)
- [ ] `design` never writes a rollup section (AC-05)
- [ ] handoff's Review-before-continuing list includes `pipeline-log.md`

## Notes

Runs in parallel with T2, T4–T9.
