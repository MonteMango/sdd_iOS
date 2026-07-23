---
status: Accepted
owner: "Vitalii Lytvynov"
reviewers: []
updated_at: "2026-07-23"
feature_size: "S"
ticket: "N/A"
---

# 0001 — Define the pipeline-log section format and accumulation algorithm once, in a shared reference file

- **Status:** Accepted
- **Date:** 2026-07-23
- **Deciders:** Vitalii Lytvynov (Architect), during the `design` Socratic walk

## Context

`pipeline-log.md` gets a section written or replaced by seven different skill files (`specify`,
`design`, `tasks`, `implement`, `review`, `ship`, plus `fix` on any feature it touches). Every one of
those sections shares the exact same shape (spec §5 AC-01/AC-01b): agent count, sub-agent tokens
(labeled partial), agent-time duration (labeled not-wall-clock), free prose. On a re-run of the same
stage (AC-03), the section must be replaced in place with the **cumulative** sum across every run of
that stage — never a duplicate section, never a reset to the latest run's numbers alone. This decision
fixes where that format + algorithm is defined, before any of the seven skill files are touched.

## Decision drivers

- Spec §8 open question 2 explicitly defers this exact call to `design`: "should the fixed-format
  summary-line syntax live as one small shared template all stage files reference, or be copy-defined
  per stage file?"
- AC-03's cumulative-replace rule must be byte-identical across all seven call sites, or the log's
  accuracy NFR (§6: "duplicate-section rate 0%") silently drifts as each file's copy diverges.
- The repo already has a load-bearing precedent for this exact shape: `skills/_shared/handoff.md` —
  one canonical format, each skill keeps a one-line pointer + its own delta (`architecture-map.md`
  §Conventions: "Handoff: every stage ends with a 3-part block ... `skills/_shared/handoff.md`").

## Considered options

1. **Shared reference file** (`skills/_shared/pipeline-log.md`) — the section format, the "find the H3
   by exact heading match and replace it" rule, and the cumulative-accumulation algorithm are defined
   once; each of the seven skill files' final protocol step adds one line pointing to it, mirroring
   how they already point to `handoff.md`.
2. **Copy-defined per skill file** — each of the seven skill files inlines its own description of the
   format and the accumulation algorithm in its own final protocol step.

## Decision outcome

**Chosen:** Option 1 (shared reference file). The repo's own `skills/_shared/` directory exists
precisely for this class of cross-cutting rule (13 shared protocols already, per
`architecture-map.md`), and the identical-format requirement across seven call sites is exactly the
case DRY protects against — a stage-specific copy of the accumulation algorithm is one edit away from
silently diverging (e.g. one file forgetting to sum instead of overwrite on re-run), which directly
threatens the §6 "duplicate-section rate 0%" and "rollup accuracy" NFRs.

## Consequences

**Positive**
- One place to fix a format bug or extend the section (e.g. a future field) instead of seven.
- Matches the existing `handoff.md` precedent exactly — no new pattern for a maintainer to learn.
- The blast-radius of a future format change stays contained to one file + its N pointer edits, not N
  independent algorithm edits.

**Negative**
- Adds one more file to `skills/_shared/` (now 14) — a small extra indirection for a reader who wants
  to see a skill's full behavior in one file (mitigated: `handoff.md` already trains that expectation).

**Neutral**
- Consolidating a duplicated-per-file version into a shared file later (had we chosen Option 2) would
  have been a mechanical, same-day refactor — this was a borderline-irreversible criterion, not a hard
  one; the deciding weight was the multi-module fan-out (7 files) plus the real DRY-vs-locality
  trade-off, not rework cost.

## Links

- Spec: [[../spec.md]] — §8 open question 2, AC-01, AC-01b, AC-03
- SAD: [[../sad.md]] §5, §8
- Related ADR: [[0002-mode-aware-usage-capture]] (implement's capture logic is itself hosted inside
  this shared template as a mode-specific branch)
