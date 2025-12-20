import { execSync } from 'child_process';
import { getDatabaseUrl } from './utils/secrets';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from './utils/password';

/**
 * Lambda handler for running Prisma migrations and seed
 * This function is invoked by CI/CD pipeline to apply database migrations
 */
export const handler = async (event: any) => {
    const prisma = new PrismaClient();

    try {
        console.log('Starting database migrations...');

        // Get DATABASE_URL from Secrets Manager
        const databaseUrl = await getDatabaseUrl();

        // Set DATABASE_URL for Prisma
        process.env.DATABASE_URL = databaseUrl;

        console.log('Running prisma migrate deploy...');

        // Execute Prisma migrations
        execSync('npx prisma migrate deploy', {
            stdio: 'inherit',
            env: {
                ...process.env,
                DATABASE_URL: databaseUrl,
            },
        });

        console.log('Migrations completed successfully');

        // Check if should run seed (via event parameter or if database is empty)
        const shouldSeed = event?.seed === true || event?.seed === 'true';
        const restaurantCount = await prisma.restaurant.count();

        if (shouldSeed || restaurantCount === 0) {
            console.log('Running database seed...');

            // Check if restaurant already exists
            const existingRestaurant = await prisma.restaurant.findFirst();
            if (existingRestaurant) {
                console.log('Database already seeded, skipping...');
            } else {
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
                        {
                            restaurantId: restaurant.id,
                            name: 'Pedro Oliveira',
                            email: 'pedro@example.com',
                            countryCode: 'BR',
                            ddi: '+55',
                            phone: '11934567890',
                            fullPhone: '+5511934567890',
                        },
                        {
                            restaurantId: restaurant.id,
                            name: 'Ana Costa',
                            email: 'ana@example.com',
                            countryCode: 'BR',
                            ddi: '+55',
                            phone: '11945678901',
                            fullPhone: '+5511945678901',
                        },
                    ],
                });

                console.log(`✅ ${customers.count} customers created`);

                // Get customer IDs
                const customerList = await prisma.customer.findMany({
                    where: { restaurantId: restaurant.id },
                });

                // Create waitlist entries
                await prisma.waitlistEntry.createMany({
                    data: [
                        {
                            restaurantId: restaurant.id,
                            customerId: customerList[0].id,
                            customerName: customerList[0].name,
                            customerPhone: customerList[0].fullPhone,
                            customerCountryCode: customerList[0].countryCode,
                            partySize: 2,
                            status: 'WAITING',
                            estimatedWaitMinutes: 15,
                        },
                        {
                            restaurantId: restaurant.id,
                            customerId: customerList[1].id,
                            customerName: customerList[1].name,
                            customerPhone: customerList[1].fullPhone,
                            customerCountryCode: customerList[1].countryCode,
                            partySize: 4,
                            status: 'WAITING',
                            estimatedWaitMinutes: 30,
                        },
                        {
                            restaurantId: restaurant.id,
                            customerId: customerList[2].id,
                            customerName: customerList[2].name,
                            customerPhone: customerList[2].fullPhone,
                            customerCountryCode: customerList[2].countryCode,
                            partySize: 3,
                            status: 'SEATED',
                            estimatedWaitMinutes: 20,
                            seatedAt: new Date(),
                        },
                    ],
                });

                console.log('✅ Waitlist entries created');
                console.log('🎉 Seed completed successfully!');
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Migrations and seed completed successfully',
                timestamp: new Date().toISOString(),
            }),
        };
    } catch (error) {
        console.error('Migration/Seed failed:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Migration/Seed failed',
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString(),
            }),
        };
    } finally {
        await prisma.$disconnect();
    }
};
