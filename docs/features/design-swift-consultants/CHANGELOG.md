# Changelog — design-swift-consultants

## design-swift-consultants — guaranteed iOS expertise inside `design`

**What:** The `design` stage now automatically consults an iOS domain expert (SwiftUI and/or
Swift-concurrency, disposable sub-agents) whenever a feature's spec signals a UI or async
surface — no manual second step. The expert's advice is filtered to structural-altitude
decisions only, reconciled against the consuming project's own rules (project wins on
conflict), and folded into the SAD's strategy and building-blocks sections. When the expected
consultant can't be consulted, a visible fallback marker appears in both the stage handoff and
the SAD — the gap is never silent, and the stage never blocks.

**Why:** [spec.md](spec.md) §1 — the manual "ask the expert" step was forgettable; a
structural, hard-to-reverse iOS decision could get made blind. This fork makes the invocation a
fixed protocol step rather than a model-chosen one. Key decisions: [ADR-0001](adr/0001-guaranteed-fire-consultant-spawn.md)
(guaranteed-fire spawn), [ADR-0002](adr/0002-disposable-bundle-loading-consultant.md) (disposable
bundle-loading sub-agent, not a static rules dump), [ADR-0003](adr/0003-consultant-outside-restricted-roster.md)
(consultant stays outside SDD's restricted `agents:` roster), [ADR-0004](adr/0004-non-blocking-fallback-marker.md)
(non-blocking fallback marker, dual-placed).

**How to use:** Run `/sdd:design <slug>` as usual on an iOS feature. If the spec mentions
views/navigation/screens/SwiftUI/UI or async/await/background/concurrency/actors/tasks (keyword
match plus model inference — see [`skills/design/references/consultant-trigger.md`](../../../skills/design/references/consultant-trigger.md)),
the matching consultant(s) fire during step 3.5, concurrently with the explorer, and the fold
happens at step 6/7. A pure-logic feature (no signal) is a silent no-op — no spawn, no token
cost.

**Operational notes:**
- Migration: `<!-- none -->`.
- Feature flag / config: `<!-- none -->` — the wiring is always-on for any repo running this
  fork; there's no toggle.
- Rollback: revert the feature's commits (`0160ab4..bf207d1`) — no schema/migration to unwind,
  markdown-protocol-only change.

**Acceptance criteria delivered:** AC-01 (happy path — matching consultant(s) fire, structural
decisions land in the SAD, handoff names them), AC-02 (fallback marker in both handoff and SAD,
never blocks), AC-03 (altitude filter denies code-level items entry), AC-04 (plugin-validation
gate stays green; the consultant never enters the restricted `agents:` roster — verified with a
real negative check), AC-06 (pure-logic features get zero consultant fire and zero token cost).
AC-05 (project-rules-win) is verified by design and fold-time reconciliation logic but has no
fixture exercising an actual rule conflict yet — deferred, see [spec.md](spec.md) §8.
