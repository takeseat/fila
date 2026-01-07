import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requirePickupOrdersEnabled } from '../middleware/pickup-orders.middleware';
import { PickupOrdersController } from '../controllers/pickup-orders.controller';
import { PickupOrdersConfigController } from '../controllers/pickup-orders-config.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Config routes (don't require feature to be enabled - needed to enable it!)
router.get('/config', PickupOrdersConfigController.getConfig);
router.put('/config', PickupOrdersConfigController.updateConfig);
router.get('/config/defaults', PickupOrdersConfigController.getDefaults);

// Feature-gated routes
router.use(requirePickupOrdersEnabled);

// CRUD routes
router.get('/', PickupOrdersController.listOrders);
router.get('/:id', PickupOrdersController.getOrder);
router.post('/', PickupOrdersController.createOrder);
router.put('/:id', PickupOrdersController.updateOrder);

// Status management
router.patch('/:id/status', PickupOrdersController.changeStatus);

// WhatsApp
router.post('/:id/resend-whatsapp', PickupOrdersController.resendWhatsApp);

export default router;
