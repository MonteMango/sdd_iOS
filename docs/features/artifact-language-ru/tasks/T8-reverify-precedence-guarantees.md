---
id: T8
title: "Re-verify pre-existing precedence guarantees still hold"
layer: "tests"
deps: []
acs: ["AC-02", "AC-04", "AC-05"]
files_hint: ["skills/implement/references/settings.md", "skills/_shared/artifact-language.md"]
owner: "Fork maintainer"
estimate: "S"
status: "todo"
---

# T8 — Re-verify pre-existing precedence guarantees still hold

## Why

Derives from [spec §5 AC-02, AC-04, AC-05](../spec.md) and [spec §6 NFR](../spec.md) — these three
guarantees (malformed-settings warn-and-fallback, per-developer settings isolation, per-feature-
folder language precedence) already exist and this feature adds no new enforcement code for them;
[sad §9](../sad.md) confirms no ADR/behavior change was made. The obligation is to confirm the
doc edits (T2/T4) didn't accidentally weaken the documented rules, via manual read-through — not a
new eval.

## What

Read-through, no code change expected:
- `skills/implement/references/settings.md` line ~74: "A malformed file → warn and fall back to
  all-defaults rather than failing the run" — still present, unchanged (AC-02).
- `.claude/*.local.md` git-ignore status — confirm still git-ignored, so per-developer isolation
  holds (AC-04).
- `skills/_shared/artifact-language.md` "Precedence (editing vs creating)" section — confirm the
  three precedence rules (existing file wins, new file matches feature-folder neighbours, never
  retro-translate) are unchanged after T4's addition (AC-05).

## Definition of Done

- [ ] Confirmed: settings.md's malformed-file fallback sentence is unchanged (AC-02).
- [ ] Confirmed: `.claude/*.local.md` is still listed in `.gitignore` (AC-04).
- [ ] Confirmed: artifact-language.md's "Precedence" section is unchanged in substance (AC-05).

## Notes

No file is written by this task — it's a verification gate. If any guarantee is found weakened,
that's a blocker to raise before T6/T7 close the epic, not a silent pass.
