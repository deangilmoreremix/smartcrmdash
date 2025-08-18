import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // AI Routes - replacing Supabase Edge Functions
  
  // Natural Language Query
  app.post('/api/ai/natural-language-query', async (req, res) => {
    try {
      const { query, contextData, model } = req.body;
      
      if (!query || !contextData) {
        return res.status(400).json({ error: "Invalid or missing query or context data" });
      }
      
      const openaiApiKey = process.env.OPENAI_API_KEY;
      const googleApiKey = process.env.GOOGLE_AI_API_KEY;
      
      const useOpenAI = model?.toLowerCase().includes("gpt") || (!googleApiKey && openaiApiKey);
      
      const systemPrompt = `You are a CRM data analysis assistant that answers natural language questions about CRM data.
      You'll be given a natural language query and CRM data context. Your task is to interpret the query and provide insights based on the data.
      Respond with a JSON object containing 'response' (your answer) and 'explanation' (how you arrived at the answer).`;
      
      const queryPrompt = `Natural language query: "${query}"
      
      CRM data context:
      ${JSON.stringify(contextData, null, 2)}
      
      Analyze the data and answer the query. If the query cannot be answered with the provided data, explain why.`;
      
      let result;
      
      if (useOpenAI && openaiApiKey) {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openaiApiKey}`
          },
          body: JSON.stringify({
            model: model || "gpt-3.5-turbo",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: queryPrompt }
            ],
            response_format: { type: "json_object" },
            max_tokens: 800,
            temperature: 0.3
          })
        });
        
        const data = await response.json();
        result = JSON.parse(data.choices[0].message.content);
      } else if (googleApiKey) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model || "gemini-1.5-flash"}:generateContent?key=${googleApiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemPrompt}\n\n${queryPrompt}` }] }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 800 }
          })
        });
        
        const data = await response.json();
        const jsonString = data.candidates[0].content.parts[0].text;
        const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Could not extract valid JSON from AI response");
        }
      } else {
        return res.status(500).json({ error: "No AI API keys available" });
      }

      if (!result.response) {
        result = {
          response: result.response || result.answer || "No clear answer could be generated",
          explanation: result.explanation || result.reasoning || "No explanation provided"
        };
      }

      res.json(result);
    } catch (error) {
      console.error("Error in natural-language-query:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Generate Sales Pitch
  app.post('/api/ai/generate-sales-pitch', async (req, res) => {
    try {
      const { leadData, model, pitchStyle } = req.body;
      
      if (!leadData) {
        return res.status(400).json({ error: "Invalid or missing lead data" });
      }
      
      const openaiApiKey = process.env.OPENAI_API_KEY;
      const googleApiKey = process.env.GOOGLE_AI_API_KEY;
      
      const useOpenAI = model?.toLowerCase().includes("gpt") || (!googleApiKey && openaiApiKey);
      
      const style = pitchStyle || "professional";
      const prompt = `Create a personalized ${style} sales pitch for a lead with the following information:
        Name: ${leadData.name || 'Unknown'}
        Company: ${leadData.company || 'Unknown'}
        Position: ${leadData.position || 'Unknown'}
        Industry: ${leadData.industry || 'Unknown'}
        Pain points: ${leadData.painPoints || 'Unknown'}
        Interests: ${leadData.interests || 'Unknown'}
        Previous interactions: ${leadData.interactions || 'None'}
        
        The pitch should be concise, engaging, and highlight how our solution addresses their specific needs.`;
      
      let result;
      
      if (useOpenAI && openaiApiKey) {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openaiApiKey}`
          },
          body: JSON.stringify({
            model: model || "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "You are a skilled sales consultant creating personalized pitches based on lead information." },
              { role: "user", content: prompt }
            ],
            max_tokens: 500,
            temperature: 0.7
          })
        });
        
        const data = await response.json();
        result = data.choices[0].message.content;
      } else if (googleApiKey) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model || "gemini-1.5-flash"}:generateContent?key=${googleApiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
          })
        });
        
        const data = await response.json();
        result = data.candidates[0].content.parts[0].text;
      } else {
        return res.status(500).json({ error: "No AI API keys available" });
      }

      res.json({ pitch: result });
    } catch (error) {
      console.error("Error in generate-sales-pitch:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Draft Email Response
  app.post('/api/ai/draft-email-response', async (req, res) => {
    try {
      const { incomingEmail, context, model, tone, includeGreeting, includeSignature } = req.body;
      
      if (!incomingEmail || typeof incomingEmail !== "string") {
        return res.status(400).json({ error: "Invalid or missing email" });
      }
      
      const openaiApiKey = process.env.OPENAI_API_KEY;
      const googleApiKey = process.env.GOOGLE_AI_API_KEY;
      
      const useOpenAI = model?.toLowerCase().includes("gpt") || (!googleApiKey && openaiApiKey);
      
      const contactInfo = context?.contact ? 
        `Recipient: ${context.contact.name}
         Company: ${context.contact.company || 'N/A'}
         Position: ${context.contact.position || context.contact.title || 'N/A'}
         Relationship Status: ${context.relationship || 'New contact'}`
        : 'No contact information available';
        
      const dealsInfo = context?.deals?.length > 0 ?
        `Current Deals: ${context.deals.map((deal: any) => 
          `${deal.title} (${deal.stage}, $${deal.value})`
        ).join(', ')}`
        : 'No active deals';
      
      const emailTone = tone || 'professional';
      const withGreeting = includeGreeting === undefined ? true : includeGreeting;
      const withSignature = includeSignature === undefined ? true : includeSignature;
      
      const prompt = `Draft a ${emailTone} email response to this incoming email:
      
      "${incomingEmail}"
      
      Context about the recipient:
      ${contactInfo}
      ${dealsInfo}
      
      ${withGreeting ? 'Include a professional greeting.' : 'Skip the greeting.'}
      ${withSignature ? 'Include a professional signature.' : 'Skip the signature.'}
      
      Return your response as a JSON object with 'subject' and 'body' fields.`;
      
      let result;
      
      if (useOpenAI && openaiApiKey) {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openaiApiKey}`
          },
          body: JSON.stringify({
            model: model || "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "You are an email assistant that drafts professional, contextually appropriate email responses." },
              { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
            max_tokens: 1000,
            temperature: 0.5
          })
        });
        
        const data = await response.json();
        result = JSON.parse(data.choices[0].message.content);
      } else if (googleApiKey) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model || "gemini-1.5-flash"}:generateContent?key=${googleApiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `You are an email assistant that drafts professional, contextually appropriate email responses. ${prompt}` }] }],
            generationConfig: { temperature: 0.5, maxOutputTokens: 1000 }
          })
        });
        
        const data = await response.json();
        const jsonString = data.candidates[0].content.parts[0].text;
        const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Could not extract valid JSON from AI response");
        }
      } else {
        return res.status(500).json({ error: "No AI API keys available" });
      }

      if (!result.subject || !result.body) {
        throw new Error("Invalid response format from AI service");
      }

      res.json(result);
    } catch (error) {
      console.error("Error in draft-email-response:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Analyze Sentiment
  app.post('/api/ai/analyze-sentiment', async (req, res) => {
    try {
      const { text, model } = req.body;
      
      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Invalid or missing text" });
      }
      
      const openaiApiKey = process.env.OPENAI_API_KEY;
      const googleApiKey = process.env.GOOGLE_AI_API_KEY;
      
      const useOpenAI = model?.toLowerCase().includes("gpt") || (!googleApiKey && openaiApiKey);
      
      let result;
      
      if (useOpenAI && openaiApiKey) {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openaiApiKey}`
          },
          body: JSON.stringify({
            model: model || "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "You are a sentiment analysis assistant. Analyze the sentiment of the given text and respond with a JSON object containing sentiment (positive, negative, or neutral), confidence score (0-100), and key emotional tones identified." },
              { role: "user", content: `Analyze the sentiment of this text: ${text}` }
            ],
            response_format: { type: "json_object" },
            max_tokens: 150,
            temperature: 0.2
          })
        });
        
        const data = await response.json();
        result = JSON.parse(data.choices[0].message.content);
      } else if (googleApiKey) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model || "gemini-1.5-flash"}:generateContent?key=${googleApiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Analyze the sentiment of this text and respond with a JSON object containing sentiment (positive, negative, or neutral), confidence score (0-100), and key emotional tones identified. Text: ${text}` }] }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 150 }
          })
        });
        
        const data = await response.json();
        const jsonString = data.candidates[0].content.parts[0].text;
        const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Could not extract valid JSON from AI response");
        }
      } else {
        return res.status(500).json({ error: "No AI API keys available" });
      }

      if (!result.sentiment) {
        result = {
          sentiment: result.sentiment || "neutral",
          score: result.confidence || result.score || 50,
          tones: result.tones || result.emotional_tones || []
        };
      }

      res.json(result);
    } catch (error) {
      console.error("Error in analyze-sentiment:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;
}
