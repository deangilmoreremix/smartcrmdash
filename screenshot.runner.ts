import { chromium, devices, Page, BrowserContext } from "@playwright/test";
import fs from "fs";
import path from "path";
import ffmpegStatic from 'ffmpeg-static';

type Viewport = { width: number; height: number };
type NavStep =
  | { click: string }
  | { waitFor: string; timeout?: number }
  | { eval: string }
  | { wait: number }
  | { type: string; text: string }
  | { select: string; option: string };

type Shot = {
  label: string;
  selector?: string;
  fullPage?: boolean;
  waitFor?: number;
};

type InteractiveDemo = {
  name: string;
  url: string;
  actions: NavStep[];
  duration?: number; // seconds to record
};

type PageTarget = {
  name: string;
  baseUrl?: string; // SPA entry
  url?: string;     // direct URL (remote apps)
  navigate?: NavStep[];
  shots: Shot[];
};

type Config = {
  outputDir: string;
  defaultWait: number;
  viewports: Record<string, Viewport>;
  themes: ("light" | "dark")[];
  pages: PageTarget[];
  interactiveDemos?: InteractiveDemo[];
};

async function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

async function runNavSteps(page: any, steps: NavStep[] = []) {
   for (const step of steps) {
     if ("click" in step) {
       try {
         await page.click(step.click, { timeout: 5000 });
       } catch (error) {
         console.log(`⚠️ Click selector not found or failed: ${step.click}, skipping...`);
       }
     } else if ("waitFor" in step) {
       await page.waitForSelector(step.waitFor, { state: "visible", timeout: step.timeout ?? 15000 });
     } else if ("eval" in step) {
       await page.evaluate(step.eval);
       await page.waitForLoadState("networkidle").catch(() => {});
     } else if ("wait" in step) {
       await page.waitForTimeout(step.wait);
     } else if ("type" in step) {
       await page.type(step.type, step.text, { delay: 100 }); // Human-like typing
     } else if ("select" in step) {
       await page.selectOption(step.select, step.option);
     }
   }
}

async function runInteractiveDemo(page: Page, demo: InteractiveDemo, outputDir: string) {
   console.log(`🎬 Starting interactive demo: ${demo.name}`);

   // Start video recording
   const videoPath = path.join(outputDir, `${demo.name}.mp4`);
   console.log(`📹 Video will be saved to: ${videoPath}`);
   await page.context().addInitScript(() => {
     // Inject video recording script
     // @ts-ignore
     const script = document.createElement('script');
     script.src = 'https://cdn.jsdelivr.net/npm/rrweb@2.0.0-alpha.11/dist/rrweb.min.js';
     // @ts-ignore
     document.head.appendChild(script);
   });

   // Navigate to the demo URL
   await page.goto(demo.url, { waitUntil: "networkidle", timeout: 30000 });

   // Wait for page to stabilize
   await page.waitForTimeout(2000);

   // Execute interactive actions
   await runNavSteps(page, demo.actions);

   // Record for specified duration or default 10 seconds
   const duration = demo.duration || 10;
   console.log(`📹 Recording for ${duration} seconds...`);

   // Use page.video() if available, otherwise fallback to screenshot sequence
   try {
     // For video recording, we'll capture screenshots at intervals to create a video
     const screenshots: string[] = [];
     const interval = 500; // 500ms intervals
     const totalFrames = (duration * 1000) / interval;
     console.log(`🖼️ Starting screenshot capture for ${totalFrames} frames`);

     for (let i = 0; i < totalFrames; i++) {
       const screenshotPath = path.join(outputDir, `temp_${demo.name}_${i.toString().padStart(4, '0')}.png`);
       await page.screenshot({ path: screenshotPath, fullPage: false });
       screenshots.push(screenshotPath);
       await page.waitForTimeout(interval);
     }
     console.log(`🖼️ Screenshot capture completed, ${screenshots.length} frames taken`);

     // Create video from screenshots using ffmpeg
     console.log(`🎥 Starting ffmpeg to create video`);
     const { spawn } = await import('child_process');
     // @ts-ignore
     const ffmpeg = spawn(ffmpegStatic!, [
       '-y', '-framerate', '2',
       '-i', path.join(outputDir, `temp_${demo.name}_%04d.png`),
       '-c:v', 'libx264', '-pix_fmt', 'yuv420p', videoPath
     ]);

     await new Promise((resolve, reject) => {
       ffmpeg.on('close', (code) => {
         console.log(`🎥 Ffmpeg process closed with code ${code}`);
         if (code === 0) resolve(code);
         else reject(new Error(`ffmpeg exited with code ${code}`));
       });
       ffmpeg.on('error', (err) => {
         console.error(`🎥 Ffmpeg error:`, err);
         reject(err);
       });
     });
     console.log(`✅ Ffmpeg completed successfully`);

     // Clean up temporary screenshots
     console.log(`🧹 Cleaning up ${screenshots.length} temporary files`);
     let cleaned = 0;
     for (const screenshot of screenshots) {
       try {
         fs.unlinkSync(screenshot);
         cleaned++;
       } catch (e) {
         console.warn(`⚠️ Failed to delete ${screenshot}:`, e);
       }
     }
     console.log(`🧹 Cleaned up ${cleaned} files`);

     console.log(`✅ Interactive demo video saved: ${videoPath}`);

     // Create GIF version
     console.log(`🎨 Creating GIF version...`);
     const gifPath = path.join(outputDir, `${demo.name}.gif`);
     console.log(`🎨 GIF path: ${gifPath}`);
     console.log(`🎨 Video exists: ${fs.existsSync(videoPath)}`);
     const gifCommand = [
       '-y', '-i', videoPath,
       '-vf', 'fps=5,scale=640:-1:flags=lanczos',
       gifPath
     ];
     console.log(`🎨 GIF command: ffmpeg ${gifCommand.join(' ')}`);
     const gifFfmpeg = spawn(ffmpegStatic!, gifCommand);

     await new Promise((resolve, reject) => {
       gifFfmpeg.on('close', (code) => {
         console.log(`🎨 GIF creation process closed with code ${code}`);
         if (code === 0) {
           console.log(`🎨 GIF file exists after creation: ${fs.existsSync(gifPath)}`);
           resolve(code);
         } else reject(new Error(`gif ffmpeg exited with code ${code}`));
       });
       gifFfmpeg.on('error', (err) => {
         console.error(`🎨 GIF ffmpeg error:`, err);
         reject(err);
       });
     });
     console.log(`✅ Interactive demo GIF saved: ${gifPath}`);

   } catch (error) {
     console.warn(`⚠️ Video recording failed for ${demo.name}, falling back to screenshots:`, error);
     // Fallback to regular screenshots
     const screenshotPath = path.join(outputDir, `${demo.name}_fallback.png`);
     await page.screenshot({ path: screenshotPath, fullPage: true });
     console.log(`📸 Fallback screenshot saved: ${screenshotPath}`);
   }
}

