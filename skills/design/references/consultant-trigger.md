# Consultant trigger — signal set, mapping, cap

> **TL;DR.** Two curated signal classes (UI, async) detected in `spec.md` prose by keyword match **plus** model inference. UI ⇒ SwiftUI consultant, async ⇒ Swift-concurrency consultant, both ⇒ both. Exactly two consultant classes exist, so the ≤2-per-run cap holds by construction. No signal ⇒ no spawn, zero cost.

This is the detection *rule* step 3.5 reads. Spawn mechanics (how the consultant is actually invoked) live in `SKILL.md` step 3.5 itself, not here.

## The curated signal set

| Class | Keywords (case-insensitive substring match over spec prose) |
|---|---|
| UI-class | `views`, `navigation`, `screens`, `SwiftUI`, `UI` |
| async-class | `async`, `await`, `background`, `concurrency`, `actors`, `tasks` |

Keyword match is the first detection layer — cheap and deterministic. It is deliberately **not the only** layer: keyword match alone false-negatives on a spec that describes a UI/async surface without using one of the curated words (e.g. "the profile screen refreshes itself" with no literal "view"/"UI"). The second layer is **model inference over the spec prose** — the same reasoning pass that reads `spec.md` for the rest of `design`'s step 2 also classifies UI-/async-class presence, catching signal the keyword pass misses. Either layer firing is sufficient to trigger the class.

## Signal → consultant mapping

| Signal detected | Consultant(s) spawned |
|---|---|
| UI-class only | SwiftUI consultant |
| async-class only | Swift-concurrency consultant |
| UI-class AND async-class | Both (SwiftUI + Swift-concurrency) |
| Neither | None — no-op |

## The ≤2-per-run cap

There are exactly two consultant classes (SwiftUI, Swift-concurrency), and each class maps to at most one consultant instance. The cap therefore holds **structurally** — no counter, no configuration, nothing to enforce at runtime. A future consultant class would need its own mapping row here before it could push the count past 2.

## AC-06 — the pure-logic no-op case

When neither the UI-class nor the async-class signal is present in the spec prose (a pure-logic feature — no views, no navigation, no async/concurrency surface), step 3.5 is a **no-op**: no consultant spawns, no expert-bundle load happens, and no consultant token cost is incurred. This is not a fallback or degraded path — it is the expected, silent-by-design outcome for a feature this trigger rule was never meant to fire on. Contrast with the fallback-marker case (a signal *was* present but the consultant didn't fire or returned nothing usable) — that is a different, visible-by-design outcome documented in the sibling consultant-fold reference.

## References

- `./consultant-fold.md` — what happens to a fired consultant's brief (altitude filter, rules-win, fallback marker).
- [`../SKILL.md`](../SKILL.md) — step 3.5 applies this rule against `spec.md`.
