import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface RestaurantFilters {
    search?: string; // Search by name, email, or CNPJ
    isActive?: boolean;
    countryCode?: string;
}

export interface RestaurantCreateData {
    name: string;
    tradeName?: string;
    cnpj?: string;
    phone?: string;
    email?: string;
    countryCode?: string;
    stateCode?: string;
    city: string;
    addressLine?: string;
    addressNumber?: string;
    addressComplement?: string;
    postalCode?: string;
    timezone?: string;
}

export interface RestaurantUpdateData {
    name?: string;
    tradeName?: string;
    phone?: string;
    countryCode?: string;
    stateCode?: string;
    city?: string;
    addressLine?: string;
    addressNumber?: string;
    addressComplement?: string;
    postalCode?: string;
    timezone?: string;
}

export class AdminRestaurantsService {
    /**
     * List restaurants with filters and pagination
     */
    static async listRestaurants(
        filters: RestaurantFilters = {},
        page: number = 1,
        limit: number = 20
    ) {
        const where: any = {};

        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search } },
                { email: { contains: filters.search } },
                { cnpj: { contains: filters.search } },
            ];
        }

        if (filters.isActive !== undefined) {
            where.isActive = filters.isActive;
        }

        if (filters.countryCode) {
            where.countryCode = filters.countryCode;
        }

        const [restaurants, total] = await Promise.all([
            prisma.restaurant.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    tradeName: true,
                    cnpj: true,
                    email: true,
                    phone: true,
                    countryCode: true,
                    stateCode: true,
                    city: true,
                    isActive: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: {
                            users: true,
                            customers: true,
                        },
                    },
                },
            }),
            prisma.restaurant.count({ where }),
        ]);

        return {
            data: restaurants,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get restaurant details by ID
     */
    static async getRestaurantById(id: string) {
        const restaurant = await prisma.restaurant.findUnique({
            where: { id },
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        isActive: true,
                        createdAt: true,
                    },
                },
                _count: {
                    select: {
                        customers: true,
                        waitlistEntries: true,
                    },
                },
            },
        });

        if (!restaurant) {
            throw new Error('Restaurant not found');
        }

        return restaurant;
    }

    /**
     * Create a new restaurant
     */
    static async createRestaurant(data: RestaurantCreateData) {
        // Check uniqueness of CNPJ and email if provided
        if (data.cnpj) {
            const existing = await prisma.restaurant.findFirst({
                where: { cnpj: data.cnpj },
            });
            if (existing) {
                throw new Error('Restaurant with this CNPJ already exists');
            }
        }

        if (data.email) {
            const existing = await prisma.restaurant.findFirst({
                where: { email: data.email },
            });
            if (existing) {
                throw new Error('Restaurant with this email already exists');
            }
        }

        const restaurant = await prisma.restaurant.create({
            data: {
                ...data,
                isActive: true,
            },
        });

        return restaurant;
    }

    /**
     * Update restaurant (CNPJ and email are readonly)
     */
    static async updateRestaurant(id: string, data: RestaurantUpdateData) {
        const restaurant = await prisma.restaurant.findUnique({
            where: { id },
        });

        if (!restaurant) {
            throw new Error('Restaurant not found');
        }

        const updated = await prisma.restaurant.update({
            where: { id },
            data,
        });

        return updated;
    }

    /**
     * Toggle restaurant active status
     */
    static async toggleRestaurantStatus(id: string, isActive: boolean) {
        const restaurant = await prisma.restaurant.findUnique({
            where: { id },
        });

        if (!restaurant) {
            throw new Error('Restaurant not found');
        }

        const updated = await prisma.restaurant.update({
            where: { id },
            data: { isActive },
        });

        console.log(`[Admin] Restaurant ${id} ${isActive ? 'activated' : 'deactivated'}`);

        return updated;
    }
}
