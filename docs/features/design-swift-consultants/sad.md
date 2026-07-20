---
status: Draft
owner: "Vitalii Lytvynov"
reviewers: ["Tech Lead", "Security Lead"]
updated_at: "2026-07-17"
feature_size: "S"
target_surfaces: [worker]  # the disposable consultant sub-agent — a spawned, request/response-less job. Read (never re-derived) by api/sequences/tasks/plan-tests/review → _shared/surfaces.md
---

# Software Architecture Document — design-swift-consultants

<!-- 12 Arc42 sections. Empty section → N/A with a one-line reason. -->
<!-- C4 Context (L1) lives inline in §3. C4 Container (L2) lives inline in §5. -->
<!-- Numbers in §10 come VERBATIM from spec.md §6 NFR — no inventing, no rounding. -->

## 1. Introduction and goals

**Intent.** Make iOS domain expertise reach the SDD architecture document **automatically, as a fixed protocol step** of the `design` stage — for any feature whose spec signals a UI or async surface, with no manual second "ask the expert" step. The expertise is injected by a **disposable, situationally-reasoning consultant sub-agent** (loading a third-party expert bundle), **altitude-filtered to structural decisions**, so the SAD's §4/§5 gain iOS-specific structural guidance without code-level noise — and the stage **never blocks** when a consultant cannot be reached.

**Top-3 quality goals (1-liners; full scenarios in §10):**

1. **Deterministic spawn** — the consultant fires on 100 % of runs where the spec trigger signal is present (guaranteed by the protocol, not chosen by the model).
2. **Bounded cost** — added token cost ≤ ~80k per `design` run (≤2 consultants × ~40k), and exactly zero on pure-logic features.
3. **Fallback visibility** — 100 % of expected-but-didn't-fire cases surface a visible marker; a failing consultant degrades gracefully, never halting the stage.

**Stakeholders.**

| Role | Interest | Sign-off owner? |
|---|---|---|
| Pipeline operator | Runs `design`; consumes the iOS-aware SAD from one command | No |
| Fork maintainer | Keeps the wiring + the deterministic validation gate green across upstream merges | No |
| Tech Lead | SAD approval | Yes |

<!-- Decision overrides (¶4) — populated by the critic resolution loop, empty otherwise. -->

## 2. Constraints

**Technical.**
- Markdown skill protocols (the pipeline itself) + Bun / TypeScript 5.5 dashboard server — the repo *is* the SDD toolkit. This feature is **markdown-only**: edits to `skills/design/` (SKILL.md + references) plus a project-local consultant agent definition. No production code, no server change.
- **No datastore, no migrations** — all state is files under `docs/`; `migration_tool` stays empty (architecture-map §Datastores).
- Expert skill bundles are **third-party, auto-updating, and NOT forked** (spec §3, §6.1). The consultant loads them; it never edits them.
- The consultant runs as a **disposable, clean-isolated sub-agent** spawned from the main session; its only channel back is the ≤1-page brief text.

**Organisational.**
- Effort: S feature, `standard` route; one maintainer (frequently the same human as the operator, distinct responsibility).
- SDD is a **hard fork** — losing upstream auto-update is an accepted cost so the trigger is guaranteed, not model-chosen (spec §1).

**Conventions.**
- Skill structure: YAML frontmatter + numbered markdown protocol + `templates/` + `references/` (architecture-map §Conventions).
- Handoff: every stage ends with the 3-part block — `skills/_shared/handoff.md`.
- **Plugin validation gate:** `scripts/validate_plugin.py` must stay green; manifests kept in lockstep at `1.16.0`.
- SDD's **restricted sub-agent roster** (`explorer` / `critic` / `reviewer` / `implementer`) stays bundle-free — the consultant is *not* added to it (spec §3, AC-04).

**Regulatory / external.**
- Internal developer tooling; no personal data, no new authZ/authN boundary (spec §6.1) → security review **N/A**.
- Bundle-trust is an **accepted supply-chain surface**: the expert bundles stay auto-updating and un-forked; a wrong/outdated bundle is mitigated by project-rules-win (AC-05) + observable-trace review, not by pinning.

## 3. Context and scope

