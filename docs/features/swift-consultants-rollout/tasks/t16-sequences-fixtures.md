---
id: T16
title: "Verify sequences fixtures (AC-08, AC-09, AC-10)"
layer: "tests"
deps: ["T10", "T11"]
acs: ["AC-08", "AC-09", "AC-10"]
files_hint: ["evals/scenarios/sequences-ios-consultant/"]
owner: "Fork maintainer"
estimate: "S"
status: "todo"
---

# T16 — Verify sequences fixtures (AC-08, AC-09, AC-10)

## Why

Closes the loop on [T10](./t10-sequences-wiring.md)'s inline DoD checks with a recorded fixture run — matching the precedent's eval-scenario pattern. Derives from [spec AC-08, AC-09, AC-10](../spec.md).

## What

Under `evals/scenarios/sequences-ios-consultant/`, create 3 fixture runs: (1) a feature already run through `design` (so a concurrency brief was already spent there) whose `sequences` pass draws a flow with a suspend point/actor hop — expect a **fresh** consultant spawn, not the reused `design` brief, and flow-specific detail in the drawn flow (AC-08); (2) a feature whose flows are all sync — expect zero consultant fires (AC-09); (3) a fixture consultant brief item at code altitude — expect it denied entry, left for `implement`/`review` (AC-10). Record a README per the precedent's format.

## Definition of Done

- [ ] 3 fixture runs exist under `evals/scenarios/sequences-ios-consultant/` with a README recording AC-08/AC-09/AC-10 pass/fail per run.
- [ ] All 3 fixtures pass, and fixture (1) demonstrably shows two distinct consultant calls (one at `design`, one fresh at `sequences`), not a reused brief.

## Notes

Depends on [T10](./t10-sequences-wiring.md) and [T11](./t11-dod-antipatterns-closure.md).
