---
status: Accepted
owner: "Vitalii Lytvynov"
reviewers: ["Tech Lead"]
updated_at: "2026-07-20"
feature_size: "L"
ticket: "swift-consultants-rollout"
---

# 0005 — Fire a review consultant only when spec-visible AND diff-visible signal agree

- **Status:** Accepted
- **Date:** 2026-07-20
- **Deciders:** Architect + Pipeline operator (Socratic walk)

## Context

Spec §3 (non-goal 2) and §8 (open question) explicitly left `review`'s concrete trigger discriminator unresolved at spec time, naming this feature's own `design` stage as the place to fix it — "the mechanism is this feature's own upcoming `design` stage's job." The risk to avoid is the degenerate case named in spec §8: firing on ordinary `async`/`await` syntax that has nothing to do with a genuine Swift-concurrency decision. `review` (`skills/review/SKILL.md` step 1) already scopes a `git diff <base>..HEAD` and already reads `spec.md` §5 as a baseline input — both signal sources are available without adding a new read.

## Decision drivers

- Spec §8 OQ — "avoid the 'fires on every diff' degenerate case."
- Spec §6 NFR — "review trigger discrimination... numeric ceiling fixed in this feature's own design stage."
- AC-07 (US-03) — when UI, concurrency, and test-strategy signal are genuinely present together, all three consultants must fire.
- AC-09 (US-09) — zero consultant fires, zero token cost, on a genuinely signal-free stage.

## Considered options

1. **AND-gate: fire class X only when the spec-visible signal AND the diff-visible signal both affirm X** — spec-visible reuses the shared `consultant-trigger.md` keyword+model-inference rule applied to `spec.md` prose (identical to `design`'s own mechanism); diff-visible applies the same keyword set to the diff's **added** lines only, scoped to `.swift` files, plus a second model-inference pass reading the diff's actual code.
2. **OR-gate: fire class X when either source affirms X** — more permissive, catches scope creep (UI code added that the original spec never mentioned).
3. **Diff-visible signal only, no spec cross-check** — rejected: discards the spec-visible portion the spec's own default explicitly asked to reuse, and loses the one signal source that can tell "was this feature ever meant to touch this surface" from "does this line merely contain the word async."

## Decision outcome

**Chosen:** Option 1. The AND-gate directly targets the named risk — a single incidental keyword match in the diff, with no spec-level grounding, cannot fire a consultant, and a spec that once mentioned UI/async/testing but whose diff turns out pure-logic (e.g., only backend plumbing landed in this particular diff) also stays quiet. Numeric ceiling: **≤10% false-fire rate** on a manual sample of non-UI/non-async diffs (the verify method spec §6 already names — "manual sample of non-UI/non-async diffs post-wiring"), fixing the previously-open NFR row.

## Consequences

**Positive**
- Directly resolves spec §8's open question and §6's "TBD" NFR row — no further deferral.
- Reuses one shared signal-detection mechanism (`_shared/consultant-trigger.md`, per ADR-0004) rather than inventing a `review`-specific one.
- The `.swift`-file + added-lines-only scoping keeps the diff-visible layer cheap (no full-file re-scan, no context/deleted-line noise).

**Negative**
- **Accepted false-negative:** a feature whose spec never mentioned UI/async/testing but whose diff genuinely adds such code (scope creep) will not trigger the matching consultant — recorded as a risk in §11, not silently ignored.
- Two signal reads instead of one adds a small amount of `review` step-1 work (reading `spec.md` prose alongside the diff) — already an existing input, so the marginal cost is the second keyword/model-inference pass only.

**Neutral**
- The ≤10% ceiling is a monitor-only target like the token-cost NFRs (spec §6) — it does not block `review`; it's the trigger for revisiting this ADR if the manual sample shows worse.

## Links

- Spec: [[../spec.md]] (US-03, US-05, AC-03, AC-07, AC-09, §3 non-goal 2, §8 OQ 1)
- SAD: [[../sad.md]] §4, §6, §10
- Related ADR: [[0004-shared-consultant-trigger-fold]]
