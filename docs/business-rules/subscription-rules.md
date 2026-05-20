# Subscription Rules

## Overview
The Subscription module defines the monetization rules, trial terms, payment gates, and access controls for the TakeSeat SaaS platform.

## Responsibilities
- **Trial Lifecycle**: Handle the automatic trial setup for new business registrations.
- **Billing State Enforcement**: Maintain the active, past-due, and expired states based on billing webhooks.
- **Feature Gating**: Restrict backend middleware routes and frontend access based on subscription eligibility.

## Architecture / Flow
1. **Restaurant Signup**: During registration, `SubscriptionService.startTrial` is invoked.
2. **Billing State Machine**:
   - Status moves to `TRIALING` (7 days duration).
   - Once trial ends without Stripe config: moves to `EXPIRED`.
   - Successful Stripe payment event: transitions to `ACTIVE`, sets `plan = 'PRO'`.
   - Failed Stripe payment event: transitions to `PAST_DUE` or `EXPIRED`.
3. **Middleware Gate**: `checkSubscriptionAccess` middleware evaluates each incoming route request against the tenant's current subscription status.

## Rules
- **Access Eligibility**: Access to Waitlist, Reports, and Settings is only allowed if the restaurant's subscription status is `ACTIVE` or `TRIALING`.
- **Blocked State**: When status is `EXPIRED` or `PAST_DUE`, requests to protected resource endpoints return a `402 Payment Required` or redirect the client to `/billing`.
- **Trial Terms**: Trials run for exactly 7 days ($7 \times 24 \times 60 \times 60 \times 1000$ milliseconds).
- **Default Plan**: New restaurants default to the `PRO` plan during trial to test the WhatsApp notifications feature.

## Edge Cases
- **Stripe Subscription Sync**: If a webhook event from Stripe fails or is delayed, the local status could fall out of sync. Standard database state reconciliation must handle Stripe webhook retries gracefully.
- **Past Due State**: A grace period status (`PAST_DUE`) is assigned when payment fails temporarily. The dashboard alerts the user but blocks queue check-ins immediately until payment succeeds.

## Technical Notes
- Controlled in `SubscriptionService` and applied globally via routes authentication and the `checkSubscriptionAccess` middleware.
- The `plan` enum field contains `BASIC` and `PRO`. The `BASIC` plan remains in the schema for backwards compatibility but is no longer actively marketed or selectable.

## Related Documents
- [Features List](../product/features.md)
- [Stripe Integration](../integrations/stripe.md)
- [Security Overview](../security/security-overview.md)
