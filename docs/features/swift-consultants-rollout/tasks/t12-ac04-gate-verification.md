---
id: T12
title: "Verify AC-04 — plugin-validation roster invariant, all 5 stages"
layer: "tests"
deps: ["T3", "T11"]
acs: ["AC-04"]
files_hint: ["scripts/validate_plugin.py", "agents/", "skills/design/SKILL.md", "skills/implement/SKILL.md", "skills/plan-tests/SKILL.md", "skills/review/SKILL.md", "skills/sequences/SKILL.md"]
owner: "Fork maintainer"
estimate: "S"
status: "todo"
---

# T12 — Verify AC-04 — plugin-validation roster invariant, all 5 stages

## Why

AC-04's domain invariant: the 3 consultant files must never be added to any of the 5 stages' `agents:` frontmatter, or the deterministic plugin-validation gate must block and name the invariant. Matches the precedent (`design-swift-consultants` T7) extended to 5 stages instead of 1. Derives from [spec AC-04](../spec.md), [sad §2 Constraints](../sad.md), [ADR-0003](../adr/0003-dedicated-consultant-agent-files.md).

## What

Run `scripts/validate_plugin.py` on the finished wiring — confirm it exits 0, and confirm `agents:` frontmatter across `design/SKILL.md`, `implement/SKILL.md`, `plan-tests/SKILL.md`, `review/SKILL.md`, `sequences/SKILL.md` is unchanged from pre-rollout (`design`: `[explorer, critic]`; `implement`: `[test-author, implementer, reviewer]`; `review`: `[reviewer]`; `plan-tests`/`sequences`: whatever they carried before — this feature adds zero new roster entries anywhere). Then demonstrate the negative: temporarily add one of the 3 consultant names to one stage's `agents:` list, confirm `validate_plugin.py` fails and names the invariant, then revert the temporary edit.

## Definition of Done

- [ ] `scripts/validate_plugin.py` exits 0 on the finished wiring.
- [ ] `agents:` frontmatter is byte-identical to pre-rollout across all 5 `SKILL.md` files (diff shows zero changes to those lines).
- [ ] A throwaway roster violation (one consultant name added to one stage's `agents:` list) makes the gate fail with a message naming the invariant; the throwaway edit is reverted before this task's commit.

## Notes

Blocks nothing downstream by itself — this is the safety-net check for the whole rollout's most load-bearing constraint (spec §2 Constraints, sad §11 top merge-surface risk).
