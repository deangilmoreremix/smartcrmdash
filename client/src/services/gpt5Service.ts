import OpenAI from 'openai';

// GPT-5 Enhanced Service for AI Dashboard Components
export class GPT5Service {
  private openai: OpenAI | null = null;
  private isConfigured = false;

  constructor() {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (apiKey && apiKey !== 'your_openai_api_key' && apiKey.length > 10) {
      this.openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true
      });
      this.isConfigured = true;
    }
  }

  private checkApiKey(): boolean {
    return this.isConfigured && this.openai !== null;
  }

  /**
   * GPT-5 Expert-Level Greeting Generation
   * Leverages GPT-5's unified reasoning system for strategic insights
   */
  async generateSmartGreeting(userMetrics: any, timeOfDay: string, recentActivity: any) {
    if (!this.checkApiKey()) {
      return {
        greeting: `Good ${timeOfDay}! You have ${userMetrics.totalDeals} deals worth $${userMetrics.totalValue.toLocaleString()} in your pipeline.`,
        insight: 'Configure OpenAI API key to enable GPT-5 enhanced insights.'
      };
    }

    try {
      const response = await this.openai!.chat.completions.create({
        model: "gpt-5", // Using GPT-5's most advanced capabilities
        messages: [{
          role: "system",
          content: "You are GPT-5, an expert-level AI sales consultant with breakthrough analytical capabilities. Generate a personalized, strategically-aware greeting for a sales professional. Leverage your unified reasoning system to automatically determine whether to provide quick insights or deep strategic analysis. Use your expert-level understanding across business domains to identify high-value opportunities and provide actionable strategic recommendations."
        }, {
          role: "user", 
          content: JSON.stringify({ 
            userMetrics, 
            timeOfDay, 
            recentActivity,
            requestType: "strategic_greeting" // GPT-5 router optimization
          })
        }],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 800,
        // GPT-5 unified system features
        stream: false
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('GPT-5 Greeting Generation Error:', error);
      throw new Error('Failed to generate smart greeting with GPT-5');
    }
  }

  /**
   * GPT-5 Expert-Level KPI Analysis
   * 94.6% AIME accuracy for mathematical forecasting
   */
  async analyzeKPITrends(historicalData: any, currentMetrics: any, chartImages: string[] = [], videoData: string[] = []) {
    if (!this.checkApiKey()) {
      return {
        summary: 'Your KPI trends show steady performance. Configure OpenAI API key for detailed GPT-5 analysis.',
        recommendations: ['Set up API credentials', 'Enable advanced analytics']
      };
    }

    try {
      const messages: any[] = [{
        role: "system", 
        content: "You are GPT-5, with expert-level analytical capabilities across mathematics (94.6% AIME accuracy) and multimodal reasoning (84.2% MMMU accuracy). Analyze KPI trends using your unified reasoning system. Automatically determine whether to use quick analysis or deep reasoning based on data complexity. Provide multi-scenario forecasting with expert-level confidence intervals, risk assessments, and strategic recommendations at the level of a senior business consultant."
      }, {
        role: "user",
        content: [
          {
            type: "text",
            text: `Historical Data: ${JSON.stringify(historicalData)}\nCurrent Metrics: ${JSON.stringify(currentMetrics)}\nAnalysis Type: Expert-Level Forecasting`
          },
          // GPT-5 advanced multimodal capabilities
          ...chartImages.map(image => ({
            type: "image_url",
            image_url: { url: image, detail: "high" }
          }))
        ]
      }];

      const response = await this.openai.chat.completions.create({
        model: "gpt-5",
        messages,
        response_format: { type: "json_object" },
        temperature: 0.2, // Optimal for analytical precision
        max_tokens: 2500,
        tools: [
          {
            type: "function",
            function: {
              name: "advanced_mathematical_modeling",
              description: "Leverage GPT-5's mathematical expertise for complex forecasting",
              parameters: {
                type: "object",
                properties: {
                  scenarios: { type: "array", description: "Multiple forecasting scenarios" },
                  confidence_intervals: { type: "array", description: "Statistical confidence ranges" },
                  risk_factors: { type: "array", description: "Identified risk elements" }
                }
              }
            }
          },
          {
            type: "function", 
            function: {
              name: "expert_risk_assessment",
              description: "Apply expert-level risk analysis across business domains",
              parameters: {
                type: "object",
                properties: {
                  risk_level: { type: "string", enum: ["low", "medium", "high", "critical"] },
                  mitigation_strategies: { type: "array", description: "Risk mitigation recommendations" }
                }
              }
            }
          },
          {
            type: "function",
            function: {
              name: "strategic_recommendations",
              description: "Generate consultant-level strategic recommendations",
              parameters: {
                type: "object",
                properties: {
                  priority_actions: { type: "array", description: "High-priority strategic actions" },
                  expected_outcomes: { type: "array", description: "Predicted business outcomes" }
                }
              }
            }
          }
        ]
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('GPT-5 KPI Analysis Error:', error);
      throw new Error('Failed to analyze KPI trends with GPT-5');
    }
  }

  /**
   * GPT-5 Advanced Deal Intelligence
   * Leverages 74.9% SWE-bench accuracy for complex reasoning
   */
  async analyzeDealIntelligence(dealData: any, contactHistory: any, marketContext: any) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-5",
        messages: [{
          role: "system",
          content: "You are GPT-5 with expert-level sales intelligence capabilities. Analyze deal data using your advanced reasoning system to provide strategic insights, probability assessments, and actionable recommendations. Apply your multi-domain expertise to identify patterns, risks, and opportunities."
        }, {
          role: "user",
          content: JSON.stringify({
            dealData,
            contactHistory,
            marketContext,
            analysisType: "comprehensive_deal_intelligence"
          })
        }],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 2000,
        tools: [
          {
            type: "function",
            function: {
              name: "deal_probability_scoring",
              description: "Expert-level deal probability assessment",
              parameters: {
                type: "object",
                properties: {
                  probability_score: { type: "number", description: "Deal close probability (0-1)" },
                  confidence_level: { type: "string", enum: ["low", "medium", "high"] },
                  key_factors: { type: "array", description: "Primary influencing factors" }
                }
              }
            }
          }
        ]
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('GPT-5 Deal Intelligence Error:', error);
      throw new Error('Failed to analyze deal intelligence with GPT-5');
    }
  }

  /**
   * GPT-5 Advanced Content Generation
   * Utilizes superior writing capabilities for professional content
   */
  async generateAdvancedContent(contentType: string, context: any, requirements: any) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-5",
        messages: [{
          role: "system",
          content: "You are GPT-5 with breakthrough writing and creative capabilities. Generate professional, compelling content that resonates with the target audience. Use your advanced understanding of business communication, literary depth, and persuasive writing to create impactful content."
        }, {
          role: "user",
          content: JSON.stringify({
            contentType,
            context,
            requirements,
            qualityLevel: "expert_professional"
          })
        }],
        response_format: { type: "json_object" },
        temperature: 0.6,
        max_tokens: 1500
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('GPT-5 Content Generation Error:', error);
      throw new Error('Failed to generate content with GPT-5');
    }
  }

  /**
   * GPT-5 Multimodal Analysis
   * Leverages 84.2% MMMU accuracy for visual understanding
   */
  async analyzeMultimodalData(textData: any, images: string[], analysisType: string) {
    try {
      const messages: any[] = [{
        role: "system",
        content: "You are GPT-5 with advanced multimodal reasoning capabilities (84.2% MMMU accuracy). Analyze both textual and visual data to provide comprehensive insights. Use your superior pattern recognition to identify correlations, trends, and actionable intelligence across multiple data modalities."
      }, {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analysis Type: ${analysisType}\nText Data: ${JSON.stringify(textData)}`
          },
          ...images.map(image => ({
            type: "image_url",
            image_url: { url: image, detail: "high" }
          }))
        ]
      }];

      const response = await this.openai.chat.completions.create({
        model: "gpt-5",
        messages,
        response_format: { type: "json_object" },
        temperature: 0.4,
        max_tokens: 2000
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('GPT-5 Multimodal Analysis Error:', error);
      throw new Error('Failed to analyze multimodal data with GPT-5');
    }
  }

  /**
   * GPT-5 Strategic Business Intelligence
   * Expert-level business analysis across 40+ domains
   */
  async generateBusinessIntelligence(businessData: any, industryContext: any, objectives: string[]) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-5",
        messages: [{
          role: "system",
          content: "You are GPT-5 with expert-level business intelligence capabilities across 40+ professional domains. Analyze business data to provide strategic insights, competitive intelligence, and growth recommendations. Apply your unified reasoning system to deliver consultant-quality business analysis."
        }, {
          role: "user",
          content: JSON.stringify({
            businessData,
            industryContext,
            objectives,
            analysisLevel: "strategic_consultant"
          })
        }],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 2500,
        tools: [
          {
            type: "function",
            function: {
              name: "strategic_analysis",
              description: "Expert-level strategic business analysis",
              parameters: {
                type: "object",
                properties: {
                  strategic_recommendations: { type: "array", description: "High-level strategic recommendations" },
                  market_opportunities: { type: "array", description: "Identified market opportunities" },
                  competitive_advantages: { type: "array", description: "Potential competitive advantages" },
                  risk_mitigation: { type: "array", description: "Business risk mitigation strategies" }
                }
              }
            }
          }
        ]
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('GPT-5 Business Intelligence Error:', error);
      throw new Error('Failed to generate business intelligence with GPT-5');
    }
  }

  /**
   * GPT-5 Real-Time Decision Support
   * Leverages unified reasoning system for adaptive responses
   */
  async provideDecisionSupport(decisionContext: any, options: any[], criteria: any, urgency: 'low' | 'medium' | 'high') {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-5",
        messages: [{
          role: "system",
          content: `You are GPT-5 with unified reasoning capabilities. Provide expert-level decision support based on the urgency level: ${urgency}. Use quick reasoning for low urgency, balanced analysis for medium, and deep reasoning for high urgency decisions. Apply your multi-domain expertise to evaluate options and provide strategic recommendations.`
        }, {
          role: "user",
          content: JSON.stringify({
            decisionContext,
            options,
            criteria,
            urgency,
            requestType: "decision_support"
          })
        }],
        response_format: { type: "json_object" },
        temperature: 0.2,
        max_tokens: 1800
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('GPT-5 Decision Support Error:', error);
      throw new Error('Failed to provide decision support with GPT-5');
    }
  }
}

// Export singleton instance
export const gpt5Service = new GPT5Service();
export default gpt5Service;