---
feature_size: S
---

# Spec — discount-code-validator

## 1. Summary

A tiny pure-logic module: validate a discount code string against a fixed set of rules and return
whether it's accepted. No views, no navigation, no background work, no concurrency surface.

## 2. Goals

- A discount code is validated against a fixed rule set, synchronously.

## 3. Non-goals

- No UI dependency, no async/concurrency surface, no persistence.

## 4. User stories

- **US-01** — As a caller, I get true/false back for whether a discount code is valid.

## 5. Acceptance criteria

### AC-01 (US-01) — happy path
**Given** a discount code string
**When** validation runs
**Then** it returns true only if the code matches one of the fixed rules

## 6. Non-functional requirements

- N/A — fixture only.

## 8. Open questions

- None.
