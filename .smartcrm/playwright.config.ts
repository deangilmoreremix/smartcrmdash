import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 120_000,
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: 'http://localhost:5000',
    headless: true,
    viewport: { width: 1366, height: 768 },
    trace: 'off',
    screenshot: 'off',
    video: 'on'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ],
  outputDir: 'outputs/test-results'
});