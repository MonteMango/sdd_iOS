---
id: T7
title: "plan-tests: swift-testing-consultant wiring at step 4"
layer: "app"
deps: ["T1", "T2"]
acs: ["AC-01", "AC-09", "AC-10"]
files_hint: ["skills/plan-tests/SKILL.md"]
owner: "Fork maintainer"
estimate: "M"
status: "todo"
---

# T7 — plan-tests: swift-testing-consultant wiring at step 4

## Why

Spec US-01/AC-01 requires the testing consultant to fire automatically while `plan-tests` builds the AC→test table, informing the level/coverage choice at test-matrix altitude only. Sad §4 seed 6: `plan-tests` adds exactly the one new consultant class (`swift-testing-expert`), never all three. Derives from [spec US-01/AC-01, US-09/AC-09, US-10/AC-10](../spec.md), [sad §4/§5/§6](../sad.md).

## What

In `skills/plan-tests/SKILL.md` step 4 (Core mapping): right after proposing each AC's default test level and before the `AskUserQuestion` that confirms it, detect a test-strategy signal in that AC's own text (per `../_shared/consultant-trigger.md`'s "the AC being mapped" detection row). On signal, consult `swift-testing-expert` scoped to that one AC, fold the brief at test-matrix altitude via `../_shared/consultant-fold.md` (admit level/coverage-shaping items — e.g. "this actor-isolated behavior warrants its own dedicated case" — deny any item naming a concrete test tool/framework, which stays `implement`'s altitude, AC-10), and let the admitted item inform the proposed default level before the user confirms it. No signal → no consult, no bundle load, no cost (AC-09). Fallback marker (spec §8 OQ default, sad §11): write it as an HTML comment adjacent to the AC's row in `test-plan.md` (or the inline `## Test plan` section for XS/S), reusing `consultant-fold.md`'s wording template, mirrored in the stage handoff.

## Definition of Done

- [ ] A fixture AC carrying a test-strategy signal shows the testing consultant firing and an admitted test-matrix-altitude item shaping that AC's row before user confirmation (AC-01).
- [ ] A fixture consultant brief item at code altitude (e.g. naming XCTest/Swift Testing explicitly) is denied entry — the row records no framework/tool name (AC-10).
- [ ] A fixture AC with no test-strategy signal shows zero consultant fires (AC-09).
- [ ] A bundle-unavailable fixture shows the HTML-comment fallback marker next to that AC's row in `test-plan.md`, and the stage does not block.

## Notes

Reuses the shared trigger/fold mechanism from [T1](./t1-shared-trigger-fold.md) and the agent file from [T2](./t2-consultant-agent-files.md) — this task is pure protocol wiring, no new mechanism.
