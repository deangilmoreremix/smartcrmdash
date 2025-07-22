import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  APIIntegration, 
  APITest, 
  ExternalService, 
  WebhookConfig,
  TestResult,
  SyncRule,
  DataMapping,
  HealthStatus
} from '../types/integration';

interface IntegrationState {
  // API Integrations
  integrations: APIIntegration[];
  selectedIntegration: string | null;
  
  // External Services
  externalServices: ExternalService[];
  
  // API Testing
  tests: APITest[];
  testResults: TestResult[];
  runningTests: string[];
  
  // Webhooks
  webhooks: WebhookConfig[];
  
  // Sync Rules
  syncRules: SyncRule[];
  activeSyncs: string[];
  
  // Data Mappings
  dataMappings: DataMapping[];
  
  // Loading States
  loading: {
    integrations: boolean;
    services: boolean;
    tests: boolean;
    sync: boolean;
  };
  
  // Actions
  // Integration Management
  addIntegration: (integration: Omit<APIIntegration, 'id' | 'createdAt' | 'usage' | 'health'>) => void;
  updateIntegration: (id: string, updates: Partial<APIIntegration>) => void;
  deleteIntegration: (id: string) => void;
  setSelectedIntegration: (id: string | null) => void;
  testIntegrationConnection: (id: string) => Promise<boolean>;
  
  // Service Management
  connectService: (service: Omit<ExternalService, 'id' | 'createdAt' | 'usage'>) => Promise<string>;
  disconnectService: (id: string) => void;
  updateServiceConfig: (id: string, config: any) => void;
  syncService: (id: string) => Promise<void>;
  
  // API Testing
  createTest: (test: Omit<APITest, 'id' | 'createdAt' | 'results'>) => void;
  runTest: (testId: string) => Promise<TestResult>;
  runAllTests: (integrationId: string) => Promise<TestResult[]>;
  deleteTest: (id: string) => void;
  
  // Webhook Management
  createWebhook: (webhook: Omit<WebhookConfig, 'id' | 'deliveryHistory'>) => void;
  updateWebhook: (id: string, updates: Partial<WebhookConfig>) => void;
  deleteWebhook: (id: string) => void;
  testWebhook: (id: string) => Promise<boolean>;
  
  // Sync Management
  createSyncRule: (rule: Omit<SyncRule, 'id'>) => void;
  updateSyncRule: (id: string, updates: Partial<SyncRule>) => void;
  deleteSyncRule: (id: string) => void;
  executeSyncRule: (id: string) => Promise<void>;
  
  // Data Mapping
  createDataMapping: (mapping: Omit<DataMapping, 'id'>) => void;
  updateDataMapping: (id: string, updates: Partial<DataMapping>) => void;
  deleteDataMapping: (id: string) => void;
  
  // Health Monitoring
  checkIntegrationHealth: (id: string) => Promise<HealthStatus>;
  getIntegrationMetrics: (id: string) => Promise<any>;
  
  // Analytics
  getIntegrationAnalytics: () => {
    totalIntegrations: number;
    activeIntegrations: number;
    healthyIntegrations: number;
    totalRequests: number;
    errorRate: number;
    averageResponseTime: number;
  };
}

