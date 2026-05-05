import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { ReportsController } from '../controllers/reports.controller';
import usersManagementRoutes from './users-management.routes';
import onboardingRoutes from './onboarding.routes';

// Reports Routes
export const reportsRouter = Router();
const reportsController = new ReportsController();

// Users Management Routes
export const usersManagementRouter = usersManagementRoutes;

// Onboarding Routes
export const onboardingRouter = onboardingRoutes;

// All routes require authentication
reportsRouter.use(authenticate);

/**
 * GET /reports/waitlist-performance
 * Performance report with KPIs and time series (MVP report)
 */
reportsRouter.get('/waitlist-performance', (req, res) =>
    reportsController.getPerformanceReport(req, res)
);
