import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { adminAuthMiddleware } from '../middleware/admin-auth.middleware';
import { AdminRestaurantsController } from '../controllers/admin-restaurants.controller';
import { ImpersonationController } from '../controllers/impersonation.controller';
import jobsRouter from './jobs.routes';

const router = Router();

// All admin routes require authentication + SYSADMIN role
router.use(authenticate);
router.use(adminAuthMiddleware);

// Restaurant management
router.get('/restaurants', AdminRestaurantsController.listRestaurants);
router.post('/restaurants', AdminRestaurantsController.createRestaurant);
router.get('/restaurants/:id', AdminRestaurantsController.getRestaurant);
router.put('/restaurants/:id', AdminRestaurantsController.updateRestaurant);
router.patch('/restaurants/:id/status', AdminRestaurantsController.toggleStatus);

// Impersonation
router.post('/restaurants/:id/impersonate', ImpersonationController.generateToken);
router.post('/impersonation/end', ImpersonationController.endSession);
router.get('/impersonation/logs', ImpersonationController.getLogs);

// Jobs
router.use('/jobs', jobsRouter);

export default router;
