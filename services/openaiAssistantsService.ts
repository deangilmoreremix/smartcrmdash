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
      dangerouslyAllowBrowser: true // Note: In production, proxy requests through a backend
    });
  };
  
  // Create a new assistant
  const createAssistant = async (name: string, instructions: string, tools: string[] = []) => {
    const client = getClient();
    
    try {
      // Convert tool names to actual tool objects
      const assistantTools = tools.map(tool => {
        if (tool === 'retrieval') return { type: 'retrieval' as const };
        if (tool === 'code_interpreter') return { type: 'code_interpreter' as const };
        if (tool === 'function') return { type: 'function' as const, function: { name: 'search_deals', description: 'Search for deals in the CRM' } };
        return { type: 'retrieval' as const }; // Default to retrieval
      });
      
      const assistant = await client.beta.assistants.create({
        name,
        instructions,
        model: "gpt-4o", // Updated from gpt-4-turbo-preview
        tools: assistantTools,
      });
      
      return assistant;
    } catch (error) {
      console.error('Error creating assistant:', error);
      throw error;
    }
  };
  
  // Create a thread for a conversation
  const createThread = async () => {
    const client = getClient();
    
    try {
      const thread = await client.beta.threads.create();
      return thread;
    } catch (error) {
      console.error('Error creating thread:', error);
      throw error;
    }
  };
  
  // Add a message to a thread
  const addMessageToThread = async (threadId: string, content: string, role: 'user' | 'assistant' = 'user') => {
    const client = getClient();
    
    try {
      const message = await client.beta.threads.messages.create(
        threadId,
        {
          role,
          content
        }
      );
      return message;
    } catch (error) {
      console.error('Error adding message to thread:', error);
      throw error;
    }
  };
  
  // Run the assistant on a thread
  const runAssistant = async (threadId: string, assistantId: string, instructions?: string) => {
    const client = getClient();
    
    try {
      const run = await client.beta.threads.runs.create(
        threadId,
        {
          assistant_id: assistantId,
          instructions
        }
      );
      return run;
    } catch (error) {
      console.error('Error running assistant:', error);
      throw error;
    }
  };
  
  // Check run status
  const getRunStatus = async (threadId: string, runId: string) => {
    const client = getClient();
    
    try {
      const run = await client.beta.threads.runs.retrieve(
        threadId,
        runId
      );
      return run;
    } catch (error) {
      console.error('Error getting run status:', error);
      throw error;
    }
  };
  
  // Get all messages from a thread
  const getThreadMessages = async (threadId: string) => {
    const client = getClient();
    
    try {
      const messages = await client.beta.threads.messages.list(
        threadId
      );
      return messages;
    } catch (error) {
      console.error('Error getting thread messages:', error);
      throw error;
    }
  };
  
  return {
    createAssistant,
    createThread,
    addMessageToThread,
    runAssistant,
    getRunStatus,
    getThreadMessages
  };
};