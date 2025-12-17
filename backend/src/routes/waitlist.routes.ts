import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { WaitlistController } from '../controllers/waitlist.controller';

const router = Router();
const waitlistController = new WaitlistController();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /waitlist:
 *   get:
 *     summary: Get current waitlist
 *     tags: [Waitlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of waitlist entries
 */
router.get('/', (req, res) => waitlistController.getWaitlist(req as any, res));

/**
 * @swagger
 * /waitlist/metrics:
 *   get:
 *     summary: Get queue metrics (average wait time, etc)
 *     tags: [Waitlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Queue metrics
 */
router.get('/metrics', (req, res) => waitlistController.getMetrics(req as any, res));

/**
 * @swagger
 * /waitlist:
 *   post:
 *     summary: Add entry to waitlist
 *     tags: [Waitlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - customerPhone
 *               - partySize
 *             properties:
 *               customerId:
 *                 type: string
 *               customerName:
 *                 type: string
 *               customerPhone:
 *                 type: string
 *               partySize:
 *                 type: number
 *               estimatedWaitMinutes:
 *                 type: number
 *     responses:
 *       201:
 *         description: Entry created
 */
router.post('/', (req, res) => waitlistController.createEntry(req as any, res));

/**
 * @swagger
 * /waitlist/{id}/call:
 *   patch:
 *     summary: Call next customer
 *     tags: [Waitlist]
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
 *         description: Entry updated
 */
router.patch('/:id/call', (req, res) => waitlistController.callEntry(req as any, res));

/**
 * @swagger
 * /waitlist/{id}/seat:
 *   patch:
 *     summary: Mark customer as seated
 *     tags: [Waitlist]
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
 *         description: Entry updated
 */
router.patch('/:id/seat', (req, res) => waitlistController.seatEntry(req as any, res));

/**
 * @swagger
 * /waitlist/{id}/cancel:
 *   patch:
 *     summary: Cancel waitlist entry
 *     tags: [Waitlist]
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
 *         description: Entry cancelled
 */
router.patch('/:id/cancel', (req, res) => waitlistController.cancelEntry(req as any, res));

/**
 * @swagger
 * /waitlist/{id}/no-show:
 *   patch:
 *     summary: Mark customer as no-show
 *     tags: [Waitlist]
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
 *         description: Entry marked as no-show
 */
router.patch('/:id/no-show', (req, res) => waitlistController.markNoShow(req as any, res));

export default router;
