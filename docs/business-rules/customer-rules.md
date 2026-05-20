# Customer Rules

## Overview
The Customer module handles persistent records of the visitors of each establishment. It serves as a light CRM that tracks visits, stores notes, persists priority preferences, and captures WhatsApp opt-in compliance histories.

## Responsibilities
- **Deduplication**: Match new queue entries to existing customer records using clean phone identifiers.
- **Opt-In Persistance**: Manage customers' communication permissions with accurate audit source trails.
- **Visits History & Metrics**: Count successful seatings and log dates of their last visits.

## Architecture / Flow
1. **Hostess Adds Entry**: The system runs `CustomersService.upsertCustomer` or matches details during `WaitlistService.createEntry`.
2. **Matching & Linking**:
   - If the cleaned `fullPhone` (DDI + Phone) already exists in the tenant's database, the customer profile is linked to the new entry, and name/notes/opt-in preferences are updated.
   - If not found, a new `Customer` record is generated.
3. **Visits Accumulation**: When a waitlist entry transitions to `SEATED`, the customer's `totalVisits` is incremented by 1, and `lastVisitAt` is set to the seating timestamp.

## Rules
- **Cleaning Phone Identifiers**: All phone numbers must be sanitized before comparison, stripping spaces, dashes, brackets, and non-numeric characters. The country DDI is prepended with `+`.
- **Deduplication Key**: Customer uniqueness is strictly bounded by the composite key `(restaurantId, fullPhone)`. The same phone number can exist across different restaurants (tenants), but must be unique within one restaurant.
- **Opt-In Change Attribution**: When WhatsApp status changes, the change timestamp (`whatsappOptInAt`) is refreshed and the origin of modification is stored in `whatsappOptInSource`:
  - `CRM`: Modified through the Admin CRM dashboard.
  - `QUEUE_ENTRY`: Updated during the check-in queue registration.
  - `IMPORT`: Defaults to false on CSV imports unless specified.

## Edge Cases
- **Opt-Out Precedence**: If a customer explicitly opts out of WhatsApp messages, subsequent waitlist entries default to opted-out. The hostess can toggle it back on if requested, which will overwrite the profile.
- **Email Fields**: Email is optional. If left blank, it is persisted as `null`.

## Technical Notes
- Implemented in `CustomersService` and persisted in the `Customer` schema model.
- Deletions: Deleting a customer record clears their details but preserves independent waitlist logs (history of raw inputs).

## Related Documents
- [Queue Rules](./queue-rules.md)
- [Subscription Rules](./subscription-rules.md)
- [Database Schema](../database/schema-overview.md)
