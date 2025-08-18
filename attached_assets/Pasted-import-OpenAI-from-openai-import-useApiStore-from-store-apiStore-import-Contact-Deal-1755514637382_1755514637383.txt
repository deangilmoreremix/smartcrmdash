import OpenAI from 'openai';
import { useApiStore } from '../store/apiStore';
import { Contact, Deal } from '../types';

export const useOpenAI = () => {
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
  
  const generateEmailDraft = async (contactName: string, purpose: string, additionalContext?: string) => {
    const client = getClient();
    
    const response = await client.chat.completions.create({
      model: "gpt-4o", // Updated from gpt-4.1
      messages: [
        {
          role: "system",
          content: "You are an AI assistant helping a sales representative draft professional, highly personalized emails."
        },
        {
          role: "user",
          content: `Draft a professional email to ${contactName} for the following purpose: ${purpose}. ${additionalContext || ''} Keep it concise, friendly, and professional with a clear call-to-action.`
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });
    
    return response.choices[0].message.content || 'Unable to generate email';
  };
  
  const optimizeSubjectLine = async (purpose: string, audience: string, keyMessage: string) => {
    const client = getClient();
    
    const response = await client.chat.completions.create({
      model: "gpt-4o", // Updated from gpt-4.1
      messages: [
        {
          role: "system",
          content: "You are an AI assistant specializing in crafting high-converting email subject lines."
        },
        {
          role: "user",
          content: `Generate 5 high-converting email subject lines for a ${purpose} email targeted at ${audience} with the key message about "${keyMessage}". 
          
          For each subject line:
          1. Provide the subject line
          2. Explain why it would be effective
          3. Estimate its potential open rate (%)
          4. Suggest the best time to send emails with this subject
          5. Include a brief tip on how to optimize the email body for this subject`
        }
      ],
      max_tokens: 600,
      temperature: 0.8,
    });
    
    return response.choices[0].message.content || 'Unable to generate subject lines';
  };
  
  const analyzeSentiment = async (text: string) => {
    const client = getClient();
    
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // Updated from gpt-4.1 to mini for less complex tasks
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that analyzes the sentiment and key insights of customer messages."
        },
        {
          role: "user",
          content: `Analyze the sentiment, key topics, and actionable insights of the following customer text: "${text}"`
        }
      ],
      max_tokens: 300,
      temperature: 0.3,
    });
    
    return response.choices[0].message.content || 'Unable to analyze sentiment';
  };
  
  const predictLeadScore = async (contact: Partial<Contact>) => {
    const client = getClient();
    
    // Prepare contact data for analysis
    const contactDetails = Object.entries(contact)
      .filter(([key, value]) => value !== undefined && key !== 'id')
      .map(([key, value]) => {
        if (key === 'lastContact' && value instanceof Date) {
          return `${key}: ${value.toISOString().split('T')[0]}`;
        }
        return `${key}: ${value}`;
      })
      .join('\n');
    
    const response = await client.chat.completions.create({
      model: "gpt-4o", // Updated from gpt-4.1
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that analyzes lead information and provides a lead score from 0-100 
          based on their likelihood to convert. Higher scores indicate better leads.
          Consider factors like position, company size, engagement level, and previous interactions.`
        },
        {
          role: "user",
          content: `Analyze the following lead information and provide a lead score (0-100) with a detailed explanation.
          Also include key strengths, areas of opportunity, and specific recommendations for the sales rep.
          
          ${contactDetails}`
        }
      ],
      max_tokens: 500,
      temperature: 0.4,
    });
    
    return response.choices[0].message.content || 'Unable to predict lead score';
  };
  
  const analyzeCustomerEmail = async (emailContent: string) => {
    const client = getClient();
    
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // Updated from gpt-4.1 to mini for less complex tasks
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that analyzes customer emails to extract key insights. 
          Identify: 
          1. Key topics and concerns
          2. Sentiment (positive, neutral, negative)
          3. Urgency level
          4. Action items and follow-up needed
          5. Questions that need answers
          6. Decision stage indicators
          7. Recommended response approach`
        },
        {
          role: "user",
          content: `Analyze the following customer email and extract key insights:
          
          "${emailContent}"`
        }
      ],
      max_tokens: 600,
      temperature: 0.3,
    });
    
    return response.choices[0].message.content || 'Unable to analyze email';
  };

  const generateMeetingSummary = async (transcript: string) => {
    const client = getClient();
    
    const response = await client.chat.completions.create({
      model: "gpt-4o", // Updated from gpt-4.1
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that summarizes sales meetings and calls. 
          For each transcript, extract:
          1. Key discussion points
          2. Customer pain points and needs
          3. Objections raised
          4. Action items for follow-up (be very specific with each task)
          5. Decision makers involved
          6. Next steps agreed upon
          7. Overall sentiment and interest level`
        },
        {
          role: "user",
          content: `Summarize the following meeting transcript. Format the summary with clear headings and bullet points:
          
          "${transcript}"`
        }
      ],
      max_tokens: 800,
      temperature: 0.4,
    });
    
    return response.choices[0].message.content || 'Unable to generate meeting summary';
  };
  
  // Smart Proposal Generator
  const generateProposal = async (contact: Partial<Contact>, dealDetails: string, previousInteractions: string[]) => {
    const client = getClient();
    
    // Prepare contact data
    const contactDetails = Object.entries(contact)
      .filter(([key, value]) => value !== undefined && key !== 'id')
      .map(([key, value]) => {
        if (key === 'lastContact' && value instanceof Date) {
          return `${key}: ${value.toISOString().split('T')[0]}`;
        }
        return `${key}: ${value}`;
      })
      .join('\n');
    
    // Format previous interactions
    const interactionsText = previousInteractions.length > 0 
      ? previousInteractions.map((interaction, idx) => `Interaction ${idx + 1}: ${interaction}`).join('\n\n')
      : "No previous interactions";
    
    const response = await client.chat.completions.create({
      model: "gpt-4o", // Updated from gpt-4.1
      messages: [
        {
          role: "system",
          content: `You are an expert sales proposal generator. You create personalized, compelling sales proposals
          that address client needs and highlight value propositions. Your proposals should include:
          1. Executive Summary
          2. Understanding of client needs
          3. Proposed solution
          4. Pricing options
          5. Timeline
          6. Next steps`
        },
        {
          role: "user",
          content: `Generate a professional sales proposal for the following contact and deal information:
          
          Client information:
          ${contactDetails}
          
          Deal details:
          ${dealDetails}
          
          Previous interactions:
          ${interactionsText}
          
          Create a complete, ready-to-present sales proposal.`
        }
      ],
      max_tokens: 1500,
      temperature: 0.5,
    });
    
    return response.choices[0].message.content || 'Unable to generate proposal';
  };
  
  // Call Script Generator
  const generateCallScript = async (contact: Partial<Contact>, callPurpose: string, previousInteractions: string[]) => {
    const client = getClient();
    
    // Prepare contact data
    const contactDetails = Object.entries(contact)
      .filter(([key, value]) => value !== undefined && key !== 'id')
      .map(([key, value]) => {
        if (key === 'lastContact' && value instanceof Date) {
          return `${key}: ${value.toISOString().split('T')[0]}`;
        }
        return `${key}: ${value}`;
      })
      .join('\n');
    
    // Format previous interactions
    const interactionsText = previousInteractions.length > 0 
      ? previousInteractions.map((interaction, idx) => `Interaction ${idx + 1}: ${interaction}`).join('\n\n')
      : "No previous interactions";
    
    const response = await client.chat.completions.create({
      model: "gpt-4o", // Updated from gpt-4.1
      messages: [
        {
          role: "system",
          content: `You are an expert sales call script generator. You create personalized call scripts
          that are conversational, address client needs, and guide sales representatives through effective calls.
          Include opening, key talking points, questions to ask, objection handling, and closing.`
        },
        {
          role: "user",
          content: `Generate a sales call script for a conversation with the following contact:
          
          Contact information:
          ${contactDetails}
          
          Call purpose:
          ${callPurpose}
          
          Previous interactions:
          ${interactionsText}
          
          Create a structured call script with opening, key topics to discuss, questions to ask,
          potential objections with responses, and closing.`
        }
      ],
      max_tokens: 1000,
      temperature: 0.6,
    });
    
    return response.choices[0].message.content || 'Unable to generate call script';
  };
  
  // Sales Forecast Generator
  const generateSalesForecast = async (deals: Partial<Deal>[], timeframe: string) => {
    const client = getClient();
    
    // Prepare deals data
    const dealsData = deals.map((deal, index) => {
      return `Deal ${index + 1}:
      ${Object.entries(deal)
        .filter(([key, value]) => value !== undefined && key !== 'id')
        .map(([key, value]) => {
          if (key.includes('Date') && value instanceof Date) {
            return `${key}: ${value.toISOString().split('T')[0]}`;
          }
          return `${key}: ${value}`;
        })
        .join('\n      ')}`;
    }).join('\n\n');
    
    const response = await client.chat.completions.create({
      model: "gpt-4o", // Updated from gpt-4.1
      messages: [
        {
          role: "system",
          content: `You are an expert sales forecasting AI. You analyze pipeline data to predict:
          1. Revenue projections
          2. Deal closure probabilities
          3. Risk factors
          4. Conversion rates
          5. Recommendations for improving forecast accuracy
          6. Specific actions to accelerate deals`
        },
        {
          role: "user",
          content: `Generate a sales forecast for the following deals over a ${timeframe} period:
          
          ${dealsData}
          
          Provide revenue projections, probability-weighted forecasts, risk analysis, and actionable recommendations.
          Format your response with clear sections, bullet points, and highlight the most important insights.`
        }
      ],
      max_tokens: 1200,
      temperature: 0.5,
    });
    
    return response.choices[0].message.content || 'Unable to generate sales forecast';
  };
  
  // Competitive Analysis
  const analyzeCompetitor = async (competitorName: string, industry: string, strengths: string[]) => {
    const client = getClient();
    
    const strengthsText = strengths.map((strength, idx) => `${idx + 1}. ${strength}`).join('\n');
    
    const response = await client.chat.completions.create({
      model: "gpt-4o", // Updated from gpt-4.1
      messages: [
        {
          role: "system",
          content: `You are an expert competitive intelligence analyst. You provide strategic insights on competitors including:
          1. Competitor strengths and weaknesses
          2. Differentiation points
          3. Competitive positioning
          4. Strategies for competing effectively
          5. How to address competitor objections`
        },
        {
          role: "user",
          content: `Analyze the following competitor for a competitive intelligence briefing:
          
          Competitor: ${competitorName}
          Industry: ${industry}
          
          Our key strengths:
          ${strengthsText}
          
          Provide a comprehensive competitive analysis including strengths, weaknesses,
          differentiation strategy, and how to position against this competitor.
          Format your analysis with clear sections and actionable insights.`
        }
      ],
      max_tokens: 1000,
      temperature: 0.5,
    });
    
    return response.choices[0].message.content || 'Unable to analyze competitor';
  };
  
  // Visual Content Idea Generator
  const generateVisualContentIdea = async (contentType: string, industry: string, keyPoints: string[]) => {
    const client = getClient();
    
    const keyPointsText = keyPoints.map((point, idx) => `${idx + 1}. ${point}`).join('\n');
    
    const response = await client.chat.completions.create({
      model: "gpt-4o", // Updated from gpt-4.1
      messages: [
        {
          role: "system",
          content: `You are an expert in visual content creation for sales and marketing. You help create detailed 
          descriptions for visual assets like infographics, presentations, comparison charts, and social media graphics.`
        },
        {
          role: "user",
          content: `Create a detailed description for a ${contentType} visual asset for a company in the ${industry} industry.
          
          The visual should represent the following key points:
          ${keyPointsText}
          
          Provide:
          1. A detailed visual description
          2. Suggested layout and design elements
          3. Color scheme recommendations
          4. Key messaging to include
          5. How this visual asset will benefit sales conversations`
        }
      ],
      max_tokens: 800,
      temperature: 0.7,
    });
    
    return response.choices[0].message.content || 'Unable to generate visual content idea';
  };
  
  // Market Trend Analysis
  const analyzeMarketTrends = async (industry: string, targetMarket: string, timeframe: string) => {
    const client = getClient();
    
    const response = await client.chat.completions.create({
      model: "gpt-4o", // Updated from gpt-4.1
      messages: [
        {
          role: "system",
          content: `You are an expert market research analyst specializing in identifying trends, 
          opportunities and threats in various industries. Your analysis is used by sales teams to 
          stay informed and adapt their strategies.`
        },
        {
          role: "user",
          content: `Analyze current market trends in the ${industry} industry for the ${targetMarket} market over the ${timeframe} timeframe.
          
          Provide:
          1. Key market trends and shifts
          2. Emerging opportunities for sales
          3. Potential threats or challenges
          4. Technological disruptions affecting the market
          5. Regulatory considerations
          6. Actionable recommendations for sales and business development
          
          Format your analysis with clear sections and specific actionable insights that sales representatives can use when speaking with prospects.`
        }
      ],
      max_tokens: 1000,
      temperature: 0.6,
    });
    
    return response.choices[0].message.content || 'Unable to analyze market trends';
  };
  
  // Deal Analysis
  const analyzeDeal = async (dealData: any) => {
    const client = getClient();

    // Format deal data
    const dealDetails = Object.entries(dealData)
      .filter(([key, value]) => value !== undefined && key !== 'id')
      .map(([key, value]) => {
        if (key === 'dueDate' && value instanceof Date) {
          return `${key}: ${value.toISOString().split('T')[0]}`;
        }
        return `${key}: ${value}`;
      })
      .join('\n');

    const response = await client.chat.completions.create({
      model: "gpt-4o", // Updated from gpt-4.1
      messages: [
        {
          role: "system",
          content: `You are an AI sales strategist, analyzing sales opportunities and providing strategic insights.
          You help sales representatives understand win probability, risk factors, and recommended actions.`
        },
        {
          role: "user",
          content: `Analyze this sales opportunity and provide strategic insights:

          Deal Information:
          ${dealDetails}

          Please provide:
          1. Estimated win probability (%) with rationale
          2. Key risk factors to mitigate
          3. Potential upsell/cross-sell opportunities
          4. Recommended negotiation strategy
          5. Specific action items to move this deal forward
          6. Competitive positioning suggestions`
        }
      ],
      max_tokens: 1000,
      temperature: 0.5,
    });

    return response.choices[0].message.content || 'Unable to analyze deal';
  };
  
  return {
    generateEmailDraft,
    optimizeSubjectLine,
    analyzeSentiment,
    predictLeadScore,
    analyzeCustomerEmail,
    generateMeetingSummary,
    generateProposal,
    generateCallScript,
    generateSalesForecast,
    analyzeCompetitor,
    generateVisualContentIdea,
    analyzeMarketTrends,
    analyzeDeal
  };
};