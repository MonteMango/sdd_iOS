---
id: T1
title: "Write the shared pipeline-log template (section format, accumulation, rollup rule, mode-aware capture)"
layer: "domain"
deps: []
acs: ["AC-01", "AC-01b", "AC-02", "AC-03", "AC-04", "AC-05", "AC-05b", "AC-06", "AC-06b", "AC-06c", "AC-08"]
files_hint: ["skills/_shared/pipeline-log.md"]
owner: "Fork maintainer (Vitalii)"
estimate: "M"
status: "todo"
---

# T1 — Write the shared pipeline-log template

## Why

Seven skill files share one exact section shape and one exact cumulative-replace algorithm; defining
both once avoids seven independently-drifting copies — derives from
[ADR-0001](../adr/0001-shared-pipeline-log-template.md), [ADR-0002](../adr/0002-mode-aware-usage-capture.md),
[sad §5](../sad.md), [sad §8 Crosscutting concepts](../sad.md).

## What

Create `skills/_shared/pipeline-log.md` (mirroring `skills/_shared/handoff.md`'s existing precedent),
defining:

- the `### <Stage>` H3 section shape: agent count, sub-agent tokens (labeled "sub-agent-only, excludes
  orchestrator overhead"), agent-time duration (labeled "agent-time, not wall-clock"), free prose on
  approach/mode (AC-01, AC-01b, AC-08);
- the "section already exists" rule: exact-heading match on the H3, replace the block wholesale with
  prior-cumulative + this-run figures summed — never a duplicate section, never latest-run-only (AC-03);
- lazy creation: any stage on a feature with no `pipeline-log.md` yet creates the file, never skips or
  fails (AC-02);
- the AC-04 unavailable-marker text for a dispatch whose `<usage>` block didn't return;
- the rollup computation rule (who: only `ship` / post-ship `fix`; sums agent count + sub-agent tokens
  across present backbone-stage + `fix` sections, excludes any optional-stage section; lists excluded
  sections with unavailable tokens (AC-06b) and missing backbone stages (AC-06c) as plain bullets);
- the rollup-ownership boundary text (AC-05, AC-05b) — every non-`ship`/non-post-ship-`fix` stage's
  protocol contains no rollup-write step;
- `implement`'s three-mode capture branch (ADR-0002): sequential/team sum `Agent`-tool `<usage>`
  dispatches; workflow reads `budget.spent()`; a mode that can't retrieve usage marks it unavailable.

## Definition of Done

- [ ] `skills/_shared/pipeline-log.md` exists and covers every bullet above
- [ ] the section format + accumulation rule matches AC-01/AC-01b/AC-03 verbatim in spirit
- [ ] the honesty labels match AC-08's wording intent (sub-agent-only / agent-time-not-wall-clock)
- [ ] the rollup rule matches AC-06/AC-06b/AC-06c and the ownership boundary matches AC-05/AC-05b
- [ ] no machine-readable companion format introduced (spec §3 non-goal)

## Notes

This file is the compile-coupled foundation for T2–T8 — every one of those tasks' `files_hint` is a
distinct skill file, so none of them share a file lock with T1 or each other; they only depend on T1
existing first. Keep this file's own examples generic (a fictitious stage), not copy-pasted from any
one real stage.
