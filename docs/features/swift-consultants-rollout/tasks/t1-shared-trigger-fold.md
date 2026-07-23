---
id: T1
title: "Relocate + extend consultant-trigger.md / consultant-fold.md to skills/_shared/"
layer: "infra"
deps: []
acs: ["AC-01", "AC-09", "AC-10"]
files_hint: ["skills/_shared/consultant-trigger.md", "skills/_shared/consultant-fold.md"]
owner: "Fork maintainer"
estimate: "M"
status: "todo"
---

# T1 — Relocate + extend consultant-trigger.md / consultant-fold.md to skills/_shared/

## Why

ADR-0004: five stages now share the same three-class signal taxonomy and altitude-filter/fallback-marker rules; a single `_shared/` source avoids five independently-drifting copies. Derives from [sad §4/§5](../sad.md), [ADR-0004](../adr/0004-shared-consultant-trigger-fold.md).

## What

`git mv skills/design/references/consultant-trigger.md skills/_shared/consultant-trigger.md` and the same for `consultant-fold.md`. Extend `consultant-trigger.md`: add the third signal class (test-strategy — keywords `test strategy`, `test design`, `coverage approach`, `Swift Testing`, `XCTest`, mapped to `swift-testing-expert`); add the per-stage "what text this stage runs detection against" table (`design`: spec prose; `implement`: task title+acs+dod; `plan-tests`: the AC being mapped; `review`: spec prose **and** the diff — see [T8](./t8-review-diff-signal.md); `sequences`: the flow being drafted). Bump the cap language from ≤2-per-run to ≤3-per-run (still structural — one consultant instance per class, no counter). `consultant-fold.md` content is unchanged in substance (altitude filter + project-rules-win + fallback-marker template) — only its location moves; confirm it still reads generically (no `design`-specific wording that would mislead the other four stages).

## Definition of Done

- [ ] `skills/design/references/consultant-trigger.md` and `consultant-fold.md` no longer exist; `skills/_shared/consultant-trigger.md` and `consultant-fold.md` exist with identical git history (via `git mv`).
- [ ] `consultant-trigger.md` documents 3 classes (UI / async / test-strategy), the ≤3-per-run structural cap, and the 5-row per-stage detection-text table.
- [ ] `consultant-fold.md`'s altitude filter + project-rules-win + fallback-marker template read as stage-generic (no leftover `design`-only phrasing).

## Notes

`design/SKILL.md`'s own reference links break the moment this task lands — [T3](./t3-design-retrofit.md) repoints them. Do not repoint them here; keep this task's diff scoped to the two moved/extended files.
