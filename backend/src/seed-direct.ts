import { PrismaClient } from '@prisma/client';
import { getDatabaseUrl } from './utils/secrets';
import { hashPassword } from './utils/password';

/**
 * Lambda handler for creating seed data directly via Prisma Client
 */
export const handler = async () => {
    const prisma = new PrismaClient();

    try {
        console.log('Starting database seed...');

        // Get DATABASE_URL from Secrets Manager
        const databaseUrl = await getDatabaseUrl();
        process.env.DATABASE_URL = databaseUrl;

        // Check if restaurant already exists
        const existingRestaurant = await prisma.restaurant.findFirst();
        if (existingRestaurant) {
            console.log('Database already seeded');
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Database already seeded',
                    restaurant: existingRestaurant.name,
                }),
            };
        }

        // Create restaurant
        const restaurant = await prisma.restaurant.create({
            data: {
                name: 'Restaurante Demo',
                cnpj: '12.345.678/0001-90',
                phone: '(11) 98765-4321',
                email: 'contato@restaurantedemo.com.br',
                city: 'São Paulo',
                timezone: 'America/Sao_Paulo',
            },
        });

        console.log('✅ Restaurant created:', restaurant.name);

        // Create admin user
        const adminPassword = await hashPassword('admin123');
        const admin = await prisma.user.create({
            data: {
                restaurantId: restaurant.id,
                name: 'Admin User',
                email: 'admin@restaurantedemo.com.br',
                passwordHash: adminPassword,
                role: 'ADMIN',
            },
        });

        console.log('✅ Admin user created:', admin.email);

        // Create customers
        const customers = await prisma.customer.createMany({
            data: [
                {
                    restaurantId: restaurant.id,
                    name: 'João Silva',
                    email: 'joao@example.com',
                    countryCode: 'BR',
                    ddi: '+55',
                    phone: '11912345678',
                    fullPhone: '+5511912345678',
                },
                {
                    restaurantId: restaurant.id,
                    name: 'Maria Santos',
                    email: 'maria@example.com',
                    countryCode: 'BR',
                    ddi: '+55',
                    phone: '11923456789',
                    fullPhone: '+5511923456789',
                },
            ],
        });

        console.log(`✅ ${customers.count} customers created`);
        console.log('🎉 Seed completed successfully!');

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Seed completed successfully',
                credentials: {
                    email: 'admin@restaurantedemo.com.br',
                    password: 'admin123',
                },
            }),
        };
    } catch (error) {
        console.error('Seed failed:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Seed failed',
                error: error instanceof Error ? error.message : 'Unknown error',
            }),
        };
    } finally {
        await prisma.$disconnect();
    }
};
