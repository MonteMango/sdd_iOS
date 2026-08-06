---
id: T6
title: "Flip this repo's .claude/sdd.local.md artifact_language to ru"
layer: "docs"
deps: ["T7"]
acs: ["AC-07"]
files_hint: [".claude/sdd.local.md"]
owner: "Fork maintainer"
estimate: "S"
status: "todo"
---

# T6 — Flip this repo's .claude/sdd.local.md artifact_language to ru

## Why

Derives from [spec §5 AC-07](../spec.md) — once `ru` is proven (T7), the Fork maintainer's own
dogfooding pipeline should default new SDD-generated documents to Russian prose.

## What

Edit `.claude/sdd.local.md`'s `artifact_language: en` line to `artifact_language: ru`. This is a
local, git-ignored file (`.claude/*.local.md`) — never committed or pushed; the KPI (spec §7) is
observed locally, not via a diff or PR.

## Definition of Done

- [ ] `.claude/sdd.local.md`'s `artifact_language` value reads `ru`.
- [ ] `git status` confirms the file stays untracked/ignored (no accidental commit).

## Notes

Per [spec §8 OQ-2](../spec.md): this feature's own remaining artifacts (this `tasks/` set,
`tasks.json`) stay English even after this flip — the per-feature-folder precedence rule (AC-05)
applies to itself, since `spec.md`/`sad.md` were already English.
