import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { CustomersController } from '../controllers/customers.controller';

const router = Router();
const controller = new CustomersController();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: List customers with optional filters
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', (req, res) => controller.getCustomers(req as any, res));

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Get customer details and history
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', (req, res) => controller.getCustomerDetails(req as any, res));

export default router;
