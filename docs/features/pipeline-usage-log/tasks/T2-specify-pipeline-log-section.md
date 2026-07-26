---
id: T2
title: "Wire specify's final step to write its pipeline-log section"
layer: "app"
deps: ["T1"]
acs: ["AC-01", "AC-01b", "AC-02", "AC-03", "AC-05"]
files_hint: ["skills/specify/SKILL.md"]
owner: "Fork maintainer (Vitalii)"
estimate: "S"
status: "todo"
---

# T2 — Wire specify's final step

## Why

`specify` is a never-skippable backbone stage and must produce or update its own section on every run,
regardless of sub-agent count — derives from [spec AC-01, AC-01b, AC-02](../spec.md),
[sad §5](../sad.md) (`specify/SKILL.md` gains: write pipeline-log.md section).

## What

In `skills/specify/SKILL.md`'s final protocol step (same position as the existing commit + handoff
emission), add: create `docs/features/<slug>/pipeline-log.md` if it doesn't exist, then write or
replace (per `skills/_shared/pipeline-log.md`'s exact-heading-match + cumulative-sum rule) only the
`### specify` section — agent count of this run's `Agent`-tool dispatches (0 if none), sub-agent tokens
and agent-time duration, plus a short prose line on the depth dial used and which named ideation
subagents ran. Add `docs/features/<slug>/pipeline-log.md` to the *Review before continuing* list in
`specify`'s handoff block per [handoff.md](../../../../skills/_shared/handoff.md).

## Definition of Done

- [ ] `specify`'s final protocol step references `skills/_shared/pipeline-log.md` and performs the write
- [ ] a run with zero ideation-subagent dispatches (depth `easy`) still produces a section with agent
      count 0 (AC-01b)
- [ ] a re-run of `specify` on the same feature replaces the `### specify` section in place with the
      cumulative total, not a duplicate (AC-03)
- [ ] `specify` never writes a rollup section (AC-05)
- [ ] handoff's Review-before-continuing list includes `pipeline-log.md`

## Notes

Runs in parallel with T3–T9 — all depend only on T1, none share a file lock.
