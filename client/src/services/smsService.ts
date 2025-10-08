// SMS Service - Client-side service connecting to existing server SMS API
import { api } from './unifiedApiClient';

export interface SmsMessage {
  id: string;
  content: string;
  recipient: string;
  status: 'sent' | 'delivered' | 'failed';
  provider: string;
  cost: number;
  sentAt: string;
  deliveredAt?: string;
  errorMessage?: string;
}

export interface SmsCampaign {
  id: string;
  name: string;
  messages: SmsMessage[];
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'failed';
  scheduledAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface SmsStats {
  totalMessages: number;
  deliveredMessages: number;
  deliveryRate: number;
  averageResponseTime: number;
  totalCost: number;
  costPerMessage: number;
  activeProviders: number;
  period: string;
}

export interface SmsProvider {
  id: string;
  name: string;
  apiKey: string | null;
  costPerMessage: number;
  supportedFeatures: string[];
  status: 'active' | 'inactive';
  deliveryRate: number;
  responseTime: number;
}

export class SmsService {
  /**
   * Send a single SMS message
   */
  static async sendSms(
    content: string,
    recipient: string,
    provider = 'twilio',
    priority: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<SmsMessage> {
    try {
      const response = await api.post('/api/messaging/send', {
        content,
        recipient,
        provider,
        priority
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to send SMS');
      }

      return {
        id: response.data.message.id,
        content,
        recipient,
        status: response.data.message.status,
        provider: response.data.message.provider,
        cost: response.data.message.cost,
        sentAt: response.data.message.sentAt
      };
    } catch (error: any) {
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }

  /**
   * Send bulk SMS messages
   */
  static async sendBulkSms(
    messages: Array<{ content: string; recipient: string; priority?: 'low' | 'medium' | 'high' }>,
    provider = 'twilio',
    batchSize = 10
  ): Promise<{
    total: number;
    successful: number;
    failed: number;
    results: any[];
  }> {
    try {
      const response = await api.post('/api/messaging/bulk', {
        messages,
        provider,
        batchSize
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to send bulk SMS');
      }

      return {
        total: response.data.total,
        successful: response.data.successful,
        failed: response.data.failed,
        results: response.data.results
      };
    } catch (error: any) {
      throw new Error(`Failed to send bulk SMS: ${error.message}`);
    }
  }

  /**
   * Get SMS message history
   */
  static async getMessageHistory(
    limit = 50,
    offset = 0,
    filters?: {
      status?: string;
      provider?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<SmsMessage[]> {
    try {
      const params = {
        limit,
        offset,
        ...filters
      };

      const response = await api.get('/api/messaging/messages', { data: params });
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch message history');
      }
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch message history: ${error.message}`);
    }
  }

  /**
   * Get SMS analytics and statistics
   */
  static async getSmsStats(period = '30d'): Promise<SmsStats> {
    try {
      const response = await api.get(`/api/messaging/stats?period=${period}`);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch SMS stats');
      }
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch SMS stats: ${error.message}`);
    }
  }

  /**
   * Get available SMS providers
   */
  static async getProviders(): Promise<SmsProvider[]> {
    try {
      const response = await api.get('/api/messaging/providers');
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch providers');
      }
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch providers: ${error.message}`);
    }
  }

  /**
   * Test SMS provider connection
   */
  static async testProvider(provider: string, phoneNumber: string): Promise<{
    success: boolean;
    messageId?: string;
    status?: string;
    error?: string;
  }> {
    try {
      const response = await api.post(`/api/messaging/test/${provider}`, {
        phoneNumber
      });

      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }

      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Validate phone number format
   */
  static validatePhoneNumber(phoneNumber: string): boolean {
    // Remove all non-digit characters except + at the beginning
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');

    // Check if it matches international format
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(cleaned);
  }

  /**
   * Format phone number for display
   */
  static formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Format as (XXX) XXX-XXXX for US numbers
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }

    // Format international numbers
    if (cleaned.length > 10) {
      return `+${cleaned.slice(0, cleaned.length - 10)} (${cleaned.slice(-10, -7)}) ${cleaned.slice(-7, -4)}-${cleaned.slice(-4)}`;
    }

    return phoneNumber;
  }

  /**
   * Estimate SMS cost
   */
  static estimateCost(messageCount: number, provider = 'twilio'): number {
    const costPerMessage = provider === 'twilio' ? 0.0075 : 0.0065;
    return messageCount * costPerMessage;
  }

  /**
   * Get SMS character limit info
   */
  static getCharacterInfo(text: string): {
    length: number;
    messages: number;
    remaining: number;
    encoding: 'GSM' | 'Unicode';
  } {
    const length = text.length;

    // Check if contains Unicode characters
    const hasUnicode = /[^\u0000-\u007F]/.test(text);
    const encoding = hasUnicode ? 'Unicode' : 'GSM';

    // GSM encoding: 160 chars per message, Unicode: 70 chars per message
    const charsPerMessage = encoding === 'GSM' ? 160 : 70;
    const messages = Math.ceil(length / charsPerMessage);
    const remaining = (messages * charsPerMessage) - length;

    return {
      length,
      messages,
      remaining,
      encoding
    };
  }
}