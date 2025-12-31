import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function question(query: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
}

async function createSysadmin() {
    console.log('\n🔐 Create SYSADMIN User\n');

    const name = await question('Name: ');
    const email = await question('Email: ');
    const password = await question('Password: ');
    const language = (await question('Language (en/pt-BR) [en]: ')) || 'en';

    console.log('\n⏳ Creating SYSADMIN user...\n');

    try {
        // Check if email already exists
        const existing = await prisma.user.findUnique({
            where: { email },
        });

        if (existing) {
            console.error('❌ Error: User with this email already exists');
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
        console.log('\n🎉 You can now login to the admin portal at admin.takeseat.me\n');
    } catch (error) {
        console.error('❌ Error creating SYSADMIN user:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
        rl.close();
    }
}

createSysadmin();
