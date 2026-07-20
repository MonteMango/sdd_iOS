---
id: T3
title: "Add step 3.5 — guaranteed concurrent consultant spawn"
layer: "app"
deps: ["T1"]
acs: ["AC-01", "AC-04", "AC-06"]
files_hint: ["skills/design/SKILL.md"]
owner: "Fork maintainer"
estimate: "M"
status: "todo"
---

# T3 — Add step 3.5 — guaranteed concurrent consultant spawn

## Why

Derives from [spec §5 AC-01, AC-04, AC-06](../spec.md), [sad §4 decision 1 (ADR-0001) + decision 3 (ADR-0003)](../sad.md), [sad §6 Critical flow 1 + Critical flow 3](../sad.md), [ADR-0001](../adr/0001-guaranteed-fire-consultant-spawn.md), [ADR-0003](../adr/0003-consultant-outside-restricted-roster.md).

## What

Edit `skills/design/SKILL.md` Protocol section: insert a new numbered **step 3.5** immediately after the existing step 3 (Explore subagent), so it reads and runs *concurrently* with it, not sequentially. The step:

- reads the trigger rule from [`./references/consultant-trigger.md`](../../../../skills/design/references/consultant-trigger.md) (written in T1) against `spec.md`'s prose;
- on a UI-class and/or async-class signal, spawns the matching consultant(s) (≤2) as a **prose-described** disposable sub-agent invocation (a plain `Agent`/Task call loading the relevant third-party expert skill bundle) — explicitly **not** added to the `agents:` frontmatter list and **not** a new file under `agents/` (AC-04, ADR-0003 — the roster stays `[explorer, critic]`);
- passes the feature spec + the consuming project's rules (`CLAUDE.md` + any SwiftUI-rules file) into the consultant's prompt;
- on no signal, the step is a no-op — no spawn, no cost (AC-06);
- notes this is a fixed, non-skippable protocol step (the guaranteed-fire boundary) while the consultant's own reasoning stays model-driven (the honest determinism boundary, ADR-0001).

Keep the `agents: [explorer, critic]` frontmatter at the top of `SKILL.md` **unchanged** — this is the load-bearing invariant T7 verifies.

## Definition of Done

- [ ] `SKILL.md` Protocol has a new step 3.5, referencing `./references/consultant-trigger.md`, describing the concurrent spawn with step 3.
- [ ] The consultant spawn is described entirely in prose (an inline Agent/Task call), never added to `agents:` frontmatter or `agents/*.md`.
- [ ] The ≤2-per-run cap and the pure-logic no-op case (AC-06) are both stated in the step text.
- [ ] `python3 scripts/validate_plugin.py` still passes after the edit (frontmatter `agents:` unchanged).

## Notes

Shares `skills/design/SKILL.md` with T4, T5, T6 — `implement` serializes these into one lane via the overlapping `files_hint`. Depends on T1 for the trigger-rule link target to exist.
