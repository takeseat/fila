import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createProductionSysadmin() {
    console.log('\n🔐 Creating SYSADMIN User for Production\n');

    // Hardcoded values - change these as needed
    const name = 'Lucas Moretto';
    const email = 'lucas@takeseat.me';
    const password = 'Admin@2024'; // Change this!
    const language = 'pt-BR';

    try {
        // Check if email already exists
        const existing = await prisma.user.findUnique({
            where: { email },
        });

        if (existing) {
            console.error('❌ Error: User with this email already exists');
            console.log('Existing user:', {
                id: existing.id,
                name: existing.name,
                email: existing.email,
                role: existing.role,
            });
            process.exit(1);
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create SYSADMIN user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                role: 'SYSADMIN',
                restaurantId: null, // SYSADMIN has no restaurant
                isActive: true,
                language,
            },
        });

        console.log('✅ SYSADMIN user created successfully!\n');
        console.log('User Details:');
        console.log(`  ID: ${user.id}`);
        console.log(`  Name: ${user.name}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Role: ${user.role}`);
        console.log(`  Language: ${user.language}`);
        console.log('\n🎉 You can now login to https://admin.takeseat.me\n');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('\n⚠️  IMPORTANT: Change the password after first login!\n');
    } catch (error) {
        console.error('❌ Error creating SYSADMIN user:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

createProductionSysadmin();
