---
interview_depth: medium
artifact_language: en
tdd: true
team_mode: true
workflow_mode: auto
max_parallel_agents: 3
isolation: worktree
stop_on_red: true
max_red_retries: 3
gate_lint: true
gate_vet: true
require_integration: auto
auto_commit: per_task
branch_strategy: current
cmd_test_unit: ""
cmd_test_integration: ""
cmd_lint: ""
cmd_vet: ""
model_test_author: sonnet
model_implementer: sonnet
model_reviewer: opus
judgment_model: opus
effort_test_author: medium
effort_implementer: medium
effort_reviewer: high
dashboard_enabled: false
dashboard_port: 4178
---

Variant used by the `implement-ios-consultant` fixture's **team-mode** run. `team_mode: true`
+ `isolation: worktree` + `max_parallel_agents: 3` makes the fixture's 4-task DAG
`parallel_eligible` per the decision tree, dispatching AGENT TEAM (`TeamCreate`) — proving
`team-exec.md`'s task-scoped consultant precompute. In this eval harness `TeamCreate` is
unavailable inside a nested headless subprocess, so the engine's own graceful-degrade guard
fell through to sequential (documented in the fixture README as an environment limit, not a
wiring defect).
