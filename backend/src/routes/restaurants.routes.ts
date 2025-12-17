import { Router } from 'express';
import { RestaurantsController } from '../controllers/restaurants.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const controller = new RestaurantsController();

router.use(authenticate);

router.get('/settings', (req, res) => controller.getSettings(req as any, res));
router.put('/settings', (req, res) => controller.updateSettings(req as any, res));

export default router;
