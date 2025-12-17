import { z } from 'zod';

export const CreateCustomerInputSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    countryCode: z.string().min(2, 'Country code is required'),
    ddi: z.string().min(1, 'DDI is required'),
    phone: z.string().min(6, 'Phone number is required'),
    fullPhone: z.string().min(8, 'Full phone number is required'),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    notes: z.string().optional(),
});

export const UpdateCustomerInputSchema = z.object({
    name: z.string().min(1, 'Name is required').optional(),
    countryCode: z.string().min(2, 'Country code is required').optional(),
    ddi: z.string().min(1, 'DDI is required').optional(),
    phone: z.string().min(6, 'Phone number is required').optional(),
    fullPhone: z.string().min(8, 'Full phone number is required').optional(),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    notes: z.string().optional(),
});

export type CreateCustomerInput = z.infer<typeof CreateCustomerInputSchema>;
export type UpdateCustomerInput = z.infer<typeof UpdateCustomerInputSchema>;
