---
status: Accepted
owner: "Vitalii Lytvynov"
reviewers: ["Tech Lead"]
updated_at: "2026-07-20"
feature_size: "L"
ticket: "swift-consultants-rollout"
---

# 0001 — Precompute task-scoped consultant briefs for team/workflow modes, consult inline for single-agent

- **Status:** Accepted
- **Date:** 2026-07-20
- **Deciders:** Architect + Pipeline operator (Socratic walk)

## Context

`implement` dispatches work through one of three modes (sequential single-agent, agent team via `TeamCreate`, dynamic `Workflow`). Spec AC-02 requires each dispatched worker — in any mode — to receive a consultant brief scoped to its own task, never one brief generically shared across every worker. Direct verification of the shipped code (`skills/implement/references/workflow-exec.md`, `team-exec.md`, `../_shared/agent-roster.md` §3) confirms a hard technical constraint: a `Workflow` script's sandbox exposes only `agent()`/`parallel()`/`pipeline()` — no `Skill` tool — and SDD's `test-author`/`implementer` sub-agents cannot spawn a sub-agent of their own (the lead owns fan-out). Neither can consult a bundle at its own dispatch time; the brief must already exist before the worker is dispatched.

## Decision drivers

- AC-02 (US-02) — task-scoped, never a shared brief.
- The technical constraint above (team/workflow workers cannot self-consult) — not a preference, a fact about the runtime.
- AC-06 (US-08) — single-agent's own inline work is an explicitly named injection point, distinct from team/workflow's RED-step dispatch.
- Minimizing wasted consultant spend on tasks that end up dropped/blocked before they run.

## Considered options

1. **Hybrid: precompute per-task briefs at step 6 for team/workflow, consult inline for single-agent** — team/workflow bake each signalled task's brief into what step 6 generates (the TaskList body, or the generated `Workflow` script's per-task prompt); single-agent mode consults live, right before that task's own RED, mirroring how `design` already consults inline at its own drafting point.
2. **Uniform batch precompute for all three modes** — even single-agent gets its per-task briefs computed upfront in step 6, before any task runs.
3. **Lazy per-task consult inside every worker's own dispatch** — rejected outright, not a live alternative: it is impossible for team/workflow given the constraint above (test-author/implementer lack `Skill`; a `Workflow` script cannot call it either).

## Decision outcome

**Chosen:** Option 1. Team and workflow modes precompute at step 6 because they must; single-agent mode consults inline because it can, and precomputing there would spend consultant calls on tasks that might never execute in this run (dropped, blocked, or the run interrupted before reaching them) and diverges from the established `design`-stage idiom of consulting at the natural point of use.

## Consequences

**Positive**
- No consultant call is ever wasted on a task that gets dropped/blocked before it runs, in single-agent mode.
- Matches `design`'s own precedent of inline consultation wherever the main session does the work itself.
- Team/workflow briefs are guaranteed present before dispatch — no race, no missing-brief edge case at worker start.

**Negative**
- Two distinct code paths inside one skill (a precompute pass in step 6's team/workflow branches, an inline consult in step 8's single-agent TDD loop) instead of one uniform mechanism — more surface to keep in sync across upstream merges.

**Neutral**
- Team/workflow still spend the consultant call for every signalled task up front, even ones that later get dropped — accepted, since those two modes have no cheaper option (Option 3 is infeasible for them).

## Links

- Spec: [[../spec.md]] (US-02, AC-02, AC-06)
- SAD: [[../sad.md]] §4
- Related ADR: [[0002-pre-consult-injection-for-subagent-only-stages]]
