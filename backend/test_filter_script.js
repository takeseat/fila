
async function test() {
    try {
        // Login
        const loginRes = await fetch('http://localhost:3001/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@restaurantedemo.com.br',
                password: 'admin123'
            })
        });
        const loginData = await loginRes.json();
        const token = loginData.accessToken;
        console.log('Logged in. Token length:', token ? token.length : 'undefined');

        // Get customers NO filter
        console.log('--- Fetching ALL customers ---');
        const allRes = await fetch('http://localhost:3001/customers', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const allData = await allRes.json();
        console.log('API Response:', JSON.stringify(allData, null, 2));

        if (!allData.meta) {
            console.error('Meta is missing');
            return;
        }

        console.log('Total customers:', allData.meta.total);
        console.log('First customer name:', allData.data[0]?.name);

        const firstName = allData.data[0]?.name;
        if (!firstName) return;

        // Filter by substring of first name (case insensitive test)
        const sub = firstName.substring(0, 3).toLowerCase();
        console.log(`--- Filtering by name "${sub}" ---`);

        const filterRes = await fetch(`http://localhost:3001/customers?name=${sub}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const filterData = await filterRes.json();

        console.log('Filtered count:', filterData.meta?.total);
        console.log('Filtered results:', filterData.data?.map(c => c.name));

    } catch (e) {
        console.error('Error:', e.message);
    }
}

test();
