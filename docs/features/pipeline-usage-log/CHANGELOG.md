# Changelog — pipeline-usage-log

## pipeline-usage-log — a durable per-feature record of pipeline agent usage

**What:** Every backbone SDD stage (`specify`, `design`, `tasks`, `implement`, `review`, `ship`),
plus `fix` on any feature it touches, now writes its own section to
`docs/features/{slug}/pipeline-log.md` when it finishes — agent count, approach/mode, sub-agent
token total, and agent-time duration, with every figure explicitly labeled as sub-agent-only /
not-wall-clock so it can never be misread as the feature's whole cost. A stage with zero
dispatches still gets a section (agent count 0). A re-run stage replaces its own section in place
with the cumulative total across all its runs — never a duplicate. `ship` computes a rollup
across every present section (excluding optional-stage sections); a post-ship `fix` refreshes that
same rollup rather than leaving it stale, while a pre-ship `fix` only ever writes its own section.

**Why:** [spec.md](spec.md) §1 — a shipped feature's per-stage agent usage previously lived only
in terminal scrollback, often from a session already closed. Key decisions:
[ADR-0001](adr/0001-shared-pipeline-log-template.md) (one shared template file all stage
`SKILL.md`s reference, instead of the format being copy-defined per stage),
[ADR-0002](adr/0002-mode-aware-usage-capture.md) (mode-aware capture — `implement`'s usage
capture branches by sequential/team/workflow mode, with an honest "unavailable" marker where a
mode's usage data can't be recovered).

**How to use:** No new command — running any backbone stage (or `fix`) as usual now also appends
to `docs/features/{slug}/pipeline-log.md`, creating it if it doesn't exist yet (so a feature
entered mid-pipeline, or predating this rollout, still gets a trace from whichever stage runs
next). The rollup appears once the feature reaches `ship`, and is refreshed by any later
post-ship `fix`.

**Operational notes:**
- Migration: `<!-- none -->` — no schema, no datastore; the artifact is one markdown file per
  feature folder.
- Feature flag / config: `<!-- none -->` — always-on for any repo running this fork.
- Rollback: revert the feature's commits — no migration to unwind.

**Acceptance criteria delivered:** AC-01/AC-01b (per-stage section, including the 0-dispatch
case), AC-02 (a stage on a feature with no log yet creates one), AC-03 (a re-run stage replaces
its section in place with the cumulative total, never a duplicate), AC-04 (a dispatch whose usage
data didn't come back is marked unavailable, never a false zero), AC-05/AC-05b (only `ship` and a
post-ship `fix` ever write the rollup; a pre-ship `fix` never creates one), AC-06/AC-06b/AC-06c
(`ship`'s rollup totals the present sections, names any excluded-for-unavailable-tokens section,
and names any missing backbone stage), AC-07 (a post-ship `fix` refreshes the rollup to include
its own section), AC-08 (every token/duration figure carries its sub-agent-only /
agent-time-not-wall-clock label). All 12 AC verified live via the T10 manual walkthrough
(`docs/features/pipeline-usage-log/tasks/T10-acceptance-walkthrough.md`) on a disposable scratch
feature, deleted after — see [review-2026-08-03.md](_review/review-2026-08-03.md) (verdict: PASS)
for the one accepted, honestly-flagged gap: `implement`'s team/workflow usage-capture branch
(ADR-0002) was never exercised live since the scratch feature ran sequential mode only.
