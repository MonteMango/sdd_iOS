---
id: T3
title: "Retrofit design/SKILL.md to reference the shared files + agent files"
layer: "app"
deps: ["T1", "T2"]
acs: ["AC-04"]
files_hint: ["skills/design/SKILL.md"]
owner: "Fork maintainer"
estimate: "S"
status: "todo"
---

# T3 — Retrofit design/SKILL.md to reference the shared files + agent files

## Why

ADR-0003: two parallel descriptions of the identical consultant (one in `design`'s own prose, one in the new `agents/*.md` files) is exactly the resolution-divergence risk AC-04 exists to close — the retrofit is behavior-preserving, only *where the instructions live* changes. Derives from [spec AC-04](../spec.md), [sad §4](../sad.md), [ADR-0003](../adr/0003-dedicated-consultant-agent-files.md).

## What

In `skills/design/SKILL.md` step 3.5: replace the inline consultant description with a reference to `agents/swiftui-consultant.md` / `agents/concurrency-consultant.md` (`subagent_type: "swiftui-consultant"` / `"concurrency-consultant"`, fallback `general-purpose`) — same trigger, same spawn timing (concurrent with step 3), same non-roster invariant. Step 6: repoint `[./references/consultant-trigger.md]` and `[./references/consultant-fold.md]` to `../_shared/consultant-trigger.md` / `../_shared/consultant-fold.md`. Update the References section (bottom of `SKILL.md`) accordingly. No other behavior change — `design`'s trigger, fold, and fallback-marker logic stay exactly as shipped.

## Definition of Done

- [ ] Step 3.5 dispatches by name against `agents/swiftui-consultant.md` / `agents/concurrency-consultant.md`; `agents:` frontmatter at the top of `SKILL.md` stays exactly `[explorer, critic]`.
- [ ] All `./references/consultant-{trigger,fold}.md` links in `SKILL.md` now point to `../_shared/consultant-{trigger,fold}.md` and resolve (file exists at that path).
- [ ] A fixture run of `design` on a UI/async spec still behaves identically to pre-retrofit (same consultant fires, same fold, same fallback-marker text) — spot-checked against the `design-swift-consultants` fixture evidence.

## Notes

Compile-coupled with [T2](./t2-consultant-agent-files.md) only in the sense of read-order (the agent files must exist before this task's references are meaningful) — no shared file, so no lane serialization beyond the `deps` ordering.
