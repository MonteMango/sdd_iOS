---
status: Draft
owner: "Vitalii Lytvynov"
reviewers: ["Tech Lead", "Security Lead"]
updated_at: "2026-07-20"
feature_size: "L"
target_surfaces: []  # filled in §4 — subset of: backend-service | web-frontend | mobile-app | desktop-app | cli | worker | library-sdk. Read (never re-derived) by api/sequences/tasks/plan-tests/review → _shared/surfaces.md
---

# Software Architecture Document — swift-consultants-rollout

<!-- 12 Arc42 sections. Empty section → <!-- N/A: <one-line reason> -->. -->
<!-- C4 Context (L1) lives inline in §3. C4 Container (L2) lives inline in §5. -->
<!-- Numbers in §10 come VERBATIM from spec.md §6 NFR — no inventing, no rounding. -->

## 1. Introduction and goals

<!-- 🎯 Why: durable memory of «what + the three dominant qualities + who cares». A year from
     now nobody recalls which three qualities were critical for this system.
     📋 Write: 1 ¶ intent + 3 lines of top-3 quality goals + a stakeholders table.
     ¶4 is the override slot — critic `Override` resolutions emit «Decision override: <headline>
     — rationale: <reason>» bullets here so downstream skills see the deliberate choice. -->

**Intent.** Extend the proven **expert-consultant** pattern (a disposable sub-agent loads a heavy third-party Swift-domain skill bundle, returns a ≤1-page brief, the main session altitude-filters it into the artifact) from the one stage it shipped on (`design`) to four more — `implement` (all 3 execution modes), `plan-tests` (a new third consultant class, `swift-testing-expert`), `review` (all three consultant classes via pre-consult injection), `sequences` (a fresh concurrency-consultant spawn) — as the same guaranteed, non-skippable protocol step `design` already has, so SwiftUI/concurrency/testing expertise reaches every stage that ships or tests actual Swift code, not just the architecture document.

**Top-3 quality goals (1-liners; full scenarios in §10):**

1. **Deterministic spawn** — the consultant(s) fire on 100% of runs where that stage's own trigger signal is present, including every signalled consultant firing together (e.g. `review` firing all three at once).
2. **Fallback marker visibility** — 100% of expected-but-didn't-fire cases surface a visible marker on that stage's own output surface, dual-placed (artifact + handoff), and the stage never blocks.
3. **Altitude-correct fold per stage** — a consultant's brief enters the artifact only at the altitude that stage owns (test-matrix shape for `plan-tests`, flow-specific detail for `sequences`, quality-bar findings for `review`, full code for `implement`) — not "bounded cost": spec §3 explicitly leaves token cost uncapped (accepted, monitored only via the KPI in §7).

**Stakeholders.**

| Role | Interest | Sign-off owner? |
|---|---|---|
| Pipeline operator | Runs `implement` / `plan-tests` / `review` / `sequences`; consumes the iOS-aware output from one command per stage | No |
| Fork maintainer | Keeps the wiring + the deterministic validation gate green across upstream merges; owns every §8 open question | No |
| Tech Lead | SAD approval | Yes |

<!-- Decision overrides (¶4) — populated by the critic resolution loop, empty otherwise. -->

## 2. Constraints

<!-- 🎯 Why: §4 strategy only works when §2 has fixed WHAT IS ALREADY FIXED — stack, versions,
     deadline, regulatory. This is an input, not an output.
     📋 Write: four blocks — Technical / Organisational / Conventions / Regulatory.
     📌 Pin versions («<datastore> 18», not «<datastore>»); «Q3 deadline — hard», not «ideally».
     Never N/A — every feature inherits at least Conventions + Technical. -->

