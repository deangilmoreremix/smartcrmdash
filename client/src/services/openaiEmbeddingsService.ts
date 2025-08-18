import OpenAI from 'openai';

export const useOpenAIEmbeddings = () => {
  const getClient = () => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenAI API key is not set');
    }
    
    return new OpenAI({ 
      apiKey,
      dangerouslyAllowBrowser: true
    });
  };
  
  const generateEmbedding = async (text: string) => {
    const client = getClient();
    
    const response = await client.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });
    
    return response.data[0].embedding;
  };

  return { generateEmbedding, getClient };
};