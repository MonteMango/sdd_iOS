---
id: T8
title: "Wire fix's final step to write its section and conditionally refresh the rollup"
layer: "ports"
deps: ["T1"]
acs: ["AC-01", "AC-01b", "AC-02", "AC-03", "AC-05", "AC-05b", "AC-07"]
files_hint: ["skills/fix/SKILL.md"]
owner: "Fork maintainer (Vitalii)"
estimate: "S"
status: "todo"
---

# T8 — Wire fix's final step + conditional rollup refresh

## Why

`fix` runs on any feature it touches, pre-ship or post-ship — the discriminator for whether it also
touches the rollup is purely "does a `## Rollup` section already exist" — derives from
[spec AC-05b, AC-07](../spec.md), [sad §5](../sad.md) (`fix/SKILL.md` gains: write pipeline-log.md
section; if the feature already has a rollup section, also refresh it), [sad §6 coverage note](../sad.md).

## What

In `skills/fix/SKILL.md`'s final protocol step, add: create `pipeline-log.md` if absent, then write or
replace only the `### fix` section (agent count of this run's `Agent`-tool dispatches — `explorer`,
`test-author`, `implementer`, etc. — 0 if none), sub-agent tokens, agent-time duration, prose noting
whether the fix was pre-ship or post-ship. Then check: does the log already have a `## Rollup` section?

- **yes (post-ship fix)** — recompute and overwrite the rollup using T7's rule so it includes this
  fix's own section (AC-07);
- **no (pre-ship fix)** — do not create a rollup section (AC-05b); only `ship` creates the first one.

Add `pipeline-log.md` to `fix`'s handoff Review-before-continuing list.

## Definition of Done

- [ ] `fix`'s final protocol step references `skills/_shared/pipeline-log.md` and performs the
      conditional write
- [ ] a pre-ship fix (no `## Rollup` yet) writes only its own section (AC-05b)
- [ ] a post-ship fix (a `## Rollup` already present) refreshes it to include the fix's own section
      (AC-07), using the same computation rule as T7
- [ ] a re-run of `fix` on the same feature (recurrence) replaces the `### fix` section in place with
      the cumulative total (AC-03)
- [ ] handoff's Review-before-continuing list includes `pipeline-log.md`

## Notes

Runs in parallel with T2–T7, T9 (all depend only on T1). Mirrors T7's rollup-write logic but gated by
the rollup-section-presence check instead of always writing it.
