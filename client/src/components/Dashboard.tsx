import React, { useState, useEffect, useRef } from 'react';
import { useDealStore } from '../store/dealStore';
import { useContactStore } from '../hooks/useContactStore';
import { useGemini } from '../services/geminiService';
import { useTaskStore } from '../store/taskStore';
import { useAppointmentStore } from '../store/appointmentStore';
import { useAITools } from './AIToolsProvider';
import { useTheme } from '../contexts/ThemeContext';
import { useDashboardLayout } from '../contexts/DashboardLayoutContext';
import DraggableSection from './DraggableSection';
import DashboardLayoutControls from './DashboardLayoutControls';
import { LoadingSpinner } from './ui/LoadingSpinner';
import RemotePipelineLoader from './RemotePipelineLoader';

// Import section components
import ExecutiveOverviewSection from './sections/ExecutiveOverviewSection';
import AISmartFeaturesHub from './sections/AISmartFeaturesHub';
import SalesPipelineDealAnalytics from './sections/SalesPipelineDealAnalytics';
import CustomerLeadManagement from './sections/CustomerLeadManagement';
import ActivitiesCommunications from './sections/ActivitiesCommunications';
import IntegrationsSystem from './sections/IntegrationsSystem';

// Keep legacy components for backward compatibility
import MetricsCards from './dashboard/MetricsCards';
import InteractionHistory from './dashboard/InteractionHistory';
import TasksAndFunnel from './dashboard/TasksAndFunnel';
import CustomerProfile from './dashboard/CustomerProfile';
import RecentActivity from './dashboard/RecentActivity';
import DashboardHeader from './dashboard/DashboardHeader';
import ChartsSection from './dashboard/ChartsSection';
import ConnectedApps from './dashboard/ConnectedApps';
import AIInsightsPanel from './dashboard/AIInsightsPanel';
import NewLeadsSection from './dashboard/NewLeadsSection';
import KPICards from './dashboard/KPICards';
import QuickActions from './dashboard/QuickActions';

// GPT-5 Enhanced Components
import GPT5AnalyticsPanel from './dashboard/GPT5AnalyticsPanel';
import GPT5DealIntelligence from './dashboard/GPT5DealIntelligence';
import GPT5SmartKPICards from './dashboard/GPT5SmartKPICards';
import GPT5EnhancedDashboard from './dashboard/GPT5EnhancedDashboard';

// Video call components
import PersistentVideoCallButton from './PersistentVideoCallButton';
import VideoCallPreviewWidget from './VideoCallPreviewWidget';
import VideoCallOverlay from './VideoCallOverlay';

