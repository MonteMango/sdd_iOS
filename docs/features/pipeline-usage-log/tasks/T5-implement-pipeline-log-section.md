---
id: T5
title: "Wire implement's final step to write its pipeline-log section, mode-aware per ADR-0002"
layer: "app"
deps: ["T1"]
acs: ["AC-01", "AC-01b", "AC-02", "AC-03", "AC-04", "AC-05"]
files_hint: ["skills/implement/SKILL.md", "skills/implement/references/tdd-loop.md", "skills/implement/references/team-exec.md", "skills/implement/references/workflow-exec.md"]
owner: "Fork maintainer (Vitalii)"
estimate: "M"
status: "todo"
---

# T5 — Wire implement's final step (mode-aware)

## Why

`implement` is the pipeline's heaviest sub-agent-fanout stage and runs one of three execution modes
that don't expose usage the same way — derives from [ADR-0002](../adr/0002-mode-aware-usage-capture.md),
[spec AC-01, AC-04](../spec.md), [sad §5](../sad.md) (`implement/SKILL.md` gains: write pipeline-log.md
section, mode-aware per ADR-0002), [sad §6 Flow 3](../sad.md).

## What

In `skills/implement/SKILL.md`'s final protocol step, add: create `pipeline-log.md` if absent, then
write or replace only the `### implement` section, branching per which of the three modes actually ran
this invocation:

- **sequential** (`tdd-loop.md`) and **team** (`team-exec.md`) — sum every `Agent`-tool dispatch's
  `<usage>` block (`subagent_tokens`/`duration_ms`); a dispatch whose usage didn't return is marked
  unavailable per AC-04, never a false zero;
- **workflow** (`workflow-exec.md`) — read `budget.spent()` for the token figure.

Agent count is always the number of `Agent`-tool dispatches, not distinct agent types (AC-01). Note the
mode used in the section's free prose. Add `pipeline-log.md` to `implement`'s handoff
Review-before-continuing list.

## Definition of Done

- [ ] `implement`'s final protocol step references `skills/_shared/pipeline-log.md` and performs the
      mode-aware write
- [ ] sequential-mode and workflow-mode runs each produce correctly-labeled figures for their own
      capture path
- [ ] team-mode's `TeamCreate` usage availability is verified against the current contract; if
      unavailable, the section marks it per AC-04 rather than a false zero or a crash (sad §11 risk row)
- [ ] a re-run of `implement` (loop-back from `review`) replaces the `### implement` section in place
      with the cumulative total across all runs (AC-03)
- [ ] `implement` never writes a rollup section (AC-05)
- [ ] handoff's Review-before-continuing list includes `pipeline-log.md`

## Notes

Most complex of the seven call sites (ADR-0002 Negative). Runs in parallel with T2–T4, T6–T9; verify
`TeamCreate`'s usage-availability before closing this task — sad §11 flags it as an open risk row.
