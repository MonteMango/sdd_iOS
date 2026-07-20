# Consultant fold — altitude filter, rules-win, fallback marker

> **TL;DR.** A fired consultant's brief is not trusted verbatim. Every item passes the **altitude filter** (design's own blast-radius gate, reused — [`./blast-radius.md`](./blast-radius.md)): structural items may enter `sad.md` §4/§5, code-level items are denied and routed to implement/review (AC-03). Every admitted item is then reconciled against the consuming project's rules — **project wins** on conflict (AC-05). A missing or degenerate brief writes a **fallback marker** — visible in both `sad.md` and the handoff, never silent (AC-02).

This is the fold *rule* `SKILL.md` step 6/7 applies to a returned brief. It does not restate the blast-radius gate's own criteria — see [`./blast-radius.md`](./blast-radius.md) for those; this file is the delta: how the gate is *reused* as a brief-admission test, plus the two things unique to consultant briefs (rules-win, the marker format).

## Altitude filter — admission test

Each brief item is scored against the same three criteria `design` already runs on every §4/§5 decision (irreversible / cross-module / has legitimate alternatives — [`./blast-radius.md`](./blast-radius.md)):

- **Structural (2-of-3 or the item is a §4/§5-level choice by nature)** — admitted as a candidate §4/§5 decision. Still subject to the section's own blast-radius gate (no new gate invented for consultant items — they compete on the same bar as any other decision).
- **Code-level (0-of-3, or clearly a single-screen/single-function concern)** — denied entry. Routed to implement/review in the sense that it is *not* written into `sad.md` at all; the brief item simply does not survive the fold. No code-level rule ever appears in the architecture document (AC-03).

This is a **content-altitude gate, not a security boundary** — it decides what altitude of information may enter an architecture document, nothing more.

## Project-rules-win reconciliation

Every admitted (structural) item is checked against the consuming project's rules — the same `CLAUDE.md` + any dedicated SwiftUI-rules file that was passed into the consultant's prompt (see `SKILL.md` step 3.5). The consultant is **not trusted** to have honoured those rules on its own; reconciliation happens here, at fold time, in the main session:

- **No conflict** — the admitted item is written as-is.
- **Conflict** (the generic bundle advice contradicts a project rule) — the **project rule wins**. The folded decision reflects what the project's own rules say, not the generic advice; the rejected generic item is not written. This is the enforcement point for AC-05 — it catches a consultant that ignored the passed-in rules, because reconciliation does not depend on the consultant having applied them correctly.
- **No project rules file present** — the consultant ran rule-free; its generic advice stands as admitted. This is not a fallback-marker case.

## Fallback marker — format

Written when an expected consultant (per [`./consultant-trigger.md`](./consultant-trigger.md)) either did not fire (bundle failed to load / skill unavailable / web absent) or fired but returned an empty/degenerate brief (no structural decision survives the altitude filter). The **same wording** is used in both places — `sad.md` and the stage handoff — so the two never drift:

```
iOS consultant marker: <SwiftUI|Swift-concurrency> consultant expected (signal: <detected signal, e.g. "UI-class: SwiftUI">) but did not fire — <reason, e.g. "expert bundle skill unavailable" / "returned no structural decision">
```

- In `sad.md`, write it as an HTML comment at the relevant §4/§5 location: `<!-- iOS consultant marker: SwiftUI consultant expected (signal: UI-class) but did not fire — expert bundle skill unavailable -->`.
- In the stage handoff, write the identical sentence in prose (no comment syntax) inside the *What I did* section — see `SKILL.md` step 7.

Writing the marker never blocks the stage — `design` proceeds exactly as it would if no consultant had been expected at all (ADR-0004).

## References

- [`./blast-radius.md`](./blast-radius.md) — the three-criteria gate this file reuses as the altitude filter.
- [`./consultant-trigger.md`](./consultant-trigger.md) — the signal set + mapping that decides which consultant was *expected*, the precondition for a fallback marker.
- [`../SKILL.md`](../SKILL.md) — step 6/7 applies this fold to each returned brief.
