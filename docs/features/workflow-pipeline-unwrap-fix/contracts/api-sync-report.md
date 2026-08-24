# API contract — workflow-pipeline-unwrap-fix

**No contract generated — no external interface.**

`target_surfaces: ["cli"]` in `sad.md` frontmatter records which C4 container (`Skills pipeline`) owns the edited artifact, not a real command-line surface: sad.md §4 decision 1 states explicitly the fix "adds no new command, no flag, no exit code" (`Фикс не добавляет ни новой команды, ни флага, ни exit-кода`), and spec.md §6.1 confirms "the file has no externally reachable surface" (`N/A — the file has no externally reachable surface`). The change is a worked-example correction inside `skills/implement/references/workflow-exec.md` — markdown consumed by the SDD engine (Claude) at `/sdd:implement` time, not a CLI command/flag/exit-code surface.

Per the `api` skill's own N/A condition ("no external interface (pure internal logic) → skip with a one-line note in the report; go straight to `tasks`"), this run self-skips contract generation.

**Next:** `/clear`, then `/sdd:tasks workflow-pipeline-unwrap-fix`.
