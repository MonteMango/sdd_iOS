---
status: Accepted
owner: "Vitalii Lytvynov"
reviewers: ["Tech Lead"]
updated_at: "2026-07-17"
feature_size: "S"
ticket: "design-swift-consultants"
---

# 0002 — Load the expert bundle in a disposable sub-agent rather than fork a static rules file

- **Status:** Accepted
- **Date:** 2026-07-17
- **Deciders:** Architect + Pipeline operator (Socratic walk)

## Context

The iOS expertise could be injected two ways: bake a curated static rules dump into `design`'s SKILL.md, or spawn a disposable sub-agent that loads the live third-party expert bundle and reasons over the specific feature. The choice sets the maintenance model and how current the advice stays.

## Decision drivers

- The expert bundles stay auto-updating and un-forked — a small merge surface, no per-release rules maintenance (spec §3, §6.1).
- Situational reasoning over the actual feature, not a generic dump.
- Bounded cost + clean isolation — ≤ ~40k tokens per consultant, clean context so nothing bleeds back except the brief.

## Considered options

1. **Disposable sub-agent loading the live bundle** — reasons over the feature, returns a ≤1-page brief, then is discarded.
2. **Forked static rules file** — a curated iOS-rules document committed into the fork and hand-maintained.

## Decision outcome

**Chosen:** Option 1. The bundle stays un-forked and auto-updating; the consultant reasons situationally over the feature; clean isolation caps context bleed to the brief. The static file was rejected because it rots, must be re-curated on every bundle release, and cannot adapt to the feature at hand.

## Consequences

**Positive**
- Expertise stays current with no fork-side rules maintenance.
- Advice is tailored to the feature.

**Negative**
- A per-run token cost (≤ ~40k per consultant, bounded by the ≤2-per-run cap).
- Bundle-trust becomes a supply-chain surface — accepted (spec §6.1), mitigated by project-rules-win + observable-trace review.

**Neutral**
- The reasoning is non-deterministic — bounded by the Altitude filter (only structural items enter the SAD) and project-rules-win at fold.

## Links

- Spec: [[../spec.md]] (US-01, §3 non-goals, §6.1)
- SAD: [[../sad.md]] §4
- Related ADR: [[0001-guaranteed-fire-consultant-spawn]], [[0003-consultant-outside-restricted-roster]]
