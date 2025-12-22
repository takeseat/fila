import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const usersController = new UsersController();

// All routes require authentication
router.use(authenticate);

// Get current user profile
router.get('/me', usersController.getProfile.bind(usersController));

// Update user profile (name and/or language)
router.put('/me', usersController.updateProfile.bind(usersController));

// Update user language (legacy endpoint, kept for compatibility)
router.patch('/me/language', usersController.updateLanguage.bind(usersController));

// Update user password
router.put('/me/password', usersController.updatePassword.bind(usersController));

export default router;
