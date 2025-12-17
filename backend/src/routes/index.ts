import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { ReportsController } from '../controllers/index';

// Reports Routes
export const reportsRouter = Router();
const reportsController = new ReportsController();

reportsRouter.use(authenticate);
reportsRouter.get('/waitlist-summary', (req, res) => reportsController.getWaitlistSummary(req as any, res));
