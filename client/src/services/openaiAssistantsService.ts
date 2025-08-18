import OpenAI from 'openai';
import { useApiStore } from '../store/apiStore';

export const useOpenAIAssistants = () => {
  const { apiKeys } = useApiStore();
  
  const getClient = () => {
    if (!apiKeys.openai) {
      throw new Error('OpenAI API key is not set');
    }
    
    return new OpenAI({ 
      apiKey: apiKeys.openai,
      dangerouslyAllowBrowser: true
    });
  };
  
  const createAssistant = async (name: string, instructions: string, model: string = "gpt-4o") => {
    const client = getClient();
    
    const assistant = await client.beta.assistants.create({
      name: name,
      instructions: instructions,
      model: model,
    });
    
    return assistant;
  };
  
  const chatWithAssistant = async (message: string, assistantId?: string) => {
    const client = getClient();
    
    // For simplicity, we'll use chat completions instead of the assistants API
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant for CRM and sales tasks."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });
    
    return response.choices[0].message.content || 'Unable to generate response';
  };

  return { 
    createAssistant,
    chatWithAssistant,
    getClient 
  };
};