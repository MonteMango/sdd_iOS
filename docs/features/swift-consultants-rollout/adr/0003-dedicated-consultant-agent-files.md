---
status: Accepted
owner: "Vitalii Lytvynov"
reviewers: ["Tech Lead"]
updated_at: "2026-07-20"
feature_size: "L"
ticket: "swift-consultants-rollout"
---

# 0003 — Ship dedicated consultant agent files in the fork's own `agents/`, retrofit `design` to reference them

- **Status:** Accepted
- **Date:** 2026-07-20
- **Deciders:** Architect + Pipeline operator (Socratic walk)

## Context

`design-swift-consultants` shipped the consultant entirely in prose: `skills/design/SKILL.md:48` describes the spawn as "a plain `Agent`/Task call that loads the corresponding third-party expert skill bundle" — no `subagent_type`, no `agents/*.md` file. This feature is the first to wire *five* stages (`design`, `implement`, `plan-tests`, `review`, `sequences`) to the same three consultant classes; without a single definition, each stage would need to restate the consultant's prompt shape, its altitude-filter wording, and its project-rules-win instruction in its own prose — the same drift risk `glossary`'s two-level contract exists to prevent, applied to agent prompts instead of domain terms.

## Decision drivers

- AC-04 (US-06) — consultant definitions must resolve identically wherever the plugin is installed, via the fork's own `agents/` directory.
- Spec §1 traceability — resolution-divergence (an ideation-pass finding) explicitly drove this decision toward a fork-owned `agents/` file over a project-local `.claude/agents/` one, so the definition travels with the plugin.
- Five stages now share three consultant classes — a single prompt/altitude-filter source avoids five copies drifting independently across upstream merges.
- The existing invariant (ADR-0003 in `design-swift-consultants`): a consultant must never enter any skill's `agents:` frontmatter, or `validate_plugin.py` fails.

## Considered options

1. **Create `agents/swiftui-consultant.md`, `agents/concurrency-consultant.md`, `agents/swift-testing-consultant.md`; retrofit `design` step 3.5 to reference them too** — one prompt/altitude-filter/rules-win source, read by all five stages; each file is dispatched by name in prose (`subagent_type: "swiftui-consultant"`, fallback `general-purpose`), never listed in any `agents:` frontmatter.
2. **Create the three files, but leave `design` untouched** — the four new stages read the files; `design` keeps its own ad-hoc prose description of the same behavior.
3. **Keep everything ad-hoc, prose-only, per stage** — rejected: directly contradicts AC-04, which requires the definitions to live in dedicated files.

## Decision outcome

**Chosen:** Option 1. Two parallel descriptions of the identical consultant (Option 2) is exactly the resolution-divergence risk the spec's own traceability names as the reason for AC-04 — the retrofit is a small, behavior-preserving edit (`design` still spawns the same way; only *where the instructions live* changes) that closes that risk instead of only half-closing it for the four new stages.

## Consequences

**Positive**
- One canonical prompt template + altitude-filter wording + project-rules-win instruction per consultant class, read by all five stages — a wording fix (e.g. sharpening the altitude-filter language) now lands once, not five times.
- `design`'s own behavior is unchanged from the outside (same trigger, same spawn, same fold) — the retrofit only relocates *where* the instructions are written.

**Negative**
- Touches `skills/design/SKILL.md` again, a file `design-swift-consultants` only just shipped — a second PR touching the same high-churn file inside one merge window, slightly raising near-term upstream-merge-conflict odds.
- Three new files to keep in sync with `validate_plugin.py`'s roster check on every future consultant-class addition (the check that they're *never* added to `agents:` becomes a five-stage discipline, not a one-stage one).

**Neutral**
- The dispatch mechanism itself (`subagent_type` by prose name, `general-purpose` fallback) is unchanged — only the *content* of what's dispatched moves from inline prose to a referenced file.

## Links

- Spec: [[../spec.md]] (US-06, AC-04)
- SAD: [[../sad.md]] §4, §5
- Related ADR: [[0001-hybrid-task-scoped-pre-consult]], [[0002-pre-consult-injection-for-subagent-only-stages]]
