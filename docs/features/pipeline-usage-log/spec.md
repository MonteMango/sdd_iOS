---
status: Draft
owner: "Vitalii Lytvynov"
reviewers: ["Tech Lead"]
updated_at: "2026-07-23"
feature_size: "S"
---

# Spec — pipeline-usage-log

> **Glossary:** [CONTEXT](./CONTEXT.md)
> **Reference module / docs / channels used:** None — only the interview + CONTEXT + the idea source (`pipeline-usage-log.md`).

## 1. Context

Today, once a feature has moved through several SDD pipeline stages, the pipeline operator has no durable way to see which sub-agents ran at each stage, what approach or mode a stage used, or roughly how expensive each phase was — the only evidence is scrollback in a terminal session that may already be closed. Sub-agent token usage is technically observable (an `Agent`-tool dispatch's completion carries a `<usage>` block with `subagent_tokens`/`tool_uses`/`duration_ms`), but nothing today persists it: the SDD dashboard only broadcasts live state over a socket and keeps nothing on disk, and no existing skill or agent file writes a usage record anywhere.

This has become worth fixing now because features are increasingly passing through several sub-agent-heavy stages in one run (ideation fan-out in `specify`, consultant dispatches in `design`, team/workflow fan-out in `implement`), and the pipeline operator currently has no way to look back at a shipped feature and answer "which agents ran, how, and roughly what did it cost" without reconstructing it from memory.

The committed approach: one markdown artifact per feature, `docs/features/{slug}/pipeline-log.md`, created lazily by whichever backbone stage runs first and appended to by every backbone stage (`specify`, `design`, `tasks`, `implement`, `review`, `ship`) plus `fix` when it touches an already-shipped feature. Each stage owns exactly one section carrying a fixed-format summary line (agent count, sub-agent tokens explicitly labeled as excluding orchestrator overhead, agent-time duration explicitly labeled as not wall-clock) plus free prose describing its approach/mode; `ship` computes a rollup from the sections present, and a later `fix` refreshes that same rollup rather than leaving it stale.

Traceability: grounded in the three verified facts recorded in the idea source (`pipeline-usage-log.md` §2) — sub-agent usage is observable per-dispatch, the orchestrator's own spend is not observable to any skill, and no persistence mechanism exists today. The question of *how* each SDD skill file is edited to add this behavior (the SDD fork already exists and is out of scope for this spec — see Non-goals) is left entirely to `design`/`tasks`.

## 2. Goals

- Give the pipeline operator a single, per-feature file that shows agent usage, approach, and a cost signal for every backbone stage, without reconstructing it from terminal scrollback.
- Keep every reported number honestly scoped (sub-agent-only tokens, agent-time not wall-clock duration) so it can never be silently misread as the feature's total cost.
- Keep the record accurate through the messy realities of real usage — stage retries/loop-backs, mid-pipeline entry, and post-ship fixes — without duplicate sections or a stale rollup.

## 3. Non-goals

- Cross-feature aggregation or a portfolio-wide cost dashboard — out of scope this round; the artifact is markdown-only, per-feature, with no machine-readable companion (an explicit interview decision — can be revisited later, see §8).
- Capturing the orchestrator's own (main-session) token spend — not observable to a skill's own instructions today; only sub-agent dispatch tokens are captured, and always labeled as partial.
- Logging for optional, route-dependent stages (`clarify`, `sequences`, `data-model`, `api`, `plan-tests`) — this iteration covers only the never-skippable backbone stages plus `fix`; an optional stage that does run is not required to write a section.
- Live/real-time monitoring — the log is written after each stage completes, not a live view; that space is already covered by the separate, explicitly read-only, non-persistent SDD dashboard.

## 4. User stories

### US-01: Per-stage usage section

**As a** Pipeline operator
**I want** each backbone stage to append its own usage section when it finishes
**So that** I can see, stage by stage, which agents ran and how, without digging through scrollback

### US-02: One rollup number at ship

**As a** Pipeline operator
**I want** a single rollup total written once a feature reaches `ship`
**So that** I get one trustworthy figure for the whole feature's agent/token footprint without manually adding up sections

### US-03: Honest token caveat

**As a** Pipeline operator
**I want** every token figure to be clearly labeled as sub-agent-only
**So that** I never mistake a partial number for the feature's total cost

### US-04: No duplicate section on retry

**As a** Pipeline operator
**I want** a backbone stage that re-runs on the same feature (e.g. a review loop-back that re-invokes `implement`) to update its own section instead of adding another one
**So that** repeated cycles never inflate the reported totals

### US-05: No orphaned features

**As a** Pipeline operator
**I want** any stage invoked on a feature that has no log file yet to create one
**So that** a feature entered mid-pipeline, or fixed long after this feature's rollout, still gets a trace instead of silently having none

### US-06: Post-ship rollup stays current

**As a** Pipeline operator
**I want** a `fix` on an already-shipped feature to refresh the rollup, not just add a section below it
**So that** the total I read always reflects every recorded stage, not only the ones that existed at ship time

### US-07: Truthful gaps over false zeros

**As a** Pipeline operator
**I want** a stage whose sub-agent usage data didn't come back to say so plainly
**So that** I never mistake missing data for zero cost

### US-08: Rollup ownership boundary

**As a** Pipeline operator
**I want** only `ship` and a post-ship `fix` to ever write the rollup section
**So that** no other stage can silently overwrite the one number meant to summarize everything

## 5. Acceptance criteria

### AC-01 (US-01) — happy path

**Given** a pipeline operator completes a backbone stage that dispatched one or more sub-agents for a feature
**When** that stage finishes
**Then** `pipeline-log.md` shows a section for that stage containing the agent count, the approach/mode used, the sub-agent token total explicitly labeled as excluding orchestrator overhead, and a duration figure explicitly labeled as agent-time rather than wall-clock time

### AC-02 (US-05) — happy path

**Given** a stage runs on a feature whose feature folder has no pipeline usage log yet (entered directly at a later stage, or predating this feature's rollout)
**When** that stage finishes
**Then** the stage creates the log with its own section, rather than skipping the log or failing

### AC-03 (US-04) — domain invariant

**Given** a backbone stage already has a section for a feature from an earlier run (a review loop-back re-invokes `implement`, or `tasks` is re-run after a scope change)
**When** that same stage is invoked again and finishes
**Then** the system replaces that stage's existing section in place — the log never carries two sections for the same stage on the same feature

### AC-04 (US-07) — error

**Given** a sub-agent dispatch inside a stage's run fails to return its usage data
**When** that stage writes its section
**Then** the section marks that dispatch's tokens as unavailable in plain language, rather than showing a false zero or omitting the dispatch entirely

### AC-05 (US-08) — authorization (ownership-boundary analog)

**Given** a stage is neither `ship` nor a post-ship `fix`
**When** that stage writes to the log
**Then** it only ever creates or updates its own stage section and never rewrites the rollup section

### AC-06 (US-02) — happy path

**Given** a feature reaches `ship` with one or more stage sections already present
**When** `ship` completes
**Then** the log gains a rollup totaling the agent count and sub-agent tokens across all present sections, with duration reported as a summed agent-time total explicitly labeled as not wall-clock

### AC-07 (US-06) — cross-context

**Given** a shipped feature's log already has a rollup section
**When** a later `fix` adds its own section for that feature
**Then** the `fix` also refreshes the rollup so its totals include the fix's own section, and the rollup no longer reflects only what existed at ship time

### AC-08 (US-03) — domain invariant

**Given** any section or the rollup reports a token figure
**When** that figure is written
**Then** it always carries an explicit label distinguishing sub-agent-only tokens from total cost, so it can never be read as the whole bill

## 6. Non-functional requirements

| Aspect | Target | Measurement |
|---|---|---|
| Section coverage | 100% of backbone-stage completions produce or update a section | manual audit across the first 5 features run post-rollout |
| Rollup accuracy | rollup total exactly equals the sum of all present sections' figures at write time | recompute-and-diff check performed by `ship`/`fix` each time either writes the rollup |
| Duplicate-section rate | 0% — no stage ever has more than one section for the same feature | manual audit across the first 5 features run post-rollout |
| Token-caveat presence | 100% of token figures (per-section and rollup) carry the sub-agent-only label | manual audit at `specify`'s critic pass and spot-checked in `review` |
| Duration-caveat presence | 100% of duration figures (per-section and rollup) carry the agent-time/not-wall-clock label | manual audit at `specify`'s critic pass and spot-checked in `review` |

## 6.1 Security / privacy

- **Data classification:** internal — the log records engineering-process metadata about this repo's own pipeline usage (agent counts, approach names, token/duration figures); no end-user or customer data.
- **Personal data touched:** none.
- **AuthZ/AuthN impact:** none — no new user-facing permission boundary is introduced. AC-05 is a section-ownership analog (only `ship`/`fix` may write the rollup), not a security control.
- **Abuse cases:**
  - A stage's section claims another stage's own sub-agent dispatch tokens (mis-attribution): denied by AC-05's ownership boundary — a stage only ever writes its own section.
  - Repeated stage re-runs silently inflating the reported total: mitigated by AC-03 (update in place, never duplicate).
  - A crash or early exit before a stage's append step leaves that stage's section silently missing: accepted, documented limitation — this shows up as a visible gap against the §6 coverage target, never as a fabricated entry.
  - A stage that fans out multiple sub-agents concurrently and merges their work back into the feature's shared state could, in principle, race on the log file: accepted, documented limitation — the pipeline's existing single-coordinator write pattern for parallel runs already narrows this to a low-probability edge case, and this feature does not add its own concurrency-control mechanism on top of it.
  - Every figure in the log is self-reported by the stage that wrote it, with no independent reconciliation against actual usage: accepted, documented limitation — a future SDD change that stops a stage from appending correctly would drift the log silently, and nothing in this feature detects that drift.
- **Security review:** N/A — internal dev tooling, no PII, no new authorization boundary.

## 7. Metrics / KPIs

- **Manual reconstruction eliminated** — baseline: 100% of features today require scrolling back through terminal history to see per-stage agent usage, target: 0% within the first 3 features shipped after rollout.
- **Rollup trustworthiness** — baseline: N/A (the artifact doesn't exist today), target: the rollup total matches an independent manual sum of the log's own sections on 100% of the first 5 features audited.
- **Section coverage** — baseline: 0% (no feature has this file today), target: 100% of backbone-stage completions across the first 5 features produce or update a section, within the same window.

## 8. Open questions

- [ ] Should a future iteration extend the section contract to optional stages (`clarify`, `sequences`, `data-model`, `api`, `plan-tests`) when they do run? Default now: out of scope (§3 non-goal). — owner: Vitalii, due: after the MVP proves out on a few real features
- [ ] Should the exact fixed-format summary-line syntax (field order, delimiters) live as one small shared template all stage files reference, or be copy-defined per stage file? Default now: `design` decides as part of the section contract. — owner: Vitalii, due: before `design` finalizes its artifact
- [ ] Should a `fix`-triggered rollup refresh also note which fix caused it (traceability), or only the refreshed totals? Default now: totals only, keep it lightweight for an S-sized feature. — owner: Vitalii, due: before `tasks` breaks this down
