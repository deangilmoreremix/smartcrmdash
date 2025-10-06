import { z } from 'zod';

// Schema for smart greeting request
export const SmartGreetingSchema = z.object({
  userMetrics: z.object({
    pipelineValue: z.number().min(0),
    activeDeals: z.number().int().min(0),
    winRate: z.number().min(0).max(100),
    activityScore: z.number().min(0).max(100)
  }),
  timeOfDay: z.enum(['morning', 'afternoon', 'evening']),
  recentActivity: z.array(z.string())
});

// Schema for KPI analysis request
export const KPIAnalysisSchema = z.object({
  historicalData: z.object({
    timePeriod: z.string(),
    metrics: z.record(z.number())
  }),
  currentMetrics: z.object({
    revenue: z.number().min(0),
    dealsClosed: z.number().int().min(0),
    conversionRate: z.number().min(0).max(100),
    customerSatisfaction: z.number().min(0).max(100)
  })
});

// Schema for deal intelligence request
export const DealIntelligenceSchema = z.object({
  dealData: z.object({
    value: z.number().min(0),
    stage: z.string(),
    probability: z.number().min(0).max(100),
    closeDate: z.string().datetime()
  }),
  contactHistory: z.array(z.object({
    date: z.string().datetime(),
    type: z.string(),
    outcome: z.string()
  })),
  marketContext: z.object({
    competition: z.array(z.string()),
    marketTrends: z.array(z.string()),
    economicFactors: z.array(z.string())
  })
});

// Schema for business intelligence request
export const BusinessIntelligenceSchema = z.object({
  businessData: z.object({
    revenue: z.number().min(0),
    employees: z.number().int().positive(),
    industry: z.string().min(1),
    growthRate: z.number()
  }),
  marketContext: z.object({
    trends: z.array(z.string()),
    competitors: z.array(z.string()),
    regulations: z.array(z.string())
  }),
  objectives: z.array(z.string().min(1))
});

// Validation middleware
export const validateRequest = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Invalid request data',
          details: error.errors
        });
      } else {
        res.status(500).json({ error: 'Validation failed' });
      }
    }
  };
};