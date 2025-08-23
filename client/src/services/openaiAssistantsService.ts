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

export class OpenAIAssistantsService {
  // Assistant Management
  async createAssistant(config: AssistantConfig) {
    const response = await fetch('/api/assistants/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    return await response.json();
  }

  async getAssistant(assistantId: string) {
    const response = await fetch(`/api/assistants/${assistantId}`);
    return await response.json();
  }

  async deleteAssistant(assistantId: string) {
    const response = await fetch(`/api/assistants/${assistantId}`, {
      method: 'DELETE'
    });
    return await response.json();
  }

  // Enhanced Chat with Full Assistants API
  async chatWithAssistant(
    message: string, 
    assistantId: string, 
    threadId?: string,
    metadata?: Record<string, string>
  ): Promise<{ response: string; threadId: string; runId: string }> {
    const response = await fetch('/api/assistants/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, assistantId, threadId, metadata })
    });
    
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Failed to chat with assistant');
    }
    
    return result;
  }

  // Utility Functions
  async createSpecializedAssistant(type: 'contact' | 'deal' | 'task' | 'pipeline') {
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

    return await this.createAssistant(configs[type]);
  }
}

// Export singleton instance
export const openaiAssistantsService = new OpenAIAssistantsService();

// Legacy export for backward compatibility
export const useOpenAIAssistants = () => openaiAssistantsService;