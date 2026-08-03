---
status: Draft
owner: "Vitalii Lytvynov"
reviewers: ["Tech Lead"]
updated_at: "2026-08-03"
feature_size: "XS"
---

# Spec — scratch-log-walkthrough

> **Glossary:** [CONTEXT](../../../CONTEXT.md)
> **Reference module / docs / channels used:** None — only the interview + CONTEXT.

> **Disposable scratch feature.** Created solely to manually walk through `pipeline-usage-log`
> (T10) end to end. Deleted after the walkthrough closes — see
> `docs/features/pipeline-usage-log/spec.md` Test plan.

## 1. Context

`server/` has no shared helper to render a millisecond duration as a short human-readable string;
any future dashboard UI that wants to show "how long did that agent dispatch take" would have to
hand-roll the formatting inline. This is worth fixing now, cheaply, while the surface is small.

The committed approach: one small pure function, `formatDuration(ms: number): string`, added to
`server/` and covered by a unit test — the obvious direction for a helper this size, no ideation
needed.

## 2. Goals

- Give any future `server/` code a single, tested way to render a millisecond duration as a short
  string (e.g. "1.2s", "340ms").

## 3. Non-goals

- Wiring this into any actual dashboard UI display — out of scope; this ships the helper only.
- Locale-aware / internationalized formatting — out of scope for a dev-tooling utility.
- Formatting durations above 1 hour specially — out of scope; large values just render in seconds.

## 4. User stories

### US-01: Short duration as milliseconds

**As a** Fork maintainer
**I want** a sub-second duration rendered in milliseconds
**So that** I can see precise timing for very short operations

### US-02: Longer duration as seconds

**As a** Fork maintainer
**I want** a duration of one second or more rendered in seconds with one decimal
**So that** I get a readable figure instead of a large millisecond count

### US-03: Invalid input rejected

**As a** Fork maintainer
**I want** a negative or non-finite duration to be rejected clearly
**So that** a bug elsewhere is caught here instead of silently rendering nonsense

### US-04: Zero duration

**As a** Fork maintainer
**I want** a duration of exactly zero to render as a valid short string, not an error
**So that** a genuinely instantaneous dispatch is never mistaken for a bug

### US-05: Reused, not reimplemented

**As a** Fork maintainer
**I want** this to be the one shared helper any future `server/` code imports
**So that** duration formatting never silently diverges across call sites

## 5. Acceptance criteria

### AC-01 (US-01) — happy path

**Given** a duration under 1000 milliseconds
**When** `formatDuration` is called with it
**Then** it returns the value formatted as whole milliseconds followed by "ms" (e.g. "340ms")

### AC-02 (US-02) — happy path

**Given** a duration of 1000 milliseconds or more
**When** `formatDuration` is called with it
**Then** it returns the value converted to seconds, rounded to one decimal place, followed by "s" (e.g. "1.2s")

### AC-03 (US-03) — error

**Given** a negative or non-finite (NaN/Infinity) duration
**When** `formatDuration` is called with it
**Then** it throws an error naming the invalid input, rather than returning a formatted string

### AC-04 (US-05) — authorization (ownership-boundary analog)

**Given** more than one call site in `server/` needs duration formatting
**When** either call site formats a duration
**Then** both import the same `formatDuration` helper — no call site defines its own copy

### AC-05 (US-04) — domain invariant

**Given** a duration of exactly 0 milliseconds
**When** `formatDuration` is called with it
**Then** it returns "0ms" rather than throwing or returning an empty/malformed string

### AC-06 (US-01, US-02) — cross-context (boundary analog)

**Given** a duration of exactly 1000 milliseconds (the ms/s boundary)
**When** `formatDuration` is called with it
**Then** it returns "1.0s" (the seconds branch), not "1000ms" — the boundary belongs to the seconds format

## 6. Non-functional requirements

<!-- N/A: no numeric latency/throughput target — this is a synchronous, in-process pure function with no I/O; correctness (§5 AC) is the only requirement that matters for a helper this size. -->

## 6.1 Security / privacy

- **Data classification:** internal — formats a number, no user data.
- **Personal data touched:** none.
- **AuthZ/AuthN impact:** none — a pure function, no permission boundary.
- **Abuse cases:** N/A — no external input surface; the only caller is other `server/` code.
- **Security review:** N/A — internal dev utility, no PII, no new boundary.

## 7. Metrics / KPIs

- **Adoption** — baseline: 0 call sites, target: this scratch feature's own test is the only caller (by design — no real dashboard wiring in scope).

## 8. Open questions

- [ ] None — scope is deliberately minimal for a walkthrough vehicle.

## Test plan

| AC | Check | Level | Expected outcome |
|---|---|---|---|
| AC-01 | `formatDuration(340)` | unit | `"340ms"` |
| AC-02 | `formatDuration(1234)` | unit | `"1.2s"` |
| AC-03 | `formatDuration(-5)`, `formatDuration(NaN)` | unit | throws |
| AC-04 | grep `server/` for a second duration-formatting implementation | manual | none found |
| AC-05 | `formatDuration(0)` | unit | `"0ms"` |
| AC-06 | `formatDuration(1000)` | unit | `"1.0s"` |

**CI placement:** `bun test tests/` (existing `server/` test command, detected by `implement`).
