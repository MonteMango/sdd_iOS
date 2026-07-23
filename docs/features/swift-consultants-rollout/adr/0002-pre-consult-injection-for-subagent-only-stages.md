---
status: Accepted
owner: "Vitalii Lytvynov"
reviewers: ["Tech Lead"]
updated_at: "2026-07-20"
feature_size: "L"
ticket: "swift-consultants-rollout"
---

# 0002 — Pre-consult from the main session and paste the brief into the sub-agent's dispatch prompt

- **Status:** Accepted
- **Date:** 2026-07-20
- **Deciders:** Architect + Pipeline operator (Socratic walk)

## Context

`review`'s entire body of work runs inside the read-only `reviewer` sub-agent (`skills/review/SKILL.md` step 2); `implement`'s team and workflow modes dispatch `test-author`/`implementer` sub-agents or `agent()` calls with no main-session step of their own. None of these can spawn a further sub-agent (`agent-roster.md` §3, "the lead owns fan-out"), so none can consult an expert bundle on its own. Spec US-07/AC-05 requires them to still receive expert input.

## Decision drivers

- AC-05 (US-07) — a sub-agent that cannot itself spawn a consultant must still receive the brief.
- Spec §3 non-goal 7 — do not alter the *content* of `reviewer`/`test-author`/`implementer` beyond a brief pasted into their dispatch prompt; they stay bundle-free.
- Merge-surface minimization (§2 Constraints, §11) — every touched file is a future upstream-merge conflict; `agents/reviewer.md` etc. are exactly the high-churn files worth keeping untouched.

## Considered options

1. **Pre-consult + paste into the dispatch prompt** — the main session spawns the consultant, receives the brief, and pastes its text into the sub-agent's own dispatch prompt before dispatch.
2. **Preload `Skill` (or `skills:`) onto the sub-agent itself** — add the tool/preload to `agents/reviewer.md`, `agents/test-author.md`, `agents/implementer.md` so each can self-consult.
3. **Skip consultation on sub-agent-only stages entirely** — rejected outright: directly contradicts AC-05, which exists specifically because these stages cannot self-consult.

## Decision outcome

**Chosen:** Option 1. It keeps `reviewer`/`test-author`/`implementer` untouched (spec §3 non-goal 7), avoids adding merge-conflict surface on three of the highest-churn files in the plugin, and reuses the exact spawn mechanism `design` step 3.5 already proved. The cost is a sequential main-session dependency (consult, then dispatch) rather than one parallel call — accepted, since the consultant call for a `review`/team/workflow signal is already a small, bounded addition to a stage that is not itself latency-critical.

## Consequences

**Positive**
- Zero edits to `agents/reviewer.md` / `agents/test-author.md` / `agents/implementer.md` — smaller fork merge surface, no risk of a stray `Skill` grant surviving an upstream agent-file merge.
- Reuses one proven mechanism (main-session consult → fold/inject) across `design`, `review`, and `implement` team/workflow, rather than two different integration shapes.

**Negative**
- The consultant spawn and the sub-agent dispatch are sequential, not concurrent, on these stages — unlike `design`'s step 3.5, which runs alongside the step-3 explorer. Added latency is one consultant call's worth (~40k-token-class spend), accepted per spec §6's uncapped-cost NFR.

**Neutral**
- If a future upstream SDD release adds `Skill` to these agents for an unrelated reason, this ADR's choice does not conflict — it simply becomes an unused capability on those agents from this feature's point of view.

## Links

- Spec: [[../spec.md]] (US-07, AC-05)
- SAD: [[../sad.md]] §4
- Related ADR: [[0001-hybrid-task-scoped-pre-consult]]
