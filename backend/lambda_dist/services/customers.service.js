"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersService = void 0;
const database_1 = __importDefault(require("../config/database"));
class CustomersService {
    async getCustomers(restaurantId, filters) {
        const page = filters?.page || 1;
        const pageSize = filters?.pageSize || 20;
        const skip = (page - 1) * pageSize;
        const where = { restaurantId };
        // Apply filters
        if (filters?.name) {
            where.name = { contains: filters.name };
        }
        if (filters?.phone) {
            where.fullPhone = { contains: filters.phone };
        }
        if (filters?.lastVisitAfter) {
            where.lastVisitAt = { gte: new Date(filters.lastVisitAfter) };
        }
        const [customers, total] = await Promise.all([
            database_1.default.customer.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: pageSize,
            }),
            database_1.default.customer.count({ where }),
        ]);
        return {
            data: customers,
            meta: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize),
            },
        };
    }
    async getCustomerDetails(restaurantId, customerId) {
        const customer = await database_1.default.customer.findFirst({
            where: { id: customerId, restaurantId },
        });
        if (!customer) {
            throw new Error('Customer not found');
        }
        const waitlistHistory = await database_1.default.waitlistEntry.findMany({
            where: { customerId },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
        return {
            customer,
            waitlistHistory,
            // reservationHistory: [], // Removed
            // npsResponses: [], // Removed
        };
    }
    async getCustomerByFullPhone(restaurantId, fullPhone) {
        return database_1.default.customer.findFirst({
            where: {
                restaurantId,
                fullPhone,
            },
        });
    }
    async createCustomer(restaurantId, data) {
        return database_1.default.customer.create({
            data: {
                restaurantId,
                name: data.name,
                countryCode: data.countryCode,
                ddi: data.ddi,
                phone: data.phone,
                fullPhone: data.fullPhone,
                email: data.email,
                notes: data.notes,
            },
        });
    }
    async upsertCustomer(restaurantId, fullPhone, data) {
        // Try to find existing customer by fullPhone
        const existing = await this.getCustomerByFullPhone(restaurantId, fullPhone);
        if (existing) {
            // Update existing customer with new data (if provided)
            return database_1.default.customer.update({
                where: { id: existing.id },
                data: {
                    name: data.name || existing.name,
                    email: data.email || existing.email,
                    notes: data.notes || existing.notes,
                    // Update phone fields if they changed
                    countryCode: data.countryCode || existing.countryCode,
                    ddi: data.ddi || existing.ddi,
                    phone: data.phone || existing.phone,
                    fullPhone: data.fullPhone || existing.fullPhone,
                },
            });
        }
        // Create new customer
        return this.createCustomer(restaurantId, data);
    }
    async importCustomers(restaurantId, customers) {
        const created = await database_1.default.customer.createMany({
            data: customers.map((c) => ({
                restaurantId,
                name: c.name,
                countryCode: c.countryCode,
                ddi: c.ddi,
                phone: c.phone,
                fullPhone: c.fullPhone,
                email: c.email,
                notes: c.notes,
            })),
            skipDuplicates: true,
        });
        return { count: created.count };
    }
    async updateCustomer(restaurantId, customerId, data) {
        // Verify customer belongs to restaurant
        const existing = await database_1.default.customer.findFirst({
            where: { id: customerId, restaurantId },
        });
        if (!existing) {
            throw new Error('Customer not found');
        }
        return database_1.default.customer.update({
            where: { id: customerId },
            data: {
                name: data.name,
                email: data.email,
                notes: data.notes,
                countryCode: data.countryCode,
                ddi: data.ddi,
                phone: data.phone,
                fullPhone: data.fullPhone,
            },
        });
    }
    async deleteCustomer(restaurantId, customerId) {
        // Verify customer belongs to restaurant
        const existing = await database_1.default.customer.findFirst({
            where: { id: customerId, restaurantId },
        });
        if (!existing) {
            throw new Error('Customer not found');
        }
        return database_1.default.customer.delete({
            where: { id: customerId },
        });
    }
}
exports.CustomersService = CustomersService;
//# sourceMappingURL=customers.service.js.map