import { Router } from 'express';
import { CustomersController } from '../controllers/customers.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const customersController = new CustomersController();

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get customers with filters and pagination
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by name (case-insensitive contains)
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         description: Filter by phone (contains in fullPhone)
 *       - in: query
 *         name: lastVisitAfter
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter customers who visited after this date (ISO format)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Paginated customer list
 */
router.get('/', authenticate, (req, res) => customersController.getCustomers(req, res));

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Get customer details with history
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer details
 *       404:
 *         description: Customer not found
 */
router.get('/:id', authenticate, (req, res) => customersController.getCustomer(req, res));

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - countryCode
 *               - ddi
 *               - phone
 *               - fullPhone
 *             properties:
 *               name:
 *                 type: string
 *               countryCode:
 *                 type: string
 *               ddi:
 *                 type: string
 *               phone:
 *                 type: string
 *               fullPhone:
 *                 type: string
 *               email:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Customer created
 *       400:
 *         description: Validation error
 */
router.post('/', authenticate, (req, res) => customersController.createCustomer(req, res));

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Update customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               countryCode:
 *                 type: string
 *               ddi:
 *                 type: string
 *               phone:
 *                 type: string
 *               fullPhone:
 *                 type: string
 *               email:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer updated
 *       404:
 *         description: Customer not found
 */
router.put('/:id', authenticate, (req, res) => customersController.updateCustomer(req, res));

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Delete customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Customer deleted
 *       404:
 *         description: Customer not found
 */
router.delete('/:id', authenticate, (req, res) => customersController.deleteCustomer(req, res));

export default router;
