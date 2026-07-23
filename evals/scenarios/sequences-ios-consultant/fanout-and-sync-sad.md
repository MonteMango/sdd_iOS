---
feature_size: S
target_surfaces: [library-sdk]
---

# SAD — multi-source-price-fetch

## 1. Introduction and goals

Fetch a merged price quote by fanning out to N price-source modules concurrently; separately
validate a discount code with pure logic. See spec.md §1/§2.

## 2. Constraints

- Library/SDK surface only, no UI, no persistence beyond in-memory state for this fixture.

## 3. Context and scope

<!-- brownfield: N/A — greenfield fixture -->

## 4. Solution strategy

- **Quote fan-out** — an actor-isolated `QuoteCoordinator` fans out to every configured
  price-source module concurrently and merges whatever answers within a bounded window.
- **Discount validation** — a pure, synchronous rule evaluator; no concurrency surface.

## 5. Building block view

- `QuoteCoordinator` (actor) — owns the fan-out to price-source modules, merges results.
- `PriceSourceModule` (protocol) — one per remote price source.
- `DiscountValidator` — pure synchronous rule evaluator, no I/O.

## 6. Runtime view

<!-- sequences writes flows here -->

## 9. Architecture decisions

No ADRs — fixture only, size S.

## 11. Risks and technical debt

None recorded — fixture only.

## 12. Glossary

- **Quote** — the merged price result returned to the caller.
