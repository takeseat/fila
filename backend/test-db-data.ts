import prisma from './src/config/database';

async function checkData() {
    try {
        console.log('Checking database data...\n');

        // Count total entries
        const totalEntries = await prisma.waitlistEntry.count();
        console.log(`Total waitlist entries: ${totalEntries}`);

        // Count by status
        const statuses = await prisma.waitlistEntry.groupBy({
            by: ['status'],
            _count: true,
        });
        console.log('\nEntries by status:');
        statuses.forEach(s => {
            console.log(`  ${s.status}: ${s._count}`);
        });

        // Get date range
        const dateRange = await prisma.waitlistEntry.aggregate({
            _min: { createdAt: true },
            _max: { createdAt: true },
        });
        console.log('\nDate range:');
        console.log(`  Oldest: ${dateRange._min.createdAt}`);
        console.log(`  Newest: ${dateRange._max.createdAt}`);

        // Sample a few entries
        const sampleEntries = await prisma.waitlistEntry.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                customerName: true,
                partySize: true,
                status: true,
                createdAt: true,
                calledAt: true,
                seatedAt: true,
                restaurantId: true,
            },
        });

        console.log('\nSample entries (5 most recent):');
        sampleEntries.forEach(entry => {
            console.log(`  - ${entry.customerName} (${entry.partySize} pax) - ${entry.status}`);
            console.log(`    Created: ${entry.createdAt}`);
            console.log(`    Called: ${entry.calledAt || 'N/A'}`);
            console.log(`    Seated: ${entry.seatedAt || 'N/A'}`);
            console.log(`    Restaurant ID: ${entry.restaurantId}`);
        });

        // Check restaurants
        const restaurants = await prisma.restaurant.findMany({
            select: {
                id: true,
                name: true,
                _count: {
                    select: { waitlistEntries: true },
                },
            },
        });

        console.log('\nRestaurants:');
        restaurants.forEach(r => {
            console.log(`  ${r.name} (${r.id}): ${r._count.waitlistEntries} entries`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkData();
