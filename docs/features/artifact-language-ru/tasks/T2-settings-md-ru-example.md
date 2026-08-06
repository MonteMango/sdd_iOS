---
id: T2
title: "Name ru in settings.md's allowed-values examples"
layer: "docs"
deps: []
acs: ["AC-06"]
files_hint: ["skills/implement/references/settings.md"]
owner: "Fork maintainer"
estimate: "S"
status: "todo"
---

# T2 — Name ru in settings.md's allowed-values examples

## Why

Derives from [spec §5 AC-06](../spec.md) — `settings.md` is one of the two files that actually
enumerate `en`/`uk` today and must name `ru` explicitly so it's discoverable, not implied by
"(any language tag)".

## What

Edit `skills/implement/references/settings.md` in both spots:
- The auto-create YAML frontmatter template comment (the block copied verbatim into every new
  project's `.claude/sdd.local.md` on first bootstrap): `artifact_language: en # en | uk (any
  language tag) …` → add `ru`.
- The "What each key does" `artifact_language` prose bullet: `en | uk` (any tag; default `en`) →
  add `ru`.

Preserve the "any other language tag also works" note in both spots.

## Definition of Done

- [ ] Both the YAML template comment and the prose bullet list `ru` alongside `en`/`uk`.
- [ ] The "any other tag also works" note is preserved, not removed.

## Notes

Compile-coupled with nothing — pure prose edit, no machine tokens changed. Can run in parallel
with T3/T4/T8.
