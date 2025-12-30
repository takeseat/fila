# Customers Module

The Customers module manages the identity and history of restaurant patrons. It is designed to recognize returning customers and build loyalty data.

## Identity Resolution

Customers are uniquely identified by their **International Phone Number** (E.164 format).
- Composite Unique Key: `restaurantId` + `fullPhone`.

### Fields
- `name`: Full name.
- `countryCode`: ISO 3166-1 alpha-2 (e.g., BR, US).
- `ddi`: International dialing code (e.g., +55).
- `phone`: Local number.
- `fullPhone`: Normalized full number (used for lookups/WhatsApp).
- `notes`: Staff notes about preferences/restrictions.

## Features

### Fast Lookup
- When adding to the waitlist, entering a phone number triggers a debounce lookup.
- If found, auto-fills Name and Notes.

### History Tracking
- **Total Visits**: Incremented every time a WaitlistEntry transitions to `SEATED`.
- **Last Visit**: Timestamp of the last seating.

### Data Privacy
- Customer data is scoped to the `Restaurant`. A customer visiting two different restaurants using TakeSeat will have two separate records unless a global identity system is implemented (future).
