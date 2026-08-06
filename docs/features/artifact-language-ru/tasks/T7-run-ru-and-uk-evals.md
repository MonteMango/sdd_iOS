---
id: T7
title: "Run the new ru eval and the existing uk eval to confirm no regression"
layer: "tests"
deps: ["T1"]
acs: ["AC-01", "AC-03"]
files_hint: ["evals/scenarios/glossary-artifact-language-ru/", "evals/scenarios/glossary-artifact-language-uk/"]
owner: "Fork maintainer"
estimate: "S"
status: "todo"
---

# T7 — Run the new ru eval and the existing uk eval to confirm no regression

## Why

Derives from [spec §5 AC-01, AC-03](../spec.md) and [spec §6 NFR](../spec.md) — the eval must
actually return PASS, not just exist; and the pre-existing `uk` coverage must keep passing after
the doc edits (T2–T4) touch files the `uk` scenario doesn't read but that share the same rule
being exercised.

## What

Run:
- `./evals/run.sh glossary-artifact-language-ru` — expect `PASS`.
- `./evals/run.sh glossary-artifact-language-uk` — expect `PASS` (regression check).

Retries allowed per [spec §6 NFR](../spec.md) — the harness is documented non-deterministic; no
repeat-stability claim required, just one verified PASS per scenario.

## Definition of Done

- [ ] `./evals/run.sh glossary-artifact-language-ru` returns `PASS` on a verified run.
- [ ] `./evals/run.sh glossary-artifact-language-uk` returns `PASS` on a verified run.

## Notes

Gates T6 — the repo's own `.claude/sdd.local.md` should only flip to `ru` after this task confirms
the setting actually works, per [spec §8 OQ-2](../spec.md) intent (prove before adopt).
