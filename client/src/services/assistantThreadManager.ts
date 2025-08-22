
export interface AssistantThread {
  id: string;
  type: 'contact' | 'deal' | 'task' | 'pipeline';
  entityId: string;
  assistantId: string;
  lastInteraction: Date;
  messageCount: number;
  context: Record<string, any>;
}

export class AssistantThreadManager {
  private threads: Map<string, AssistantThread> = new Map();
  
  async getOrCreateThread(
    entityType: 'contact' | 'deal' | 'task' | 'pipeline',
    entityId: string,
    context?: Record<string, any>
  ): Promise<AssistantThread> {
    const threadKey = `${entityType}_${entityId}`;
    
    if (this.threads.has(threadKey)) {
      return this.threads.get(threadKey)!;
    }
    
    // Create new persistent thread
    const thread = await this.createAssistantThread(entityType, entityId, context);
    this.threads.set(threadKey, thread);
    
    return thread;
  }
  
  async addMessageToThread(
    threadId: string,
    role: 'user' | 'assistant',
    content: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    // Add message to OpenAI Assistant thread
    // This maintains persistent conversation context
    
    const thread = Array.from(this.threads.values()).find(t => t.id === threadId);
    if (thread) {
      thread.lastInteraction = new Date();
      thread.messageCount++;
      
      // Sync across all remote apps
      await this.syncThreadAcrossApps(thread);
    }
  }
  
  private async createAssistantThread(
    entityType: string,
    entityId: string,
    context?: Record<string, any>
  ): Promise<AssistantThread> {
    // Integration with OpenAI Assistants API
    const openaiClient = new OpenAI({ apiKey: process.env.VITE_OPENAI_API_KEY });
    
    const thread = await openaiClient.beta.threads.create({
      metadata: {
        entityType,
        entityId,
        ...context
      }
    });
    
    return {
      id: thread.id,
      type: entityType as any,
      entityId,
      assistantId: this.getAssistantIdForEntity(entityType),
      lastInteraction: new Date(),
      messageCount: 0,
      context: context || {}
    };
  }
  
  private async syncThreadAcrossApps(thread: AssistantThread): Promise<void> {
    // Broadcast thread updates to all remote apps
    const remoteApps = [
      'pipeline-intelligence',
      'contact-analytics',
      'deal-insights',
      'task-automation'
    ];
    
    for (const app of remoteApps) {
      try {
        await fetch(`/api/remote-sync/${app}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ thread })
        });
      } catch (error) {
        console.warn(`Failed to sync thread to ${app}:`, error);
      }
    }
  }
  
  private getAssistantIdForEntity(entityType: string): string {
    const assistantMap = {
      'contact': process.env.VITE_CONTACT_ASSISTANT_ID,
      'deal': process.env.VITE_DEAL_ASSISTANT_ID,
      'task': process.env.VITE_TASK_ASSISTANT_ID,
      'pipeline': process.env.VITE_PIPELINE_ASSISTANT_ID
    };
    
    return assistantMap[entityType as keyof typeof assistantMap] || 'default_assistant';
  }
}

export const assistantThreadManager = new AssistantThreadManager();
