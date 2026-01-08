import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requirePickupOrdersEnabled } from '../middleware/pickup-orders.middleware';
import { PickupOrdersController } from '../controllers/pickup-orders.controller';
import { PickupOrdersConfigController } from '../controllers/pickup-orders-config.controller';

const router = Router();

// Config routes (don't require feature to be enabled - needed to enable it!)
router.get('/config', authenticate, PickupOrdersConfigController.getConfig);
router.put('/config', authenticate, PickupOrdersConfigController.updateConfig);
router.get('/config/defaults', authenticate, PickupOrdersConfigController.getDefaults);

// CRUD routes
router.get('/', authenticate, /* requirePickupOrdersEnabled, */ PickupOrdersController.listOrders);
router.get('/:id', authenticate, requirePickupOrdersEnabled, PickupOrdersController.getOrder);
router.post('/', authenticate, requirePickupOrdersEnabled, PickupOrdersController.createOrder);
router.put('/:id', authenticate, requirePickupOrdersEnabled, PickupOrdersController.updateOrder);

// Status management
router.patch('/:id/status', authenticate, requirePickupOrdersEnabled, PickupOrdersController.changeStatus);

// WhatsApp
router.post('/:id/resend-whatsapp', authenticate, requirePickupOrdersEnabled, PickupOrdersController.resendWhatsApp);

export default router;