The SDD `design` stage produces stack-agnostic architecture with no iOS awareness. This feature wires iOS **structural** expertise into that stage for UI/async features: on a spec trigger signal, `design` consults third-party expert bundles through a disposable sub-agent and folds the resulting structural decisions into the SAD's strategy and building-block sections — with project rules winning at fold time, and a visible marker whenever a consultation was expected but did not land.

<!-- brownfield: SDD toolkit repo — markdown skill pipeline + Bun/TS dashboard server; this feature edits `skills/design/` only, adds no datastore. -->

**Trust boundary.** The consultant runs **locally, in clean isolated context**, and sees only the feature spec + the project rules passed in its prompt. Bundle *content* is trusted (an accepted supply-chain surface, §2); the *brief* it returns is untrusted at the altitude level — every item is re-gated by the Altitude filter and reconciled against project rules before it may enter the SAD.

**External systems (in / out):**

| Actor or system | Type | Interaction |
|---|---|---|
| Pipeline operator | Person | Runs `/sdd:design <slug>`; reads the iOS-aware SAD |
| Fork maintainer | Person | Maintains the wiring; keeps `validate_plugin.py` green across merges |
| SwiftUI expert bundle | System (external) | Loaded by a consultant on a UI signal; returns SwiftUI structural expertise |
| Swift-concurrency expert bundle | System (external) | Loaded by a consultant on an async signal; returns concurrency structural expertise |
| Consuming project rules | System (external) | `CLAUDE.md` + any SwiftUI-rules file, passed into the consultant prompt; project wins at fold |

**C4 Context (L1):**

```mermaid
C4Context
    title design-swift-consultants — System Context

    Person(operator, "Pipeline operator", "Runs /sdd:design on an iOS feature")
    Person(maintainer, "Fork maintainer", "Keeps the wiring and validation gate green")

    System(design, "design stage (iOS-aware)", "SDD design protocol with the guaranteed consultant step")

    System_Ext(swiftui, "SwiftUI expert bundle", "Third-party, auto-updating SwiftUI expertise")
    System_Ext(concurrency, "Swift-concurrency expert bundle", "Third-party, auto-updating concurrency expertise")
    System_Ext(rules, "Consuming project rules", "CLAUDE.md + SwiftUI-rules file of the iOS repo")

    Rel(operator, design, "Runs the stage", "/sdd:design")
    Rel(maintainer, design, "Maintains wiring", "fork merges")
    Rel(design, swiftui, "Consults on a UI signal", "spawned sub-agent")
    Rel(design, concurrency, "Consults on an async signal", "spawned sub-agent")
    Rel(design, rules, "Reads and reconciles (project wins)", "prompt input")
```

## 4. Solution strategy

**Target surface (decided first).** `target_surfaces: [worker]` (frontmatter). The feature introduces exactly one runnable behaviour — the disposable **consultant sub-agent**, a spawned, request/response-less job that loads a bundle and returns a brief. No UI / CLI / HTTP surface is added; the consuming iOS app is a *separate* project, not a surface of this feature. Single surface → no multi-surface ADR.

**Top strategic choices (the ADR seeds):**

1. **Guaranteed-fire consultant spawn, situational reasoning (ADR-0001).** The consultant spawn is a fixed, non-skippable protocol step of `design` (runs alongside the step-3 explorer); the consultant's internal reasoning stays model-driven. Determinism at the trigger, not the reasoning — the honest determinism boundary (spec §3) and the feature's differentiator.
2. **Disposable bundle-loading consultant, not a forked static rules file (ADR-0002).** A discardable sub-agent loads the live third-party expert bundle and reasons over the feature, returning a ≤1-page brief. The bundle stays un-forked + auto-updating; clean isolation bounds context bleed.
3. **Consultant outside SDD's restricted roster (ADR-0003).** Main-session-spawned, project-local, referenced only in prose — never in the validated agent roster. Keeps `validate_plugin.py` green (AC-04) and the merge surface small (US-04).
4. **Non-blocking graceful fallback with a dual visible marker (ADR-0004).** On any consultant failure the stage proceeds and emits a marker in BOTH the handoff and the SAD; never a hard gate (spec §2 goal 3).

**Inline decisions (do not cross the blast-radius gate):**

