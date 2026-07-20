---
feature_size: S
---

# Spec — offline-cache-sync

## 1. Summary

A tiny iOS module that keeps a local cache of "note" records in sync with a remote service,
using an actor-isolated in-memory store so concurrent reads/writes from multiple callers never
race. No UI — a library/SDK surface consumed by other modules.

## 2. Goals

- Reads and writes to the cache never race, even under concurrent callers.
- A background sync task periodically reconciles the cache with the remote service.

## 3. Non-goals

- No UI surface — this is a `library-sdk` target, no views/screens.

## 4. User stories

- **US-01** — As a caller, I can read a note from the cache without blocking on a concurrent write.
- **US-02** — As a caller, I can trigger a background sync that reconciles local + remote state.

## 5. Acceptance criteria

### AC-01 (US-01) — happy path
**Given** two callers concurrently read and write the same note key on the actor-isolated cache
**When** both operations run
**Then** neither operation races the other, and the test coverage approach for this AC must give
the actor-isolated read/write interleaving its own dedicated case, not a generic single-threaded
case — this is a genuine concurrency-testing decision, not an implementation detail

### AC-02 (US-02) — happy path
**Given** the cache holds a note that differs from the remote service's copy
**When** the background sync task runs
**Then** the local copy is overwritten with the remote copy and the sync completes

## 6. Non-functional requirements

- N/A — no numeric NFR for this fixture.

## 7. KPIs

- N/A — fixture only.

## 8. Open questions

- None.
