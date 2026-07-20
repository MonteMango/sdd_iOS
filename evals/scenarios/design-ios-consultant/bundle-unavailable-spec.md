---
status: Draft
owner: "Fork maintainer"
reviewers: ["Tech Lead", "Security Lead"]
updated_at: "2026-07-20"
feature_size: "S"
---

# Spec — ios-consultant-fixture-bundle-unavailable

> **Reference module / docs / channels used:** None — only the interview + CONTEXT.

## 1. Context

The Elfy iOS app needs a **saved-filters screen**: a SwiftUI view listing the user's saved search
filters, with navigation into an edit view for each one.

Why now: users currently re-enter the same search filters every session; there is no persistence
or dedicated view for them.

The committed approach: a new SwiftUI list screen backed by the existing local store, with
navigation into a per-filter edit screen.

## 2. Goals

- Users can see all their saved filters in one SwiftUI screen.
- Users can navigate from the list into an edit view for any saved filter.
- The screen loads from local storage with no network dependency.

## 3. Non-goals

- Not adding filter sharing between users.
- Not changing how filters are created (only how they're viewed/edited afterward).

## 4. User stories

### US-01: View saved filters

**As a** Elfy user
**I want** to see all my saved filters in one screen
**So that** I can reuse them without re-entering criteria

## 5. Acceptance criteria

### AC-01 (US-01) — happy path

**Given** an authorized user has one or more saved filters
**When** the user opens the saved-filters screen
**Then** the system shows every saved filter with its name and a way to navigate to edit it

### AC-02 (US-01) — error

**Given** an authorized user has no saved filters
**When** the user opens the saved-filters screen
**Then** the system shows an empty-state message instead of a blank list

## 6. Non-functional requirements

| Aspect | Target | Measurement |
|---|---|---|
| Latency p95 screen open | ≤ 150 ms | client perf log |
| List scroll frame rate | ≥ 58 fps | Instruments trace |

## 6.1 Security / privacy

- **Data classification:** internal — saved search filters, not regulated PII.
- **Personal data touched:** none beyond what the user already searched for.
- **AuthZ/AuthN impact:** none new — local-only, scoped to the signed-in user's store.
- **Abuse cases:**
  - Corrupted local filter record: skipped from the list with a logged warning, never a crash.

## 7. Metrics / KPIs

- **Filter re-entry rate** — baseline: 100% (every session), target: ≤10% within 30 days.

## 8. Open questions

- [ ] Cap the number of saved filters shown before pagination? Default now: no cap, list is small in practice. — owner: Fork maintainer, due: before implement
