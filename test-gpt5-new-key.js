import OpenAI from 'openai';

const apiKey = "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";

console.log('Testing new GPT-5 API key...');
console.log('Key prefix:', apiKey.substring(0, 15) + '...');

const openai = new OpenAI({ apiKey });

async function testGPT5Models() {
  const models = ['o1-preview', 'o1-mini', 'gpt-4o', 'gpt-4o-mini'];
  
  for (const model of models) {
    try {
      console.log(`\nTesting ${model}...`);
      
      const response = await openai.chat.completions.create({
        model: model,
        messages: [{ 
          role: "user", 
          content: "Hello! Confirm this model is working." 
        }],
        max_tokens: 30
      });

      console.log(`✅ ${model} - SUCCESS`);
      console.log(`Response: ${response.choices[0].message.content}`);
      console.log(`Model used: ${response.model}`);
      
    } catch (error) {
      console.log(`❌ ${model} - FAILED: ${error.message}`);
    }
  }
}

testGPT5Models().catch(console.error);