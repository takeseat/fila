import { Router } from 'express';
import { ReportsController } from '../controllers/reports.controller';
import { QueueEntriesController } from '../controllers/queue-entries.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const reportsController = new ReportsController();
const queueEntriesController = new QueueEntriesController();

// All reports routes require authentication
router.use(authenticate);

/**
 * GET /reports/waitlist-performance
 * Query params: from, to, timeRange?, daysOfWeek?, partySizeBucket?, statuses?, maxWaitMinutes?
 */
router.get('/waitlist-performance', (req, res) =>
    reportsController.getPerformanceReport(req, res)
);

/**
 * GET /reports/executive-summary
 * Query params: from, to, timeRange?, daysOfWeek?, partySizeBucket?, maxWaitMinutes?
 */
router.get('/executive-summary', (req, res) =>
    reportsController.getExecutiveSummary(req, res)
);

/**
 * GET /reports/waitlist-flow
 * Query params: from, to, timeRange?, daysOfWeek?, partySizeBucket?, maxWaitMinutes?
 */
router.get('/waitlist-flow', (req, res) =>
    reportsController.getFlowReport(req, res)
);

/**
 * GET /reports/queue-entries
 * Analytical queue report with pagination
 * Query params: from, to, page?, pageSize?, sortBy?, sortOrder?, statuses?, clientSearch?, partySizeMin?, partySizeMax?, daysOfWeek?, timeRange?
 */
router.get('/queue-entries', (req, res) =>
    queueEntriesController.getQueueEntries(req, res)
);

/**
 * GET /reports/queue-entries/export/csv
 * Export queue entries as CSV
 * Query params: same as /queue-entries
 */
router.get('/queue-entries/export/csv', (req, res) =>
    queueEntriesController.exportCSV(req, res)
);

/**
 * GET /reports/queue-entries/export/pdf
 * Export queue entries as PDF
 * Query params: same as /queue-entries
 */
router.get('/queue-entries/export/pdf', (req, res) =>
    queueEntriesController.exportPDF(req, res)
);

export default router;
