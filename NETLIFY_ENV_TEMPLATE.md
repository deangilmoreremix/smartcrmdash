# SmartCRM Dash - Netlify Environment Variables Template

## Overview

This template provides all the environment variables needed to deploy SmartCRM Dash to Netlify. Copy these variables and set them in your Netlify dashboard.

## Required Variables (Must be set)

### Supabase Configuration
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Optional Variables (Set only if features are used)

### AI Service Keys
```bash
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

## Server-Side Variables (For Edge Functions)

### Database & Supabase
```bash
DATABASE_URL=your_database_url
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### API Keys (Server-side only)
```bash
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

### Server Configuration
```bash
PORT=5000
NODE_ENV=production
```

## How to Set in Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your SmartCRM project
3. Go to **Site Settings** → **Environment Variables**
4. Click **Add Variable** for each required variable
5. Set the variable name and value
6. Choose appropriate scope (All branches recommended)
7. **Redeploy** after adding variables

## Security Notes

- **VITE_** prefixed variables are exposed to the browser
- Server-side variables are only accessible to Netlify functions
- Never commit actual API keys to version control
- Use different keys for development and production
- Rotate keys regularly for security

## Feature Mapping

### Core Features (Always Required)
- `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`: Database and authentication

### AI Features (Optional)
- `VITE_OPENAI_API_KEY`: Chat, email composition, content generation
- `VITE_GEMINI_API_KEY`: Advanced AI analysis, vision features
- `VITE_ELEVENLABS_API_KEY`: Voice synthesis, audio features

### Edge Functions (Server-side)
- `SUPABASE_SERVICE_ROLE_KEY`: Admin operations
- Server-side API keys: Backend AI processing

## Troubleshooting

### App Won't Load
- Verify all required `VITE_*` variables are set
- Check Supabase project is accessible
- Review browser console for errors

### AI Features Not Working
- Ensure corresponding `VITE_*` API keys are set
- Verify keys have sufficient credits and permissions

### Build Fails
- Check `NODE_VERSION` is set to "22"
- Ensure build settings are correct in Netlify

## Support

For deployment issues, refer to:
- [NETLIFY_DEPLOYMENT_GUIDE.md](NETLIFY_DEPLOYMENT_GUIDE.md)
- [NETLIFY_DEPLOYMENT_FIX.md](NETLIFY_DEPLOYMENT_FIX.md)

---

**Last Updated**: 2025-11-05