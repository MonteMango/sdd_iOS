---
id: T13
title: "Verify plan-tests fixtures (AC-01, AC-09, AC-10)"
layer: "tests"
deps: ["T7", "T11"]
acs: ["AC-01", "AC-09", "AC-10"]
files_hint: ["evals/scenarios/plan-tests-ios-consultant/"]
owner: "Fork maintainer"
estimate: "S"
status: "todo"
---

# T13 — Verify plan-tests fixtures (AC-01, AC-09, AC-10)

## Why

Closes the loop on [T7](./t7-plan-tests-wiring.md)'s inline DoD checks with a recorded, repeatable fixture run — matching the precedent's eval-scenario pattern (`design-swift-consultants` T8). Derives from [spec AC-01, AC-09, AC-10](../spec.md).

## What

Under `evals/scenarios/plan-tests-ios-consultant/`, create 3 fixture runs: (1) a feature with an AC carrying a genuine test-strategy signal (e.g. "the actor-isolated cache warmup needs its own dedicated test") — expect the testing consultant to fire and a test-matrix-altitude item to shape that AC's proposed level; (2) a feature with no test-strategy signal anywhere in §5 — expect zero consultant fires, zero bundle loads; (3) a bundle-unavailable simulation on a signalled AC — expect the fallback marker in `test-plan.md` and a completed (non-blocked) run. Record a README documenting each run's expected vs. actual outcome, mirroring the precedent's format.

## Definition of Done

- [ ] 3 fixture runs exist under `evals/scenarios/plan-tests-ios-consultant/` with a README recording AC-01/AC-09/AC-10 pass/fail per run.
- [ ] All 3 fixtures pass.

## Notes

Depends on [T7](./t7-plan-tests-wiring.md) (the wiring under test) and [T11](./t11-dod-antipatterns-closure.md) (documented behavior this fixture verifies against).
