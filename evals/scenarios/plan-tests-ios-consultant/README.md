# plan-tests-ios-consultant — manual fixture verification (T13)

Manual fixture verification, following the precedent set by
[`../design-ios-consultant/README.md`](../design-ios-consultant/README.md) — not a `run.sh`-style
automated scenario (no `prompt.txt` / `rubric.md` / `fixture/` tree, no judge). Each fixture was
run once, for real, against the finished `plan-tests` wiring (T1, T2, T7), in an isolated throwaway
workdir loading this repo's plugin via `claude -p --plugin-dir`.

## Method

For each fixture, [`signal-and-nosignal-spec.md`](./signal-and-nosignal-spec.md) was copied to
`docs/features/offline-cache-sync/spec.md` in a fresh `git init`'d scratch directory, then run
headlessly:

```
claude -p "/sdd:plan-tests offline-cache-sync --depth=easy

Headless eval run — there is NO interactive user; never call AskUserQuestion, decide every
question yourself and proceed. Follow the plan-tests skill's protocol exactly as written,
including its iOS testing-consultant wiring at step 4." \
  --plugin-dir <this-repo> --permission-mode acceptEdits --max-turns 30 \
  --allowedTools "Bash(git:*)" --output-format json
```

The bundle-unavailable run added one line instructing the run to treat the `swift-testing-expert`
bundle as unreachable for AC-01 only (simulated failure), rather than actually removing the plugin.

The fixture spec deliberately carries **both** a signalled AC (AC-01: actor-isolated cache
read/write, its own text says "the test coverage approach for this AC must give the actor-isolated
read/write interleaving its own dedicated case" — a test-strategy signal per
`_shared/consultant-trigger.md`'s keyword `coverage approach`) and a no-signal AC (AC-02: plain
background sync, no test-strategy wording) in **one** spec — this lets a single run prove AC-02's
per-AC independence (a differently-signalled AC in the same run gets different treatment) rather
than needing two separate fixtures for the signal/no-signal split.

## Results

| Run | AC(s) | Verdict | Evidence |
|---|---|---|---|
| `signal-and-nosignal-spec.md` (normal) | AC-01, AC-09, AC-10 | **PASS** | AC-01's coverage-table row carries **two** dedicated concurrency test cases (same-key read+write, same-key write+write) shaped by an admitted test-matrix-altitude consultant item — a visible `<!-- consultant fold ... -->` HTML comment names the fold explicitly and states "No tool/framework/API names were returned by the consultant; none are recorded here — that detail is implement's altitude, not plan-tests's" (AC-10 code-altitude denial holds). AC-02 (no test-strategy signal in its own text) carries **zero** consultant-fold comment or mention — clean AC-09 no-op in the same run as AC-01's fire, proving per-AC independence (AC-02/US-02 semantic, not to be confused with spec's own AC-02). |
| `signal-and-nosignal-spec.md` (bundle-unavailable for AC-01) | AC-01, AC-02, AC-03 (analog) | **PASS** | AC-01's row carries an inline fallback marker naming `swift-testing-consultant`, "unreachable (bundle-load failure)", and states the level was decided directly from the AC's own wording instead of a folded brief. A dedicated "Fallback marker" paragraph mirrors the identical explanation in prose below the table (dual placement, matching `consultant-fold.md`'s dual-placement rule). AC-02 and the two edge-case rows carry no marker and no fold comment — no signal, no consult attempted, consistent with AC-09. The stage did **not** block: the full test plan (coverage table + edge cases + integration strategy + CI placement) was written normally. |

Both runs passed on the first attempt; no loop-back into T7 was needed.

## Notes

- Neither generated `test-plan.md` is committed here — both lived in throwaway scratch workdirs
  outside this repo and were not meant to be kept as permanent feature artifacts; this README is
  the durable record of the outcome.
- The fixture spec's `.size` file was intentionally omitted (only `feature_size: S` in frontmatter)
  to also exercise plan-tests's own "absent `.size` defaults to M" step-2 behavior — both runs
  correctly flagged this and routed to the separate `test-plan.md` file rather than inline, which
  is unrelated to the consultant wiring but confirms the runs followed the skill's protocol
  faithfully rather than skipping steps.
- A separate code-altitude-denial run was not needed as a distinct invocation: both runs' AC-01 row
  already demonstrates zero tool/framework names reached the plan (AC-10), satisfying that DoD
  bullet as a natural consequence of the fold rule rather than a forced fixture.
