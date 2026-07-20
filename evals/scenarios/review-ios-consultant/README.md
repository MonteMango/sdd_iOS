# review-ios-consultant — manual fixture verification (T15)

Manual fixture verification, following the precedent set by
[`../design-ios-consultant/README.md`](../design-ios-consultant/README.md) — not a `run.sh`-style
automated scenario (no `prompt.txt` / `rubric.md` / `fixture/` tree, no judge). Each fixture was
run once, for real, against the finished `review` wiring (T1, T2, T8, T9), in an isolated throwaway
workdir loading this repo's plugin via `claude -p --plugin-dir`.

## Method

Two base fixtures:

- [`all-three-spec.md`](./all-three-spec.md) + [`all-three-sad.md`](./all-three-sad.md) +
  [`diff-files/`](./diff-files/) (`ProfileView.swift`, `ProfileSyncCoordinator.swift`,
  `ProfileSyncTests.swift`) — a `mobile-app` feature whose spec prose AND diff both carry genuine
  UI, async, and test-strategy signal (all three AND-gates should affirm).
- [`scope-creep-spec.md`](./scope-creep-spec.md) + [`scope-creep-sad.md`](./scope-creep-sad.md) +
  `diff-files/DiscountCodeValidator.swift` — a pure-logic `library-sdk` spec (explicit non-goals:
  "no async/concurrency surface") whose diff nonetheless adds a stray `Task {}` (scope creep) —
  diff-visible affirms, spec-visible doesn't.

Each was copied into a fresh `git init`'d scratch directory (spec/sad committed as the baseline;
the `Sources`/`Tests` `.swift` files left as an **uncommitted working diff**, review's own
documented "or a non-empty working diff" gate), then run headlessly, e.g.:

```
claude -p "/sdd:review profile-sync-widget

Headless eval run — there is NO interactive user; never call AskUserQuestion, decide every
question yourself and proceed. Follow the review skill's protocol exactly as written, including
its iOS consultant AND-gate + pre-consult wiring (step 1.5 + step 2). Treat the untracked Sources/
and Tests/ files as the change under review (the working diff against the baseline)." \
  --plugin-dir <this-repo> --permission-mode acceptEdits --max-turns 20 \
  --allowedTools "Bash(git:*),Read,Grep,Glob" --output-format json
```

The degenerate-marker and structural-denial runs added one instruction line each simulating,
respectively, a bundle-load failure for one gated-in class, and a consultant brief item above
review's own quality-bar altitude — the same "simulate for this run only" technique the
`design-ios-consultant` precedent used.

## Results

| Run | Fixture | AC(s) | Verdict | Evidence |
|---|---|---|---|---|
| all-three-fire | `all-three-spec.md` (normal) | AC-07 | **PASS** | The AND-gate table shows all 3 classes affirming on **both** spec-visible and diff-visible signal; all 3 consultants fired and returned findings citable to `file:line`. The written review record's stage-1/stage-2 findings include concurrency-consultant items (unstructured `Task {}` race, missing staleness gate, unobservable outcome) and a SwiftUI-consultant item (sync result never reaches the view's `@State`), each carrying the **same blocking weight** as ordinary findings — verdict `CHANGES REQUESTED` driven by a mix of plain findings and consultant-sourced ones together. |
| AND-gate-false-negative | `scope-creep-spec.md` | AC-09 | **PASS** | Step 1.5 correctly affirmed the async class **diff-visible** (the stray `Task {}`), while the spec-visible layer stayed silent (every async keyword in the spec appears only inside "no async/concurrency surface" negations). The record states the AND-gate result explicitly: `spec-visible ∧ diff-visible = false ∧ true = FALSE → did NOT fire`, citing this as ADR-0005's accepted false-negative, not a bug — no consultant dispatched, no cost. The scope-creep `Task {}` itself was still caught and blocked as an ordinary stage-1 finding (violates the spec's own non-goal), independent of the consultant wiring. |
| degenerate-marker | `all-three-spec.md` + simulated swift-testing-consultant bundle failure | AC-03 | **PASS** | The review record carries the literal marker sentence naming `swift-testing-expert`, the signal that gated it in, and "expert bundle skill unavailable (bundle-load failure)" — while the UI and concurrency consultants' findings (both gated in on the same run) still landed at full blocking weight, and the review was **not blocked**: it reached a `CHANGES REQUESTED` verdict normally. |
| structural-denial | `all-three-spec.md` + simulated over-reaching SwiftUI-consultant brief | AC-10b | **PASS** | The simulated item — *"replace UIKit navigation with SwiftUI's `NavigationStack`"* — was **denied entry as a citable finding**: it appears only inside the visible-marker sentence ("returned no admissible item... denied entry... left for design to carry"), never cited to a `file:line` in the Findings section. The concurrency and swift-testing consultants' findings for the same run still landed at full weight, proving the denial is scoped to the one over-reaching item, not the whole class. |

All 4 runs passed. Getting there required several retries: the first attempts on 3 of the 4 runs
hit a transient `API Error: Connection closed mid-response` (an infrastructure blip in the nested
headless session, unrelated to the review wiring — confirmed by re-running the identical fixture
and prompt and getting a clean pass) before landing the recorded PASS above.

## Notes

- None of the generated `_review/review-<date>.md` files are committed here — all four lived in
  throwaway scratch workdirs outside this repo and were not meant to be kept as permanent feature
  artifacts; this README is the durable record of the outcome.
- `agents/reviewer.md` was not touched by any of the 4 runs (confirmed by `git status`/inspection
  of this repo throughout — the runs use `--plugin-dir` to read this checkout read-only and each
  operates in its own throwaway workdir, never writing back into this repo).
- The all-three-fire and degenerate-marker/structural-denial runs share the same base fixture
  (`all-three-spec.md`) with a different one-line simulation instruction each — this keeps the
  fixture surface small (one realistic feature) while covering all 4 required behaviors, rather
  than inventing 4 unrelated features.
