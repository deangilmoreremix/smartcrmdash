# SmartCRM Dash - Build Verification Guide

## Overview

This guide provides scripts and procedures to verify that your SmartCRM Dash application builds correctly before deployment to Netlify.

## Local Build Verification

### Basic Build Test

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Run build
npm run build

# Verify build output
ls -la dist/
```

**Expected Output:**
- `dist/` directory should be created
- Build should complete without errors
- No TypeScript or ESLint errors

### Build with Preview

```bash
# Build and preview locally
npm run build:verify
```

This command:
1. Builds the application
2. Starts a preview server on port 4173
3. Allows testing the production build locally

### Manual Verification Steps

After build completion, verify:

1. **Bundle Size**: Check `dist/assets/` for reasonable file sizes
2. **Index File**: Verify `dist/index.html` exists and is properly structured
3. **Assets**: Ensure CSS, JS, and other assets are generated
4. **Source Maps**: Check for `.map` files in production build

## Automated Build Verification Script

Create `scripts/verify-build.js`:

```javascript
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying SmartCRM Dash build...\n');

// Check if dist directory exists
const distPath = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distPath)) {
  console.error('❌ dist/ directory not found. Build may have failed.');
  process.exit(1);
}

console.log('✅ dist/ directory exists');

// Check for essential files
const essentialFiles = [
  'index.html',
  'assets/index-*.css',
  'assets/index-*.js'
];

let allFilesPresent = true;
essentialFiles.forEach(pattern => {
  const files = fs.readdirSync(path.join(distPath, pattern.includes('/') ? 'assets' : ''))
    .filter(file => file.match(pattern.replace('*', '.*')));

  if (files.length === 0) {
    console.error(`❌ ${pattern} not found`);
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

### Running the Verification Script

```bash
# From client directory
npm run deploy:check
```

## Netlify Build Simulation

### Local Netlify Build Test

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build with Netlify settings
cd client
netlify build --context production
```

### Environment Variable Testing

Create a test environment file for local verification:

```bash
# Create test env file
cp .env.example .env.test

# Edit with test values
# VITE_SUPABASE_URL=https://test-project.supabase.co
# VITE_SUPABASE_ANON_KEY=test-anon-key
```

### Module Federation Testing

Verify remote modules are accessible:

```javascript
// Test script for remote modules
const remotes = [
  'https://calendar.smartcrm.vip/assets/remoteEntry.js',
  'https://analytics.smartcrm.vip/assets/remoteEntry.js',
  'https://contacts.smartcrm.vip/assets/remoteEntry.js',
  // Add other remotes
];

async function testRemotes() {
  for (const remote of remotes) {
    try {
      const response = await fetch(remote);
      if (response.ok) {
        console.log(`✅ ${remote} is accessible`);
      } else {
        console.error(`❌ ${remote} returned ${response.status}`);
      }
    } catch (error) {
      console.error(`❌ ${remote} failed: ${error.message}`);
    }
  }
}

testRemotes();
```

## Performance Verification

### Bundle Analysis

```bash
# Install bundle analyzer
npm install --save-dev vite-bundle-analyzer

# Analyze bundle
npx vite-bundle-analyzer dist/stats.html
```

### Lighthouse Testing

```bash
# Install Lighthouse
npm install -g lighthouse

# Test built application
lighthouse http://localhost:4173 --output html --output-path report.html
```

## Common Build Issues & Solutions

### Issue: Build Fails with Import Errors
**Solution:**
- Check all import paths are correct
- Verify all dependencies are installed
- Ensure Vite aliases are properly configured

### Issue: TypeScript Errors
**Solution:**
- Run `npm run lint` to identify issues
- Check TypeScript configuration
- Verify type definitions are installed

### Issue: Large Bundle Size
**Solution:**
- Use dynamic imports for code splitting
- Implement lazy loading for routes
- Optimize images and assets
- Remove unused dependencies

### Issue: Module Federation Errors
**Solution:**
- Verify remote URLs are accessible
- Check CORS configuration
- Ensure remoteEntry.js files exist
- Validate shared dependencies

## Pre-deployment Checklist

- [ ] Build completes without errors
- [ ] Bundle size is reasonable (< 5MB)
- [ ] All essential files are generated
- [ ] No environment variables exposed
- [ ] Module federation remotes accessible
- [ ] Preview server works locally
- [ ] Performance metrics acceptable

## Automated CI/CD Integration

### GitHub Actions Example

```yaml
name: Build Verification
on: [push, pull_request]

jobs:
  verify-build:
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

      - name: Run linting
        run: cd client && npm run lint

      - name: Build application
        run: cd client && npm run build

      - name: Verify build
        run: cd client && npm run deploy:check
```

## Monitoring & Alerts

### Build Status Monitoring
- Set up notifications for build failures
- Monitor build times and success rates
- Track bundle size changes over time

### Performance Monitoring
- Set up Core Web Vitals tracking
- Monitor runtime performance
- Track user experience metrics

---

**Last Updated**: 2025-11-05
**Purpose**: Ensure reliable deployments to Netlify