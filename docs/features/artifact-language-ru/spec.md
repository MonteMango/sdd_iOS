---
status: Draft
owner: "Vitalii Lytvynov"
reviewers: ["Fork maintainer"]
updated_at: "2026-08-06"
feature_size: "XS"
---

# Spec — artifact-language-ru

> **Glossary:** [CONTEXT](../../../CONTEXT.md) (repo-root; no feature-scoped CONTEXT.md needed — no new domain terms)
> **Reference module / docs / channels used:** `.claude/sdd.local.md`, `skills/_shared/artifact-language.md`, `skills/implement/references/settings.md`, `README.md`, `evals/README.md`, `evals/scenarios/glossary-artifact-language-uk/` (the precedent this feature mirrors) — all read during the interview; no external channel picked.

## 1. Context

The **Pipeline operator** (see root [CONTEXT.md](../../../CONTEXT.md)) works in Russian and wants this repo's own SDD-generated documents — spec, SAD, ADRs, and the rest — written with Russian prose instead of English. Investigating `.claude/sdd.local.md` surfaced that the `artifact_language` key already documents itself as accepting "any language tag," not just the `en`/`uk` shown in its example — but `ru` has never actually been exercised: no eval scenario proves it behaves like the documented `uk` case (prose switches, structure stays English), and no documentation location names `ru` as a worked example.

The trigger is direct: the operator asked whether Russian docs are possible for this project, found the mechanism already supports it in principle, and wants it proven and adopted before relying on it for real feature work — starting with this very feature's own downstream artifacts.

The committed approach: add an eval scenario for `ru` adapted from the existing `glossary-artifact-language-uk` (with a rubric check specific to Russian, not merely "the text is Cyrillic" — Ukrainian text would also pass a plain-Cyrillic check), name `ru` explicitly as a validated example in `skills/implement/references/settings.md` (both its prose bullet and its auto-create YAML frontmatter template) and in `README.md`'s `artifact_language` line — the two files that actually enumerate `en`/`uk` today — and in this repo's own `.claude/sdd.local.md`, add a one-line validated-tags note to `skills/_shared/artifact-language.md` (which today names no tags at all, only "default `en`"), register both the (currently unlisted) `uk` scenario and the new `ru` scenario in `evals/README.md`'s scenario table, and flip this repo's own `.claude/sdd.local.md` `artifact_language` from `en` to `ru`.

## 2. Goals

- Prove, via an automated eval, that `artifact_language: ru` produces Russian-language prose while every structural element (headings, frontmatter, verdict literals, machine tokens) stays English — the same guarantee already proven for `uk`.
- Make `ru` a discoverable, named example in the settings documentation, not an implicit member of a parenthetical "(any language tag)" the operator has to trust without evidence.
- Switch this repo's own dogfooding pipeline so that new SDD-generated documents default to Russian prose going forward.
- Close the `evals/README.md` scenario-table gap for language coverage — register both the existing `uk` scenario and the new `ru` scenario, so they're discoverable in `evals/README.md`'s Scenarios table and runnable by name (`./evals/run.sh glossary-artifact-language-ru`) instead of only by browsing `scenarios/`.

## 3. Non-goals

- **Not retro-translating existing artifacts.** `swift-consultants-rollout` and `design-swift-consultants` stay English — the existing precedence rule ("an existing file's language wins over the setting") already forbids this, and this feature does not touch it.
- **Not adding language-tag validation/enforcement.** The engine already accepts any tag by design; this feature adds proof + documentation for one specific tag, not a new allowlist mechanism.
- **Not registering the pipeline's 5 pre-existing `*-ios-consultant` eval scenarios** (`design`/`implement`/`plan-tests`/`review`/`sequences`) that are also missing from `evals/README.md`'s table — that gap predates this feature and is a separate cleanup.
- **Not fixing the bare `./evals/run.sh` (no arguments) run.** Those same 5 `*-ios-consultant` folders have no `fixture/` directory, so a no-argument run already fails on them before this feature — a pre-existing, separate bug. §2 goal 4 / AC-08's "discoverable" means listed in `evals/README.md`'s Scenarios table and runnable by name, not that the bare all-scenarios command succeeds.
- **Not changing the prose-switches/structure-stays-English semantics** of `artifact_language` itself — that rule is unchanged; this feature only validates and adopts it for `ru`.
- **Not proving the structure-stays-English invariant for verdict literals, tracker states, or Mermaid keywords under `ru`.** This feature's only eval scenario writes a `CONTEXT.md` glossary entry, which contains none of those tokens — it proves the invariant only for section headings and frontmatter. Extending the proof to `design`/`sequences`/`tasks`/`review` under `ru` is separate, future work.

