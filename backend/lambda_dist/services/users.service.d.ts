import { CreateUserInput, UpdateUserInput, UpdateUserStatusInput, ListUsersQuery } from '../validators/users.validator';
export declare class UsersService {
    /**
     * List all users from the same restaurant
     */
    listUsers(restaurantId: string, query: ListUsersQuery): Promise<{
        email: string;
        id: string;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
        language: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    /**
     * Get user by ID (same restaurant only)
     */
    getUserById(userId: string, restaurantId: string): Promise<{
        email: string;
        id: string;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
        language: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    /**
     * Create new user
     * - Inherits language from creator if not specified
     * - Validates email uniqueness globally
     * - Links to creator's restaurant
     */
    createUser(data: CreateUserInput, creatorRestaurantId: string, creatorLanguage: string): Promise<{
        email: string;
        id: string;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
        language: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    /**
     * Update user
     * - Validates email uniqueness if changed
     * - Prevents removing last active admin
     * - Same restaurant only
     */
    updateUser(userId: string, data: UpdateUserInput, restaurantId: string): Promise<{
        email: string;
        id: string;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
        language: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    /**
     * Update user status (activate/deactivate)
     * - Prevents deactivating last active admin
     */
    updateUserStatus(userId: string, data: UpdateUserStatusInput, restaurantId: string): Promise<{
        email: string;
        id: string;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
        language: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    /**
     * Validate that we're not removing the last active admin
     */
    private validateNotLastActiveAdmin;
    /**
     * Delete user (optional - if needed)
     * - Prevents deleting last active admin
     */
    deleteUser(userId: string, restaurantId: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=users.service.d.ts.map