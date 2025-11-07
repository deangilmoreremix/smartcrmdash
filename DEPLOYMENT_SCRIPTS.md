# SmartCRM Dash - Deployment Scripts & Automation

## Overview

This document provides scripts and automation tools to streamline the deployment process for SmartCRM Dash to Netlify.

## Package.json Scripts (Client Directory)

Add these scripts to `client/package.json`:

```json
{
  "scripts": {
    "build": "vite build",
    "dev": "vite",
    "lint": "eslint .",
    "preview": "vite preview",
    "build:verify": "npm run build && npm run preview -- --port 4173 --host",
    "deploy:check": "node ../../scripts/verify-build.js",
    "netlify:build": "npm run build",
    "env:check": "node ../../scripts/check-env.js",
    "federation:test": "node ../../scripts/test-federation.js"
  }
}
```

## Build Verification Script

Create `scripts/verify-build.js`:

```javascript
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying SmartCRM Dash build...\n');

// Check if dist directory exists
const distPath = path.join(__dirname, '..', 'client', 'dist');
if (!fs.existsSync(distPath)) {
  console.error('❌ client/dist/ directory not found. Build may have failed.');
  process.exit(1);
}

console.log('✅ client/dist/ directory exists');

// Check for essential files
const essentialFiles = [
  'index.html',
  'assets/index-*.css',
  'assets/index-*.js'
];

let allFilesPresent = true;
essentialFiles.forEach(pattern => {
  const dirPath = pattern.includes('/') ? path.join(distPath, 'assets') : distPath;
  const files = fs.readdirSync(dirPath)
    .filter(file => {
      const regex = new RegExp(pattern.replace('*', '.*').replace('/', ''));
      return regex.test(file);
    });

  if (files.length === 0) {
    console.error(`❌ ${pattern} not found in ${dirPath}`);
    allFilesPresent = false;
  } else {
    console.log(`✅ ${pattern} found (${files.length} file(s))`);
  }
});

// Check bundle size
const assetsPath = path.join(distPath, 'assets');
if (fs.existsSync(assetsPath)) {
  const files = fs.readdirSync(assetsPath);
  let totalSize = 0;

  files.forEach(file => {
    const filePath = path.join(assetsPath, file);
    const stats = fs.statSync(filePath);
    totalSize += stats.size;
  });

  const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  console.log(`📊 Total bundle size: ${sizeMB} MB`);

  if (totalSize > 5 * 1024 * 1024) { // 5MB
    console.warn('⚠️  Bundle size is large. Consider optimization.');
  } else {
    console.log('✅ Bundle size is reasonable');
  }
}

// Check for environment variables in build
const indexContent = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');
if (indexContent.includes('VITE_')) {
  console.error('❌ VITE_ variables found in built files. Environment variables may be exposed.');
  process.exit(1);
} else {
  console.log('✅ No environment variables exposed in build');
}

if (allFilesPresent) {
  console.log('\n🎉 Build verification passed!');
  process.exit(0);
} else {
  console.error('\n💥 Build verification failed!');
  process.exit(1);
}
```

## Environment Variables Checker

Create `scripts/check-env.js`:

```javascript
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking environment variables...\n');

// Required environment variables
const requiredVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

const optionalVars = [
  'VITE_OPENAI_API_KEY',
  'VITE_GEMINI_API_KEY',
  'VITE_ELEVENLABS_API_KEY'
];

// Check .env.example
const envExamplePath = path.join(__dirname, '..', 'client', '.env.example');
if (fs.existsSync(envExamplePath)) {
  console.log('✅ client/.env.example exists');
  const envContent = fs.readFileSync(envExamplePath, 'utf8');

  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      console.log(`✅ ${varName} documented in .env.example`);
    } else {
      console.warn(`⚠️  ${varName} not found in .env.example`);
    }
  });
} else {
  console.error('❌ client/.env.example not found');
}

// Check for actual .env file (should not exist in repo)
const envPath = path.join(__dirname, '..', 'client', '.env');
if (fs.existsSync(envPath)) {
  console.warn('⚠️  client/.env file exists - should not be committed to repository');
} else {
  console.log('✅ No client/.env file found (good for security)');
}

console.log('\n📋 Environment Variables Summary:');
console.log('Required:');
requiredVars.forEach(v => console.log(`  - ${v}`));
console.log('Optional:');
optionalVars.forEach(v => console.log(`  - ${v}`));

console.log('\n💡 Remember to set these in Netlify Dashboard → Site Settings → Environment Variables');
```

