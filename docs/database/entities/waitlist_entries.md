# Waitlist Entries Entity

## Overview
The `WaitlistEntry` model logs each individual check-in occurrence of a customer joining a restaurant's queue.

## Responsibilities
- Record immediate operational variables (party size, priority status, estimated wait minutes).
- Transition waitlist states (`WAITING`, `CALLED`, `SEATED`, `CANCELLED`, `NO_SHOW`).
- Retain lifecycle action timestamps (`createdAt`, `calledAt`, `seatedAt`, `cancelledAt`, `noShowAt`).

## Architecture / Flow
- Mapped to the `waitlist_entries` table in MySQL.
- Belongs to a `Restaurant` and optionally links to a `Customer` (via `customerId`).

## Rules
- **Status Lifecycle Transitions**:
  - Starts as `WAITING`.
  - Can move to `CALLED` (when hostess notifies that table is ready).
  - Can transition to `SEATED` (terminal success), `CANCELLED` (terminal customer action), or `NO_SHOW` (terminal staff action).
- **Opt-In Sync**: Mirrors customer's opt-in choice during registration.

## Edge Cases
- **Customer Deletion Resilience**: If a customer record is deleted, `customerId` is set to `null` to retain anonymous metrics for queue duration analytics, instead of deleting the entry record.

## Technical Notes
- Indexing: Mapped composite indexes `[restaurantId, status, createdAt]`, `[restaurantId, seatedAt]`, and `[restaurantId, calledAt]` to enable real-time dashboard renders and queue analytics metrics calculations without table scans.

## Related Documents
- [Database Schema Overview](../schema-overview.md)
- [Queue Rules](../../business-rules/queue-rules.md)
