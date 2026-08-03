---
id: T1
title: "Add formatDuration(ms) to server/ with unit tests"
layer: "domain"
deps: []
acs: ["AC-01", "AC-02", "AC-03", "AC-04", "AC-05", "AC-06"]
files_hint: ["server/"]
owner: "Fork maintainer (Vitalii)"
estimate: "XS"
status: "todo"
---

# T1 — Add formatDuration(ms) to server/ with unit tests

## Why

`server/` has no shared helper to render a millisecond duration as a short human string (spec §1).

## What

Export `formatDuration(ms: number): string`:
- `ms < 1000` → whole milliseconds + `"ms"` (AC-01).
- `ms >= 1000` → seconds, one decimal, + `"s"` (AC-02); exactly `1000` → `"1.0s"` (AC-06, the boundary belongs to seconds).
- negative or non-finite (`NaN`/`Infinity`) → throws (AC-03).
- `0` → `"0ms"` (AC-05).
- the only implementation in `server/` (AC-04 — no second copy anywhere).

## Definition of Done

- [ ] `formatDuration` exported from one `server/` module
- [ ] unit tests cover AC-01..AC-06
- [ ] `bun test tests/` green
