# Review dimensions + dispatch

The independent review (step 2) probes the feature diff along these dimensions. For a small change, one [`reviewer`](../../../agents/reviewer.md) pass covers them all; for a large diff, fan out one reviewer per dimension and merge findings.

## Stage 1 — does it do what the spec says (the gate that can block ship)

- **AC compliance.** For every AC the change claims (the `SDD-AC` trailers / `tasks.json` `acs`): does the code actually produce the business-observable outcome the AC names, and is there a test that asserts *that outcome* (not a tautology)?
- **End-to-end use-case + AC trace (the backstop).** Take the **whole** spec **§4 user-story set + §5 AC set** — **not only the ACs the diff claims** — and trace both through the chain. **Use-case level:** every §4 user story has ≥1 AC (specify's use-case floor) and a §6 sequence flow (sequences' use-case pass). **AC level:** **spec §5 → `sad.md` §6 sequence (a flow or branch shows it) → `data-model.md` (the schema supports it) → `contracts/openapi.yaml` (an endpoint/event exposes it) → `tasks.json` (a task claims it) → implement (code + a test asserts it)**. **The trace spans every surface declared in `sad.md` `target_surfaces`, not only the backend:** for a UI surface (`web-frontend` / `mobile-app` / `desktop-app`) a UI AC reaches a `ui`-layer task + a **component / e2e-through-UI** test and a UI-driven §6 flow (`<user>` → `<ui>` → `<service>`) shows it — a UI AC that lands only a backend test is a gap. The §5 set includes any AC carrying an `<!-- added-by-fix -->` marker — trace it like every other AC: full chain coverage, with the fix's pinning test as its minimum, not its ceiling. Flag anything that **drops out anywhere** — a user story with no AC or no flow, or an AC missing a flow, a task, a test, or code. The per-stage gates each guard one link (specify's §5 5-type + use-case floors, sequences' use-case + AC→flow coverage, plan-tests' AC→test, tasks' AC→task); `review` is the **end-to-end backstop** that catches anything that slipped *between* links and never reached the diff at all.
- **Contract fidelity.** Does the change honour `data-model.md`, `contracts/openapi.yaml`, and the Accepted ADRs (e.g. the audit-in-transaction decision), or does it quietly diverge?

A stage-1 finding means the feature does not yet meet its spec — it blocks ship until fixed or explicitly de-scoped (a spec change with the owner in the loop). A user story or AC that dropped out of the chain is a stage-1 finding even if no line of the diff mentions it.

## Stage 2 — is it good code (quality, usually non-blocking)

- **Conventions.** Matches the repo's patterns for each layer (error handling, wiring, naming, module boundaries).
- **UI reuse (for a UI surface).** Composes the existing design system / components / tokens / styling (`architecture-map.md` §Frontend) rather than reinventing — flag from-scratch UI that duplicates an existing primitive or introduces a second styling system.
- **Error + edge handling.** Are the spec's error / authorization / invariant criteria handled, not just the happy path? Concurrency, empty/oversized input, idempotency where the contract requires it.
- **Security.** Identity from the session not from input; no new injection/leak surface; secrets not logged.
- **Boundary violations.** Stayed inside the module(s) the tasks named; no weakened test; no forbidden DB construct vs the repo's migration rules.
- **Test adequacy.** Do the tests exercise the real behaviour, including the failure paths — or only the happy path?

## iOS consultant AND-gate + pre-consult (before dispatch)

`review`'s entire body of work runs inside the read-only `reviewer` sub-agent, which cannot spawn
a consultant itself — the main session pre-consults and pastes the brief into the dispatch prompt
below (ADR-0002). A class fires only when **both** signals affirm it (ADR-0005):

1. **AND-gate.** For each of the 3 classes, evaluate `spec-visible ∧ diff-visible` — spec-visible
   reuses `design`'s own mechanism ([`../../_shared/consultant-trigger.md`](../../_shared/consultant-trigger.md)
   applied to `spec.md` prose); diff-visible is [`../SKILL.md`](../SKILL.md) step 1.5's result. A
   class where either signal alone affirms but the other doesn't is a **structural no-op** — no
   consultant, no cost (AC-09; this is ADR-0005's accepted false-negative, not a bug).
2. **Pre-consult.** On a class where both affirm, consult that class's consultant
   (`agents/swiftui-consultant.md` / `concurrency-consultant.md` / `swift-testing-consultant.md`)
   scoped to the diff-visible signal, and fold the returned brief at `review`'s own **quality-bar**
   altitude via [`../../_shared/consultant-fold.md`](../../_shared/consultant-fold.md). A
   structural/architectural item (e.g. "replace UIKit navigation with SwiftUI's
   `NavigationStack`") is **denied entry as a finding** — not cited to a file+line — and is left
   for `design` to carry instead (AC-10b).
3. **Dispatch injection.** Paste each landed class's folded brief into the `reviewer` dispatch
   prompt below — [`../../../agents/reviewer.md`](../../../agents/reviewer.md) itself stays
   **unedited** (spec §3 non-goal 7). The dispatched `reviewer`'s resulting findings for that class
   carry **the same blocking weight** as any other stage-1/stage-2 finding (AC-07).
4. **Degenerate / missing consultant (`review`'s own test).** If a gated-in class's bundle fails to
   load, or its consultant returns zero findings citable to a file+line (this is `review`'s own
   degenerate test — a quality-bar altitude check, distinct from the structural-decision test the
   other stages use), dispatch **without** that class's brief and write a **visible marker** in the
   review record naming the missing/degenerate consultant (AC-03) — this never blocks the review;
   the other gated-in classes' findings still land.

## Dispatch shape

Reuse the clean-context discipline from [`../../_shared/critic.md`](../../_shared/critic.md): the reviewer has read-only tools, re-reads `spec.md` / contracts / ADRs itself, and emits **cited** findings only:

```
- **[stage-N] <headline>** — file:line; AC: <id|n/a>; problem: <what>; suggested: <fix>.
```

On an async host (background/teammate mode), append the report-delivery instruction ([`../../_shared/agent-roster.md`](../../_shared/agent-roster.md), shared-contract point 2) to the dispatch prompt; an idle signal without the report is not a verdict — pull the report via messaging before merging findings.

A clean review returns `REVIEW_CLEAN: <scope>`. Drop any finding without a `file:line` + a concrete reason — it isn't actionable. Prioritise correctness and AC-compliance over style; judge against the artifacts, not personal taste (if the spec says hide-existence, a 404-style response is correct, not a bug).
