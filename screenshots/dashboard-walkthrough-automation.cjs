const { chromium, devices } = require("@playwright/test");
const fs = require("fs");
const path = require("path");
const { spawn } = require('child_process');
const config = require('./automation-config.json');

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function runNavSteps(page, steps = []) {
  for (const step of steps) {
    try {
      if (step.click) {
        // Try multiple selector strategies
        const selectors = Array.isArray(step.click) ? step.click : [step.click];
        let clicked = false;

        for (const selector of selectors) {
          try {
            await page.waitForSelector(selector, { state: "visible", timeout: 3000 });
            await page.click(selector, { timeout: 5000 });
            clicked = true;
            break;
          } catch (e) {
            // Try next selector
          }
        }

        if (!clicked) {
          console.warn(`⚠️ Could not click any of: ${selectors.join(', ')}`);
        }
      } else if (step.waitFor) {
        await page.waitForSelector(step.waitFor, { state: "visible", timeout: step.timeout ?? 15000 });
      } else if (step.eval) {
        await page.evaluate(step.eval);
        await page.waitForLoadState("networkidle").catch(() => {});
      } else if (step.wait) {
        await page.waitForTimeout(step.wait);
      } else if (step.type) {
        // Try multiple selector strategies for typing
        const selectors = Array.isArray(step.type) ? step.type : [step.type];
        let typed = false;

        for (const selector of selectors) {
          try {
            await page.waitForSelector(selector, { state: "visible", timeout: 3000 });
            await page.type(selector, step.text, { delay: 100 });
            typed = true;
            break;
          } catch (e) {
            // Try next selector
          }
        }

        if (!typed) {
          console.warn(`⚠️ Could not type in any of: ${selectors.join(', ')}`);
        }
      } else if (step.select) {
        await page.selectOption(step.select, step.option);
      } else if (step.screenshot) {
        const screenshotPath = path.join(step.outputDir, step.screenshot);
        await page.screenshot({
          path: screenshotPath,
          fullPage: false,
          clip: { x: 0, y: 0, ...config.viewport }
        });
        console.log(`📸 Screenshot saved: ${screenshotPath}`);
      }
    } catch (error) {
      console.warn(`⚠️ Step failed: ${error.message}`);
      // Continue with next step instead of failing completely
    }
  }
}

async function runWalkthroughDemo(page, demo, outputDir, context) {
   console.log(`🎬 Starting 30-second walkthrough: ${demo.name}`);

    try {
      // Navigate with robust error handling
      await page.goto(config.baseUrl + demo.url, {
        waitUntil: "domcontentloaded",
        timeout: 60000
      });

     // Wait for page to stabilize
     await page.waitForTimeout(3000);

     // Check if page loaded successfully
     const title = await page.title().catch(() => 'Unknown');
     console.log(`📄 Page loaded: ${title}`);

     // Execute interactive actions
     console.log(`🎯 Executing ${demo.actions.length} actions for ${demo.name}...`);
     try {
       await runNavSteps(page, demo.actions);
       console.log(`✅ Actions completed for ${demo.name}`);
     } catch (actionError) {
       console.warn(`⚠️ Some actions failed for ${demo.name}:`, actionError.message);
     }

     // Continue recording for remaining time to reach 30 seconds total
     const elapsedTime = 3000; // Time already elapsed (navigation + stabilization)
     const remainingTime = Math.max(0, 27000 - elapsedTime); // 30 seconds - elapsed time
     console.log(`📹 Recording for additional ${remainingTime}ms to complete 30-second walkthrough...`);

     await page.waitForTimeout(remainingTime);

     // Video will be automatically saved when context closes
     console.log(`✅ 30-second video walkthrough completed: ${demo.name}`);

     // Also create a representative screenshot
     const screenshotPath = path.join(outputDir, `${demo.name}_walkthrough.png`);
     try {
       await page.screenshot({
         path: screenshotPath,
         fullPage: false,
         clip: { x: 0, y: 0, ...config.viewport }
       });
       console.log(`📸 Walkthrough screenshot saved: ${screenshotPath}`);
     } catch (error) {
       console.warn(`⚠️ Could not create walkthrough screenshot:`, error.message);
     }

   } catch (error) {
     console.warn(`⚠️ Walkthrough failed for ${demo.name}, falling back to screenshot:`, error.message);
     // Fallback to single screenshot
     try {
       const screenshotPath = path.join(outputDir, `${demo.name}_fallback.png`);
       await page.screenshot({
         path: screenshotPath,
         fullPage: false,
         clip: { x: 0, y: 0, ...config.viewport }
       });
       console.log(`📸 Fallback screenshot saved: ${screenshotPath}`);
     } catch (fallbackError) {
       console.error(`❌ Even fallback screenshot failed for ${demo.name}:`, fallbackError.message);
     }
   }

   // Rename the video file after context operations
   try {
     const videoFiles = fs.readdirSync(outputDir).filter(file => file.endsWith('.webm'));
     const hashFile = videoFiles.find(file => file !== `${demo.name}.webm`);
     if (hashFile) {
       const oldPath = path.join(outputDir, hashFile);
       const newPath = path.join(outputDir, `${demo.name}.webm`);
       fs.renameSync(oldPath, newPath);
       console.log(`📹 Video renamed: ${hashFile} → ${demo.name}.webm`);
     }
   } catch (renameError) {
     console.warn(`⚠️ Could not rename video for ${demo.name}:`, renameError.message);
   }
}

