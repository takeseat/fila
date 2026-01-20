import { Router } from 'express';
import { JobsController } from '../controllers/jobs.controller';

const router = Router();
const controller = new JobsController();

// Only SYSADMIN or securely authorized clients should access this
// For now, we reuse the existing adminAuthMiddleware or just assume valid token with SYSADMIN role
// The prompt said "secure endpoint". Let's restrict to SYSADMIN.
import { adminAuthMiddleware } from '../middleware/admin-auth.middleware';
import { authenticate } from '../middleware/auth';

router.use(authenticate);
router.use(adminAuthMiddleware);

router.post('/check-trial-expiration', (req, res) => controller.checkTrialExpiration(req, res));

export default router;
