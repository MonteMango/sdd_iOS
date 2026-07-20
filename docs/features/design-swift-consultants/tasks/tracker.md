# Tracker — design-swift-consultants

> Status of every task in the epic. `implement` updates `done` as it commits each task.
> States: `todo` · `in_progress` · `blocked` · `review` · `done`.

| # | Task | Layer | Owner | Estimate | Blocked by | Status |
|---|---|---|---|---|---|---|
| T1 | Write the trigger reference (signal set + mapping + cap) | domain | Fork maintainer | S | — | todo |
| T2 | Write the fold reference (altitude filter + rules-win + marker format) | domain | Fork maintainer | S | — | todo |
| T3 | Add step 3.5 — guaranteed concurrent consultant spawn | app | Fork maintainer | M | T1 | todo |
| T4 | Extend step 6/7 — altitude fold + project-rules-win + dual marker write | ports | Fork maintainer | M | T2, T3 | todo |
| T5 | Extend step 7 handoff — name fired/missing consultant(s) | ports | Fork maintainer | S | T4 | todo |
| T6 | Close DoD/anti-patterns/References for the new protocol pieces | docs | Fork maintainer | S | T5 | todo |
| T7 | Verify AC-04 — plugin-validation roster invariant | tests | Fork maintainer | S | T3, T6 | todo |
| T8 | Verify AC-01/AC-02/AC-06 on fixture specs | tests | Fork maintainer | M | T5 | todo |

**Total:** 8 tasks, ~1 person-week.
