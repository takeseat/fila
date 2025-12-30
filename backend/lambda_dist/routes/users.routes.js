"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const usersController = new users_controller_1.UsersController();
// All routes require authentication
router.use(auth_1.authenticate);
// Get current user profile
router.get('/me', usersController.getProfile.bind(usersController));
// Update user profile (name and/or language)
router.put('/me', usersController.updateProfile.bind(usersController));
// Update user language (legacy endpoint, kept for compatibility)
router.patch('/me/language', usersController.updateLanguage.bind(usersController));
// Update user password
router.put('/me/password', usersController.updatePassword.bind(usersController));
exports.default = router;
//# sourceMappingURL=users.routes.js.map