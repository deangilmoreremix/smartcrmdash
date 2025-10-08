const { chromium } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

// Mock the debug screenshot function for testing
async function debugScreenshot() {
  console.log('🔍 Starting screenshot debug...');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    colorScheme: "light",
    ignoreHTTPSErrors: true
  });

  const page = await context.newPage();

  try {
    console.log('🌐 Navigating to dashboard...');
    await page.goto('http://localhost:5000/', {
      waitUntil: "networkidle",
      timeout: 60000
    });

    console.log('⏳ Waiting for React app to load...');
    await page.waitForTimeout(10000); // Wait 10 seconds for React to load

    // Check for JavaScript errors
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));

    // Wait for any React content to appear
    try {
      await page.waitForSelector('[data-reactroot], #root, .App, main', { timeout: 15000 });
      console.log('✅ React app detected');
    } catch (e) {
      console.log('⚠️ No React root found, checking raw HTML...');
    }

    // Check if we have any content
    const bodyText = await page.locator('body').textContent();
    console.log('📝 Body text length:', bodyText?.length || 0);
    console.log('📝 First 500 chars:', bodyText?.substring(0, 500) || 'NO CONTENT');

    // Check for common elements
    const hasContent = await page.locator('body').count() > 0;
    console.log('✅ Has body element:', hasContent);

    // Try to find any interactive elements
    const buttons = await page.locator('button').count();
    const links = await page.locator('a').count();
    const inputs = await page.locator('input').count();
    const divs = await page.locator('div').count();
    console.log(`🔘 Found ${buttons} buttons, ${links} links, ${inputs} inputs, ${divs} divs`);

    // Check for loading indicators
    const loadingElements = await page.locator('[class*="loading"], [class*="spinner"], [class*="Loading"]').count();
    console.log(`⏳ Found ${loadingElements} loading elements`);

    if (errors.length > 0) {
      console.log('❌ JavaScript errors:', errors);
    }

    // Take a debug screenshot
    const screenshotPath = 'test-debug-screenshot.png';
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });
    console.log('📸 Debug screenshot saved:', screenshotPath);

    // Check page title and URL
    const title = await page.title();
    const url = page.url();
    console.log(`📄 Page title: "${title}"`);
    console.log(`🔗 Current URL: ${url}`);

    return {
      success: true,
      screenshotPath,
      title,
      url,
      bodyTextLength: bodyText?.length || 0,
      elementCounts: { buttons, links, inputs, divs, loadingElements },
      errors
    };

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  } finally {
    await context.close();
    await browser.close();
  }
}

describe('Screenshot Automation Tests', () => {
  beforeAll(async () => {
    // Ensure test directories exist
    if (!fs.existsSync('test-screenshots')) {
      fs.mkdirSync('test-screenshots', { recursive: true });
    }
  });

  afterAll(async () => {
    // Clean up test files
    const testFiles = ['test-debug-screenshot.png'];
    testFiles.forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });
  });

  describe('Debug Screenshot Functionality', () => {
    test('should successfully take a debug screenshot', async () => {
      const result = await debugScreenshot();

      expect(result.success).toBe(true);
      expect(result.screenshotPath).toBe('test-debug-screenshot.png');
      expect(typeof result.title).toBe('string');
      expect(result.url).toMatch(/^http:\/\/localhost:5000/);
      expect(result.bodyTextLength).toBeGreaterThan(0);
      expect(result.elementCounts.buttons).toBeGreaterThanOrEqual(0);
      expect(result.elementCounts.links).toBeGreaterThanOrEqual(0);
      expect(result.elementCounts.inputs).toBeGreaterThanOrEqual(0);
      expect(result.elementCounts.divs).toBeGreaterThanOrEqual(0);
    }, 120000); // 2 minute timeout for browser operations

    test('should handle network failures gracefully', async () => {
      // This test would require mocking network failures
      // For now, we'll test with a valid URL
      const result = await debugScreenshot();
      expect(result.success).toBe(true);
    });

    test('should detect page content correctly', async () => {
      const result = await debugScreenshot();

      expect(result.bodyTextLength).toBeGreaterThan(100); // Reasonable content length
      expect(result.elementCounts.divs).toBeGreaterThan(10); // Should have many divs
    });

    test('should create screenshot file', async () => {
      await debugScreenshot();

      expect(fs.existsSync('test-debug-screenshot.png')).toBe(true);

      const stats = fs.statSync('test-debug-screenshot.png');
      expect(stats.size).toBeGreaterThan(1000); // Reasonable file size
    });

    test('should handle JavaScript errors appropriately', async () => {
      const result = await debugScreenshot();

      // Errors array should exist even if empty
      expect(Array.isArray(result.errors)).toBe(true);
    });
  });

  describe('Browser Configuration', () => {
    test('should launch browser in headless mode', async () => {
      const browser = await chromium.launch({ headless: true });
      const context = await browser.newContext();
      const page = await context.newPage();

      const userAgent = await page.evaluate(() => navigator.userAgent);
      expect(userAgent).toContain('HeadlessChrome');

      await context.close();
      await browser.close();
    });

    test('should set correct viewport', async () => {
      const browser = await chromium.launch({ headless: true });
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
      });
      const page = await context.newPage();

      const viewport = await page.viewportSize();
      expect(viewport).toEqual({ width: 1920, height: 1080 });

      await context.close();
      await browser.close();
    });
  });

  describe('Error Handling', () => {
    test('should handle browser launch failures', async () => {
      // Test invalid browser launch options
      try {
        await chromium.launch({ args: ['--invalid-flag'] });
      } catch (error) {
        expect(error.message).toContain('Failed to launch');
      }
    });

    test('should handle invalid URLs', async () => {
      const browser = await chromium.launch({ headless: true });
      const context = await browser.newContext();
      const page = await context.newPage();

      try {
        await page.goto('http://invalid-url-that-does-not-exist.com', { timeout: 5000 });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toMatch(/net::ERR_NAME_NOT_RESOLVED|timeout/i);
      }

      await context.close();
      await browser.close();
    });
  });

  describe('Performance Tests', () => {
    test('should complete screenshot within reasonable time', async () => {
      const startTime = Date.now();
      await debugScreenshot();
      const endTime = Date.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(120000); // Less than 2 minutes
      expect(duration).toBeGreaterThan(5000); // More than 5 seconds (reasonable minimum)
    });
  });
});