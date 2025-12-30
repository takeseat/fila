"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const database_1 = __importDefault(require("../config/database"));
const password_1 = require("../utils/password");
class UsersService {
    /**
     * List all users from the same restaurant
     */
    async listUsers(restaurantId, query) {
        const where = {
            restaurantId,
        };
        // Apply filters
        if (query.search) {
            where.OR = [
                { name: { contains: query.search } },
                { email: { contains: query.search } },
            ];
        }
        if (query.role) {
            where.role = query.role;
        }
        if (query.isActive !== undefined) {
            where.isActive = query.isActive;
        }
        const users = await database_1.default.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                language: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return users;
    }
    /**
     * Get user by ID (same restaurant only)
     */
    async getUserById(userId, restaurantId) {
        const user = await database_1.default.user.findFirst({
            where: {
                id: userId,
                restaurantId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                language: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    /**
     * Create new user
     * - Inherits language from creator if not specified
     * - Validates email uniqueness globally
     * - Links to creator's restaurant
     */
    async createUser(data, creatorRestaurantId, creatorLanguage) {
        // Normalize email
        const normalizedEmail = data.email.toLowerCase().trim();
        // Check if email already exists (global uniqueness)
        const existingUser = await database_1.default.user.findUnique({
            where: { email: normalizedEmail },
        });
        if (existingUser) {
            throw new Error('This email is already in use');
        }
        // Hash password
        const passwordHash = await (0, password_1.hashPassword)(data.password);
        // Create user with creator's language as default
        const user = await database_1.default.user.create({
            data: {
                restaurantId: creatorRestaurantId,
                name: data.name,
                email: normalizedEmail,
                passwordHash,
                role: data.role,
                isActive: data.isActive ?? true,
                language: data.language || creatorLanguage, // Inherit from creator
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                language: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return user;
    }
    /**
     * Update user
     * - Validates email uniqueness if changed
     * - Prevents removing last active admin
     * - Same restaurant only
     */
    async updateUser(userId, data, restaurantId) {
        // Get current user
        const currentUser = await this.getUserById(userId, restaurantId);
        // If email is being changed, validate uniqueness
        if (data.email && data.email !== currentUser.email) {
            const normalizedEmail = data.email.toLowerCase().trim();
            const existingUser = await database_1.default.user.findUnique({
                where: { email: normalizedEmail },
            });
            if (existingUser) {
                throw new Error('This email is already in use');
            }
        }
        // If changing role or status of an ADMIN, check if it's the last active admin
        if ((data.role && data.role !== 'ADMIN' && currentUser.role === 'ADMIN') ||
            (data.isActive === false && currentUser.role === 'ADMIN' && currentUser.isActive)) {
            await this.validateNotLastActiveAdmin(restaurantId, userId);
        }
        // Update user
        const updatedData = {};
        if (data.name)
            updatedData.name = data.name;
        if (data.email)
            updatedData.email = data.email.toLowerCase().trim();
        if (data.role)
            updatedData.role = data.role;
        if (data.language)
            updatedData.language = data.language;
        if (data.isActive !== undefined)
            updatedData.isActive = data.isActive;
        const user = await database_1.default.user.update({
            where: { id: userId },
            data: updatedData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                language: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return user;
    }
    /**
     * Update user status (activate/deactivate)
     * - Prevents deactivating last active admin
     */
    async updateUserStatus(userId, data, restaurantId) {
        const currentUser = await this.getUserById(userId, restaurantId);
        // If deactivating an active ADMIN, check if it's the last one
        if (data.isActive === false && currentUser.role === 'ADMIN' && currentUser.isActive) {
            await this.validateNotLastActiveAdmin(restaurantId, userId);
        }
        const user = await database_1.default.user.update({
            where: { id: userId },
            data: { isActive: data.isActive },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                language: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return user;
    }
    /**
     * Validate that we're not removing the last active admin
     */
    async validateNotLastActiveAdmin(restaurantId, excludeUserId) {
        const activeAdmins = await database_1.default.user.count({
            where: {
                restaurantId,
                role: 'ADMIN',
                isActive: true,
                id: { not: excludeUserId },
            },
        });
        if (activeAdmins === 0) {
            throw new Error('The restaurant must have at least one active administrator');
        }
    }
    /**
     * Delete user (optional - if needed)
     * - Prevents deleting last active admin
     */
    async deleteUser(userId, restaurantId) {
        const currentUser = await this.getUserById(userId, restaurantId);
        // If deleting an active ADMIN, check if it's the last one
        if (currentUser.role === 'ADMIN' && currentUser.isActive) {
            await this.validateNotLastActiveAdmin(restaurantId, userId);
        }
        await database_1.default.user.delete({
            where: { id: userId },
        });
        return { message: 'User deleted successfully' };
    }
}
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map