import { Router } from 'express';
import { RestaurantsController } from '../controllers/restaurants.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const controller = new RestaurantsController();

router.use(authenticate);

// Business data endpoints
router.get('/business', (req, res) => controller.getBusinessData(req as any, res));
router.put('/business', (req, res) => controller.updateBusinessData(req as any, res));

// Settings endpoints (operational parameters)
router.get('/settings', (req, res) => controller.getSettings(req as any, res));
router.put('/settings', (req, res) => controller.updateSettings(req as any, res));

export default router;
