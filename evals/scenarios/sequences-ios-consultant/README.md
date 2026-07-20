# sequences-ios-consultant — manual fixture verification (T16)

Manual fixture verification, following the precedent set by
[`../design-ios-consultant/README.md`](../design-ios-consultant/README.md) — not a `run.sh`-style
automated scenario (no `prompt.txt` / `rubric.md` / `fixture/` tree, no judge). Each fixture was
run once, for real, against the finished `sequences` wiring (T1, T2, T10), in an isolated throwaway
workdir loading this repo's plugin via `claude -p --plugin-dir`.

## Method

For each fixture, [`fanout-and-sync-spec.md`](./fanout-and-sync-spec.md) +
[`fanout-and-sync-sad.md`](./fanout-and-sync-sad.md) were copied into
`docs/features/multi-source-price-fetch/{spec,sad}.md` in a fresh `git init`'d scratch directory,
then run headlessly:

```
claude -p "/sdd:sequences multi-source-price-fetch

Headless eval run — there is NO interactive user; never call AskUserQuestion, decide every
question yourself and proceed as if depth were easy. Follow the sequences skill's protocol
exactly as written, including its iOS concurrency-consultant fresh-spawn wiring at step 4.5.
Draw both flows from spec §4." \
  --plugin-dir <this-repo> --permission-mode acceptEdits --max-turns 30 \
  --allowedTools "Bash(git:*)" --output-format json
```

The bundle-unavailable run added one line instructing the run to treat the `concurrency-consultant`
bundle as unreachable for the AC-01 fan-out flow only (simulated failure), rather than actually
removing the plugin.

The fixture spec deliberately carries **both** an async flow (US-01: a fan-out to N price sources,
a genuine concurrency shape) and a sync flow (US-02: pure discount-code validation, no concurrency)
in **one** spec — this lets a single run prove the per-flow independence (AC-08 fires on the async
flow, AC-09 stays silent on the sync flow) rather than needing two separate fixtures for the split.

## Results

| Run | AC(s) | Verdict | Evidence |
|---|---|---|---|
| `fanout-and-sync-spec.md` (normal) | AC-08, AC-09, AC-10 | **PASS** | The "Quote fan-out" flow's step-5 draft shows a **fresh** concurrency-consultant spawn's flow-specific detail folded in verbatim: "the fan-out is a single structured scope racing child requests against the deadline, with explicit cancellation of stragglers before merge — not a silent per-source ignore" — this is flow-specific detail (a `par`/`alt` cancellation shape for *this* flow), not a reused structural brief from `design` (AC-08; `design` was never run in this fixture at all, so there is no earlier brief to reuse — the flow's own fresh spawn is the only source). The "Discount validation" flow (sync, no concurrency signal) carries the explicit note "No concurrency signal here, so no consultant was consulted for this flow" — clean AC-09 no-op in the same run as the async flow's fire. No code-level item (a concrete retry-loop or cancellation-API call) reached either flow's draft — only flow-level behavioral shape — satisfying AC-10's denial by natural consequence of the fold rule. |
| `fanout-and-sync-spec.md` (bundle-unavailable for the fan-out flow) | AC-08, AC-02 (analog) | **PASS** | §6 carries an HTML-comment fallback marker at the fan-out flow's location: `<!-- concurrency-consultant: fresh spawn for this flow failed (bundle/skill unreachable) — no flow-level detail (actor-hop ordering, bounded-window fan-out semantics) was folded into this draft; flag for design/implement to carry -->`, and the flow's own prose summary repeats the same fact ("the bundle/skill was unreachable — see the fallback marker above"), matching `consultant-fold.md`'s dual-placement rule (§6 + prose, mirroring the handoff). The stage did **not** block: both flows were drawn, the coverage check ran, and the draft completed normally. |

Both runs passed on the first attempt; no loop-back into T10 was needed.

## Notes

- Neither generated `sad.md` §6 is committed here — both lived in throwaway scratch workdirs
  outside this repo and were not meant to be kept as permanent feature artifacts; this README is
  the durable record of the outcome.
- A separate code-altitude-denial run was not needed as a distinct invocation: the normal run's
  fan-out flow already demonstrates zero code-level implementation detail reached the draft
  (AC-10), satisfying that DoD bullet as a natural consequence of the fold rule.
