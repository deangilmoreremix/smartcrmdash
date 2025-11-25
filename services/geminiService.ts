import { GoogleGenerativeAI } from '@google/generative-ai';
import { useApiStore } from '../store/apiStore';

// Custom hook for Gemini API integration
export function useGemini() {
  const { apiKeys } = useApiStore();
  const GEMINI_API_KEY = apiKeys.gemini;
  
  // Helper function to check if API key is available
  const checkApiKey = () => {
    if (!GEMINI_API_KEY) {
      return {
        error: 'Gemini API key is not configured. Please add your API key in the settings.',
        hasKey: false
      };
    }
    return { hasKey: true };
  };

  // Initialize AI only if key is available
  const initializeAI = () => {
    const keyCheck = checkApiKey();
    if (!keyCheck.hasKey) {
      return null;
    }
    
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      return genAI.getGenerativeModel({ model: "gemini-pro" });
    } catch (error) {
      console.error('Error initializing Gemini AI:', error);
      return null;
    }
  };

  // Generate a customer persona with structured output
  const generateCustomerPersona = async (industry: string, companySize: string, interests: string[]) => {
    const keyCheck = checkApiKey();
    if (!keyCheck.hasKey) {
      throw new Error(keyCheck.error);
    }

    const model = initializeAI();
    if (!model) {
      throw new Error('Failed to initialize Gemini AI model');
    }

    try {
      const prompt = `
        Generate a comprehensive customer persona for a ${companySize} company in the ${industry} industry.
        They are interested in: ${interests.join(', ')}.
        
        Return the response as a structured JSON object with the following format:
        {
          "businessGoals": ["goal1", "goal2", ...],
          "painPoints": ["painPoint1", "painPoint2", ...],
          "buyingPreferences": ["preference1", "preference2", ...],
          "commonObjections": ["objection1", "objection2", ...],
          "communicationStyle": "description of preferred communication style"
        }
        
        Respond ONLY with the JSON object, no additional text.
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const responseText = response.text();
      
      try {
        // Extract JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        // Fallback to returning the text if JSON parsing fails
        return responseText;
      } catch (error) {
        console.error('Error parsing JSON from Gemini response:', error);
        return responseText;
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  };

  // Analyze market trends with structured output
  const analyzeMarketTrends = async (industry: string, audience: string, timeframe: string) => {
    const keyCheck = checkApiKey();
    if (!keyCheck.hasKey) {
      throw new Error(keyCheck.error);
    }

    const model = initializeAI();
    if (!model) {
      throw new Error('Failed to initialize Gemini AI model');
    }

    try {
      const prompt = `
        Analyze market trends for the ${industry} industry, focusing on ${audience} for the ${timeframe}.
        
        Return the response as a structured JSON object with the following format:
        {
          "currentTrends": ["trend1", "trend2", ...],
          "opportunities": ["opportunity1", "opportunity2", ...],
          "challenges": ["challenge1", "challenge2", ...],
          "economicFactors": ["factor1", "factor2", ...],
          "predictions": ["prediction1", "prediction2", ...],
          "recommendations": ["recommendation1", "recommendation2", ...]
        }
        
        Respond ONLY with the JSON object, no additional text.
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const responseText = response.text();
      
      try {
        // Extract JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        // Fallback to returning the text if JSON parsing fails
        return responseText;
      } catch (error) {
        console.error('Error parsing JSON from Gemini response:', error);
        return responseText;
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  };

  // Optimize voice tone with structured output
  const optimizeVoiceTone = async (content: string, audience: string, purpose: string) => {
    const keyCheck = checkApiKey();
    if (!keyCheck.hasKey) {
      throw new Error(keyCheck.error);
    }

    const model = initializeAI();
    if (!model) {
      throw new Error('Failed to initialize Gemini AI model');
    }

    try {
      const prompt = `
        Optimize the following content for tone of voice:
        "${content}"
        
        Target audience: ${audience}
        Purpose: ${purpose}
        
        Return the response as a structured JSON object with the following format:
        {
          "optimizedContent": "the rewritten content",
          "toneAnalysis": {
            "original": "description of original tone",
            "optimized": "description of optimized tone"
          },
          "keyChanges": ["change1", "change2", ...]
        }
        
        Respond ONLY with the JSON object, no additional text.
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const responseText = response.text();
      
      try {
        // Extract JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        // Fallback to returning the text if JSON parsing fails
        return responseText;
      } catch (error) {
        console.error('Error parsing JSON from Gemini response:', error);
        return responseText;
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  };

  // Generate meeting agenda with structured output
  const generateMeetingAgenda = async (
    meetingPurpose: string,
    attendees: string[],
    previousNotes?: string
  ) => {
    const keyCheck = checkApiKey();
    if (!keyCheck.hasKey) {
      throw new Error(keyCheck.error);
    }

    const model = initializeAI();
    if (!model) {
      throw new Error('Failed to initialize Gemini AI model');
    }

    try {
      const prompt = `
        Create a detailed meeting agenda for "${meetingPurpose}" with the following attendees:
        ${attendees.map((a, i) => `${i + 1}. ${a}`).join('\n')}

        ${previousNotes ? `Previous meeting notes: ${previousNotes}` : ''}

        Return the response as a structured JSON object with the following format:
        {
          "title": "Meeting title",
          "timeAllocations": [
            {"topic": "topic1", "duration": "X minutes", "description": "description1"},
            {"topic": "topic2", "duration": "Y minutes", "description": "description2"},
            ...
          ],
          "discussionTopics": ["topic1", "topic2", ...],
          "actionItems": ["action1", "action2", ...],
          "preparationNotes": "notes for preparation"
        }
        
        Respond ONLY with the JSON object, no additional text.
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const responseText = response.text();
      
      try {
        // Extract JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        // Fallback to returning the text if JSON parsing fails
        return responseText;
      } catch (error) {
        console.error('Error parsing JSON from Gemini response:', error);
        return responseText;
      }
    } catch (error) {
      console.error('Gemini API error in meeting agenda generation:', error);
      throw error;
    }
  };

  // For real-time analysis with structured output
  const analyzeSentimentRealTime = async (text: string) => {
    const keyCheck = checkApiKey();
    if (!keyCheck.hasKey) {
      return {
        sentiment: 0,
        emotions: ['neutral'],
        keyPhrases: [],
        error: keyCheck.error
      };
    }

    const model = initializeAI();
    if (!model) {
      return {
        sentiment: 0,
        emotions: ['neutral'],
        keyPhrases: [],
        error: 'Failed to initialize Gemini AI model'
      };
    }

    try {
      const prompt = `
        Analyze the sentiment of the following text. 
        Return the response as a structured JSON object with the following format:
        {
          "sentiment": 0.0, // number between -1 and 1
          "emotions": ["emotion1", "emotion2", ...],
          "keyPhrases": ["phrase1", "phrase2", ...]
        }
        
        Text to analyze: "${text}"
        
        Respond ONLY with the JSON object, no additional text.
      `;
      
      const result = await model.generateContent(prompt);
      const response = result.response;
      const responseText = response.text();
      
      try {
        // Extract JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        
        // Fallback if JSON parsing fails
        return {
          sentiment: 0,
          emotions: ['neutral'],
          keyPhrases: []
        };
      } catch (error) {
        console.error('Error parsing JSON from Gemini response:', error);
        return {
          sentiment: 0,
          emotions: ['neutral'],
          keyPhrases: []
        };
      }
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return {
        sentiment: 0,
        emotions: ['neutral'],
        keyPhrases: []
      };
    }
  };

  // Access the underlying generative model instance directly
  const getGenerativeModel = ({ model }: { model: string }) => {
    const keyCheck = checkApiKey();
    if (!keyCheck.hasKey) {
      throw new Error(keyCheck.error);
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Always use gemini-pro if gemini-2.5-flash is requested
    if (model === 'gemini-2.5-flash') {
      return genAI.getGenerativeModel({ model: 'gemini-pro' });
    }
    return genAI.getGenerativeModel({ model });
  };

  // Generate email response with structured output
  const generateEmailResponse = async (
    originalEmail: string, 
    contactInfo: any, 
    dealContext?: string
  ) => {
    const keyCheck = checkApiKey();
    if (!keyCheck.hasKey) {
      throw new Error(keyCheck.error);
    }

    const model = initializeAI();
    if (!model) {
      throw new Error('Failed to initialize Gemini AI model');
    }

    try {
      const prompt = `
        Generate a professional response to the following email:
        "${originalEmail}"
        
        Contact information:
        ${contactInfo.name ? `Name: ${contactInfo.name}` : ''}
        ${contactInfo.position ? `Position: ${contactInfo.position}` : ''}
        ${contactInfo.company ? `Company: ${contactInfo.company}` : ''}
        
        ${dealContext ? `Context about our relationship: ${dealContext}` : ''}
        
        Return the response as a structured JSON object with the following format:
        {
          "subject": "suggested email subject",
          "greeting": "email greeting",
          "body": "main email body",
          "closing": "email closing",
          "signature": "email signature",
          "followUpSuggestion": "suggested follow-up action and timing"
        }
        
        Respond ONLY with the JSON object, no additional text.
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const responseText = response.text();
      
      try {
        // Extract JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        // Fallback to returning the text if JSON parsing fails
        return responseText;
      } catch (error) {
        console.error('Error parsing JSON from Gemini response:', error);
        return responseText;
      }
    } catch (error) {
      console.error('Gemini API error in email response generation:', error);
      throw error;
    }
  };

  // Generate personalization suggestions with structured output
  const suggestPersonalization = async (contact: any, previousInteractions: string[]) => {
    const keyCheck = checkApiKey();
    if (!keyCheck.hasKey) {
      throw new Error(keyCheck.error);
    }

    const model = initializeAI();
    if (!model) {
      throw new Error('Failed to initialize Gemini AI model');
    }

    try {
      const contactDetails = Object.entries(contact)
        .filter(([key, value]) => value !== undefined && key !== 'id')
        .map(([key, value]) => {
          if (key === 'lastContact' && value instanceof Date) {
            return `${key}: ${value.toISOString().split('T')[0]}`;
          }
          return `${key}: ${value}`;
        })
        .join('\n');
      
      const interactionsText = previousInteractions.length > 0 
        ? previousInteractions.map((interaction, idx) => `Interaction ${idx + 1}: ${interaction}`).join('\n\n')
        : "No previous interactions";
      
      const prompt = `
        Based on the following contact information and previous interactions, 
        suggest personalized talking points and approaches for effective communication:
        
        Contact Information:
        ${contactDetails}
        
        Previous Interactions:
        ${interactionsText}
        
        Return the response as a structured JSON object with the following format:
        {
          "insights": ["insight1", "insight2", ...],
          "recommendedTopics": ["topic1", "topic2", ...],
          "potentialPainPoints": ["painPoint1", "painPoint2", ...],
          "communicationStyle": "suggested communication style",
          "valuePropositions": ["proposition1", "proposition2", ...]
        }
        
        Respond ONLY with the JSON object, no additional text.
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const responseText = response.text();
      
      try {
        // Extract JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        // Fallback to returning the text if JSON parsing fails
        return responseText;
      } catch (error) {
        console.error('Error parsing JSON from Gemini response:', error);
        return responseText;
      }
    } catch (error) {
      console.error('Gemini API error in personalization suggestion:', error);
      throw error;
    }
  };

  // Generate objection handler with structured output
  const generateObjectionHandler = async (objection: string, productInfo: string) => {
    const keyCheck = checkApiKey();
    if (!keyCheck.hasKey) {
      throw new Error(keyCheck.error);
    }

    const model = initializeAI();
    if (!model) {
      throw new Error('Failed to initialize Gemini AI model');
    }

    try {
      const prompt = `
        Create a strategic response to handle the following sales objection:
        "${objection}"
        
        Product/Service Information:
        ${productInfo}
        
        Return the response as a structured JSON object with the following format:
        {
          "acknowledgement": "how to acknowledge the concern",
          "reframe": "how to reframe the objection",
          "evidence": "evidence to address the objection",
          "valueRedirection": "how to redirect to value",
          "nextQuestion": "question to continue the conversation"
        }
        
        Respond ONLY with the JSON object, no additional text.
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const responseText = response.text();
      
      try {
        // Extract JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        // Fallback to returning the text if JSON parsing fails
        return responseText;
      } catch (error) {
        console.error('Error parsing JSON from Gemini response:', error);
        return responseText;
      }
    } catch (error) {
      console.error('Gemini API error in objection handling:', error);
      throw error;
    }
  };

  // Validate form field with structured output
  const validateFormField = async (
    fieldName: string,
    fieldValue: string,
    formContext: string = 'general'
  ) => {
    const keyCheck = checkApiKey();
    if (!keyCheck.hasKey) {
      return {
        valid: true,
        message: "API key not configured - validation skipped"
      };
    }

    const model = initializeAI();
    if (!model) {
      return {
        valid: true,
        message: "Failed to initialize AI model - validation skipped"
      };
    }

    try {
      const prompt = `
        Validate the following form field in a ${formContext} context:
        Field name: ${fieldName}
        Value: "${fieldValue}"
        
        Return the response as a structured JSON object with the following format:
        {
          "valid": true/false,
          "message": "validation message or suggestion for improvement"
        }
        
        Respond ONLY with the JSON object, no additional text.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();
      
      try {
        // Extract JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        
        // Default return if no JSON is found
        return {
          valid: true,
          message: "Valid input"
        };
      } catch (e) {
        console.error("Failed to parse validation result:", e);
        return {
          valid: true,
          message: "Unable to validate"
        };
      }
    } catch (error) {
      console.error('Gemini API error in form validation:', error);
      return { valid: true, message: "Error validating field" };
    }
  };

  // Generate content with reasoning capabilities and structured output
  const generateContentWithReasoning = async (
    contentType: string,
    topic: string,
    audience: string,
    additionalContext?: string
  ) => {
    const keyCheck = checkApiKey();
    if (!keyCheck.hasKey) {
      throw new Error(keyCheck.error);
    }

    const model = initializeAI();
    if (!model) {
      throw new Error('Failed to initialize Gemini AI model');
    }

    try {
      const prompt = `
        Generate high-quality ${contentType} content about "${topic}" for ${audience}.
        
        Additional context: ${additionalContext || 'None provided'}
        
        Return the response as a structured JSON object with the following format:
        {
          "reasoning": {
            "audienceAnalysis": "analysis of audience needs",
            "structureRationale": "reasoning for content structure",
            "keyPointsRationale": "why these key points were chosen",
            "toneConsiderations": "tone and style considerations"
          },
          "content": {
            "title": "content title",
            "body": "full content body",
            "callToAction": "suggested call to action"
          }
        }
        
        Respond ONLY with the JSON object, no additional text.
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const responseText = response.text();
      
      try {
        // Extract JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        // Fallback to returning the text if JSON parsing fails
        return responseText;
      } catch (error) {
        console.error('Error parsing JSON from Gemini response:', error);
        return responseText;
      }
    } catch (error) {
      console.error('Gemini API error in content generation with reasoning:', error);
      throw error;
    }
  };

  // Generate blog post with reasoning and structured output
  const generateBlogPostWithReasoning = async (
    topic: string,
    targetAudience: string,
    keyPoints: string[],
    tone: string = 'professional'
  ) => {
    const keyCheck = checkApiKey();
    if (!keyCheck.hasKey) {
      throw new Error(keyCheck.error);
    }

    const model = initializeAI();
    if (!model) {
      throw new Error('Failed to initialize Gemini AI model');
    }

    try {
      const prompt = `
        Generate a comprehensive blog post about "${topic}" for ${targetAudience}.
        
        Key points to include:
        ${keyPoints.map((point, index) => `${index + 1}. ${point}`).join('\n')}
        
        Tone: ${tone}
        
        Return the response as a structured JSON object with the following format:
        {
          "reasoning": {
            "audienceRelevance": "why this topic matters to the audience",
            "structureStrategy": "reasoning for blog structure",
            "headlineApproach": "approach to creating compelling headline",
            "supportingEvidence": "types of evidence used"
          },
          "blogPost": {
            "headline": "blog post headline",
            "introduction": "introduction paragraph",
            "sections": [
              {"heading": "section1 heading", "content": "section1 content"},
              {"heading": "section2 heading", "content": "section2 content"}
            ],
            "conclusion": "conclusion paragraph",
            "callToAction": "call to action"
          }
        }
        
        Respond ONLY with the JSON object, no additional text.
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const responseText = response.text();
      
      try {
        // Extract JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        // Fallback to returning the text if JSON parsing fails
        return responseText;
      } catch (error) {
        console.error('Error parsing JSON from Gemini response:', error);
        return responseText;
      }
    } catch (error) {
      console.error('Gemini API error in blog post generation:', error);
      throw error;
    }
  };

  // Generate social media content with reasoning and structured output
  const generateSocialMediaWithReasoning = async (
    platform: 'linkedin' | 'twitter' | 'facebook' | 'instagram',
    topic: string,
    purpose: string,
    brandVoice: string
  ) => {
    const keyCheck = checkApiKey();
    if (!keyCheck.hasKey) {
      throw new Error(keyCheck.error);
    }

    const model = initializeAI();
    if (!model) {
      throw new Error('Failed to initialize Gemini AI model');
    }

    try {
      const prompt = `
        Generate engaging social media content for ${platform} about "${topic}".
        
        Purpose: ${purpose}
        Brand voice: ${brandVoice}
        
        Return the response as a structured JSON object with the following format:
        {
          "reasoning": {
            "platformConsiderations": "what works well on ${platform}",
            "formatRationale": "reasoning for format and length",
            "attentionStrategy": "strategy for grabbing attention",
            "engagementApproach": "approach to maximize engagement"
          },
          "content": {
            "post": "complete social media post",
            "hashtags": ["hashtag1", "hashtag2", ...],
            "bestTimeToPost": "recommended posting time",
            "estimatedEngagement": "engagement prediction"
          }
        }
        
        Respond ONLY with the JSON object, no additional text.
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const responseText = response.text();
      
      try {
        // Extract JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        // Fallback to returning the text if JSON parsing fails
        return responseText;
      } catch (error) {
        console.error('Error parsing JSON from Gemini response:', error);
        return responseText;
      }
    } catch (error) {
      console.error('Gemini API error in social media generation:', error);
      throw error;
    }
  };

  // Generate email campaign with reasoning and structured output
  const generateEmailCampaignWithReasoning = async (
    campaignType: string,
    audience: string,
    productInfo: string,
    goal: string
  ) => {
    const keyCheck = checkApiKey();
    if (!keyCheck.hasKey) {
      throw new Error(keyCheck.error);
    }

    const model = initializeAI();
    if (!model) {
      throw new Error('Failed to initialize Gemini AI model');
    }

    try {
      const prompt = `
        Generate a complete email campaign for a ${campaignType} targeting ${audience}.
        
        Product/Service Information:
        ${productInfo}
        
        Campaign Goal: ${goal}
        
        Return the response as a structured JSON object with the following format:
        {
          "reasoning": {
            "audienceMotivation": "what motivates this audience",
            "subjectLineStrategy": "strategy for compelling subject lines",
            "emailStructure": "reasoning for email structure",
            "followUpStrategy": "follow-up timing and approach"
          },
          "campaign": {
            "subjectLines": ["subject1", "subject2", "subject3"],
            "emailBody": "complete email body",
            "recommendedSendTime": "best time to send",
            "followUpPlan": "follow-up strategy details"
          }
        }
        
        Respond ONLY with the JSON object, no additional text.
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const responseText = response.text();
      
      try {
        // Extract JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        // Fallback to returning the text if JSON parsing fails
        return responseText;
      } catch (error) {
        console.error('Error parsing JSON from Gemini response:', error);
        return responseText;
      }
    } catch (error) {
      console.error('Gemini API error in email campaign generation:', error);
      throw error;
    }
  };

  // Generate sales script with reasoning and structured output
  const generateSalesScriptWithReasoning = async (
    productName: string,
    targetCustomer: string,
    painPoints: string[],
    competitiveAdvantages: string[]
  ) => {
    const keyCheck = checkApiKey();
    if (!keyCheck.hasKey) {
      throw new Error(keyCheck.error);
    }

    const model = initializeAI();
    if (!model) {
      throw new Error('Failed to initialize Gemini AI model');
    }

    try {
      const prompt = `
        Generate a comprehensive sales script for ${productName} targeting ${targetCustomer}.
        
        Customer Pain Points:
        ${painPoints.map((point, index) => `${index + 1}. ${point}`).join('\n')}
        
        Our Competitive Advantages:
        ${competitiveAdvantages.map((advantage, index) => `${index + 1}. ${advantage}`).join('\n')}
        
        Return the response as a structured JSON object with the following format:
        {
          "reasoning": {
            "openingStrategy": "reasoning for opening approach",
            "discoveryQuestions": "approach to discovery questions",
            "valuePropositionRationale": "reasoning for value proposition",
            "objectionHandlingStrategy": "approach to handling objections",
            "closingStrategy": "reasoning for closing approach"
          },
          "script": {
            "opening": "script opening",
            "discoveryQuestions": ["question1", "question2", ...],
            "valueProposition": "value proposition script",
            "objectionHandling": {
              "objection1": "response1",
              "objection2": "response2"
            },
            "closing": "closing script"
          }
        }
        
        Respond ONLY with the JSON object, no additional text.
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const responseText = response.text();
      
      try {
        // Extract JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        // Fallback to returning the text if JSON parsing fails
        return responseText;
      } catch (error) {
        console.error('Error parsing JSON from Gemini response:', error);
        return responseText;
      }
    } catch (error) {
      console.error('Gemini API error in sales script generation:', error);
      throw error;
    }
  };

  // Generic reasoning generator with structured output
  const generateReasoning = async (prompt: string) => {
    const keyCheck = checkApiKey();
    if (!keyCheck.hasKey) {
      throw new Error(keyCheck.error);
    }

    const model = initializeAI();
    if (!model) {
      throw new Error('Failed to initialize Gemini AI model');
    }

    try {
      const structuredPrompt = `
        ${prompt}
        
        Return the response as a structured JSON object with the following format:
        {
          "reasoning": "detailed explanation of the reasoning",
          "keyPoints": ["point1", "point2", ...],
          "strategicConsiderations": ["consideration1", "consideration2", ...],
          "recommendations": ["recommendation1", "recommendation2", ...]
        }
        
        Respond ONLY with the JSON object, no additional text.
      `;

      const result = await model.generateContent(structuredPrompt);
      const response = await result.response;
      const responseText = response.text();
      
      try {
        // Extract JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        // Fallback to returning the text if JSON parsing fails
        return responseText;
      } catch (error) {
        console.error('Error parsing JSON from Gemini response:', error);
        return responseText;
      }
    } catch (error) {
      console.error('Gemini API reasoning error:', error);
      throw error;
    }
  };

  // Add a function to check if the service is available
  const isAvailable = () => {
    return Boolean(GEMINI_API_KEY);
  };

  return {
    generateCustomerPersona,
    optimizeVoiceTone,
    generateMeetingAgenda,
    analyzeSentimentRealTime,
    getGenerativeModel,
    analyzeMarketTrends,
    generateEmailResponse,
    suggestPersonalization,
    generateObjectionHandler,
    validateFormField,
    // New reasoning-based content generation functions
    generateContentWithReasoning,
    generateBlogPostWithReasoning,
    generateSocialMediaWithReasoning,
    generateEmailCampaignWithReasoning,
    generateSalesScriptWithReasoning,
    generateReasoning,
    // Utility functions
    isAvailable,
    checkApiKey
  };
}