// Memo Dashboard component to prevent unnecessary re-renders
const Dashboard: React.FC = React.memo(() => {
  const { 
    deals, 
    fetchDeals, 
    isLoading 
  } = useDealStore();
  
  const { 
    contacts, 
    fetchContacts, 
    isLoading: contactsLoading 
  } = useContactStore();
  
  const { tasks } = useTaskStore();
  const { appointments, fetchAppointments } = useAppointmentStore();
  const { openTool } = useAITools();
  const { isDark } = useTheme();
  const { sectionOrder } = useDashboardLayout();
  

  
  const gemini = useGemini();
  
  // Prevent repeated data fetching by using a ref to track initialization
  const initializedRef = useRef(false);
  
  useEffect(() => {
    // Only fetch data once
    if (initializedRef.current) return;
    initializedRef.current = true;
    
    // Fetch deals immediately - they're fast
    fetchDeals();
    
    // Fetch contacts in background without blocking dashboard
    setTimeout(() => {
      fetchContacts();
    }, 100);
    
    // Wrap in try/catch to prevent errors from breaking the app
    try {
      setTimeout(() => {
        fetchAppointments();
      }, 200);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
    
    // Set up timer to refresh data periodically
    const intervalId = window.setInterval(() => {
      fetchDeals();
      fetchContacts();
    }, 300000); // Refresh every 5 minutes

    // Proper cleanup
    return () => window.clearInterval(intervalId);
  }, []);
  
  // Render section content based on section ID
  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      // Check if section component exists before rendering
      case 'executive-overview-section':
        return typeof ExecutiveOverviewSection === 'function' ? <ExecutiveOverviewSection /> : (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Executive Overview</h3>
            <p className="text-gray-600 dark:text-gray-400">Dashboard content loading...</p>
          </div>
        );

      case 'ai-smart-features-hub':
        return typeof AISmartFeaturesHub === 'function' ? <AISmartFeaturesHub /> : (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Smart Features Hub</h3>
            <p className="text-gray-600 dark:text-gray-400">AI tools and features loading...</p>
          </div>
        );

      case 'sales-pipeline-deal-analytics':
        return typeof SalesPipelineDealAnalytics === 'function' ? <SalesPipelineDealAnalytics /> : null;

      case 'customer-lead-management':
        return typeof CustomerLeadManagement === 'function' ? <CustomerLeadManagement /> : null;

      case 'activities-communications':
        return typeof ActivitiesCommunications === 'function' ? <ActivitiesCommunications /> : null;

      case 'integrations-system':
        return typeof IntegrationsSystem === 'function' ? <IntegrationsSystem /> : null;

      // Legacy sections (kept for backward compatibility)
      case 'metrics-cards-section':
        return <MetricsCards />;

      case 'kpi-cards-section':
        return <KPICards />;

      case 'gpt5-smart-kpi-section':
        return <GPT5SmartKPICards />;

      case 'quick-actions-section':
        return <QuickActions />;
        
      case 'ai-insights-section':
        return <AIInsightsPanel />;

      case 'gpt5-analytics-section':
        return <GPT5AnalyticsPanel />;

      case 'gpt5-deal-intelligence-section':
        return <GPT5DealIntelligence />;

      case 'gpt5-enhanced-dashboard':
        return <GPT5EnhancedDashboard />;

      case 'gpt5-feature-status':
        return React.createElement(React.lazy(() => import('./dashboard/GPT5FeatureStatus')));

      case 'interaction-history-section':
        return <InteractionHistory />;

      case 'customer-profile-section':
        return <CustomerProfile />;

      case 'recent-activity-section':
        return <RecentActivity />;

      case 'tasks-and-funnel-section':
        return <TasksAndFunnel />;

      case 'charts-section':
        return <ChartsSection />;

      case 'analytics-section':
        return <ChartsSection />;

      case 'apps-section':
        return <ConnectedApps />;

      case 'contacts-section':
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contacts & Leads</h3>
            <LoadingSpinner message="Loading contacts..." size="lg" />
          </div>
        );

      case 'pipeline-section':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden" style={{ height: '500px' }}>
            <RemotePipelineLoader showHeader={true} />
          </div>
        );

      case 'tasks-section':
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tasks & Activities</h3>
            <LoadingSpinner message="Loading tasks..." size="lg" />
          </div>
        );

      default:
        // Show fallback content instead of null
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {sectionId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Loading dashboard content...</p>
          </div>
        );
    }
  };

  return (
    <main className="w-full h-full overflow-y-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 pt-4">
      {/* Dashboard Header - Always visible */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome to your AI-powered CRM</p>
      </div>



      {/* Dashboard Layout Controls - RESTORED */}
      <DashboardLayoutControls />

      {/* Draggable Sections - RESTORED with error boundary */}
      <div className="space-y-8 pb-20">
        {sectionOrder && sectionOrder.length > 0 ? (
          sectionOrder.map((sectionId, index) => {
            try {
              return (
                <DraggableSection
                  key={sectionId}
                  sectionId={sectionId}
                  index={index}
                >
                  <div id={sectionId}>
                    {renderSectionContent(sectionId)}
                  </div>
                </DraggableSection>
              );
            } catch (error) {
              console.error(`Error rendering section ${sectionId}:`, error);
              return (
                <div key={sectionId} className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <h3 className="text-red-800 dark:text-red-200 font-semibold">Error loading section: {sectionId}</h3>
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">Check console for details</p>
                </div>
              );
            }
          })
        ) : (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-xl border border-blue-200 dark:border-blue-800">
            <h3 className="text-blue-800 dark:text-blue-200 font-semibold mb-2">Dashboard Loading</h3>
            <p className="text-blue-600 dark:text-blue-400">
              No dashboard sections available. Please check the dashboard layout configuration.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reload Dashboard
            </button>
          </div>
        )}
      </div>

      {/* Video Call Components */}
      <PersistentVideoCallButton />
      <VideoCallPreviewWidget />
      <VideoCallOverlay />
    </main>
  );
});

export default Dashboard;