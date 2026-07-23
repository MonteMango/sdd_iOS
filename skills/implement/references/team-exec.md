# Agent-team execution (`team_mode: true`)

When the decision tree selects the team, the engine becomes a **lead** coordinating three roles through a shared task list, one git worktree per agent, with commits serialized by the lead. Use this for features with genuine parallel width and a desire for an independent review pass.

## Roles (the shipped subagents)

Spawn each by its plugin-namespaced `subagent_type` — `sdd:test-author`, `sdd:implementer`, `sdd:reviewer` (see [`../../_shared/agent-roster.md`](../../_shared/agent-roster.md) §Dispatching).

- **[`test-author`](../../../agents/test-author.md)** (`sdd:test-author`) — RED only. Writes the failing test(s) for a task's `acs`, runs them, classifies the first run (GOOD/BAD/false-pass/NON-red per [`tdd-loop.md`](./tdd-loop.md)), and hands over the quoted failing line. Never writes production code.
- **[`implementer`](../../../agents/implementer.md)** — GREEN + REFACTOR + GATE. Takes a task with its red test, writes the minimal code to pass, refactors while green, runs the per-task gate. Never weakens the test.
- **[`reviewer`](../../../agents/reviewer.md)** — read-only. Two stages: stage-1 spec/AC compliance (does the change satisfy the `acs` it claims?), stage-2 quality (conventions, edge cases, anti-patterns). Has no write tools.

## Setup

1. Create the team (`TeamCreate`). Seed a shared **TaskList** from `tasks.json` — **the full task text goes in each task body** (title, `acs` text pulled from spec §5, `dod`, `files_hint`). Teammates do NOT read the plan or the conversation; the task body is their whole brief.
2. Give each agent its own git **worktree** under `.worktrees/<agent>` (`isolation: worktree` is required for the team — the guard enforces it). No two agents share a tree.
3. Set per-role **model + effort** from `model_*` / `effort_*` + the `.size` scaling, and export the env vars for the dispatch — all per [`../../_shared/agent-roster.md`](../../_shared/agent-roster.md) (roster defaults: test-author/implementer `sonnet`+`medium`, reviewer `opus`+`high`). Print the resolved per-role model+effort in the banner.

## iOS consultant precompute (task-scoped, before dispatch)

`test-author`/`implementer` cannot spawn a consultant themselves — no `Skill` tool, and the lead
owns fan-out (ADR-0001). So the precompute happens **here, at TaskList-body generation**, before
any teammate is dispatched:

1. For **each task**, run [`../../_shared/consultant-trigger.md`](../../_shared/consultant-trigger.md)'s
   detection against that task's own title + `acs` + `dod` (the `implement` row of its per-stage
   table) — never the whole `tasks.json`, never another task's text.
2. On a detected signal, spawn the matching consultant(s) (`agents/swiftui-consultant.md` /
   `concurrency-consultant.md` / `swift-testing-consultant.md`) scoped to that one task's own
   text, fold the returned brief at `implement`'s own altitude — full-code, per
   [`../../_shared/consultant-fold.md`](../../_shared/consultant-fold.md) — and **bake the folded
   brief into that task's own TaskList body**. A brief is never shared across tasks: two
   differently-signalled tasks (or a signalled + an unsignalled task) in the same run get
   different (or absent) bodies (AC-02).
3. A task with no detected signal gets no brief — this needs no extra code, since step 1's
   detection gate is already the structural no-op (AC-09).
4. **Fallback marker.** If an expected consultant doesn't fire, or fires but no item survives the
   full-code altitude filter, add a per-task line to that task's own TaskList body noting the
   miss (the wording template in `consultant-fold.md`) and mirror it in the stage-handoff's *What
   I did* (one line per affected task) — this never blocks that task's dispatch (ADR-0004).
5. `test-author` and `implementer` (`agents/test-author.md`, `agents/implementer.md`) are
   **unedited** by this precompute — the brief (or its fallback marker) arrives folded into the
   TaskList body they already read as their whole brief; no new tool, no new prompt injection
   point on their side (AC-05, spec §3 non-goal 7).

## Flow per task

`test-author` (RED) → `implementer` (GREEN+REFACTOR+GATE) → `reviewer` (review). A task advances only when its `deps` are `done`. The lead pulls ready tasks off the DAG and assigns them; up to `max_parallel_agents` run at once.

## Serialization lanes (the lead enforces)

Even with worktrees, some tasks must not run concurrently:

- **`layer: migration`** — migrations are an ordered sequence (e.g. golang-migrate's numbered files); run them one at a time, in order. Each migration task first **promotes** its staged `docs/features/<slug>/migrations/<NN>_*` file into the live tree (next free number, in ordinal order) before applying it — see [`./inputs.md`](./inputs.md).
- **Overlapping `files_hint`** — two tasks that touch the same file run in the same lane (serialized), or the second rebases on the first. Compute lanes from `files_hint` intersections up front.
- **Compile-coupled pair** — a shared-contract change + its implementer(s) share the contract file in `files_hint`, so they land in one lane by the rule above; additionally the lead gives the pair a synthetic dep (contract → implementer) and closes it with **one shared gate + one commit** carrying every task's `SDD-Task`/`SDD-AC` trailers ([`tdd-loop.md`](./tdd-loop.md) §COMMIT) — neither task is separately committable green.

Tasks in different lanes with satisfied deps run in parallel; tasks in the same lane queue.

## Commits

The lead **serializes commits in dependency order** regardless of when the work finished — pull each agent's worktree changes for a `done` task and commit them on the feature branch with the `SDD-Task`/`SDD-AC` trailers ([`tdd-loop.md`](./tdd-loop.md)). The history is linear and bisectable even though the work was concurrent.

## Don't over-orchestrate

- **<4 tasks → no team.** The eligibility check already forbids it; if you somehow got here with a tiny DAG, downgrade to sequential. Coordination overhead exceeds the gain.
- A red that survives escalation in one lane follows `stop_on_red`: halt the whole team, or drop that task + auto-block its dependents and let other lanes finish ([`escalation.md`](./escalation.md)).
- Tear the team down at the end; remove worktrees (they auto-clean if unchanged).
