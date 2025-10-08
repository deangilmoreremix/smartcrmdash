// AI Enhancement Service - SMS and content generation using Gemini API
// Based on the Voice & SMS components code

import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export interface SmsTemplateOptions {
  model?: 'gemini-2.5-pro' | 'gemini-2.0-flash' | 'gemini-1.5-pro';
  context?: string;
  tone?: 'professional' | 'friendly' | 'casual' | 'formal';
  includeEmojis?: boolean;
  maxLength?: number;
}

export interface VoiceDropOptions {
  model?: 'gemini-2.5-pro' | 'gemini-2.0-flash' | 'gemini-1.5-pro';
  referralType?: 'cold' | 'warm' | 'client' | 'followup' | 'network' | 'friend';
  tone?: 'professional' | 'friendly' | 'casual' | 'formal';
  length?: 'short' | 'standard' | 'long';
}

export interface MessagingAppOptions {
  model?: 'gemini-2.5-pro' | 'gemini-2.0-flash' | 'gemini-1.5-pro';
  platform?: 'whatsapp' | 'messenger' | 'telegram';
  context?: string;
  tone?: 'professional' | 'friendly' | 'casual';
  includeEmojis?: boolean;
}

/**
 * Generate an SMS template using AI
 */
export async function generateSmsTemplate(
  model: string = 'gemini-2.5-pro',
  context: string = 'general',
  tone: string = 'professional',
  includeEmojis: boolean = true
): Promise<string> {
  try {
    const modelInstance = genAI.getGenerativeModel({ model });

    const prompt = `Generate a professional SMS message for: ${context}

Requirements:
- Keep under 160 characters
- Tone: ${tone}
- ${includeEmojis ? 'Include relevant emojis' : 'No emojis'}
- Make it engaging and actionable
- Use proper SMS etiquette

Generate only the SMS content, no explanations.`;

    const result = await modelInstance.generateContent(prompt);
    const response = await result.response;
    let sms = response.text().trim();

    // Ensure it's under 160 characters
    if (sms.length > 160) {
      sms = sms.substring(0, 157) + '...';
    }

    return sms;
  } catch (error) {
    console.error('Error generating SMS template:', error);
    return 'Hello! This is a sample SMS message.';
  }
}

/**
 * Generate a voice drop script using AI
 */
export async function generateVoiceDropScript(
  model: string = 'gemini-2.5-pro',
  referralType: string = 'warm',
  tone: string = 'professional',
  length: string = 'standard'
): Promise<string> {
  try {
    const modelInstance = genAI.getGenerativeModel({ model });

    const lengthGuide = {
      short: '30-45 seconds',
      standard: '45-60 seconds',
      long: '60-90 seconds'
    };

    const prompt = `Generate a professional voice drop script for a ${referralType} referral.

Requirements:
- Length: ${lengthGuide[length as keyof typeof lengthGuide]}
- Tone: ${tone}
- Include proper introduction and call-to-action
- Use variable placeholders like {{name}}, {{company}}, etc.
- Make it conversational and natural
- Focus on building rapport and value proposition

Generate only the script content, no explanations or formatting.`;

    const result = await modelInstance.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error generating voice script:', error);
    return 'Hello {{name}}, this is {{your_name}} from {{company}}. I wanted to connect with you about...';
  }
}

/**
 * Generate messaging app content (WhatsApp, Messenger, etc.)
 */
export async function generateMessagingAppTemplate(
  model: string = 'gemini-2.5-pro',
  platform: string = 'whatsapp',
  context: string = 'general',
  tone: string = 'professional',
  includeEmojis: boolean = true
): Promise<string> {
  try {
    const modelInstance = genAI.getGenerativeModel({ model });

    const prompt = `Generate a ${platform} message for: ${context}

Requirements:
- Platform-appropriate style for ${platform}
- Tone: ${tone}
- ${includeEmojis ? 'Include relevant emojis' : 'No emojis'}
- Keep it conversational and engaging
- Include proper greeting and sign-off
- Make it mobile-friendly

Generate only the message content, no explanations.`;

    const result = await modelInstance.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error generating messaging template:', error);
    return `Hello! 👋\n\nThis is a sample ${platform} message.\n\nBest regards`;
  }
}

