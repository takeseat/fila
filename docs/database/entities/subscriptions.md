# Subscriptions Entity

## Overview
Subscription attributes are embedded directly in the `Restaurant` model, mapping plan classifications and trial parameters without requiring joins.

## Responsibilities
- Track active tenant billing levels (`plan`).
- Maintain billing state records (`subscriptionStatus`).
- Log date indicators of billing state transitions.

## Architecture / Flow
- Mapped as core columns inside the `restaurants` table.
- Monitored by middleware gates before serving resources.

## Rules
- **Plan Tiers**:
  - `PRO`: Full access. WhatsApp notifications active.
  - `BASIC`: Legacy plan. Restricted access.
- **Subscription Statuses**:
  - `TRIALING`: Temporary trial.
  - `ACTIVE`: Normal paid subscription.
  - `PAST_DUE`: Payment failed, grace period.
  - `EXPIRED`: Access suspended.

## Edge Cases
- **Trial Fields Backward Compatibility**: Legacy fields `trialStatus`, `trialStartAt`, `trialEndAt`, and `trialConsumedAt` are retained in the schema for backward compatibility with earlier migrations, but runtime state evaluations check `subscriptionStatus === 'TRIALING'`.

## Technical Notes
- Webhook endpoints directly modify these columns upon receiving validated Stripe signature payloads.

## Related Documents
- [Database Schema Overview](../schema-overview.md)
- [Subscription Rules](../../business-rules/subscription-rules.md)
