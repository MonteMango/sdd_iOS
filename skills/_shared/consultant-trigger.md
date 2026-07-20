# Consultant trigger — signal set, mapping, cap

> **TL;DR.** Three curated signal classes (UI, async, test-strategy) detected by keyword match **plus** model inference, over whatever text each calling stage runs detection against (see the per-stage table below). UI ⇒ SwiftUI consultant, async ⇒ Swift-concurrency consultant, test-strategy ⇒ swift-testing-expert, any combination ⇒ that combination. Exactly three consultant classes exist, so the ≤3-per-run cap holds by construction. No signal ⇒ no spawn, no consultant/bundle token cost.

This is the detection *rule* every calling stage's own spawn step reads (`design` step 3.5, and the analogous steps in `implement` / `plan-tests` / `review` / `sequences`). Spawn mechanics (how the consultant is actually invoked) live in each stage's own `SKILL.md`, not here.

## The curated signal set

| Class | Keywords (case-insensitive, whole-word match over the detection text) | Consultant |
|---|---|---|
| UI-class | `views`, `navigation`, `screens`, `SwiftUI`, `UI` | SwiftUI consultant |
| async-class | `async`, `await`, `background`, `concurrency`, `actors`, `tasks` | Swift-concurrency consultant |
| test-strategy-class | `test strategy`, `test design`, `coverage approach`, `Swift Testing`, `XCTest` | swift-testing-expert |

Keyword match is the first detection layer — cheap and deterministic. Two refinements keep it from
over-firing: **(1) whole-word, not substring** — `UI` must appear as its own token, never matched
inside an unrelated word (`build`, `quick`, `require`, `guide`); **(2) negated mentions don't
count** — a keyword appearing only inside a negation of the feature's own surface ("no UI
dependency", "not adding a UI", "no async/concurrency surface") is not an affirmative signal, since
the spec is stating the surface is *absent*. Under negation, the keyword layer stays silent and the
call falls to the second layer.

It is deliberately **not the only** layer: keyword match alone false-negatives on detection text that describes a UI/async/test-strategy surface without using one of the curated words (e.g. "the profile screen refreshes itself" with no literal "view"/"UI"). The second layer is **model inference over the detection text** — the same reasoning pass the calling stage already runs over that text for its own purpose also classifies UI-/async-/test-strategy-class presence, catching signal the keyword pass misses (and correctly reads a negated keyword mention as no-signal, since it reasons over meaning rather than surface text). Either layer affirmatively firing is sufficient to trigger the class.

## Signal → consultant mapping

| Signal detected | Consultant(s) spawned |
|---|---|
| UI-class only | SwiftUI consultant |
| async-class only | Swift-concurrency consultant |
| test-strategy-class only | swift-testing-expert |
| Any combination of the above | Every affirmed class's consultant, one instance each |
| None | None — no-op |

## The ≤3-per-run cap

There are exactly three consultant classes (SwiftUI, Swift-concurrency, swift-testing-expert), and each class maps to at most one consultant instance. The cap therefore holds **structurally** — no counter, no configuration, nothing to enforce at runtime. A future consultant class would need its own mapping row here before it could push the count past 3.

## Per-stage detection text — what each stage runs this rule against

Every stage applies the same signal set + mapping above; only the **text the rule is applied to** changes:

| Stage | Detection text |
|---|---|
| `design` | `spec.md` prose (the whole spec, read at step 2/3.5) |
| `implement` | the task's own title + `acs` + `dod` (never the whole `tasks.json`, never another task's text) |
| `plan-tests` | the acceptance criterion currently being mapped (one AC's own text, not the whole `spec.md §5`) |
| `review` | `spec.md` prose **and** the diff (an AND-gate between the two — see ADR-0005; a diff-visible signal alone or a spec-visible signal alone does not fire) |
| `sequences` | the flow currently being drafted (one flow's own description, not the whole `sad.md §6`) |

## The pure-logic / signal-free no-op case

When none of the three classes is present in the stage's own detection text (a pure-logic feature/task/AC/diff/flow — no UI, no async, no test-strategy surface), the consultant spawn step is a **no-op**: no consultant spawns, no expert-bundle load happens, and no consultant token cost is incurred (`design`'s own instance of this is AC-06 in `design-swift-consultants`; the four other stages' instance is AC-09 in `swift-consultants-rollout`). This is not a fallback or degraded path — it is the expected, silent-by-design outcome for text this trigger rule was never meant to fire on. Contrast with the fallback-marker case (a signal *was* present but the consultant didn't fire or returned nothing usable) — that is a different, visible-by-design outcome documented in [`./consultant-fold.md`](./consultant-fold.md).

## References

- [`./consultant-fold.md`](./consultant-fold.md) — what happens to a fired consultant's brief (altitude filter, rules-win, fallback marker).
- [`../design/SKILL.md`](../design/SKILL.md) — step 3.5 applies this rule against `spec.md` prose.
- [`../implement/SKILL.md`](../implement/SKILL.md) · [`../plan-tests/SKILL.md`](../plan-tests/SKILL.md) · [`../review/SKILL.md`](../review/SKILL.md) · [`../sequences/SKILL.md`](../sequences/SKILL.md) — the four other stages' own spawn steps, each applying this rule against its own detection text per the table above.
