# Customers Entity

## Overview
The `Customer` model represents a persistent CRM record of a guest who has visited or joined the waitlist of a tenant restaurant.

## Responsibilities
- Store guest identifiers (name, email, notes).
- Hold cleaned international phone attributes (`countryCode`, `ddi`, `phone`, `fullPhone`).
- Track CRM loyalty metrics (`totalVisits`, `lastVisitAt`).
- Persist WhatsApp communication opt-in histories.

## Architecture / Flow
- Mapped to the `customers` table in MySQL.
- Belongs to a `Restaurant`.
- Has a one-to-many relationship with `WaitlistEntry`.

## Rules
- **Clean Phone Constraint**: Phone attributes are parsed into individual country codes, DDI, and localized numbers.
- **Uniqueness Boundary**: Unique combination of `(restaurantId, fullPhone)` ensures a guest cannot have duplicate profiles under the same brand tenant.

## Edge Cases
- **No-Show and Cancellation Exclusions**: Seating a guest increments `totalVisits` and sets `lastVisitAt`. However, when a queue entry is marked as `NO_SHOW` or `CANCELLED`, these loyalty metrics are untouched.

## Technical Notes
- Indexing: Added on `[restaurantId]`, `[fullPhone]`, and `[email]` for query optimization in dashboard filters.

## Related Documents
- [Database Schema Overview](../schema-overview.md)
- [Customer Rules](../../business-rules/customer-rules.md)
