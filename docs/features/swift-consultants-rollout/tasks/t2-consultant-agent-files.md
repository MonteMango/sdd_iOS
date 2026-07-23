---
id: T2
title: "Write the 3 dedicated consultant agent files under agents/"
layer: "domain"
deps: ["T1"]
acs: ["AC-04"]
files_hint: ["agents/swiftui-consultant.md", "agents/concurrency-consultant.md", "agents/swift-testing-consultant.md"]
owner: "Fork maintainer"
estimate: "M"
status: "todo"
---

# T2 — Write the 3 dedicated consultant agent files under agents/

## Why

ADR-0003: a single prompt/altitude-filter/project-rules-win source per consultant class, read by all five stages, instead of five stages each restating the same instructions in prose. Derives from [spec AC-04](../spec.md), [sad §4/§5](../sad.md), [ADR-0003](../adr/0003-dedicated-consultant-agent-files.md).

## What

Create `agents/swiftui-consultant.md`, `agents/concurrency-consultant.md`, `agents/swift-testing-consultant.md`. Each file: a disposable, `worker`-shaped agent definition (frontmatter matching the repo's existing `agents/*.md` convention — check `agents/critic.md` / `agents/explorer.md` for the shape) whose prompt template (a) loads the matching third-party expert bundle (`swiftui-expert`, `swift-concurrency`, `swift-testing-expert`), (b) reasons over whatever scope the calling stage passes in (feature spec / task text / AC / diff / flow — parameterized, not hardcoded to one stage), (c) states the altitude-filter wording *per calling stage* (structural for `design`, task-scoped full-code for `implement`, test-matrix for `plan-tests`, quality-bar for `review`, flow-detail for `sequences` — read from `../_shared/consultant-fold.md`), (d) carries the project-rules-win instruction (the consuming project's `CLAUDE.md`/rules always override generic advice), (e) returns a ≤1-page brief. None of these three files is added to any skill's `agents:` frontmatter — dispatch is by prose (`subagent_type: "swiftui-consultant"`, fallback `general-purpose`) only.

## Definition of Done

- [ ] All 3 files exist under `agents/`, following the repo's existing agent-definition frontmatter shape.
- [ ] Each file's prompt template is parameterized by calling-stage scope, not hardcoded to `design`.
- [ ] Each file states its own bundle name, the project-rules-win instruction, and points to `../_shared/consultant-fold.md` for the altitude-filter wording table.
- [ ] `grep -rn "swiftui-consultant\|concurrency-consultant\|swift-testing-consultant" skills/*/SKILL.md` shows zero matches inside any `agents:` frontmatter block (prose references land in later tasks, not yet).

## Notes

This is the AC-04 domain invariant's other half — [T12](./t12-ac04-gate-verification.md) proves the negative (`validate_plugin.py` still passes) once all 5 stages' prose references exist.
