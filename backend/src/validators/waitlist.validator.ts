import { z } from 'zod';

export const CreateWaitlistEntryInputSchema = z.object({
    customerId: z.string().optional(),
    customerName: z.string().min(1, 'Customer name is required'),
    customerCountryCode: z.string().length(2, 'Invalid country code'),
    customerDdi: z.string().regex(/^\+\d{1,4}$/, 'Invalid DDI format'),
    customerPhone: z.string().min(6, 'Phone must have at least 6 digits'),
    partySize: z.number().int().min(1, 'Party size must be at least 1'),
    estimatedWaitMinutes: z.number().int().optional(),
    notes: z.string().optional(),
});

export type CreateWaitlistEntryInput = z.infer<typeof CreateWaitlistEntryInputSchema>;
