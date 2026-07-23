---
feature_size: M
---

# Spec — signal-widget

## 1. Summary

A tiny fixture feature with 4 independent, trivial tasks: a SwiftUI badge view, an actor-isolated
cache's async refresh method, a pure input validator, and a dedicated test for actor-isolated
badge state — chosen so each task carries a different (or absent) iOS-consultant signal.

## 2. Goals

- Each of the 4 pieces below works standalone; no dependency between them.

## 4. User stories

- **US-01** — As a user, I see a small SwiftUI badge view.
- **US-02** — As a caller, a cache actor exposes an async refresh method.
- **US-03** — As a caller, an input validator rejects malformed input.
- **US-04** — As a maintainer, actor-isolated badge state has its own dedicated test case.

## 5. Acceptance criteria

### AC-01 (US-01)
**Given** the badge view **When** it renders **Then** it shows a SwiftUI `View` with a count label.

### AC-02 (US-02)
**Given** the cache actor **When** `refresh()` is called **Then** it awaits the async fetch and
updates state without a race.

### AC-03 (US-03)
**Given** an input string **When** validated **Then** malformed input is rejected, valid input
passes.

### AC-04 (US-04)
**Given** the actor-isolated badge state **When** tested **Then** its own dedicated test case
covers the actor-isolated interleaving, per the coverage approach for concurrency-sensitive code.

## 6. Non-functional requirements

- N/A — fixture only.

## 8. Open questions

- None.
