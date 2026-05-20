# Product Features

## Overview
TakeSeat provides a consolidated suite of features split across queue management, customer CRM, metrics, customization settings, and multi-tenant billing. 

## Responsibilities
Each component has specific operational boundaries:
- **Waitlist Operations**: Enables addition, modification, status transition, and cancellation of queue entries.
- **Customer Directory**: Centralizes visitor history, visits counts, and persistent opt-in preferences.
- **Analytics & Reporting**: Summarizes the last 7 days of performance (throughput and average wait times).
- **Billing & Subscription**: Governs gates, billing statuses, Stripe-integrated checkouts, and trial states.
- **Settings & WhatsApp Configuration**: Handles message templates, trigger rules, and general business information.

## Architecture / Flow
- **Operador Panel**: Hostess interacts with `Waitlist` page -> state updates via Axios requests -> WebSocket (optional/future) broadcast or React Query invalidation refetches the state.
- **Customer View**: Customer tracks queue status via a public page using the `waitlistEntryId`.
- **System Settings**: Admin controls user credentials, configures messaging parameters, and manages Stripe billing checkout sessions.

## Rules
- **Access Control Roles**:
  - `ADMIN`: Full access to settings, user management, reports, and waitlist.
  - `MANAGER`: Full access to waitlist, customers, and reports; cannot manage users or billing configurations.
  - `HOSTESS`: Operational access only; can only view and manage waitlist entries.
- **Active Subscription Constraint**: If the subscription state is `PAST_DUE` or `CANCELED`, waitlist operations are blocked until payment is resolved.
- **i18n Namespace Splitting**: Translation keys must be modularized into namespaces: `auth`, `common`, `waitlist`, `settings`, `reports`, `nav`, `profile`.

## Edge Cases
- **Pickup Orders Toggle**: The database structure contains fields for pickup orders, but frontend support is deprecated. Only the Waitlist is active in the interface.
- **Invalid WhatsApp Numbers**: When notifications fail due to non-existent numbers, Z-API returns a webhook status which must be logged in `WhatsAppMessageLog` to notify the hostess of delivery failure.

## Technical Notes
- Dual-axis line charts in reports are rendered using Recharts (`recharts`).
- Locale translation files are hosted at `frontend/src/locales/{lang}/{namespace}.json`.

## Related Documents
- [Product Vision](./vision.md)
- [Subscription Rules](../business-rules/subscription-rules.md)
- [Stripe Integration](../integrations/stripe.md)
- [WhatsApp Integration](../integrations/whatsapp.md)
