# Netlify Deployment Fix Documentation

## Issues Fixed

### 1. **Missing Base Directory Configuration**
- **Problem**: `netlify.toml` was missing `base = "client"` setting
- **Impact**: Netlify was trying to build from root directory instead of `client/`
- **Fix**: Added `base = "client"` to `[build]` section

### 2. **Hardcoded Environment Variables**
- **Problem**: Sensitive Supabase credentials were hardcoded in `netlify.toml`
- **Impact**: Security vulnerability and exposed secrets
- **Fix**: Removed hardcoded variables, must be set in Netlify dashboard

### 3. **Incorrect Publish Directory**
- **Problem**: `publish = "client/dist"` was absolute path
- **Impact**: With `base = "client"`, this becomes incorrect
- **Fix**: Changed to `publish = "dist"` (relative to base directory)

## Required Netlify Environment Variables

Set these in Netlify Dashboard → Site Settings → Environment Variables:

### Client-Side Variables (VITE_ prefixed)
```bash
# Required
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional (only if features are used)
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

### Server-Side Variables (for Edge Functions)
```bash
# Database
DATABASE_URL=your_database_url

# Supabase (Server-side)
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

## Netlify Configuration Summary

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

## Deployment Steps

1. **Set Environment Variables** in Netlify dashboard
2. **Deploy** - Netlify will now:
   - Build from `client/` directory
   - Run `npm run build`
   - Publish from `client/dist/`
3. **Verify** the app loads correctly

## Troubleshooting

### Build Still Failing?
- Check Netlify build logs for specific errors
- Ensure all required environment variables are set
- Verify `client/package.json` has all dependencies

### App Not Loading?
- Check browser console for JavaScript errors
- Verify Supabase connection works
- Ensure remote module federation URLs are accessible

### Environment Variables Not Working?
- Variables must be set in Netlify dashboard, not in code
- Use `VITE_` prefix for client-side variables
- Restart deployment after adding variables

---

**Last Updated**: 2025-11-05
**Fix Applied**: Corrected Netlify configuration for client-based deployment