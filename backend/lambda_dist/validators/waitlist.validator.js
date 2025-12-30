"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateWaitlistEntryInputSchema = void 0;
const zod_1 = require("zod");
exports.CreateWaitlistEntryInputSchema = zod_1.z.object({
    customerId: zod_1.z.string().optional(),
    customerName: zod_1.z.string().min(1, 'Customer name is required'),
    customerCountryCode: zod_1.z.string().length(2, 'Invalid country code'),
    customerDdi: zod_1.z.string().regex(/^\+\d{1,4}$/, 'Invalid DDI format'),
    customerPhone: zod_1.z.string().min(6, 'Phone must have at least 6 digits'),
    partySize: zod_1.z.number().int().min(1, 'Party size must be at least 1'),
    estimatedWaitMinutes: zod_1.z.number().int().optional(),
    notes: zod_1.z.string().optional(),
});
//# sourceMappingURL=waitlist.validator.js.map