export const useIntegrationStore = create<IntegrationState>()(
  devtools(
    (set, get) => ({
      // Initial State
      integrations: [],
      selectedIntegration: null,
      externalServices: [],
      tests: [],
      testResults: [],
      runningTests: [],
      webhooks: [],
      syncRules: [],
      activeSyncs: [],
      dataMappings: [],
      loading: {
        integrations: false,
        services: false,
        tests: false,
        sync: false,
      },

      // Integration Management
      addIntegration: (integration) => {
        const newIntegration: APIIntegration = {
          ...integration,
          id: `integration_${Date.now()}`,
          createdAt: new Date(),
          usage: {
            totalRequests: 0,
            requestsToday: 0,
            requestsThisMonth: 0,
            dataTransferred: 0,
            cost: 0,
            quotaUsed: 0,
            quotaLimit: 10000,
            topEndpoints: [],
            errorRate: 0,
            trends: []
          },
          health: {
            status: 'unknown',
            lastCheck: new Date(),
            responseTime: 0,
            uptime: 0,
            errors: [],
            metrics: {
              totalRequests: 0,
              successRequests: 0,
              errorRequests: 0,
              averageResponseTime: 0,
              p95ResponseTime: 0,
              p99ResponseTime: 0
            }
          }
        };

        set((state) => ({
          integrations: [...state.integrations, newIntegration]
        }));
      },

      updateIntegration: (id, updates) => {
        set((state) => ({
          integrations: state.integrations.map((integration) =>
            integration.id === id ? { ...integration, ...updates } : integration
          )
        }));
      },

      deleteIntegration: (id) => {
        set((state) => ({
          integrations: state.integrations.filter((integration) => integration.id !== id),
          selectedIntegration: state.selectedIntegration === id ? null : state.selectedIntegration
        }));
      },

      setSelectedIntegration: (id) => {
        set({ selectedIntegration: id });
      },

      testIntegrationConnection: async (id) => {
        const integration = get().integrations.find(i => i.id === id);
        if (!integration) return false;

        try {
          // Simulate connection test
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Update health status
          get().updateIntegration(id, {
            health: {
              ...integration.health,
              status: 'healthy',
              lastCheck: new Date(),
              responseTime: Math.random() * 500 + 100,
              uptime: 99.8
            }
          });

          return true;
        } catch (error) {
          console.error('Connection test failed:', error);
          
          get().updateIntegration(id, {
            health: {
              ...integration.health,
              status: 'unhealthy',
              lastCheck: new Date(),
              errors: [...integration.health.errors, {
                timestamp: new Date(),
                type: 'network_error',
                message: 'Connection test failed',
                resolved: false
              }]
            }
          });

          return false;
        }
      },

      // Service Management
      connectService: async (service) => {
        const newService: ExternalService = {
          ...service,
          id: `service_${Date.now()}`,
          createdAt: new Date(),
          usage: {
            apiCalls: 0,
            dataTransferred: 0,
            quotaUsed: 0,
            cost: 0,
            lastReset: new Date()
          }
        };

        set((state) => ({
          externalServices: [...state.externalServices, newService]
        }));

        // Simulate connection process
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        get().updateServiceStatus(newService.id, 'connected');
        return newService.id;
      },

      disconnectService: (id) => {
        set((state) => ({
          externalServices: state.externalServices.map((service) =>
            service.id === id ? { ...service, status: 'disconnected' } : service
          )
        }));
      },

      updateServiceConfig: (id, config) => {
        set((state) => ({
          externalServices: state.externalServices.map((service) =>
            service.id === id ? { ...service, config: { ...service.config, ...config } } : service
          )
        }));
      },

      syncService: async (id) => {
        const service = get().externalServices.find(s => s.id === id);
        if (!service) return;

        set((state) => ({
          activeSyncs: [...state.activeSyncs, id],
          loading: { ...state.loading, sync: true }
        }));

        try {
          // Simulate sync process
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Update sync status
          set((state) => ({
            externalServices: state.externalServices.map((s) =>
              s.id === id 
                ? { 
                    ...s, 
                    lastSync: new Date(),
                    dataSync: {
                      ...s.dataSync,
                      lastSync: new Date(),
                      syncedRecords: s.dataSync.syncedRecords + Math.floor(Math.random() * 50),
                      nextSync: new Date(Date.now() + 24 * 60 * 60 * 1000)
                    }
                  } 
                : s
            ),
            activeSyncs: state.activeSyncs.filter(syncId => syncId !== id)
          }));
        } catch (error) {
          console.error('Sync failed:', error);
          set((state) => ({
            activeSyncs: state.activeSyncs.filter(syncId => syncId !== id)
          }));
        } finally {
          set((state) => ({
            loading: { ...state.loading, sync: false }
          }));
        }
      },

      // API Testing
      createTest: (test) => {
        const newTest: APITest = {
          ...test,
          id: `test_${Date.now()}`,
          createdAt: new Date(),
          results: []
        };

        set((state) => ({
          tests: [...state.tests, newTest]
        }));
      },

      runTest: async (testId) => {
        const test = get().tests.find(t => t.id === testId);
        if (!test) throw new Error('Test not found');

        set((state) => ({
          runningTests: [...state.runningTests, testId]
        }));

        try {
          // Simulate test execution
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const result: TestResult = {
            id: `result_${Date.now()}`,
            timestamp: new Date(),
            status: Math.random() > 0.2 ? 'passed' : 'failed',
            duration: Math.random() * 1000 + 500,
            assertions: test.assertions.map(assertion => ({
              type: assertion.type,
              field: assertion.field,
              expected: assertion.expected,
              actual: assertion.expected, // Mock actual value
              passed: Math.random() > 0.1,
              message: Math.random() > 0.9 ? 'Assertion failed' : undefined
            })),
            request: test.request,
            response: {
              statusCode: 200,
              headers: { 'content-type': 'application/json' },
              body: { success: true },
              responseTime: Math.random() * 500 + 100
            }
          };

          set((state) => ({
            testResults: [...state.testResults, result],
            tests: state.tests.map(t => 
              t.id === testId 
                ? { ...t, results: [...t.results, result] }
                : t
            ),
            runningTests: state.runningTests.filter(id => id !== testId)
          }));

          return result;
        } catch (error) {
          const errorResult: TestResult = {
            id: `result_${Date.now()}`,
            timestamp: new Date(),
            status: 'error',
            duration: 0,
            assertions: [],
            request: test.request,
            error: error.message
          };

          set((state) => ({
            testResults: [...state.testResults, errorResult],
            runningTests: state.runningTests.filter(id => id !== testId)
          }));

          throw error;
        }
      },

      runAllTests: async (integrationId) => {
        const tests = get().tests.filter(t => t.integrationId === integrationId);
        const results: TestResult[] = [];

        for (const test of tests) {
          try {
            const result = await get().runTest(test.id);
            results.push(result);
          } catch (error) {
            console.error(`Test ${test.id} failed:`, error);
          }
        }

        return results;
      },

      deleteTest: (id) => {
        set((state) => ({
          tests: state.tests.filter(test => test.id !== id),
          testResults: state.testResults.filter(result => 
            !state.tests.find(t => t.id === id)?.results.includes(result)
          )
        }));
      },

      // Webhook Management
      createWebhook: (webhook) => {
        const newWebhook: WebhookConfig = {
          ...webhook,
          id: `webhook_${Date.now()}`,
          deliveryHistory: []
        };

        set((state) => ({
          webhooks: [...state.webhooks, newWebhook]
        }));
      },

      updateWebhook: (id, updates) => {
        set((state) => ({
          webhooks: state.webhooks.map(webhook =>
            webhook.id === id ? { ...webhook, ...updates } : webhook
          )
        }));
      },

      deleteWebhook: (id) => {
        set((state) => ({
          webhooks: state.webhooks.filter(webhook => webhook.id !== id)
        }));
      },

      testWebhook: async (id) => {
        const webhook = get().webhooks.find(w => w.id === id);
        if (!webhook) return false;

        try {
          // Simulate webhook test
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Add test delivery to history
          const testDelivery = {
            id: `delivery_${Date.now()}`,
            timestamp: new Date(),
            event: 'test_event',
            status: 'success' as const,
            attempts: 1,
            response: {
              statusCode: 200,
              body: 'OK',
              headers: {}
            }
          };

          get().updateWebhook(id, {
            deliveryHistory: [...webhook.deliveryHistory, testDelivery]
          });

          return true;
        } catch (error) {
          console.error('Webhook test failed:', error);
          return false;
        }
      },

      // Sync Management
      createSyncRule: (rule) => {
        const newRule: SyncRule = {
          ...rule,
          id: `sync_${Date.now()}`
        };

        set((state) => ({
          syncRules: [...state.syncRules, newRule]
        }));
      },

      updateSyncRule: (id, updates) => {
        set((state) => ({
          syncRules: state.syncRules.map(rule =>
            rule.id === id ? { ...rule, ...updates } : rule
          )
        }));
      },

      deleteSyncRule: (id) => {
        set((state) => ({
          syncRules: state.syncRules.filter(rule => rule.id !== id)
        }));
      },

      executeSyncRule: async (id) => {
        const rule = get().syncRules.find(r => r.id === id);
        if (!rule) return;

        set((state) => ({
          activeSyncs: [...state.activeSyncs, id]
        }));

        try {
          // Simulate sync execution
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          get().updateSyncRule(id, {
            lastSync: new Date()
          });
        } finally {
          set((state) => ({
            activeSyncs: state.activeSyncs.filter(syncId => syncId !== id)
          }));
        }
      },

      // Data Mapping
      createDataMapping: (mapping) => {
        const newMapping: DataMapping = {
          ...mapping,
          id: `mapping_${Date.now()}`
        };

        set((state) => ({
          dataMappings: [...state.dataMappings, newMapping]
        }));
      },

      updateDataMapping: (id, updates) => {
        set((state) => ({
          dataMappings: state.dataMappings.map(mapping =>
            mapping.id === id ? { ...mapping, ...updates } : mapping
          )
        }));
      },

      deleteDataMapping: (id) => {
        set((state) => ({
          dataMappings: state.dataMappings.filter(mapping => mapping.id !== id)
        }));
      },

      // Health Monitoring
      checkIntegrationHealth: async (id) => {
        const integration = get().integrations.find(i => i.id === id);
        if (!integration) throw new Error('Integration not found');

        // Simulate health check
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const health: HealthStatus = {
          status: Math.random() > 0.8 ? 'healthy' : Math.random() > 0.5 ? 'degraded' : 'unhealthy',
          lastCheck: new Date(),
          responseTime: Math.random() * 500 + 100,
          uptime: Math.random() * 10 + 90,
          errors: [],
          metrics: {
            totalRequests: Math.floor(Math.random() * 10000),
            successRequests: Math.floor(Math.random() * 9500),
            errorRequests: Math.floor(Math.random() * 500),
            averageResponseTime: Math.random() * 300 + 100,
            p95ResponseTime: Math.random() * 500 + 200,
            p99ResponseTime: Math.random() * 800 + 400
          }
        };

        get().updateIntegration(id, { health });
        return health;
      },

      getIntegrationMetrics: async (id) => {
        // Simulate metrics fetching
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
          requests: {
            today: Math.floor(Math.random() * 1000),
            thisWeek: Math.floor(Math.random() * 5000),
            thisMonth: Math.floor(Math.random() * 20000)
          },
          responseTime: {
            average: Math.random() * 300 + 100,
            p95: Math.random() * 500 + 200,
            p99: Math.random() * 800 + 400
          },
          errors: {
            count: Math.floor(Math.random() * 50),
            rate: Math.random() * 0.05
          }
        };
      },

      // Analytics
      getIntegrationAnalytics: () => {
        const { integrations } = get();
        
        return {
          totalIntegrations: integrations.length,
          activeIntegrations: integrations.filter(i => i.status === 'active').length,
          healthyIntegrations: integrations.filter(i => i.health.status === 'healthy').length,
          totalRequests: integrations.reduce((sum, i) => sum + i.usage.totalRequests, 0),
          errorRate: integrations.length > 0 
            ? integrations.reduce((sum, i) => sum + i.usage.errorRate, 0) / integrations.length 
            : 0,
          averageResponseTime: integrations.length > 0
            ? integrations.reduce((sum, i) => sum + i.health.responseTime, 0) / integrations.length
            : 0
        };
      },

      // Helper method to update service status
      updateServiceStatus: (id: string, status: ExternalService['status']) => {
        set((state) => ({
          externalServices: state.externalServices.map((service) =>
            service.id === id ? { ...service, status } : service
          )
        }));
      }
    }),
    {
      name: 'integration-store',
    }
  )
);