- **Trigger detection** — a curated keyword set (`views / navigation / screens / SwiftUI / UI` ⇒ UI-class; `async / await / background / concurrency / actors / tasks` ⇒ async-class) **plus** model inference over the spec prose. Mapping: UI ⇒ SwiftUI consultant, async ⇒ Swift-concurrency consultant, both ⇒ both. There are exactly two consultant classes, so the ≤2-per-run cap holds *structurally*. The mechanism is fixed; its *tuning* (false-negatives on UI specs without the "magic words") is an open question → §11.
- **Altitude filter = reuse `design`'s own blast-radius gate.** The fold step admits only structural-altitude brief items (irreversible / cross-module / has legitimate alternatives) into §4/§5; code-level items are denied entry and routed to implement/review (AC-03). Reusing the existing gate makes this a mechanism-reuse, not a new irreversible decision.
- **Concurrent spawn with the step-3 explorer** — the consultant(s) spawn alongside the explorer and complete before the fold step; added latency ≈ 0 when they finish within the explorer window, else the fold waits. A reversible latency choice.
- **Project-rules-win at fold** — the main session reconciles each admitted decision against the consuming project's rules at fold time (project wins); the consultant is not trusted to honour the passed-in rules. The fold is the enforcement point for AC-05.

Every tactical decision in later sections traces to one of these seeds. A tactical decision that contradicts a strategic choice is a red flag → §11.

## 5. Building block view

**Style: extend an existing module, following the repo's markdown-protocol convention.** This feature adds three protocol pieces to the existing `design` skill (a numbered `SKILL.md` + `references/`), plus one project-local consultant definition — it is *not* a new skill (a separate skill could not be a guaranteed step *of* `design`). The only new runnable unit is the consultant (the `worker` surface); the trigger and fold pieces are protocol steps executed by the main session.

**Internal decomposition:**

```
skills/design/
├── SKILL.md                       # +step 3.5 (trigger → spawn, concurrent with the step-3 explorer)
│                                  # +fold step (altitude filter + project-rules-win + marker) in step 6/7
├── references/
│   ├── consultant-trigger.md      # curated signal set + signal→consultant mapping + ≤2-per-run cap
│   └── consultant-fold.md         # altitude filter (blast-radius gate) + project-rules-win + fallback-marker format
└── (project-local) consultant     # spawned from the main session; loads the expert bundle; NOT in the sdd:* validated roster (ADR-0003)
```

- **Trigger detector** — reads the spec prose (curated keyword set + model inference), classifies UI-/async-class, maps to consultant class(es).
- **Consultant sub-agent** — disposable, spawned on a signal; loads the expert bundle, reasons over the feature spec + passed-in project rules, returns a ≤1-page brief. Clean-isolated; its only channel back is the brief.
- **Altitude fold** — applies the blast-radius gate to each brief item (structural admitted, code-level denied → implement/review) and reconciles against project rules (project wins); writes admitted structural decisions into the SAD §4/§5; emits the fallback marker on a missing/degenerate consultation.

**C4 Container (L2):**

```mermaid
C4Container
    title design-swift-consultants — Containers

    Person(operator, "Pipeline operator")

    Container_Boundary(design, "design stage (SDD skill)") {
        Container(trigger, "Trigger detector", "Markdown protocol step", "Spec prose → keyword set + model inference → consultant class(es)")
        Container(consultant, "Consultant sub-agent", "Disposable spawned agent (worker)", "Loads the expert bundle, reasons over the feature + project rules, returns a ≤1-page brief")
        Container(fold, "Altitude fold", "Markdown protocol step", "Blast-radius gate + project-rules-win; writes structural decisions; emits the fallback marker")
    }

    ContainerDb(sad, "SAD artifact", "Filesystem — docs/features/<slug>/sad.md + adr/", "The iOS-aware architecture document + fallback marker")
    System_Ext(bundle, "Expert skill bundle", "SwiftUI / Swift-concurrency, third-party auto-updating")
    System_Ext(rules, "Consuming project rules", "CLAUDE.md + SwiftUI-rules file")

    Rel(operator, trigger, "Runs /sdd:design")
    Rel(trigger, consultant, "Spawns on a UI/async signal", "≤2 per run")
    Rel(consultant, bundle, "Loads and reasons", "skill invocation")
    Rel(consultant, fold, "Returns the brief", "text")
    Rel(fold, rules, "Reconciles — project wins", "reads")
    Rel(fold, sad, "Writes structural decisions + marker", "file write")
```

