# design-ios-consultant — manual fixture verification (T8)

Manual precursor to a regression-anchor eval, per [spec §8 OQ](../../../docs/features/design-swift-consultants/spec.md). This is **not** a `run.sh`-style automated scenario (no `prompt.txt` / `rubric.md` / `fixture/` tree, no judge) — wiring that into the automated CI eval harness stays the deferred `design-ios-consultant` open question. This README records one manual pass: each fixture spec was run once, for real, against the finished consultant wiring (T1–T5), in an isolated throwaway workdir loading this repo's plugin via `claude -p --plugin-dir`.

## Method

For each fixture, `<slug>-spec.md` was copied to `docs/features/<slug>/spec.md` in a fresh `git init`'d scratch directory, then run headlessly:

```
claude -p "/sdd:design <slug> --depth=easy

Headless eval run — there is NO interactive user; never call AskUserQuestion, decide every
question yourself and proceed. Follow the design skill's protocol exactly as written, ..." \
  --plugin-dir <this-repo> --permission-mode acceptEdits --max-turns 30 \
  --allowedTools "Bash(git:*)" --output-format json
```

The bundle-unavailable fixture added one line instructing the run to treat the SwiftUI expert bundle as unreachable for that run only (simulated failure, per the task's suggested approach), rather than actually removing the plugin.

## Results

| Fixture | AC | Verdict | Evidence |
|---|---|---|---|
| `ui-async-spec.md` | AC-01 | **PASS** | Both consultants fired (SwiftUI + Swift-concurrency — spec carries both signal classes). `sad.md` §4 carries a real `<!-- iOS consultant fold: ... -->` comment, and §4/§5 carry genuine structural decisions (actor-isolated sync coordinator with a monotonic `confirmVersion` guard against reentrancy, `@Observable`/`@MainActor` view-model, Swift 6 complete-concurrency checking) spawned as 3 ADRs. Code-level brief items (exact macros/modifiers/`Task` placement) were explicitly denied entry. Project-rules-win reconciliation was visible (no protocol/DI seam, no `swift-async-algorithms` dep, hardcoded debounce — simplicity-first won every conflict; the repo has no `CLAUDE.md`/SwiftUI-rules file, so this was the global-conventions default, not a project rules file). The handoff's *What I did* states verbatim: "iOS-консультанти (step 3.5): сработали оба — SwiftUI consultant и Swift-concurrency consultant" — names both fired consultants, satisfying AC-01's handoff clause. |
| `pure-logic-spec.md` | AC-06 | **PASS** | No consultant fired — step 3.5 correctly read as a no-op (no UI-/async-class signal in the spec). `sad.md` §4 carries an explicit no-op comment, distinct in wording from a fallback marker (`consultant-trigger.md`'s distinction held). No iOS structural trace anywhere in the 12 sections; `target_surfaces: [library-sdk]`. No consultant token cost incurred (no bundle load attempted). |
| `bundle-unavailable-spec.md` | AC-02 | **PASS** | UI-class signal was detected (SwiftUI view/list/navigation), the SwiftUI consultant was correctly identified as *expected*, and the simulated bundle-load failure produced the fallback marker — present as an HTML comment in **both** `sad.md` §4 and §5, naming the SwiftUI consultant and the reason ("bundle-load failure... unreachable"), plus a dedicated §11 risk row (R-01). The stage did **not** block: all 12 sections were written, 3 ADRs spawned for the parts of the design the fallback didn't touch, and the finalization commit landed normally. The identical marker text was repeated verbatim in the stage handoff's *What I did* (not a pointer to go read the SAD) — the dual placement ADR-0004 requires. |

All three outcomes passed on the first run; no loop-back into T3/T4 was needed.

## Notes

- The `ui-async-spec.md` run needed a second, resumed pass (`claude -p --resume <session_id>`) to reach step 7 (critic + finalize + handoff) — the first pass hit a 30-turn cap after writing all 12 sections and 3 ADRs, because it does more work than the other two fixtures (two consultants + explorer + a fuller Socratic walk). This is a harness turn-budget limit, not a defect in the wiring; both passes together are one logical run of the finished protocol.
- None of the three generated `sad.md`/`adr/` outputs are committed here — they lived in throwaway scratch workdirs outside this repo and were not meant to be kept as permanent feature artifacts; this README is the durable record of the outcome.
- Wiring this into an automated CI eval harness (a `prompt.txt`/`rubric.md`/`fixture/` scenario under `evals/scenarios/`, run via `evals/run.sh` with an LLM judge) is the deferred `design-ios-consultant` open question (spec §8) — out of scope here.
