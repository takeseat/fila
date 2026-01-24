import { Router } from 'express';
import { BillingController } from '../controllers/billing.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const controller = new BillingController();

// Get subscription status (allow even if expired)
router.get('/status', authenticate, (req, res) => controller.getStatus(req as any, res));

// Initiate subscription checkout
router.post('/subscribe', authenticate, (req, res) => controller.initiateSubscription(req as any, res));

// Webhook endpoint (no auth - verified by Stripe signature)
router.post('/webhook', (req, res) => controller.handleWebhook(req as any, res));

export default router;