## 6. Runtime view

**Critical flow 1: iOS-aware design (happy path, AC-01)**

```mermaid
sequenceDiagram
    actor Operator
    participant Trigger as Trigger detector
    participant Consultant
    participant Bundle as Expert bundle
    participant Fold as Altitude fold
    participant SAD
    Operator->>Trigger: runs design on a UI/async feature
    Trigger->>Consultant: spawns matching consultant(s) (≤2)
    Consultant->>Bundle: loads and reasons over feature + project rules
    Bundle-->>Consultant: structural expertise
    Consultant-->>Fold: returns ≤1-page brief
    Fold->>Fold: blast-radius gate + reconcile project rules (project wins)
    Fold->>SAD: writes iOS structural decisions into §4 / §5
    SAD-->>Operator: iOS-aware SAD — handoff names the consultant(s) that fired
```

**Critical flow 2: consultant unavailable / degenerate brief (fallback, AC-02)**

```mermaid
sequenceDiagram
    actor Operator
    participant Trigger as Trigger detector
    participant Consultant
    participant Bundle as Expert bundle
    participant Fold as Altitude fold
    participant SAD
    Operator->>Trigger: runs design on a UI/async feature
    Trigger->>Consultant: spawns matching consultant(s)
    Note over Consultant,Bundle: bundle fails to load OR brief carries no structural decision
    Consultant-->>Fold: empty / degenerate brief
    Fold->>SAD: writes a fallback marker naming the missing consultant
    Fold-->>Operator: handoff carries the fallback marker — stage proceeds, never blocks
```

**Critical flow 3: pure-logic feature — no consultant fires (AC-06, US-03)**

```mermaid
sequenceDiagram
    actor Operator
    participant Trigger as Trigger detector
    participant Consultant
    participant Fold as Altitude fold
    participant SAD
    Note over Operator,SAD: Precondition — the spec carries no UI/async trigger signal (pure-logic feature)
    Operator->>Trigger: runs design on a pure-logic feature
    Trigger->>Trigger: classifies the spec prose — no UI/async signal
    Note over Trigger,Consultant: no consultant spawned — zero added token cost
    Trigger->>Fold: proceeds with no brief
    Fold->>SAD: writes generic architecture — no iOS structural trace
    SAD-->>Operator: SAD carries no iOS trace and no consultant token cost
```

**Critical flow 4: fold-time admission control — altitude gate + project-rules-win (AC-03/US-05, AC-05/US-06)**

```mermaid
sequenceDiagram
    actor Operator
    participant Consultant
    participant Fold as Altitude fold
    participant Rules as Project rules
    participant SAD
    Note over Consultant,SAD: Precondition — a consultant returned a ≤1-page brief with mixed items
    Consultant-->>Fold: returns brief (structural + code-level + rule-conflicting items)
    Fold->>Rules: reads the project rules for reconciliation
    alt item is code-level (below structural altitude)
        Fold->>Fold: denies entry — routes the item to implement/review
        Note over Fold,SAD: SAD records no code-level rule
    else item conflicts with a project rule
        Rules-->>Fold: the governing project rule
        Fold->>SAD: writes the project rule (project wins), not the generic advice
    else item is structural and rule-compatible
        Fold->>SAD: writes the iOS structural decision into §4 / §5
    end
    SAD-->>Operator: SAD carries only admitted, project-reconciled structural decisions
```

**Critical flow 5 (build-time): plugin-validation invariant gate (AC-04, US-04)**

```mermaid
sequenceDiagram
    actor Maintainer as Fork maintainer
    participant Gate as Validation gate
    participant Roster as Agent roster
    Note over Maintainer,Roster: Precondition — the maintainer added/merged the consultant wiring
    Maintainer->>Gate: runs validate_plugin.py
    Gate->>Roster: scans the validated agent roster
    alt consultant referenced only in prose (absent from the roster)
        Roster-->>Gate: consultant not in the roster
        Gate-->>Maintainer: gate passes — merge surface stays green
    else consultant placed in the validated roster (invariant violated)
        Roster-->>Gate: consultant present in the roster
        Gate-->>Maintainer: gate blocks and names the violated invariant
    end
```

