import { supabaseAIService } from './supabaseAIService';

interface ImageGenerationOptions {
  prompt: string;
  model?: 'dall-e-2' | 'dall-e-3';
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
  n?: number;
  customerId?: string;
}

interface ImageGenerationResult {
  url: string;
  revised_prompt?: string;
  model: string;
  size: string;
  quality: string;
  style?: string;
}

class OpenAIImageService {
  private apiKey: string;
  private baseUrl: string = 'https://api.openai.com/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_OPENAI_API_KEY || '';
  }

  /**
   * Check if API key is valid (not a placeholder)
   */
  private isValidApiKey(): boolean {
    return !!(this.apiKey && 
           this.apiKey.length > 10 && 
           !this.apiKey.includes('your_openai_api_key') &&
           !this.apiKey.includes('your_ope') &&
           !this.apiKey.includes('placeholder') &&
           !this.apiKey.startsWith('your_') &&
           this.apiKey !== 'your_openai_api_key');
  }

  /**
   * Generate an image using DALL-E
   */
  async generateImage(options: ImageGenerationOptions): Promise<ImageGenerationResult> {
    if (!this.isValidApiKey()) {
      throw new Error('OpenAI API key is required for image generation. Please check your environment variables.');
    }

    try {
      const response = await fetch(`${this.baseUrl}/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: options.model || 'dall-e-3',
          prompt: options.prompt,
          size: options.size || '1024x1024',
          quality: options.quality || 'standard',
          style: options.style || 'vivid',
          n: options.n || 1
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI Image API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const imageData = data.data[0];

      const result: ImageGenerationResult = {
        url: imageData.url,
        revised_prompt: imageData.revised_prompt,
        model: options.model || 'dall-e-3',
        size: options.size || '1024x1024',
        quality: options.quality || 'standard',
        style: options.style
      };

      // Log usage if customer ID is provided
      if (options.customerId) {
        try {
          await supabaseAIService.logUsage({
            customerId: options.customerId,
            provider: 'openai',
            model: result.model,
            feature: 'image-generation',
            promptTokens: 0,
            completionTokens: 0,
            totalTokens: 1, // Count as 1 token for image generation
            cost: this.calculateImageCost(result.model, result.size),
            responseTime: 0
          });
        } catch (logError) {
          console.warn('Failed to log AI usage:', logError);
        }
      }

      return result;
    } catch (error) {
      console.error('OpenAI Image generation failed:', error);
      throw error;
    }
  }

  /**
   * Calculate approximate cost for image generation
   */
  private calculateImageCost(model: string, size: string): number {
    // Approximate costs based on OpenAI pricing (as of 2024)
    const costs: Record<string, Record<string, number>> = {
      'dall-e-2': {
        '256x256': 0.016,
        '512x512': 0.018,
        '1024x1024': 0.020
      },
      'dall-e-3': {
        '1024x1024': 0.040, // Standard quality
        '1792x1024': 0.080,
        '1024x1792': 0.080
      }
    };

    return costs[model]?.[size] || 0.040; // Default to DALL-E 3 standard cost
  }

  /**
   * Create image variation using DALL-E 2
   */
  async createVariation(
    imageFile: File, 
    options?: Partial<ImageGenerationOptions>
  ): Promise<ImageGenerationResult> {
    if (!this.isValidApiKey()) {
      throw new Error('OpenAI API key is required for image variation. Please check your environment variables.');
    }

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('n', String(options?.n || 1));
    formData.append('size', options?.size || '1024x1024');

    try {
      const response = await fetch(`${this.baseUrl}/images/variations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI Image Variation API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const imageData = data.data[0];

      return {
        url: imageData.url,
        model: 'dall-e-2',
        size: options?.size || '1024x1024',
        quality: 'standard'
      };
    } catch (error) {
      console.error('OpenAI Image variation failed:', error);
      throw error;
    }
  }

  /**
   * Edit an image using DALL-E 2
   */
  async editImage(
    imageFile: File,
    maskFile: File | undefined,
    prompt: string,
    options?: Partial<ImageGenerationOptions>
  ): Promise<ImageGenerationResult> {
    if (!this.isValidApiKey()) {
      throw new Error('OpenAI API key is required for image editing. Please check your environment variables.');
    }

    const formData = new FormData();
    formData.append('image', imageFile);
    if (maskFile) {
      formData.append('mask', maskFile);
    }
    formData.append('prompt', prompt);
    formData.append('n', String(options?.n || 1));
    formData.append('size', options?.size || '1024x1024');

    try {
      const response = await fetch(`${this.baseUrl}/images/edits`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI Image Edit API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const imageData = data.data[0];

      return {
        url: imageData.url,
        model: 'dall-e-2',
        size: options?.size || '1024x1024',
        quality: 'standard'
      };
    } catch (error) {
      console.error('OpenAI Image edit failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const openaiImageService = new OpenAIImageService();

// Export hook for React components
export const useOpenAIImageGeneration = () => {
  const generateImage = async (options: ImageGenerationOptions) => {
    return openaiImageService.generateImage(options);
  };

  const createVariation = async (imageFile: File, options?: Partial<ImageGenerationOptions>) => {
    return openaiImageService.createVariation(imageFile, options);
  };

  const editImage = async (
    imageFile: File, 
    maskFile: File | undefined, 
    prompt: string, 
    options?: Partial<ImageGenerationOptions>
  ) => {
    return openaiImageService.editImage(imageFile, maskFile, prompt, options);
  };

  return {
    generateImage,
    createVariation,
    editImage
  };
};

export type { ImageGenerationOptions, ImageGenerationResult };