"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersManagementController = void 0;
const users_service_1 = require("../services/users.service");
const users_validator_1 = require("../validators/users.validator");
const usersService = new users_service_1.UsersService();
class UsersManagementController {
    async listUsers(req, res) {
        try {
            const restaurantId = req.user.restaurantId;
            const query = users_validator_1.listUsersQuerySchema.parse(req.query);
            const users = await usersService.listUsers(restaurantId, query);
            res.json(users);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const restaurantId = req.user.restaurantId;
            const user = await usersService.getUserById(id, restaurantId);
            res.json(user);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    async createUser(req, res) {
        try {
            const restaurantId = req.user.restaurantId;
            const creatorLanguage = req.user.language || 'en';
            const data = users_validator_1.createUserSchema.parse(req.body);
            const user = await usersService.createUser(data, restaurantId, creatorLanguage);
            res.status(201).json(user);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const restaurantId = req.user.restaurantId;
            const data = users_validator_1.updateUserSchema.parse(req.body);
            const user = await usersService.updateUser(id, data, restaurantId);
            res.json(user);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async updateUserStatus(req, res) {
        try {
            const { id } = req.params;
            const restaurantId = req.user.restaurantId;
            const data = users_validator_1.updateUserStatusSchema.parse(req.body);
            const user = await usersService.updateUserStatus(id, data, restaurantId);
            res.json(user);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const restaurantId = req.user.restaurantId;
            const result = await usersService.deleteUser(id, restaurantId);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.UsersManagementController = UsersManagementController;
//# sourceMappingURL=users-management.controller.js.map