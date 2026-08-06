---
id: T3
title: "Name ru in README.md's artifact_language line"
layer: "docs"
deps: []
acs: ["AC-06"]
files_hint: ["README.md"]
owner: "Fork maintainer"
estimate: "S"
status: "todo"
---

# T3 — Name ru in README.md's artifact_language line

## Why

Derives from [spec §5 AC-06](../spec.md) — `README.md` is the other file that enumerates
`en`/`uk` today (line 367) and must name `ru` explicitly.

## What

Edit `README.md`'s `artifact_language: en # en | uk — the language pipeline documents are written
in (headings + machine tokens stay English)` line to include `ru`.

## Definition of Done

- [ ] `README.md`'s `artifact_language` line lists `en | uk | ru` (any tag).

## Notes

Pure prose/doc edit. Can run in parallel with T2/T4/T8.
