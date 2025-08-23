import OpenAI from 'openai';
import { useApiStore } from '../store/apiStore';

export interface AssistantConfig {
  name: string;
  instructions: string;
  model?: string;
  tools?: any[];
  file_ids?: string[];
}

export interface ThreadMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: number;
  metadata?: Record<string, any>;
}

export interface AssistantRun {
  id: string;
  status: 'queued' | 'in_progress' | 'requires_action' | 'cancelling' | 'cancelled' | 'failed' | 'completed' | 'expired';
  thread_id: string;
  assistant_id: string;
  created_at: number;
  completed_at?: number;
  required_action?: any;
}

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

  // Assistant Management
  const createAssistant = async (config: AssistantConfig) => {
    const client = getClient();
    
    const assistant = await client.beta.assistants.create({
      name: config.name,
      instructions: config.instructions,
      model: config.model || "gpt-4o",
      tools: config.tools || [],
    });
    
    return assistant;
  };

  const getAssistant = async (assistantId: string) => {
    const client = getClient();
    return await client.beta.assistants.retrieve(assistantId);
  };

  const updateAssistant = async (assistantId: string, updates: Partial<AssistantConfig>) => {
    const client = getClient();
    return await client.beta.assistants.update(assistantId, updates);
  };

  const deleteAssistant = async (assistantId: string) => {
    const client = getClient();
    return await client.beta.assistants.delete(assistantId);
  };

  const listAssistants = async (limit = 20) => {
    const client = getClient();
    return await client.beta.assistants.list({ limit });
  };

  // Thread Management
  const createThread = async (metadata?: Record<string, string>) => {
    const client = getClient();
    return await client.beta.threads.create({ metadata });
  };

  const getThread = async (threadId: string) => {
    const client = getClient();
    return await client.beta.threads.retrieve(threadId);
  };

  const updateThread = async (threadId: string, metadata: Record<string, string>) => {
    const client = getClient();
    return await client.beta.threads.update(threadId, { metadata });
  };

  const deleteThread = async (threadId: string) => {
    const client = getClient();
    return await client.beta.threads.delete(threadId);
  };

  // Message Management
  const addMessage = async (
    threadId: string, 
    content: string, 
    role: 'user' | 'assistant' = 'user',
    metadata?: Record<string, string>
  ) => {
    const client = getClient();
    return await client.beta.threads.messages.create(threadId, {
      role,
      content,
      metadata
    });
  };

  const getMessages = async (threadId: string, limit = 20) => {
    const client = getClient();
    return await client.beta.threads.messages.list(threadId, { limit });
  };

  const getMessage = async (threadId: string, messageId: string) => {
    const client = getClient();
    return await client.beta.threads.messages.retrieve(threadId, messageId);
  };

  // Run Management
  const createRun = async (
    threadId: string, 
    assistantId: string, 
    instructions?: string,
    metadata?: Record<string, string>
  ) => {
    const client = getClient();
    return await client.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
      instructions,
      metadata
    });
  };

  const getRun = async (threadId: string, runId: string) => {
    const client = getClient();
    return await client.beta.threads.runs.retrieve(threadId, runId);
  };

  const listRuns = async (threadId: string, limit = 20) => {
    const client = getClient();
    return await client.beta.threads.runs.list(threadId, { limit });
  };

  const cancelRun = async (threadId: string, runId: string) => {
    const client = getClient();
    return await client.beta.threads.runs.cancel(threadId, runId);
  };

  // Enhanced Chat with Full Assistants API
  const chatWithAssistant = async (
    message: string, 
    assistantId: string, 
    threadId?: string,
    metadata?: Record<string, string>
  ): Promise<{ response: string; threadId: string; runId: string }> => {
    const client = getClient();
    
    // Create thread if not provided
    let currentThreadId = threadId;
    if (!currentThreadId) {
      const thread = await createThread(metadata);
      currentThreadId = thread.id;
    }

    // Add user message
    await addMessage(currentThreadId, message, 'user', metadata);

    // Create and run
    const run = await createRun(currentThreadId, assistantId);

    // Wait for completion with polling
    let runStatus = await getRun(currentThreadId, run.id);
    while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      runStatus = await getRun(currentThreadId, run.id);
    }

    if (runStatus.status === 'completed') {
      const messages = await getMessages(currentThreadId, 1);
      const lastMessage = messages.data[0];
      const content = Array.isArray(lastMessage.content) 
        ? (lastMessage.content[0]?.type === 'text' ? lastMessage.content[0].text.value : 'No response')
        : 'No response';

      return {
        response: content,
        threadId: currentThreadId,
        runId: run.id
      };
    } else if (runStatus.status === 'requires_action') {
      // Handle function calling if needed
      throw new Error('Function calling not implemented in this version');
    } else {
      throw new Error(`Run failed with status: ${runStatus.status}`);
    }
  };

  // Streaming Chat
  const streamChatWithAssistant = async function* (
    message: string,
    assistantId: string,
    threadId?: string,
    metadata?: Record<string, string>
  ) {
    const client = getClient();
    
    let currentThreadId = threadId;
    if (!currentThreadId) {
      const thread = await createThread(metadata);
      currentThreadId = thread.id;
    }

    await addMessage(currentThreadId, message, 'user', metadata);

    const stream = await client.beta.threads.runs.create(currentThreadId, {
      assistant_id: assistantId,
      stream: true
    });

    for await (const chunk of stream) {
      if (chunk.event === 'thread.message.delta') {
        const delta = chunk.data.delta;
        if (delta.content && delta.content[0]?.type === 'text' && delta.content[0].text?.value) {
          yield {
            content: delta.content[0].text.value,
            threadId: currentThreadId,
            finished: false
          };
        }
      } else if (chunk.event === 'thread.run.completed') {
        yield {
          content: '',
          threadId: currentThreadId,
          finished: true
        };
      }
    }
  };

  // File Operations
  const uploadFile = async (file: File, purpose: 'fine-tune' | 'assistants' = 'assistants') => {
    const client = getClient();
    return await client.files.create({
      file: file,
      purpose: purpose
    });
  };

  const deleteFile = async (fileId: string) => {
    const client = getClient();
    return await client.files.delete(fileId);
  };

  // Utility Functions
  const createSpecializedAssistant = async (type: 'contact' | 'deal' | 'task' | 'pipeline') => {
    const configs = {
      contact: {
        name: 'Contact Intelligence Agent',
        instructions: `You are a specialized AI assistant for contact management and relationship intelligence. 
        You help analyze contacts, predict engagement, generate personalized communication, and track relationship health.
        Always provide actionable insights based on contact data, interaction history, and communication patterns.`,
        tools: [{ type: 'code_interpreter' }]
      },
      deal: {
        name: 'Deal Assistant Agent', 
        instructions: `You are a specialized AI assistant for deal management and sales intelligence.
        You help analyze deal progression, identify risks, suggest next steps, and optimize closing strategies.
        Always provide data-driven insights and specific recommendations for deal advancement.`,
        tools: [{ type: 'code_interpreter' }]
      },
      task: {
        name: 'Task Automation Agent',
        instructions: `You are a specialized AI assistant for task management and workflow automation.
        You help prioritize tasks, automate routine activities, and optimize productivity workflows.
        Always provide clear action items and automation suggestions.`,
        tools: [{ type: 'code_interpreter' }]
      },
      pipeline: {
        name: 'Pipeline Management Bot',
        instructions: `You are a specialized AI assistant for sales pipeline management and forecasting.
        You help analyze pipeline health, predict outcomes, and optimize sales processes.
        Always provide strategic insights and actionable pipeline improvements.`,
        tools: [{ type: 'code_interpreter' }]
      }
    };

    return await createAssistant(configs[type]);
  };

  return { 
    // Assistant Management
    createAssistant,
    getAssistant,
    updateAssistant,
    deleteAssistant,
    listAssistants,
    createSpecializedAssistant,
    
    // Thread Management  
    createThread,
    getThread,
    updateThread,
    deleteThread,
    
    // Message Management
    addMessage,
    getMessages,
    getMessage,
    
    // Run Management
    createRun,
    getRun,
    listRuns,
    cancelRun,
    
    // Enhanced Chat
    chatWithAssistant,
    streamChatWithAssistant,
    
    // File Operations
    uploadFile,
    deleteFile,
    
    // Utility
    getClient 
  };
};