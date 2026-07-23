---
id: T10
title: "sequences: fresh concurrency-consultant spawn"
layer: "app"
deps: ["T1", "T2"]
acs: ["AC-08", "AC-09", "AC-10"]
files_hint: ["skills/sequences/SKILL.md"]
owner: "Fork maintainer"
estimate: "M"
status: "todo"
---

# T10 — sequences: fresh concurrency-consultant spawn

## Why

Spec US-04/AC-08 requires a fresh concurrency-consultant spawn — independent of `design`'s earlier structural brief — when `sequences` draws a flow with async behavior, so suspend points/actor hops/TaskGroup shape are informed at flow-specific detail. Sad §4 seed 6: exactly one new consultant class here (`swift-concurrency`), never all three. Derives from [spec US-04/AC-08, US-09/AC-09, US-10/AC-10](../spec.md), [sad §4/§5/§6](../sad.md).

## What

Between `skills/sequences/SKILL.md` step 4 (Sync vs async classification) and step 5 (Draft each flow): on a flow carrying async behavior (a suspend point, an actor hop, or a fan-out shape — the same classification step 4 already performs), spawn a **fresh** `swift-concurrency` consultant scoped to that one flow's own text, per `../_shared/consultant-trigger.md`'s "the flow being drafted" detection row — never reusing `design`'s earlier brief for the same feature (spec §3 non-goal 4, accepted duplicate spend). Fold the brief at flow-level-detail altitude via `../_shared/consultant-fold.md`; a code-level item is denied entry, left for `implement`/`review` to carry (AC-10). Fold the admitted detail into step 5's draft of that flow. A sync flow with no async signal → no consult, no bundle load, no cost (AC-09). Fallback marker (spec §8 OQ default, sad §11): write it exactly as `design` already does — an HTML comment in `sad.md` §6 next to the relevant flow, reusing `consultant-fold.md`'s wording, mirrored in the handoff.

## Definition of Done

- [ ] A fixture flow with a suspend point/actor hop/fan-out shows a fresh concurrency-consultant spawn (a new call, not a reused brief) and its flow-specific detail reflected in the drawn flow's step-5 draft (AC-08).
- [ ] A fixture consultant brief item at code altitude (e.g. a concrete retry-loop implementation) is denied entry into the drawn flow (AC-10).
- [ ] A fixture sync flow (no async signal) shows zero consultant calls (AC-09).
- [ ] A bundle-unavailable fixture on an async flow shows the HTML-comment fallback marker in `sad.md` §6 next to that flow, and the stage does not block.

## Notes

Independent file/section from [T7](./t7-plan-tests-wiring.md)/[T9](./t9-review-preconsult-inject.md) — parallelizable once T1/T2 land.
