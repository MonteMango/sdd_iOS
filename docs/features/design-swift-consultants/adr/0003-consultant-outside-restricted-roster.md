---
status: Accepted
owner: "Vitalii Lytvynov"
reviewers: ["Tech Lead"]
updated_at: "2026-07-17"
feature_size: "S"
ticket: "design-swift-consultants"
---

# 0003 — Spawn the consultant from the main session, outside SDD's validated sub-agent roster

- **Status:** Accepted
- **Date:** 2026-07-17
- **Deciders:** Architect + Fork maintainer (Socratic walk)

## Context

SDD ships a roster of restricted sub-agents (`explorer` / `critic` / `reviewer` / `implementer`), validated by `scripts/validate_plugin.py`. The consultant needs a heavy third-party bundle. Placing it in the validated roster would either trip the validation or grow the validated + merge surface the fork must keep green on every upstream release.

## Decision drivers

- Keep `validate_plugin.py` green — the deterministic plugin-validation gate is a domain invariant (spec AC-04).
- Keep the fork's merge surface small (spec US-04).
- SDD's restricted agents stay bundle-free (spec §3 non-goal 3).

## Considered options

1. **Main-session-spawned, project-local consultant** — referenced only in `design`'s prose, never in the validated agent roster.
2. **A new `sdd:*` restricted agent** — validated by the gate, but adds a bundle to the roster and grows the merge + validation surface.

## Decision outcome

**Chosen:** Option 1. The consultant is spawned from the main session and lives project-local; the validated roster is untouched, so the gate stays green and the AC-04 invariant holds — and if the consultant is ever placed in the roster, the gate blocks and names the invariant.

## Consequences

**Positive**
- The validation gate stays green; the merge surface stays small; SDD's restricted agents are untouched.

**Negative**
- The consultant is not covered by roster validation — it is prose-referenced, so its wiring is verified by the smoke check, not the gate.

**Neutral**
- The prose-vs-roster invariant must be re-verified on each upstream merge — tracked as the fork-drift open question (§11).

## Links

- Spec: [[../spec.md]] (US-04, AC-04, §3 non-goals)
- SAD: [[../sad.md]] §4, §5
- Related ADR: [[0002-disposable-bundle-loading-consultant]]
