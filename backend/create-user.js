const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function createUser() {
    const connection = await mysql.createConnection({
        host: 'takeseat-prod.proxy-ce700cko82tc.us-east-1.rds.amazonaws.com',
        user: 'admin',
        password: 'hY9OVK)[p_=23dgVUnf$KVqv6P1tYY?v',
        database: 'fila',
        port: 3306
    });

    try {
        console.log('Connected to Aurora!');

        // Create restaurant
        const [restaurantResult] = await connection.execute(
            `INSERT INTO restaurants (id, name, cnpj, phone, email, city, timezone, createdAt, updatedAt) 
             VALUES (UUID(), 'Restaurante Demo', '12.345.678/0001-90', '(11) 98765-4321', 
                     'contato@restaurantedemo.com.br', 'São Paulo', 'America/Sao_Paulo', NOW(), NOW())`
        );

        const [restaurants] = await connection.execute('SELECT id FROM restaurants LIMIT 1');
        const restaurantId = restaurants[0].id;
        console.log('✅ Restaurant created:', restaurantId);

        // Hash password
        const passwordHash = await bcrypt.hash('admin123', 10);

        // Create admin user
        await connection.execute(
            `INSERT INTO users (id, restaurantId, name, email, passwordHash, role, createdAt, updatedAt) 
             VALUES (UUID(), ?, 'Admin User', 'admin@restaurantedemo.com.br', ?, 'ADMIN', NOW(), NOW())`,
            [restaurantId, passwordHash]
        );

        console.log('✅ Admin user created!');
        console.log('\n🎉 Success! You can now login with:');
        console.log('   Email: admin@restaurantedemo.com.br');
        console.log('   Password: admin123');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
}

createUser();
