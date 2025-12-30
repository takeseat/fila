import { Router } from 'express';
import { WhatsAppSettingsController } from '../controllers/whatsapp-settings.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const controller = new WhatsAppSettingsController();

router.get('/', authenticate, controller.getSettings.bind(controller));
router.put('/', authenticate, controller.updateSettings.bind(controller));

export default router;
