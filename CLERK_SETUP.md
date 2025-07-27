# Clerk Setup Guide

## 1. Get Your Clerk Keys

1. Go to [clerk.com](https://clerk.com) and sign up/sign in
2. Create a new application
3. In your Clerk dashboard, go to **API Keys**
4. Copy your **Publishable Key** and **Secret Key**

## 2. Configure Environment Variables

Edit your `.env` file and replace the placeholder values:

```bash
# Replace with your actual Clerk keys
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_actual_secret_key_here

# The rest can stay as is for development
VITE_CLERK_SIGN_IN_URL=/sign-in
VITE_CLERK_SIGN_UP_URL=/sign-up
VITE_CLERK_AFTER_SIGN_IN_URL=/organizations
VITE_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

## 3. Configure Clerk Dashboard Settings

In your Clerk dashboard, configure these settings:

### Domain Settings
- **Allowed redirect URLs**: Add your development URL (e.g., `http://localhost:5173`)
- **Allowed origins**: Add your development domain

### Organizations
- Go to **Configure** → **Organizations**
- **Enable Organizations**: Turn this ON
- **Organization Settings**: Enable all the features you want

### Paths
- **Sign-in URL**: `/sign-in`
- **Sign-up URL**: `/sign-up`
- **After sign-in URL**: `/organizations`
- **After sign-up URL**: `/onboarding`

## 4. Test the Flow

1. Start your development server: `npm run dev`
2. Visit `http://localhost:5173`
3. Try the sign-up/sign-in flow
4. Create an organization
5. Test the organization switcher in the navbar

## Features Now Available

✅ **Landing Page Integration**: Embedded landing page with auth navigation
✅ **User Authentication**: Sign-up, sign-in, and user management
✅ **Organization Creation**: Create and manage organizations
✅ **Organization Switching**: Switch between organizations in navbar
✅ **Organization Profile**: Manage organization settings and members
✅ **Protected Routes**: All dashboard routes require authentication
✅ **Onboarding Flow**: Guided setup for new users

## Next Steps

- Add organization-specific features (billing, settings, etc.)
- Implement role-based access control
- Add organization invitations
- Configure webhooks for organization events
- Add organization-specific data isolation
