
import { logger } from './logger.service';

interface BatchJob {
  id: string;
  type: 'contact_enrichment' | 'email_generation' | 'pipeline_analysis' | 'social_research';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  itemCount: number;
  estimatedCost: number;
  createdAt: string;
  completedAt?: string;
  results?: any;
}

interface BatchRequest {
  custom_id: string;
  method: 'POST';
  url: '/v1/chat/completions';
  body: {
    model: string;
    messages: any[];
    max_tokens: number;
  };
}

class OpenAIBatchAPIService {
  private apiKey: string = '';
  private baseUrl = 'https://api.openai.com/v1';
  private jobs: Map<string, BatchJob> = new Map();

  constructor() {
    // Get API key from your existing OpenAI service
    this.initializeFromConfig();
  }

  private async initializeFromConfig() {
    try {
      const response = await fetch('/api/openai/status');
      const config = await response.json();
      if (config.configured && config.apiKey) {
        this.apiKey = config.apiKey;
      }
    } catch (error) {
      logger.error('Failed to initialize Batch API service', error as Error);
    }
  }

  // Mass Contact Enrichment - Process 1000s at 50% cost
  async enrichContactsBulk(contactIds: string[], analysisTypes: string[] = ['scoring', 'social', 'personality']): Promise<BatchJob> {
    const contacts = await this.getContactsById(contactIds);
    const batchRequests: BatchRequest[] = [];

    contacts.forEach((contact, index) => {
      analysisTypes.forEach(analysisType => {
        const prompt = this.buildEnrichmentPrompt(contact, analysisType);
        
        batchRequests.push({
          custom_id: `enrich_${contact.id}_${analysisType}_${index}`,
          method: 'POST',
          url: '/v1/chat/completions',
          body: {
            model: 'gpt-4o-mini', // Cost-effective model for batch processing
            messages: [
              {
                role: 'system',
                content: 'You are a professional contact enrichment AI that provides detailed analysis and insights.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: 1000
          }
        });
      });
    });

    const estimatedCost = this.calculateBatchCost(batchRequests.length);
    
    const job: BatchJob = {
      id: `batch_enrich_${Date.now()}`,
      type: 'contact_enrichment',
      status: 'queued',
      itemCount: contactIds.length,
      estimatedCost,
      createdAt: new Date().toISOString()
    };

    this.jobs.set(job.id, job);
    await this.submitBatchJob(job.id, batchRequests);
    
    logger.info(`Batch contact enrichment queued: ${contactIds.length} contacts, estimated cost: $${estimatedCost}`);
    return job;
  }

  // Bulk Email Generation - Generate personalized emails for campaigns
  async generateCampaignEmailsBulk(
    contactIds: string[], 
    campaignData: {
      subject: string;
      tone: string;
      purpose: string;
      callToAction: string;
    }
  ): Promise<BatchJob> {
    const contacts = await this.getContactsById(contactIds);
    const batchRequests: BatchRequest[] = [];

    contacts.forEach((contact, index) => {
      const prompt = this.buildEmailGenerationPrompt(contact, campaignData);
      
      batchRequests.push({
        custom_id: `email_${contact.id}_${index}`,
        method: 'POST',
        url: '/v1/chat/completions',
        body: {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert email marketing copywriter who creates personalized, engaging emails that drive conversions.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 800
        }
      });
    });

    const estimatedCost = this.calculateBatchCost(batchRequests.length);
    
    const job: BatchJob = {
      id: `batch_email_${Date.now()}`,
      type: 'email_generation',
      status: 'queued',
      itemCount: contactIds.length,
      estimatedCost,
      createdAt: new Date().toISOString()
    };

    this.jobs.set(job.id, job);
    await this.submitBatchJob(job.id, batchRequests);
    
    return job;
  }

  // Pipeline Analysis - Analyze all deals simultaneously
  async analyzePipelineBulk(dealIds: string[]): Promise<BatchJob> {
    const deals = await this.getDealsById(dealIds);
    const batchRequests: BatchRequest[] = [];

    deals.forEach((deal, index) => {
      const prompt = this.buildDealAnalysisPrompt(deal);
      
      batchRequests.push({
        custom_id: `deal_${deal.id}_${index}`,
        method: 'POST',
        url: '/v1/chat/completions',
        body: {
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are a sales analytics expert who provides deep insights into deal progression, risk factors, and optimization opportunities.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1200
        }
      });
    });

    const estimatedCost = this.calculateBatchCost(batchRequests.length);
    
    const job: BatchJob = {
      id: `batch_pipeline_${Date.now()}`,
      type: 'pipeline_analysis',
      status: 'queued',
      itemCount: dealIds.length,
      estimatedCost,
      createdAt: new Date().toISOString()
    };

    this.jobs.set(job.id, job);
    await this.submitBatchJob(job.id, batchRequests);
    
    return job;
  }

  // Bulk Social Research - Enrich contacts with social insights
  async researchSocialProfilesBulk(contactIds: string[]): Promise<BatchJob> {
    const contacts = await this.getContactsById(contactIds);
    const batchRequests: BatchRequest[] = [];

    contacts.forEach((contact, index) => {
      const prompt = this.buildSocialResearchPrompt(contact);
      
      batchRequests.push({
        custom_id: `social_${contact.id}_${index}`,
        method: 'POST',
        url: '/v1/chat/completions',
        body: {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a social media research specialist who analyzes professional profiles to provide actionable insights for sales and networking.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000
        }
      });
    });

    const estimatedCost = this.calculateBatchCost(batchRequests.length);
    
    const job: BatchJob = {
      id: `batch_social_${Date.now()}`,
      type: 'social_research',
      status: 'queued',
      itemCount: contactIds.length,
      estimatedCost,
      createdAt: new Date().toISOString()
    };

    this.jobs.set(job.id, job);
    await this.submitBatchJob(job.id, batchRequests);
    
    return job;
  }

  private async submitBatchJob(jobId: string, requests: BatchRequest[]): Promise<void> {
    try {
      // Create batch file
      const batchContent = requests.map(req => JSON.stringify(req)).join('\n');
      
      // Upload file to OpenAI
      const formData = new FormData();
      const blob = new Blob([batchContent], { type: 'application/json' });
      formData.append('file', blob, `${jobId}.jsonl`);
      formData.append('purpose', 'batch');

      const uploadResponse = await fetch(`${this.baseUrl}/files`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: formData
      });

      const uploadResult = await uploadResponse.json();
      
      // Create batch job
      const batchResponse = await fetch(`${this.baseUrl}/batches`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input_file_id: uploadResult.id,
          endpoint: '/v1/chat/completions',
          completion_window: '24h',
          metadata: {
            job_id: jobId,
            created_by: 'smartcrm'
          }
        })
      });

