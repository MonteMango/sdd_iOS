---
id: T9
title: "review: AND-gated pre-consult + dispatch injection + fallback marker"
layer: "app"
deps: ["T2", "T8"]
acs: ["AC-03", "AC-05", "AC-07", "AC-09", "AC-10b"]
files_hint: ["skills/review/SKILL.md"]
owner: "Fork maintainer"
estimate: "M"
status: "todo"
---

# T9 — review: AND-gated pre-consult + dispatch injection + fallback marker

## Why

`review`'s entire body of work runs inside the read-only `reviewer` sub-agent, which cannot spawn a consultant itself — the main session must pre-consult and paste the brief into the dispatch prompt (ADR-0002). A class fires only when [T8](./t8-review-diff-signal.md)'s diff-visible signal AND the spec-visible signal (reused from `design`'s mechanism, applied to `spec.md` prose) both affirm it (ADR-0005). Derives from [spec US-03/AC-07, US-05/AC-03, US-07/AC-05, US-09/AC-09, US-10/AC-10b](../spec.md), [sad §4/§6](../sad.md), [ADR-0002](../adr/0002-pre-consult-injection-for-subagent-only-stages.md), [ADR-0005](../adr/0005-review-trigger-and-gate.md).

## What

Before step 2 in `skills/review/SKILL.md`: for each of the 3 classes, evaluate the AND-gate (spec-visible ∧ [T8](./t8-review-diff-signal.md)'s diff-visible). On both affirming, pre-consult that class's consultant, scoped to the diff signal, and fold at `review`'s quality-bar altitude via `../_shared/consultant-fold.md` — a structural/architectural item (e.g. "replace UIKit navigation with `NavigationStack`") is denied entry as a finding, not cited to a file+line, left for `design` to carry (AC-10b). Paste each landed class's brief into the `reviewer` dispatch prompt (step 2) — `agents/reviewer.md` itself stays unedited (spec §3 non-goal 7). The dispatched `reviewer`'s resulting findings for that class carry the same blocking weight as any other finding (AC-07). On a class whose bundle fails to load, or whose consultant returns zero findings citable to a file+line (review's own degenerate test), dispatch without that class's brief and write a visible marker in the review record naming the missing/degenerate consultant (AC-03) — never blocking. A class whose AND-gate does not affirm is a structural no-op: no consultant, no cost (AC-09).

## Definition of Done

- [ ] A fixture diff with UI, concurrency, and test-strategy signal genuinely present in both spec and diff shows all 3 consultants firing and their findings landing in the review record at the same blocking weight as non-consultant findings (AC-07).
- [ ] A fixture where spec and diff signals disagree for a class (either alone) shows that class not firing — no consultant, no cost (AC-09, ADR-0005's accepted false-negative).
- [ ] A fixture with a degenerate/unavailable consultant for one class shows the review record carrying a visible marker naming it, while the other classes' findings still land, and the review does not block (AC-03).
- [ ] A fixture consultant brief containing a structural-altitude item is denied entry as a citable finding in the review record (AC-10b).
- [ ] `agents/reviewer.md` is unedited by this task.

## Notes

Depends on [T8](./t8-review-diff-signal.md) for the diff-visible half of the AND-gate and on [T2](./t2-consultant-agent-files.md) for the consultant files to dispatch. This is the task that actually completes AC-03/AC-05/AC-07/AC-09/AC-10b for `review` — T8 alone only produces one signal.
