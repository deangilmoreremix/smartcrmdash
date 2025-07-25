// OpenAI Image Generation Service
interface ImageConfig {
  apiKey: string;
  model?: string;
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
}

interface ImageGenerationResponse {
  data: Array<{
    url: string;
    revised_prompt?: string;
  }>;
}

class OpenAIImageService {
  private config: ImageConfig;

  constructor(config: ImageConfig) {
    this.config = {
      model: 'dall-e-3',
      size: '1024x1024',
      quality: 'standard',
      style: 'vivid',
      ...config
    };
  }

  async generateImage(prompt: string, options?: Partial<ImageConfig>): Promise<string> {
    try {
      const requestConfig = { ...this.config, ...options };
      
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${requestConfig.apiKey}`,
        },
        body: JSON.stringify({
          model: requestConfig.model,
          prompt,
          size: requestConfig.size,
          quality: requestConfig.quality,
          style: requestConfig.style,
          n: 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI Image API error: ${response.status} ${response.statusText}`);
      }

      const data: ImageGenerationResponse = await response.json();
      return data.data[0]?.url || '';
    } catch (error) {
      console.error('OpenAI Image Service Error:', error);
      throw error;
    }
  }

  async generateVariation(imageUrl: string, options?: Partial<ImageConfig>): Promise<string> {
    try {
      const requestConfig = { ...this.config, ...options };
      
      // Convert image URL to File object
      const imageResponse = await fetch(imageUrl);
      const imageBlob = await imageResponse.blob();
      
      const formData = new FormData();
      formData.append('image', imageBlob, 'image.png');
      formData.append('size', requestConfig.size || '1024x1024');
      formData.append('n', '1');

      const response = await fetch('https://api.openai.com/v1/images/variations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${requestConfig.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`OpenAI Image Variation API error: ${response.status} ${response.statusText}`);
      }

      const data: ImageGenerationResponse = await response.json();
      return data.data[0]?.url || '';
    } catch (error) {
      console.error('OpenAI Image Variation Service Error:', error);
      throw error;
    }
  }

  updateConfig(newConfig: Partial<ImageConfig>) {
    this.config = { ...this.config, ...newConfig };
  }
}

export default OpenAIImageService;
