
const apiKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NGQ1OWNlZi1kYmI4LTRlYTUtYjE3OC1kMjU0MGZjZDY5MTkiLCJqdGkiOiI1MzZmOTMzOWU5M2UwZjFlMGYyY2Y5MzcxMGFiYTJmZGMyYTUzOTgyMWYyMTg1MjFmNjg0NGM1NzJjYTcyMjVmOTUxNmViZTMyNGUxYjlmMiIsImlhdCI6MTc2ODEwMjc0MS4zMTE3NDcsIm5iZiI6MTc2ODEwMjc0MS4zMTE3NDksImV4cCI6MTc4MzcyODAwMC4wNDUxOTYsInN1YiI6IjYyODY0OTUiLCJzY29wZXMiOltdfQ.TiQWjgUuvbcjm-F7mNMz0QbhcYfqRWGBJOUy1Afw1pj5dJdnv8HX7QP5q6bHoEaF7Nsr4ugHo9rBJFGNZcspYl_5P07O599_e0bq3Zm--RHmj3YeQhFfdrOmtqKSLLuQ67yMpVFRVMqYYbDqwG5v7TTPP-L5n9yJLqai_XNwYt3cu2ItgqXW5_ZE4AsD6lC5P5-wwtJc2JgawEQn-NnwpReGJbIc4f6w_rftg0Buw7dEC0vcpAdZFvLWtWDH5UMl9MUm9CAqcUKioCbDBd-G6pNbkf-_hsLhro5RzXIZ6N4_jA1jRp8aHHC1mQ53yFv-Im2vWgTWpASg74l-OGM5pTkGxkG--IZsQnT9YWxXvAcQXgJZhv9VtofjsUDSzDpHA91qZStx_nnhi0ULDXxEDdmCpls2WVTvnea0kz0lu8WuGCkfrOiR6ORfQXvLz8XM6y9OsX9Wnt1N5pQI35EsxsHAy8mkhZzfsJLV3Vhsd-x7v1G-ntWTDWPw4dHKatyeKQxCVgcj4gMxVlaxU2oEfZRBoIcLjrveIQKrZ3d7V8Fwm1BszpjGtEUOnZWYaO4_XxNuqAFejbNIUMCR2f14SRC8JSSFEpl4KhcbPvPb0EMBBrCTU7bTy0jPYG-K9nq6WYan4TZexkxu_6eYpZSf6M47xmHOQtMYjHsPDEZ0uhg';

async function fetchLemon() {
    try {
        console.log("Fetching stores...");
        const storeRes = await fetch('https://api.lemonsqueezy.com/v1/stores', {
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Accept': 'application/vnd.api+json' }
        });

        if (!storeRes.ok) {
            console.error(`Store fetch failed: ${storeRes.status} ${storeRes.statusText}`);
            const text = await storeRes.text();
            console.error(text);
            return;
        }

        const storeData = await storeRes.json();
        const store = storeData.data?.[0];

        if (!store) {
            console.log('No stores found on this account.');
        } else {
            console.log('Store ID:', store.id);
            console.log('Store Name:', store.attributes.name);
        }

        console.log("\nFetching variants...");
        const variantsRes = await fetch('https://api.lemonsqueezy.com/v1/variants', {
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Accept': 'application/vnd.api+json' }
        });

        if (!variantsRes.ok) {
            console.error(`Variants fetch failed: ${variantsRes.status} ${variantsRes.statusText}`);
            return;
        }

        const variantsData = await variantsRes.json();
        console.log('\nVariants:');
        variantsData.data?.forEach(v => {
            console.log(`- ${v.attributes.name} (Variant ID: ${v.id}, Product ID: ${v.attributes.product_id})`);
        });

    } catch (e) {
        console.error('Exception:', e);
    }
}

fetchLemon();