## Module Federation Tester

Create `scripts/test-federation.js`:

```javascript
const https = require('https');

console.log('🔍 Testing Module Federation remotes...\n');

const remotes = [
  {
    name: 'Calendar App',
    url: 'https://calendar.smartcrm.vip/assets/remoteEntry.js'
  },
  {
    name: 'Analytics App',
    url: 'https://analytics.smartcrm.vip/assets/remoteEntry.js'
  },
  {
    name: 'Contacts App',
    url: 'https://contacts.smartcrm.vip/assets/remoteEntry.js'
  },
  {
    name: 'Pipeline App',
    url: 'https://pipeline.smartcrm.vip/assets/remoteEntry.js'
  },
  {
    name: 'Agency App',
    url: 'https://agency.smartcrm.vip/assets/remoteEntry.js'
  },
  {
    name: 'Research App',
    url: 'https://research.smartcrm.vip/assets/remoteEntry.js'
  }
];

function testRemote(remote) {
  return new Promise((resolve) => {
    const url = new URL(remote.url);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'HEAD'
    };

    const req = https.request(options, (res) => {
      if (res.statusCode === 200) {
        console.log(`✅ ${remote.name}: ${remote.url}`);
        resolve(true);
      } else {
        console.error(`❌ ${remote.name}: HTTP ${res.statusCode} - ${remote.url}`);
        resolve(false);
      }
    });

    req.on('error', (err) => {
      console.error(`❌ ${remote.name}: ${err.message} - ${remote.url}`);
      resolve(false);
    });

    req.setTimeout(5000, () => {
      console.error(`❌ ${remote.name}: Timeout - ${remote.url}`);
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

async function testAllRemotes() {
  console.log('Testing remote module accessibility...\n');

  const results = await Promise.all(remotes.map(testRemote));
  const successCount = results.filter(Boolean).length;

  console.log(`\n📊 Results: ${successCount}/${remotes.length} remotes accessible`);

  if (successCount === remotes.length) {
    console.log('🎉 All module federation remotes are accessible!');
    process.exit(0);
  } else {
    console.error('💥 Some module federation remotes are not accessible!');
    console.log('This may cause the application to fail loading certain features.');
    process.exit(1);
  }
}

testAllRemotes();
```

## Pre-deployment Automation Script

Create `scripts/pre-deploy.js`:

```javascript
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 SmartCRM Dash Pre-deployment Checks\n');

let allChecksPass = true;

function runCommand(command, description) {
  try {
    console.log(`🔍 ${description}...`);
    execSync(command, { stdio: 'pipe' });
    console.log(`✅ ${description} passed`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed: ${error.message}`);
    return false;
  }
}

// Check Node.js version
const nodeVersion = process.version;
console.log(`📋 Node.js version: ${nodeVersion}`);
if (!nodeVersion.includes('v20') && !nodeVersion.includes('v22')) {
  console.warn('⚠️  Node.js version may not match Netlify environment (v22 recommended)');
}

// Run build verification
if (!runCommand('cd client && npm run deploy:check', 'Build verification')) {
  allChecksPass = false;
}

// Check environment variables
if (!runCommand('cd client && npm run env:check', 'Environment variables check')) {
  allChecksPass = false;
}

