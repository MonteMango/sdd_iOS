---
id: T15
title: "Verify review fixtures (AC-03, AC-05, AC-07, AC-09, AC-10b)"
layer: "tests"
deps: ["T9", "T11"]
acs: ["AC-03", "AC-05", "AC-07", "AC-09", "AC-10b"]
files_hint: ["evals/scenarios/review-ios-consultant/"]
owner: "Fork maintainer"
estimate: "M"
status: "todo"
---

# T15 — Verify review fixtures (AC-03, AC-05, AC-07, AC-09, AC-10b)

## Why

Closes the loop on [T9](./t9-review-preconsult-inject.md)'s inline DoD checks with a recorded fixture run — `review`'s AND-gate is the single most novel mechanism in this rollout (ADR-0005, resolving spec §8's open question) and carries the widest AC set. Derives from [spec AC-03, AC-05, AC-07, AC-09, AC-10b](../spec.md).

## What

Under `evals/scenarios/review-ios-consultant/`, create fixture runs covering: (1) a diff with UI+concurrency+test-strategy signal genuinely present in both spec and diff — expect all 3 consultants to fire and land findings at full blocking weight (AC-07); (2) a diff where spec mentions UI but the actual diff is pure backend plumbing (spec-visible true, diff-visible false) — expect zero UI consultant fire (AC-09, the AND-gate's accepted false-negative); (3) a bundle-unavailable simulation on an otherwise-firing class — expect the visible marker in the review record naming it, non-blocking (AC-03); (4) a fixture consultant brief containing a structural-altitude item — expect it denied entry as a citable finding (AC-10b). Record a README, and confirm `agents/reviewer.md` stays unedited across all 4 (AC-05).

## Definition of Done

- [ ] 4 fixture runs exist under `evals/scenarios/review-ios-consultant/` with a README recording AC-03/AC-05/AC-07/AC-09/AC-10b pass/fail per run.
- [ ] All 4 fixtures pass, and `agents/reviewer.md` is unedited in every run.

## Notes

The manual non-UI/non-async diff sample used to verify ADR-0005's ≤10% false-fire ceiling (spec §6 NFR "review trigger discrimination") is a separate, ongoing measurement (sad §10 QG-1 "How verify") — this task's fixtures are the acceptance-level behavior check, not that statistical sample.
