---
status: Draft
owner: "Fork maintainer"
reviewers: ["Tech Lead", "Security Lead"]
updated_at: "2026-07-20"
feature_size: "S"
---

# Spec — ios-consultant-fixture-pure-logic

> **Reference module / docs / channels used:** None — only the interview + CONTEXT.

## 1. Context

The Elfy iOS app needs a **discount calculator** module: a pure function that computes the final
price for a cart given a list of percentage and flat-amount discounts, applied in a fixed order.

Why now: the current inline calculation is duplicated in three places and has already produced two
rounding bugs.

The committed approach: extract one pure calculation function, unit-tested against a fixed table
of cases, with no dependency on any UI or I/O.

## 2. Goals

- One calculation function replaces all three duplicated inline copies.
- Rounding follows one documented rule (banker's rounding to the nearest cent).
- The function has no UI, networking, or persistence dependency.

## 3. Non-goals

- Not changing how discounts are configured or fetched — only how they're applied.
- Not adding a UI to preview discounts.
- Not touching the checkout screen.

## 4. User stories

### US-01: Correct discount total

**As a** Elfy shopper
**I want** my cart total to reflect all applicable discounts correctly
**So that** I'm charged the right amount

## 5. Acceptance criteria

### AC-01 (US-01) — happy path

**Given** a cart with a subtotal and a list of percentage and flat discounts
**When** the calculation runs
**Then** the system returns the correct final total, rounded to the nearest cent

### AC-02 (US-01) — domain invariant

**Given** a cart whose discounts would reduce the total below zero
**When** the calculation runs
**Then** the system floors the total at zero and never returns a negative amount

## 6. Non-functional requirements

| Aspect | Target | Measurement |
|---|---|---|
| Calculation latency | ≤ 1 ms per call | unit benchmark |
| Rounding accuracy | 100% match to the reference table | unit test suite |

## 6.1 Security / privacy

- **Data classification:** internal — pricing logic, no personal data.
- **Personal data touched:** none.
- **AuthZ/AuthN impact:** none — pure calculation, no access control surface.
- **Abuse cases:**
  - Malformed discount input (negative percentage): rejected with a validation error, no silent clamp.

## 7. Metrics / KPIs

- **Duplicated-copy count** — baseline: 3, target: 1 within this feature's release.
- **Rounding-bug reports** — baseline: 2 (last quarter), target: 0 within 60 days.

## 8. Open questions

- [ ] Should the function be a free function or a value type with static methods? Default now: free function. — owner: Fork maintainer, due: before implement
