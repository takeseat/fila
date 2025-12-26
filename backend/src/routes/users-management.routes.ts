import { Router } from 'express';
import { UsersManagementController } from '../controllers/users-management.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const controller = new UsersManagementController();

// All routes require authentication
router.use(authenticate);

/**
 * @route GET /api/users-management
 * @desc List all users from the same restaurant
 * @query search, role, isActive
 */
router.get('/', controller.listUsers.bind(controller));

/**
 * @route GET /api/users-management/:id
 * @desc Get user by ID (same restaurant only)
 */
router.get('/:id', controller.getUserById.bind(controller));

/**
 * @route POST /api/users-management
 * @desc Create new user
 * @body name, email, password, role, language (optional), isActive (optional)
 */
router.post('/', controller.createUser.bind(controller));

/**
 * @route PUT /api/users-management/:id
 * @desc Update user
 * @body name, email, role, language, isActive
 */
router.put('/:id', controller.updateUser.bind(controller));

/**
 * @route PATCH /api/users-management/:id/status
 * @desc Update user status (activate/deactivate)
 * @body isActive
 */
router.patch('/:id/status', controller.updateUserStatus.bind(controller));

/**
 * @route DELETE /api/users-management/:id
 * @desc Delete user
 */
router.delete('/:id', controller.deleteUser.bind(controller));

export default router;
