import { z } from 'zod';
export declare const createUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodEffects<z.ZodString, string, string>;
    password: z.ZodString;
    role: z.ZodEnum<["ADMIN", "MANAGER", "HOSTESS"]>;
    language: z.ZodOptional<z.ZodString>;
    isActive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    password: string;
    email: string;
    name: string;
    role: "ADMIN" | "MANAGER" | "HOSTESS";
    isActive: boolean;
    language?: string | undefined;
}, {
    password: string;
    email: string;
    name: string;
    role: "ADMIN" | "MANAGER" | "HOSTESS";
    isActive?: boolean | undefined;
    language?: string | undefined;
}>;
export declare const updateUserSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    role: z.ZodOptional<z.ZodEnum<["ADMIN", "MANAGER", "HOSTESS"]>>;
    language: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    name?: string | undefined;
    role?: "ADMIN" | "MANAGER" | "HOSTESS" | undefined;
    isActive?: boolean | undefined;
    language?: string | undefined;
}, {
    email?: string | undefined;
    name?: string | undefined;
    role?: "ADMIN" | "MANAGER" | "HOSTESS" | undefined;
    isActive?: boolean | undefined;
    language?: string | undefined;
}>;
export declare const updateUserStatusSchema: z.ZodObject<{
    isActive: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    isActive: boolean;
}, {
    isActive: boolean;
}>;
export declare const listUsersQuerySchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<["ADMIN", "MANAGER", "HOSTESS"]>>;
    isActive: z.ZodEffects<z.ZodOptional<z.ZodBoolean>, boolean | undefined, unknown>;
}, "strip", z.ZodTypeAny, {
    role?: "ADMIN" | "MANAGER" | "HOSTESS" | undefined;
    isActive?: boolean | undefined;
    search?: string | undefined;
}, {
    role?: "ADMIN" | "MANAGER" | "HOSTESS" | undefined;
    isActive?: unknown;
    search?: string | undefined;
}>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
//# sourceMappingURL=users.validator.d.ts.map