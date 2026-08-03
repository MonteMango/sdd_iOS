---
id: T9
title: "Document the new shared protocol and per-feature artifact in architecture-map.md"
layer: "docs"
deps: ["T1"]
acs: []
files_hint: ["docs/architecture-map.md"]
owner: "Fork maintainer (Vitalii)"
estimate: "S"
status: "todo"
---

# T9 — Document architecture-map.md

## Why

`architecture-map.md` is the repo's own record of `skills/_shared/`'s contents and the `docs/`
artifact set — it should reflect the 14th shared protocol and the new per-feature artifact type this
feature introduces, so a future `survey` or reader isn't surprised by an undocumented file — derives
from [sad §5 Building block view](../sad.md) (`skills/_shared/pipeline-log.md <new>`).

## What

In `docs/architecture-map.md`:

- update the "Shared protocols" row's count from 13 to 14 and add `pipeline-log.md` to its named
  examples (currently: "13 cross-cutting rules (handoff, socratic-loop, size-matrix, self-check,
  mermaid-check, …)");
- add a one-line mention of `docs/features/<slug>/pipeline-log.md` alongside the existing
  `spec.md`/`sad.md`/`tasks.json` per-feature artifact list, if such a list exists in the doc.

## Definition of Done

- [ ] the Shared protocols row reads "14 cross-cutting rules" and names `pipeline-log.md`
- [ ] the new per-feature artifact is mentioned once, in the existing artifact-list location
- [ ] no unrelated section of `architecture-map.md` is touched (surgical edit)

## Notes

Runs in parallel with T2–T8. Pure documentation — no behavior change, no test.
