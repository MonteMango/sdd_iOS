---
status: Draft
owner: "Vitalii Lytvynov"
reviewers: ["Tech Lead", "Security Lead"]
updated_at: "2026-07-20"
feature_size: "L"
---

# Spec — swift-consultants-rollout

> **Glossary:** [root CONTEXT](../../../CONTEXT.md) (no feature-scoped terms — every term this feature needs is already cross-feature and lives at root, promoted from `design-swift-consultants` during this spec's drafting)
> **Reference module / docs / channels used:** `SDD-FORK-PLAN.md`, `integrating-swift-avdlee-skills-in-sdd-stages.md`, `docs/features/design-swift-consultants/{spec.md,sad.md,adr/}` (the proven precedent), plugin source `skills/{plan-tests,implement,review,sequences}/SKILL.md`.

## 1. Context

`design-swift-consultants` proved and shipped the **expert-consultant** pattern on exactly one stage (`design`): a disposable sub-agent loads a large third-party Swift-domain skill bundle, reasons over the feature, and returns a brief altitude-filtered into the architecture document — guaranteed by a fixed protocol step, never a model-chosen "remember to ask" habit. Everywhere else in the pipeline, iOS/Swift expertise still only reaches the codebase if the **Pipeline operator** manually asks for it. `plan-tests` builds a test matrix with no Swift Testing awareness; `implement` writes actual Swift code with no consultant at all; `review` checks quality with no domain-specific bar for SwiftUI/concurrency/testing idioms; `sequences` draws async runtime flows with no concurrency-specific detail. The four stages where this expertise matters most for shipped code are exactly the ones still uncovered.

Why now: `design-swift-consultants`'s own non-goals explicitly deferred these four stages as "roadmap Next" once the pattern proved out on `design`. It has — the pattern is merged, and the ROI-ranked rollout order was already fixed in `SDD-FORK-PLAN.md` §5.0 (`implement` MAX → `plan-tests`/`review` HIGH → `sequences` Tier-2). Deferring further means code, tests, and review keep shipping without the same guaranteed expertise the architecture document already gets.

The committed approach: replicate the same three-part shape — guaranteed-fire trigger, disposable situational consultant, altitude-filtered fold — into `implement` (all three of its execution modes), `plan-tests` (introducing a third consultant class, `swift-testing-expert`, for the first time in this pipeline), `review` (all three consultant classes, gated by signal), and `sequences` (a fresh concurrency-consultant spawn for async-flow detail, independent of `design`'s earlier structural brief). Two mechanisms extend the proven pattern rather than just copying it: **task-scoped pre-consult** for `implement`'s team/workflow modes (each dispatched worker gets a brief scoped to its own task, not one brief shared by every worker) and **pre-consult injection** for the two sub-agent-only stages (`review`, and `implement`'s team/workflow dispatch) — since a sub-agent cannot itself spawn a sub-agent, the main session consults first and pastes the brief into the dispatch prompt. Consultant agent definitions move from ad-hoc `general-purpose` dispatch to dedicated files shipped inside the fork's own `agents/` directory, so they resolve identically wherever the plugin is installed.

Traceability: the two planning docs + `design-swift-consultants`'s shipped artifacts (spec, sad, ADRs) fixed the target-stage list and the ROI order. The ideation pass — a competitive `researcher` (confirmed no product combines guaranteed multi-stage firing with per-stage altitude filtering of one reusable domain-expert bundle; the closest prior art splits the problem across orchestration frameworks and single-stage review tools) and a `devils-advocate` (found 8 concrete failure modes) — directly reshaped this draft: stale-injection drove the task-scoped pre-consult decision (§2, US-02/AC-02); trigger-surface-mismatch drove the review-trigger NFR + non-goal + open question (§3, §6, §8) instead of prescribing an unproven mechanism; gate-bypass-churn drove the accepted-cost NFR + a monitored KPI instead of an unevaluated cap (§6, §7, §8); resolution-divergence drove moving consultant files into the fork's own `agents/` (§2 goal, US-06/AC-04) instead of a project-local `.claude/agents/` that wouldn't travel with the plugin; config-conflict drove the settings-reconciliation AC (US-08/AC-06); unobservable-fallback drove naming the review record as `review`'s marker surface (US-05/AC-03); redundant-spawn and trust-boundary are accepted, documented risks (§6, §6.1, §8), not blockers.

## 2. Goals

- SwiftUI/concurrency/testing expertise reaches `implement` (all three execution modes), `plan-tests`, `review`, and `sequences` **automatically, as a fixed protocol step** — no manual second step, matching the guarantee `design` already has.
- In any parallel `implement` mode (team or workflow), each dispatched worker receives a brief **scoped to its own task**, never one brief generically shared across every worker.
- The two sub-agent-only stages (`review`; `implement` team/workflow) receive expert input via **pre-consult injection** — the main session consults before dispatch and pastes the brief into the sub-agent's prompt — without requiring any restricted sub-agent to spawn a sub-agent itself.
- Consultant agent definitions resolve **identically regardless of which repo the plugin is installed into**, by shipping inside the fork's own `agents/` directory rather than a per-project location.
- Each stage's fold stays **altitude-correct for that stage** (test-matrix shape for `plan-tests`, flow-specific detail for `sequences`, quality-bar findings for `review`, full code for `implement`) — no stage absorbs guidance meant for another.
- When an expected consultant cannot be consulted, each stage surfaces a **visible marker on its own natural output surface** (never silent), while the stage itself never blocks.

## 3. Non-goals

- Not wiring `survey` / `specify` / `clarify` / `api` / `ship` / `tasks` — Tier 3 in `SDD-FORK-PLAN.md` §5.0 (wrong altitude, already-covered, or greenfield-only). Not wiring `data-model` either, though it actually sits in Tier 2, not Tier 3 — it applies only conditionally (SwiftData with `ModelActor` isolation), so it's deferred alongside the Tier-3 set rather than bundled into this rollout. All of these stay roadmap Next.
- Not designing `review`'s concrete trigger discriminator (the mechanism that reads a code diff instead of spec prose without degenerating into "always fires" on ordinary `async`/`await` syntax). This spec fixes the *requirement* (§6 NFR); the *mechanism* is this feature's own upcoming `design` stage's job — the honest WHAT-vs-HOW boundary.
- Not capping the number of consultants firing per `review` pass or per `implement` task. The cost is accepted and monitored (§6, §7, §8), not bounded, until real evidence of gate-bypass churn appears.
- Not deduplicating or caching the concurrency-expert bundle load between `design` and `sequences` — paying for it twice on async features is an accepted, documented cost (§6, §8), not solved here.
- Not adding bundle-version pinning or verification for the third-party expert bundles — the same accepted supply-chain surface `design-swift-consultants` already accepted (§6.1).
- Not forking or hand-editing the AvdLee expert-skill bundles themselves — they stay separate, auto-updating.
- Not altering the *content* of SDD's restricted sub-agents beyond what pre-consult injection requires (a brief pasted into their dispatch prompt) — `reviewer`, `test-author`, and `implementer` stay bundle-free themselves; only the main session ever loads a bundle.

## 4. User stories

### US-01: Test-matrix expertise reaches plan-tests automatically
**As a** Pipeline operator
**I want** the testing consultant consulted automatically while `plan-tests` builds the AC→test map
**So that** the test plan's level and coverage choices already account for Swift-specific testing concerns, without a manual second step

### US-02: Task-scoped expert guidance in implement, whichever mode runs
**As a** Pipeline operator
**I want** each dispatched worker — in single-agent, team, or workflow mode — to receive guidance scoped to its own task
**So that** parallel workers never receive generic advice irrelevant to what they're actually coding

### US-03: Review checks the same quality bars the code was built to
**As a** Pipeline operator
**I want** `review` to consult the swiftui/concurrency/testing experts by signal in the diff
**So that** the independent review catches iOS-specific issues at the bar `implement` targeted

### US-04: Fresh async-flow expertise in sequences
**As a** Pipeline operator
**I want** a fresh concurrency-consultant spawn when `sequences` draws async flows
**So that** suspend points, actor hops, and TaskGroup shape are informed by expertise at flow-specific detail, not `design`'s earlier structural brief

### US-05: See when review's expertise didn't land
**As a** Pipeline operator
**I want** a visible marker in the review record when an expected consultant didn't fire or returned nothing usable
**So that** I never ship a review that silently skipped a quality bar

### US-06: Consultants resolve identically everywhere the fork travels
**As a** Fork maintainer
**I want** the consultant agent definitions to ship inside the plugin's own `agents/` directory
**So that** resolution never silently diverges depending on which repo the plugin gets installed into

### US-07: Sub-agent-only stages still get expert input
**As a** Fork maintainer
**I want** `review` and team/workflow `implement` to receive a consultant's brief via pre-consult injection
**So that** restricted sub-agents that cannot spawn sub-agents themselves still benefit from the same expertise

### US-08: Test guidance never contradicts already-governing settings
**As a** Pipeline operator
**I want** the testing consultant's brief, wherever `implement` uses it, reconciled against the project's existing TDD/gate/test-command settings
**So that** `implement` never writes a test shape those settings would reject

### US-09: No noise, no cost, where a stage's own signal is absent
**As a** Pipeline operator
**I want** the relevant no-signal case at each stage (no UI/async/test-strategy surface in what that stage reads) to spawn no consultant
**So that** irrelevant expertise never inflates cost on work that doesn't need it

### US-10: Each stage keeps advice at its own altitude
**As a** Fork maintainer
**I want** each stage's altitude filter to admit only decisions appropriate to that stage
**So that** no stage's artifact absorbs guidance meant for a different stage

## 5. Acceptance criteria

### AC-01 (US-01) — happy path
**Given** a Pipeline operator runs `plan-tests` on a feature whose acceptance criteria signal a test-strategy-shaping decision
**When** the stage builds the AC→test coverage table
**Then** the testing consultant fires, and the rows it informed carry a level/coverage choice shaped by Swift-specific testing concerns (for example, recognizing when an actor-isolated or async behavior warrants its own dedicated case rather than folding into one generic case) — never a named test tool or framework, which stays `implement`'s altitude to name

### AC-02 (US-02) — happy path
**When** `implement` works a task carrying a UI, async, or test-strategy signal — in single-agent, team, or workflow mode
**Then** that task's own execution context (the dispatched worker's prompt in team/workflow mode; the main session's own inline working context in single-agent mode) carries a brief scoped to its own task's signal, and a different task worked in the same run with a different (or absent) signal receives a different (or no) brief

### AC-03 (US-05) — error
**Given** an expected consultant in `review` cannot be consulted, or fires but yields zero findings citable to a file and line (`review`'s own degenerate test, per its quality-bar altitude — not the structural-decision test other stages use)
**When** the stage runs
**Then** `review` proceeds without blocking, and the written review record carries a visible marker naming the expected-but-missing (or degenerate) consultant

### AC-04 (US-06) — domain invariant
**Given** the consultant agent definitions are added to the fork
**When** the deterministic plugin-validation gate runs
**Then** it passes because each definition lives in the fork's own agent-definition directory and is referenced only in prose, never added to any stage's validated agent roster; placing one in the roster instead makes the gate block and name the invariant

### AC-05 (US-07) — cross-context
**Given** `review`, or `implement` in team/workflow mode, needs a consultant's input for a sub-agent it is about to dispatch
**When** that sub-agent cannot itself spawn a consultant
**Then** the main session consults first and pastes the resulting brief into the sub-agent's own dispatch prompt, so the sub-agent still receives the expertise despite never spawning anything itself

### AC-06 (US-08) — cross-context
**Given** the testing consultant's generic brief conflicts with the project's own already-governing test settings (whether TDD is enforced, whether lint gates the task, which test command runs)
**When** `implement` consults the testing expert once, at the task's own execution context — the main session's own inline work in single-agent mode, or `test-author`'s RED-step dispatch in team/workflow mode — and folds that brief in
**Then** the project's own settings win, and the folded guidance never recommends a shape those settings would reject

### AC-07 (US-03) — happy path
**Given** a reviewed diff shows UI, concurrency, and test-strategy signal together
**When** `review` runs
**Then** each of the three signalled consultants fires, and each one's resulting findings are cited to a file and line in the review record and carry the same blocking weight in the review verdict as any other reviewer finding

### AC-08 (US-04) — happy path
**Given** `sequences` is drawing a flow with async behavior (a suspend point, an actor hop, or a fan-out shape)
**When** the stage runs
**Then** it spawns its own fresh concurrency-consultant call rather than reusing `design`'s earlier brief, and the flow's description reflects that flow-specific detail

### AC-09 (US-09) — domain invariant
**Given** none of `plan-tests`, `review`, or `sequences` finds a UI/async/test-strategy signal in what it reads for a given feature
**When** each of those stages runs
**Then** no consultant fires, no expert bundle loads, and no consultant token cost is incurred for that stage

### AC-10 (US-10) — authorization (altitude-permission analog)
**Given** a consultant brief returned to `plan-tests` or `sequences` contains an item at code altitude rather than that stage's own altitude (a concrete implementation detail rather than a test-matrix shape or a flow-level behavior)
**When** the stage folds the brief into its own artifact
**Then** that item is denied entry to the artifact and is left for `implement`/`review` to carry instead, and the artifact records no code-level rule

### AC-10b (US-10) — authorization (altitude-permission analog)
**Given** a consultant brief returned to `review` contains an item at structural/architectural altitude — a decision above `review`'s own quality-bar altitude (for example, "replace UIKit navigation with SwiftUI's `NavigationStack`") rather than a quality-bar finding
**When** `review` folds the brief into the review record
**Then** that item is denied entry as a finding — it is not cited to a file and line — and is left for `design` to carry instead

## 6. Non-functional requirements

| Aspect | Target | Measurement |
|---|---|---|
| Added token cost per `plan-tests` run | ≤ ~40k tokens (one testing-consultant call) | token-usage log per `plan-tests` run |
| Added token cost per triggered `implement` task | ≤ ~40k tokens per task whose dispatch needed a fresh, task-scoped brief | token-usage log per `implement` run |
| Added token cost per `review` run | accepted up to ~120k tokens worst case (3 consultants × ~40k, no cap) | token-usage log per `review` run; watched, not bounded, by the gate-bypass-churn KPI (§7) |
| Added token cost per `sequences` run on an async feature | ≤ ~40k tokens (one fresh concurrency-consultant call, independent of `design`'s own earlier spend on the same feature) | token-usage log per `sequences` run |
| Deterministic spawn (per stage's own trigger) | consultant fires on 100% of runs where that stage's own trigger signal is present — including every signalled consultant when more than one fires together (e.g., `review` firing all three at once) | eval / manual over fixture specs and fixture diffs, per stage |
| `review` trigger discrimination | TBD — see §8 (numeric ceiling fixed in this feature's own `design` stage, once the diff-visible mechanism exists) | manual sample of non-UI/non-async diffs post-wiring, once the mechanism exists |
| Fallback marker visibility | 100% of expected-but-didn't-fire (or empty-brief) cases surface a marker on that stage's own output surface | bundle-unavailable fixture run per stage |

> **On the four token-cost rows above:** all four are monitor-only figures, logged via the token-usage log — none is a hard ceiling that blocks or fails a stage on its own, consistent with §3's no-cap non-goal. `review`'s row is additionally watched by the gate-bypass-churn KPI (§7) as a corrective signal, not a per-run gate.

## 6.1 Security / privacy

- **Data classification:** internal — developer tooling, no end-user data.
- **Personal data touched:** none.
- **AuthZ/AuthN impact:** none. The altitude filter stays a content-altitude gate, not a security boundary (AC-10 is the authorization-analog for the 5-type floor, as it was in `design-swift-consultants`). Every consultant runs in clean, isolated context and sees only the feature's own artifacts + the project rules passed into its prompt.
- **Abuse cases:**
  - Wrong/outdated bundle version injects confident-but-bad advice into a `review` finding or an `implement` worker's task → mitigated by project-rules-win (AC-06) + the independent `review` pass itself; mitigation is limited (see §8).
  - Prompt-passed project rules ignored by a consultant → detected the same way `design-swift-consultants` detects it: the fold-time reconciliation, not the consultant, is the enforcement point.
  - Third-party bundle content flows, via a pasted brief, directly into a code-writing worker's dispatch prompt with no review step in between → mitigated by the brief staying ≤1 page and altitude-filtered, and by every worker's output still passing the normal per-task gate plus the independent `review` pass before ship; not eliminated, an accepted trust-boundary surface (§3, §8).
  - Silent bundle no-resolve at any of the four stages → surfaced by that stage's own fallback marker, never silently swallowed.
- **Security review:** N/A — internal dev tooling, no new PII and no new authorization boundary. Bundle trust remains an accepted supply-chain surface (the expert bundles stay auto-updating and are not forked), as already accepted in `design-swift-consultants`.

## 7. Metrics / KPIs

- **Observable-trace rate, per stage** — baseline: 0 (none of the four stages consult iOS expertise today), target: 100% of signal-bearing runs at each of the four stages carry a stage-appropriate trace, within the first 3 features run through each stage post-wiring.
- **False-fire rate on no-signal cases** — baseline: 0 (nothing fires today), target: 0 spurious consultant fires across no-signal `plan-tests`/`review`/`sequences` runs.
- **Manual second-step elimination, per stage** — baseline: 1 manual expert-consult step per stage per iOS feature (today, when remembered), target: 0.
- **Silent-rot detection** — baseline: 0 markers, target: 100% of expected-but-missing consultations produce a visible marker on that stage's own surface.
- **Review gate churn** — baseline: unknown (the stage doesn't exist yet in its consultant-aware form), target: monitor the rate of `review` runs skipped, downgraded in depth, or bypassed straight to `ship` after wiring lands; flag if it rises, since the accepted no-cap cost (§6) is exactly what could trigger this.

## 8. Open questions

- [ ] `review`'s concrete trigger discriminator (diff-structural signal vs a refined keyword/model-inference pass) — how to avoid the "fires on every diff" degenerate case? Default now: reuse `design`'s spec-prose approach as an interim placeholder for the spec-visible portion of the signal, refine the diff-visible portion in this feature's own `design` stage. — owner: Fork maintainer, due: before this feature's `design` stage finalizes review's wiring
- [ ] Revisit the no-cap policy on `review`/`implement` consultant cost if the Review gate churn KPI (§7) actually rises. Default now: no cap, monitor only. — owner: Fork maintainer, due: after the first 5 post-wiring `review` runs
- [ ] Dedupe or cache the concurrency-expert bundle load across `design` → `sequences` on the same feature? Default now: pay for both spawns independently, no dedupe. — owner: Fork maintainer, due: a later optimization pass, not this rollout
- [ ] Exact channel for reconciling the testing consultant's brief against `.claude/sdd.local.md`'s `tdd`/`gate_lint`/`cmd_test_unit` values, when `implement` uses it in `test-author`'s RED step — passed into the consultant's prompt as project rules (the same channel as `CLAUDE.md`), or read by the consultant directly? Default now: passed into the prompt, same channel as project rules. — owner: Fork maintainer, due: before `implement`'s testing-consultant wiring is implemented
- [ ] Exact surface for `implement`'s own fallback marker (a task-summary line, a `tracker.md` column, something else) — `review` has its review record and `design`/`sequences` have `sad.md`, but `implement` has no single equivalent document. Default now: a per-task line in the stage-handoff's *What I did*. — owner: Fork maintainer, due: before `implement` wiring is implemented
- [ ] Exact surface for `plan-tests`' and `sequences`' own fallback marker (`test-plan.md` / `sad.md` §6, or something else) — `review` has its review record (AC-03) and `implement`'s surface is the sibling open question above; `plan-tests` and `sequences` have no equivalent decision yet. Default now: a note on that stage's own produced artifact, mirroring `review`'s pattern. — owner: Fork maintainer, due: before this feature's own `design` stage finalizes the four stages' wiring
