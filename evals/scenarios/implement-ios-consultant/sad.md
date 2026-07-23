---
feature_size: M
target_surfaces: [library-sdk]
---

# SAD — signal-widget

## 1. Introduction and goals

4 independent trivial pieces: a SwiftUI badge view, an async cache-refresh method, a pure
validator, and a dedicated concurrency test. See spec.md.

## 4. Solution strategy

- Each piece is standalone; no cross-task dependency.

## 5. Building block view

- `BadgeView` (SwiftUI `View`).
- `CacheActor` (actor) with an async `refresh()`.
- `InputValidator` — pure function.
- `BadgeStateTests` — dedicated actor-isolation test.

## 6. Runtime view

<!-- N/A: fixture only, no cross-participant flow -->

## 9. Architecture decisions

No ADRs — fixture only.

## 12. Glossary

- **Badge** — the small count indicator view.