**Technical.**
- TypeScript 5.5 on Bun (server) + markdown skill definitions (architecture-map §Stack) — this feature is **markdown-only**: edits confined to `skills/implement/`, `skills/plan-tests/`, `skills/review/`, `skills/sequences/` plus three new consultant definition files under `agents/` (§4/§5). No production code, no server change.
- **No datastore, no migrations** — all state is files under `docs/`; unchanged from the repo baseline.
- Expert skill bundles (`swiftui-expert`, `swift-concurrency`, `swift-testing-expert`) stay **third-party, auto-updating, un-forked** (spec §3, §6.1) — the same contract `design-swift-consultants` already accepted.
- Each consultant runs as a **disposable, clean-isolated sub-agent**; its only channel back is the ≤1-page brief text (unchanged from the shipped precedent).

**Organisational.**
- Effort: L feature, `full` route (`.size` / `.route`).
- One **Fork maintainer** — frequently the same human as the Pipeline operator, but a distinct responsibility (owns every §8 open question + the merge-drift risk in §11).

**Conventions.**
- Skill structure: YAML frontmatter (name/model/effort/agents/description) + numbered markdown protocol + `templates/` + `references/` (architecture-map §Conventions).
- Handoff: every stage ends with the 3-part block — `skills/_shared/handoff.md`.
- **Plugin validation gate:** `scripts/validate_plugin.py` must stay green; manifests kept in lockstep at `1.16.0`.
- **A sharpened version of `design-swift-consultants`' own invariant (ADR-0003 there):** this feature is the first to add real consultant definition files under `agents/` (§4/§5) — but those files are referenced **only in prose** (`subagent_type: "<consultant-name>"` with a `general-purpose` fallback), **never** added to any skill's `agents:` frontmatter list. `validate_plugin.py` only checks that every name *in* `agents:` has a file — it has no reverse check for a stray unreferenced file — so keeping every consultant out of every `agents:` list is the actual, load-bearing guard.

**Regulatory / external.**
- Internal developer tooling; no personal data, no new authZ/authN boundary (spec §6.1) → security review **N/A**.
- Bundle-trust is an **accepted supply-chain surface**: the expert bundles stay auto-updating and un-forked; a wrong/outdated bundle is mitigated by project-rules-win (AC-06) + the independent `review` pass itself, not by pinning — unchanged from the precedent.

## 3. Context and scope

<!-- 🎯 Why: draws the SYSTEM BOUNDARY — who talks to it from outside, where the trust zone ends.
     Without §3, §5 and §8 (authorization) blur — unclear what's «inside» vs «outside».
     📋 Write: 2–3 sentences of business context + an external-systems table + a C4Context block.
     📌 «External: none (deliberate, no third-party in v1)» is itself a decision worth stating.
     Trust boundary — the line past which you don't trust data without checking it.
     Never N/A — greenfield still draws the planned actors + external systems. -->

Four SDD pipeline stages — `implement`, `plan-tests`, `review`, `sequences` — currently produce stack-agnostic output with no iOS awareness, the same gap `design` had before `design-swift-consultants` closed it for one stage. This feature wires the same guaranteed consultant step into all four, so SwiftUI/concurrency/testing expertise reaches `implement`'s generated code, `plan-tests`' AC→test map, `review`'s quality bar, and `sequences`' async-flow detail — with the consuming project's rules winning at fold and a visible marker whenever an expected consultation didn't land.

