import { AnalyticsRepository } from './src/repositories/analytics.repository';
import prisma from './src/config/database';

async function showSQLQueries() {
    try {
        const repository = new AnalyticsRepository();

        // Use today's date range
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const filters = {
            restaurantId: '573fc55b-cce0-4b39-925b-94d74265d442', // From the test data
            from: yesterday,
            to: today,
            maxWaitMinutes: 240,
        };

        console.log('='.repeat(80));
        console.log('FILTROS UTILIZADOS:');
        console.log('='.repeat(80));
        console.log('Restaurant ID:', filters.restaurantId);
        console.log('From:', filters.from.toISOString(), '(', filters.from.toString(), ')');
        console.log('To:', filters.to.toISOString(), '(', filters.to.toString(), ')');
        console.log('\n');

        console.log('='.repeat(80));
        console.log('1. EXECUTANDO: getPerformanceKPIs');
        console.log('='.repeat(80));
        const kpis = await repository.getPerformanceKPIs(filters);
        console.log('RESULTADO:', JSON.stringify(kpis, null, 2));
        console.log('\n');

        console.log('='.repeat(80));
        console.log('2. EXECUTANDO: getVolumeSeries (bucket: hour)');
        console.log('='.repeat(80));
        const volumeSeries = await repository.getVolumeSeries(filters, 'hour');
        console.log('RESULTADO:', JSON.stringify(volumeSeries, null, 2));
        console.log('\n');

        console.log('='.repeat(80));
        console.log('3. EXECUTANDO: getWaitTimeSeries (bucket: hour)');
        console.log('='.repeat(80));
        const waitTimeSeries = await repository.getWaitTimeSeries(filters, 'hour');
        console.log('RESULTADO:', JSON.stringify(waitTimeSeries, null, 2));
        console.log('\n');

        console.log('='.repeat(80));
        console.log('4. EXECUTANDO: getFlowMetrics');
        console.log('='.repeat(80));
        const flowMetrics = await repository.getFlowMetrics(filters);
        console.log('RESULTADO:', JSON.stringify(flowMetrics, null, 2));
        console.log('\n');

        console.log('='.repeat(80));
        console.log('5. EXECUTANDO: getFunnelCounts');
        console.log('='.repeat(80));
        const funnelCounts = await repository.getFunnelCounts(filters);
        console.log('RESULTADO:', JSON.stringify(funnelCounts, null, 2));
        console.log('\n');

        // Now show the actual SQL queries that would be generated
        console.log('='.repeat(80));
        console.log('EXEMPLOS DE SQL QUERIES GERADAS:');
        console.log('='.repeat(80));
        console.log('\nNOTA: Os logs acima do buildWhereClause já mostram as datas sendo usadas.');
        console.log('Verifique os logs do console para ver as queries SQL completas.\n');

    } catch (error) {
        console.error('ERRO:', error);
    } finally {
        await prisma.$disconnect();
    }
}

showSQLQueries();
