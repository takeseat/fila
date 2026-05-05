import { Router } from 'express';
import { ReportsController } from '../controllers/reports.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const reportsController = new ReportsController();

// All reports routes require authentication
router.use(authenticate);

/**
 * GET /reports/waitlist-performance
 * Query params: from, to, timeRange?, daysOfWeek?, partySizeBucket?, statuses?, maxWaitMinutes?
 */
router.get('/waitlist-performance', (req, res) =>
    reportsController.getPerformanceReport(req, res)
);

export default router;
