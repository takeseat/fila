import prisma from '../config/database';
import { CreateCustomerInput } from '../validators/index';

export class CustomersService {
    async getCustomers(
        restaurantId: string,
        filters?: {
            name?: string;
            phone?: string;
            lastVisitAfter?: string;
            page?: number;
            pageSize?: number;
        }
    ) {
        const page = filters?.page || 1;
        const pageSize = filters?.pageSize || 20;
        const skip = (page - 1) * pageSize;


        const where: any = { restaurantId };

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
            prisma.customer.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: pageSize,
            }),
            prisma.customer.count({ where }),
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

    async getCustomerDetails(restaurantId: string, customerId: string) {
        const customer = await prisma.customer.findFirst({
            where: { id: customerId, restaurantId },
        });

        if (!customer) {
            throw new Error('Customer not found');
        }

        const waitlistHistory = await prisma.waitlistEntry.findMany({
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

    async getCustomerByFullPhone(restaurantId: string, fullPhone: string) {
        return prisma.customer.findFirst({
            where: {
                restaurantId,
                fullPhone,
            },
        });
    }

    async createCustomer(restaurantId: string, data: CreateCustomerInput) {
        return prisma.customer.create({
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

    async upsertCustomer(restaurantId: string, fullPhone: string, data: CreateCustomerInput) {
        // Try to find existing customer by fullPhone
        const existing = await this.getCustomerByFullPhone(restaurantId, fullPhone);

        if (existing) {
            // Update existing customer with new data (if provided)
            return prisma.customer.update({
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

    async importCustomers(restaurantId: string, customers: CreateCustomerInput[]) {
        const created = await prisma.customer.createMany({
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

    async updateCustomer(
        restaurantId: string,
        customerId: string,
        data: Partial<CreateCustomerInput>
    ) {
        // Verify customer belongs to restaurant
        const existing = await prisma.customer.findFirst({
            where: { id: customerId, restaurantId },
        });

        if (!existing) {
            throw new Error('Customer not found');
        }

        return prisma.customer.update({
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

    async deleteCustomer(restaurantId: string, customerId: string) {
        // Verify customer belongs to restaurant
        const existing = await prisma.customer.findFirst({
            where: { id: customerId, restaurantId },
        });

        if (!existing) {
            throw new Error('Customer not found');
        }

        return prisma.customer.delete({
            where: { id: customerId },
        });
    }
}
