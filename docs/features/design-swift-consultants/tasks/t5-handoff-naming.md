---
id: T5
title: "Extend step 7 handoff — name fired/missing consultant(s)"
layer: "ports"
deps: ["T4"]
acs: ["AC-01", "AC-02"]
files_hint: ["skills/design/SKILL.md"]
owner: "Fork maintainer"
estimate: "S"
status: "todo"
---

# T5 — Extend step 7 handoff — name fired/missing consultant(s)

## Why

Derives from [spec §5 AC-01 ("the handoff names which consultant(s) fired"), AC-02 ("emits a visible fallback marker — in BOTH the stage handoff AND the SAD")](../spec.md), [sad §6 Critical flow 1 + Critical flow 2](../sad.md), [`../../../skills/_shared/handoff.md`](../../../skills/_shared/handoff.md).

## What

Edit `skills/design/SKILL.md` step 7's handoff-emission text (the *What I did* line, per the shared handoff contract) so it also states:

- on the happy path: which consultant(s) fired (SwiftUI / Swift-concurrency / both / none), matching AC-01's requirement that the handoff names them;
- on the fallback path: the same fallback-marker text written into `sad.md` (T4), repeated in the handoff's *What I did* (the "dual" placement of ADR-0004) — not just a pointer to go read the SAD.

This is a one- or two-sentence addition inside the existing step 7 handoff paragraph — do not restructure the handoff block itself (format stays owned by `_shared/handoff.md`).

## Definition of Done

- [ ] `SKILL.md` step 7 text states the handoff's *What I did* names the fired consultant(s) or repeats the fallback marker verbatim.
- [ ] No change to the handoff block's sectioned format (`## ✅ <skill> — <slug>` / *What I did* / *Review* / *Run next*) — only the content instruction for *What I did*.
- [ ] Manually confirm AC-01's "the handoff names which consultant(s) fired" and AC-02's "in BOTH the stage handoff AND the SAD" both trace to this text.

## Notes

Shares `skills/design/SKILL.md` with T3, T4, T6 — same serialized lane. Depends on T4 (the marker text must exist before the handoff can repeat it).
