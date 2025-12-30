# Waitlist Module

The Waitlist module is the core component of the TakeSeat application, managing the real-time flow of customers waiting for tables.

## Data Model

Key entities involved:
- **WaitlistEntry**: Represents a customer (or group) currently in line or recently served.
- **Customer**: Links the entry to a historical customer record (if available).

### Key Fields (WaitlistEntry)
- `status`: Current state (`WAITING`, `CALLED`, `SEATED`, `CANCELLED`, `NO_SHOW`).
- `partySize`: Number of people.
- `estimatedWaitMinutes`: Manual override or calculated ETA.
- `createdAt`, `calledAt`, `seatedAt`: Timestamps for analytics.
- `whatsappOptIn`: Whether the customer requested WhatsApp updates.

## Workflow Statuses

1.  **WAITING**: Initial state when added to queue.
    - Timer starts counting "Time in Queue".
    - Eligible for "Position Updates" via WhatsApp.
2.  **CALLED**: Staff has notified the customer their table is ready.
    - Timer stops "Time in Queue" and starts "Called Since".
    - "Your Turn" WhatsApp message is sent.
3.  **SEATED**: Service has begun.
    - Marks success.
    - Updates customer history (`totalVisits`, `lastVisitAt`).
4.  **NO_SHOW / CANCELLED**: Removal from queue without service.

## Queue Metrics & ETA

The system calculates metrics in real-time (`GET /waitlist/metrics`):
- **Average Wait Time**: Calculated from entries `CALLED` or `SEATED` in the last `windowMinutes` (default 90m).
    - Formula: `Avg(calledAt - createdAt)` for eligible entries.
    - Fallback: If minimal data points exist, uses a preset fallback (e.g. 15m).
- **ETA**: `(Position in Line) * (Average Wait Time per Person ~15m)`.

## Notification Triggers
- **Entry**: Sends Welcome message.
- **Status Change**:
    - `WAITING` -> `CALLED`: Sends "Your Table is Ready".
    - `WAITING` -> `CANCELLED`: No message by default.
- **Position Change**: Creating/Removing entries triggers a background check to update positions for everyone else.
