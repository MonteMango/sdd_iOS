---
interview_depth: medium
artifact_language: en
tdd: true
team_mode: false
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

Variant used by the `implement-ios-consultant` fixture's **workflow-mode** run.
`team_mode: false` + `workflow_mode: auto` + `isolation: worktree` +
`max_parallel_agents: 3` makes the fixture's DAG `parallel_eligible` with team ineligible,
dispatching DYNAMIC WORKFLOW (`Workflow`) — proving `workflow-exec.md`'s generated-script
task-scoped `consultant_brief` precompute (captured directly from the denied `Workflow` call's
`script` argument in this eval harness, where the tool itself is unavailable inside a nested
headless subprocess).
