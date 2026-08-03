# scratch-log-walkthrough — changelog

**What:** Added `formatDuration(ms): string` to `server/` — renders a millisecond duration as a
short human string (`"340ms"` / `"1.2s"`).

**Why:** Disposable vehicle for the T10 manual acceptance walkthrough of `pipeline-usage-log`
(spec [pipeline-usage-log/spec.md](../pipeline-usage-log/spec.md)) — verifies every backbone stage's
`pipeline-log.md` section write + `ship`'s rollup end-to-end on a real run.

**Verification:** spot-checked AC-01/AC-02/AC-03/AC-06 for real (`bun -e` against `server/duration.ts`
directly) — all four matched spec; full spec §5 (AC-01..AC-06) covered by `bun test` (102/102 pass,
`tsc --noEmit` clean).

**Migration/operational note:** none — pure function, no config, no deploy step.

**Disposition:** this feature (and this file) is deleted after the T10 walkthrough closes, per
`pipeline-usage-log/spec.md`'s Test plan cleanup boundary. No PR was opened and no roadmap entry was
added — it was never intended to merge.
