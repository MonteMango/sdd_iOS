---
status: Draft
owner: "Vitalii Lytvynov"
reviewers: ["Tech Lead", "Security Lead"]
updated_at: "2026-07-20"
feature_size: "S"
---

# Spec — design-swift-consultants

> **Glossary:** [CONTEXT](./CONTEXT.md)
> **Reference module / docs / channels used:** `SDD-FORK-PLAN.md`, `integrating-swift-avdlee-skills-in-sdd-stages.md`, `docs/architecture-map.md`, plugin source `skills/design/SKILL.md` + `scripts/validate_plugin.py`.

## 1. Context

The SDD pipeline is stack-agnostic: the `design` stage produces generic architecture with no iOS awareness. For iOS features — a **Pipeline operator** on a repo like Elfy — that means SwiftUI/concurrency specifics (navigation model, isolation boundary, Sendable strategy) never reach the architecture document's strategy and building-blocks sections. The operator either remembers to run a manual second "ask the expert" step, or a structural, hard-to-reverse decision gets made blind.

Why now: the manual step is forgettable — a standing hint the model may skip on any given run. To make the expertise injection **guaranteed rather than model-chosen**, a fork of SDD was chosen (losing auto-update is an accepted cost). The mechanism was proven by a smoke test on 2026-07-17: a spawned disposable sub-agent invoked an iOS expert bundle and returned a project-compliant brief at ~38k tokens.

The committed approach: make the consultant **invocation itself a fixed protocol step** of the `design` stage (guaranteed, not model-chosen), while running the consultant as a **disposable, situationally-reasoning** sub-agent (not a static rules dump), with its brief **altitude-filtered to the structural level**. This combination is the differentiator: the market has deterministic triggers (path-glob rule files, fixed spec pipelines) and disposable expert sub-processes (model-delegated sub-agents) **separately**, but no product combines a guaranteed-fire trigger with a disposable situational consultant filtered to architecture altitude.

Traceability: the two planning docs above + the architecture map informed §1–§3; the ideation pass — a competitive `researcher` (surfaced the combination gap) and a `devils-advocate` (surfaced the silent-fallback-rot risk that shaped §2 goal 3, §6, and §8). _(This paragraph also hosts any `Override: <headline> — rationale: <reason>` bullets from critic resolutions.)_

## 2. Goals

- iOS domain expertise reaches the architecture document **automatically, as a fixed protocol step**, on every feature whose spec signals a UI/async surface — with no manual second step.
- The injected expertise is **altitude-filtered to structural decisions**; code-level guidance never enters the architecture document.
- When the expertise cannot be consulted, the gap is **visible** (a marker), never silent — and the stage still **never blocks**.

## 3. Non-goals

- Not making the consultant's **internal reasoning** deterministic — only the spawn is a guaranteed protocol step (the honest determinism boundary).
- Not wiring the **other stages** (plan-tests / implement / review / sequences / …) — this feature is `design`-only; the rest are roadmap Next.
- Not altering SDD's own **restricted sub-agents** (explorer / critic / reviewer / implementer) — they stay bundle-free; the consultant is main-session-spawned and project-local.
- Not adding a **hard gate** that blocks `design` when a consultant fails at runtime — graceful fallback + a visible marker, not a blocker.
- Not **forking or editing the expert bundles** themselves — they stay separate, auto-updating.

## 4. User stories

### US-01: One-command iOS-aware design
**As a** Pipeline operator
**I want** `design` to pull in iOS expertise automatically
**So that** I get iOS-aware architecture without a manual second step

### US-02: See when expertise didn't land
**As a** Pipeline operator
**I want** a visible marker when a consultant was expected but didn't fire
**So that** I don't ship silently-generic architecture

### US-03: No noise on pure-logic features
**As a** Pipeline operator
**I want** pure-logic features to get no iOS advice and no extra cost
**So that** irrelevant expertise doesn't inflate the architecture document or the token bill

### US-04: SDD's own agents untouched
**As a** Fork maintainer
**I want** the wiring to leave SDD's restricted agents unchanged
**So that** the merge surface stays small and the validation gate stays green

### US-05: Architecture-altitude advice only
**As a** Fork maintainer
**I want** the architecture document to carry structural iOS decisions, not code-level lint rules
**So that** the architecture document stays an architecture document

### US-06: Project rules win
**As a** Pipeline operator
**I want** consultant advice adapted to my project's rules
**So that** the architecture document never recommends a pattern my project forbids

## 5. Acceptance criteria

### AC-01 (US-01) — happy path
**Given** a Pipeline operator runs `design` on a feature whose spec signals a UI/async surface (detected per the Trigger-signal definition in the glossary — keyword match over the curated signal set plus model inference over the spec prose)
**When** the stage runs
**Then** it fires the matching consultant(s) per the signal→consultant mapping (UI-class ⇒ SwiftUI consultant, async-class ⇒ Swift-concurrency consultant, both ⇒ both, ≤2 total), the resulting architecture document's strategy and building-blocks sections carry iOS-specific structural decisions, and the handoff names which consultant(s) fired

### AC-02 (US-02) — error
**Given** the expected consultant cannot be consulted (the expert bundle fails to load / the skill is unavailable / web is absent) OR fires but returns an empty/degenerate brief (no structural decision)
**When** the stage runs
**Then** it proceeds without blocking AND emits a visible fallback marker — in BOTH the stage handoff AND the SAD — naming the expected-but-missing (or empty-returning) consultant

