# SmartCRM Dash - Netlify Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the SmartCRM Dash application to Netlify. The application is a modern React-based CRM system built with Vite, featuring module federation for micro-frontend architecture.

## Prerequisites

### System Requirements
- Node.js 20.x or higher (22.x recommended)
- npm 10.x or higher
- Git repository with access to the codebase

### Netlify Account
- Active Netlify account
- Repository connected to Netlify
- Proper permissions for environment variable management

## Project Structure

```
smartcrmdash/
├── client/                 # Main React application
│   ├── src/               # Source code
│   ├── package.json       # Dependencies and scripts
│   ├── vite.config.ts     # Vite configuration
│   └── dist/              # Build output (generated)
├── netlify.toml           # Netlify configuration
├── server/                # Backend/Edge functions
└── supabase/              # Database migrations
```

## Netlify Configuration

### netlify.toml Settings

```toml
[build]
base = "client"
command = "npm run build"
publish = "dist"

[build.environment]
NODE_VERSION = "22"
NPM_VERSION = "10"
SECRETS_SCAN_ENABLED = "false"
ENVIRONMENT = "production"

[[redirects]]
from = "/*"
to = "/index.html"
status = 200

[[headers]]
for = "/*"
[headers.values]
X-Frame-Options = "DENY"
X-XSS-Protection = "1; mode=block"
X-Content-Type-Options = "nosniff"
Referrer-Policy = "strict-origin-when-cross-origin"
```

### Key Configuration Details

- **Base Directory**: `client` - Build runs from the client directory
- **Build Command**: `npm run build` - Uses Vite to build the application
- **Publish Directory**: `dist` - Output directory relative to base
- **Node Version**: 22 - Matches development environment
- **SPA Redirects**: All routes redirect to index.html for client-side routing

## Environment Variables Setup

### Required Variables

Set these in Netlify Dashboard → Site Settings → Environment Variables:

#### Client-Side Variables (VITE_ prefixed)
```bash
# Supabase Configuration (Required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Service Keys (Optional - only if features are used)
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

#### Server-Side Variables (for Edge Functions)
```bash
# Database
DATABASE_URL=your_database_url

# Supabase Service Role (Server-side only)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# API Keys (Server-side only)
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Server Configuration
PORT=5000
NODE_ENV=production
```

### Environment Variable Scope

- **Build Time**: Variables available during build process
- **Runtime**: Variables available to the application at runtime
- **Post-Processing**: Variables available during post-processing

For this project:
- `VITE_*` variables: Build Time
- Server-side variables: Runtime

## Deployment Process

### Step 1: Repository Setup

1. **Connect Repository**
   - Go to Netlify Dashboard
   - Click "New site from Git"
   - Connect your Git repository
   - Select the main branch

2. **Configure Build Settings**
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

### Step 2: Environment Variables

1. **Access Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add each required variable

2. **Variable Validation**
   - Ensure no `VITE_` variables contain sensitive data
   - Use different keys for production vs development
   - Rotate keys regularly for security

### Step 3: Deploy

1. **Trigger Deployment**
   - Push changes to the connected branch
   - Or manually trigger deploy in Netlify dashboard

2. **Monitor Build Process**
   - Watch build logs in real-time
   - Check for any error messages
   - Verify all dependencies install correctly

### Step 4: Post-Deployment Verification

1. **Check Application Loading**
   - Visit the deployed URL
   - Verify all pages load correctly
   - Test core functionality

2. **Verify Integrations**
   - Supabase connection
   - AI services (if enabled)
   - Module federation remotes

## Build Optimization

### Vite Configuration Highlights

The application uses several optimization techniques:

- **Code Splitting**: Automatic chunking for better loading
- **Tree Shaking**: Removes unused code
- **Minification**: Terser for production builds
- **Compression**: Gzip and Brotli support

### Module Federation

The app uses dynamic module federation for micro-frontends:

```typescript
// Remote applications
remotes: {
  CalendarApp: 'https://calendar.smartcrm.vip/assets/remoteEntry.js',
  AnalyticsApp: 'https://analytics.smartcrm.vip/assets/remoteEntry.js',
  ContactsApp: 'https://contacts.smartcrm.vip/assets/remoteEntry.js',
  // ... more remotes
}
```

### Performance Monitoring

- **Bundle Analyzer**: Available at `dist/stats.html`
- **Service Worker**: PWA support with caching
- **Runtime Caching**: API responses cached for performance

## Troubleshooting

### Common Build Issues

#### Build Fails with "Module Not Found"
```
Error: Cannot resolve module
```
**Solution**:
- Check import paths are correct
- Ensure all dependencies are in `client/package.json`
- Verify Vite aliases are properly configured

#### Environment Variables Not Available
```
Error: VITE_SUPABASE_URL is not defined
```
**Solution**:
- Check variables are set in Netlify dashboard
- Ensure correct naming (case-sensitive)
- Redeploy after adding variables

#### Module Federation Loading Errors
```
Error: Loading chunk failed
```
**Solution**:
- Verify remote URLs are accessible
- Check CORS configuration
- Ensure remoteEntry.js files exist

### Runtime Issues

#### White Screen on Load
- Check browser console for JavaScript errors
- Verify all environment variables are set
- Check network tab for failed requests

#### Authentication Issues
- Verify Supabase configuration
- Check anon key is correct
- Ensure proper redirect URLs

#### Performance Issues
- Check bundle size with analyzer
- Optimize images and assets
- Review caching strategies

## Security Considerations

### Environment Variables
- Never commit secrets to repository
- Use different keys for each environment
- Rotate keys regularly
- Monitor access logs

### Headers Configuration
The application includes security headers:
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-XSS-Protection` - XSS protection
- `X-Content-Type-Options: nosniff` - MIME type security
- `Referrer-Policy` - Controls referrer information

