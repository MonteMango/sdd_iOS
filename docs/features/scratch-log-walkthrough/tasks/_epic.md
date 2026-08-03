# Epic — scratch-log-walkthrough

> **Spec:** [spec.md](../spec.md) · **Design:** [sad.md](../sad.md)

## Goal

Add a single shared `formatDuration(ms)` helper to `server/` (spec §2 Goals) — a disposable vehicle
for walking through `pipeline-usage-log`'s T10 acceptance check.

## Scope

- **In:** one pure function + its unit tests.
- **Out:** any dashboard UI wiring (spec §3 Non-goals).

## Task map

```mermaid
flowchart LR
    T1[T1 domain — formatDuration + tests]
```

## Tasks

| # | Title | Layer | ACs |
|---|---|---|---|
| T1 | Add `formatDuration(ms)` to `server/` with unit tests | domain | AC-01..AC-06 |
