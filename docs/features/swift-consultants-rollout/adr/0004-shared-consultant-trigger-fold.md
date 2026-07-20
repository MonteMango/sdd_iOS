---
status: Accepted
owner: "Vitalii Lytvynov"
reviewers: ["Tech Lead"]
updated_at: "2026-07-20"
feature_size: "L"
ticket: "swift-consultants-rollout"
---

# 0004 — Move consultant-trigger and consultant-fold to `skills/_shared/`, extend to a third signal class

- **Status:** Accepted
- **Date:** 2026-07-20
- **Deciders:** Architect + Pipeline operator (Socratic walk)

## Context

`skills/design/references/consultant-trigger.md` and `consultant-fold.md` currently encode the signal set, the signal→consultant mapping, and the altitude-filter/fallback-marker rules for exactly two consultant classes, detected from `spec.md` prose. This feature adds a third class (`swift-testing-expert`, triggered by a test-strategy signal) and four stages whose trigger input is *not* `spec.md` prose: `implement` reads a task's own text, `plan-tests` reads the acceptance criterion being mapped, `review` reads the diff, `sequences` reads the flow being drafted.

## Decision drivers

- The existing file already anticipates growth: "a future consultant class would need its own mapping row here before it could push the count past 2" (`consultant-trigger.md`).
- Five stages will read the same signal-class taxonomy and altitude-filter/fallback-marker rules — a single source avoids five independently-drifting copies.
- Plugin convention (architecture-map §Conventions): cross-cutting rules live in `skills/_shared/`, not duplicated per stage.

## Considered options

1. **Move both files to `skills/_shared/`, extend the signal table to three classes, add a per-stage "what text this stage runs detection against" table** — `design`, `implement`, `plan-tests`, `review`, `sequences` all reference the same two files.
2. **Leave the files in `skills/design/references/`; the four new stages reference them via a relative path (`../design/references/consultant-trigger.md`)** — fewer file moves, but four stages depending on another stage's own `references/` folder is semantically backwards and breaks skill isolation (the plugin's own convention keeps cross-stage rules in `_shared/`, never in one stage's private folder).
3. **Duplicate the trigger/fold rules per stage** — rejected: exactly the drift risk ADR-0003 already ruled out for the agent prompt files; the same logic applies to the trigger/fold rules.

## Decision outcome

**Chosen:** Option 1. It matches the plugin's own existing convention (cross-cutting rules in `_shared/`) and keeps a single, extensible signal taxonomy — a fourth consultant class in the future needs one new mapping row here, not five files touched.

## Consequences

**Positive**
- One place to add the third class's keyword set (`test strategy`, `test design`, `coverage approach`, `Swift Testing`, `XCTest`) and its mapping row.
- One place to add the per-stage "what text to run detection against" table, making each stage's SKILL.md delta a one-line pointer instead of restating the rule.
- `design`'s own behavior is unchanged (still detects from `spec.md` prose) — only the file's location and the table's shape change.

**Negative**
- `skills/design/SKILL.md`'s references section needs its two links repointed from `./references/consultant-trigger.md` to `../_shared/consultant-trigger.md` — a small, mechanical edit, but on the same recently-shipped file ADR-0003 already touches.

**Neutral**
- The ≤2-per-run cap language becomes a ≤3-per-run cap, still structural (three classes, one consultant instance per class) — no counter, no runtime configuration, same reasoning as before.

## Links

- Spec: [[../spec.md]] (US-01, AC-01, AC-09)
- SAD: [[../sad.md]] §4, §5
- Related ADR: [[0003-dedicated-consultant-agent-files]]