## 4. User stories

### US-01: Confirm ru produces Russian docs
**As a** Pipeline operator
**I want** an automated check that `artifact_language: ru` yields Russian-language prose with English structure
**So that** I can trust the setting before depending on it for real feature work

### US-02: Discover ru as an example option
**As a** Pipeline operator
**I want** the settings documentation to name `ru` explicitly alongside `en`/`uk`
**So that** I don't have to infer from a parenthetical "(any language tag)" that Russian is safe to use

### US-03: Switch this repo's default to Russian
**As a** Fork maintainer
**I want** this repo's own `.claude/sdd.local.md` to default new pipeline documents to Russian prose
**So that** future dogfooding runs of `specify`/`design`/etc. in this repo produce Russian-language artifacts without a manual per-run override

### US-04: See eval coverage listed
**As a** Fork maintainer
**I want** both the `uk` and `ru` eval scenarios listed in `evals/README.md`'s scenario table
**So that** anyone running `./evals/run.sh` can discover and run the language-coverage checks without spelunking the `scenarios/` folder

### US-05: Trust structure stays English
**As a** Pipeline operator
**I want** the `ru` eval to confirm section headings, frontmatter, and verdict literals stay English even when prose is Russian
**So that** downstream automation (dashboard state derivation, tracker parsing) keeps working unchanged

## 5. Acceptance criteria

### AC-01 (US-01) — happy path
**Given** a Pipeline operator has set `artifact_language: ru` in `.claude/sdd.local.md` for a feature slug with no prior artifacts
**When** the operator runs an artifact-writing pipeline stage for that slug
**Then** the system writes the new artifact with Russian-language prose while every heading, frontmatter key/value, and machine token stays English exactly as the template defines it — the eval's rubric checks a marker specific to Russian, not merely "the text is Cyrillic" (e.g. a letter that exists in Russian but not Ukrainian, such as «ы»/«э»/«ъ», or a grammatical construction invalid in Ukrainian), since Ukrainian prose would also pass a plain-Cyrillic check

### AC-02 (US-01) — error handling
**Given** a Pipeline operator's `.claude/sdd.local.md` is malformed while attempting to set `artifact_language: ru`
**When** they next run a pipeline stage
**Then** they see a warning and the stage proceeds, producing an English-language artifact — not a crash and not a partially-translated, mixed-language artifact

### AC-03 (US-05) — domain invariant
**Given** `artifact_language` is set to `ru`
**When** the `glossary` pipeline stage writes a `CONTEXT.md` entry in Russian
**Then** the section heading (`## Glossary`) and any frontmatter keys/values stay in English exactly as authored in the template — the "structure stays English" invariant holds for the tokens this eval actually observes; verdict literals, tracker states, and Mermaid keywords are proven for `ru` by future work on the stages that produce them (see §3 non-goals)

### AC-04 (US-03) — authorization / scope boundary
**Given** a Fork maintainer sets `artifact_language: ru` in their own local, git-ignored `.claude/sdd.local.md`
**When** another developer clones or already has this repo and runs a pipeline stage in their own session
**Then** that developer's pipeline session does not inherit the Russian default — each developer keeps their own configured language (or the documented default) until they opt in themselves, because `.claude/*.local.md` is git-ignored and never leaves the maintainer's machine

### AC-05 (US-01) — cross-context
**Given** a feature folder already holds artifacts written in English from before the repo's `artifact_language` switched to `ru`
**When** a pipeline stage writes a new artifact into that same feature folder after the switch
**Then** the new artifact matches the folder's established English, not the newly configured `ru` default — the per-feature-folder precedence rule overrides the global setting

### AC-06 (US-02) — happy path
**Given** a Pipeline operator opens the settings documentation to check what's supported
**When** they scan `skills/implement/references/settings.md`'s allowed-values examples — both its "What each key does" prose bullet AND its auto-create YAML frontmatter template comment (the block copied verbatim into every new project's `.claude/sdd.local.md` on first bootstrap) — or the repo's `README.md`, or their own repo's `.claude/sdd.local.md`
**Then** they find `ru` listed explicitly alongside `en` and `uk` in all of those spots, with the "any other language tag also works" note preserved for languages beyond the three examples, and the cross-referenced `artifact-language.md` confirms `ru` is one of the eval-validated tags

### AC-07 (US-03) — happy path
**Given** the repo's `.claude/sdd.local.md` currently sets `artifact_language: en`
**When** this feature is applied
**Then** the file's `artifact_language` value is `ru`, so the next pipeline stage run in this repo defaults to Russian prose without further operator action — this is a local, git-ignored edit on the Fork maintainer's own machine, never committed or pushed

