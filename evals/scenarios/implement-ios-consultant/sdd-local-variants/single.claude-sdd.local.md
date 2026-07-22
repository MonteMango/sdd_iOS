---
interview_depth: medium
artifact_language: en
tdd: true
team_mode: false
workflow_mode: auto
max_parallel_agents: 1
isolation: inplace
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

Variant used by the `implement-ios-consultant` fixture's **single-agent** run
(evals/scenarios/implement-ios-consultant/README.md). `max_parallel_agents: 1` +
`isolation: inplace` clamps the decision tree to SEQUENTIAL regardless of DAG shape —
this is the baseline run proving per-task consultant precompute + fold in the
single-agent inline-consult code path (`tdd-loop.md`).
