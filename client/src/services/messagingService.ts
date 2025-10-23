import { logger } from './logger.service';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface Message {
  id: string;
  content: string;
  recipient: string;
  provider: string;
  status: 'sent' | 'delivered' | 'failed';
  cost: number;
  sent_at: string;
  created_at: string;
}

export interface MessageStats {
  totalMessages: number;
  deliveredMessages: number;
  deliveryRate: number;
  averageResponseTime: number;
  totalCost: number;
  costPerMessage: number;
  activeProviders: number;
  period: string;
}

export interface Provider {
  id: string;
  name: string;
  apiKey: string | null;
  costPerMessage: number;
  supportedFeatures: string[];
  status: 'active' | 'inactive';
  deliveryRate: number;
  responseTime: number;
}

export interface SendMessageRequest {
  content: string;
  recipient: string;
  provider?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface BulkMessageRequest {
  messages: SendMessageRequest[];
  provider?: string;
  batchSize?: number;
}

export interface VideoEmailRequest {
  subject: string;
  html: string;
  text: string;
  recipients: string[];
  videoUrl: string;
  videoId: string;
  thumbnailUrl?: string;
  analytics: {
    trackOpens: boolean;
    trackClicks: boolean;
    trackVideoPlays: boolean;
  };
  metadata?: Record<string, any>;
}

export const messagingService = {
  async sendVideoEmail(request: VideoEmailRequest): Promise<{ success: boolean; emailId: string; status: string }> {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/messaging/send-video-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY
        } as Record<string, string>,
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || response.statusText);
      }

      const data = await response.json();
      logger.info(`Video email sent successfully: ${data.emailId}`);
      return data;
    } catch (error) {
      logger.error('Failed to send video email', error as Error);
      throw error;
    }
  },

  async sendMessage(request: SendMessageRequest): Promise<{ success: boolean; message: Message; status: string }> {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/messaging/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY
        } as Record<string, string>,
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || response.statusText);
      }

      const data = await response.json();
      logger.info(`Message sent successfully: ${data.message.id}`);
      return data;
    } catch (error) {
      logger.error('Failed to send message', error as Error);
      throw error;
    }
  },

  async sendBulkMessages(request: BulkMessageRequest): Promise<{
    success: boolean;
    total: number;
    successful: number;
    failed: number;
    results: any[];
    summary: string;
  }> {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/messaging/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY
        } as Record<string, string>,
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || response.statusText);
      }

      const data = await response.json();
      logger.info(`Bulk messages sent: ${data.successful}/${data.total} successful`);
      return data;
    } catch (error) {
      logger.error('Failed to send bulk messages', error as Error);
      throw error;
    }
  },

  async getMessageHistory(limit: number = 50, offset: number = 0, filters?: {
    status?: string;
    provider?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Message[]> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        ...filters
      });

      const response = await fetch(`${SUPABASE_URL}/functions/v1/messaging/messages?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY
        } as Record<string, string>
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || response.statusText);
      }

      const data = await response.json();
      logger.info(`Retrieved ${data.length} messages`);
      return data;
    } catch (error) {
      logger.error('Failed to get message history', error as Error);
      // Return empty array as fallback
      return [];
    }
  },

  async getMessageStats(period: string = '30d'): Promise<MessageStats> {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/messaging/stats?period=${period}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY
        } as Record<string, string>
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || response.statusText);
      }

      const data = await response.json();
      logger.info(`Retrieved message stats for period: ${period}`);
      return data;
    } catch (error) {
      logger.error('Failed to get message stats', error as Error);
      // Return default stats as fallback
      return {
        totalMessages: 0,
        deliveredMessages: 0,
        deliveryRate: 0,
        averageResponseTime: 0,
        totalCost: 0,
        costPerMessage: 0,
        activeProviders: 0,
        period
      };
    }
  },

  async getProviders(): Promise<Provider[]> {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/messaging/providers`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY
        } as Record<string, string>
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || response.statusText);
      }

      const data = await response.json();
      logger.info(`Retrieved ${data.length} providers`);
      return data;
    } catch (error) {
      logger.error('Failed to get providers', error as Error);
      // Return default providers as fallback
      return [
        {
          id: 'twilio',
          name: 'Twilio',
          apiKey: null,
          costPerMessage: 0.0075,
          supportedFeatures: ['SMS', 'MMS', 'Voice'],
          status: 'inactive',
          deliveryRate: 0,
          responseTime: 0
        }
      ];
    }
  },

  async testProvider(provider: string, phoneNumber: string): Promise<{
    success: boolean;
    provider: string;
    messageId: string;
    status: string;
    note?: string;
  }> {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/messaging/test/${provider}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY
        } as Record<string, string>,
        body: JSON.stringify({ phoneNumber })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || response.statusText);
      }

      const data = await response.json();
      logger.info(`Provider test successful: ${provider}`);
      return data;
    } catch (error) {
      logger.error('Failed to test provider', error as Error);
      throw error;
    }
  }
};

export default messagingService;