### AC-08 (US-04) — happy path
**Given** `evals/README.md`'s Scenarios table
**When** a Fork maintainer looks for language-coverage scenarios
**Then** both `glossary-artifact-language-uk` and `glossary-artifact-language-ru` rows appear, each with a one-line description of what it proves

## 6. Non-functional requirements

This feature ships no runtime service — there is no latency/throughput surface. The NFR table below is adapted to what's actually observable for a docs+eval change:

| Aspect | Target | Measurement |
|---|---|---|
| `ru` eval verified | PASS verdict on a verified run (the harness itself is documented non-deterministic — no repeat-stability claim) | `./evals/run.sh glossary-artifact-language-ru` |
| No regression to existing `uk` coverage | `uk` eval still PASSes after doc/README edits | `./evals/run.sh glossary-artifact-language-uk` |
| Doc-example coverage | `ru` named as a validated example in `settings.md` (both the auto-create YAML frontmatter template and its "What each key does" prose bullet), `README.md`'s `artifact_language` line, and this repo's `.claude/sdd.local.md`; `artifact-language.md` carries a one-line "uk/ru are eval-validated (en is the default, not covered by a dedicated eval)" note | manual read-through of the 4 files |
| Pre-existing guarantees (AC-02, AC-04, AC-05) | Malformed-settings warn-and-fallback, per-developer settings isolation, and per-feature-folder language precedence all already hold — this feature adds no new enforcement code and no new eval scenario for them | manual code inspection of the settings reader / precedence logic — not a new automated eval |

## 6.1 Security / privacy

- **Data classification:** Internal — repository developer-tooling documentation and eval fixtures; no user-facing or production data involved.
- **Personal data touched:** None.
- **AuthZ/AuthN impact:** None — no new capability or permission-check surface is introduced. AC-04 exercises the existing per-developer settings-isolation boundary (`.claude/*.local.md` is git-ignored) — a scope guarantee already in place, not a new authz check.
- **Abuse cases:**
  - Cross-developer leak: one developer's local `artifact_language` override affecting a teammate's session — denied, `.claude/*.local.md` is git-ignored (pre-existing, re-validated here).
  - Language-tag value leaking into generated artifact structure: denied — the setting "never leaks into artifacts" (existing rule), so no injection surface into headings/frontmatter.
  - Malformed settings file breaking the pipeline instead of degrading gracefully: denied — reader warns and falls back to defaults (AC-02).
- **Security review:** N/A — no new authz boundary, no PII, no user-facing surface; a documentation + eval-fixture change to an internal dev-tooling repo.

## 7. Metrics / KPIs

