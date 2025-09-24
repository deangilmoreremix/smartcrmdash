// Navigation map for the application
// This file connects tools from the navbar with their routes

// Map of tool IDs to their routes
export const toolRoutes: Record<string, string> = {
  // Sales Tools
  'sales-tools': '/sales-tools',
  'lead-automation': '/lead-automation',
  'circle-prospecting': '/circle-prospecting',
  'appointments': '/appointments',
  'phone-system': '/phone-system',
  'invoicing': '/invoicing',
  'sales-analytics': '/sales-analytics',
  'deal-pipeline': '/deal-pipeline',
  'quote-builder': '/quote-builder',
  'commission-tracker': '/commission-tracker',
  'follow-up-reminders': '/follow-up-reminders',
  'territory-management': '/territory-management',
  
  // Task Tools
  'task-management': '/tasks',
  'task-automation': '/task-automation',
  'project-tracker': '/project-tracker',
  'time-tracking': '/time-tracking',
  'workflow-builder': '/workflow-builder',
  'deadline-manager': '/deadline-manager',
  
  // Communication Tools
  'video-email': '/video-email',
  'text-messages': '/text-messages',
  'email-composer': '/email-composer',
  'campaigns': '/campaigns',
  'group-calls': '/group-calls',
  'call-recording': '/call-recording',
  'in-call-messaging': '/in-call-messaging',
  'call-analytics': '/call-analytics',
  'connection-quality': '/connection-quality',
  
  // Content Tools
  'content-library': '/content-library',
  'voice-profiles': '/voice-profiles',
  'business-analysis': '/business-analysis',
  'image-generator': '/image-generator',
  'forms': '/forms',
  'ai-model-demo': '/ai-model-demo',
  
  // Main Navigation
  'dashboard': '/dashboard',
  'contacts': '/contacts',
  'pipeline': '/pipeline',
  'analytics': '/analytics',
  'ai-goals': '/ai-goals',
  'ai-tools': '/ai-tools',
  'settings': '/settings'
};

// Function to get the route for a tool
export const getRouteForTool = (toolId: string): string => {
  return toolRoutes[toolId] || '/dashboard';
};

// Function to determine if a tool uses a route or opens in a modal/panel
export const isToolRoutable = (toolId: string): boolean => {
  // Special case for deal pipeline which opens in a modal
  if (toolId === 'deal-pipeline') return false;
  
  // AI tools that open in panels/modals rather than routes
  const nonRoutableAITools = [
    'email-analysis', 'meeting-summarizer', 'proposal-generator', 
    'call-script', 'subject-optimizer', 'competitor-analysis',
    'market-trends', 'sales-insights', 'sales-forecast',
    'objection-handler', 'email-response', 'voice-tone',
    'customer-persona', 'visual-content', 'meeting-agenda',
    'ai-assistant', 'vision-analyzer', 'semantic-search',
    'function-assistant', 'streaming-chat', 'form-validation',
    'live-deal-analysis', 'instant-response', 'realtime-email',
    'voice-analysis', 'reasoning-email', 'reasoning-proposal',
    'reasoning-script', 'reasoning-objection', 'reasoning-social'
  ];
  
  return !nonRoutableAITools.includes(toolId);
};

export default toolRoutes;
