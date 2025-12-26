import { z } from 'zod';

export const createUserSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email').transform(val => val.toLowerCase().trim()),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['ADMIN', 'MANAGER', 'HOSTESS']),
    language: z.string().optional(), // Will default to creator's language if not provided
    isActive: z.boolean().optional().default(true),
});

export const updateUserSchema = z.object({
    name: z.string().min(1, 'Name is required').optional(),
    email: z.string().email('Invalid email').transform(val => val.toLowerCase().trim()).optional(),
    role: z.enum(['ADMIN', 'MANAGER', 'HOSTESS']).optional(),
    language: z.string().optional(),
    isActive: z.boolean().optional(),
});

export const updateUserStatusSchema = z.object({
    isActive: z.boolean(),
});

export const listUsersQuerySchema = z.object({
    search: z.string().optional(),
    role: z.enum(['ADMIN', 'MANAGER', 'HOSTESS']).optional(),
    isActive: z.preprocess(
        (val) => {
            if (val === 'true') return true;
            if (val === 'false') return false;
            return val;
        },
        z.boolean().optional()
    ),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
