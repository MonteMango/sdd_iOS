---
id: T10
title: "Run a manual acceptance walkthrough of all 8 user stories on a scratch feature"
layer: "tests"
deps: ["T2", "T3", "T4", "T5", "T6", "T7", "T8"]
acs: ["AC-01", "AC-01b", "AC-02", "AC-03", "AC-04", "AC-05", "AC-05b", "AC-06", "AC-06b", "AC-06c", "AC-07", "AC-08"]
files_hint: []
owner: "Fork maintainer (Vitalii)"
estimate: "S"
status: "done"
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

- [x] all AC checks pass on the scratch run (one exception noted below, not a drift — a coverage gap)
- [x] findings (pass/fail per AC) recorded in this task's Notes
- [ ] `TeamCreate` team-mode's usage availability (sad §11 risk row) confirmed — **not reached**: the
      scratch feature was XS/1-task, so `implement` ran sequential mode only; team/workflow mode's
      capture path is verified by re-reading ADR-0002 + the T5 wiring text only, not a live run. Left
      open per sad §11's own risk row — no fix needed in T1–T9, just an honest gap.

## Notes — walkthrough results (2026-08-03/04, scratch feature `scratch-log-walkthrough`, deleted after)

Ran for real: `specify` (1 `sdd:critic` dispatch) → `design` (1 `sdd:critic` dispatch) → `tasks` (0
dispatches) → `implement` (sequential mode, 0 dispatches — RED/GREEN done by the orchestrator itself)
→ `review` (1 `sdd:reviewer` dispatch) → pre-ship `fix` (1 `sdd:explorer` dispatch) → `ship` (0
dispatches, rollup computed) → post-ship `fix` (1 dispatch, its usage **deliberately simulated as
unavailable** per this spec's own Test plan "force or simulate" instruction for AC-04, clearly labeled
as such in the fix record — not a real failure).

| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | Specify/Design/Review/Fix sections show agent count, approach/mode, labeled tokens + duration for real dispatches |
| AC-01b | PASS | Tasks/Implement/Ship sections written with agent count 0 — never skipped |
| AC-02 | PASS | `specify` created `pipeline-log.md` from nothing |
| AC-03 | PASS | Post-ship fix replaced the single `### Fix` heading in place with cumulative agent count (1→2) and summed tokens/duration — never a second `### Fix` section |
| AC-04 | PASS (simulated dispatch, per spec's own sanctioned method) | Fix section's post-ship dispatch recorded as "1 of 2 dispatches unavailable — excluded", never a false zero |
| AC-05 | PASS | Grepped all 7 skill files — only `ship.md`/`fix.md` mention "Rollup" at all |
| AC-05b | PASS | After the pre-ship fix, `pipeline-log.md` had zero `### Rollup` sections (verified by grep before `ship` ran) |
| AC-06 | PASS | `ship` computed the rollup from all 6 present sections + Fix; hand-summed total matched (agent count 4, tokens 50,501, duration 115s) |
| AC-06b | PASS | Rollup's `Excluded from token/duration total` line went from "none" (pre-post-ship-fix) to "Fix — 1 of 2 dispatches unavailable" once a real exclusion existed |
| AC-06c | PASS (targeted check, not the live run) | The live run had all 6 backbone sections (nothing missing), so its own rollup correctly says "none". Separately verified the rule's other branch by applying it to a throwaway scratch copy of `pipeline-log.md` with `### Review` removed — the rule correctly named "Review" as missing (not part of the real feature's git history) |
| AC-07 | PASS | Post-ship fix recomputed and overwrote the rollup (agent count 4→5, exclusion note added) — not stale |
| AC-08 | PASS | Grepped every token/duration line in the produced log — 100% carry the sub-agent-only / agent-time-not-wall-clock labels |

No drift found requiring a fix to `skills/_shared/pipeline-log.md` or the T2–T8 wiring. The one open
item is the `TeamCreate`/`Workflow` capture paths noted above — genuinely unexercised by this
walkthrough, left as a known gap rather than falsely marked verified.
