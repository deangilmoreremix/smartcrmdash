// Integration & API Management Types
export interface APIIntegration {
  id: string;
  name: string;
  provider: string;
  type: 'rest' | 'graphql' | 'webhook' | 'websocket' | 'grpc';
  category: 'crm' | 'email' | 'payment' | 'analytics' | 'ai' | 'communication' | 'storage' | 'auth';
  baseUrl: string;
  version: string;
  authentication: AuthConfig;
  endpoints: APIEndpoint[];
  status: 'active' | 'inactive' | 'error' | 'testing';
  health: HealthStatus;
  usage: UsageStats;
  configuration: IntegrationConfig;
  createdAt: Date;
  lastUsed?: Date;
  description?: string;
  documentation?: string;
  tags: string[];
}

export interface AuthConfig {
  type: 'api_key' | 'bearer_token' | 'oauth2' | 'basic' | 'custom';
  credentials: Record<string, string>;
  tokenEndpoint?: string;
  refreshEndpoint?: string;
  scopes?: string[];
  expiresAt?: Date;
  autoRefresh: boolean;
}

export interface APIEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  parameters: EndpointParameter[];
  requestBody?: RequestBodySchema;
  responses: ResponseSchema[];
  rateLimit?: RateLimit;
  caching?: CacheConfig;
  retryPolicy?: RetryConfig;
  timeout: number;
  enabled: boolean;
}

export interface EndpointParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  location: 'query' | 'path' | 'header' | 'cookie';
  required: boolean;
  description?: string;
  defaultValue?: any;
  validation?: ParameterValidation;
}

export interface ParameterValidation {
  min?: number;
  max?: number;
  pattern?: string;
  enum?: any[];
  format?: string;
}

export interface RequestBodySchema {
  contentType: string;
  schema: JSONSchema;
  examples?: Record<string, any>;
}

export interface ResponseSchema {
  statusCode: number;
  description: string;
  schema?: JSONSchema;
  examples?: Record<string, any>;
}

export interface JSONSchema {
  type: 'object' | 'array' | 'string' | 'number' | 'boolean';
  properties?: Record<string, JSONSchema>;
  items?: JSONSchema;
  required?: string[];
  additionalProperties?: boolean;
}

export interface RateLimit {
  requests: number;
  window: number; // in seconds
  burst?: number;
  strategy: 'fixed_window' | 'sliding_window' | 'token_bucket';
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number; // time to live in seconds
  strategy: 'memory' | 'redis' | 'disk';
  invalidateOn?: string[]; // events that invalidate cache
}

export interface RetryConfig {
  maxRetries: number;
  backoffStrategy: 'linear' | 'exponential' | 'custom';
  initialDelay: number;
  maxDelay: number;
  retryConditions: string[]; // HTTP status codes or error types
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  lastCheck: Date;
  responseTime: number;
  uptime: number; // percentage
  errors: HealthError[];
  metrics: HealthMetrics;
}

export interface HealthError {
  timestamp: Date;
  type: 'timeout' | 'auth_error' | 'rate_limit' | 'server_error' | 'network_error';
  message: string;
  statusCode?: number;
  resolved: boolean;
}

export interface HealthMetrics {
  totalRequests: number;
  successRequests: number;
  errorRequests: number;
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
}

export interface UsageStats {
  totalRequests: number;
  requestsToday: number;
  requestsThisMonth: number;
  dataTransferred: number; // in bytes
  cost: number;
  quotaUsed: number; // percentage
  quotaLimit: number;
  topEndpoints: EndpointUsage[];
  errorRate: number;
  trends: UsageTrend[];
}

export interface EndpointUsage {
  endpoint: string;
  method: string;
  requests: number;
  errorRate: number;
  averageResponseTime: number;
}

export interface UsageTrend {
  date: string;
  requests: number;
  errors: number;
  responseTime: number;
}

export interface IntegrationConfig {
  id: string;
  settings: ConfigSetting[];
  webhooks: WebhookConfig[];
  dataMapping: DataMapping[];
  syncRules: SyncRule[];
  transformations: DataTransformation[];
}

export interface ConfigSetting {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  description: string;
  options?: any[];
  validation?: SettingValidation;
  sensitive: boolean; // hide value in UI
}

export interface SettingValidation {
  min?: number;
  max?: number;
  pattern?: string;
  custom?: string; // custom validation function
}

export interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret?: string;
  active: boolean;
  retryPolicy: RetryConfig;
  deliveryHistory: WebhookDelivery[];
}

export interface WebhookDelivery {
  id: string;
  timestamp: Date;
  event: string;
  status: 'success' | 'failed' | 'pending';
  attempts: number;
  response?: {
    statusCode: number;
    body: string;
    headers: Record<string, string>;
  };
  error?: string;
}

export interface DataMapping {
  id: string;
  sourceField: string;
  targetField: string;
  transformation?: string;
  required: boolean;
  defaultValue?: any;
}

export interface SyncRule {
  id: string;
  name: string;
  source: string;
  target: string;
  direction: 'bidirectional' | 'source_to_target' | 'target_to_source';
  frequency: 'real_time' | 'hourly' | 'daily' | 'weekly' | 'manual';
  conditions: SyncCondition[];
  lastSync?: Date;
  enabled: boolean;
}

export interface SyncCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'gt' | 'lt' | 'in' | 'not_in';
  value: any;
}

export interface DataTransformation {
  id: string;
  name: string;
  type: 'field_mapping' | 'data_enrichment' | 'validation' | 'formatting' | 'custom';
  config: Record<string, any>;
  script?: string; // for custom transformations
  enabled: boolean;
}

