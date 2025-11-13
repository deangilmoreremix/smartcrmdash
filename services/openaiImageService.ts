import OpenAI from 'openai';
import { useApiStore } from '../store/apiStore';

export const useOpenAIImage = () => {
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
  
  // Generate an image with DALL-E
  const generateImage = async (
    prompt: string, 
    size: '1024x1024' | '1792x1024' | '1024x1792' = '1024x1024',
    quality: 'standard' | 'hd' = 'standard',
    style: 'natural' | 'vivid' = 'natural'
  ) => {
    const client = getClient();
    
    try {
      const response = await client.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,
        size,
        quality,
        style
      });
      
      // Return URL and revised prompt
      return {
        url: response.data[0].url,
        revisedPrompt: response.data[0].revised_prompt
      };
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  };

  // Generate sales collateral image
  const generateSalesCollateral = async (
    product: string,
    style: 'professional' | 'modern' | 'minimalist' | 'bold' = 'professional',
    orientation: 'square' | 'landscape' | 'portrait' = 'square'
  ) => {
    const sizeMap = {
      square: '1024x1024',
      landscape: '1792x1024',
      portrait: '1024x1792'
    };
    
    const styleDesc = {
      professional: 'professional, corporate style with blue tones',
      modern: 'modern, sleek design with gradient colors',
      minimalist: 'minimalist, clean design with ample white space',
      bold: 'bold, vibrant colors with strong typography'
    };
    
    const prompt = `Create a professional marketing image for ${product}. The image should be in a ${styleDesc[style]} suitable for business presentations and sales materials. Do not include any text in the image. Make it suitable for a CRM system and sales context.`;
    
    return generateImage(
      prompt, 
      sizeMap[orientation] as '1024x1024' | '1792x1024' | '1024x1792',
      'hd',
      'natural'
    );
  };
  
  // Generate a presentation slide background
  const generatePresentationBackground = async (
    topic: string,
    style: 'corporate' | 'creative' | 'technical' = 'corporate'
  ) => {
    const styleDesc = {
      corporate: 'professional corporate style with subtle pattern',
      creative: 'creative and modern design with abstract elements',
      technical: 'technical theme with data visualization elements'
    };
    
    const prompt = `Create a presentation slide background image about ${topic} in a ${styleDesc[style]}. The image should be subtle enough to place text over it, with no text elements in the image itself. Make it suitable for a business presentation in a sales context.`;
    
    return generateImage(
      prompt, 
      '1792x1024',
      'standard',
      'natural'
    );
  };
  
  return {
    generateImage,
    generateSalesCollateral,
    generatePresentationBackground
  };
};