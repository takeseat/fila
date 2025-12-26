import prisma from '../config/database';
import { hashPassword } from '../utils/password';
import { CreateUserInput, UpdateUserInput, UpdateUserStatusInput, ListUsersQuery } from '../validators/users.validator';

export class UsersService {
    /**
     * List all users from the same restaurant
     */
    async listUsers(restaurantId: string, query: ListUsersQuery) {
        const where: any = {
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

        const users = await prisma.user.findMany({
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
    async getUserById(userId: string, restaurantId: string) {
        const user = await prisma.user.findFirst({
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
    async createUser(data: CreateUserInput, creatorRestaurantId: string, creatorLanguage: string) {
        // Normalize email
        const normalizedEmail = data.email.toLowerCase().trim();

        // Check if email already exists (global uniqueness)
        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (existingUser) {
            throw new Error('This email is already in use');
        }

        // Hash password
        const passwordHash = await hashPassword(data.password);

        // Create user with creator's language as default
        const user = await prisma.user.create({
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
    async updateUser(userId: string, data: UpdateUserInput, restaurantId: string) {
        // Get current user
        const currentUser = await this.getUserById(userId, restaurantId);

        // If email is being changed, validate uniqueness
        if (data.email && data.email !== currentUser.email) {
            const normalizedEmail = data.email.toLowerCase().trim();
            const existingUser = await prisma.user.findUnique({
                where: { email: normalizedEmail },
            });

            if (existingUser) {
                throw new Error('This email is already in use');
            }
        }

        // If changing role or status of an ADMIN, check if it's the last active admin
        if (
            (data.role && data.role !== 'ADMIN' && currentUser.role === 'ADMIN') ||
            (data.isActive === false && currentUser.role === 'ADMIN' && currentUser.isActive)
        ) {
            await this.validateNotLastActiveAdmin(restaurantId, userId);
        }

        // Update user
        const updatedData: any = {};
        if (data.name) updatedData.name = data.name;
        if (data.email) updatedData.email = data.email.toLowerCase().trim();
        if (data.role) updatedData.role = data.role;
        if (data.language) updatedData.language = data.language;
        if (data.isActive !== undefined) updatedData.isActive = data.isActive;

        const user = await prisma.user.update({
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
    async updateUserStatus(userId: string, data: UpdateUserStatusInput, restaurantId: string) {
        const currentUser = await this.getUserById(userId, restaurantId);

        // If deactivating an active ADMIN, check if it's the last one
        if (data.isActive === false && currentUser.role === 'ADMIN' && currentUser.isActive) {
            await this.validateNotLastActiveAdmin(restaurantId, userId);
        }

        const user = await prisma.user.update({
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
    private async validateNotLastActiveAdmin(restaurantId: string, excludeUserId: string) {
        const activeAdmins = await prisma.user.count({
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
    async deleteUser(userId: string, restaurantId: string) {
        const currentUser = await this.getUserById(userId, restaurantId);

        // If deleting an active ADMIN, check if it's the last one
        if (currentUser.role === 'ADMIN' && currentUser.isActive) {
            await this.validateNotLastActiveAdmin(restaurantId, userId);
        }

        await prisma.user.delete({
            where: { id: userId },
        });

        return { message: 'User deleted successfully' };
    }
}
