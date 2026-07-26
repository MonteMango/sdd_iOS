---
id: T10
title: "Run a manual acceptance walkthrough of all 8 user stories on a scratch feature"
layer: "tests"
deps: ["T2", "T3", "T4", "T5", "T6", "T7", "T8"]
acs: ["AC-01", "AC-01b", "AC-02", "AC-03", "AC-04", "AC-05", "AC-05b", "AC-06", "AC-06b", "AC-06c", "AC-07", "AC-08"]
files_hint: []
owner: "Fork maintainer (Vitalii)"
estimate: "S"
status: "todo"
---

# T10 — Manual acceptance walkthrough

## Why

Spec §6 NFRs are verified by manual audit, not an automated suite (markdown-protocol feature, no test
runner applies) — this task is that audit, run once across every AC before the feature is considered
done — derives from [spec §6 NFR table](../spec.md), [spec §5 AC-01..AC-08](../spec.md).

## What

Run a scratch feature end-to-end: `specify → design → tasks → implement → review → ship`, then a
pre-ship `fix` on a second scratch feature (stopped before `ship`) and a post-ship `fix` on the first
one after it ships. For each resulting `pipeline-log.md`, confirm:

- AC-01 / AC-01b — every backbone-stage section has the right shape, including a 0-agent-count section
- AC-02 — a stage invoked on a feature with no log yet creates one
- AC-03 — a deliberately re-run stage (re-invoke `tasks` after touching a task) replaces its section
  in place with the cumulative total, not a duplicate
- AC-04 — simulate (or find) a dispatch with no usage block and confirm the unavailable marker, not a
  false zero
- AC-05 / AC-05b — no non-`ship`/non-post-ship-`fix` stage ever writes a rollup; the pre-ship fix run
  confirms no rollup appears
- AC-06 / AC-06b / AC-06c — `ship`'s rollup total is independently hand-summed and matches; an
  unavailable-tokens section is excluded and named; a missing backbone stage (enter mid-pipeline on
  the second scratch feature) is named
- AC-07 — the post-ship fix's rollup refresh includes the fix's own section
- AC-08 — every token/duration figure across every section and the rollup carries its label

## Definition of Done

- [ ] all 12 AC checks above pass on the scratch run(s); any drift found is fixed in the relevant
      T2–T8 file before this task closes
- [ ] findings (pass/fail per AC) recorded in this task's Notes or the tracker
- [ ] `TeamCreate` team-mode's usage availability (sad §11 risk row) confirmed one way or the other
      during the `implement` leg

## Notes

No automated test framework applies to markdown skill protocols — this is the feature's whole test
tier, matching spec §6's own "manual audit" measurement method for every NFR row.
