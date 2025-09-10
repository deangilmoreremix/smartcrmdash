// src/App.tsx

import { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { ThemeProvider } from './contexts/ThemeContext';
import { TenantProvider } from './contexts/TenantProvider';
import { WhitelabelProvider } from './contexts/WhitelabelContext';
import { AIToolsProvider } from './components/AIToolsProvider';
import { ModalsProvider } from './components/ModalsProvider';
import { EnhancedHelpProvider } from './contexts/EnhancedHelpContext';
import { VideoCallProvider } from './contexts/VideoCallContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { DashboardLayoutProvider } from './contexts/DashboardLayoutContext';
import { AIProvider } from './contexts/AIContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RoleProvider } from './components/RoleBasedAccess';
import Navbar from './components/Navbar';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import RemoteAppRefreshManager from './components/RemoteAppRefreshManager';
import { universalDataSync } from './services/universalDataSync';
import { Toaster } from './components/ui/toaster';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Eager pages
import Dashboard from './pages/Dashboard';
import SystemOverview from './pages/SystemOverview';

// Lazy pages
const Tasks = lazy(() => import('./pages/Tasks'));
const TasksNew = lazy(() => import('./pages/TasksNew'));
const Communication = lazy(() => import('./pages/Communication'));
const Contacts = lazy(() => import('./pages/Contacts'));
const ContactsWithRemote = lazy(() => import('./pages/ContactsWithRemote'));
const SimpleContactsTest = lazy(() => import('./pages/SimpleContactsTest'));
const ContactsWorking = lazy(() => import('./pages/ContactsWorking'));
const PipelineWithRemote = lazy(() => import('./pages/PipelineWithRemote'));
const PipelinePage = lazy(() => import('./pages/PipelinePage'));
const AITools = lazy(() => import('./pages/AITools'));
const Analytics = lazy(() => import('./pages/AnalyticsDashboard'));
const AIIntegration = lazy(() => import('./pages/AIIntegration'));
const Settings = lazy(() => import('./pages/Settings'));
const TextMessages = lazy(() => import('./pages/TextMessages'));

// Authentication
const Login = lazy(() => import('./pages/Auth/Login'));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/Auth/ResetPassword'));
const DevBypassPage = lazy(() => import('./pages/DevBypassPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));

// Comprehensive implementations
const PhoneSystem = lazy(() => import('./pages/PhoneSystem'));
const Invoicing = lazy(() => import('./pages/Invoicing'));
const ContentLibrary = lazy(() => import('./pages/ContentLibrary'));
const FormsAndSurveys = lazy(() => import('./pages/FormsAndSurveys'));
const VoiceProfiles = lazy(() => import('./pages/VoiceProfiles'));
const BusinessAnalysis = lazy(() => import('./pages/BusinessAnalysis'));
const Appointments = lazy(() => import('./pages/Appointments'));
const CommunicationHub = lazy(() => import('./pages/CommunicationHub'));
const RemotePipeline = lazy(() => import('./pages/RemotePipeline'));

// Sales pages
import WinRateIntelligence from './pages/WinRateIntelligence';
import AISalesForecast from './pages/AISalesForecast';
import LiveDealAnalysis from './pages/LiveDealAnalysis';
import CompetitorInsights from './pages/CompetitorInsights';
import RevenueIntelligence from './pages/RevenueIntelligence';

// Communication pages
import ActivityAnalytics from './pages/ActivityAnalytics';
import ResponseIntelligence from './pages/ResponseIntelligence';
import ChannelSyncHub from './pages/ChannelSyncHub';
import SmartEmailOptimizer from './pages/SmartEmailOptimizer';
import SentimentMonitor from './pages/SentimentMonitor';
import CommPerformance from './pages/CommPerformance';

// Remote embed pages
const BusinessIntelPage = lazy(() => import('./pages/BusinessIntelPage'));
const WLPage = lazy(() => import('./pages/WLPage'));
const IntelPage = lazy(() => import('./pages/IntelPage'));

// White-label management components
const WhiteLabelManagementDashboard = lazy(() => import('./pages/WhiteLabelManagementDashboard'));
const WhiteLabelPackageBuilder = lazy(() => import('./pages/WhiteLabelPackageBuilder'));
const RevenueSharingPage = lazy(() => import('./pages/RevenueSharingPage'));
const PartnerDashboard = lazy(() => import('./pages/PartnerDashboard'));
const PartnerOnboardingPage = lazy(() => import('./pages/PartnerOnboardingPage'));

// Connected Apps Remote Pages
const FunnelCraftPage = lazy(() => import('./pages/FunnelCraftPage'));
const SmartCRMPage = lazy(() => import('./pages/SmartCRMPage'));
const ContentAIPage = lazy(() => import('./pages/ContentAIPage'));
const AnalyticsRemotePage = lazy(() => import('./pages/AnalyticsRemotePage'));

// User Account Management
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));

// Demo Pages for Sales
const DashboardDemo = lazy(() => import('./pages/demos/DashboardDemo'));
const ContactsDemo = lazy(() => import('./pages/demos/ContactsDemo'));
const PipelineDemo = lazy(() => import('./pages/demos/PipelineDemo'));

// Import AssistantsDashboard component
const AssistantsDashboard = lazy(() => import('./pages/AssistantsDashboard'));

// Added lazy import for IframeOverlapChecker
const IframeOverlapChecker = lazy(() => import('./pages/IframeOverlapChecker'));

// Authentication imports
import FormPublic from './pages/FormPublic';
import UnauthorizedPage from './pages/UnauthorizedPage';
import UserManagement from './pages/UserManagement';
import PartnerManagementPage from './pages/PartnerManagementPage';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import LeadCapture from './pages/LeadCapture';
import AIGoalsPage from './pages/AIGoals/AIGoalsPage';
import GoalCardDemo from './pages/GoalCardDemo';
import ContactDetail from './pages/ContactDetail';
import Pipeline from './pages/PipelinePage';

// Bulk import page
const BulkImportPage = lazy(() => import('./pages/BulkImportPage'));
// Admin Dashboard page
import AdminDashboard from './pages/AdminDashboard';

// Entitlements management page
const EntitlementsPage = lazy(() => import('./pages/EntitlementsPage'));

// Feature pages
import AiAssistantFeaturePage from './pages/landing/FeaturePage/AiAssistantFeaturePage';
import AiToolsFeaturePage from './pages/landing/FeaturePage/AiToolsFeaturePage';
import CommunicationsFeaturePage from './pages/landing/FeaturePage/CommunicationsFeaturePage';
import ContactsFeaturePage from './pages/landing/FeaturePage/ContactsFeaturePage';
import FunctionAssistantFeaturePage from './pages/landing/FeaturePage/FunctionAssistantFeaturePage';
import ImageGeneratorFeaturePage from './pages/landing/FeaturePage/ImageGeneratorFeaturePage';
import PipelineFeaturePage from './pages/landing/FeaturePage/PipelineFeaturePage';
import SemanticSearchFeaturePage from './pages/landing/FeaturePage/SemanticSearchFeaturePage';
import VisionAnalyzerFeaturePage from './pages/landing/FeaturePage/VisionAnalyzerFeaturePage';

// Additional whitelabel imports
import LinkRedirect from './components/shared/LinkRedirect';
const WhiteLabelCustomization = lazy(() => import('./pages/WhiteLabelCustomization'));

import './styles/design-system.css';
// ElevenLabs widgets removed to prevent performance issues
// import VoiceAgentWidget from './components/VoiceAgentWidget';
// import ElevenLabsIframeWidget from './components/ElevenLabsIframeWidget';

// Reusable placeholder
const PlaceholderPage = ({ title, description }: { title: string; description?: string }) => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{title}</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">{description || 'This page is coming soon...'}</p>
      </div>
    </div>
  </div>
);

