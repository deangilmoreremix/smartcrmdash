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
    <main className="w-full h-full overflow-y-auto max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
      {/* Dashboard Header - Always visible */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome to your AI-powered CRM</p>
      </div>

      {/* Simple Dashboard Content - Always shows */}
      <div className="space-y-8 pb-20">
        {/* GPT-5 Enhanced Dashboard */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <GPT5EnhancedDashboard />
        </div>

        {/* Executive Overview */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <ExecutiveOverviewSection />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl text-white">
            <h3 className="text-lg font-semibold mb-2">Total Contacts</h3>
            <p className="text-3xl font-bold">{Object.keys(contacts).length}</p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 rounded-xl text-white">
            <h3 className="text-lg font-semibold mb-2">Active Deals</h3>
            <p className="text-3xl font-bold">{deals.length}</p>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 rounded-xl text-white">
            <h3 className="text-lg font-semibold mb-2">Pending Tasks</h3>
            <p className="text-3xl font-bold">{tasks.filter(task => !task.completed).length}</p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-xl text-white">
            <h3 className="text-lg font-semibold mb-2">Appointments</h3>
            <p className="text-3xl font-bold">{Object.keys(appointments).length}</p>
          </div>
        </div>

        {/* Dashboard Layout Controls - Optional */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dashboard Layout</h3>
          <div className="text-gray-600 dark:text-gray-400">
            Dashboard layout controls available
          </div>
        </div>

        {/* Additional Dashboard Sections */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Smart Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-700 dark:text-blue-300">Sales Pipeline Analytics</h4>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Track deal progress and conversion rates</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
              <h4 className="font-semibold text-green-700 dark:text-green-300">Customer Management</h4>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">Manage leads and customer relationships</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
              <h4 className="font-semibold text-purple-700 dark:text-purple-300">AI Communications</h4>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">Automated messaging and follow-ups</p>
            </div>
          </div>
        </div>
      </div>

      {/* Video Call Components */}
      <PersistentVideoCallButton />
      <VideoCallPreviewWidget />
      <VideoCallOverlay />
    </main>
  );
});

export default Dashboard;