// API Testing and Monitoring
export interface APITest {
  id: string;
  name: string;
  integrationId: string;
  endpointId: string;
  testType: 'functional' | 'performance' | 'security' | 'integration';
  request: APITestRequest;
  expectedResponse: APITestExpectedResponse;
  assertions: APIAssertion[];
  schedule?: TestSchedule;
  results: TestResult[];
  enabled: boolean;
  createdAt: Date;
}

export interface APITestRequest {
  method: string;
  path: string;
  headers: Record<string, string>;
  queryParams: Record<string, any>;
  body?: any;
  timeout: number;
}

export interface APITestExpectedResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body?: any;
  responseTime?: number; // max expected response time
}

export interface APIAssertion {
  type: 'status_code' | 'header' | 'body' | 'response_time' | 'custom';
  field?: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'gt' | 'lt' | 'exists';
  expected: any;
  actual?: any;
}

export interface TestSchedule {
  frequency: 'minute' | 'hourly' | 'daily' | 'weekly';
  interval: number;
  timezone: string;
  enabled: boolean;
}

export interface TestResult {
  id: string;
  timestamp: Date;
  status: 'passed' | 'failed' | 'error';
  duration: number;
  assertions: AssertionResult[];
  request: APITestRequest;
  response?: {
    statusCode: number;
    headers: Record<string, string>;
    body: any;
    responseTime: number;
  };
  error?: string;
}

export interface AssertionResult {
  type: string;
  field?: string;
  expected: any;
  actual: any;
  passed: boolean;
  message?: string;
}

// API Documentation
export interface APIDocumentation {
  id: string;
  integrationId: string;
  title: string;
  description: string;
  version: string;
  baseUrl: string;
  authentication: AuthDocumentation;
  endpoints: EndpointDocumentation[];
  schemas: SchemaDocumentation[];
  examples: ExampleDocumentation[];
  changelog: ChangelogEntry[];
  lastUpdated: Date;
}

export interface AuthDocumentation {
  type: string;
  description: string;
  parameters: AuthParameter[];
  examples: AuthExample[];
}

export interface AuthParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface AuthExample {
  name: string;
  description: string;
  example: Record<string, any>;
}

export interface EndpointDocumentation {
  id: string;
  method: string;
  path: string;
  summary: string;
  description: string;
  parameters: ParameterDocumentation[];
  requestBody?: RequestBodyDocumentation;
  responses: ResponseDocumentation[];
  examples: EndpointExample[];
  tags: string[];
}

export interface ParameterDocumentation {
  name: string;
  in: 'query' | 'path' | 'header' | 'cookie';
  required: boolean;
  type: string;
  description: string;
  example?: any;
}

export interface RequestBodyDocumentation {
  description: string;
  contentType: string;
  schema: string; // reference to schema
  examples: Record<string, any>;
}

export interface ResponseDocumentation {
  statusCode: number;
  description: string;
  schema?: string;
  examples: Record<string, any>;
}

export interface EndpointExample {
  name: string;
  description: string;
  request: {
    headers?: Record<string, string>;
    queryParams?: Record<string, any>;
    body?: any;
  };
  response: {
    statusCode: number;
    headers?: Record<string, string>;
    body: any;
  };
}

export interface SchemaDocumentation {
  name: string;
  type: string;
  description: string;
  properties: PropertyDocumentation[];
  example: any;
}

export interface PropertyDocumentation {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: any;
}

export interface ExampleDocumentation {
  name: string;
  description: string;
  category: string;
  code: string;
  language: string;
}

export interface ChangelogEntry {
  version: string;
  date: Date;
  changes: ChangeDescription[];
}

export interface ChangeDescription {
  type: 'added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'security';
  description: string;
  breaking?: boolean;
}

// External Service Integrations
export interface ExternalService {
  id: string;
  name: string;
  category: 'crm' | 'email' | 'calendar' | 'payment' | 'analytics' | 'storage' | 'ai' | 'communication';
  provider: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  credentials: ServiceCredentials;
  config: ServiceConfig;
  capabilities: ServiceCapability[];
  dataSync: DataSyncConfig;
  usage: ServiceUsage;
  lastSync?: Date;
  createdAt: Date;
}

export interface ServiceCredentials {
  type: 'oauth2' | 'api_key' | 'username_password' | 'certificate';
  data: Record<string, string>;
  expiresAt?: Date;
  refreshToken?: string;
}

export interface ServiceConfig {
  settings: Record<string, any>;
  fieldMappings: FieldMapping[];
  syncFrequency: 'real_time' | 'hourly' | 'daily' | 'weekly';
  conflictResolution: 'latest_wins' | 'manual' | 'source_wins' | 'target_wins';
}

export interface FieldMapping {
  sourceField: string;
  targetField: string;
  transformation?: string;
  bidirectional: boolean;
}

export interface ServiceCapability {
  name: string;
  description: string;
  enabled: boolean;
  requirements?: string[];
}

export interface DataSyncConfig {
  enabled: boolean;
  frequency: string;
  lastSync?: Date;
  nextSync?: Date;
  syncedRecords: number;
  errorCount: number;
  conflicts: SyncConflict[];
}

export interface SyncConflict {
  id: string;
  type: 'field_mismatch' | 'record_deleted' | 'permission_denied' | 'validation_error';
  sourceRecord: any;
  targetRecord: any;
  resolution: 'pending' | 'resolved' | 'ignored';
  timestamp: Date;
}

export interface ServiceUsage {
  apiCalls: number;
  dataTransferred: number;
  quotaUsed: number;
  cost: number;
  lastReset: Date;
}
