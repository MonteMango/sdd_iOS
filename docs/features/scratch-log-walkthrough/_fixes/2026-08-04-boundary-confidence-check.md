---
slug: scratch-log-walkthrough
date: 2026-08-04
triage: gap
acs: [AC-02, AC-06]
commit: <filled after commit>
recurrence_of: none
---

# Fix: add a second seconds-branch data point past the ms/s boundary

## Symptom

Post-ship follow-up: the only seconds-branch coverage besides the exact `1000ms` boundary (AC-06)
was `1234ms` (AC-02) — no test point comfortably past the boundary to catch a future off-by-one in
the rounding/branch logic. Feature has already shipped.

## Root cause

Not a code defect — a test-coverage gap noticed after `ship`. `server/duration.ts`'s branch at
`ms < 1000` was already correct; the test suite simply lacked a second, unambiguous seconds-branch
point.

## The pinning test

`duration.test.ts`'s new case: `expect(formatDuration(1500)).toBe('1.5s')`. Passed immediately
(6/6 in the file) — confirms the existing implementation, doesn't change behavior.

## Spec patch

new AC appended is unnecessary — AC-02/AC-06 already cover this branch; this strengthens their test
evidence rather than adding scope. Triage recorded as **gap** in the loose sense of "test coverage
gap", not a missing acceptance criterion — spec.md is unchanged.

## Follow-ups

none.

---

**Dispatch note (T10 AC-04 verification):** this fix's triage step deliberately **simulated** a
sub-agent dispatch whose usage did not return (per `pipeline-usage-log/spec.md`'s own Test plan row
for AC-04: "Force or simulate one sub-agent dispatch failing to return usage data") — no second
`explorer` dispatch was actually made (the file:line was already known from the pre-ship fix), so the
`### Fix` section below records that dispatch's tokens as **unavailable**, by deliberate construction,
to exercise the AC-04 marker and the AC-06b rollup-exclusion path for real. This is noted here so the
simulation is never mistaken for an actual dispatch failure.