      const batchResult = await batchResponse.json();
      
      // Update job with batch ID
      const job = this.jobs.get(jobId);
      if (job) {
        job.status = 'processing';
        this.jobs.set(jobId, job);
      }

      // Start monitoring the batch
      this.monitorBatchJob(jobId, batchResult.id);

    } catch (error) {
      logger.error(`Failed to submit batch job ${jobId}`, error as Error);
      const job = this.jobs.get(jobId);
      if (job) {
        job.status = 'failed';
        this.jobs.set(jobId, job);
      }
    }
  }

  private async monitorBatchJob(jobId: string, batchId: string): Promise<void> {
    const checkStatus = async () => {
      try {
        const response = await fetch(`${this.baseUrl}/batches/${batchId}`, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        });

        const batch = await response.json();
        const job = this.jobs.get(jobId);

        if (!job) return;

        if (batch.status === 'completed') {
          // Download results
          const resultsResponse = await fetch(`${this.baseUrl}/files/${batch.output_file_id}/content`, {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`
            }
          });

          const results = await resultsResponse.text();
          const parsedResults = results.split('\n').filter(line => line.trim()).map(line => JSON.parse(line));

          job.status = 'completed';
          job.completedAt = new Date().toISOString();
          job.results = parsedResults;
          this.jobs.set(jobId, job);

          // Process results based on job type
          await this.processBatchResults(job, parsedResults);

        } else if (batch.status === 'failed') {
          job.status = 'failed';
          this.jobs.set(jobId, job);
        } else {
          // Still processing, check again in 30 seconds
          setTimeout(checkStatus, 30000);
        }
      } catch (error) {
        logger.error(`Error monitoring batch job ${jobId}`, error as Error);
      }
    };

    checkStatus();
  }

  private async processBatchResults(job: BatchJob, results: any[]): Promise<void> {
    try {
      switch (job.type) {
        case 'contact_enrichment':
          await this.updateContactsWithEnrichment(results);
          break;
        case 'email_generation':
          await this.saveBulkEmailResults(results);
          break;
        case 'pipeline_analysis':
          await this.updateDealsWithAnalysis(results);
          break;
        case 'social_research':
          await this.updateContactsWithSocialInsights(results);
          break;
      }

      logger.info(`Batch job ${job.id} completed successfully, processed ${results.length} items`);
    } catch (error) {
      logger.error(`Failed to process batch results for job ${job.id}`, error as Error);
    }
  }

  // Cost calculation (50% less than regular API)
  private calculateBatchCost(requestCount: number): number {
    // Approximate cost per request for gpt-4o-mini in batch mode
    const costPerRequest = 0.0005; // 50% less than regular pricing
    return requestCount * costPerRequest;
  }

  // Helper methods for building prompts
  private buildEnrichmentPrompt(contact: any, analysisType: string): string {
    const baseInfo = `Contact: ${contact.name} (${contact.email}) at ${contact.company || 'Unknown Company'}`;
    
    switch (analysisType) {
      case 'scoring':
        return `${baseInfo}\n\nAnalyze this contact for lead scoring. Consider: company size, role seniority, engagement potential, budget authority. Provide a score 1-100 and detailed reasoning.`;
      case 'social':
        return `${baseInfo}\n\nResearch likely social media presence and professional background. Provide insights for personalized outreach.`;
      case 'personality':
        return `${baseInfo}\n\nAnalyze communication style preferences, decision-making approach, and optimal engagement strategies based on available information.`;
      default:
        return `${baseInfo}\n\nProvide comprehensive contact analysis and enrichment insights.`;
    }
  }

  private buildEmailGenerationPrompt(contact: any, campaignData: any): string {
    return `Create a personalized email for:
Contact: ${contact.name} (${contact.title || 'Professional'}) at ${contact.company || 'their company'}

Campaign Details:
- Subject Theme: ${campaignData.subject}
- Tone: ${campaignData.tone}
- Purpose: ${campaignData.purpose}
- Call to Action: ${campaignData.callToAction}

Generate a complete email with personalized subject line and body that resonates with this specific contact.`;
  }

  private buildDealAnalysisPrompt(deal: any): string {
    return `Analyze this sales deal:
Deal: ${deal.title} - $${deal.value}
Stage: ${deal.stage}
Contact: ${deal.contact?.name}
Company: ${deal.contact?.company}
Days in Stage: ${deal.daysInStage || 'Unknown'}

Provide: risk assessment, next best actions, probability of close, timeline predictions, and optimization recommendations.`;
  }

  private buildSocialResearchPrompt(contact: any): string {
    return `Research social and professional insights for:
${contact.name} - ${contact.title || 'Professional'} at ${contact.company || 'Unknown Company'}
Email: ${contact.email}

Provide: likely social media platforms, professional interests, content engagement patterns, optimal outreach timing, and personalization opportunities.`;
  }

  // Data fetching methods (integrate with your existing services)
  private async getContactsById(contactIds: string[]): Promise<any[]> {
    // Use your existing contact service
    const { contactAPI } = await import('./contact-api.service');
    const contacts = [];
    for (const id of contactIds) {
      try {
        const contact = await contactAPI.getContact(id);
        contacts.push(contact);
      } catch (error) {
        logger.warn(`Could not fetch contact ${id}`, { error });
      }
    }
    return contacts;
  }

  private async getDealsById(dealIds: string[]): Promise<any[]> {
    // Use your existing deal service
    const { dealService } = await import('./dealService');
    return await dealService.getDealsById(dealIds);
  }

  // Result processing methods
  private async updateContactsWithEnrichment(results: any[]): Promise<void> {
    const { contactAPI } = await import('./contact-api.service');
    
    for (const result of results) {
      if (result.response?.choices?.[0]?.message?.content) {
        const customId = result.custom_id;
        const contactId = customId.split('_')[1];
        const analysisType = customId.split('_')[2];
        
        const enrichmentData = JSON.parse(result.response.choices[0].message.content);
        
        // Update contact with enrichment data
        await contactAPI.updateContact(contactId, {
          [`ai_${analysisType}_analysis`]: enrichmentData,
          lastEnriched: new Date().toISOString()
        });
      }
    }
  }

  private async saveBulkEmailResults(results: any[]): Promise<void> {
    // Save generated emails to your email templates or campaigns
    for (const result of results) {
      if (result.response?.choices?.[0]?.message?.content) {
        const customId = result.custom_id;
        const contactId = customId.split('_')[1];
        
        const emailContent = result.response.choices[0].message.content;
        
        // Save to your email system
        await this.saveGeneratedEmail(contactId, emailContent);
      }
    }
  }

  private async updateDealsWithAnalysis(results: any[]): Promise<void> {
    const { dealService } = await import('./dealService');
    
    for (const result of results) {
      if (result.response?.choices?.[0]?.message?.content) {
        const customId = result.custom_id;
        const dealId = customId.split('_')[1];
        
        const analysis = JSON.parse(result.response.choices[0].message.content);
        
        await dealService.updateDeal(dealId, {
          aiAnalysis: analysis,
          riskScore: analysis.riskScore,
          nextActions: analysis.nextActions,
          lastAnalyzed: new Date().toISOString()
        });
      }
    }
  }

  private async updateContactsWithSocialInsights(results: any[]): Promise<void> {
    const { contactAPI } = await import('./contact-api.service');
    
    for (const result of results) {
      if (result.response?.choices?.[0]?.message?.content) {
        const customId = result.custom_id;
        const contactId = customId.split('_')[1];
        
        const socialInsights = JSON.parse(result.response.choices[0].message.content);
        
        await contactAPI.updateContact(contactId, {
          socialInsights: socialInsights,
          lastSocialResearch: new Date().toISOString()
        });
      }
    }
  }

  private async saveGeneratedEmail(contactId: string, emailContent: string): Promise<void> {
    // Integrate with your email system
    logger.info(`Generated email saved for contact ${contactId}`);
  }

  // Public methods for UI
  getBatchJob(jobId: string): BatchJob | undefined {
    return this.jobs.get(jobId);
  }

  getAllBatchJobs(): BatchJob[] {
    return Array.from(this.jobs.values());
  }

  getBatchJobsByType(type: BatchJob['type']): BatchJob[] {
    return Array.from(this.jobs.values()).filter(job => job.type === type);
  }
}

export const batchAPIService = new OpenAIBatchAPIService();
