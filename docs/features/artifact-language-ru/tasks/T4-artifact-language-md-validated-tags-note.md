---
id: T4
title: "Add eval-validated tags note to artifact-language.md"
layer: "docs"
deps: []
acs: ["AC-06"]
files_hint: ["skills/_shared/artifact-language.md"]
owner: "Fork maintainer"
estimate: "S"
status: "todo"
---

# T4 — Add eval-validated tags note to artifact-language.md

## Why

Derives from [spec §5 AC-06](../spec.md) and [spec §6 NFR](../spec.md) — `artifact-language.md`
today names no tags at all (only "default `en`"); the cross-referenced doc needs to confirm which
tags are eval-validated so a reader checking AC-06's four locations finds a consistent answer.

## What

Add a one-line note to `skills/_shared/artifact-language.md` (near the top, where the rule intro
mentions `default en`): "uk/ru are eval-validated (en is the default, not covered by a dedicated
eval)".

## Definition of Done

- [ ] `skills/_shared/artifact-language.md` carries the one-line eval-validated-tags note.
- [ ] The rest of the file's "never translate" / precedence content is untouched.

## Notes

Pure doc addition — no change to the never-translate token list or precedence rules. Can run in
parallel with T2/T3/T8.
