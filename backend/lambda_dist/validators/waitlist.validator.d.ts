import { z } from 'zod';
export declare const CreateWaitlistEntryInputSchema: z.ZodObject<{
    customerId: z.ZodOptional<z.ZodString>;
    customerName: z.ZodString;
    customerCountryCode: z.ZodString;
    customerDdi: z.ZodString;
    customerPhone: z.ZodString;
    partySize: z.ZodNumber;
    estimatedWaitMinutes: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    customerName: string;
    customerCountryCode: string;
    customerDdi: string;
    customerPhone: string;
    partySize: number;
    customerId?: string | undefined;
    estimatedWaitMinutes?: number | undefined;
    notes?: string | undefined;
}, {
    customerName: string;
    customerCountryCode: string;
    customerDdi: string;
    customerPhone: string;
    partySize: number;
    customerId?: string | undefined;
    estimatedWaitMinutes?: number | undefined;
    notes?: string | undefined;
}>;
export type CreateWaitlistEntryInput = z.infer<typeof CreateWaitlistEntryInputSchema>;
//# sourceMappingURL=waitlist.validator.d.ts.map