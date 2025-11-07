# SmartCRM Dash - Netlify Deployment Checklist

## Pre-Deployment Preparation

### ✅ Environment Setup
- [ ] Node.js 20+ installed and verified
- [ ] npm 10+ installed and verified
- [ ] Supabase project created and configured
- [ ] API keys obtained (OpenAI, Gemini, ElevenLabs if needed)
- [ ] Repository cloned and up to date

### ✅ Local Development Verification
- [ ] `npm install` completes successfully in client directory
- [ ] `npm run build` completes without errors
- [ ] `npm run dev` starts development server
- [ ] All core features work locally
- [ ] Supabase connection established
- [ ] AI features functional (if enabled)

### ✅ Netlify Account Setup
- [ ] Netlify account created and verified
- [ ] Repository connected to Netlify
- [ ] Build settings configured:
  - Base directory: `client`
  - Build command: `npm run build`
  - Publish directory: `dist`

## Environment Variables Configuration

### ✅ Required Variables (Set in Netlify Dashboard)
- [ ] `VITE_SUPABASE_URL` - Your Supabase project URL
- [ ] `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

### ✅ Optional Variables (Set if features are used)
- [ ] `VITE_OPENAI_API_KEY` - OpenAI API key
- [ ] `VITE_GEMINI_API_KEY` - Google Gemini API key
- [ ] `VITE_ELEVENLABS_API_KEY` - ElevenLabs API key

### ✅ Build Environment Variables
- [ ] `NODE_VERSION` - Set to "22"
- [ ] `NPM_VERSION` - Set to "10"
- [ ] `SECRETS_SCAN_ENABLED` - Set to "false"
- [ ] `ENVIRONMENT` - Set to "production"

## Deployment Execution

### ✅ Initial Deployment
- [ ] Repository connected to Netlify
- [ ] Build settings verified
- [ ] Environment variables configured
- [ ] First deployment triggered
- [ ] Build completes successfully
- [ ] Site URL accessible

### ✅ Post-Deployment Verification
- [ ] Application loads without errors
- [ ] Login/authentication works
- [ ] Core pages accessible (Dashboard, Contacts, Pipeline)
- [ ] Supabase data loads correctly
- [ ] AI features functional (if enabled)
- [ ] Module federation remotes load
- [ ] Mobile responsiveness verified

## Security & Performance Checks

### ✅ Security Verification
- [ ] No sensitive data exposed in client-side code
- [ ] Environment variables properly scoped
- [ ] HTTPS enabled on custom domain (if applicable)
- [ ] Security headers configured
- [ ] Secrets scanning passed

### ✅ Performance Optimization
- [ ] Bundle size reasonable (< 5MB)
- [ ] Core Web Vitals acceptable
- [ ] Images optimized
- [ ] Caching configured properly
- [ ] CDN working correctly

## Module Federation Verification

### ✅ Remote Apps Status
- [ ] Calendar App loads: https://calendar.smartcrm.vip
- [ ] Analytics App loads: https://analytics.smartcrm.vip
- [ ] Contacts App loads: https://contacts.smartcrm.vip
- [ ] Pipeline App loads: https://pipeline.smartcrm.vip
- [ ] Agency App loads: https://agency.smartcrm.vip
- [ ] Research App loads: https://research.smartcrm.vip

### ✅ Federation Configuration
- [ ] Shared dependencies properly configured
- [ ] Version compatibility maintained
- [ ] Error boundaries working
- [ ] Fallback mechanisms functional

## Monitoring & Maintenance

### ✅ Error Monitoring Setup
- [ ] Error tracking configured
- [ ] Build notifications enabled
- [ ] Performance monitoring active
- [ ] Uptime monitoring configured

### ✅ Backup & Rollback
- [ ] Previous deployment accessible
- [ ] Rollback procedure documented
- [ ] Data backup strategy in place
- [ ] Emergency contact information updated

## Documentation & Training

### ✅ Team Documentation
- [ ] Deployment guide distributed
- [ ] Environment variable documentation shared
- [ ] Troubleshooting procedures documented
- [ ] Contact information for support updated

### ✅ User Training
- [ ] Admin users trained on deployment process
- [ ] Emergency procedures documented
- [ ] Monitoring dashboard access provided
- [ ] Support escalation paths defined

## Final Sign-Off

### ✅ Deployment Approval
- [ ] QA testing completed
- [ ] Performance benchmarks met
- [ ] Security audit passed
- [ ] Business stakeholders approved
- [ ] Go-live checklist completed

### ✅ Production Monitoring
- [ ] 24/7 monitoring active
- [ ] Alert thresholds configured
- [ ] Incident response plan ready
- [ ] Backup deployment ready

---

## Emergency Contacts

**Technical Lead:** [Name] - [Email] - [Phone]
**DevOps Engineer:** [Name] - [Email] - [Phone]
**Security Officer:** [Name] - [Email] - [Phone]
**Business Owner:** [Name] - [Email] - [Phone]

## Quick Reference

**Netlify Dashboard:** https://app.netlify.com
**Site URL:** [Your deployed URL]
**Build Logs:** Available in Netlify dashboard
**Environment Variables:** Site Settings → Environment Variables

**Rollback Command:** Use Netlify dashboard to rollback to previous deploy
**Emergency Stop:** Disable site in Netlify dashboard

---

*This checklist ensures comprehensive deployment verification and provides rollback procedures for production safety.*