// Test module federation
if (!runCommand('cd client && npm run federation:test', 'Module federation test')) {
  allChecksPass = false;
}

// Run linting
if (!runCommand('cd client && npm run lint', 'Code linting')) {
  allChecksPass = false;
}

// Final result
console.log('\n' + '='.repeat(50));
if (allChecksPass) {
  console.log('🎉 All pre-deployment checks passed!');
  console.log('Ready to deploy to Netlify 🚀');
  process.exit(0);
} else {
  console.error('💥 Some pre-deployment checks failed!');
  console.error('Please fix the issues before deploying.');
  process.exit(1);
}
```

## Netlify Build Hook Script

Create `scripts/netlify-build.js`:

```javascript
#!/usr/bin/env node

/**
 * Netlify Build Script
 * This script runs during Netlify builds to perform additional checks
 */

const { execSync } = require('child_process');

console.log('🏗️  SmartCRM Dash Netlify Build Script\n');

// Verify we're in the correct directory
const currentDir = process.cwd();
console.log(`📁 Current directory: ${currentDir}`);

// Check if we're in the client directory (should be due to base = "client")
if (!currentDir.includes('client')) {
  console.error('❌ Not in client directory. Netlify base configuration may be incorrect.');
  process.exit(1);
}

console.log('✅ Correct build directory confirmed');

// Verify environment variables are set
const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
let envVarsOk = true;

requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`❌ Required environment variable ${varName} is not set`);
    envVarsOk = false;
  } else {
    console.log(`✅ ${varName} is set`);
  }
});

if (!envVarsOk) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

console.log('✅ Environment variables verified');

// Run the actual build
try {
  console.log('🔨 Running Vite build...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Verify build output
const fs = require('fs');
const path = require('path');

const distPath = path.join(currentDir, 'dist');
if (!fs.existsSync(distPath)) {
  console.error('❌ dist/ directory not created');
  process.exit(1);
}

console.log('✅ Build output verified');
console.log('🎉 Netlify build script completed successfully!');
```

## Usage Instructions

### Local Development

```bash
# Run all pre-deployment checks
npm run pre-deploy

# Or run individual checks
cd client
npm run deploy:check    # Verify build
npm run env:check       # Check environment variables
npm run federation:test # Test module federation
```

### Netlify Integration

1. **Add build hook** (optional):
   - In `netlify.toml`, add a build command that runs the build script
   - Or use Netlify's build hooks for notifications

2. **Environment variables**:
   - Set all required variables in Netlify dashboard
   - Use the same variable names as documented

3. **Build settings**:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `dist`

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Pre-deployment Checks
on: [push, pull_request]

jobs:
  pre-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
          cache: 'npm'
          cache-dependency-path: client/package-lock.json

      - name: Install dependencies
        run: cd client && npm ci

      - name: Run pre-deployment checks
        run: npm run pre-deploy

      - name: Build application
        run: cd client && npm run build
```

## Monitoring & Notifications

### Build Status Webhook

```javascript
// Example webhook handler for build notifications
const express = require('express');
const app = express();

app.post('/netlify-webhook', express.json(), (req, res) => {
  const { state, name, url } = req.body;

  console.log(`🏗️  Build ${state} for ${name}: ${url}`);

  if (state === 'ready') {
    console.log('✅ Deployment successful!');
    // Send success notification
  } else if (state === 'error') {
    console.error('❌ Build failed!');
    // Send failure notification
  }

  res.sendStatus(200);
});

app.listen(3000, () => console.log('Webhook server running on port 3000'));
```

## Troubleshooting

### Common Script Issues

**Script not found**: Ensure scripts are executable (`chmod +x scripts/*.js`)

**Module not found**: Run `npm install` in the correct directory

**Environment variables not set**: Check Netlify dashboard configuration

**Build timeouts**: Increase Netlify build timeout settings

---

**Last Updated**: 2025-11-05
**Purpose**: Automate deployment verification and improve reliability