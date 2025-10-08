const fs = require('fs');
const path = require('path');
const config = require('./automation-config.json');

// Validate config
if (!config.videoValidation || typeof config.videoValidation.minValidSize !== 'number' ||
    typeof config.videoValidation.estimationFactor !== 'number' ||
    typeof config.videoValidation.estimationMultiplier !== 'number') {
  console.error('❌ Invalid videoValidation configuration in automation-config.json');
  process.exit(1);
}

// Constants for video validation (from config)
const { minValidSize: MIN_VALID_SIZE, estimationFactor: ESTIMATION_FACTOR, estimationMultiplier: ESTIMATION_MULTIPLIER } = config.videoValidation;

// Simple WebM duration estimation (rough calculation)
function estimateWebMDuration(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const fileSize = stats.size;

    // Rough estimation: WebM files are typically ~50-200 KB/s
    // For 30-second videos, we'd expect 1.5-6 MB
    const estimatedDuration = (fileSize / ESTIMATION_FACTOR) * ESTIMATION_MULTIPLIER; // Rough seconds estimate

    return {
      size: fileSize,
      sizeMB: (fileSize / (1024 * 1024)).toFixed(2),
      estimatedDuration: estimatedDuration.toFixed(1),
      isValidSize: fileSize > MIN_VALID_SIZE
    };
  } catch (error) {
    return {
      size: 0,
      sizeMB: '0.00',
      estimatedDuration: '0.0',
      isValidSize: false,
      error: error.message
    };
  }
}

console.log('🎬 SmartCRM Video Validation Report');
console.log('=====================================\n');

const videosDir = config.videosDir;

let videoFiles;
try {
  videoFiles = fs.readdirSync(videosDir).filter(file => file.endsWith('.webm'));
} catch (error) {
  console.error(`❌ Failed to read videos directory '${videosDir}': ${error.message}`);
  process.exit(1);
}
videoFiles.forEach((file, index) => {
  const filePath = path.join(videosDir, file);
  const analysis = estimateWebMDuration(filePath);

  const featureName = file === 'dashboard-overview.webm' ? 'Dashboard Overview' :
                     file.replace('.webm', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  console.log(`${index + 1}. ${featureName}`);
  console.log(`   File: ${file}`);
  if (analysis.error) {
    console.log(`   Error: ${analysis.error}`);
    console.log(`   Status: ❌ File error`);
  } else {
    console.log(`   Size: ${analysis.sizeMB} MB`);
    console.log(`   Estimated Duration: ~${analysis.estimatedDuration} seconds`);
    console.log(`   Status: ${analysis.isValidSize ? '✅ Valid video file' : '❌ Suspiciously small'}`);
  }
  console.log('');
});

console.log('📊 Summary:');
console.log(`   Total videos: ${videoFiles.length}`);
console.log(`   Expected duration: 30 seconds each`);
console.log(`   Expected resolution: 1920x1080 (16:9)`);
console.log(`   Format: WebM (VP8/VP9 codec)`);
console.log('');
console.log('🎯 Test these videos by:');
console.log('   1. Opening video-test.html in a browser');
console.log('   2. Or playing the .webm files directly in a media player');
console.log('   3. Videos should show smooth scrolling through dashboard features');