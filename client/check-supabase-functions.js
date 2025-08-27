// Check all Supabase Edge Functions status
const supabaseUrl = 'https://gadedbrnqzpfqtsdfzcg.supabase.co';
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhZGVkYnJucXpwZnF0c2RmemNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NjYxMTUsImV4cCI6MjA1ODE0MjExNX0.bpsk8yRpwQQnYaY4qY3hsW5ExrQe_8JA3UZ51mlQ1e4';

const functions = [
  // Contact functions
  'contacts', 'ai-enrichment', 'smart-score', 'smart-categorize', 'smart-qualify',
  'smart-enrichment', 'smart-bulk', 'email-composer', 'email-analyzer', 
  'personalized-messages', 'email-templates', 'ai-insights', 'ai-reasoning',
  'automation-ai', 'contact-card-ai', 'contact-detail-ai', 'conversation-analysis',
  'duplicate-detection', 'meeting-optimizer', 'predictive-analytics', 
  'relationship-insights', 'timeline-generator',
  
  // Deal functions  
  'ai-gateway', 'sales-coach', 'deal-analyzer', 'deal-insights',
  'automation-builder', 'company-researcher', 'contact-automation', 'social-discovery'
];

async function checkFunction(functionName) {
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ test: true })
    });

    const status = response.status;
    let result = 'Unknown';
    
    try {
      const data = await response.json();
      result = data;
    } catch {
      result = await response.text() || 'No response body';
    }

    return {
      name: functionName,
      status: status,
      available: status !== 404,
      response: result
    };
  } catch (error) {
    return {
      name: functionName,
      status: 'ERROR',
      available: false,
      error: error.message
    };
  }
}

async function checkAllFunctions() {
  console.log('🔍 Checking Supabase Edge Functions status...\n');
  
  const results = await Promise.all(functions.map(checkFunction));
  
  const available = results.filter(r => r.available);
  const unavailable = results.filter(r => !r.available);
  
  console.log(`✅ Available Functions (${available.length}):`);
  available.forEach(func => {
    console.log(`  - ${func.name} (${func.status})`);
  });
  
  console.log(`\n❌ Unavailable Functions (${unavailable.length}):`);
  unavailable.forEach(func => {
    console.log(`  - ${func.name} (${func.status})`);
  });
  
  console.log(`\n📊 Summary: ${available.length}/${functions.length} functions available`);
  
  return { available, unavailable };
}

checkAllFunctions();