async function takeFeatureScreenshots(page, features, outputDir) {
  console.log('\n📸 Taking 16:9 feature screenshots...');

  for (const feature of features) {
    try {
      console.log(`📸 Capturing ${feature.name}...`);
      await page.goto(config.baseUrl + feature.url, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(3000);

      const screenshotPath = path.join(outputDir, `${feature.name}_16x9.png`);
      await page.screenshot({
        path: screenshotPath,
        fullPage: false,
        clip: { x: 0, y: 0, ...config.viewport }
      });
      console.log(`✅ Screenshot saved: ${screenshotPath}`);
    } catch (error) {
      console.warn(`⚠️ Screenshot failed for ${feature.name}:`, error.message);
    }
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });

  try {
    // Create output directories
    const videosDir = config.videosDir;
    const screenshotsDir = config.screenshotsDir;
    await ensureDir(videosDir);
    await ensureDir(screenshotsDir);

    // Dashboard feature walkthroughs (30-second videos + GIFs)
    const walkthroughDemos = config.walkthroughDemos;

    // Feature screenshots (16:9 aspect ratio)
    const featureScreenshots = config.featureScreenshots;

    console.log('\n🎬 Starting Dashboard Feature Walkthroughs...');

    for (const demo of walkthroughDemos) {
       const context = await browser.newContext({
         ...devices["Desktop Chrome"],
         viewport: config.viewport,
         colorScheme: "light",
         ignoreHTTPSErrors: true,
         recordVideo: {
           dir: videosDir,
           size: config.viewport
         }
       });

       const page = await context.newPage();
       try {
         await runWalkthroughDemo(page, demo, videosDir, context);
       } catch (error) {
         console.error(`❌ Failed to run walkthrough ${demo.name}:`, error);
       } finally {
         await context.close();
         // Wait a bit for video file to be written
         await new Promise(resolve => setTimeout(resolve, 1000));
       }
     }

    // Take 16:9 feature screenshots
    const screenshotContext = await browser.newContext({
      ...devices["Desktop Chrome"],
      viewport: config.viewport,
      colorScheme: "light",
      ignoreHTTPSErrors: true
    });

    const screenshotPage = await screenshotContext.newPage();
    try {
      await takeFeatureScreenshots(screenshotPage, featureScreenshots, screenshotsDir);
    } catch (error) {
      console.error('❌ Failed to take feature screenshots:', error);
    } finally {
      await screenshotContext.close();
    }

  } finally {
    await browser.close();
  }

  console.log('\n🎉 Automation complete! Check the screenshots/ directory for videos, GIFs, and screenshots.');
}

main().catch(console.error);