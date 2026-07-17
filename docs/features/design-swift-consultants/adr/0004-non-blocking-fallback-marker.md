---
status: Accepted
owner: "Vitalii Lytvynov"
reviewers: ["Tech Lead"]
updated_at: "2026-07-17"
feature_size: "S"
ticket: "design-swift-consultants"
---

# 0004 — On a consultant failure, proceed and emit a dual visible marker instead of blocking

- **Status:** Accepted
- **Date:** 2026-07-17
- **Deciders:** Architect + Pipeline operator (Socratic walk)

## Context

A consultant can fail to load its bundle, be unavailable (skill/web absent), or return an empty/degenerate brief with no structural decision. The stage must neither silently ship generic architecture (invisible rot — the exact risk the ideation devil's-advocate surfaced) nor block the operator on a best-effort enrichment.

## Decision drivers

- Silent-rot detection — 100 % of expected-but-missing consultations must produce a visible marker (spec §7 KPI, AC-02).
- The stage must never block on a consultant failure (spec §2 goal 3, §3 non-goal 4).
- The marker must survive past the run — durable in the SAD, not only in the transient handoff.

## Considered options

1. **Non-blocking + dual marker** — proceed without the brief and emit a visible marker in BOTH the stage handoff AND the SAD, naming the expected-but-missing (or empty-returning) consultant.
2. **Hard gate** — block `design` until the consultant succeeds.
3. **Silent fallback** — proceed with no marker (the status-quo failure mode).

## Decision outcome

**Chosen:** Option 1. The stage proceeds; the dual marker makes the gap visible both to the operator (handoff) and in the durable artifact (SAD). The hard gate was rejected because a bundle outage would then block *all* iOS design; silent fallback was rejected because invisible rot is precisely the failure the ideation pass flagged.

## Consequences

**Positive**
- The stage never blocks on a best-effort enrichment.
- Every missed/degenerate consultation is visible in two places.

**Negative**
- An operator who ignores the marker can still ship generic architecture — mitigated by the dual placement (handoff + durable SAD).

**Neutral**
- Marker rendering lives in two places (handoff + SAD) that must stay in sync.

## Links

- Spec: [[../spec.md]] (US-02, AC-02, §7)
- SAD: [[../sad.md]] §4, §8
- Related ADR: [[0001-guaranteed-fire-consultant-spawn]]
