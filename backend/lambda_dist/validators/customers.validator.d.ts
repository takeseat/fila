import { z } from 'zod';
export declare const CreateCustomerInputSchema: z.ZodObject<{
    name: z.ZodString;
    countryCode: z.ZodString;
    ddi: z.ZodString;
    phone: z.ZodString;
    fullPhone: z.ZodString;
    email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    countryCode: string;
    name: string;
    phone: string;
    ddi: string;
    fullPhone: string;
    email?: string | undefined;
    notes?: string | undefined;
}, {
    countryCode: string;
    name: string;
    phone: string;
    ddi: string;
    fullPhone: string;
    email?: string | undefined;
    notes?: string | undefined;
}>;
export declare const UpdateCustomerInputSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    countryCode: z.ZodOptional<z.ZodString>;
    ddi: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    fullPhone: z.ZodOptional<z.ZodString>;
    email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    countryCode?: string | undefined;
    email?: string | undefined;
    name?: string | undefined;
    phone?: string | undefined;
    notes?: string | undefined;
    ddi?: string | undefined;
    fullPhone?: string | undefined;
}, {
    countryCode?: string | undefined;
    email?: string | undefined;
    name?: string | undefined;
    phone?: string | undefined;
    notes?: string | undefined;
    ddi?: string | undefined;
    fullPhone?: string | undefined;
}>;
export type CreateCustomerInput = z.infer<typeof CreateCustomerInputSchema>;
export type UpdateCustomerInput = z.infer<typeof UpdateCustomerInputSchema>;
//# sourceMappingURL=customers.validator.d.ts.map