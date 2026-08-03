# Pipeline usage log — scratch-log-walkthrough

### Specify

- **Agent count:** 1 (Agent-tool dispatches, not distinct agent types)
- **Approach/mode:** easy-depth interview (no ideation suite — depth-gated skip), one `sdd:critic` dispatch (F1-F6 checklist), PASS with one non-blocking nit accepted as-is
- **Sub-agent tokens:** 12,381 tokens (sub-agent-only — excludes orchestrator/main-session overhead)
- **Duration:** 25s (agent-time — summed per-dispatch duration, not wall-clock)

### Design

- **Agent count:** 1 (Agent-tool dispatches, not distinct agent types)
- **Approach/mode:** brownfield (read existing `docs/architecture-map.md`, no explorer re-dispatch), no UI/async consultant fired (no trigger signal in spec), `target_surfaces: [library-sdk]` decided inline (0-of-3 blast radius, 0 ADRs), one `sdd:critic` finalize dispatch, PASS
- **Sub-agent tokens:** 14,333 tokens (sub-agent-only — excludes orchestrator/main-session overhead)
- **Duration:** 40s (agent-time — summed per-dispatch duration, not wall-clock)

### Tasks

- **Agent count:** 0 (Agent-tool dispatches, not distinct agent types)
- **Approach/mode:** single-task breakdown (XS scope, no subagent dispatch — `tasks`'s own protocol never dispatches one)
- **Sub-agent tokens:** 0 tokens (sub-agent-only — excludes orchestrator/main-session overhead)
- **Duration:** 0s (agent-time — not wall-clock)

### Implement

- **Agent count:** 0 (Agent-tool dispatches, not distinct agent types)
- **Approach/mode:** sequential single-agent TDD (mode-aware capture per ADR-0002: sequential mode sums `Agent`-tool `<usage>` dispatches — this run made none, so the honest figure is 0, not a fake value); T1 RED (`Cannot find module '../duration.ts'`) → GREEN (5/5 tests pass) → gate clean (102/102 suite, tsc --noEmit clean)
- **Sub-agent tokens:** 0 tokens (sub-agent-only — excludes orchestrator/main-session overhead)
- **Duration:** 0s (agent-time — not wall-clock)

### Review

- **Agent count:** 1 (Agent-tool dispatches, not distinct agent types)
- **Approach/mode:** one `sdd:reviewer` dispatch, stage 1 (AC compliance) + stage 2 (quality); PASS with one non-blocking finding (deferred to a pre-ship fix)
- **Sub-agent tokens:** 15,209 tokens (sub-agent-only — excludes orchestrator/main-session overhead)
- **Duration:** 39s (agent-time — summed per-dispatch duration, not wall-clock)

### Fix

- **Agent count:** 2 (Agent-tool dispatches, not distinct agent types; cumulative across 2 fix runs)
- **Approach/mode:** cumulative across a pre-ship fix (triage: regression, AC-03, real `sdd:explorer` dispatch) and a post-ship fix (triage: gap/test-coverage, AC-02/AC-06, dispatch usage simulated-unavailable per `pipeline-usage-log/spec.md`'s Test plan for AC-04 — see `_fixes/2026-08-04-boundary-confidence-check.md`'s dispatch note); post-ship run also refreshed the rollup below (AC-07)
- **Sub-agent tokens:** 8,578 tokens (sub-agent-only; 1 of 2 dispatches unavailable — excluded from this total)
- **Duration:** 11s (agent-time; 1 of 2 dispatches unavailable — excluded from this total)

### Ship

- **Agent count:** 0 (Agent-tool dispatches, not distinct agent types)
- **Approach/mode:** `ship`'s own protocol makes no `Agent`-tool dispatch; final verification done directly (gate re-run 102/102 + tsc clean; 4 of 6 §5 ACs spot-checked for real via a direct call). No PR opened / no roadmap entry added — disposable walkthrough vehicle, never intended to merge.
- **Sub-agent tokens:** 0 tokens (sub-agent-only — excludes orchestrator/main-session overhead)
- **Duration:** 0s (agent-time — not wall-clock)

### Rollup

- **Total agent count:** 5
- **Total sub-agent tokens:** 50,501 tokens (sub-agent-only — excludes orchestrator overhead)
- **Total duration:** 115s (agent-time — not wall-clock)
- **Excluded from token/duration total:** Fix — 1 of 2 dispatches unavailable
- **Backbone stages with no section:** none
