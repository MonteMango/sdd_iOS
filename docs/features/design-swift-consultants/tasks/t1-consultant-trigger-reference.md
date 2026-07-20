---
id: T1
title: "Write the consultant-trigger reference (signal set + mapping + cap)"
layer: "domain"
deps: []
acs: ["AC-01", "AC-06"]
files_hint: ["skills/design/references/consultant-trigger.md"]
owner: "Fork maintainer"
estimate: "S"
status: "todo"
---

# T1 — Write the consultant-trigger reference (signal set + mapping + cap)

## Why

Derives from [spec §5 AC-01, AC-06](../spec.md), [sad §4 inline decision "Trigger detection"](../sad.md), [sad §5 building blocks](../sad.md), [ADR-0001](../adr/0001-guaranteed-fire-consultant-spawn.md).

## What

Create `skills/design/references/consultant-trigger.md` — a new reference file, following the existing `skills/design/references/*.md` shape (short, delta-only, cross-linked from `SKILL.md`). It documents:

- the curated keyword set: UI-class (`views / navigation / screens / SwiftUI / UI`) and async-class (`async / await / background / concurrency / actors / tasks`);
- model inference over the spec prose as a second detection layer (not keyword-only);
- the signal → consultant mapping: UI-class ⇒ SwiftUI consultant, async-class ⇒ Swift-concurrency consultant, both ⇒ both;
- the structural ≤2-per-run cap (exactly two consultant classes exist, so the cap holds by construction — no counter needed);
- the pure-logic case: no signal present ⇒ no consultant spawns, zero added cost (AC-06).

Do not write spawn mechanics here (that's T3) — this file is the detection *rule*, read by `SKILL.md` step 3.5.

## Definition of Done

- [ ] `skills/design/references/consultant-trigger.md` exists with the keyword sets, the mapping table, the ≤2 cap, and the AC-06 pure-logic case stated explicitly.
- [ ] File follows the sibling references' shape (`skills/design/references/blast-radius.md` as the model): short, reference-only, no owner skill logic duplicated.
- [ ] No mention of spawn/fold mechanics (kept out of scope for this file).

## Notes

Shares no file with any other task — can start immediately, in parallel with T2.
