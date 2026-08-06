---
status: Accepted
owner: "Vitalii Lytvynov"
reviewers: []
updated_at: "2026-07-23"
feature_size: "S"
ticket: "N/A"
---

# 0002 — Capture implement's sub-agent usage mode-aware, per its three execution modes

- **Status:** Accepted
- **Date:** 2026-07-23
- **Deciders:** Vitalii Lytvynov (Architect), during the `design` Socratic walk

## Context

`implement` is the pipeline's heaviest sub-agent-fanout stage (spec §1 ¶2) and runs one of three
execution modes (`skills/implement/references/{tdd-loop,team-exec,workflow-exec}.md`): sequential
single-agent TDD, an agent team via `TeamCreate`, or a dynamic `Workflow`. Only an `Agent`-tool
dispatch is verified to hand its caller a `<usage>` block (`subagent_tokens`/`tool_uses`/
`duration_ms` — idea source §2.1, confirmed in-session). A `Workflow` script exposes its own
`budget.spent()` instead (idea source §2.2); `TeamCreate`'s team-mode dispatch path has no verified
equivalent. If `implement`'s pipeline-log write step assumes one capture mechanism for all three
modes, the two modes that don't match it either crash the write step or, worse, silently under-report.

## Decision drivers

- AC-01 requires the agent count to be "the number of `Agent`-tool dispatches ... not the number of
  distinct agent types" — a mode-blind count would misclassify team/workflow fan-out.
- AC-04 requires an unavailable dispatch's tokens to be marked plainly, never a false zero — this only
  works if the write step *knows* which mode ran and therefore which figures it can trust.
- Spec §1 ¶2 names `implement`'s team/workflow fan-out explicitly as one of the reasons this feature is
  worth building now — under-serving exactly that path defeats the feature's own stated motivation.

## Considered options

1. **Mode-aware capture** — the shared template (ADR-0001) branches on which of the three modes
   `implement` actually ran: sequential/team → sum `Agent`-tool dispatch `<usage>` blocks; workflow →
   read `budget.spent()`. Where a mode's usage genuinely can't be captured (see Decision outcome),
   tokens are marked unavailable per AC-04 rather than omitted or zeroed.
2. **Sequential-only capture** — only sequential mode reports tokens/duration; team and workflow modes
   report agent count (from `tasks.json`'s dependency DAG) with tokens/duration always marked
   unavailable, regardless of what's actually retrievable.

## Decision outcome

**Chosen:** Option 1 (mode-aware capture). Team mode's own `<usage>` availability is an open
implementation question `tasks` will need to verify against the current `TeamCreate` contract, but
defaulting to "capture what the mode actually exposes, mark the rest unavailable" instead of
uniformly downgrading every non-sequential run keeps the log accurate on the two most sub-agent-heavy
paths (workflow's `budget.spent()` is definitely available) instead of trading that accuracy away for
implementation simplicity.

## Consequences

**Positive**
- Workflow-mode runs — the ones spec §1 explicitly calls out — get real token figures via
  `budget.spent()`, not a blanket "unavailable".
- AC-04's honesty requirement is satisfied precisely, not over-applied: a mode only gets marked
  unavailable when its usage genuinely isn't retrievable, not by default.

**Negative**
- `implement`'s pipeline-log write step is the most complex of the seven call sites — it needs a
  small mode-dispatch (three branches) instead of one uniform call, pushed into the shared template
  from ADR-0001 to keep that complexity in one place.
- If `TeamCreate`'s usage availability turns out to be partial or inconsistent, `tasks`/`implement`
  will need to decide a fallback for that branch specifically — flagged as a risk in §11, not resolved
  here.

**Neutral**
- If a future `implement` mode is added, the same branch-and-mark-unavailable pattern extends to it
  without a new ADR.

## Links

- Spec: [[../spec.md]] — §1 ¶2, AC-01, AC-04
- SAD: [[../sad.md]] §5, §8, §11
- Related ADR: [[0001-shared-pipeline-log-template]] (this decision is one branch inside that shared
  template)
