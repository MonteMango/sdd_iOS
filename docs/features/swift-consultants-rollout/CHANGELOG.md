# Changelog — swift-consultants-rollout

## swift-consultants-rollout — guaranteed iOS expertise across implement, plan-tests, review, sequences

**What:** The expert-consultant pattern `design-swift-consultants` proved on `design` now fires
automatically on the four remaining stages where iOS/Swift expertise matters for shipped code:
`implement` (all three execution modes — single-agent, team, workflow), `plan-tests`
(introducing a third consultant class, the testing consultant, for the first time), `review`
(all three consultant classes, gated by diff signal), and `sequences` (a fresh
concurrency-consultant spawn independent of `design`'s earlier structural brief). Two mechanisms
extend the pattern rather than copy it: task-scoped pre-consult for `implement`'s parallel modes
(each dispatched worker gets a brief scoped to its own task, not one shared brief), and
pre-consult injection for the two sub-agent-only stages (`review`; `implement` team/workflow) —
since a restricted sub-agent can't itself spawn a sub-agent, the main session consults first and
pastes the brief into the dispatch prompt. Consultant agent definitions now ship inside the
fork's own `agents/` directory so they resolve identically wherever the plugin is installed.
Every stage's fold stays altitude-correct (test-matrix shape for `plan-tests`, flow-specific
detail for `sequences`, quality-bar findings for `review`, full code for `implement`), and every
stage surfaces a visible, non-blocking fallback marker when an expected consultant doesn't fire
or returns nothing usable.

**Why:** [spec.md](spec.md) §1 — `design-swift-consultants`'s own non-goals deferred these four
stages as "roadmap Next" once the pattern proved out; the ROI-ranked order was already fixed in
`SDD-FORK-PLAN.md` §5.0 (`implement` MAX → `plan-tests`/`review` HIGH → `sequences` Tier-2).
Deferring further meant code, tests, and review kept shipping without the same guaranteed
expertise the architecture document already gets. Key decisions:
[ADR-0001](adr/0001-hybrid-task-scoped-pre-consult.md) (task-scoped pre-consult for `implement`'s
parallel modes), [ADR-0002](adr/0002-pre-consult-injection-for-subagent-only-stages.md)
(pre-consult injection for sub-agent-only stages), [ADR-0003](adr/0003-dedicated-consultant-agent-files.md)
(consultant definitions move to the fork's own `agents/` directory, never the validated `agents:`
roster), [ADR-0004](adr/0004-shared-consultant-trigger-fold.md) (one shared trigger + fold
reference reused across stages), [ADR-0005](adr/0005-review-trigger-and-gate.md) (`review`'s
AND-gated pre-consult + diff-visible signal detection).

**How to use:** Run `/sdd:plan-tests`, `/sdd:implement`, `/sdd:review`, or `/sdd:sequences` as
usual. Each stage detects its own trigger signal (UI/async/test-strategy) from what it already
reads — the AC text for `plan-tests`, the task's own text for `implement`, the diff for
`review`, the flow being drafted for `sequences` — and consults the matching consultant(s)
automatically; a no-signal run spawns nothing and costs nothing (AC-09). A missing or degenerate
consultant never blocks the stage — it leaves a visible marker on that stage's own output surface
instead (test-plan.md / the stage handoff / the review record / sad.md).

**Operational notes:**
- Migration: `<!-- none -->`.
- Feature flag / config: `<!-- none -->` — always-on wiring for any repo running this fork; no
  toggle. `review`'s exact diff-visible trigger discriminator and the no-cap consultant-cost
  policy stay open questions monitored post-wiring (see [spec.md](spec.md) §8).
- Rollback: revert the feature's commits — markdown-protocol and agent-definition changes only,
  no schema/migration to unwind.

**Acceptance criteria delivered:** AC-01 (testing-consultant fires in `plan-tests` on a detected
test-strategy signal, folded at test-matrix altitude), AC-02 (task-scoped brief in `implement`,
different tasks get different or no briefs), AC-03 (visible fallback marker in the review record
when an expected `review` consultant can't be consulted or returns nothing citable), AC-04
(consultant agent definitions live in the fork's own `agents/` directory, never the validated
`agents:` roster — the plugin-validation gate enforces this as a negative check), AC-05
(pre-consult injection: the main session consults before dispatching `review` / team-or-workflow
`implement`, then pastes the brief into that sub-agent's prompt), AC-06 (the testing consultant's
brief is reconciled against the project's own governing test settings — those settings win on
conflict), AC-07 (`review` fires all three signalled consultants together, each finding cited to
a file+line with the same blocking weight as any other finding), AC-08 (`sequences` spawns its
own fresh concurrency-consultant call, independent of `design`'s earlier brief), AC-09 (no signal
→ no consultant, no bundle load, no cost, across `plan-tests`/`review`/`sequences`), AC-10 /
AC-10b (a code-altitude item is denied entry to `plan-tests`/`sequences`'s artifact; a
structural/architectural item is denied entry as a `review` finding — both left for the
appropriate downstream stage to carry).
