---
id: T7
title: "Verify AC-04 — plugin-validation roster invariant"
layer: "tests"
deps: ["T3", "T6"]
acs: ["AC-04"]
files_hint: ["scripts/validate_plugin.py", "skills/design/SKILL.md", "agents/"]
owner: "Fork maintainer"
estimate: "S"
status: "todo"
---

# T7 — Verify AC-04 — plugin-validation roster invariant

## Why

Derives from [spec §5 AC-04](../spec.md), [sad §4 decision 3 (ADR-0003)](../sad.md), [sad §6 Critical flow 5](../sad.md), [ADR-0003](../adr/0003-consultant-outside-restricted-roster.md). This is the domain invariant the whole ADR-0003 wiring exists to protect — it must be checked, not assumed.

## What

No new production file. Run and record the deterministic plugin-validation gate against the finished wiring (T3–T6):

```bash
python3 scripts/validate_plugin.py
```

Confirm:
- exit code 0 (gate passes);
- `skills/design/SKILL.md` frontmatter `agents:` is still exactly `[explorer, critic]` (grep it);
- no `agents/*.md` file references the consultant (`ls agents/` unchanged from before this feature).

Then perform the negative check named in AC-04 itself (spec: "if the invariant is violated ... the gate blocks and names the invariant") — temporarily add a throwaway `agents/ios-consultant.md` stub (or add `consultant` to the `agents:` list) and re-run the gate to confirm it **fails** with a message naming the missing/invalid reference, proving the gate actually enforces the invariant rather than passing vacuously. Revert the throwaway change before finishing.

## Definition of Done

- [ ] `python3 scripts/validate_plugin.py` exits 0 on the real, finished wiring.
- [ ] `skills/design/SKILL.md` frontmatter `agents:` confirmed unchanged (`[explorer, critic]`).
- [ ] The negative check (throwaway roster violation) is demonstrated to make the gate fail and name the invariant, then reverted — no leftover throwaway file/edit in the final diff.

## Notes

Read-mostly task (verification, plus a revert-before-finish throwaway edit) — depends on T3 (spawn wiring exists) and T6 (anti-patterns bullet exists) so the full picture is in place before verifying.
