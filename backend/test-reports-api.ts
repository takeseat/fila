import api from './src/config/api-client';

async function testReportsAPI() {
    try {
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        console.log(`Testing reports API with date range: ${yesterday} to ${today}\n`);

        // Test 1: Performance Report
        console.log('1. Testing Performance Report...');
        try {
            const perfResponse = await api.get(`/reports/waitlist-performance?from=${yesterday}&to=${today}`);
            console.log('✅ Performance Report Response:');
            console.log(JSON.stringify(perfResponse.data, null, 2));
        } catch (error: any) {
            console.log('❌ Performance Report Error:', error.response?.data || error.message);
        }

        console.log('\n' + '='.repeat(80) + '\n');

        // Test 2: Executive Summary
        console.log('2. Testing Executive Summary...');
        try {
            const execResponse = await api.get(`/reports/executive-summary?from=${yesterday}&to=${today}`);
            console.log('✅ Executive Summary Response:');
            console.log(JSON.stringify(execResponse.data, null, 2));
        } catch (error: any) {
            console.log('❌ Executive Summary Error:', error.response?.data || error.message);
        }

        console.log('\n' + '='.repeat(80) + '\n');

        // Test 3: Flow Report
        console.log('3. Testing Flow Report...');
        try {
            const flowResponse = await api.get(`/reports/waitlist-flow?from=${yesterday}&to=${today}`);
            console.log('✅ Flow Report Response:');
            console.log(JSON.stringify(flowResponse.data, null, 2));
        } catch (error: any) {
            console.log('❌ Flow Report Error:', error.response?.data || error.message);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

testReportsAPI();
