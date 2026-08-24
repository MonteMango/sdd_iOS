# Dynamic-workflow execution (`workflow_mode: auto`)

When the decision tree selects the workflow, the engine **generates a `Workflow` script** from the DAG and runs it. This is the unattended, maximally-parallel mode: each independent task flows through its own pipeline, and a failure drops only that task's subtree while other branches keep going.

## Why a generated workflow (not a fixed one)

The shape of the work is `tasks.json` — different every feature. So the engine emits a script tailored to this DAG: validate → layer → fan-out → per-task pipeline. The script is data-driven from the tasks array; the engine fills it in and invokes `Workflow`.

## iOS consultant precompute (task-scoped, before script generation)

A generated `Workflow` script's sandbox exposes only `agent()`/`parallel()`/`pipeline()` — no
`Skill` tool — so a script stage can never self-consult (ADR-0001). The precompute happens **here,
in the main session, before the script is built**:

1. For **each task**, run [`../../_shared/consultant-trigger.md`](../../_shared/consultant-trigger.md)'s
   detection against that task's own title + `acs` + `dod` (the `implement` row of its per-stage
   table) — never the whole `tasks.json`.
2. On a detected signal, spawn the matching consultant(s) scoped to that one task, fold at
   `implement`'s full-code altitude ([`../../_shared/consultant-fold.md`](../../_shared/consultant-fold.md)),
   and embed the result as that task's own `consultant_brief` field on the inlined `TASKS` entry —
   never a value shared across tasks (AC-02). A task with no signal gets `consultant_brief: null`.
3. **Fallback marker.** If an expected consultant doesn't fire, or fires but no item survives the
   full-code altitude filter, `consultant_brief` carries the marker text (the wording template in
   `consultant-fold.md`) instead of a brief, so it still surfaces inside the generated prompt and
   the run log; mirror it in the stage-handoff's *What I did*. This never blocks that task's
   pipeline (ADR-0004).
4. `test-author`/`implementer` (`agents/test-author.md`, `agents/implementer.md`) are **unedited**
   by this precompute — the brief (or its marker) arrives already interpolated into `redPrompt(t)`
   below; no new tool, no new injection point on their side (AC-05, spec §3 non-goal 7).

## Generated script shape

> **Gotcha — `pipeline()` always resolves to an array.** `pipeline(items, ...)` resolves to one entry per item, even when `items` holds exactly one element — `pipeline([t], ...)` still resolves to a 1-element array, never the bare final-stage verdict. Consuming code must destructure it (`.then(([res]) => ...)`), not treat it as a bare object. This bites in two compositions that have both actually shipped bugs: (1) the bare per-task `pipeline([t], ...).then()` shown below, and (2) `parallel(layer.map(t => () => pipeline([t], ...)))` spread into one list one level up (e.g. `results.push(...layerResults)`) — each `pipeline([t], ...)` call inside that map still returns its own 1-element array before the spread flattens it. A dropped task (a stage failed past retries) resolves to a falsy array element (`null`), never a rejected promise, so no `.catch()` is needed around the per-task `.then()`.

```js
export const meta = {
  name: 'sdd-implement-<slug>',
  description: 'TDD-implement <slug> from tasks.json (dynamic DAG)',
  phases: [{ title: 'Implement' }, { title: 'Review' }],
}

// tasks + deps + each task's own precomputed consultant_brief (or null) are inlined by the engine
const TASKS = /* [{id, title, acs, dod, files_hint, deps, layer, consultant_brief}, ...] */;

// redPrompt(t) interpolates t.consultant_brief into the dispatched test-author's own prompt —
// a signalled task renders a consultant section (brief text or fallback-marker line); an
// unsignalled task (consultant_brief === null) renders with no consultant section at all (AC-09).

// Kahn layers → phases; within a layer, fan out up to the parallel cap.
// Each task is one independent pipeline: write-test → implement → verify → [review] → commit.
const done = new Set();
for (const layer of kahnLayers(TASKS)) {              // computed from deps
  await parallel(layer.map(t => () =>
    pipeline([t],
      () => agent(redPrompt(t),     { phase:'Implement', label:`red:${t.id}`,   schema: RED_VERDICT }),
      r  => agent(greenPrompt(t,r), { phase:'Implement', label:`green:${t.id}`, schema: GATE_VERDICT }),
      g  => agent(verifyPrompt(t,g),{ phase:'Implement', label:`verify:${t.id}`,schema: GATE_VERDICT }),
      v  => agent(reviewPrompt(t,v),{ phase:'Review',    label:`review:${t.id}`,schema: REVIEW_VERDICT }),
    ).then(([res]) => {
      if (res == null) return null                // dropped past retries — filter(Boolean)-safe
      if (res.ac_satisfied) done.add(t.id)         // only the final review verdict authorizes done — never an earlier gate_green
      return { t, res }                            // resolved review, satisfied or not (AC-03b) — never nulled
    })
  ))
}
```

- **Schema-validated verdicts.** Each stage returns a structured verdict (`RED_VERDICT { class: GOOD|BAD|false_pass|NON, failing_line }`, `GATE_VERDICT { unit, integration, lint, vet, gate_green }`, `REVIEW_VERDICT { ac_satisfied, issues[] }`) so the orchestrator branches on data, not prose.
- **Fail drops the subtree.** A stage that throws (or returns `gate_green: false` / `ac_satisfied: false` past retries) drops that task to `null`; the engine removes it from `done`, so every transitively-dependent task is skipped (its deps never complete) — **not yet implemented, in this fork or upstream; tracked as spec §8 OQ-1 of `workflow-pipeline-unwrap-fix`**, so don't mistake this sentence for delivered behavior. Independent branches finish unaffected — this is the workflow's advantage over a team halt.
- **Parallel cap.** `parallel(...)` respects `max_parallel_agents` (the workflow runtime also caps concurrency); a wide layer queues the overflow.

## Serialization inside the workflow

The same lanes as the team apply: `layer: migration` tasks are forced into a single ordered sub-sequence (don't place two migrations in the same parallel layer — chain them via synthetic deps before computing Kahn layers), and tasks with overlapping `files_hint` get a synthetic dep so they never land in the same parallel batch. A **compile-coupled pair** (shared contract file in `files_hint`) gets the same synthetic dep AND its commit step is merged — one shared gate, one commit with every task's `SDD-Task`/`SDD-AC` trailers ([`tdd-loop.md`](./tdd-loop.md) §COMMIT). Each migration task **promotes** its staged `docs/features/<slug>/migrations/<NN>_*` file into the live `migrations/` (next free number, in ordinal order) before applying it — see [`./inputs.md`](./inputs.md).

## Commit + integration

- Commits are produced by the `commit` step of each pipeline (or batched by the engine after the workflow returns, if `auto_commit: per_phase`), with `SDD-Task`/`SDD-AC` trailers, serialized in dependency order.
- Integration tier follows `require_integration`: in CI (Docker present) the integration RED→GREEN runs inside the verify stage; locally under `auto` with no Docker it's NON-red and the proving run relies on CI for the integration green.

## Graceful fallback

If the `Workflow` tool is **not available** at runtime, this whole mode is skipped by the decision-tree guard — the engine falls through to the team (if eligible) or to sequential single-agent TDD. The generated script is never a hard dependency.
