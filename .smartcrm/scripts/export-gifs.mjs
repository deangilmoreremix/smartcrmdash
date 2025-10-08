import ffmpegPath from 'ffmpeg-static';
import { readdirSync, mkdirSync, existsSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const RESULTS_DIR = 'outputs/test-results';
const VIDEOS_DIR = '../screenshots/videos';
const OUT_DIR = 'outputs/media';
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const toProcess = [];

// Process Playwright test videos
if (existsSync(RESULTS_DIR)) {
  const testDirs = readdirSync(RESULTS_DIR).filter(n => !n.startsWith('.'));
  for (const dir of testDirs) {
    const full = join(RESULTS_DIR, dir);
    const files = readdirSync(full);
    const vid = files.find(f => f.endsWith('.webm'));
    if (!vid) continue;
    const videoPath = join(full, vid);

    const baseName = dir
      .replace(/\s+/g, '-')
      .replace(/--chromium.*/i, '')
      .toLowerCase();

    toProcess.push({ videoPath, baseName });
  }
}

// Process interactive demo videos
if (existsSync(VIDEOS_DIR)) {
  const videoFiles = readdirSync(VIDEOS_DIR).filter(f => f.endsWith('.webm'));
  for (const videoFile of videoFiles) {
    const videoPath = join(VIDEOS_DIR, videoFile);
    const baseName = videoFile.replace('.webm', '').toLowerCase();
    toProcess.push({ videoPath, baseName });
  }
}

function runFFmpeg(args) {
  const res = spawnSync(ffmpegPath, args, { stdio: 'inherit' });
  if (res.status !== 0) {
    console.error('ffmpeg failed', { args });
  }
}

for (const item of toProcess) {
  const { videoPath, baseName } = item;
  const mp4Out = join(OUT_DIR, `${baseName}.mp4`);
  const gifOut = join(OUT_DIR, `${baseName}.gif`);

  // Convert to MP4
  runFFmpeg(['-y', '-i', videoPath, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', mp4Out]);

  // Convert to GIF
  runFFmpeg([
    '-y', '-i', mp4Out,
    '-filter_complex', 'fps=12,scale=1280:-1:flags=lanczos,split [a][b]; [a] palettegen [p]; [b][p] paletteuse',
    gifOut
  ]);
}

console.log(`✅ Exported media to ${OUT_DIR}`);