# Pipeline usage log — the per-feature agent/token trace (`docs/features/<slug>/pipeline-log.md`)

> **Reference-only.** Not a skill. Every backbone stage (`specify`, `design`, `tasks`, `implement`,
> `review`, `ship`) — plus `fix` on any feature it touches — ends its final protocol step by
> writing or replacing **its own** section here, in the same commit as its own primary artifact
> (no separate commit). This exists because sub-agent usage is technically observable per dispatch,
> but nothing before this persisted it — the only trace was terminal scrollback that may already be
> closed. `ship` (and a **post-ship** `fix`) additionally compute a rollup from the sections present.
> Mermaid check: N/A — this file defines no diagram.

## TL;DR (короткий вступ українською)

Кожна backbone-стадія (+ `fix`) наприкінці свого протоколу пише або замінює **власну** H3-секцію у
`docs/features/<slug>/pipeline-log.md`: кількість дispatch-ів `Agent`-тула, підхід/режим прозою,
сумарні sub-agent-токени (мітка «частковий рахунок, без orchestrator») і сумарну agent-time
тривалість (мітка «не wall-clock»). Якщо секція цієї стадії вже існує (повторний запуск) —
замінюється **весь блок** за точним заголовком, а цифри стають **кумулятивною сумою** попереднього
запуску + поточного, ніколи лише останнім запуском. Тільки `ship` і **post-ship** `fix` (коли rollup
вже існує) рахують і пишуть підсумкову секцію `### Rollup`; будь-яка інша стадія і **pre-ship** `fix`
торкаються лише своєї секції. Дані, які не повернулись від dispatch-а, позначаються явним текстом
«unavailable», ніколи фальшивим нулем.

## The section format (every stage)

Each stage's section is one H3 block:

```md
### <Stage>

- **Agent count:** <N> (Agent-tool dispatches, not distinct agent types)
- **Approach/mode:** <one-line prose — e.g. "sequential single-agent TDD", "clean-context critic + AskUserQuestion resolution", "dynamic Workflow, 3-way fan-out">
- **Sub-agent tokens:** <N> tokens (sub-agent-only — excludes orchestrator/main-session overhead)
- **Duration:** <N>s (agent-time — summed per-dispatch duration, not wall-clock)
```

`<Stage>` is the exact stage name as it appears in this table — `Specify`, `Design`, `Tasks`,
`Implement`, `Review`, `Ship`, `Fix`. This exact string is what "exact-heading match" (below) matches
on, so never rename it between runs.

**Zero-dispatch stages still write a section (AC-01b).** A stage that made no `Agent`-tool dispatch
this run still writes its H3 block, with `Agent count: 0` and `Sub-agent tokens: 0 tokens` — the
section is never skipped just because nothing was dispatched.

## Lazy creation (AC-02)

If `docs/features/<slug>/pipeline-log.md` doesn't exist yet when a stage reaches its final step
(the feature was entered mid-pipeline, or predates this template's rollout), the stage creates the
file with a one-line header (`# Pipeline usage log — <slug>`) followed by its own section — it never
skips the write or fails because the file is missing.

## Replace-in-place + cumulative sum (AC-03)

Before writing, search the existing `pipeline-log.md` for an H3 whose heading **exactly matches**
`### <Stage>` (case-sensitive, no fuzzy match).

- **No match (first run for this stage on this feature):** append the new section at the end of the
  file, before any existing `### Rollup` section (the rollup, if present, always stays the last
  section — insert new stage sections above it).
- **Match found (this stage already ran on this feature):** replace the **entire existing block**
  (from its `### <Stage>` heading up to — but not including — the next `###` heading or end of file)
  with a new block whose figures are the **cumulative sum**:
  - `Agent count` = prior `Agent count` + this run's dispatch count.
  - `Sub-agent tokens` = prior tokens + this run's tokens (see the unavailable-marker rule below for
    how a prior or current "unavailable" figure folds into the sum).
  - `Duration` = prior duration + this run's duration.
  - `Approach/mode` prose is **replaced**, not appended — describe the latest run's approach; if it
    differs materially from the prior run, note the change in one clause (e.g. "sequential (was: agent
    team on the prior run)").

The log never carries two sections for the same stage on the same feature — this is the invariant
`ship`'s rollup and any manual audit depend on.

## Honesty labels (AC-08)

Every token figure — per-section and in the rollup — carries the inline label **"sub-agent-only"**
(or the fuller "excludes orchestrator overhead" the first time it appears in a section) so it can
never be misread as the feature's total cost: the orchestrator's own (main-session) token spend is
not observable to any skill's own instructions and is never estimated or backfilled. Every duration
figure carries the inline label **"agent-time"** (or "not wall-clock" the first time it appears) —
it is the sum of each dispatch's own duration, not how long the stage took a human to watch run.
Never drop these labels to save space; a bare number is exactly the false reading this feature exists
to prevent.

## Unavailable-marker rule (AC-04)

When an `Agent`-tool dispatch's completion doesn't carry a usable `<usage>` block (missing, malformed,
or the dispatch errored before returning one), that dispatch's contribution to the stage's tokens
(and, if duration is also missing, its duration) is recorded as:

```
tokens: unavailable — dispatch usage not returned
```

