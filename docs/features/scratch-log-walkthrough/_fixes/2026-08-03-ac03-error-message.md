---
slug: scratch-log-walkthrough
date: 2026-08-03
triage: regression
acs: [AC-03]
commit: <filled after commit>
recurrence_of: none
---

# Fix: AC-03's test didn't verify the error names the invalid input

## Symptom

Reviewer's stage-2 finding on the `scratch-log-walkthrough` diff: `duration.test.ts`'s AC-03 case
called `.toThrow()` with no argument, so it never asserted the thrown error's message actually names
the invalid input — even though spec §5 AC-03 requires it. Pre-ship (feature not yet at `ship`),
affects the one test file added by this feature.

## Root cause

`server/tests/duration.test.ts:17-21` (before fix) asserted only that `formatDuration` throws, not
what it throws. `server/duration.ts:4` already interpolates the invalid value into the message
(`` `formatDuration: invalid duration ${ms}` ``), so production code was already AC-03-compliant —
the test just didn't prove it.

## The pinning test

`duration.test.ts`'s AC-03 `it` block, tightened to `expect(() => formatDuration(-5)).toThrow(/-5/)`
(and the NaN/Infinity siblings). Before the fix, this stricter assertion would have passed anyway
(the message already names the value) — there was no RED here because the **code** was never wrong,
only the test's assertion strength. Confirmed by running the tightened test: 5/5 pass immediately.

## Spec patch

none — spec was right; AC-03 re-verified (the message-naming requirement was already met by the
implementation; only the test's assertion strength needed tightening).

## Follow-ups

none.
