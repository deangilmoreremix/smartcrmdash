const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const ffmpegPath = require('ffmpeg-static');
const config = require('./automation-config.json');

// Validate config
if (!config.conversionSettings || typeof config.conversionSettings.maxConcurrent !== 'number') {
  console.error('❌ Invalid conversionSettings configuration in automation-config.json');
  process.exit(1);
}

// Validate ffmpeg availability
if (!fs.existsSync(ffmpegPath)) {
  console.error('❌ ffmpeg binary not found at:', ffmpegPath);
  process.exit(1);
}

console.log('🎬 Converting WebM videos to MP4 format...');

const videosDir = config.videosDir;
const webmFiles = fs.readdirSync(videosDir).filter(file => file.endsWith('.webm'));

const MAX_CONCURRENT = config.conversionSettings.maxConcurrent; // Limit concurrent conversions

async function convertFile(file) {
  return new Promise((resolve, reject) => {
    const inputPath = path.join(videosDir, file);
    const outputPath = path.join(videosDir, file.replace('.webm', '.mp4'));

    console.log(`Converting ${file} to MP4...`);

    const ffmpegProcess = spawn(ffmpegPath, [
      '-i', inputPath,
      '-c:v', 'libx264',
      '-c:a', 'aac',
      '-strict', 'experimental',
      outputPath
    ]);

    ffmpegProcess.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ Converted ${file} to ${path.basename(outputPath)}`);
        resolve();
      } else {
        console.error(`❌ Failed to convert ${file}: ffmpeg exited with code ${code}`);
        reject(new Error(`ffmpeg exited with code ${code}`));
      }
    });

    ffmpegProcess.on('error', (error) => {
      console.error(`❌ Failed to start ffmpeg for ${file}:`, error.message);
      reject(error);
    });
  });
}

async function processConversions() {
  for (let i = 0; i < webmFiles.length; i += MAX_CONCURRENT) {
    const batch = webmFiles.slice(i, i + MAX_CONCURRENT);
    const batchPromises = batch.map(file => convertFile(file));
    await Promise.all(batchPromises);
  }
}

processConversions()
  .then(() => {
    console.log('🎉 All conversions completed successfully.');
  })
  .catch((error) => {
    console.error('❌ Some conversions failed:', error.message);
    process.exit(1);
  });
