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
router.get('/', authenticate, requirePickupOrdersEnabled, (req, res) => PickupOrdersController.listOrders(req, res));
router.get('/:id', authenticate, requirePickupOrdersEnabled, (req, res) => PickupOrdersController.getOrder(req, res));
router.post('/', authenticate, requirePickupOrdersEnabled, (req, res) => PickupOrdersController.createOrder(req, res));
router.put('/:id', authenticate, requirePickupOrdersEnabled, (req, res) => PickupOrdersController.updateOrder(req, res));

// Status management
router.patch('/:id/status', authenticate, requirePickupOrdersEnabled, (req, res) => PickupOrdersController.changeStatus(req, res));

// WhatsApp
router.post('/:id/resend-whatsapp', authenticate, requirePickupOrdersEnabled, (req, res) => PickupOrdersController.resendWhatsApp(req, res));

export default router;