// Loading screen component
const AuthLoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Smart CRM</h2>
      <p className="text-gray-600">Please wait while we initialize your session...</p>
    </div>
  </div>
);

// Dark mode hook
const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDark));
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return [isDark, setIsDark];
};

function App() {
  // Initialize universal data sync
  useEffect(() => {
    console.log('🚀 Starting Universal Data Sync System');
    universalDataSync.initialize();

    return () => {
      universalDataSync.destroy();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <TenantProvider>
            <WhitelabelProvider>
              <AIToolsProvider>
                <ModalsProvider>
                  <EnhancedHelpProvider>
                    <VideoCallProvider>
                      <NavigationProvider>
                        <DashboardLayoutProvider>
                          <AIProvider>
                            <RoleProvider>
                              <AppContent />
                            </RoleProvider>
                          </AIProvider>
                        </DashboardLayoutProvider>
                      </NavigationProvider>
                    </VideoCallProvider>
                  </EnhancedHelpProvider>
                </ModalsProvider>
              </AIToolsProvider>
            </WhitelabelProvider>
          </TenantProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

// AppContent component with all the routing logic
function AppContent() {
  const { user, loading } = useAuth();
  const [darkMode, setDarkMode] = useDarkMode();

  if (loading) {
    return <AuthLoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <LinkRedirect />
      <RemoteAppRefreshManager />
      <Suspense fallback={<LoadingSpinner message="Loading page..." size="lg" />}>
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Auth pages */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/dev-bypass" element={<DevBypassPage />} />

          {/* Core pages */}
          <Route
            path="/system-overview"
            element={
              <ProtectedRoute>
                <SystemOverview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-integration"
            element={
              <ProtectedRoute>
                <AIIntegration />
              </ProtectedRoute>
            }
          />

          {/* White Label Customization */}
          <Route
            path="/white-label"
            element={
              <ProtectedRoute>
                <WhiteLabelCustomization />
              </ProtectedRoute>
            }
          />

          {/* AI Goals */}
          <Route
            path="/ai-goals"
            element={
              <ProtectedRoute>
                <AIGoalsPage />
              </ProtectedRoute>
            }
          />

          {/* Feature showcase routes */}
          <Route path="/features/ai-tools" element={<PlaceholderPage title="AI Tools Features" />} />
          <Route path="/features/contacts" element={<PlaceholderPage title="Contact Management Features" />} />
          <Route path="/features/pipeline" element={<PlaceholderPage title="Pipeline Features" />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      
      {/* Toaster for notifications */}
      <Toaster />
      
      {/* ElevenLabs widgets removed to prevent performance issues */}
    </div>
  );
}

export default App;