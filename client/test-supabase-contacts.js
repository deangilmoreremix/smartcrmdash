// Test Supabase contacts integration
const SUPABASE_URL = 'https://YOUR_PROJECT_REF.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

const headers = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Prefer': 'return=representation'
};

async function testCreate() {
  console.log('Testing contact creation...');
  const testContact = {
    first_name: 'Test',
    last_name: 'User',
    email: `test-${Date.now()}@example.com`,
    phone: '+1 555 000 0000',
    company: 'Test Company',
    position: 'Test Manager',
    status: 'prospect',
    source: 'API Test',
    tags: ['test'],
    notes: 'Created via API test'
  };
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/contacts`, {
      method: 'POST',
      headers,
      body: JSON.stringify(testContact)
    });
    
    const result = await response.json();
    console.log('Create result:', result);
    return Array.isArray(result) ? result[0] : result;
  } catch (error) {
    console.error('Create failed:', error);
  }
}

testCreate();
