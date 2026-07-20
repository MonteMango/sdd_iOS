---
status: Draft
owner: "Fork maintainer"
reviewers: ["Tech Lead", "Security Lead"]
updated_at: "2026-07-20"
feature_size: "S"
---

# Spec — ios-consultant-fixture-ui-async

> **Reference module / docs / channels used:** None — only the interview + CONTEXT.

## 1. Context

The Elfy iOS app needs a **profile sync screen**: a SwiftUI view that lets a user review and
confirm profile fields before they're synced to the server. The screen is built from SwiftUI
views and navigation (a dedicated navigation stack entry from the settings screen).

Why now: profile edits currently save silently with no confirmation UI, and users have reported
edits appearing to "vanish" while a slow sync is still running in the background.

The committed approach: a new SwiftUI screen presents the pending edits, and the sync itself runs
as a background async task (Swift concurrency, actor-isolated) so the UI stays responsive while
the confirm-and-sync round-trip completes.

## 2. Goals

- Users can see and confirm pending profile edits before they sync.
- The sync runs asynchronously in the background without blocking the UI thread.
- No profile edit is silently dropped or overwritten during a concurrent sync.

## 3. Non-goals

- Not redesigning the settings screen navigation beyond the one new entry point.
- Not changing the server-side profile API.
- Not adding offline queuing — sync still requires connectivity.

## 4. User stories

### US-01: Confirm before sync

**As a** Elfy user
**I want** to see my pending profile edits before they sync
**So that** I know exactly what will be sent to the server

### US-02: Non-blocking sync

**As a** Elfy user
**I want** the app to stay responsive while my profile syncs in the background
**So that** I can keep using the app during a slow connection

## 5. Acceptance criteria

### AC-01 (US-01) — happy path

**Given** an authorized user has edited their profile fields
**When** the user opens the profile sync screen
**Then** the system shows every pending edit and confirms the sync once the user approves

### AC-02 (US-02) — domain invariant

**Given** a sync is already running in the background
**When** the user edits a profile field again before the sync completes
**Then** the system queues the new edit and never lets a completing sync overwrite it

## 6. Non-functional requirements

| Aspect | Target | Measurement |
|---|---|---|
| Latency p95 confirm-screen open | ≤ 200 ms | client perf log |
| Sync completion (background) | ≤ 3 s p95 | client perf log |
| UI thread block during sync | 0 ms (never blocks) | Instruments trace |

## 6.1 Security / privacy

- **Data classification:** internal — user profile fields, not regulated PII.
- **Personal data touched:** name, avatar URL, display preferences (already stored server-side).
- **AuthZ/AuthN impact:** none new — sync uses the existing authenticated session.
- **Abuse cases:**
  - Concurrent edits from two devices: last-confirmed-edit wins, never silently merged.

## 7. Metrics / KPIs

- **Silent-drop rate** — baseline: unknown (reported anecdotally), target: 0 within 30 days.
- **Confirm-screen adoption** — baseline: 0, target: used on 100% of profile edits within 14 days.

## 8. Open questions

- [ ] Should the confirm screen batch multiple rapid edits into one sync? Default now: yes, debounce 2s. — owner: Fork maintainer, due: before implement
