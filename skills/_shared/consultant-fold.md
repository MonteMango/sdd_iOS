# Consultant fold — altitude filter, rules-win, fallback marker

> **TL;DR.** A fired consultant's brief is not trusted verbatim. Every item passes an **altitude filter** scoped to the calling stage's own altitude (structural for `design`, task-scoped full-code for `implement`, test-matrix for `plan-tests`, quality-bar for `review`, flow-detail for `sequences`): admitted items may enter that stage's own artifact, items above or below its altitude are denied and routed to the stage that owns that altitude instead (AC-03, AC-10, AC-10b). Every admitted item is then reconciled against the consuming project's rules — **project wins** on conflict (AC-05/AC-06). A missing or degenerate brief writes a **fallback marker** — visible in both the stage's own artifact and its handoff, never silent (AC-02/AC-03).

This is the fold *rule* every calling stage's own protocol step applies to a returned brief. `design` reuses its own blast-radius gate ([`../design/references/blast-radius.md`](../design/references/blast-radius.md)) as the admission test for its structural altitude; the other four stages apply the same admit/deny/reconcile/fallback-marker *shape* at their own altitude, without needing a blast-radius-style ADR gate of their own. This file is the delta each stage's admission test shares: how the gate is *reused or adapted* per altitude, plus the three things unique to consultant briefs (the per-altitude admission test, rules-win, the marker format).

## Altitude filter — admission test, per calling stage

`design`'s own instance of this test is a **different question** than its blast-radius gate's own ADR-vs-inline scoring ([`../design/references/blast-radius.md`](../design/references/blast-radius.md)) — that gate assumes its input is already architecture-altitude and only decides whether it's *irreversible enough to spawn an ADR*. The fold needs an earlier, coarser test: *is this brief item at the calling stage's own altitude at all*, before it's allowed to compete for a slot in that stage's artifact. For `design`, the test reuses the same three underlying criteria (irreversible / cross-module / has legitimate alternatives) as evidence, but scores them against the fold's own bar, not blast-radius.md's:

- **Structural (any of the three criteria clearly applies, or the item is a §4/§5-level choice by nature — e.g. an isolation-domain, navigation-architecture, or concurrency-strategy choice)** — admitted as a candidate §4/§5 decision. Once admitted, it competes for an ADR on the section's own blast-radius gate exactly like any other decision (no new gate invented for consultant items — they compete on the same bar as any other decision, one step later).
- **Code-level (none of the three criteria applies, and the item reads as a single-screen/single-function/single-line concern — e.g. a specific modifier, macro, or `Task` placement)** — denied entry. It is *not* written into `sad.md` at all; the brief item simply does not survive the fold. No code-level rule ever appears in the architecture document (AC-03).
- **Borderline (arguable either way)** — defaults to **denied**. The fold's job is admitting only clear structural decisions; on ambiguity the safer default keeps the architecture document narrow, not over-admitted. (This is the opposite default from blast-radius.md's own borderline case, where an *already-admitted* decision defaults toward the lower bar of *inline, not ADR* — that's a different question, asked one step later, on an item that already cleared this filter.)

This is a **content-altitude gate, not a security boundary** — it decides what altitude of information may enter an architecture document, nothing more.

### The other four stages' altitude bar

Each of the other four stages applies the identical admit/deny/borderline-denies shape, but scored against its **own** altitude instead of design's structural one — no blast-radius-style ADR competition, since none of these four artifacts spawns ADRs:

