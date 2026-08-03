# Tracker — pipeline-usage-log

> Status of every task in the epic. `implement` updates `done` as it commits each task.
> States: `todo` · `in_progress` · `blocked` · `review` · `done`.

| # | Task | Layer | Owner | Estimate | Blocked by | Status |
|---|---|---|---|---|---|---|
| T1 | Shared pipeline-log template (format, accumulation, rollup, mode-aware capture) | domain | Fork maintainer (Vitalii) | M | — | done |
| T2 | Wire `specify`'s final step | app | Fork maintainer (Vitalii) | S | T1 | done |
| T3 | Wire `design`'s final step | app | Fork maintainer (Vitalii) | S | T1 | done |
| T4 | Wire `tasks`'s final step | app | Fork maintainer (Vitalii) | S | T1 | done |
| T5 | Wire `implement`'s final step (mode-aware) | app | Fork maintainer (Vitalii) | M | T1 | done |
| T6 | Wire `review`'s final step | app | Fork maintainer (Vitalii) | S | T1 | done |
| T7 | Wire `ship`'s final step + rollup | ports | Fork maintainer (Vitalii) | M | T1 | done |
| T8 | Wire `fix`'s final step + conditional rollup refresh | ports | Fork maintainer (Vitalii) | S | T1 | done |
| T9 | Document the new shared protocol in `architecture-map.md` | docs | Fork maintainer (Vitalii) | S | T1 | done |
| T10 | Manual acceptance walkthrough, all ACs | tests | Fork maintainer (Vitalii) | S | T2, T3, T4, T5, T6, T7, T8 | done |

**Total:** 10 tasks, ~1 person-week (S-sized feature, single fork maintainer, per sad §2 Organisational constraints).
