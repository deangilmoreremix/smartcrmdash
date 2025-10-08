const { chromium } = require("@playwright/test");
const config = require('./automation-config.json');

async function debugScreenshot() {
  console.log('🔍 Starting screenshot debug...');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: config.viewport,
    colorScheme: "light",
    ignoreHTTPSErrors: true
  });

  const page = await context.newPage();

  try {
    console.log('🌐 Navigating to dashboard...');
    await page.goto(config.baseUrl + '/', {
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
    await page.screenshot({
      path: 'debug-screenshot.png',
      fullPage: true
    });
    console.log('📸 Debug screenshot saved: debug-screenshot.png');

    // Check page title and URL
    const title = await page.title();
    const url = page.url();
    console.log(`📄 Page title: "${title}"`);
    console.log(`🔗 Current URL: ${url}`);

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  } finally {
    await context.close();
    await browser.close();
  }
}

debugScreenshot().catch(console.error);