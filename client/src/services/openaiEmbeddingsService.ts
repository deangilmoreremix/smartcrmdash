import { useApiStore } from '../store/apiStore';

export const useOpenAIEmbeddings = () => {
  const { apiKeys } = useApiStore();
  
  const createEmbedding = async (text: string) => {
    if (!apiKeys.openai) {
      throw new Error('OpenAI API key is not set');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKeys.openai}`,
        },
        body: JSON.stringify({
          model: "text-embedding-3-small",
          input: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data[0].embedding;
    } catch (error) {
      throw error;
    }
  };

  const semanticSearch = async (query: string, documents: string[]) => {
    try {
      // Create embeddings for query and documents
      const queryEmbedding = await createEmbedding(query);
      const documentEmbeddings = await Promise.all(
        documents.map(doc => createEmbedding(doc))
      );

      // Calculate cosine similarity
      const similarities = documentEmbeddings.map((docEmb, index) => {
        const similarity = cosineSimilarity(queryEmbedding, docEmb);
        return { index, similarity, document: documents[index] };
      });

      // Sort by similarity (highest first)
      return similarities.sort((a, b) => b.similarity - a.similarity);
    } catch (error) {
      throw error;
    }
  };

  return { createEmbedding, semanticSearch };
};

// Helper function to calculate cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}