(async () => {
  const cfg: Config = JSON.parse(fs.readFileSync("shots.targets.json", "utf-8"));
  const browser = await chromium.launch();
  try {
    // Run static screenshots first
    for (const [vpName, viewport] of Object.entries(cfg.viewports)) {
      for (const theme of cfg.themes) {
        const context = await browser.newContext({
          ...devices["Desktop Chrome"],
          viewport,
          colorScheme: theme,
          ignoreHTTPSErrors: true
        });
        const page = await context.newPage();

        for (const target of cfg.pages) {
          console.log(`\n=== ${target.name} (${vpName}/${theme}) ===`);

          if (target.url) {
            // Direct URL (remote apps)
            await page.goto(target.url, { waitUntil: "networkidle", timeout: 30000 });
          } else if (target.baseUrl) {
            // SPA entry + nav steps
            await page.goto(target.baseUrl, { waitUntil: "networkidle", timeout: 30000 });
            // Wait a bit more for SPA to hydrate
            await page.waitForTimeout(3000);
            await runNavSteps(page, target.navigate);
          } else {
            continue;
          }

          for (const shot of target.shots) {
            // Allow additional settling
            await page.waitForTimeout(shot.waitFor ?? cfg.defaultWait);

            const dir = `${cfg.outputDir}/${vpName}__${theme}`;
            await ensureDir(dir);
            const file = `${dir}/${target.name}_${shot.label}.png`;

            if (shot.selector) {
              const el = await page.$(shot.selector);
              if (!el) {
                console.warn(`⚠️  Selector not found: ${shot.selector} (skipping)`);
                continue;
              }
              await el.screenshot({ path: file });
            } else {
              await page.screenshot({ path: file, fullPage: !!shot.fullPage });
            }
            console.log(`✅ ${file}`);
          }
        }
        await context.close();
      }
    }

    // Run interactive demos
    if (cfg.interactiveDemos && cfg.interactiveDemos.length > 0) {
      console.log('\n🎬 Starting Interactive Demos...');

      // Create videos directory
      const videosDir = path.join(cfg.outputDir, 'videos');
      await ensureDir(videosDir);

      for (const demo of cfg.interactiveDemos) {
        // Use desktop viewport for interactive demos
        const context = await browser.newContext({
          ...devices["Desktop Chrome"],
          viewport: cfg.viewports.desktop,
          colorScheme: "light", // Start with light theme
          ignoreHTTPSErrors: true,
          recordVideo: {
            dir: videosDir,
            size: cfg.viewports.desktop
          }
        });

        const page = await context.newPage();
        try {
          await runInteractiveDemo(page, demo, videosDir);
        } catch (error) {
          console.error(`❌ Failed to run interactive demo ${demo.name}:`, error);
        } finally {
          console.log(`🎥 Closing context for ${demo.name}, built-in video should be saved`);
          await context.close();
        }
      }
    }

  } finally {
    await browser.close();
  }
})();