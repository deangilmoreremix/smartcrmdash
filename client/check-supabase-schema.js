// Check Supabase table schemas
const baseURL = 'https://gadedbrnqzpfqtsdfzcg.supabase.co/rest/v1';
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhZGVkYnJucXpwZnF0c2RmemNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NjYxMTUsImV4cCI6MjA1ODE0MjExNX0.bpsk8yRpwQQnYaY4qY3hsW5ExrQe_8JA3UZ51mlQ1e4';

const headers = {
  'Content-Type': 'application/json',
  'apikey': apiKey,
  'Authorization': `Bearer ${apiKey}`,
  'Prefer': 'return=representation'
};

async function checkSchema() {
  console.log('🔍 Checking Supabase table schemas...\n');
  
  const tables = ['contacts', 'deals'];
  
  for (const table of tables) {
    try {
      console.log(`=== ${table.toUpperCase()} TABLE ===`);
      
      // Try to get a sample record to see the schema
      const response = await fetch(`${baseURL}/${table}?limit=1`, {
        method: 'GET',
        headers
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.length > 0) {
          console.log('Sample record structure:');
          const sample = result[0];
          Object.keys(sample).forEach(key => {
            console.log(`  - ${key}: ${typeof sample[key]} = ${JSON.stringify(sample[key])}`);
          });
        } else {
          console.log('Table exists but is empty');
          
          // Try to create a minimal test record to see what fields are accepted
          console.log('Testing minimal record creation...');
          const testData = table === 'contacts' ? {
            first_name: 'Schema',
            last_name: 'Test',
            email: `schema-test-${Date.now()}@example.com`
          } : {
            title: 'Schema Test Deal',
            value: 1000
          };
          
          const testResponse = await fetch(`${baseURL}/${table}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(testData)
          });
          
          if (testResponse.ok) {
            const testResult = await testResponse.json();
            console.log('✓ Test record created, full schema:');
            const testRecord = testResult[0];
            Object.keys(testRecord).forEach(key => {
              console.log(`  - ${key}: ${typeof testRecord[key]}`);
            });
            
            // Clean up test record
            await fetch(`${baseURL}/${table}?id=eq.${testRecord.id}`, {
              method: 'DELETE',
              headers
            });
          } else {
            console.log('✗ Test record failed:', await testResponse.text());
          }
        }
      } else {
        console.log(`✗ Table ${table} not accessible:`, response.status);
      }
      
      console.log('');
    } catch (error) {
      console.error(`✗ Error checking ${table}:`, error.message);
    }
  }
}

checkSchema();
