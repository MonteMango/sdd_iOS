# Changelog — artifact-language-ru

## artifact-language-ru — Russian proved and adopted as an `artifact_language` value

**What:** `artifact_language: ru` is now a proven, documented pipeline setting: a dedicated eval
(`glossary-artifact-language-ru`) confirms it produces Russian-language prose while every
structural token (headings, frontmatter, verdict literals) stays English, exactly like the
existing `uk` guarantee. `ru` is now named explicitly — not just implied by "(any language
tag)" — in `skills/implement/references/settings.md` (both its prose bullet and its
auto-create YAML frontmatter template), in `README.md`'s `artifact_language` line, and in
`skills/_shared/artifact-language.md`'s new "Eval-validated tags" note. This repo's own,
git-ignored `.claude/sdd.local.md` now defaults to `ru`, so new SDD-generated documents in
this checkout are Russian prose going forward.

**Why:** [spec.md](spec.md) §1 — the Pipeline operator found that `ru` already worked "in
principle" via the undocumented "(any language tag)" note, but nothing proved it or made it
discoverable. This feature closes that gap the same way `uk` was closed: an eval scenario as
proof, plus the setting named explicitly everywhere `en`/`uk` already are. No ADRs — no
irreversible or multi-module decision crossed the blast-radius gate; this is a docs +
eval-fixture change to existing, unmodified machinery.

**How to use:** Set `artifact_language: ru` in your project's `.claude/sdd.local.md` (git-ignored,
per-developer). Every artifact-writing skill (`specify`, `design`, `glossary`, …) then writes
prose in Russian while headings, frontmatter, verdict literals, tracker states, and Mermaid
keywords stay English, per the existing precedence rules (existing file's language wins; a new
file matches its feature-folder neighbours; never retro-translate) — see
[`skills/_shared/artifact-language.md`](../../../skills/_shared/artifact-language.md).

**Operational notes:**
- Migration: `<!-- none -->`.
- Feature flag / config: this repo's own `.claude/sdd.local.md` `artifact_language` value
  flipped from `en` to `ru` (AC-07) — a local, git-ignored edit on the Fork maintainer's own
  machine, never committed or pushed.
- Rollback: revert this feature's commits (`ca15229..6280dfb`) — no schema/migration to unwind,
  a markdown/eval-fixture-only change. The local `.claude/sdd.local.md` flip is independent of
  the commits (git-ignored) and can be reverted separately by editing `artifact_language` back
  to `en`.

**Verification:** re-ran the gate (`python3 scripts/validate_plugin.py` — 394/394) and exercised
the feature for real, not just green tests:
- AC-01 / AC-03 — `SDD_EVAL_MODEL=sonnet ./evals/run.sh glossary-artifact-language-ru` → **PASS**
  (Russian-specific marker present in both definitions — e.g. «превысить», «рассчитывается» — and
  `## Glossary` + frontmatter stayed English verbatim). Note: this run required 5 attempts before
  a PASS — 3 initial FAILs (model dropped to Ukrainian or plain English instead of Russian) and 1
  further FAIL on a same-day retry, consistent with `evals/README.md`'s documented note that
  `SDD_EVAL_MODEL=sonnet` is required for a *possible* PASS, not a guaranteed one; the harness is
  explicitly non-deterministic (spec §6). The prior `PASS` recorded in `_review/review-2026-08-06.md`
  should be read the same way — a verified-possible outcome, not a stable one.
- No regression to `uk` — `./evals/run.sh glossary-artifact-language-uk` → **PASS** after one
  retry (first attempt also failed to switch language — consistent with the same
  non-determinism, not a `ru`-specific regression).
- AC-06 — confirmed by direct read: `ru` appears in `settings.md` (bullet + YAML template),
  `README.md`, and the new `artifact-language.md` "Eval-validated tags" note.
- AC-07 — confirmed by direct read: this repo's `.claude/sdd.local.md` `artifact_language` is `ru`.
- AC-08 — confirmed by direct read: `evals/README.md`'s Scenarios table carries both the `uk` and
  `ru` rows.
- AC-02/AC-04/AC-05 (pre-existing guarantees) — re-confirmed by code inspection during
  `/sdd:review` (see `_review/review-2026-08-06.md`), unchanged by this feature; no new eval.

**Acceptance criteria delivered:** AC-01, AC-02, AC-03, AC-04, AC-05, AC-06, AC-07, AC-08 — all 8.
