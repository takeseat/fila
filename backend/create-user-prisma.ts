import { PrismaClient } from '@prisma/client';
import { hashPassword } from './src/utils/password';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'mysql://admin:hY9OVK%29%5Bp_%3D23dgVUnf%24KVqv6P1tYY%3Fv@takeseat-prod.proxy-ce700cko82tc.us-east-1.rds.amazonaws.com:3306/fila'
        }
    }
});

async function main() {
    console.log('🌱 Creating user...');

    // Check if restaurant exists
    let restaurant = await prisma.restaurant.findFirst();

    if (!restaurant) {
        // Create restaurant
        restaurant = await prisma.restaurant.create({
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
    } else {
        console.log('✅ Restaurant already exists:', restaurant.name);
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email: 'admin@restaurantedemo.com.br' }
    });

    if (existingUser) {
        console.log('✅ User already exists!');
    } else {
        // Create admin user
        const passwordHash = await hashPassword('admin123');
        const user = await prisma.user.create({
            data: {
                restaurantId: restaurant.id,
                name: 'Admin User',
                email: 'admin@restaurantedemo.com.br',
                passwordHash,
                role: 'ADMIN',
            },
        });
        console.log('✅ Admin user created:', user.email);
    }

    console.log('\n🎉 Success! You can now login with:');
    console.log('   Email: admin@restaurantedemo.com.br');
    console.log('   Password: admin123');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