### AC-03 (US-05) — authorization (altitude-permission analog)
**Given** a consultant brief contains only code-level items and no structural decision
**When** the main session folds the brief into the architecture document
**Then** those code-level items are denied entry to the strategy and building-blocks sections and routed to implement/review, and the architecture document records no code-level rule

<!-- coverage note: this feature has no literal security-authorization surface (see §6.1). The altitude
filter is the deliberate authorization-analog here — advice lacking structural-altitude "permission"
is denied entry to the architecture document. This AC fills the 5-type coverage floor's authorization slot. -->

### AC-04 (US-04) — domain invariant
**Given** a Fork maintainer adds the consultant wiring
**When** the deterministic plugin-validation gate runs
**Then** it passes because the consultant is referenced only in prose and never in the validated agent roster; if the invariant is violated (the consultant is placed in the roster), the gate blocks and names the invariant

### AC-05 (US-06) — cross-context
**Given** the generic bundle advice conflicts with the consuming project's rules
**When** the main session folds the brief into the architecture document and reconciles each decision against the project rules at fold time
**Then** the folded decision reflects the project rule (project wins), not the generic advice — the fold-time reconciliation is the enforcement point, so a consultant that ignored the passed-in rules is still caught

### AC-06 (US-03) — domain invariant
**Given** a pure-logic feature spec (no UI/async signal)
**When** the stage runs
**Then** no consultant fires, the architecture document carries no iOS structural trace, and no consultant token cost is incurred

## 6. Non-functional requirements

| Aspect | Target | Measurement |
|---|---|---|
| Added token cost per design run | ≤ ~80k tokens (≤2 consultants × ~40k) | token-usage log per `design` run |
| Added wall-clock latency (best-effort) | consultant(s) spawn concurrently with the step-3 explorer and complete before the fold step; added latency ≈ 0 when the consultant finishes within the explorer window, else the fold waits on the consultant | stage timing before/after wiring |
| Deterministic spawn | consultant fires on 100% of runs where the spec trigger signal is present | eval / manual over fixture specs |
| Fallback marker visibility | 100% of expected-but-didn't-fire cases surface a visible marker | bundle-unavailable fixture run |

## 6.1 Security / privacy

- **Data classification:** internal — developer tooling, no end-user data.
- **Personal data touched:** none.
- **AuthZ/AuthN impact:** none. The «altitude filter» is a **content-altitude gate, not a security boundary** (AC-03 is the authorization-analog for the 5-type floor, not a real access-control check). The consultant runs locally in clean, isolated context and sees only the feature spec + the project rules passed in its prompt.
- **Abuse cases:**
  - Wrong/outdated bundle version injects confident-but-bad advice → mitigated by project-rules-win (AC-05) + observable-trace review; mitigation is limited (see §8 trigger/eval OQs).
  - Prompt-passed project rules ignored by the consultant → detected by AC-05 (cross-context).
  - Silent bundle no-resolve → surfaced by the fallback marker (AC-02), never silently swallowed.
- **Security review:** N/A — internal dev tooling, no new PII and no new authorization boundary. Bundle-trust is an accepted supply-chain surface (the expert bundles stay auto-updating and are not forked).

## 7. Metrics / KPIs

- **Observable-trace rate** — baseline: 0 (design consults no iOS expertise today), target: 100% of UI/async feature designs carry iOS structural trace, within the first 3 features designed post-wiring.
- **False-fire rate on pure-logic features** — baseline: 0 (nothing fires today), target: 0 spurious consultant fires across pure-logic features.
- **Manual second-step elimination** — baseline: 1 manual expert-consult step per iOS design (today, when remembered), target: 0.
- **Silent-rot detection** — baseline: 0 markers, target: 100% of expected-but-missing consultations produce a visible marker.

## 8. Open questions

- [ ] Add a regression-anchor eval (`design-ios-consultant`) asserting observable trace? Default now: optional (the smoke test proves the mechanism). — owner: Fork maintainer, due: before Tier-2 rollout
- [ ] Trigger accuracy — how to cut false-negatives on UI specs that don't use the «magic words»? Default now: keyword + model inference over spec prose. — owner: Fork maintainer, due: after first 3 features
- [ ] Cost cap — cap consultants-per-run / dedupe bundle loads as tiers roll out? Default now: ≤2 per design run, no dedupe. — owner: Fork maintainer, due: before Tier-2
- [ ] Fork-drift discipline — how to re-verify the step-3.5 wiring survives each upstream merge? Default now: manual `validate_plugin.py` + smoke check per merge. — owner: Fork maintainer, due: each upstream release
- [ ] AC-05 (project-rules-win) coverage gap — the T8 fixture verification only ran with no `CLAUDE.md`/SwiftUI-rules file present in the scratch workdir, so only the no-rules-file branch of `consultant-fold.md`'s reconciliation ("no project rules file present — generic advice stands") was exercised; the actual conflict-resolution branch ("project rule wins over generic advice") was never run against a real project rule. Default now: accepted as verified by design only (the fold-time reconciliation logic itself), not by a fixture run — found during `/sdd:review`. — owner: Fork maintainer, due: before Tier-2 rollout