### Secrets Scanning
- Netlify automatically scans for exposed secrets
- `SECRETS_SCAN_ENABLED = "false"` disables scanning (use with caution)
- Regularly audit environment variables

## Monitoring and Maintenance

### Build Monitoring
- Set up build notifications
- Monitor build times and success rates
- Review build logs regularly

### Performance Monitoring
- Use Netlify Analytics for performance metrics
- Monitor Core Web Vitals
- Track bundle size changes

### Error Tracking
- Implement error boundary components
- Set up error logging services
- Monitor client-side errors

## Rollback Procedures

### Emergency Rollback
1. **Identify Issue**: Determine what's causing the problem
2. **Previous Deploy**: Use Netlify's deploy history
3. **Rollback**: Click "Rollback" on previous working deploy
4. **Verify**: Test the rolled-back version

### Gradual Rollback
1. **Branch Deploy**: Deploy from a stable branch
2. **Staged Rollback**: Test in preview environment first
3. **Full Rollback**: Switch production to stable version

## Advanced Configuration

### Branch Deploys
- Set up preview deployments for feature branches
- Use branch-specific environment variables
- Configure different build settings per branch

### Custom Domains
- Configure custom domain in Netlify dashboard
- Set up SSL certificates (automatic)
- Configure DNS records

### Form Handling
- Netlify Forms for contact forms
- Serverless functions for complex forms
- Integration with external services

## Support and Resources

### Netlify Resources
- [Netlify Documentation](https://docs.netlify.com)
- [Build Configuration](https://docs.netlify.com/configure-builds/overview/)
- [Environment Variables](https://docs.netlify.com/configure-builds/environment-variables/)

### Application-Specific Resources
- Check `COMMIT_DOCS/` for recent changes
- Review `NETLIFY_ENVIRONMENT_SETUP.md` for additional context
- Check `API_SECURITY_GUIDE.md` for security best practices

---

## Quick Reference

### Essential Commands
```bash
# Local development
cd client && npm run dev

# Local build
cd client && npm run build

# Preview build
cd client && npm run preview
```

### Key Files
- `client/package.json` - Dependencies and scripts
- `client/vite.config.ts` - Build configuration
- `netlify.toml` - Deployment configuration
- `NETLIFY_DEPLOYMENT_FIX.md` - Recent fixes documentation

### Critical Environment Variables
- `VITE_SUPABASE_URL` - Database connection
- `VITE_SUPABASE_ANON_KEY` - Client authentication
- All `VITE_*` variables must be prefixed correctly

---

**Last Updated**: 2025-11-05
**Version**: 1.0
**Application**: SmartCRM Dash