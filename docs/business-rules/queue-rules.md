# Queue Rules (Waitlist)

## Overview
The Waitlist is the core operational module of TakeSeat. It governs customer registration, status changes, waiting estimates (ETA), priority routing, and real-time status notifications.

## Responsibilities
- **Registration**: Capture customer details, validation of active entries, and auto-calculating ETAs.
- **State Management**: Guide the transition of a queue entry from creation through to completion (`SEATED`, `CANCELLED`, or `NO_SHOW`).
- **Priority Rules**: Enforce priority queue ranking so prioritized customers bubble up.
- **Position Broadcasting**: Recalculate queue positions and trigger notifications for waiting parties when queue states shift.

## Architecture / Flow
1. **Hostess Adds Entry**: Axios POST `/waitlist` -> `WaitlistService.createEntry` -> creates entry and updates customer details.
2. **Entry Lifecycle**:
   - `WAITING`: Initial state in queue.
   - `CALLED`: Hostess clicks "Call". Status moves to `CALLED`, triggers your-turn template.
   - `SEATED`: Customer takes a seat. Updates customer profile with visits metrics.
   - `CANCELLED`: Customer leaves waitlist.
   - `NO_SHOW`: Called customer did not return.
3. **Trigger Updates**: Any terminal state update (`SEATED`, `CANCELLED`, `NO_SHOW`) triggers `notifyQueueUpdates()` asynchronously.

## Rules
- **No Active Double-Booking**: A customer cannot be added to the queue if they have an existing entry with the status `WAITING` under the same restaurant.
  - *Exception*: If the customer's active entry is `CALLED`, the system allows inserting a new entry (assuming the prior position is being closed out or was missed).
- **Default Wait Time Formula**: If estimated minutes are not manually overridden by the hostess:
  $$\text{ETA} = (\text{Total parties waiting in queue} + 1) \times 15\text{ minutes}$$
- **Sorting Logic**: Waiting lists are fetched via:
  1. Priority flag descending (`isPriority: 'desc'`)
  2. Creation date ascending (`createdAt: 'asc'`)
  This means priority entries are always served first, in the order they entered.

## Edge Cases
- **Plan Enforcement**: Only restaurants on the `PRO` plan can send WhatsApp welcome and position updates. If a restaurant is downgrading or on the `BASIC` plan, `effectiveWhatsappOptIn` is forced to `false` on entry creation.
- **Priority Persistence**: Activating/deactivating priority status on a waitlist entry immediately persists the priority preference back to the `Customer` record for future visits.

## Technical Notes
- Metrics are processed in a rolling window of 90 minutes (`windowMinutes = 90`) comparing `calledAt` to `createdAt` to determine average wait time.
- Fallback average wait time when there is no historical data in the 90-minute window is 15 minutes.
- Real-time updates utilize standard HTTP polling and socket updates (future/partially implemented).

## Related Documents
- [Customer Rules](./customer-rules.md)
- [Subscription Rules](./subscription-rules.md)
- [WhatsApp Integration](../integrations/whatsapp.md)