| Stage | Admits (this stage's own altitude) | Denies (routed to) |
|---|---|---|
| `implement` | full-code — a concrete implementation choice scoped to *this task's own* work (a modifier, a `Task` placement, a concurrency shape for the code being written) | nothing above code altitude reaches `implement` in practice; a brief item that reads as a structural/architecture decision is out of scope for a task and should be flagged back, not silently written |
| `plan-tests` | test-matrix-altitude — a level/coverage-shaping item (e.g. "this actor-isolated behavior warrants its own dedicated case") | code-level items (a concrete test tool/framework name, e.g. "use XCTest's `XCTAssertThrowsError`") — denied entry, left for `implement` to carry (AC-10) |
| `review` | quality-bar-altitude — a citable finding at the same weight as any other reviewer finding (a convention violation, a missed edge case, an anti-pattern) | structural/architectural items (e.g. "replace UIKit navigation with SwiftUI's `NavigationStack`") — denied entry as a finding, not cited to a file+line, left for `design` to carry (AC-10b) |
| `sequences` | flow-detail-altitude — a flow-specific behavioral detail (a suspend point's shape, an actor-hop's ordering, a fan-out's structure) that sharpens *this one flow's* step-5 draft | code-level items (e.g. a concrete retry-loop implementation) — denied entry, left for `implement`/`review` to carry (AC-10) |

Borderline still defaults to **denied** at every stage — the safer default keeps each artifact at its own altitude, never over-admitted.

## Project-rules-win reconciliation

Every admitted item is checked against the consuming project's rules — the same `CLAUDE.md` + any dedicated rules file that was passed into the consultant's prompt at spawn time. The consultant is **not trusted** to have honoured those rules on its own; reconciliation happens here, at fold time, in the main session:

- **No conflict** — the admitted item is written as-is.
- **Conflict** (the generic bundle advice contradicts a project rule) — the **project rule wins**. The folded decision reflects what the project's own rules say, not the generic advice; the rejected generic item is not written. This is the enforcement point for AC-05 — it catches a consultant that ignored the passed-in rules, because reconciliation does not depend on the consultant having applied them correctly. For `implement`'s testing-consultant instance specifically, the reconciliation target is `.claude/sdd.local.md`'s own already-governing settings (`tdd` / `gate_lint` / `cmd_test_unit`) rather than a `CLAUDE.md` rules file — same rule, same project-wins outcome (AC-06): the folded guidance never recommends a test shape those settings would reject.
- **No project rules file present** — the consultant ran rule-free; its generic advice stands as admitted. This is not a fallback-marker case.

## Fallback marker — format

Written when an expected consultant (per [`./consultant-trigger.md`](./consultant-trigger.md)) either did not fire (bundle failed to load / skill unavailable / web absent) or fired but returned an empty/degenerate brief (no item survives the calling stage's own altitude filter). The **same wording** is used in both the stage's own artifact and its handoff, so the two never drift:

```
iOS consultant marker: <SwiftUI|Swift-concurrency|swift-testing-consultant> consultant expected (signal: <detected signal, e.g. "UI-class: SwiftUI">) but did not fire — <reason, e.g. "expert bundle skill unavailable" / "returned no admissible item">
```

- **`design`** — an HTML comment at the relevant §4/§5 location in `sad.md`: `<!-- iOS consultant marker: SwiftUI consultant expected (signal: UI-class) but did not fire — expert bundle skill unavailable -->`.
- **`implement`** — a per-task line in that task's own TaskList body (team mode) or `consultant_brief` field (workflow mode), or a per-task line at the inline-consult point (single-agent mode).
- **`plan-tests`** — an HTML comment adjacent to the affected AC's row in `test-plan.md` (or the inline `## Test plan` section for XS/S).
- **`review`** — a visible line in the written review record (`_review/review-<date>.md`) naming the missing/degenerate consultant.
- **`sequences`** — an HTML comment in `sad.md` §6 next to the relevant flow.
- In every stage's own **handoff**, write the identical sentence in prose (no comment syntax) inside the *What I did* section.

Writing the marker never blocks the stage — every stage proceeds exactly as it would if no consultant had been expected at all (ADR-0004).

## References

- [`../design/references/blast-radius.md`](../design/references/blast-radius.md) — the three-criteria gate `design` reuses as its own altitude filter.
- [`./consultant-trigger.md`](./consultant-trigger.md) — the signal set + mapping that decides which consultant was *expected*, the precondition for a fallback marker.
- [`../design/SKILL.md`](../design/SKILL.md) · [`../implement/SKILL.md`](../implement/SKILL.md) · [`../plan-tests/SKILL.md`](../plan-tests/SKILL.md) · [`../review/SKILL.md`](../review/SKILL.md) · [`../sequences/SKILL.md`](../sequences/SKILL.md) — each stage's own protocol step applies this fold to its own returned brief(s).