- **`ru` eval scenario existence + result** — baseline: 0 (scenario doesn't exist), target: `glossary-artifact-language-ru` exists and returns PASS on a verified run (retries allowed — the harness is documented non-deterministic, per §6), at feature completion.
- **Doc mentions of `ru` as a named example** — baseline: 0 explicit mentions (only the "(any language tag)" comment in `settings.md`; no mention at all in `README.md` or `artifact-language.md`), target: `settings.md` (both spots) + `README.md` + this repo's `.claude/sdd.local.md` + `artifact-language.md` all updated, at feature completion.
- **This repo's own `artifact_language` value** — baseline: `en`, target: `ru`, verified by reading `.claude/sdd.local.md`'s frontmatter on the Fork maintainer's own machine after this feature ships — this file is git-ignored (`.claude/*.local.md`) and is never committed, so the KPI is observed locally, not via a diff or PR.
- **`evals/README.md` scenario-table completeness** — baseline: 8/14 scenario folders documented in the table (`uk` and the 5 `*-ios-consultant` scenarios undocumented), target: 10/15 (the new `ru` folder raises the denominator to 15; the table gains the `uk` and `ru` rows, so 5 `*-ios-consultant` scenarios stay undocumented — out of scope per §3).

## Test plan

Фича не содержит кода в привычном смысле — `artifact_language` читается как промпт-инструкция пайплайна, а не settings-reader с юнит-тестами. Поэтому уровни тестов здесь — **e2e** (реальный прогон eval-сценария или ручной walkthrough существующего поведения пайплайна) и **unit** (текстовая проверка присутствия конкретных строк в конкретных файлах). Интеграционный/load уровни не применимы — нет БД/очереди/сервиса и нет числового NFR с пропускной способностью.

| AC | Test | Level | Notes |
|---|---|---|---|
| AC-01 (happy path) | `glossary-artifact-language-ru` eval scenario passes: written `CONTEXT.md` prose is Russian-specific (contains a Russian-only marker — «ы»/«э»/«ъ» or a construction invalid in Ukrainian), not merely Cyrillic | e2e | New eval scenario, cloned from `glossary-artifact-language-uk`'s fixture/prompt shape with a Russian-specific rubric check |
| AC-02 (error handling) | Malformed `.claude/sdd.local.md` while `artifact_language: ru` is being set → pipeline stage warns and proceeds, producing an English-language artifact (no crash, no mixed-language output) | e2e | Manual walkthrough of pre-existing warn-and-fallback behaviour — no new eval scenario, per spec §6 NFR table (existing guarantee, unchanged by this feature) |
| AC-03 (domain invariant) | Within the `glossary-artifact-language-ru` scenario run, `## Glossary` heading and frontmatter keys/values stay English verbatim while entry prose is Russian | e2e | Same eval run as AC-01 — one scenario, two assertions in its rubric.md (Russian-marker prose check + English-structure check) |
| AC-04 (authorization / scope boundary) | A Fork maintainer's local `artifact_language: ru` in `.claude/sdd.local.md` does not affect another developer's session, because `.claude/*.local.md` is git-ignored | e2e | Manual walkthrough of pre-existing gitignore-scoped settings isolation — no new eval scenario, per spec §6 NFR table (existing guarantee, unchanged by this feature) |
| AC-05 (cross-context) | A feature folder with pre-existing English artifacts keeps writing English for new artifacts in that folder even after the repo-wide setting switches to `ru` | e2e | Manual walkthrough of pre-existing per-feature-folder precedence rule — no new eval scenario, per spec §6 NFR table (existing guarantee, unchanged by this feature) |
| AC-06 (happy path — doc discoverability) | `ru` appears explicitly (alongside `en`/`uk`) in: `skills/implement/references/settings.md`'s "What each key does" bullet, its auto-create YAML frontmatter template comment, `README.md`'s `artifact_language` line, and `skills/_shared/artifact-language.md`'s validated-tags note; the "any other tag also works" caveat is preserved | unit | Text-presence assertion over the 4 named files/spots — no runtime dependency, pure string check |
| AC-07 (happy path — repo default switch) | This repo's own `.claude/sdd.local.md` `artifact_language` value reads `ru` (not `en`) after the change | unit | Text-presence assertion reading the frontmatter value directly from the (git-ignored, local) file |
| AC-08 (happy path — eval registry) | `evals/README.md`'s Scenarios table contains a row for `glossary-artifact-language-uk` and a row for `glossary-artifact-language-ru`, each with a one-line description | unit | Text-presence assertion over `evals/README.md`'s scenario table rows |

**Integration strategy:** no datastore/queue/cache is involved — nothing to spin up. The e2e rows drive the real skill (`glossary`) through `./evals/run.sh <scenario>`, which is itself the repo's existing ephemeral-fixture mechanism (a scratch `docs/features/rate-limit-bump/` folder inside the scenario's fixture, discarded after the run — no shared state to seed or clean beyond what `run.sh` already isolates per scenario). The three "pre-existing guarantee" e2e rows (AC-02/04/05) are walkthroughs against the current repo state, not automated harness runs — no fixture, no cleanup needed.

**Load:** <!-- N/A: no numeric NFR --> — this feature ships no runtime service; §6 NFRs are eval-pass/doc-completeness checks, not throughput/latency targets.

**CI placement:** the `unit` doc-presence checks and the `e2e` `glossary-artifact-language-ru` / `glossary-artifact-language-uk` eval reruns are fast enough to run on every PR touching this feature's files. The three manual walkthrough rows (AC-02/04/05) are not CI-automatable — they are pre-existing guarantees re-confirmed once during this feature's own review, not on every future PR.

## 8. Open questions

- [ ] Should other non-Latin-script language tags (beyond `ru`) get their own dedicated eval scenario, or does `ru` (alongside the existing `uk`) stand as sufficient precedent that the mechanism is tag-agnostic? Default now: `ru` is sufficient precedent, no further scenarios planned. — owner: Fork maintainer, due: revisit only if another operator requests a third language.
- [ ] This feature's own artifacts (this `spec.md`, and whatever `sad.md`/`tasks.json` follow) are being authored while the repo's `artifact_language` is still `en` — AC-07 only flips the setting once this feature ships. Per the feature-folder precedence rule (AC-05), should this feature's own downstream artifacts deliberately stay English throughout (matching their own first-written neighbour, `spec.md`) even after the switch takes effect, or does the operator want this one feature's remaining artifacts switched to Russian as a deliberate exception? Default now: stay English — the precedence rule applies to itself, avoiding a bootstrap special case. — owner: Pipeline operator, due: before `/sdd:design artifact-language-ru` is run.
