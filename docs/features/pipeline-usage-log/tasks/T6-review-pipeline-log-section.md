---
id: T6
title: "Wire review's final step to write its pipeline-log section"
layer: "app"
deps: ["T1"]
acs: ["AC-01", "AC-01b", "AC-02", "AC-03", "AC-05"]
files_hint: ["skills/review/SKILL.md"]
owner: "Fork maintainer (Vitalii)"
estimate: "S"
status: "todo"
---

# T6 — Wire review's final step

## Why

`review` is a never-skippable backbone stage that dispatches the independent reviewer (and any
consultant re-checks) — its section is the trace of that dispatch — derives from
[spec AC-01, AC-01b, AC-02](../spec.md), [sad §5](../sad.md) (`review/SKILL.md` gains: write
pipeline-log.md section).

## What

In `skills/review/SKILL.md`'s final protocol step, add: create `pipeline-log.md` if absent, then write
or replace only the `### review` section — agent count of this run's `Agent`-tool dispatches (reviewer
+ any consultant re-checks, 0 if none), sub-agent tokens, agent-time duration, plus prose noting the
verdict (`PASS` / `CHANGES REQUESTED`). Add `pipeline-log.md` to `review`'s handoff
Review-before-continuing list.

## Definition of Done

- [ ] `review`'s final protocol step references `skills/_shared/pipeline-log.md` and performs the write
- [ ] the section is written on both a `PASS` and a `CHANGES REQUESTED` verdict
- [ ] a re-run of `review` (a second review pass after a loop-back fix) replaces the `### review`
      section in place with the cumulative total (AC-03)
- [ ] `review` never writes a rollup section (AC-05)
- [ ] handoff's Review-before-continuing list includes `pipeline-log.md`

## Notes

Runs in parallel with T2–T5, T7–T9.
