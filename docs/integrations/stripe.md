# Stripe Integration

## Overview
TakeSeat handles automated billing subscriptions by connecting to the Stripe payment API. The flow handles initial checkout redirections and registers webhook events to synchronize payment outcomes with local database subscription statuses.

## Responsibilities
- **Checkout Initialisation**: Generate Stripe Checkout Sessions to capture payment methods.
- **Webhook Processing**: Intercept asynchronous Stripe billing events and reconcile customer states.
- **Metadata Management**: Embed reference tenant IDs in Stripe schemas to link transactions back to the correct restaurants.

## Architecture / Flow
1. **Checkout Event**: User navigates to billing panel -> clicks "Subscribe" -> triggers `POST /billing/subscribe`.
2. **Redirect Flow**:
   - *Production*: Backend creates a checkout session at Stripe, returning the gateway checkout URL.
   - *Sandbox*: A placeholder redirection is returned redirecting back to `/billing?stripe-pending=true`.
3. **Webhook Callback**: Stripe issues a `POST /billing/webhook` containing the transaction result.
4. **Reconciliation**:
   - `checkout.session.completed` -> Call `subscriptionService.activateSubscription`.
   - `invoice.payment_succeeded` -> Call `subscriptionService.activateSubscription` (restoring service if past due).
   - `invoice.payment_failed` -> Call `subscriptionService.setPastDue`.
   - `customer.subscription.deleted` -> Call `subscriptionService.expireSubscription`.

## Rules
- **Signature Security**: Every production webhook handler call must verify Stripe signatures using the endpoint raw payload and `STRIPE_WEBHOOK_SECRET` before processing the body.
- **Tenant Linking**: Stripe metadata fields must always include the `restaurantId` parameter. Stripe payloads lacking this property must be ignored and logged as errors.

## Edge Cases
- **Missing webhook events**: When network failure stops a webhook from reaching TakeSeat, cron schedules or active dashboard checks must execute fallbacks calling the Stripe subscription lookup API.

## Technical Notes
- Webhook endpoints route requests without calling Express authentication middleware.
- Environment keys: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRO_PRICE_ID`.

## Related Documents
- [Subscription Rules](../business-rules/subscription-rules.md)
- [Database Schema](../database/schema-overview.md)
