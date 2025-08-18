import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// Import critical pages (already loaded)
import Dashboard from '../pages/Dashboard';
import SystemOverview from '../pages/SystemOverview';

// Lazy-loaded pages
const Tasks = lazy(() => import('../pages/Tasks'));
const TasksNew = lazy(() => import('../pages/TasksNew'));
const Communication = lazy(() => import('../pages/Communication'));
const Contacts = lazy(() => import('../pages/Contacts'));
const ContactsEnhanced = lazy(() => import('../pages/ContactsEnhanced'));
const Pipeline = lazy(() => import('../pages/Pipeline'));
const AITools = lazy(() => import('../pages/AITools'));
const Analytics = lazy(() => import('../pages/Analytics'));
const AIIntegration = lazy(() => import('../pages/AIIntegration'));
const MobileResponsiveness = lazy(() => import('../pages/MobileResponsiveness'));

// Placeholder component for routes not yet implemented
const PlaceholderPage = ({ title, description }: { title: string; description?: string }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{title}</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-gray-600 dark:text-gray-300">{description || "This feature is coming soon..."}</p>
      </div>
    </div>
  </div>
);

// Protected Route component (placeholder for future auth)
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // TODO: Add authentication logic here when auth is implemented
  return <>{children}</>;
};

// Define the main application routes
export const appRoutes = [
  // Redirect root to dashboard
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  
  // Main Dashboard - Primary Landing Page
  { 
    path: "/dashboard", 
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
    breadcrumb: "Dashboard"
  },
  
  // System Overview - Development Status Page
  { 
    path: "/system-overview", 
    element: <ProtectedRoute><SystemOverview /></ProtectedRoute>,
    breadcrumb: "System Overview"
  },
  
  // Main Navigation Routes
  { 
    path: "/contacts", 
    element: <ProtectedRoute><Contacts /></ProtectedRoute>,
    breadcrumb: "Contacts"
  },
  { 
    path: "/contacts-enhanced", 
    element: <ProtectedRoute><ContactsEnhanced /></ProtectedRoute>,
    breadcrumb: "Enhanced Contacts"
  },
  { 
    path: "/tasks", 
    element: <ProtectedRoute><TasksNew /></ProtectedRoute>,
    breadcrumb: "Tasks"
  },
  { 
    path: "/communication", 
    element: <ProtectedRoute><Communication /></ProtectedRoute>,
    breadcrumb: "Communication"
  },
  { 
    path: "/analytics", 
    element: <ProtectedRoute><Analytics /></ProtectedRoute>,
    breadcrumb: "Analytics"
  },
  { 
    path: "/ai-integration", 
    element: <ProtectedRoute><AIIntegration /></ProtectedRoute>,
    breadcrumb: "AI Integration"
  },
  { 
    path: "/ai-tools", 
    element: <ProtectedRoute><AITools /></ProtectedRoute>,
    breadcrumb: "AI Tools"
  },
  { 
    path: "/pipeline", 
    element: <ProtectedRoute><Pipeline /></ProtectedRoute>,
    breadcrumb: "Pipeline"
  },
  { 
    path: "/mobile", 
    element: <ProtectedRoute><MobileResponsiveness /></ProtectedRoute>,
    breadcrumb: "Mobile View"
  },
  { 
    path: "/ai-goals", 
    element: <ProtectedRoute><PlaceholderPage title="AI Goals" description="Track your AI usage and goals" /></ProtectedRoute>,
    breadcrumb: "AI Goals"
  },
  { 
    path: "/appointments", 
    element: <ProtectedRoute><PlaceholderPage title="Appointments Calendar" description="Manage your appointments and schedule" /></ProtectedRoute>,
    breadcrumb: "Calendar"
  },
  
  // Sales Tools
  { 
    path: "/sales-tools", 
    element: <ProtectedRoute><PlaceholderPage title="Sales Tools" description="Sales tools collection" /></ProtectedRoute>,
    breadcrumb: "Sales Tools"
  },
  { 
    path: "/lead-automation", 
    element: <ProtectedRoute><PlaceholderPage title="Lead Automation" description="Automate lead capture and qualification" /></ProtectedRoute>,
    breadcrumb: "Lead Automation"
  },
  { 
    path: "/circle-prospecting", 
    element: <ProtectedRoute><PlaceholderPage title="Circle Prospecting" description="Target leads in specific geographic areas" /></ProtectedRoute>,
    breadcrumb: "Circle Prospecting"
  },
  { 
    path: "/phone-system", 
    element: <ProtectedRoute><PlaceholderPage title="Phone System" description="Integrated calling system" /></ProtectedRoute>,
    breadcrumb: "Phone System"
  },
  { 
    path: "/invoicing", 
    element: <ProtectedRoute><PlaceholderPage title="Invoicing" description="Create and manage invoices" /></ProtectedRoute>,
    breadcrumb: "Invoicing"
  },
  { 
    path: "/sales-analytics", 
    element: <ProtectedRoute><PlaceholderPage title="Sales Analytics" description="Detailed sales performance metrics" /></ProtectedRoute>,
    breadcrumb: "Sales Analytics"
  },
  { 
    path: "/deal-pipeline", 
    element: <ProtectedRoute><Pipeline /></ProtectedRoute>,
    breadcrumb: "Deal Pipeline"
  },
  { 
    path: "/quote-builder", 
    element: <ProtectedRoute><PlaceholderPage title="Quote Builder" description="Create professional sales quotes" /></ProtectedRoute>,
    breadcrumb: "Quote Builder"
  },
  { 
    path: "/commission-tracker", 
    element: <ProtectedRoute><PlaceholderPage title="Commission Tracker" description="Track sales team commissions" /></ProtectedRoute>,
    breadcrumb: "Commission Tracker"
  },
  { 
    path: "/follow-up-reminders", 
    element: <ProtectedRoute><PlaceholderPage title="Follow-up Reminders" description="Automated follow-up system" /></ProtectedRoute>,
    breadcrumb: "Follow-up Reminders"
  },
  { 
    path: "/territory-management", 
    element: <ProtectedRoute><PlaceholderPage title="Territory Management" description="Manage sales territories" /></ProtectedRoute>,
    breadcrumb: "Territory Management"
  },
  
  // Task Tools
  { 
    path: "/task-automation", 
    element: <ProtectedRoute><PlaceholderPage title="Task Automation" description="Automate routine tasks" /></ProtectedRoute>,
    breadcrumb: "Task Automation"
  },
  { 
    path: "/project-tracker", 
    element: <ProtectedRoute><PlaceholderPage title="Project Tracker" description="Track project progress" /></ProtectedRoute>,
    breadcrumb: "Project Tracker"
  },
  { 
    path: "/time-tracking", 
    element: <ProtectedRoute><PlaceholderPage title="Time Tracking" description="Track time spent on tasks" /></ProtectedRoute>,
    breadcrumb: "Time Tracking"
  },
  { 
    path: "/workflow-builder", 
    element: <ProtectedRoute><PlaceholderPage title="Workflow Builder" description="Create custom workflows" /></ProtectedRoute>,
    breadcrumb: "Workflow Builder"
  },
  { 
    path: "/deadline-manager", 
    element: <ProtectedRoute><PlaceholderPage title="Deadline Manager" description="Manage project deadlines" /></ProtectedRoute>,
    breadcrumb: "Deadline Manager"
  },
  
  // Communication Tools
  { 
    path: "/video-email", 
    element: <ProtectedRoute><PlaceholderPage title="Video Email" description="Send video messages" /></ProtectedRoute>,
    breadcrumb: "Video Email"
  },
  { 
    path: "/text-messages", 
    element: <ProtectedRoute><PlaceholderPage title="Text Messages" description="Send and manage SMS messages" /></ProtectedRoute>,
    breadcrumb: "Text Messages"
  },
  { 
    path: "/email-composer", 
    element: <ProtectedRoute><PlaceholderPage title="Email Composer" description="Advanced email creation tool" /></ProtectedRoute>,
    breadcrumb: "Email Composer"
  },
  { 
    path: "/campaigns", 
    element: <ProtectedRoute><PlaceholderPage title="Campaigns" description="Create marketing campaigns" /></ProtectedRoute>,
    breadcrumb: "Campaigns"
  },
  { 
    path: "/group-calls", 
    element: <ProtectedRoute><PlaceholderPage title="Group Calls" description="Conduct group video calls" /></ProtectedRoute>,
    breadcrumb: "Group Calls"
  },
  { 
    path: "/call-recording", 
    element: <ProtectedRoute><PlaceholderPage title="Call Recording" description="Record and transcribe calls" /></ProtectedRoute>,
    breadcrumb: "Call Recording"
  },
  { 
    path: "/in-call-messaging", 
    element: <ProtectedRoute><PlaceholderPage title="In-Call Messaging" description="Chat during video calls" /></ProtectedRoute>,
    breadcrumb: "In-Call Messaging"
  },
  { 
    path: "/call-analytics", 
    element: <ProtectedRoute><PlaceholderPage title="Call Analytics" description="Analyze call performance" /></ProtectedRoute>,
    breadcrumb: "Call Analytics"
  },
  { 
    path: "/connection-quality", 
    element: <ProtectedRoute><PlaceholderPage title="Connection Quality" description="Monitor call quality" /></ProtectedRoute>,
    breadcrumb: "Connection Quality"
  },
  
  // Content Tools
  { 
    path: "/content-library", 
    element: <ProtectedRoute><PlaceholderPage title="Content Library" description="Organize marketing content" /></ProtectedRoute>,
    breadcrumb: "Content Library"
  },
  { 
    path: "/voice-profiles", 
    element: <ProtectedRoute><PlaceholderPage title="Voice Profiles" description="Manage AI voice profiles" /></ProtectedRoute>,
    breadcrumb: "Voice Profiles"
  },
  { 
    path: "/business-analysis", 
    element: <ProtectedRoute><PlaceholderPage title="Business Analysis" description="Business intelligence tools" /></ProtectedRoute>,
    breadcrumb: "Business Analysis"
  },
  { 
    path: "/image-generator", 
    element: <ProtectedRoute><PlaceholderPage title="Image Generator" description="AI image generation" /></ProtectedRoute>,
    breadcrumb: "Image Generator"
  },
  { 
    path: "/forms", 
    element: <ProtectedRoute><PlaceholderPage title="Forms" description="Create custom forms" /></ProtectedRoute>,
    breadcrumb: "Forms"
  },
  { 
    path: "/ai-model-demo", 
    element: <ProtectedRoute><PlaceholderPage title="AI Model Demo" description="Explore AI models" /></ProtectedRoute>,
    breadcrumb: "AI Model Demo"
  },
  
  // Settings
  { 
    path: "/settings", 
    element: <ProtectedRoute><PlaceholderPage title="Settings" description="Manage application settings" /></ProtectedRoute>,
    breadcrumb: "Settings"
  },
  
  // White Label
  { 
    path: "/white-label", 
    element: <ProtectedRoute><PlaceholderPage title="White Label Customization" description="Customize the app for your brand" /></ProtectedRoute>,
    breadcrumb: "White Label"
  },
  
  // Feature pages
  { 
    path: "/features/ai-tools", 
    element: <PlaceholderPage title="AI Tools Features" />,
    breadcrumb: "AI Tools Features"
  },
  { 
    path: "/features/contacts", 
    element: <PlaceholderPage title="Contact Management Features" />,
    breadcrumb: "Contact Features"
  },
  { 
    path: "/features/pipeline", 
    element: <PlaceholderPage title="Pipeline Features" />,
    breadcrumb: "Pipeline Features"
  },
  
  // Catch-all route
  { path: "*", element: <Navigate to="/" replace /> }
];

export default appRoutes;
