# Restaurants Entity

## Overview
The `Restaurant` model represents the primary tenant in TakeSeat. All other entities (except global SYSADMIN users) belong directly to a restaurant.

## Responsibilities
- Hold restaurant business metadata (CNPJ, Trade Name).
- Maintain localized settings (Timezone, ISO Country Code, Address).
- Act as the root anchor for cascading data deletions.

## Architecture / Flow
- Mapped to the `restaurants` table in MySQL.
- Holds one-to-many relationships with `User`, `Customer`, `WaitlistEntry`, and `WhatsAppMessageLog`.
- Holds a one-to-one relationship with `RestaurantWhatsAppSettings`.

## Rules
- **Required Fields**: `name`, `city`, `timezone`, and `isActive` are mandatory.
- **Default country code**: Defaults to `"BR"`.
- **Default timezone**: Defaults to `"America/Sao_Paulo"`.

## Edge Cases
- **Onboarding Wizard State**: The `onboardingPending` flag defaults to `true` on creation. Until it is flipped to `false` via onboarding completion, dashboard pages are locked.

## Technical Notes
- timezone string matches standard IANA database locations (e.g. `America/Sao_Paulo`).

## Related Documents
- [Database Schema Overview](../schema-overview.md)
- [Subscription Entity](./subscriptions.md)
