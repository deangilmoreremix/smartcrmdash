import { useState, useCallback } from 'react';

interface VisionAnalysisResult {
  description: string;
  details: string[];
  objects: string[];
  text?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  confidence: number;
}

interface VisionError {
  message: string;
  code?: string;
}

export const useOpenAIVision = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<VisionError | null>(null);
  const [result, setResult] = useState<VisionAnalysisResult | null>(null);

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const analyzeImage = useCallback(async (
    imageUrl: string, 
    analysisType: 'document' | 'competitor' | 'contract' | 'general' = 'general',
    customPrompt?: string
  ): Promise<VisionAnalysisResult> => {
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured. Please set the VITE_OPENAI_API_KEY environment variable.');
    }

    setIsAnalyzing(true);
    setError(null);
    
    try {
      const systemPrompts = {
        document: 'You are an expert document analyzer. Analyze the document image and extract key information, structure, and important details. Focus on identifying document type, main content, action items, and any critical information.',
        competitor: 'You are a competitive intelligence analyst. Analyze this competitor material and identify key selling points, pricing information, positioning, strengths, and weaknesses. Provide strategic insights.',
        contract: 'You are a legal document analyst. Analyze this contract or legal document and identify key terms, obligations, rights, potential risks, and important clauses. Flag any concerning elements.',
        general: 'You are an expert image analyst. Describe what you see in this image in detail, including objects, text, context, and any relevant information.'
      };

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: customPrompt || systemPrompts[analysisType]
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Analyze this image and provide a detailed response in JSON format with the fields: description, details (array), objects (array), text (if any), sentiment, and confidence (0-1).'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageUrl,
                    detail: 'high'
                  }
                }
              ]
            }
          ],
          temperature: 0.3,
          max_tokens: 1000,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('Invalid response from OpenAI Vision API');
      }

      try {
        const parsedContent = JSON.parse(content);
        const analysisResult: VisionAnalysisResult = {
          description: parsedContent.description || 'No description available',
          details: parsedContent.details || [],
          objects: parsedContent.objects || [],
          text: parsedContent.text || undefined,
          sentiment: parsedContent.sentiment || 'neutral',
          confidence: parsedContent.confidence || 0.8
        };

        setResult(analysisResult);
        return analysisResult;
      } catch (parseError) {
        throw new Error('Failed to parse vision analysis response');
      }
    } catch (error) {
      const visionError: VisionError = {
        message: error instanceof Error ? error.message : 'Vision analysis failed',
        code: 'ANALYSIS_ERROR'
      };
      setError(visionError);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  }, [apiKey]);

  const analyzeFromFile = useCallback(async (
    file: File,
    analysisType: 'document' | 'competitor' | 'contract' | 'general' = 'general',
    customPrompt?: string
  ): Promise<VisionAnalysisResult> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64Data = e.target?.result as string;
          const result = await analyzeImage(base64Data, analysisType, customPrompt);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }, [analyzeImage]);

  const reset = useCallback(() => {
    setIsAnalyzing(false);
    setError(null);
    setResult(null);
  }, []);

  return {
    analyzeImage,
    analyzeFromFile,
    isAnalyzing,
    error,
    result,
    reset
  };
};

export type { VisionAnalysisResult, VisionError };