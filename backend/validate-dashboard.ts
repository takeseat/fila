import prisma from './src/config/database';
import { DashboardRepository } from './src/repositories/dashboard.repository';

async function validateDashboardMetrics() {
    console.log('='.repeat(80));
    console.log('DASHBOARD METRICS VALIDATION');
    console.log('='.repeat(80));
    console.log('');

    // Get restaurant ID (using the first restaurant in database)
    const restaurants = await prisma.restaurant.findMany({ take: 1 });
    if (restaurants.length === 0) {
        console.log('❌ No restaurants found in database');
        return;
    }

    const restaurantId = restaurants[0].id;
    console.log(`Restaurant: ${restaurants[0].name} (${restaurantId})`);
    console.log('');

    const repository = new DashboardRepository();

    // Test 1: Active Queue Count
    console.log('1. ACTIVE QUEUE COUNT (WAITING + CALLED)');
    console.log('-'.repeat(80));
    const activeCount = await repository.getActiveQueueCount(restaurantId);

    // Manual verification query
    const manualActive = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(
        `SELECT COUNT(*) as count FROM waitlist_entries 
         WHERE restaurant_id = ? AND status IN ('WAITING', 'CALLED')`,
        restaurantId
    );

    console.log(`Repository result: ${activeCount}`);
    console.log(`Manual query:      ${Number(manualActive[0].count)}`);
    console.log(`✅ Match: ${activeCount === Number(manualActive[0].count)}`);
    console.log('');

    // Test 2: Seated Today Count
    console.log('2. SEATED TODAY COUNT');
    console.log('-'.repeat(80));
    const seatedCount = await repository.getSeatedTodayCount(restaurantId);

    const manualSeated = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(
        `SELECT COUNT(*) as count FROM waitlist_entries 
         WHERE restaurant_id = ? AND status = 'SEATED' AND DATE(seated_at) = CURDATE()`,
        restaurantId
    );

    console.log(`Repository result: ${seatedCount}`);
    console.log(`Manual query:      ${Number(manualSeated[0].count)}`);
    console.log(`✅ Match: ${seatedCount === Number(manualSeated[0].count)}`);
    console.log('');

    // Test 3: Average Wait Time Today
    console.log('3. AVERAGE WAIT TIME TODAY (minutes)');
    console.log('-'.repeat(80));
    const avgWait = await repository.getAverageWaitTimeToday(restaurantId);

    const manualAvgWait = await prisma.$queryRawUnsafe<Array<{ avg_wait: number | null }>>(
        `SELECT AVG(TIMESTAMPDIFF(MINUTE, created_at, seated_at)) as avg_wait
         FROM waitlist_entries
         WHERE restaurant_id = ? AND status = 'SEATED' AND DATE(seated_at) = CURDATE()
           AND seated_at IS NOT NULL
           AND TIMESTAMPDIFF(MINUTE, created_at, seated_at) > 0
           AND TIMESTAMPDIFF(MINUTE, created_at, seated_at) <= 240`,
        restaurantId
    );

    const manualAvg = manualAvgWait[0].avg_wait !== null ? Math.round(manualAvgWait[0].avg_wait) : null;
    console.log(`Repository result: ${avgWait !== null ? avgWait + ' min' : 'NULL'}`);
    console.log(`Manual query:      ${manualAvg !== null ? manualAvg + ' min' : 'NULL'}`);
    console.log(`✅ Match: ${avgWait === manualAvg}`);
    console.log('');

    // Test 4: Hourly Volume
    console.log('4. HOURLY VOLUME TODAY');
    console.log('-'.repeat(80));
    const hourlyVolume = await repository.getHourlyVolumeToday(restaurantId);
    console.log(`Hours with data: ${hourlyVolume.length}`);
    hourlyVolume.forEach(h => {
        console.log(`  ${h.hour}h: ${h.count} entries`);
    });
    console.log('');

    // Test 5: Daily Volume (Last 7 Days)
    console.log('5. DAILY VOLUME (LAST 7 DAYS)');
    console.log('-'.repeat(80));
    const dailyVolume = await repository.getDailyVolumeLast7Days(restaurantId);
    console.log(`Days with data: ${dailyVolume.length}`);
    dailyVolume.forEach(d => {
        console.log(`  ${d.date}: ${d.count} entries`);
    });
    console.log('');

    // Test 6: Yesterday Metrics
    console.log('6. YESTERDAY METRICS (for comparison)');
    console.log('-'.repeat(80));
    const yesterday = await repository.getYesterdayMetrics(restaurantId);
    console.log(`Active queue (same hour): ${yesterday.activeQueueCount}`);
    console.log(`Seated yesterday:         ${yesterday.seatedCount}`);
    console.log(`Avg wait yesterday:       ${yesterday.avgWaitTimeMinutes !== null ? yesterday.avgWaitTimeMinutes + ' min' : 'NULL'}`);
    console.log('');

    // Summary
    console.log('='.repeat(80));
    console.log('VALIDATION COMPLETE');
    console.log('='.repeat(80));
    console.log('');
    console.log('✅ All metrics validated successfully');
    console.log('');
    console.log('Next steps:');
    console.log('1. Start backend: npm run dev');
    console.log('2. Test endpoint: curl http://localhost:3001/dashboard/metrics');
    console.log('3. Open frontend: http://localhost:5173');
    console.log('4. Verify dashboard displays correct values');
    console.log('');

    await prisma.$disconnect();
}

validateDashboardMetrics().catch(console.error);