<!-- sequences flags (flag only — never auto-written into §5 / no ADR):
  - Flow 5 uses participants `Validation gate` + `Agent roster` not declared in §5 building blocks. Both are real
    repo artifacts (`scripts/validate_plugin.py` + the sdd:* validated agent roster, §2 Conventions), not invented
    tech — flag for `design` to add to §5 if the build-time gate is kept in the runtime view.
  - All flows are sync (spawn → brief → fold); no webhook/queue/scheduled/callback path exists, so no
    idempotency / retry / dead-letter branch is required (spec describes graceful fallback, not retry).
  - Backstop fix applied to pre-existing Flow 1 + Flow 2: a `;` in message text broke the mermaid parser
    (`;` is a statement separator) — replaced with `—`, semantics unchanged, so both blocks now render. -->

## 7. Deployment view

<!-- N/A: no infrastructure change — the feature is markdown edits to the `design` skill running inside Claude Code; there is no server, replica, or datastore to deploy. -->

The only operational envelope is the **per-run token / latency budget**: consultants spawn concurrently with the step-3 explorer, are capped at ≤2 per run (~≤80k added tokens), and add ≈0 latency when they finish within the explorer window (else the fold waits). Measured, not deployed — see §10 QG-2.

## 8. Crosscutting concepts

| Concept | Convention | Where defined |
|---|---|---|
| Failure handling | Graceful fallback + dual visible marker (handoff + SAD); never a hard gate | ADR-0004, §4 |
| Content admission (altitude) | Blast-radius gate reused as the fold's admission filter — structural in, code-level out (→ implement/review) | AC-03, §4; reuses design's own gate |
| Rule reconciliation | Project-rules-win at fold; the consultant is not trusted to honour the passed-in rules | AC-05, §4 |
| Cost / observability | Token-usage log per `design` run (≤ ~80k budget); the handoff names which consultant(s) fired | spec §6 NFR, §10 |
| Determinism boundary | Spawn is deterministic (100 % on signal); reasoning is model-driven | ADR-0001, §4 |
| Plugin-validation invariant | Consultant referenced only in prose, never in the validated roster; `validate_plugin.py` stays green | ADR-0003, AC-04 |
| Artifact language | SAD prose + marker text follow `artifact_language` (`en`); headings + machine tokens stay English | `_shared/artifact-language.md` |
| ID strategy / persistence | N/A — no datastore, no IDs; the SAD file is the only state | architecture-map §Datastores |
| Internationalisation | N/A — single-language tooling output (per `artifact_language`) | — |

## 9. Architecture decisions

| # | Title | Status | Section |
|---|---|---|---|
| 0001 | Make the consultant spawn a guaranteed protocol step, keep its reasoning situational | Accepted | §4 |
| 0002 | Load the expert bundle in a disposable sub-agent rather than fork a static rules file | Accepted | §4 |
| 0003 | Spawn the consultant from the main session, outside SDD's validated sub-agent roster | Accepted | §4, §5 |
| 0004 | On a consultant failure, proceed and emit a dual visible marker instead of blocking | Accepted | §4, §8 |

ADR files live under `docs/features/design-swift-consultants/adr/NNNN-<title>.md`.

## 10. Quality requirements

**QG-1. Deterministic spawn**
- **When:** a feature spec carries the trigger signal (a UI- or async-class signal).
- **Then:** the matching consultant(s) fire on **100 % of runs where the spec trigger signal is present** (spec §6 NFR).
- **How verify:** eval / manual over fixture specs (spec §6 measurement); the regression-anchor eval `design-ios-consultant` asserting observable trace (spec §8 OQ).

