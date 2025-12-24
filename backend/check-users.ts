import prisma from './src/config/database';

async function checkUsers() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                restaurant: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        console.log('Usuários no banco:');
        console.log(JSON.stringify(users, null, 2));

        if (users.length === 0) {
            console.log('\n⚠️  Nenhum usuário encontrado no banco!');
            console.log('Você precisa criar um usuário primeiro.');
        }

    } catch (error) {
        console.error('Erro:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUsers();
