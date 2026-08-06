---
id: T5
title: "Register uk and ru scenarios in evals/README.md's Scenarios table"
layer: "docs"
deps: ["T1"]
acs: ["AC-08"]
files_hint: ["evals/README.md"]
owner: "Fork maintainer"
estimate: "S"
status: "todo"
---

# T5 — Register uk and ru scenarios in evals/README.md's Scenarios table

## Why

Derives from [spec §5 AC-08](../spec.md) — both `glossary-artifact-language-uk` (already exists,
currently undocumented) and `glossary-artifact-language-ru` (new, from T1) are missing from
`evals/README.md`'s Scenarios table, so neither is discoverable or runnable by name without
browsing `scenarios/`.

## What

Add two rows to `evals/README.md`'s `## Scenarios` table, matching the existing row style
(`| \`scenario-name\` | one-line description of what it proves |`):
- `glossary-artifact-language-uk` — proves `artifact_language: uk` produces Ukrainian prose with
  English structure (heading/frontmatter unchanged).
- `glossary-artifact-language-ru` — proves `artifact_language: ru` produces Russian prose (a
  Russian-specific marker, not plain-Cyrillic) with English structure.

## Definition of Done

- [ ] `evals/README.md`'s Scenarios table has a `glossary-artifact-language-uk` row.
- [ ] `evals/README.md`'s Scenarios table has a `glossary-artifact-language-ru` row.
- [ ] Neither row's description duplicates the other's rubric verbatim — each states what it
      specifically proves.

## Notes

Depends on T1 because the `ru` row's description should accurately reflect the scenario's actual
rubric (the Russian-specific marker). Does not register the 5 pre-existing `*-ios-consultant`
scenarios — out of scope per [spec §3](../spec.md).
