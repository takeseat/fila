"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsersQuerySchema = exports.updateUserStatusSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    email: zod_1.z.string().email('Invalid email').transform(val => val.toLowerCase().trim()),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    role: zod_1.z.enum(['ADMIN', 'MANAGER', 'HOSTESS']),
    language: zod_1.z.string().optional(), // Will default to creator's language if not provided
    isActive: zod_1.z.boolean().optional().default(true),
});
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').optional(),
    email: zod_1.z.string().email('Invalid email').transform(val => val.toLowerCase().trim()).optional(),
    role: zod_1.z.enum(['ADMIN', 'MANAGER', 'HOSTESS']).optional(),
    language: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.updateUserStatusSchema = zod_1.z.object({
    isActive: zod_1.z.boolean(),
});
exports.listUsersQuerySchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    role: zod_1.z.enum(['ADMIN', 'MANAGER', 'HOSTESS']).optional(),
    isActive: zod_1.z.preprocess((val) => {
        if (val === 'true')
            return true;
        if (val === 'false')
            return false;
        return val;
    }, zod_1.z.boolean().optional()),
});
//# sourceMappingURL=users.validator.js.map