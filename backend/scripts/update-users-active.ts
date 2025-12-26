import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateExistingUsers() {
    try {
        console.log('🔄 Updating existing users to set isActive = true...');

        const result = await prisma.$executeRaw`
            UPDATE users 
            SET isActive = 1 
            WHERE isActive IS NULL
        `;

        console.log(`✅ Updated ${result} users`);

        // Verify
        const allUsers = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                isActive: true,
            },
        });

        console.log('\n📋 All users:');
        allUsers.forEach(user => {
            console.log(`  - ${user.name} (${user.email}): isActive = ${user.isActive}`);
        });

    } catch (error) {
        console.error('❌ Error updating users:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updateExistingUsers();
