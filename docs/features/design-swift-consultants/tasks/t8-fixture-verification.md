---
id: T8
title: "Verify AC-01/AC-02/AC-06 on fixture specs"
layer: "tests"
deps: ["T5"]
acs: ["AC-01", "AC-02", "AC-06"]
files_hint: ["evals/scenarios/design-ios-consultant/"]
owner: "Fork maintainer"
estimate: "M"
status: "todo"
---

# T8 — Verify AC-01/AC-02/AC-06 on fixture specs

## Why

Derives from [spec §5 AC-01, AC-02, AC-06](../spec.md), [spec §6 NFR "Deterministic spawn" / "Fallback marker visibility" — measurement: "eval / manual over fixture specs" / "bundle-unavailable fixture run"](../spec.md), [spec §8 OQ "regression-anchor eval (`design-ios-consultant`)" — this task is the manual precursor; the automated CI harness itself stays deferred per that OQ](../spec.md).

## What

Add three minimal fixture specs under `evals/scenarios/design-ios-consultant/` (following the existing `evals/scenarios/<name>/` shape — see `evals/scenarios/design-gate-refusal/` as the closest precedent) and manually run `design` against each with the finished wiring (T1–T5), recording the observed outcome in a short `evals/scenarios/design-ios-consultant/README.md`:

1. **UI/async fixture** (`ui-async-spec.md`) — a minimal spec whose §1/§4 prose carries a UI signal (e.g. mentions "SwiftUI views") and an async signal (e.g. "background sync via async/await"). Expect: both consultants fire (≤2), the resulting SAD §4/§5 carries iOS structural decisions, the handoff names both consultants (AC-01).
2. **Pure-logic fixture** (`pure-logic-spec.md`) — a minimal spec with no UI/async prose. Expect: no consultant fires, no iOS trace in the SAD, no marker (AC-06).
3. **Bundle-unavailable fixture** (`bundle-unavailable-spec.md`) — a UI-signal spec run with the expert bundle skill deliberately made unreachable (e.g. rename/hide it for the run, or simulate via a note the consultant sub-agent is told to fail). Expect: the stage proceeds without blocking, and a fallback marker naming the missing consultant appears in **both** the handoff and `sad.md` (AC-02).

## Definition of Done

- [ ] `evals/scenarios/design-ios-consultant/{ui-async-spec.md, pure-logic-spec.md, bundle-unavailable-spec.md}` exist.
- [ ] `evals/scenarios/design-ios-consultant/README.md` records the observed outcome of each of the 3 runs against AC-01 / AC-02 / AC-06, with a pass/fail per AC.
- [ ] All 3 recorded outcomes pass; a failing outcome is fixed (loop back into T3/T4) and re-run before this task is marked done.
- [ ] README explicitly notes that wiring this into an automated CI eval harness is the deferred `design-ios-consultant` open question (spec §8) — out of scope here.

## Notes

Independent file lane from T1–T7 (no `SKILL.md` overlap) — can run concurrently with T6/T7 once T5 lands, but logically needs the full spawn+fold+handoff wiring (T3, T4, T5) to have something to verify.
