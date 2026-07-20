---
id: T4
title: "Extend step 6/7 — altitude fold + project-rules-win + dual marker write"
layer: "ports"
deps: ["T2", "T3"]
acs: ["AC-02", "AC-03", "AC-05"]
files_hint: ["skills/design/SKILL.md"]
owner: "Fork maintainer"
estimate: "M"
status: "todo"
---

# T4 — Extend step 6/7 — altitude fold + project-rules-win + dual marker write

## Why

Derives from [spec §5 AC-02, AC-03, AC-05](../spec.md), [sad §4 decision 4 (ADR-0004) + inline decisions "Altitude filter" and "Project-rules-win"](../sad.md), [sad §6 Critical flow 2 + Critical flow 4](../sad.md), [ADR-0004](../adr/0004-non-blocking-fallback-marker.md).

## What

Edit `skills/design/SKILL.md` step 6 (Socratic walk + blast-radius gate) and/or step 7 (Critic + finalize) — whichever the resolved brief timing fits without breaking the existing per-section write-after-resolve contract — to add the **fold**:

- when a spawned consultant (T3) has returned before the relevant §4/§5 section is walked, run each brief item through the altitude filter from [`./references/consultant-fold.md`](../../../../skills/design/references/consultant-fold.md) (written in T2): structural items become candidate §4/§5 decisions (still subject to the existing blast-radius gate the section already runs — no new gate invented), code-level items are denied entry and noted as routed to implement/review (AC-03, never written into `sad.md`);
- reconcile each admitted item against the project's rules (passed into the consultant's prompt in T3) — on conflict, write the project rule, not the generic advice (AC-05);
- on a missing/empty/degenerate brief (bundle failed to load, skill unavailable, or no structural decision returned), write the fallback marker (format from T2) into `sad.md` at the relevant section, and **do not block** — the step proceeds exactly as it would with no consultant (ADR-0004, spec §3 non-goal 4).

This is prose editing only — no new step number if it fits naturally into the existing per-section walk; if a distinct sub-step reads more clearly, number it consistently with the file's existing convention.

## Definition of Done

- [ ] `SKILL.md` step 6/7 text describes the altitude fold (linking `./references/consultant-fold.md`), the project-rules-win reconciliation, and the dual-marker write into `sad.md`.
- [ ] The described behavior never blocks the stage — reads as "proceed regardless" in both the missing-consultant and degenerate-brief cases.
- [ ] Code-level brief items are explicitly denied entry to `sad.md` per the text (AC-03).
- [ ] Manually trace AC-02, AC-03, AC-05 in the spec against the new prose — each finds a matching sentence.

## Notes

Shares `skills/design/SKILL.md` with T3, T5, T6 — serialized in the same lane. Depends on T2 (fold reference must exist to link) and T3 (the fold needs a defined spawn to fold from).
