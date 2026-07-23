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
gate_lint: false
gate_vet: true
require_integration: never
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

Variant used by the `implement-ios-consultant` fixture's **settings-conflict** run
(T-D only). Same SEQUENTIAL clamp as `single.claude-sdd.local.md`, but
`require_integration: never` + `gate_lint: false` are the project settings the
swift-testing-consultant's returned brief must be reconciled against at fold time
(`consultant-fold.md` §Project-rules-win): the consultant recommended an
integration-level concurrency test against a live dependency, which these settings
reject — the fold wrote an in-process unit-level `TaskGroup` test instead, proving
AC-06 (project wins on conflict).
