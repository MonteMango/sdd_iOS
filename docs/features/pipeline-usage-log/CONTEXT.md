---
status: Living
updated_at: "2026-07-23"
---

# Domain Context — pipeline-usage-log

## Glossary

- Sub-agent tokens — the per-dispatch token count reported in an `Agent`-tool dispatch's completion `<usage>` block (`subagent_tokens`/`tool_uses`/`duration_ms`), the only token-spend a skill's markdown instructions can observe. NOT total phase cost — the orchestrator's own token spend (reasoning, file reads/writes, non-delegated tool calls in the main session) is not exposed to skill instructions and must never be conflated with it.
