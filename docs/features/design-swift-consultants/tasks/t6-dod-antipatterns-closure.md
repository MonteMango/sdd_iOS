---
id: T6
title: "Close DoD/anti-patterns/References for the new protocol pieces"
layer: "docs"
deps: ["T5"]
acs: ["AC-03", "AC-04"]
files_hint: ["skills/design/SKILL.md"]
owner: "Fork maintainer"
estimate: "S"
status: "todo"
---

# T6 — Close DoD/anti-patterns/References for the new protocol pieces

## Why

Derives from [spec §5 AC-03, AC-04](../spec.md), [sad §11 Risks](../sad.md), the repo convention that every `SKILL.md` closes its **Definition of Done**, **Anti-patterns**, and **References & template** sections against whatever the Protocol section introduced (see the existing entries for step 3's Explore agent and step 7's critic).

## What

Edit `skills/design/SKILL.md`'s three closing sections to reflect T1–T5's additions:

- **Definition of Done** — add a bullet: the iOS-aware SAD run either carries an observable iOS structural trace (consultant fired, AC-01) or a fallback marker (AC-02) — never neither and never both silently missing;
- **Anti-patterns** — add a bullet warning against placing the consultant in `agents:` frontmatter or `agents/*.md` (AC-04, the invariant T7 verifies) and against letting a code-level brief item into §4/§5 (AC-03);
- **References & template** — add the two new reference-file pointers: `./references/consultant-trigger.md` and `./references/consultant-fold.md`, matching the existing one-line-pointer style of the other entries.

## Definition of Done

- [ ] DoD section has the new observable-trace-or-marker bullet.
- [ ] Anti-patterns section has the roster bullet and the code-level-leak bullet.
- [ ] References & template section lists both new reference files with a one-line description each, in the same style as the existing rows.
- [ ] Every new bullet cites the AC or ADR it derives from, matching the file's existing citation style (parenthetical spec/AC references).

## Notes

Shares `skills/design/SKILL.md` with T3, T4, T5 — same serialized lane; run last among the SKILL.md edits so it closes the sections against the final Protocol text.
