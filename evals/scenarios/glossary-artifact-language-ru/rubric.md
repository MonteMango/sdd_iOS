# Rubric — glossary-artifact-language-ru

The fixture's `.claude/sdd.local.md` sets `artifact_language: ru`; the prompt supplies two term
definitions in English and never names a language itself — so Russian prose can only come from
the skill honouring the setting.

PASS requires ALL of:

1. `docs/features/rate-limit-bump/CONTEXT.md` exists with **English structure**: the `## Glossary`
   heading verbatim (never «Глоссарий»), no other Russian/translated headings anywhere in the
   file, and English frontmatter keys+values (`status: Living`, `updated_at: <date>`).
2. Both terms (`quota window`, `burst credit`) appear under `## Glossary`, one line each in the
   `- <term> — <definition>.` shape, and **each definition's prose is Russian and carries a
   Russian-specific marker** — at least one of the Cyrillic letters «ы», «э», or «ъ» (letters that
   do not exist in the modern Ukrainian alphabet), or a grammatical construction invalid in
   Ukrainian — not merely Cyrillic script, since Ukrainian prose would also pass a plain-Cyrillic
   check. (e.g. «скользящий 60-секундный интервал…» — «скользящий» carries «ы».) The `quota window`
   entry keeps a NOT-boundary (`NOT` token or an equivalent Russian boundary clause naming the
   billing period).
3. No `<!-- … -->` template comments are copied into the written file, in any language.
4. The run's final message contains a stage-handoff block (What I did / Review before continuing /
   Run next — the utility variant: resume the backbone stage).

FAIL on: English-only definitions (the setting was ignored), Russian prose with no Russian-specific
marker (indistinguishable from Ukrainian — the setting may have been satisfied by coincidence, not
by honouring `ru` specifically), a translated `## Glossary` heading or translated frontmatter
(structure leaked into the switch), leftover template comments, a missing term, or no handoff block.
