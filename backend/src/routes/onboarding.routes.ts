import { Router } from 'express';
import { OnboardingController } from '../controllers/onboarding.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all onboarding routes
router.use(authenticate);

router.put('/step1', OnboardingController.updateStep1);
router.put('/step2', OnboardingController.updateStep2);
router.post('/complete', OnboardingController.complete);

export default router;
