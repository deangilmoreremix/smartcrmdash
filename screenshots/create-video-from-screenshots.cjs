const { chromium } = require("@playwright/test");
const fs = require("fs");
const path = require("path");
const { spawn } = require('child_process');
const config = require('./automation-config.json');

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function createVideoFromScreenshots() {
  console.log('🎬 Analyzing existing screenshots...');

  const videosDir = config.videosDir;
  const screenshots = fs.readdirSync(videosDir)
    .filter(file => file.endsWith('.png') && file.includes('frame'))
    .sort();

  if (screenshots.length === 0) {
    console.log('❌ No frame screenshots found');
    return;
  }

  console.log(`📸 Found ${screenshots.length} frame screenshots`);
  console.log('📝 Screenshots available for manual video creation:');
  screenshots.forEach((file, index) => {
    if (index < 5 || index > screenshots.length - 5) { // Show first 5 and last 5
      console.log(`   ${file}`);
    } else if (index === 5) {
      console.log(`   ... (${screenshots.length - 10} more files) ...`);
    }
  });

  console.log('\n💡 To create videos manually:');
  console.log('   ffmpeg -framerate 2 -i dashboard-overview_frame_%03d.png -c:v libx264 output.mp4');
  console.log('   # Or use any video editing software with the frame sequence');
}

async function createSimpleVideoDemo() {
  console.log('🎬 Creating simple video demo...');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: config.viewport,
    colorScheme: "light",
    ignoreHTTPSErrors: true
  });

  const page = await context.newPage();

  try {
    console.log('🌐 Loading dashboard embed...');
    await page.goto(config.baseUrl + '/dashboard-embed', {
      waitUntil: "networkidle",
      timeout: 60000
    });

    console.log('⏳ Waiting for content...');
    await page.waitForTimeout(5000);

    // Take a single high-quality screenshot
    const screenshotPath = 'screenshots/videos/dashboard-static-screenshot.png';
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });

    console.log(`📸 High-quality screenshot saved: ${screenshotPath}`);

    // Create a simple HTML video demo page
    const demoHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>SmartCRM Dashboard Demo</title>
    <style>
        body { font-family: Arial; text-align: center; padding: 20px; }
        img { max-width: 100%; border: 2px solid #ccc; }
        .info { margin: 20px 0; }
    </style>
</head>
<body>
    <h1>SmartCRM Dashboard Screenshot</h1>
    <div class="info">
        <p><strong>Resolution:</strong> 1920x1080 (16:9)</p>
        <p><strong>Content:</strong> Real dashboard with metrics and features</p>
        <p><strong>Generated:</strong> ${new Date().toISOString()}</p>
    </div>
    <img src="dashboard-static-screenshot.png" alt="SmartCRM Dashboard">
</body>
</html>`;

    fs.writeFileSync('screenshots/videos/dashboard-demo.html', demoHtml);
    console.log('📄 Demo HTML page created: screenshots/videos/dashboard-demo.html');

  } catch (error) {
    console.error('❌ Failed to create demo:', error.message);
  } finally {
    await context.close();
    await browser.close();
  }
}

async function main() {
  await createVideoFromScreenshots();
  await createSimpleVideoDemo();
  console.log('\n🎉 Demo creation complete!');
  console.log('📁 Check screenshots/videos/ for results');
}

main().catch(console.error);