— never a false `0`, never silently dropped from the agent count (the dispatch still counts toward
`Agent count`; only its token/duration contribution is marked unavailable). When a stage sums multiple
dispatches and at least one is unavailable, the stage's `Sub-agent tokens` / `Duration` line states the
partial sum **plus** a note of how many dispatches were excluded, e.g.:

```
- **Sub-agent tokens:** 4,200 tokens (sub-agent-only; 1 of 3 dispatches unavailable — excluded from this total)
```

On a cumulative replace (AC-03), a prior run's unavailable dispatch stays excluded from the running
sum forever (it was never a real number to add) — only the note of how many dispatches were ever
unavailable accumulates.

## Rollup ownership boundary (AC-05, AC-05b)

Only `ship`, and a `fix` invoked on a feature whose log **already has** a `### Rollup` section
(a post-ship fix), ever create or overwrite `### Rollup`. Every other stage — and a `fix` invoked
**before** the feature has a rollup (pre-ship) — only ever creates or replaces its own `### <Stage>`
section per the rules above; it never touches `### Rollup`, and a pre-ship `fix` never creates one
(that's `ship`'s job, per AC-06).

## The rollup (AC-06, AC-06b, AC-06c — written only by `ship` / post-ship `fix`)

When `ship` (or a qualifying post-ship `fix`) reaches its final step, it reads every section
currently present (each backbone stage's `### <Stage>` plus `### Fix` if present) and writes (or, on
a post-ship `fix`, overwrites) one `### Rollup` section, always the last section in the file:

```md
### Rollup

- **Total agent count:** <sum across all present sections>
- **Total sub-agent tokens:** <sum of available figures> tokens (sub-agent-only — excludes orchestrator overhead)
- **Total duration:** <sum of available figures>s (agent-time — not wall-clock)
- **Excluded from token/duration total:** <list of "<Stage>: N dispatches unavailable", or "none">
- **Backbone stages with no section:** <list of missing stage names, or "none">
```

- **Which sections count.** Sum every backbone-stage section that is present (`Specify`, `Design`,
  `Tasks`, `Implement`, `Review`, `Ship`) plus `Fix` if present. An **optional**-stage section (e.g. a
  future `clarify`/`sequences`/`data-model`/`api`/`plan-tests` section, out of this feature's scope per
  spec §3 but not forbidden from existing) is excluded from the rollup total even if present in the
  file — it stays visible, just uncounted.
- **Partial figures (AC-06b).** If one or more summed sections carries an unavailable-tokens note,
  the rollup's token/duration totals include only the available figures, and the `Excluded from
  token/duration total` bullet names which stage(s) and how many dispatches — never a total that
  *looks* complete when it isn't.
- **Missing stages (AC-06c).** If fewer than all six backbone stages have a section (the feature was
  entered mid-pipeline, or a stage hasn't run yet at ship time — e.g. an XS/S fast-lane skip), the
  `Backbone stages with no section` bullet lists them by name. The rollup never implies whole-feature
  coverage it doesn't have.
- **Post-ship `fix` refresh (AC-07).** A `fix` that finds an existing `### Rollup` recomputes it from
  scratch against every section present **after** its own section write (so its own `### Fix` section
  is included) and overwrites the old rollup wholesale — the same write rule as any other stage's
  cumulative replace, applied to the rollup's totals.
- **Recompute-and-diff self-check.** Before writing, re-sum the sections by hand and confirm the
  written total matches — this is the NFR §6 "Rollup accuracy" check; a mismatch means a section was
  missed or double-counted and must be fixed before writing.

## Mode-aware capture in `implement` (ADR-0002)

`implement` runs one of three execution modes; each exposes usage differently, so its final step
branches on **which mode actually ran this time** (not on settings — the actual runtime mode):

- **Sequential** (single-agent TDD) — sum the `<usage>` block (`subagent_tokens`, `duration_ms`) off
  every `Agent`-tool dispatch made during the run (test-author/implementer/reviewer calls, if any);
  `Agent count` = number of those dispatches.
- **Agent team** (`TeamCreate`) — sum the `<usage>` block off every team-member dispatch the same
  way, if the team runtime returns one per member; if it doesn't (unconfirmed at the time of writing,
  per SAD §11 risk), mark tokens/duration unavailable per the AC-04 rule above rather than guessing —
  `Agent count` still reflects the number of team-member tasks dispatched.
- **Dynamic Workflow** — read `budget.spent()` from the completed `Workflow` run for the token total
  (this is the one mode with a reliable aggregate figure) and the workflow's own agent-call count for
  `Agent count`; duration sums each `agent()` call's reported duration if the workflow surfaces it,
  else marks duration unavailable while still reporting the token total (a mode can be partially
  available — mark only the figure that's genuinely missing, not the whole section).

Whichever mode ran, the section's `Approach/mode` line names it explicitly (e.g. "dynamic Workflow,
4 Kahn layers" / "sequential single-agent TDD" / "agent team, 3 members") so a reader knows which
capture path produced the figures without opening `tasks.json`.

## Where each skill calls this

Every backbone stage's (+ `fix`'s) final protocol step ends with: «write/replace the **pipeline-log
section** per [`pipeline-log.md`](./pipeline-log.md), then emit the stage-handoff block per
[`handoff.md`](./handoff.md)» — the pipeline-log write happens in the same commit as the stage's own
primary artifact, immediately before the handoff block, and that handoff's *Review before continuing*
list always includes `docs/features/<slug>/pipeline-log.md`.