/**
 * Enhance existing SMS content
 */
export async function enhanceSmsMessage(
  content: string,
  enhancement: string = 'general'
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    const prompt = `Enhance this SMS message with ${enhancement} improvements:

Original: "${content}"

Requirements:
- Keep under 160 characters
- Maintain the core message
- Improve clarity, engagement, and effectiveness
- Add appropriate emojis if they fit naturally
- Make it more compelling and actionable

Return only the enhanced SMS, no explanations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let enhanced = response.text().trim();

    // Ensure it's under 160 characters
    if (enhanced.length > 160) {
      enhanced = enhanced.substring(0, 157) + '...';
    }

    return enhanced;
  } catch (error) {
    console.error('Error enhancing SMS:', error);
    return content; // Return original if enhancement fails
  }
}

/**
 * Enhance existing voice script
 */
export async function enhanceVoiceDropScript(
  content: string,
  enhancement: string = 'tone',
  targetTone: string = 'professional'
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    const prompt = `Enhance this voice drop script with ${enhancement} improvements:

Original: "${content}"

Requirements:
- Target tone: ${targetTone}
- Maintain the core message and structure
- Improve delivery, pacing, and engagement
- Keep variable placeholders like {{name}}, {{company}}, etc.
- Make it more natural and conversational

Return only the enhanced script, no explanations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error enhancing voice script:', error);
    return content; // Return original if enhancement fails
  }
}

/**
 * Generate multiple SMS variations
 */
export async function generateSmsVariations(
  baseContent: string,
  count: number = 3,
  variations: string[] = ['tone', 'length', 'style']
): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    const prompt = `Generate ${count} variations of this SMS message:

Base message: "${baseContent}"

Create variations focusing on: ${variations.join(', ')}

Requirements:
- Each variation under 160 characters
- Maintain core message
- Make them distinct but effective
- Return as a numbered list

Format: 1. [SMS content]
2. [SMS content]
etc.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    // Parse the numbered list
    const variationsList = text.split('\n')
      .filter((line: string) => /^\d+\./.test(line.trim()))
      .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
      .slice(0, count);

    return variationsList;
  } catch (error) {
    console.error('Error generating SMS variations:', error);
    return [baseContent]; // Return original if generation fails
  }
}

/**
 * Analyze SMS effectiveness
 */
export async function analyzeSmsEffectiveness(
  content: string,
  targetAudience: string = 'general'
): Promise<{
  score: number;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
}> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    const prompt = `Analyze this SMS message for effectiveness:

Message: "${content}"
Target audience: ${targetAudience}

Provide analysis in JSON format:
{
  "score": <number 1-10>,
  "strengths": [<array of strengths>],
  "improvements": [<array of improvement areas>],
  "suggestions": [<array of specific suggestions>]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    // Try to parse JSON response
    try {
      const analysis = JSON.parse(text);
      return {
        score: Math.max(1, Math.min(10, analysis.score || 5)),
        strengths: Array.isArray(analysis.strengths) ? analysis.strengths : [],
        improvements: Array.isArray(analysis.improvements) ? analysis.improvements : [],
        suggestions: Array.isArray(analysis.suggestions) ? analysis.suggestions : []
      };
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return {
        score: 5,
        strengths: ['Message is clear'],
        improvements: ['Could be more engaging'],
        suggestions: ['Consider adding a call-to-action']
      };
    }
  } catch (error) {
    console.error('Error analyzing SMS:', error);
    return {
      score: 5,
      strengths: [],
      improvements: [],
      suggestions: []
    };
  }
}