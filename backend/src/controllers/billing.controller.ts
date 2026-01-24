import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { subscriptionService } from '../services/subscription.service';

export class BillingController {
    /**
     * Get subscription status and details
     * GET /billing/status
     */
    async getStatus(req: AuthRequest, res: Response): Promise<void> {
        try {
            const restaurantId = req.user!.restaurantId;

            const info = await subscriptionService.getSubscriptionInfo(restaurantId);

            res.json({
                plan: info.plan,
                subscriptionStatus: info.subscriptionStatus,
                subscriptionStartedAt: info.subscriptionStartedAt,
                subscriptionEndsAt: info.subscriptionEndsAt,
                trialStatus: info.trialStatus,
                trialStartAt: info.trialStartAt,
                trialEndAt: info.trialEndAt,
                canAccessFeatures: info.subscriptionStatus === 'TRIALING' || info.subscriptionStatus === 'ACTIVE'
            });
        } catch (error: any) {
            console.error('Error fetching subscription status:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * Initiate subscription checkout
     * POST /billing/subscribe
     */
    async initiateSubscription(req: AuthRequest, res: Response): Promise<void> {
        try {
            const restaurantId = req.user!.restaurantId;

            // TODO: Implement Stripe Checkout session creation
            // For now, return a placeholder response

            // Example Stripe integration:
            // const session = await stripe.checkout.sessions.create({
            //     customer_email: 'user@example.com', // Get from user table
            //     payment_method_types: ['card'],
            //     line_items: [{
            //         price: process.env.STRIPE_PRO_PRICE_ID,
            //         quantity: 1,
            //     }],
            //     mode: 'subscription',
            //     success_url: `${process.env.FRONTEND_URL}/billing?success=true`,
            //     cancel_url: `${process.env.FRONTEND_URL}/billing?cancelled=true`,
            //     metadata: {
            //         restaurantId: restaurantId
            //     }
            // });

            // Placeholder response
            res.json({
                message: 'Stripe integration pending - connect Stripe to activate',
                restaurantId, // Include for debugging
                // checkoutUrl: session.url
                checkoutUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/billing?stripe-pending=true`
            });

        } catch (error: any) {
            console.error('Error initiating subscription:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * Handle Stripe webhooks
     * POST /billing/webhook
     */
    async handleWebhook(req: AuthRequest, res: Response): Promise<void> {
        try {
            // TODO: Implement Stripe webhook signature verification

            const event = req.body;

            // Handle different event types
            switch (event.type) {
                case 'checkout.session.completed':
                    await this.handleCheckoutCompleted(event.data.object);
                    break;

                case 'invoice.payment_succeeded':
                    await this.handlePaymentSucceeded(event.data.object);
                    break;

                case 'invoice.payment_failed':
                    await this.handlePaymentFailed(event.data.object);
                    break;

                case 'customer.subscription.deleted':
                    await this.handleSubscriptionCancelled(event.data.object);
                    break;

                default:
                    console.log(`[BillingController] Unhandled event type: ${event.type}`);
            }

            res.json({ received: true });

        } catch (error: any) {
            console.error('Error handling webhook:', error);
            res.status(400).json({ error: 'Webhook error' });
        }
    }

    /**
     * Handle successful checkout
     */
    private async handleCheckoutCompleted(session: any) {
        const restaurantId = session.metadata?.restaurantId;

        if (!restaurantId) {
            console.error('[BillingController] No restaurantId in checkout session metadata');
            return;
        }

        // Activate subscription
        await subscriptionService.activateSubscription(restaurantId);

        console.log(`[BillingController] Subscription activated for restaurant: ${restaurantId}`);
    }

    /**
     * Handle successful payment
     */
    private async handlePaymentSucceeded(invoice: any) {
        const restaurantId = invoice.metadata?.restaurantId;

        if (!restaurantId) {
            console.error('[BillingController] No restaurantId in invoice metadata');
            return;
        }

        // Update subscription status if it was PAST_DUE
        const status = await subscriptionService.getSubscriptionStatus(restaurantId);
        if (status === 'PAST_DUE') {
            await subscriptionService.activateSubscription(restaurantId);
        }

        console.log(`[BillingController] Payment succeeded for restaurant: ${restaurantId}`);
    }

    /**
     * Handle failed payment
     */
    private async handlePaymentFailed(invoice: any) {
        const restaurantId = invoice.metadata?.restaurantId;

        if (!restaurantId) {
            console.error('[BillingController] No restaurantId in invoice metadata');
            return;
        }

        // Set to PAST_DUE
        await subscriptionService.setPastDue(restaurantId);

        console.log(`[BillingController] Payment failed for restaurant: ${restaurantId}`);
    }

    /**
     * Handle subscription cancellation
     */
    private async handleSubscriptionCancelled(subscription: any) {
        const restaurantId = subscription.metadata?.restaurantId;

        if (!restaurantId) {
            console.error('[BillingController] No restaurantId in subscription metadata');
            return;
        }

        // Expire subscription
        await subscriptionService.expireSubscription(restaurantId);

        console.log(`[BillingController] Subscription cancelled for restaurant: ${restaurantId}`);
    }
}
