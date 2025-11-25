// Test setup file for Jest
/// <reference types="jest" />
import { jest } from '@jest/globals';

// Mock environment variables for tests
process.env.OPENAI_API_KEY = 'test-openai-key';
process.env.GOOGLE_API_KEY = 'test-gemini-key';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.REDIS_ENABLED = 'false'; // Disable Redis for tests by default

// Global mocks
// @ts-ignore
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        // @ts-ignore
        create: jest.fn().mockResolvedValue({
          choices: [{
            message: {
              content: JSON.stringify({ greeting: 'Hello, test user!' })
            }
          }]
        })
      }
    }
  }));
});

jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      // @ts-ignore
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: jest.fn().mockReturnValue(JSON.stringify({ greeting: 'Hello from Gemini!' }))
        }
      })
    })
  }))
}));

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
    on: jest.fn()
  }));
});

// Mock OpenTelemetry
jest.mock('@opentelemetry/api', () => ({
  metrics: {
    getMeter: jest.fn().mockReturnValue({
      createCounter: jest.fn().mockReturnValue({
        add: jest.fn()
      }),
      createHistogram: jest.fn().mockReturnValue({
        record: jest.fn()
      }),
      createObservableGauge: jest.fn().mockReturnValue({
        addCallback: jest.fn()
      })
    })
  }
}));

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Clean up after all tests
afterAll(() => {
  jest.restoreAllMocks();
});