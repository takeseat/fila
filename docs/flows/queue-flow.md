# Queue Flow

## Overview
This flow maps the lifecycle of a guest party from joining the waitlist, checking position updates, being called, and being seated or marked as no-show/cancelled.

## Responsibilities
- Track queue state transitions (`WAITING` -> `CALLED` -> `SEATED` / `NO_SHOW` / `CANCELLED`).
- Verify guest data structures and prevent duplicate active waitlist entries.
- Dispatch notifications on transition triggers.

## Architecture / Flow
1. **Join Queue (`POST /queue`)**: Hostess registers guest details. The system matches/creates the customer profile, saves `WaitlistEntry` as `WAITING`, and dispatches the Welcome notification.
2. **Track Status (`GET /queue/:publicToken`)**: Guest tracks position, estimated wait minutes, and status updates via their public mobile page link.
3. **Call Party (`POST /queue/:id/call`)**: Hostess triggers the call. Status moves to `CALLED`, initiating a visual return timer on the dashboard and dispatching the WhatsApp notification.
4. **Completion**:
   - Seating: Call `POST /queue/:id/seat`. Status changes to `SEATED`, incrementing customer loyalty stats.
   - Cancel: Call `POST /queue/:id/cancel`. Status changes to `CANCELLED`.
   - No-Show: Call `POST /queue/:id/noshow`. Status changes to `NO_SHOW`.

## Rules
- **Double Entry Prevention**: A customer cannot be added to the waitlist if they have an active `WAITING` or `CALLED` queue record.
- **Loyalty Accrual**: Seating a guest is the only action that increments the customer's `totalVisits` and updates `lastVisitAt`.

## Edge Cases
- **Priority Override**: Priority guests are sorted at the top of the queue (`isPriority desc, createdAt asc`), adjusting positions and estimated times for other parties.

## Technical Notes
- Implemented in `WaitlistService`.

## Related Documents
- [Queue Rules](../business-rules/queue-rules.md)
- [Customer Rules](../business-rules/customer-rules.md)
