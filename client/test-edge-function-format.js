// Test different payload formats for Edge Functions
const baseURL = 'https://gadedbrnqzpfqtsdfzcg.supabase.co/functions/v1';
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhZGVkYnJucXpwZnF0c2RmemNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NjYxMTUsImV4cCI6MjA1ODE0MjExNX0.bpsk8yRpwQQnYaY4qY3hsW5ExrQe_8JA3UZ51mlQ1e4';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${apiKey}`
};

async function testEdgeFunctionFormats() {
  console.log('🧪 Testing different Edge Function payload formats...\n');
  
  const testPayloads = [
    {
      name: 'Direct Contact Data',
      payload: {
        firstName: 'Edge',
        lastName: 'Test',
        email: `edge-direct-${Date.now()}@example.com`,
        phone: '+1 555 EDGE',
        company: 'Edge Function Co',
        title: 'Test Manager'
      }
    },
    {
      name: 'Method with Data',
      payload: {
        method: 'create',
        data: {
          firstName: 'Edge',
          lastName: 'Method',
          email: `edge-method-${Date.now()}@example.com`,
          phone: '+1 555 METHOD',
          company: 'Method Co',
          title: 'Method Manager'
        }
      }
    },
    {
      name: 'Operation with Contact',
      payload: {
        operation: 'create',
        contact: {
          firstName: 'Edge',
          lastName: 'Operation',
          email: `edge-op-${Date.now()}@example.com`,
          phone: '+1 555 OP',
          company: 'Operation Co',
          title: 'Op Manager'
        }
      }
    },
    {
      name: 'Simple Request',
      payload: {
        request: 'create_contact',
        firstName: 'Edge',
        lastName: 'Simple',
        email: `edge-simple-${Date.now()}@example.com`
      }
    }
  ];
  
  for (const test of testPayloads) {
    try {
      console.log(`=== Testing ${test.name} ===`);
      
      const response = await fetch(`${baseURL}/contacts`, {
        method: 'POST',
        headers,
        body: JSON.stringify(test.payload)
      });
      
      const result = await response.json();
      
      console.log(`Status: ${response.status}`);
      if (response.ok) {
        console.log('✓ Success:', result);
      } else {
        console.log('✗ Error:', result.error || result.message || result);
      }
      
      console.log('');
    } catch (error) {
      console.error(`✗ Exception:`, error.message);
      console.log('');
    }
  }
}

testEdgeFunctionFormats();
