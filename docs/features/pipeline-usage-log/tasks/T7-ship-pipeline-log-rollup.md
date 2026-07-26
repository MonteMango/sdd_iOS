---
id: T7
title: "Wire ship's final step to write its section and compute + write the rollup"
layer: "ports"
deps: ["T1"]
acs: ["AC-01", "AC-01b", "AC-02", "AC-03", "AC-05", "AC-06", "AC-06b", "AC-06c", "AC-08"]
files_hint: ["skills/ship/SKILL.md"]
owner: "Fork maintainer (Vitalii)"
estimate: "M"
status: "todo"
---

# T7 — Wire ship's final step + rollup

## Why

`ship` is the only stage (besides a post-ship `fix`) that ever computes and writes the rollup — the one
trustworthy figure for the whole feature's agent/token footprint (US-02) — derives from
[spec AC-06, AC-06b, AC-06c](../spec.md), [sad §5](../sad.md) (`ship/SKILL.md` gains: write
pipeline-log.md section PLUS compute + write the rollup), [sad §6 Flow 2](../sad.md).

## What

In `skills/ship/SKILL.md`'s step 6 (the terminal handoff step), add, before the handoff emission:

1. create `pipeline-log.md` if absent, write or replace only the `### ship` section (agent count 0 —
   `ship` itself dispatches no sub-agents in its current protocol);
2. read every present backbone-stage (+ `fix`) section in the log;
3. sum agent count and sub-agent tokens across all present sections, summing agent-time duration
   labeled not-wall-clock (AC-06); a section with tokens marked unavailable (AC-04) is excluded from
   the numeric sum and named in the rollup's exclusion list (AC-06b); any of the six backbone stages
   with no section is named in the rollup's missing-stages list (AC-06c);
4. write (or overwrite, if a rollup already exists from a prior `ship` run) the `## Rollup` section per
   `skills/_shared/pipeline-log.md`'s rule.

Add `pipeline-log.md` to `ship`'s handoff Review-before-continuing list.

## Definition of Done

- [ ] `ship`'s step 6 references `skills/_shared/pipeline-log.md` and performs both the section write
      and the rollup computation
- [ ] the rollup total exactly equals the sum of the available figures across present sections
      (recompute-and-diff self-check per spec §6 NFR)
- [ ] a section with unavailable tokens is excluded from the numeric total and named explicitly
      (AC-06b)
- [ ] fewer-than-six-sections case lists the missing backbone stages explicitly (AC-06c)
- [ ] every rollup figure carries the sub-agent-only / agent-time labels (AC-08)
- [ ] handoff's Review-before-continuing list includes `pipeline-log.md`

## Notes

Runs in parallel with T2–T6, T8–T9 (all depend only on T1). This is the rollup-writing half of the
ownership boundary T8 mirrors for the post-ship-fix case.
