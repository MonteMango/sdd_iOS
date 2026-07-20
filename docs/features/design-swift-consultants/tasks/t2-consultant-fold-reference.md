---
id: T2
title: "Write the consultant-fold reference (altitude filter + rules-win + marker format)"
layer: "domain"
deps: []
acs: ["AC-02", "AC-03", "AC-05"]
files_hint: ["skills/design/references/consultant-fold.md"]
owner: "Fork maintainer"
estimate: "S"
status: "todo"
---

# T2 — Write the consultant-fold reference (altitude filter + rules-win + marker format)

## Why

Derives from [spec §5 AC-02, AC-03, AC-05](../spec.md), [sad §4 inline decisions "Altitude filter" + "Project-rules-win at fold"](../sad.md), [sad §6 Critical flow 4](../sad.md), [ADR-0004](../adr/0004-non-blocking-fallback-marker.md).

## What

Create `skills/design/references/consultant-fold.md` — a new reference file, sibling to T1's. It documents:

- **Altitude filter** — reuse of `design`'s own blast-radius gate (irreversible / cross-module / has legitimate alternatives) as the admission test for brief items; structural items admitted into §4/§5, code-level items denied and routed to implement/review (AC-03);
- **Project-rules-win reconciliation** — each admitted item is checked against the consuming project's rules (`CLAUDE.md` + any SwiftUI-rules file) at fold time; on conflict the project rule wins, not the generic advice (AC-05);
- **Fallback marker format** — the exact wording pattern for the dual marker (used identically in the SAD and in the handoff), naming the expected-but-missing (or empty-returning) consultant, e.g. `<!-- iOS consultant marker: <SwiftUI|Swift-concurrency> consultant expected (signal: <signal>) but did not fire — <reason> -->` for the SAD, and a one-line handoff bullet with the same content in prose.

Do not restate the blast-radius gate's own criteria (link to `./blast-radius.md` instead) — this file is the delta: how the gate is *reused* for brief items, not a redefinition.

## Definition of Done

- [ ] `skills/design/references/consultant-fold.md` exists with the altitude filter (linking to `./blast-radius.md`), the rules-win reconciliation rule, and one concrete fallback-marker text template usable verbatim in both the SAD and the handoff.
- [ ] AC-02, AC-03, AC-05 are each traceable to a named subsection.
- [ ] No spawn/trigger mechanics duplicated from T1.

## Notes

Shares no file with any other task — can start immediately, in parallel with T1.
