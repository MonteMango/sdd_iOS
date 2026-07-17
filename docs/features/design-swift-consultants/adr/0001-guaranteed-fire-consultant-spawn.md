---
status: Accepted
owner: "Vitalii Lytvynov"
reviewers: ["Tech Lead"]
updated_at: "2026-07-17"
feature_size: "S"
ticket: "design-swift-consultants"
---

# 0001 — Make the consultant spawn a guaranteed protocol step, keep its reasoning situational

- **Status:** Accepted
- **Date:** 2026-07-17
- **Deciders:** Architect + Pipeline operator (Socratic walk)

## Context

The SDD `design` stage is stack-agnostic — iOS structural expertise never reaches the SAD unless the operator remembers a manual second "ask the expert" step. A standing model-chosen hint is forgettable on any given run. To make the injection guaranteed rather than model-chosen, the consultant spawn is made a fixed step of the `design` protocol (runs alongside the step-3 explorer), while the consultant's own reasoning stays model-driven.

## Decision drivers

- Deterministic-spawn NFR — the consultant must fire on 100 % of runs where the spec trigger signal is present (spec §6).
- Manual-second-step elimination — target 0 manual expert-consult steps per iOS design (spec §7 KPI).
- The honest determinism boundary — the spawn is deterministic, the reasoning is not (spec §3 non-goal 1).

## Considered options

1. **Guaranteed protocol step** — the spawn is a fixed, non-skippable step; the consultant's internal reasoning stays situational.
2. **Model-chosen hint** — a standing instruction the model may follow or skip (the forgettable status quo).
3. **Fully deterministic rules injection** — a static decision table with no model reasoning (loses situational adaptation — see ADR-0002).

## Decision outcome

**Chosen:** Option 1. The spawn fires deterministically on the trigger signal; the reasoning stays model-driven so it adapts to the specific feature. This split — determinism at the trigger, not at the reasoning — is the honest determinism boundary and the feature's core differentiator (a guaranteed-fire trigger combined with a disposable situational consultant).

## Consequences

**Positive**
- iOS expertise reaches the SAD automatically on every UI/async feature — no forgettable manual step.
- The reasoning adapts to the feature rather than emitting a generic dump.

**Negative**
- Requires a hard fork of SDD (upstream auto-update lost) — an accepted cost (spec §1).

**Neutral**
- The trigger detector's accuracy becomes the new variable (false-negatives on UI specs without the "magic words") — tracked as an open question (§11).

## Links

- Spec: [[../spec.md]] (US-01, AC-01)
- SAD: [[../sad.md]] §4
- Related ADR: [[0002-disposable-bundle-loading-consultant]]
