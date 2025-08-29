import { Deal, DealStage, DealActivity } from '../types/deal';
import { cacheService } from './cache.service';
import { logger } from './logger.service';
import { validationService } from './validation.service';
import { supabase } from './supabaseClient';

export interface DealFilters {
  search?: string;
  stage?: string;
  assignee?: string;
  priority?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DealListResponse {
  deals: Deal[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface DealStats {
  total: number;
  byStage: Record<string, number>;
  byPriority: Record<string, number>;
  totalValue: number;
  averageValue: number;
  winRate: number;
}

export class DealService {
  private baseURL: string;
  private supabaseUrl: string;
  private supabaseKey: string;
  private isBackendAvailable = true;
  private isMockMode = false; // Use Supabase by default

  constructor() {
    // Configure to use Supabase Edge Functions as required by remote apps
    this.supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    this.supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
    this.baseURL = `${this.supabaseUrl}/functions/v1/deals`;

    // Only fall back to mock mode if Supabase is not configured
    if (!this.supabaseUrl || !this.supabaseKey) {
      this.isMockMode = true;
      console.warn('Supabase not configured - falling back to local storage for deals');
    } else {
      this.isMockMode = false;
      this.isBackendAvailable = true;
      console.log('Using Supabase Edge Functions for deal management (required by remote apps)');
    }
  }

  // Get headers for Supabase Edge Function requests
  private getSupabaseHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.supabaseKey}`
    };

    return headers;
  }

  // Check if we should use fallback mode
  private shouldUseFallback(): boolean {
    return this.isMockMode || !this.supabaseUrl || !this.supabaseKey;
  }

  // Initialize local storage with sample data if needed
  private initializeLocalStorage(): Deal[] {
    try {
      const stored = localStorage.getItem('deals');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      // If localStorage is corrupted, reset it
    }

    // Default sample data
    const sampleDeals: Deal[] = [
      {
        id: '1',
        title: 'Enterprise Software License',
        description: 'Annual software license renewal for Microsoft Office Suite',
        value: 125000,
        stage: {
          id: 'proposal',
          name: 'Proposal',
          order: 3,
          color: '#FFA500',
          probability: 75,
          isActive: true
        },
        priority: 'high',
        contactId: '1',
        companyId: 'comp-1',
        assignedUserId: 'user-1',
        expectedCloseDate: new Date('2024-02-15'),
        probability: 75,
        source: 'referral',
        currency: 'USD',
        tags: ['enterprise', 'software', 'renewal'],
        customFields: {},
        activities: [
          {
            id: 'a1',
            dealId: '1',
            type: 'meeting',
            title: 'Initial Discovery Call',
            description: 'Discussed requirements and budget',
            createdAt: new Date('2024-01-15'),
            createdBy: 'user-1'
          }
        ],
        attachments: [],
        createdAt: new Date('2024-01-10T10:00:00Z'),
        updatedAt: new Date('2024-01-20T15:30:00Z')
      }
    ];

    localStorage.setItem('deals', JSON.stringify(sampleDeals));
    return sampleDeals;
  }

  // Get deals from local storage
  private getLocalDeals(): Deal[] {
    try {
      const stored = localStorage.getItem('deals');
      return stored ? JSON.parse(stored) : this.initializeLocalStorage();
    } catch (e) {
      return this.initializeLocalStorage();
    }
  }

  // Save deals to local storage
  private saveLocalDeals(deals: Deal[]): void {
    try {
      localStorage.setItem('deals', JSON.stringify(deals));
    } catch (e) {
      console.warn('Failed to save deals to localStorage');
    }
  }

  // Map Supabase deal to our Deal interface
  private mapSupabaseDeal(supabaseDeal: any): Deal {
    return {
      id: supabaseDeal.id,
      title: supabaseDeal.title || '',
      description: supabaseDeal.description || '',
      value: supabaseDeal.value || 0,
      stage: supabaseDeal.stage || {
        id: 'discovery',
        name: 'Discovery',
        order: 1,
        color: '#3B82F6',
        probability: 25,
        isActive: true
      },
      priority: supabaseDeal.priority || 'medium',
      contactId: supabaseDeal.contact_id || '',
      companyId: supabaseDeal.company_id || '',
      assignedUserId: supabaseDeal.assigned_user_id || '',
      expectedCloseDate: supabaseDeal.expected_close_date ? new Date(supabaseDeal.expected_close_date) : undefined,
      probability: supabaseDeal.probability || 0,
      source: supabaseDeal.source || 'other',
      currency: supabaseDeal.currency || 'USD',
      tags: supabaseDeal.tags || [],
      customFields: supabaseDeal.custom_fields || {},
      activities: supabaseDeal.activities || [],
      attachments: supabaseDeal.attachments || [],
      createdAt: new Date(supabaseDeal.created_at),
      updatedAt: new Date(supabaseDeal.updated_at)
    };
  }

  // Map our Deal interface to Supabase format
  private mapToSupabaseFormat(deal: Partial<Deal>): any {
    return {
      title: deal.title,
      description: deal.description,
      value: deal.value,
      stage: deal.stage,
      priority: deal.priority,
      contact_id: deal.contactId,
      company_id: deal.companyId,
      assigned_user_id: deal.assignedUserId,
      expected_close_date: deal.expectedCloseDate?.toISOString(),
      probability: deal.probability,
      source: deal.source,
      currency: deal.currency,
      tags: deal.tags,
      custom_fields: deal.customFields,
      updated_at: new Date().toISOString()
    };
  }

  // CRUD Operations
  async createDeal(dealData: Partial<Deal>): Promise<Deal> {
    const sanitized = validationService.sanitizeDeal(dealData);

    if (this.shouldUseFallback()) {
      // Local storage fallback
      logger.info('Using local storage for deal creation');
      const deals = this.getLocalDeals();

      const newDeal: Deal = {
        id: crypto.randomUUID(),
        ...sanitized as any,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      deals.push(newDeal);
      this.saveLocalDeals(deals);
      cacheService.set('deal', newDeal.id, newDeal, 300, ['deal']);
      return newDeal;
    }

    try {
      // Use Supabase REST API for persistent deal creation
      logger.info('Creating deal via Supabase REST API');
      const supabaseData = {
        ...this.mapToSupabaseFormat(sanitized),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const response = await fetch(`${this.baseURL}/deals`, {
        method: 'POST',
        headers: this.getSupabaseHeaders(),
        body: JSON.stringify(supabaseData)
      });

      if (!response.ok) {
        throw new Error(`Supabase API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const supabaseDeal = Array.isArray(result) ? result[0] : result;

      const newDeal = this.mapSupabaseDeal(supabaseDeal);

      // Cache the deal
      cacheService.set('deal', newDeal.id, newDeal, 300, ['deal']);

      return newDeal;
    } catch (error) {
      logger.error('Failed to create deal via Supabase, falling back to local storage', error as Error);

      // Fallback to local storage
      const deals = this.getLocalDeals();

      const newDeal: Deal = {
        id: crypto.randomUUID(),
        ...sanitized as any,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      deals.push(newDeal);
      this.saveLocalDeals(deals);
      cacheService.set('deal', newDeal.id, newDeal, 300, ['deal']);
      return newDeal;
    }
  }

  async getDeal(dealId: string): Promise<Deal> {
    // Check cache first
    const cached = cacheService.get('deal', dealId);
    if (cached) {
      return cached as Deal;
    }

    if (this.shouldUseFallback()) {
      // Local storage fallback
      logger.info('Using local storage for deal retrieval');
      const deals = this.getLocalDeals();
      const deal = deals.find(d => d.id === dealId);

      if (!deal) {
        throw new Error(`Deal with ID ${dealId} not found`);
      }

      cacheService.set('deal', dealId, deal, 300, ['deal']);
      return deal;
    }

    try {
      // Use Supabase REST API for deal retrieval
      const response = await fetch(`${this.baseURL}/deals?id=eq.${dealId}`, {
        method: 'GET',
        headers: this.getSupabaseHeaders()
      });

      if (!response.ok) {
        throw new Error(`Supabase API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const supabaseDeal = Array.isArray(result) ? result[0] : result;

      if (!supabaseDeal) {
        throw new Error(`Deal with ID ${dealId} not found`);
      }

      const deal = this.mapSupabaseDeal(supabaseDeal);

      // Cache the deal
      cacheService.set('deal', dealId, deal, 300, ['deal']);

      return deal;
    } catch (error) {
      logger.error('Failed to get deal via Supabase, falling back to local storage', error as Error);

      // Fallback to local storage
      const deals = this.getLocalDeals();
      const deal = deals.find(d => d.id === dealId);

      if (!deal) {
        throw new Error(`Deal with ID ${dealId} not found`);
      }

      cacheService.set('deal', dealId, deal, 300, ['deal']);
      return deal;
    }
  }

  async updateDeal(dealId: string, updates: Partial<Deal>): Promise<Deal> {
    // Validate updates
    if (Object.keys(updates).length === 0) {
      throw new Error('No updates provided');
    }

    const sanitized = validationService.sanitizeDeal(updates);

    if (this.shouldUseFallback()) {
      // Local storage fallback
      logger.info('Using local storage for deal update');
      const deals = this.getLocalDeals();
      const dealIndex = deals.findIndex(d => d.id === dealId);

      if (dealIndex === -1) {
        throw new Error(`Deal with ID ${dealId} not found`);
      }

      const updatedDeal: Deal = {
        ...deals[dealIndex],
        ...sanitized as any,
        updatedAt: new Date()
      };

      deals[dealIndex] = updatedDeal;
      this.saveLocalDeals(deals);
      cacheService.set('deal', dealId, updatedDeal, 300, ['deal']);
      cacheService.set('dealList', 'invalidate', null, 0, ['list']);

      return updatedDeal;
    }

    try {
      // Use Supabase REST API for deal update
      logger.info('Updating deal via Supabase REST API');
      const response = await fetch(`${this.baseURL}/deals?id=eq.${dealId}`, {
        method: 'PATCH',
        headers: this.getSupabaseHeaders(),
        body: JSON.stringify({
          ...this.mapToSupabaseFormat(sanitized),
          updated_at: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Supabase API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const updatedSupabaseDeal = Array.isArray(result) ? result[0] : result;

      if (!updatedSupabaseDeal) {
        throw new Error(`Deal with ID ${dealId} not found`);
      }

      const updatedDeal = this.mapSupabaseDeal(updatedSupabaseDeal);

      // Update cache
      cacheService.set('deal', dealId, updatedDeal, 300, ['deal']);
      cacheService.set('dealList', 'invalidate', null, 0, ['list']);

      return updatedDeal;
    } catch (error) {
      logger.error('Failed to update deal via Supabase, falling back to local storage', error as Error);

      // Fallback to local storage
      const deals = this.getLocalDeals();
      const dealIndex = deals.findIndex(d => d.id === dealId);

      if (dealIndex === -1) {
        throw new Error(`Deal with ID ${dealId} not found`);
      }

      const updatedDeal: Deal = {
        ...deals[dealIndex],
        ...sanitized as any,
        updatedAt: new Date()
      };

      deals[dealIndex] = updatedDeal;
      this.saveLocalDeals(deals);
      cacheService.set('deal', dealId, updatedDeal, 300, ['deal']);
      cacheService.set('dealList', 'invalidate', null, 0, ['list']);

      return updatedDeal;
    }
  }

  async deleteDeal(dealId: string): Promise<void> {
    if (this.shouldUseFallback()) {
      // Local storage fallback
      logger.info('Using local storage for deal deletion');
      const deals = this.getLocalDeals();
      const filteredDeals = deals.filter(d => d.id !== dealId);

      if (filteredDeals.length === deals.length) {
        throw new Error(`Deal with ID ${dealId} not found`);
      }

      this.saveLocalDeals(filteredDeals);
      cacheService.set('dealDelete', dealId, null, 0, ['deal']);
      return;
    }

    try {
      // Use Supabase REST API for deal deletion
      logger.info('Deleting deal via Supabase REST API');
      const response = await fetch(`${this.baseURL}/deals?id=eq.${dealId}`, {
        method: 'DELETE',
        headers: this.getSupabaseHeaders()
      });

      if (!response.ok) {
        throw new Error(`Supabase API error: ${response.status} ${response.statusText}`);
      }

      // Remove from cache
      cacheService.set('dealDelete', dealId, null, 0, ['deal']);
      cacheService.set('dealList', 'invalidate', null, 0, ['list']);

      logger.info('Deal deleted successfully via Supabase REST API', { dealId });
    } catch (error) {
      logger.error('Failed to delete deal via Supabase, falling back to local storage', error as Error);

      // Fallback to local storage
      const deals = this.getLocalDeals();
      const filteredDeals = deals.filter(d => d.id !== dealId);

      if (filteredDeals.length === deals.length) {
        throw new Error(`Deal with ID ${dealId} not found`);
      }

      this.saveLocalDeals(filteredDeals);
      cacheService.set('dealDelete', dealId, null, 0, ['deal']);
    }
  }

  // List and Search Operations
  async getDeals(filters: DealFilters = {}): Promise<DealListResponse> {
    const cacheKey = JSON.stringify(filters);

    // Check cache
    const cached = cacheService.get('dealList', cacheKey);
    if (cached) {
      return cached as DealListResponse;
    }

    if (this.shouldUseFallback()) {
      // Local storage fallback
      logger.info('Using local storage for deals list');
      let deals = this.getLocalDeals();

      // Apply filters
      if (filters.search) {
        const search = filters.search.toLowerCase();
        deals = deals.filter(d =>
          d.title.toLowerCase().includes(search) ||
          (d.description && d.description.toLowerCase().includes(search))
        );
      }

      if (filters.stage && filters.stage !== 'all') {
        deals = deals.filter(d =>
          typeof d.stage === 'string' ? d.stage === filters.stage : d.stage.id === filters.stage
        );
      }

      if (filters.priority && filters.priority !== 'all') {
        deals = deals.filter(d => d.priority === filters.priority);
      }

      // Apply sorting
      if (filters.sortBy) {
        deals.sort((a: any, b: any) => {
          const aValue = a[filters.sortBy!];
          const bValue = b[filters.sortBy!];

          if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
          if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }

      // Apply pagination
      const limit = filters.limit || 50;
      const offset = filters.offset || 0;

      const paginatedDeals = deals.slice(offset, offset + limit);

      const result: DealListResponse = {
        deals: paginatedDeals,
        total: deals.length,
        limit,
        offset,
        hasMore: offset + paginatedDeals.length < deals.length
      };

      // Cache the result
      cacheService.set('dealList', cacheKey, result, 300, ['list']);

      return result;
    }

    // For now, fallback to local storage as we haven't implemented Supabase list endpoint
    // This would be implemented similar to contacts service
    logger.info('Supabase deal list not implemented, using local storage');
    return this.getDeals({ ...filters, limit: filters.limit || 50 });
  }

  async getDealStats(): Promise<DealStats> {
    // Check cache first
    const cached = cacheService.get('dealStats', 'all');
    if (cached) {
      return cached as DealStats;
    }

    const deals = this.shouldUseFallback() ?
      this.getLocalDeals() :
      await this.getDeals({ limit: 1000 }).then(r => r.deals);

    const stats: DealStats = {
      total: deals.length,
      byStage: {},
      byPriority: {},
      totalValue: 0,
      averageValue: 0,
      winRate: 0
    };

    let wonDeals = 0;
    let totalValue = 0;

    deals.forEach(deal => {
      // Count by stage
      const stageKey = typeof deal.stage === 'string' ? deal.stage : deal.stage.id;
      stats.byStage[stageKey] = (stats.byStage[stageKey] || 0) + 1;

      // Count by priority
      stats.byPriority[deal.priority] = (stats.byPriority[deal.priority] || 0) + 1;

      // Calculate values
      totalValue += deal.value;

      if (stageKey === 'won') {
        wonDeals++;
      }
    });

    stats.totalValue = totalValue;
    stats.averageValue = deals.length > 0 ? totalValue / deals.length : 0;
    stats.winRate = deals.length > 0 ? (wonDeals / deals.length) * 100 : 0;

    // Cache the stats
    cacheService.set('dealStats', 'all', stats, 300, ['stats']);

    return stats;
  }

  // AI and Enhancement Methods (placeholder for Edge Functions integration)
  async enrichDeal(dealId: string): Promise<Deal> {
    const deal = await this.getDeal(dealId);

    // This would call ai-enrichment Edge Function
    // For now, return the deal as-is
    logger.info('Deal enrichment not implemented yet');
    return deal;
  }

  async scoreDeal(dealId: string): Promise<Deal> {
    const deal = await this.getDeal(dealId);

    // This would call smart-score Edge Function
    // For now, return the deal as-is
    logger.info('Deal scoring not implemented yet');
    return deal;
  }

  
}

export const dealService = new DealService();
export default dealService;