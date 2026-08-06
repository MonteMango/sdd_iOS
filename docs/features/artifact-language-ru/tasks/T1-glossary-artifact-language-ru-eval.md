---
id: T1
title: "Add glossary-artifact-language-ru eval scenario"
layer: "tests"
deps: []
acs: ["AC-01", "AC-03"]
files_hint: ["evals/scenarios/glossary-artifact-language-ru/"]
owner: "Fork maintainer"
estimate: "S"
status: "todo"
---

# T1 — Add glossary-artifact-language-ru eval scenario

## Why

Derives from [spec §5 AC-01, AC-03](../spec.md) and [sad §5/§6](../sad.md) — the feature's core proof
obligation: an automated eval that `artifact_language: ru` produces Russian prose with English
structure, mirroring the existing `glossary-artifact-language-uk` precedent
(`evals/scenarios/glossary-artifact-language-uk/`).

## What

Create `evals/scenarios/glossary-artifact-language-ru/` with the same three-part shape as the `uk`
scenario:
- `fixture/.claude/sdd.local.md` — copy of the `uk` fixture with `artifact_language: ru`.
- `prompt.txt` — same `/sdd:glossary` headless-eval prompt shape (adapt slug/terms as needed).
- `rubric.md` — PASS rule must check a **Russian-specific** marker (a letter absent from Ukrainian,
  e.g. «ы»/«э»/«ъ», or a grammatical construction invalid in Ukrainian), not merely "text is
  Cyrillic" — plain-Cyrillic would also pass for Ukrainian prose. Also require: English `## Glossary`
  heading verbatim, English frontmatter, no leftover template comments, and a stage-handoff block in
  the final message (same checks as the `uk` rubric).

## Definition of Done

- [ ] `evals/scenarios/glossary-artifact-language-ru/fixture/.claude/sdd.local.md`,
      `prompt.txt`, and `rubric.md` exist.
- [ ] `rubric.md`'s PASS rule names a Russian-specific marker, not a plain-Cyrillic check.
- [ ] Scenario shape (fixture keys, structure-stays-English checks) matches the `uk` precedent.

## Notes

Read [`evals/scenarios/glossary-artifact-language-uk/`](../../../../evals/scenarios/glossary-artifact-language-uk/)
as the template to adapt, per spec §1. T7 runs this scenario; T5 references it once it exists.
