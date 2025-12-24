import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { ReportsController } from '../controllers/reports.controller';
import { QueueEntriesController } from '../controllers/queue-entries.controller';
import { DashboardController } from '../controllers/dashboard.controller';

// Reports Routes
export const reportsRouter = Router();
const reportsController = new ReportsController();
const queueEntriesController = new QueueEntriesController();

// Dashboard Routes
export const dashboardRouter = Router();
const dashboardController = new DashboardController();

// All routes require authentication
reportsRouter.use(authenticate);
dashboardRouter.use(authenticate);

/**
 * GET /dashboard/metrics
 * Get all dashboard metrics
 */
dashboardRouter.get('/metrics', (req, res) =>
    dashboardController.getMetrics(req, res)
);

/**
 * GET /reports/waitlist-performance
 * Performance report with KPIs and time series
 */
reportsRouter.get('/waitlist-performance', (req, res) =>
    reportsController.getPerformanceReport(req, res)
);

/**
 * GET /reports/executive-summary
 * Executive summary with key metrics
 */
reportsRouter.get('/executive-summary', (req, res) =>
    reportsController.getExecutiveSummary(req, res)
);

/**
 * GET /reports/waitlist-flow
 * Flow analysis with bottleneck metrics
 */
reportsRouter.get('/waitlist-flow', (req, res) =>
    reportsController.getFlowReport(req, res)
);

/**
 * GET /reports/queue-entries
 * Analytical queue report with pagination
 */
reportsRouter.get('/queue-entries', (req, res) =>
    queueEntriesController.getQueueEntries(req, res)
);

/**
 * GET /reports/queue-entries/export/csv
 * Export queue entries as CSV
 */
reportsRouter.get('/queue-entries/export/csv', (req, res) =>
    queueEntriesController.exportCSV(req, res)
);

/**
 * GET /reports/queue-entries/export/pdf
 * Export queue entries as PDF
 */
reportsRouter.get('/queue-entries/export/pdf', (req, res) =>
    queueEntriesController.exportPDF(req, res)
);

// Legacy endpoint (keep for backward compatibility if needed)
// reportsRouter.get('/waitlist-summary', (req, res) => ...);
