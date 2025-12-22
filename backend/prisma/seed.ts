import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

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
            language: 'en', // Default language
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

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
