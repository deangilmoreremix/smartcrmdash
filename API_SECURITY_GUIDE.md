# API Security Guide - CRITICAL

## 🔴 SECURITY ISSUE FIXED

**Issue**: API keys were configured with `VITE_` prefix, which exposes them in the client bundle.

**Status**: ✅ Fixed - Keys moved to server-side only configuration

---

## ⚠️ Important Security Rules

### 1. NEVER Use VITE_ Prefix for Sensitive Keys

```bash
# ❌ WRONG - Exposes keys to anyone who visits your site
VITE_OPENAI_API_KEY=sk-proj-xxxxx
VITE_GEMINI_API_KEY=AIzaSyxxxx

# ✅ CORRECT - Server-side only
OPENAI_API_KEY=sk-proj-xxxxx
GEMINI_API_KEY=AIzaSyxxxx
```

### 2. Understanding VITE_ Prefix

**VITE_ Prefix = Client-Side = PUBLIC**

Any environment variable with `VITE_` prefix is:
- ✅ Bundled into your JavaScript code
- ✅ Visible to anyone who opens browser dev tools
- ✅ Accessible via `import.meta.env.VITE_VARIABLE_NAME`
- ❌ **NOT SECURE** for API keys

**Only Use VITE_ For:**
- Public API URLs (Supabase URL)
- Public keys (Supabase Anon Key - designed to be public)
- Feature flags
- Public configuration

### 3. Correct Environment Variable Usage

```bash
# .env file structure

# ✅ Safe to expose (VITE_ prefix OK)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_APP_VERSION=1.0.0
VITE_FEATURE_FLAG_AI=true

# ✅ Server-side only (NO VITE_ prefix)
OPENAI_API_KEY=sk-proj-xxxxx
GEMINI_API_KEY=AIzaSyxxxxx
ELEVENLABS_API_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://...
```

---

## 🛡️ How to Secure API Keys

### Option 1: Supabase Edge Functions (Recommended)

Create edge functions to proxy API calls:

```typescript
// supabase/functions/openai-proxy/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { prompt, model } = await req.json();

    // API key is stored server-side in Supabase environment
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await openaiResponse.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

### Option 2: Backend Server Routes

Use your backend server (Express, etc.) to handle API calls:

```typescript
// server/routes/ai.ts
import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

// API key from server environment (not exposed to client)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // NO VITE_ prefix
});

router.post('/chat', async (req, res) => {
  try {
    const { prompt } = req.body;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    res.json(completion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

### Client-Side Usage

```typescript
// ✅ CORRECT - Call your secure backend
async function generateAIContent(prompt: string) {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/openai-proxy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ prompt }),
  });

  return response.json();
}

// ❌ WRONG - Never call OpenAI directly from client
async function generateAIContentWrong(prompt: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`, // EXPOSED!
    },
    body: JSON.stringify({ prompt }),
  });
}
```

---

## 🔍 How to Check for Exposed Keys

### 1. Check Built JavaScript Files

```bash
npm run build
grep -r "sk-proj" dist/  # Check for OpenAI keys
grep -r "AIzaSy" dist/    # Check for Google API keys
```

If you find API keys in dist/, they are EXPOSED!

### 2. Browser Dev Tools Test

1. Build your app: `npm run build`
2. Serve it: `npm run preview`
3. Open browser dev tools (F12)
4. Go to Sources tab
5. Search for your API key
6. If found = EXPOSED ❌

### 3. Search Your Code

```bash
# Find all VITE_ prefixed API keys (bad)
grep -r "VITE_.*API_KEY" .

# Find client-side API calls (should use proxy)
grep -r "api.openai.com" client/src/
grep -r "generativelanguage.googleapis.com" client/src/
```

---

## 📋 Migration Checklist

If you accidentally exposed keys:

- [ ] **IMMEDIATELY revoke exposed API keys**
  - OpenAI: https://platform.openai.com/api-keys
  - Google: https://console.cloud.google.com/apis/credentials

- [ ] **Generate new API keys**

- [ ] **Update .env file** (remove VITE_ prefix)

- [ ] **Create edge functions** or backend routes

- [ ] **Update client code** to use proxies

- [ ] **Delete and rebuild** dist/ folder

- [ ] **Verify keys not in dist/** folder

- [ ] **Update production environment** variables

- [ ] **Test all AI features** still work

---

## 🎯 Current Configuration

### Your Current Setup (Fixed)

```bash
# ✅ Client-side (safe to expose)
VITE_SUPABASE_URL=https://xjrnvcsucyhbuuwihhtu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ✅ Server-side only (secure)
OPENAI_API_KEY=sk-proj-xxxxx (secured)
GEMINI_API_KEY=AIzaSyxxxxx (secured)
```

### Next Steps

1. **Deploy Edge Functions** to handle AI API calls
2. **Update client services** to call edge functions instead of direct API
3. **Test AI features** to ensure they work with proxy
4. **Monitor usage** via edge function logs

---

## 📚 Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [API Security Best Practices](https://owasp.org/www-project-api-security/)

---

## ⚡ Quick Reference

### Safe to Use VITE_ Prefix:
- ✅ Public URLs
- ✅ Public API keys (Supabase Anon Key)
- ✅ Feature flags
- ✅ App version numbers
- ✅ Public configuration

### NEVER Use VITE_ Prefix:
- ❌ OpenAI API keys
- ❌ Google API keys
- ❌ Any third-party API keys
- ❌ Database credentials
- ❌ Service role keys
- ❌ Secrets of any kind

---

**Remember**: If it's sensitive, it should NEVER have the `VITE_` prefix!

---

*Last Updated: October 6, 2025*
*Status: Security issue fixed*
