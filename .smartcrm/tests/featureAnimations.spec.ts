import { test } from '@playwright/test';
import { spotlight, clearSpotlight } from '../src/utils/tour';

const DEV_BYPASS = '[data-testid="button-dev-bypass"]';

type Feature = {
  key: string;
  name: string;
  path: string;
  waitFor?: string;
  run: (page: any) => Promise<void>;
};

const features: Feature[] = [
  // Individual Dashboard Features
  {
    key: 'dashboard-header',
    name: 'Dashboard Header',
    path: '/dashboard',
    waitFor: '[data-testid="kpi-cards"], .kpi-cards',
    run: async (page) => {
      await page.waitForLoadState('networkidle');
      await spotlight(page, '.dashboard-header, [data-testid="dashboard-header"]', 'Always visible dashboard title and welcome message');
      await page.waitForTimeout(700);
      await clearSpotlight(page);
    }
  },
  {
    key: 'layout-controls',
    name: 'Layout Controls',
    path: '/dashboard',
    waitFor: '[data-testid="kpi-cards"], .kpi-cards',
    run: async (page) => {
      await page.waitForLoadState('networkidle');
      await spotlight(page, '[data-testid="layout-controls"], .layout-controls', 'Customize dashboard layout and section order');
      await page.waitForTimeout(600);
      await clearSpotlight(page);
    }
  },
  {
    key: 'draggable-sections',
    name: 'Draggable Sections',
    path: '/dashboard',
    waitFor: '[data-testid="kpi-cards"], .kpi-cards',
    run: async (page) => {
      await page.waitForLoadState('networkidle');
      await spotlight(page, '[data-testid="draggable-section"], .draggable-section', 'Drag and drop to personalize your dashboard');
      await page.waitForTimeout(600);
      await clearSpotlight(page);
    }
  },
  {
    key: 'executive-overview',
    name: 'Executive Overview',
    path: '/dashboard',
    waitFor: '[data-testid="kpi-cards"], .kpi-cards',
    run: async (page) => {
      await page.waitForLoadState('networkidle');
      await spotlight(page, '[data-testid="executive-overview"], .executive-overview', 'High-level business performance summary');
      await page.waitForTimeout(700);
      await clearSpotlight(page);
    }
  },
  {
    key: 'ai-features-hub',
    name: 'AI Smart Features Hub',
    path: '/dashboard',
    waitFor: '[data-testid="kpi-cards"], .kpi-cards',
    run: async (page) => {
      await page.waitForLoadState('networkidle');
      await spotlight(page, '[data-testid="ai-features-hub"], .ai-features-hub', 'Central hub for AI-powered productivity tools');
      await page.click('[data-testid="ai-features-hub"], .ai-features-hub').catch(() => {});
      await page.waitForTimeout(600);
      await clearSpotlight(page);
    }
  },
  {
    key: 'pipeline-analytics',
    name: 'Sales Pipeline Analytics',
    path: '/dashboard',
    waitFor: '[data-testid="kpi-cards"], .kpi-cards',
    run: async (page) => {
      await page.waitForLoadState('networkidle');
      await spotlight(page, '[data-testid="pipeline-analytics"], .pipeline-analytics', 'Visualize sales pipeline and deal analytics');
      await page.waitForTimeout(700);
      await clearSpotlight(page);
    }
  },
  {
    key: 'lead-management',
    name: 'Customer Lead Management',
    path: '/dashboard',
    waitFor: '[data-testid="kpi-cards"], .kpi-cards',
    run: async (page) => {
      await page.waitForLoadState('networkidle');
      await spotlight(page, '[data-testid="lead-management"], .lead-management', 'Manage leads and track their status');
      await page.waitForTimeout(600);
      await clearSpotlight(page);
    }
  },
  {
    key: 'activities-communications',
    name: 'Activities & Communications',
    path: '/dashboard',
    waitFor: '[data-testid="kpi-cards"], .kpi-cards',
    run: async (page) => {
      await page.waitForLoadState('networkidle');
      await spotlight(page, '[data-testid="activities-communications"], .activities-communications', 'Overview of scheduled activities and communications');
      await page.waitForTimeout(700);
      await clearSpotlight(page);
    }
  },
  {
    key: 'integrations-system',
    name: 'Integrations System',
    path: '/dashboard',
    waitFor: '[data-testid="kpi-cards"], .kpi-cards',
    run: async (page) => {
      await page.waitForLoadState('networkidle');
      await spotlight(page, '[data-testid="integrations-system"], .integrations-system', 'Manage integrations with external systems');
      await page.waitForTimeout(600);
      await clearSpotlight(page);
    }
  },
  {
    key: 'metrics-cards',
    name: 'Metrics Cards',
    path: '/dashboard',
    waitFor: '[data-testid="kpi-cards"], .kpi-cards',
    run: async (page) => {
      await page.waitForLoadState('networkidle');
      await spotlight(page, '[data-testid="metrics-cards"], .metrics-cards', 'Display key business metrics');
      await page.waitForTimeout(700);
      await clearSpotlight(page);
    }
  },
  {
    key: 'kpi-cards',
    name: 'KPI Cards',
    path: '/dashboard',
    waitFor: '[data-testid="kpi-cards"], .kpi-cards',
    run: async (page) => {
      await page.waitForLoadState('networkidle');
      await spotlight(page, '[data-testid="kpi-cards"], .kpi-cards', 'Show performance indicators');
      await page.waitForTimeout(600);
      await clearSpotlight(page);
    }
  },
  {
    key: 'gpt5-kpi-cards',
    name: 'GPT-5 Smart KPI Cards',
    path: '/dashboard',
    waitFor: '[data-testid="kpi-cards"], .kpi-cards',
    run: async (page) => {
      await page.waitForLoadState('networkidle');
      await spotlight(page, '[data-testid="gpt5-kpi-cards"], .gpt5-kpi-cards', 'AI-enhanced KPI cards with predictive analytics');
      await page.waitForTimeout(700);
      await clearSpotlight(page);
    }
  },
  {
    key: 'quick-actions',
    name: 'Quick Actions',
    path: '/dashboard',
    waitFor: '[data-testid="kpi-cards"], .kpi-cards',
    run: async (page) => {
      await page.waitForLoadState('networkidle');
      await spotlight(page, '[data-testid="quick-actions"], .quick-actions', 'One-click access to common actions');
      await page.click('[data-testid="quick-actions"] button:first-child').catch(() => {});
      await page.waitForTimeout(600);
      await clearSpotlight(page);
    }
  },
  {
    key: 'ai-insights-panel',
    name: 'AI Insights Panel',
    path: '/dashboard',
    waitFor: '[data-testid="kpi-cards"], .kpi-cards',
    run: async (page) => {
      await page.waitForLoadState('networkidle');
      await spotlight(page, '[data-testid="ai-insights-panel"], .ai-insights-panel', 'AI-generated business insights and recommendations');
      await page.waitForTimeout(700);
      await clearSpotlight(page);
    }
  },
  {
    key: 'gpt5-analytics-panel',
    name: 'GPT-5 Analytics Panel',
    path: '/dashboard',
    waitFor: '[data-testid="kpi-cards"], .kpi-cards',
    run: async (page) => {
      await page.waitForLoadState('networkidle');
      await spotlight(page, '[data-testid="gpt5-analytics-panel"], .gpt5-analytics-panel', 'Advanced analytics powered by GPT-5');
      await page.waitForTimeout(600);
      await clearSpotlight(page);
    }
  },
  {
    key: 'gpt5-deal-intelligence',
    name: 'GPT-5 Deal Intelligence',
    path: '/dashboard',
    waitFor: '[data-testid="kpi-cards"], .kpi-cards',
    run: async (page) => {
      await page.waitForLoadState('networkidle');
      await spotlight(page, '[data-testid="gpt5-deal-intelligence"], .gpt5-deal-intelligence', 'AI-powered deal analysis and predictions');
      await page.waitForTimeout(700);
      await clearSpotlight(page);
    }
  },
  {
    key: 'gpt5-enhanced-dashboard',
    name: 'GPT-5 Enhanced Dashboard',
    path: '/dashboard',
    waitFor: '[data-testid="kpi-cards"], .kpi-cards',
    run: async (page) => {
      await page.waitForLoadState('networkidle');
      await spotlight(page, '[data-testid="gpt5-enhanced-dashboard"], .gpt5-enhanced-dashboard', 'Overall dashboard enhanced with GPT-5 features');
      await page.waitForTimeout(600);
      await clearSpotlight(page);
    }
  },
  {
    key: 'interaction-history',
    name: 'Interaction History',
    path: '/dashboard',
    waitFor: '[data-testid="kpi-cards"], .kpi-cards',
    run: async (page) => {
      await page.waitForLoadState('networkidle');
      await spotlight(page, '[data-testid="interaction-history"], .interaction-history', 'Timeline of all communications and interactions');
      await page.waitForTimeout(700);
      await clearSpotlight(page);
    }
  },
  {
    key: 'customer-profile',
    name: 'Customer Profile',
    path: '/dashboard',
    waitFor: '[data-testid="kpi-cards"], .kpi-cards',
    run: async (page) => {
      await page.waitForLoadState('networkidle');
      await spotlight(page, '[data-testid="customer-profile"], .customer-profile', 'Detailed customer information and engagement');
      await page.waitForTimeout(600);
      await clearSpotlight(page);
    }
  },
  {
    key: 'recent-activity',
    name: 'Recent Activity',
    path: '/dashboard',
    waitFor: '[data-testid="kpi-cards"], .kpi-cards',
    run: async (page) => {
      await page.waitForLoadState('networkidle');
      await spotlight(page, '[data-testid="recent-activity"], .recent-activity', 'Feed of recent user and system actions');
      await page.waitForTimeout(700);
      await clearSpotlight(page);
    }
  },
  {
    key: 'tasks-funnel',
    name: 'Tasks and Funnel',
    path: '/dashboard',
    waitFor: '[data-testid="kpi-cards"], .kpi-cards',
    run: async (page) => {
      await page.waitForLoadState('networkidle');
      await spotlight(page, '[data-testid="tasks-funnel"], .tasks-funnel', 'Task management and sales funnel visualization');
      await page.waitForTimeout(600);
      await clearSpotlight(page);
    }
  },
  {
    key: 'charts-section',
    name: 'Charts Section',
    path: '/dashboard',
    waitFor: '[data-testid="kpi-cards"], .kpi-cards',
    run: async (page) => {
      await page.waitForLoadState('networkidle');
      await spotlight(page, '[data-testid="charts-section"], .charts-section', 'Data visualization for various metrics');
      await page.waitForTimeout(700);
      await clearSpotlight(page);
    }
  },
  {
    key: 'new-leads-section',
    name: 'New Leads Section',
    path: '/dashboard',
    waitFor: '[data-testid="kpi-cards"], .kpi-cards',
    run: async (page) => {
      await page.waitForLoadState('networkidle');
      await spotlight(page, '[data-testid="new-leads-section"], .new-leads-section', 'Interface for adding and tracking new leads');
      await page.waitForTimeout(600);
      await clearSpotlight(page);
    }
  },
  {
    key: 'assistant-status',
    name: 'Assistant Status Widget',
    path: '/dashboard',
    waitFor: '[data-testid="kpi-cards"], .kpi-cards',
    run: async (page) => {
      await page.waitForLoadState('networkidle');
      await spotlight(page, '[data-testid="assistant-status"], .assistant-status', 'Shows AI assistant status and availability');
      await page.waitForTimeout(700);
      await clearSpotlight(page);
    }
  },
  {
    key: 'video-call-components',
    name: 'Video Call Components',
    path: '/dashboard',
    waitFor: '[data-testid="kpi-cards"], .kpi-cards',
    run: async (page) => {
      await page.waitForLoadState('networkidle');
      await spotlight(page, '[data-testid="video-call-button"], .video-call-button', 'Persistent video call button and preview widget');
      await page.waitForTimeout(600);
      await clearSpotlight(page);
    }
  },

  // CONTACTS - All AI-powered features
  {
    key: 'contacts',
    name: 'Contacts',
    path: '/contacts',
    waitFor: '.contacts-module, [data-testid="contacts-list"]',
    run: async (page) => {
      
      await page.waitForSelector('.contacts-module, [data-testid="contacts-list"]', { timeout: 8000 });

      // Gemini AI Image Generation
      await spotlight(page, '[data-testid="image-generator"], .image-generator', 'Gemini AI-powered image generation with storage');
      await page.click('[data-testid="image-generator"], .image-generator').catch(() => {});
      await page.waitForTimeout(600);
      await clearSpotlight(page);

      // SmartCRM Prompt Templates
      await spotlight(page, '[data-testid="prompt-templates"], .prompt-templates', 'Pre-built templates for different features');
      await page.click('[data-testid="prompt-templates"], .prompt-templates').catch(() => {});
      await page.waitForTimeout(600);
      await clearSpotlight(page);

      // Advanced Image Generation
      await spotlight(page, '[data-testid="advanced-gen"], .advanced-gen', 'Powered by Gemini 2.5 Flash with aspect ratio optimization');
      await page.waitForTimeout(700);
      await clearSpotlight(page);

      // Supabase Storage Integration
      await spotlight(page, '[data-testid="storage-integration"], .storage-integration', 'Automatic upload and storage of generated images');
      await page.waitForTimeout(600);
      await clearSpotlight(page);

      // Saved Images Gallery
      await spotlight(page, '[data-testid="images-gallery"], .images-gallery', 'Complete gallery management with metadata tracking');
      await page.click('[data-testid="images-gallery"], .images-gallery').catch(() => {});
      await page.waitForTimeout(600);
      await clearSpotlight(page);

      // Enhanced AI-Powered Contact Management
      await spotlight(page, '[data-testid="contact-scoring"], .contact-scoring', 'Multi-model AI analysis for lead prioritization');
      await page.waitForTimeout(700);
      await clearSpotlight(page);

      // Intelligent Contact Enrichment
      await spotlight(page, '[data-testid="contact-enrichment"], .contact-enrichment', 'Web research integration with LinkedIn and company data');
      await page.click('[data-testid="contact-enrichment"], .contact-enrichment').catch(() => {});
      await page.waitForTimeout(600);
      await clearSpotlight(page);

      // AI Research Integration
      await spotlight(page, '[data-testid="ai-research"], .ai-research', 'Real-time web search for contact background');
      await page.waitForTimeout(700);
      await clearSpotlight(page);

      // Smart Categorization
      await spotlight(page, '[data-testid="smart-categorization"], .smart-categorization', 'Automatic tagging based on industry and role');
      await page.waitForTimeout(600);
      await clearSpotlight(page);

      // Relationship Mapping
      await spotlight(page, '[data-testid="relationship-mapping"], .relationship-mapping', 'AI-powered analysis of professional networks');
      await page.waitForTimeout(700);
      await clearSpotlight(page);

      // Bulk Analysis
      await spotlight(page, '[data-testid="bulk-analysis"], .bulk-analysis', 'Process hundreds of contacts with AI insights');
      await page.click('[data-testid="bulk-analysis"], .bulk-analysis').catch(() => {});
      await page.waitForTimeout(600);
      await clearSpotlight(page);

      // Contact Journey Timeline
      await spotlight(page, '[data-testid="journey-timeline"], .journey-timeline', 'Visual timeline of all contact interactions');
      await page.waitForTimeout(700);
      await clearSpotlight(page);

      // AI Insights Panel
      await spotlight(page, '[data-testid="contact-insights"], .contact-insights', 'Deep analysis with predictive recommendations');
      await page.waitForTimeout(600);
      await clearSpotlight(page);

      // Communication Hub
      await spotlight(page, '[data-testid="communication-hub"], .communication-hub', 'Unified messaging across email, phone, SMS, social');
      await page.click('[data-testid="communication-hub"], .communication-hub').catch(() => {});
      await page.waitForTimeout(600);
      await clearSpotlight(page);

      // Automation Panel
      await spotlight(page, '[data-testid="automation-panel"], .automation-panel', 'Intelligent workflow automation with AI suggestions');
      await page.waitForTimeout(700);
      await clearSpotlight(page);

      // Contact Analytics
      await spotlight(page, '[data-testid="contact-analytics"], .contact-analytics', 'Comprehensive analytics on engagement patterns');
      await page.waitForTimeout(600);
      await clearSpotlight(page);

      // Email Integration
      await spotlight(page, '[data-testid="email-integration"], .email-integration', 'AI-powered email composition and analysis');
      await page.waitForTimeout(700);
    }
  },

  // PIPELINE DEALS - All enhanced features
  {
    key: 'pipeline',
    name: 'Pipeline Deals',
    path: '/pipeline',
    waitFor: '[data-testid="pipeline-board"], .pipeline-container',
    run: async (page) => {
      
      await page.waitForSelector('[data-testid="pipeline-board"], .pipeline-container', { timeout: 8000 });

      // Kanban Board
      await spotlight(page, '[data-testid="kanban-board"], .kanban-board', 'Interactive board for managing deals by stage');
      await page.waitForTimeout(700);
      await clearSpotlight(page);

      // Multiple View Modes
      await spotlight(page, '[data-testid="view-modes"], .view-modes', 'Kanban, List, Table, Calendar, Dashboard, Timeline views');
      await page.click('[data-testid="view-modes"] button:nth-child(2)').catch(() => {}); // Switch to List view
      await page.waitForTimeout(600);
      await clearSpotlight(page);

      // Deal Creation & Management
      await spotlight(page, '[data-testid="add-deal"], .add-deal', 'Create deals with title, company, contact, value, stage, probability');
      await page.click('[data-testid="add-deal"], .add-deal').catch(() => {});
      await page.fill('[data-testid="deal-title"], #deal-title', 'Enterprise Software Deal').catch(() => {});
      await page.waitForTimeout(600);
      await clearSpotlight(page);

      // Deal Detail View
      await spotlight(page, '[data-testid="deal-card"], .deal-card', 'Click any deal for comprehensive details');
      await page.click('[data-testid="deal-card"]:first-child, .deal-card:first-child').catch(() => {});
      await page.waitForTimeout(700);
      await clearSpotlight(page);

      // AI Insights Panel
      await spotlight(page, '[data-testid="deal-ai-insights"], .deal-ai-insights', 'AI-generated insights specific to the deal');
      await page.waitForTimeout(600);
      await clearSpotlight(page);

      // Communication Hub
      await spotlight(page, '[data-testid="deal-communication"], .deal-communication', 'Emails, calls, AI real-time call coach, meeting scheduling');
      await page.click('[data-testid="deal-communication"], .deal-communication').catch(() => {});
      await page.waitForTimeout(600);
      await clearSpotlight(page);

      // Automation Panel
      await spotlight(page, '[data-testid="deal-automation"], .deal-automation', 'Automated sequences and AI-powered automation builder');
      await page.waitForTimeout(700);
      await clearSpotlight(page);

      // Journey Timeline
      await spotlight(page, '[data-testid="deal-journey"], .deal-journey', 'Visual timeline of deal progression and key events');
      await page.waitForTimeout(600);
      await clearSpotlight(page);

      // Analytics Dashboard
      await spotlight(page, '[data-testid="deal-analytics"], .deal-analytics', 'Win Probability, Engagement Mix, Stage Duration, Similar Deals');
      await page.waitForTimeout(700);
      await clearSpotlight(page);

      // Pipeline Statistics
      await spotlight(page, '[data-testid="pipeline-stats"], .pipeline-stats', 'Real-time analytics: total value, deals, average size, conversion rates');
      await page.waitForTimeout(600);
      await clearSpotlight(page);

      // AI Enhanced Deal Cards
      await spotlight(page, '[data-testid="ai-deal-card"], .ai-deal-card', 'Deal cards with AI score display and enhancement tools');
      await page.hover('[data-testid="ai-deal-card"]:first-child, .ai-deal-card:first-child').catch(() => {});
      await page.waitForTimeout(600);
      await clearSpotlight(page);

      // Contact Management
      await spotlight(page, '[data-testid="contacts-modal"], .contacts-modal', 'Manage contacts and internal team members');
      await page.click('[data-testid="contacts-modal"], .contacts-modal').catch(() => {});
      await page.waitForTimeout(600);
      await clearSpotlight(page);

      // Data Management
      await spotlight(page, '[data-testid="import-export"], .import-export', 'Import from CSV/JSON and export with filters');
      await page.waitForTimeout(700);
      await clearSpotlight(page);

      // Advanced AI Capabilities
      await spotlight(page, '[data-testid="ai-models"], .ai-models', 'GPT-5, Gemini, Gemma models with intelligent routing');
      await page.waitForTimeout(600);
      await clearSpotlight(page);

      // AI-Powered Contact Analysis
      await spotlight(page, '[data-testid="contact-analysis"], .contact-analysis', 'Smart contact scoring and detailed analysis');
      await page.waitForTimeout(700);
      await clearSpotlight(page);

      // AI-Driven Deal Intelligence
      await spotlight(page, '[data-testid="deal-intelligence"], .deal-intelligence', 'Comprehensive deal analysis and next-action suggestions');
      await page.waitForTimeout(600);
      await clearSpotlight(page);

      // AI-Powered Communication
      await spotlight(page, '[data-testid="ai-communication"], .ai-communication', 'Personalized email generation and call coaching');
      await page.waitForTimeout(700);
      await clearSpotlight(page);

      // AI Automation
      await spotlight(page, '[data-testid="ai-automation"], .ai-automation', 'AI Automation Builder and deal progression automation');
      await page.click('[data-testid="ai-automation"], .ai-automation').catch(() => {});
      await page.waitForTimeout(600);
      await clearSpotlight(page);

      // AI Function Orchestrator
      await spotlight(page, '[data-testid="function-orchestrator"], .function-orchestrator', 'Manages AI function calls with validation and UI integration');
      await page.waitForTimeout(700);
      await clearSpotlight(page);

      // AI Research & Enrichment
      await spotlight(page, '[data-testid="ai-research"], .ai-research', 'Web search, LinkedIn research, AI Auto-Fill, image finding');
      await page.waitForTimeout(600);
      await clearSpotlight(page);

      // Voice Assistant
      await spotlight(page, '[data-testid="voice-assistant"], .voice-assistant', 'Floating voice interface for hands-free CRM interactions');
      await page.waitForTimeout(700);
      await clearSpotlight(page);

      // AI Status Indicators
      await spotlight(page, '[data-testid="ai-status"], .ai-status', 'Visual feedback on AI service availability and routing');
      await page.waitForTimeout(600);
      await clearSpotlight(page);

      // AI Research Status Overlay
      await spotlight(page, '[data-testid="research-overlay"], .research-overlay', 'Real-time progress of AI research tasks');
      await page.waitForTimeout(700);
    }
  },

  // AI CALENDAR - All calendar and scheduling features
  {
    key: 'calendar',
    name: 'AI Calendar',
    path: '/calendar',
    waitFor: '[data-testid="calendar-grid"], .calendar-container',
    run: async (page) => {
      
      await page.waitForSelector('[data-testid="calendar-grid"], .calendar-container', { timeout: 8000 });

      // Interactive Calendar Views
      await spotlight(page, '[data-testid="calendar-views"], .calendar-views', 'Month, week, day, and agenda views with drag-and-drop');
      await page.click('[data-testid="calendar-views"] button:nth-child(2)').catch(() => {}); // Switch to Week view
      await page.waitForTimeout(600);
      await clearSpotlight(page);

      // Smart Scheduling
      await spotlight(page, '[data-testid="smart-scheduling"], .smart-scheduling', 'AI-powered optimal time slot suggestions');
      await page.click('[data-testid="smart-scheduling"], .smart-scheduling').catch(() => {});
      await page.waitForTimeout(600);
      await clearSpotlight(page);

      // Meeting Optimization
      await spotlight(page, '[data-testid="meeting-optimization"], .meeting-optimization', 'Automatically find best meeting times for multiple attendees');
      await page.waitForTimeout(700);
      await clearSpotlight(page);

      // Calendar Integration
      await spotlight(page, '[data-testid="calendar-integration"], .calendar-integration', 'Sync with Google Calendar, Outlook, and other providers');
      await page.click('[data-testid="calendar-integration"], .calendar-integration').catch(() => {});
      await page.waitForTimeout(600);
      await clearSpotlight(page);

      // Recurring Events
      await spotlight(page, '[data-testid="recurring-events"], .recurring-events', 'Set up recurring tasks and appointments with flexible patterns');
      await page.waitForTimeout(700);
      await clearSpotlight(page);

      // Time Zone Support
      await spotlight(page, '[data-testid="timezone-support"], .timezone-support', 'Multi-timezone scheduling and automatic conversions');
      await page.click('[data-testid="timezone-support"], .timezone-support').catch(() => {});
      await page.waitForTimeout(600);
      await clearSpotlight(page);

      // Calendar Sharing
      await spotlight(page, '[data-testid="calendar-sharing"], .calendar-sharing', 'Share calendars with team members and external stakeholders');
      await page.waitForTimeout(700);
      await clearSpotlight(page);

      // Availability Management
      await spotlight(page, '[data-testid="availability-management"], .availability-management', 'Set working hours, blocked times, and availability preferences');
      await page.click('[data-testid="availability-management"], .availability-management').catch(() => {});
      await page.waitForTimeout(600);
    }
  }
];

// Generate tests for each feature
for (const f of features) {
  test(`${f.name} animation`, async ({ page }, testInfo) => {
    // Navigate directly to dashboard to skip auth pages
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Additional wait for dashboard to load
    await page.waitForTimeout(2000);

    // Navigate to specific feature if not dashboard
    if (f.path !== '/dashboard') {
      await page.goto(f.path);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
    }

    // Wait for feature to load
    if (f.waitFor) {
      try {
        await page.waitForSelector(f.waitFor, { timeout: 15000 });
      } catch (e) {
        console.log(`Selector ${f.waitFor} not found, continuing anyway`);
      }
    }

    // Run feature animation
    await f.run(page);

    // Final pause
    await page.waitForTimeout(1000);

    // Store feature key
    testInfo.annotations.push({ type: 'featureKey', description: f.key });
  });
}