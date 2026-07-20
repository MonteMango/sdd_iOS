# Tracker — swift-consultants-rollout

> Status of every task in the epic. `implement` updates `done` as it commits each task.
> States: `todo` · `in_progress` · `blocked` · `review` · `done`.

| # | Task | Layer | Owner | Estimate | Blocked by | Status |
|---|---|---|---|---|---|---|
| T1 | Relocate + extend consultant-trigger.md / consultant-fold.md to `_shared/` | infra | Fork maintainer | M | — | done |
| T2 | Write the 3 dedicated consultant agent files | domain | Fork maintainer | M | T1 | done |
| T3 | Retrofit `design` to reference the shared files + agent files | app | Fork maintainer | S | T1, T2 | done |
| T4 | `implement`: team-mode task-scoped precompute | app | Fork maintainer | M | T2 | done |
| T5 | `implement`: workflow-mode task-scoped precompute | app | Fork maintainer | M | T2 | done |
| T6 | `implement`: single-agent inline consult + settings reconciliation | app | Fork maintainer | S | T2 | done |
| T7 | `plan-tests`: swift-testing-consultant wiring at step 4 | app | Fork maintainer | M | T1, T2 | done |
| T8 | `review`: diff-visible signal detection (ADR-0005) | app | Fork maintainer | M | T1 | done |
| T9 | `review`: AND-gated pre-consult + dispatch injection + fallback marker | app | Fork maintainer | M | T2, T8 | done |
| T10 | `sequences`: fresh concurrency-consultant spawn | app | Fork maintainer | M | T1, T2 | done |
| T11 | Close DoD/anti-patterns/References across the 4 stages | docs | Fork maintainer | S | T4, T5, T6, T7, T9, T10 | done |
| T12 | Verify AC-04 — plugin-validation roster invariant, all 5 stages | tests | Fork maintainer | S | T3, T11 | done |
| T13 | Verify `plan-tests` fixtures (AC-01, AC-09, AC-10) | tests | Fork maintainer | S | T7, T11 | done |
| T14 | Verify `implement` fixtures (AC-02, AC-05, AC-06) | tests | Fork maintainer | M | T4, T5, T6, T11 | done |
| T15 | Verify `review` fixtures (AC-03, AC-05, AC-07, AC-09, AC-10b) | tests | Fork maintainer | M | T9, T11 | done |
| T16 | Verify `sequences` fixtures (AC-08, AC-09, AC-10) | tests | Fork maintainer | S | T10, T11 | done |

**Total:** 16 tasks, ~9–12 person-days.
