// SMS Enhancement Service - Combines SMS sending with AI content generation
// Uses the Voice & SMS components code for AI features

import { SmsService, SmsMessage } from './smsService';
import { generateSmsTemplate, enhanceSmsMessage, analyzeSmsEffectiveness, generateSmsVariations } from './aiEnhancementService';
import { useSharedModuleState } from '../utils/moduleFederationOrchestrator';

export interface SmsEnhancementOptions {
  model?: 'gemini-2.5-pro' | 'gemini-2.0-flash' | 'gemini-1.5-pro';
  context?: string;
  tone?: 'professional' | 'friendly' | 'casual' | 'formal';
  includeEmojis?: boolean;
  maxLength?: number;
}

export class SmsEnhancementService {
  /**
   * Generate and send an AI-powered SMS to a contact
   */
  static async generateAndSendSms(
    contactId: string,
    context: string = 'general',
    options: SmsEnhancementOptions = {}
  ): Promise<SmsMessage> {
    const content = await this.generateSmsForContact(contactId, context, options);
    const contact = this.getContactById(contactId);

    if (!contact?.phone) {
      throw new Error('Contact not found or missing phone number');
    }

    return SmsService.sendSms(content, contact.phone);
  }

  /**
   * Generate AI-powered SMS content for a specific contact
   */
  static async generateSmsForContact(
    contactId: string,
    context: string = 'general',
    options: SmsEnhancementOptions = {}
  ): Promise<string> {
    const contact = this.getContactById(contactId);

    if (!contact) {
      throw new Error('Contact not found');
    }

    const {
      model = 'gemini-2.5-pro',
      tone = 'professional',
      includeEmojis = true
    } = options;

    // Generate base SMS template
    let smsContent = await generateSmsTemplate(model, context, tone, includeEmojis);

    // Replace contact variables
    smsContent = this.replaceContactVariables(smsContent, contact);

    // Ensure it fits SMS constraints
    const charInfo = SmsService.getCharacterInfo(smsContent);
    if (charInfo.length > 160) {
      smsContent = smsContent.substring(0, 157) + '...';
    }

    return smsContent;
  }

  /**
   * Enhance existing SMS content with AI
   */
  static async enhanceSmsContent(
    content: string,
    enhancement: string = 'tone'
  ): Promise<string> {
    return enhanceSmsMessage(content, enhancement);
  }

  /**
   * Generate multiple SMS variations
   */
  static async generateSmsVariations(
    baseContent: string,
    count: number = 3
  ): Promise<string[]> {
    return generateSmsVariations(baseContent, count);
  }

  /**
   * Analyze SMS effectiveness
   */
  static async analyzeSmsEffectiveness(
    content: string,
    targetAudience: string = 'general'
  ): Promise<{
    score: number;
    strengths: string[];
    improvements: string[];
    suggestions: string[];
  }> {
    return analyzeSmsEffectiveness(content, targetAudience);
  }

  /**
   * Send bulk SMS with AI-generated content
   */
  static async sendBulkSmsWithAI(
    contactIds: string[],
    context: string = 'general',
    options: SmsEnhancementOptions = {}
  ): Promise<{
    total: number;
    successful: number;
    failed: number;
    results: any[];
  }> {
    const messages = await Promise.all(
      contactIds.map(async (contactId) => {
        const content = await this.generateSmsForContact(contactId, context, options);
        const contact = this.getContactById(contactId);
        return {
          content,
          recipient: contact?.phone || '',
          priority: 'medium' as const
        };
      })
    );

    // Filter out contacts without phone numbers
    const validMessages = messages.filter(msg => msg.recipient);

    return SmsService.sendBulkSms(validMessages);
  }

  /**
   * Get SMS analytics and statistics
   */
  static async getSmsAnalytics(period: string = '30d') {
    return SmsService.getSmsStats(period);
  }

  /**
   * Get SMS message history
   */
  static async getSmsHistory(
    limit: number = 50,
    offset: number = 0,
    filters?: {
      status?: string;
      provider?: string;
      startDate?: string;
      endDate?: string;
    }
  ) {
    return SmsService.getMessageHistory(limit, offset, filters);
  }

  /**
   * Test SMS provider connection
   */
  static async testSmsProvider(provider: string, phoneNumber: string) {
    return SmsService.testProvider(provider, phoneNumber);
  }

  /**
   * Validate and format phone number
   */
  static validateAndFormatPhone(phoneNumber: string): {
    isValid: boolean;
    formatted?: string;
    error?: string;
  } {
    if (!phoneNumber || !phoneNumber.trim()) {
      return { isValid: false, error: 'Phone number is required' };
    }

    const isValid = SmsService.validatePhoneNumber(phoneNumber);
    if (!isValid) {
      return { isValid: false, error: 'Invalid phone number format' };
    }

    const formatted = SmsService.formatPhoneNumber(phoneNumber);
    return { isValid: true, formatted };
  }

  /**
   * Get SMS character and cost information
   */
  static getSmsInfo(content: string, provider: string = 'twilio'): {
    characterInfo: {
      length: number;
      messages: number;
      remaining: number;
      encoding: 'GSM' | 'Unicode';
    };
    estimatedCost: number;
  } {
    const characterInfo = SmsService.getCharacterInfo(content);
    const estimatedCost = SmsService.estimateCost(characterInfo.messages, provider);

    return {
      characterInfo,
      estimatedCost
    };
  }

  /**
   * Replace contact variables in SMS content
   */
  private static replaceContactVariables(content: string, contact: any): string {
    return content
      .replace(/\{\{name\}\}/g, contact.name || '')
      .replace(/\{\{firstName\}\}/g, contact.firstName || contact.name?.split(' ')[0] || '')
      .replace(/\{\{lastName\}\}/g, contact.lastName || contact.name?.split(' ').slice(1).join(' ') || '')
      .replace(/\{\{company\}\}/g, contact.company || '')
      .replace(/\{\{email\}\}/g, contact.email || '')
      .replace(/\{\{phone\}\}/g, contact.phone || '')
      .replace(/\{\{your_name\}\}/g, 'Your Name') // Should come from user profile
      .replace(/\{\{your_company\}\}/g, 'Your Company') // Should come from user profile
      .replace(/\{\{your_phone\}\}/g, 'Your Phone'); // Should come from user profile
  }

  /**
   * Get contact by ID from shared state
   */
  private static getContactById(contactId: string): any {
    const { sharedData } = useSharedModuleState.getState();
    return sharedData.contacts?.find((c: any) => c.id === contactId);
  }

  /**
   * Get all contacts from shared state
   */
  static getAllContacts(): any[] {
    const { sharedData } = useSharedModuleState.getState();
    return sharedData.contacts || [];
  }

  /**
   * Search contacts by query
   */
  static searchContacts(query: string): any[] {
    const contacts = this.getAllContacts();
    if (!query) return contacts;

    const lowerQuery = query.toLowerCase();
    return contacts.filter(contact =>
      contact.name?.toLowerCase().includes(lowerQuery) ||
      contact.email?.toLowerCase().includes(lowerQuery) ||
      contact.phone?.includes(query) ||
      contact.company?.toLowerCase().includes(lowerQuery)
    );
  }
}