**QG-2. Bounded cost (and best-effort latency)**
- **When:** a design run fires ≤2 consultants (there are exactly two consultant classes).
- **Then:** added token cost **≤ ~80k tokens (≤2 consultants × ~40k)** per run, and **exactly 0** on a pure-logic feature (spec §6 NFR, AC-06). Added wall-clock latency **≈ 0** when a consultant finishes within the step-3 explorer window, else the fold waits on it (best-effort, spec §6 NFR).
- **How verify:** token-usage log per `design` run; stage timing before/after wiring (spec §6 measurement).

**QG-3. Fallback visibility**
- **When:** an expected consultant cannot be consulted (bundle fails / skill unavailable / web absent) OR returns a degenerate brief.
- **Then:** **100 % of expected-but-didn't-fire cases surface a visible marker** in both the handoff and the SAD; the stage still proceeds (spec §6 NFR, AC-02).
- **How verify:** bundle-unavailable fixture run (spec §6 measurement).

## 11. Risks and technical debt

| Risk / debt | Severity | Mitigation | Owner |
|---|---|---|---|
| Wrong / outdated bundle version injects confident-but-bad advice | Medium | Project-rules-win (AC-05) + observable-trace review; mitigation is limited (no bundle pinning) | Fork maintainer |
| Operator ignores the fallback marker → ships silently-generic architecture | Low | Dual placement (handoff + durable SAD) raises visibility | Pipeline operator |
| Consultant ignores the passed-in project rules | Low | Caught at fold by project-rules-win reconciliation (AC-05) | Fork maintainer |
| Open architectural decision: add a regression-anchor eval (`design-ios-consultant`) asserting observable trace | Open question | Resolve before Tier-2 rollout; smoke test already proves the mechanism, so this is optional-for-now | Fork maintainer |
| Open architectural decision: trigger accuracy — cut false-negatives on UI specs without the "magic words" | Open question | Resolve after the first 3 features; current mechanism is keyword + model inference over spec prose | Fork maintainer |
| Open architectural decision: cost cap — cap consultants-per-run / dedupe bundle loads as tiers roll out | Open question | Resolve before Tier-2; current cap is ≤2 per run, no dedupe | Fork maintainer |
| Open architectural decision: fork-drift discipline — re-verify the step-3.5 wiring survives each upstream merge | Open question | Resolve each upstream release; current process is manual `validate_plugin.py` + smoke check per merge | Fork maintainer |

**Accepted debt (acceptable in v1, plan to fix later):**
- **Bundle-trust supply-chain surface** — the expert bundles stay auto-updating and un-forked; a compromised/outdated bundle is an accepted risk mitigated only by project-rules-win + trace review (spec §6.1).
- **No bundle-load dedupe** — only the structural ≤2-per-run cap; deduping repeated bundle loads is deferred to the Tier-2 cost-cap OQ.

## 12. Glossary

Canonical definitions live in [`./CONTEXT.md`](./CONTEXT.md) `## Glossary`; the terms used across this SAD:

| Term | Meaning |
|---|---|
| Pipeline operator | The engineer who runs `/sdd:design <slug>` on an iOS repo; the human whose one command should yield iOS-aware output. |
| Fork maintainer | Owns the SDD fork's wiring — merges each upstream release, keeps the validation gate green. |
| Expert consultant | A disposable sub-agent spawned from the main session that loads an expert bundle, reasons over the feature, and returns a ≤1-page brief. |
| Expert skill bundle | A third-party SwiftUI / Swift-concurrency knowledge skill invoked by a consultant; auto-updating, un-forked. |
| Trigger signal | A product-level signal read from `spec.md` (UI / async) that decides whether — and which — consultant fires. |
| Structural altitude | The SAD §4/§5 level at which a decision is expensive to reverse (irreversible / cross-module), per the blast-radius gate. |
| Blast-radius gate | The criterion classifying a decision as structural-altitude; reused here as the Altitude filter's admission test. |
| Altitude filter | The rule that only structural-altitude decisions may enter the SAD from a brief; code-level items are routed to implement/review. |
| Observable trace | A detectable manifestation in the SAD that a consultant fired and its brief was folded in. |
| Fallback marker | A visible note in BOTH the handoff and the SAD that a consultant was expected but did not fire or returned a degenerate brief. |
| Project rules | The consuming iOS repo's conventions (`CLAUDE.md` + SwiftUI-rules file) passed into the consultant prompt; project wins at fold. |
