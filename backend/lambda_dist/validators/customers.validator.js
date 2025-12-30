"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCustomerInputSchema = exports.CreateCustomerInputSchema = void 0;
const zod_1 = require("zod");
exports.CreateCustomerInputSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    countryCode: zod_1.z.string().min(2, 'Country code is required'),
    ddi: zod_1.z.string().min(1, 'DDI is required'),
    phone: zod_1.z.string().min(6, 'Phone number is required'),
    fullPhone: zod_1.z.string().min(8, 'Full phone number is required'),
    email: zod_1.z.string().email('Invalid email').optional().or(zod_1.z.literal('')),
    notes: zod_1.z.string().optional(),
});
exports.UpdateCustomerInputSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').optional(),
    countryCode: zod_1.z.string().min(2, 'Country code is required').optional(),
    ddi: zod_1.z.string().min(1, 'DDI is required').optional(),
    phone: zod_1.z.string().min(6, 'Phone number is required').optional(),
    fullPhone: zod_1.z.string().min(8, 'Full phone number is required').optional(),
    email: zod_1.z.string().email('Invalid email').optional().or(zod_1.z.literal('')),
    notes: zod_1.z.string().optional(),
});
//# sourceMappingURL=customers.validator.js.map