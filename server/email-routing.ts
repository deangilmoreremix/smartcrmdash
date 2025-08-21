// Multi-tenant email routing system for Supabase
// This handles routing users to correct email templates based on app context

export interface EmailTemplateConfig {
  appContext: string;
  templateSet: string;
  brandName: string;
  primaryColor: string;
  logoUrl?: string;
  supportEmail: string;
  helpCenterUrl?: string;
  privacyUrl?: string;
}

// App-specific email configurations
export const EMAIL_CONFIGS: Record<string, EmailTemplateConfig> = {
  smartcrm: {
    appContext: 'smartcrm',
    templateSet: 'smartcrm',
    brandName: 'SmartCRM',
    primaryColor: '#22c55e',
    supportEmail: 'support@smartcrm.com',
    helpCenterUrl: 'https://help.smartcrm.com',
    privacyUrl: 'https://smartcrm.com/privacy'
  },
  // Add other apps here
  // otherapp: {
  //   appContext: 'otherapp',
  //   templateSet: 'otherapp',
  //   brandName: 'OtherApp',
  //   primaryColor: '#3b82f6',
  //   supportEmail: 'support@otherapp.com'
  // }
}

// Function to determine email template set based on user metadata
export function getEmailTemplateSet(userMetadata: any): string {
  // Check user's app_context first
  if (userMetadata?.app_context && EMAIL_CONFIGS[userMetadata.app_context]) {
    return userMetadata.app_context;
  }
  
  // Check email_template_set if specified
  if (userMetadata?.email_template_set && EMAIL_CONFIGS[userMetadata.email_template_set]) {
    return userMetadata.email_template_set;
  }
  
  // Default fallback
  return 'smartcrm';
}

// Supabase Auth Hook handler (for use with webhooks)
export function handleAuthHook(event: any) {
  const eventType = event.type;
  const user = event.record;
  
  // For signup events, ensure proper app context is set
  if (eventType === 'user.created') {
    const appContext = getEmailTemplateSet(user.user_metadata || user.raw_user_meta_data);
    
    console.log(`New user signup for app: ${appContext}`, {
      userId: user.id,
      email: user.email,
      appContext
    });
    
    // This would be used in a webhook to route to correct email templates
    return {
      templateSet: appContext,
      config: EMAIL_CONFIGS[appContext]
    };
  }
  
  return null;
}

// Helper to create app-specific signup URLs
export function createAppSignupUrl(baseUrl: string, appContext: string): string {
  return `${baseUrl}/signup?app=${appContext}`;
}

// Helper to validate app context
export function isValidAppContext(appContext: string): boolean {
  return appContext in EMAIL_CONFIGS;
}