**Trust boundary.** Each consultant runs **locally, in clean isolated context**, and sees only its own scope for that stage (the task's own text for `implement`, the AC being mapped for `plan-tests`, the diff signal for `review`, the flow being drafted for `sequences`) plus the project rules passed into its prompt. Bundle *content* is trusted (an accepted supply-chain surface, §2); the *brief* it returns is untrusted at the altitude level — every item is re-gated by that stage's own altitude filter before it may enter that stage's artifact.

<!-- brownfield: confirmed directly against the shipped `design-swift-consultants` code (not the stale architecture-map, which predates it by 21 commits) — skills/design/SKILL.md:48 (step 3.5, consultant spawn) and :52 (step 6, altitude fold), skills/design/references/consultant-trigger.md (signal set + mapping), skills/design/references/consultant-fold.md (altitude filter + fallback-marker format). This feature extends that exact mechanism into skills/implement/, skills/plan-tests/, skills/review/, skills/sequences/. -->

**External systems (in / out):**

| Actor or system | Type | Interaction |
|---|---|---|
| Pipeline operator | Person | Runs `/sdd:implement`, `/sdd:plan-tests`, `/sdd:review`, `/sdd:sequences`; reads the iOS-aware output |
| Fork maintainer | Person | Maintains the wiring; keeps `validate_plugin.py` green across merges |
| SwiftUI expert bundle | System (external) | Loaded by a consultant on a UI signal; returns SwiftUI expertise at the calling stage's altitude |
| Swift-concurrency expert bundle | System (external) | Loaded by a consultant on an async signal; returns concurrency expertise at the calling stage's altitude |
| Swift-testing expert bundle | System (external) | Loaded by the new testing consultant on a test-strategy signal (first introduced in this feature, at `plan-tests`) |
| Consuming project rules | System (external) | `CLAUDE.md` + any dedicated SwiftUI-rules file, passed into each consultant's prompt; project wins at fold |

**C4 Context (L1):**

```mermaid
C4Context
    title swift-consultants-rollout — System Context

    Person(operator, "Pipeline operator", "Runs implement/plan-tests/review/sequences on an iOS feature")
    Person(maintainer, "Fork maintainer", "Keeps the wiring and validation gate green across merges")

    System(stages, "Consultant-aware pipeline stages", "implement + plan-tests + review + sequences, each with the guaranteed consultant protocol step")

    System_Ext(swiftui, "SwiftUI expert bundle", "Third-party, auto-updating SwiftUI expertise")
    System_Ext(concurrency, "Swift-concurrency expert bundle", "Third-party, auto-updating concurrency expertise")
    System_Ext(testing, "Swift-testing expert bundle", "Third-party, auto-updating Swift Testing expertise")
    System_Ext(rules, "Consuming project rules", "CLAUDE.md + SwiftUI-rules file of the iOS repo")

    Rel(operator, stages, "Runs a stage", "/sdd:<stage> <slug>")
    Rel(maintainer, stages, "Maintains wiring", "fork merges")
    Rel(stages, swiftui, "Consults on a UI signal", "spawned sub-agent")
    Rel(stages, concurrency, "Consults on an async signal", "spawned sub-agent")
    Rel(stages, testing, "Consults on a test-strategy signal", "spawned sub-agent")
    Rel(stages, rules, "Reads and reconciles — project wins", "prompt input")
```

## 4. Solution strategy

<!-- 🎯 Why: the 3–4 STRATEGIC PILLARS every ADR grows from. Without §4 each ADR looks random —
     there's no umbrella. ⭐ The densest section — the blast-radius gate fires almost always here
     (decisions are irreversible + multi-module).
     📋 Write: 3–4 choices; each a heading + 2–3 sentences of rationale.
     📌 «Store content as a table of typed blocks» is a pillar — ADR-0001 grows from it. -->

**Top strategic choices (the seeds for ADRs):**

1. **<e.g. Module isolation through events>** — <2–3 sentences citing quality goals + constraints>.
2. **<e.g. Single-store persistence>** — <2–3 sentences>.
3. **<e.g. Server-rendered read side>** — <2–3 sentences>.

Each tactical decision in later sections should trace to one of these seeds. Tactical decisions that *contradict* a strategic choice are red flags — surface them in §11.

## 5. Building block view

<!-- 🎯 Why: INTERNAL DECOMPOSITION — modules, containers, datastores. The static topology: who
     may talk to whom. Without §5, §6 (the flows) has no vocabulary of participants.
     📋 Write: 1 ¶ on the style (layered / hexagonal / clean / event-driven) + a folder tree + a
     C4Container block.
     📌 Draw ONE Container per declared `target_surface` (frontmatter): a fullstack
     [backend-service, web-frontend] = a backend-API container + a web/SPA container; a
     [backend-service, mobile-app] = the API + the mobile app. The Container(web, …) line below is
     just one surface's container — swap/add per what was declared in §4. → _shared/surfaces.md
     📌 e.g. «web app, content API, media worker, datastore, object store, CDN». -->

<One paragraph: layered / hexagonal / clean / event-driven, and why.>

**Internal decomposition:**

```
<e.g. modules/<feature>/>
├── domain/       <entities + sentinel errors>
├── app/          <use cases / services>
├── infra/        <repository + integration impl>
├── ports/        <handlers, DTOs, error mapping>
└── wiring        <self-wiring entry point>
```

**C4 Container (L2):** <!-- syntax → references/c4-mermaid-syntax.md. Real names, no <placeholder> stubs. ONE Container per declared target_surface (frontmatter); the web container below is one example surface. -->

```mermaid
C4Container
    title <feature> — Containers

    Person(actor, "<Actor>")

    Container_Boundary(app, "<Our system>") {
        Container(web, "<Web/UI>", "<technology>", "<purpose>")
        Container(api, "<API/handler>", "<technology>", "<purpose>")
        ContainerDb(db, "<Datastore>", "<technology>", "<purpose>")
    }

    System_Ext(ext, "<External>", "<purpose>")

    Rel(actor, web, "<interaction>", "<protocol>")
    Rel(web, api, "<calls>")
    Rel(api, db, "<reads/writes>", "<driver>")
    Rel(api, ext, "<emits>", "<protocol>")
```

## 6. Runtime view

<!-- 🎯 Why: the RUNTIME FLOW of 1–2 critical scenarios — who talks to whom, when, in what order.
     Without §6, §5 is just boxes with no life.
     📋 Write: a Mermaid sequenceDiagram. Participants are names from §5 (don't invent new ones).
     Messages are semantic («saves a draft»), NO HTTP verbs / paths / status codes — endpoint-level
     sequences arrive at the `api` stage.
     📌 e.g. «author → web: composes draft → web → content API: save». Seed the primary flow(s) here;
     the `sequences` stage then covers every §5 AC (no cap). Never N/A for M+; XS/S keeps ≥1 happy-path flow. -->

**Critical flow 1: <flow name>**

```mermaid
sequenceDiagram
    actor Actor
    participant Web
    participant Service
    participant Store
    Actor->>Web: <action>
    Web->>Service: <call>
    Service->>Store: <write>
    Store-->>Service: ok
    Service-->>Web: result
    Web-->>Actor: confirmation
```

**Critical flow 2: <e.g. async event propagation>** — <if applicable, otherwise N/A>.

## 7. Deployment view

<!-- 🎯 Why: the TOPOLOGY DevOps must know without reading the deploy charts — how many replicas,
     where the background worker lives, AT WHAT NUMBERS we scale.
     📋 Write: 2–3 sentences on topology + monitoring + concrete threshold numbers.
     📌 e.g. «500 authors → partition by quarter» (not «we'll think about scale later»).
     🎯 N/A allowed for XS/S that reuses an existing deployment unit with no change.
     Deployment-diagram scaffold → templates/deployment.md. -->

<Topology in 2–3 sentences. Where it runs, replicas, scaling thresholds.>

**Monitoring:**
- <Metrics — e.g. `<metric_name>`>
- <Alerts — e.g. «worker lag > 10 min → page on-call»>
- <Tracing — e.g. spans on the request boundary>

**Scaling thresholds:**
- <e.g. comfortable in one table up to N rows/year>
- <e.g. partition by quarter above N rows/year>

<!-- For XS/S with no deployment change: <!-- N/A: reuses existing deployment unit, no infra change --> -->

## 8. Crosscutting concepts

<!-- 🎯 Why: CROSS-CUTTING PATTERNS spanning several modules: logging, errors, authorization, ID
     strategy, events, caching. ⭐ The second-densest section. A pattern inside one module is NOT
     here; a project-wide convention belongs in the convention file.
     📋 Write: a table — concept / convention / where defined. One row per concept.
     📌 e.g. «sortable time-based IDs generated in the app layer» as a default from the convention file. -->

| Concept | Convention | Where defined |
|---|---|---|
| Logging | <e.g. structured, fields `module=<name>`> | <convention file §X or here> |
| Authentication | <e.g. token-based via middleware> | <convention file §X> |
| Error handling | <e.g. domain sentinel → ports error mapping → JSON> | <convention file §X> |
| ID strategy | <e.g. sortable time-based ID in the app layer> | <convention file §X> |
| Internationalisation | <e.g. N/A, single language> | — |
| Observability | <e.g. tracing on the request boundary> | — |
| Events | <module-specific patterns, if any> | <here> |

## 9. Architecture decisions

<!-- 🎯 Why: the REVERSE INDEX onto the adr/ folder. `ls adr/` gives the files; §9 gives the
     semantics — why they exist, which SAD section they attach to, what status.
     📋 Write: a 4-column table, one row per ADR. Mixed status is fine.
     📌 e.g. «0001 | Store content as a table of typed blocks | Accepted | §4». -->

| # | Title | Status | Section |
|---|---|---|---|
| <NNNN> | <imperative — e.g. "Use a sliding-window counter for rate limiting"> | Accepted | §<N> |
| <NNNN> | <imperative — e.g. "Co-locate the worker in the API process"> | Accepted | §<N> |

ADR files live under `docs/features/<slug>/adr/NNNN-<title>.md`.

## 10. Quality requirements

<!-- 🎯 Why: the QUALITY TREE — take a goal from §1 and break it into concrete leaves: tests,
     metrics, configs, drills. ⭐ Without §10, §1 is a manifesto. With §10 each declaration maps
     to something PROVABLE.
     📋 Write: per §1 goal — When / Then / How-verify. Numbers from spec §6 NFR VERBATIM (don't
     round ≤250ms to ≤300ms — that's a critic F6 hit).
     📌 e.g. «p95 ≤ 500 ms on a block update, verified by a 100 req/s load test». -->

Each top-3 goal from §1 expanded into a full scenario:

**QG-1. <quality attribute>**
- **When:** <trigger condition>
- **Then:** <expected behaviour with numbers from spec §6 NFR>
- **How verify:** <test / chaos drill / load test / metric>

**QG-2. <quality attribute>**
- **When:** <trigger>
- **Then:** <expected>
- **How verify:** <how>

**QG-3. <quality attribute>**
- **When:** <trigger>
- **Then:** <expected>
- **How verify:** <how>

## 11. Risks and technical debt

<!-- 🎯 Why: ⭐ collects EVERYTHING that can break — not only the technical. Without §11 risks get
     discussed at standups and lost; debt lives only in the head of whoever accepted it.
     📋 Write: a risk/debt table — severity — mitigation — owner. Accepted debt in its own block.
     📌 The first risk is often a product risk, not a technical one. That's normal. -->

<!-- Severity literals: Low / Medium / High for regular risks; "Open question" for rows created by
     a Save-as-OQ resolution during the Socratic walk (see references/socratic.md). -->

| Risk / debt | Severity | Mitigation | Owner |
|---|---|---|---|
| <e.g. Worker lag may reach hours during a downstream outage> | Medium | <alert >10 min, on-call playbook, retry backoff> | <DevOps> |
| <e.g. No event-schema versioning in v1> | Medium | <ADR-NNNN planned for v2, tolerate unknown fields> | <Backend> |
| Open architectural decision: <decision-headline> | Open question | Resolve before <stage trigger or YYYY-MM-DD>; <inline rationale from the Save-as-OQ> | <owner> |

**Accepted debt (acceptable in v1, plan to fix later):**
- <e.g. the entity is immutable / unversioned — OK for v1, may need audit versioning in v2>

## 12. Glossary

<!-- 🎯 Why: ⭐ the DOMAIN GLOSSARY that ends arguments a year later («checkpoint — weekly or
     biweekly? quarter — calendar or fiscal?»).
     📋 Write: a term / meaning table. Business + technical terms mixed.
     📌 e.g. «Lesson | a unit inside a course made of blocks (text, video)». -->

| Term | Meaning |
|---|---|
| <e.g. domain object A> | <its meaning in this domain> |
| <e.g. domain object B> | <its meaning> |
| <e.g. domain invariant name> | <the rule, in plain language> |
