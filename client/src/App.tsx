// src/App.tsx

import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
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
import { NavbarPositionProvider, useNavbarPosition } from './contexts/NavbarPositionContext';
import Navbar from './components/Navbar';
import { EdgeZones } from './components/EdgeZones';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import RemoteAppRefreshManager from './components/RemoteAppRefreshManager';
import { universalDataSync } from './services/universalDataSync';
import { networkTest } from './utils/networkConnectivityTest';
import { Toaster } from './components/ui/toaster';
import ProtectedRoute from './components/ProtectedRoute';

// Eager pages
import Dashboard from './pages/Dashboard';
import SystemOverview from './pages/SystemOverview';

// Lazy pages
const TasksNew = lazy(() => import('./pages/TasksNew'));
const Communication = lazy(() => import('./pages/Communication'));
const ContactsWorking = lazy(() => import('./pages/ContactsWorking'));
const PipelinePage = lazy(() => import('./pages/PipelinePage'));
const AITools = lazy(() => import('./pages/AITools'));
const Analytics = lazy(() => import('./pages/AnalyticsDashboard'));
const AIIntegration = lazy(() => import('./pages/AIIntegration'));
const TextMessages = lazy(() => import('./pages/TextMessages'));

// Authentication
const Login = lazy(() => import('./pages/Auth/Login'));
const SignInPage = lazy(() => import('./pages/SignInPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/Auth/ResetPassword'));
const DevBypassPage = lazy(() => import('./pages/DevBypassPage'));

// Comprehensive implementations
const PhoneSystem = lazy(() => import('./pages/PhoneSystem'));
const Invoicing = lazy(() => import('./pages/Invoicing'));
const ContentLibrary = lazy(() => import('./pages/ContentLibrary'));
const FormsAndSurveys = lazy(() => import('./pages/FormsAndSurveys'));
const VoiceProfiles = lazy(() => import('./pages/VoiceProfiles'));
const BusinessAnalysis = lazy(() => import('./pages/BusinessAnalysis'));
const Appointments = lazy(() => import('./pages/Appointments'));
const CommunicationHub = lazy(() => import('./pages/CommunicationHub'));
const RemoteCalendar = lazy(() => import('./pages/RemoteCalendar'));

// Sales pages
import WinRateIntelligence from './pages/WinRateIntelligence';
import AISalesForecast from './pages/AISalesForecast';
import LiveDealAnalysis from './pages/LiveDealAnalysis';
import CompetitorInsights from './pages/CompetitorInsights';
import RevenueIntelligence from './pages/RevenueIntelligence';
import PipelineIntelligence from './pages/PipelineIntelligence';
import DealRiskMonitor from './pages/DealRiskMonitor';
import SmartConversionInsights from './pages/SmartConversionInsights';
import PipelineHealthDashboard from './pages/PipelineHealthDashboard';
import SalesCycleAnalytics from './pages/SalesCycleAnalytics';

// Communication pages

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

// Communication Apps
const AppointmentsDashboard = lazy(() => import('./pages/AppointmentsDashboard'));
const VideoEmailDashboard = lazy(() => import('./pages/VideoEmailDashboard'));
const TextMessagingDashboard = lazy(() => import('./pages/TextMessagingDashboard'));
const PhoneSystemDashboard = lazy(() => import('./pages/PhoneSystemDashboard'));
const InvoicingDashboard = lazy(() => import('./pages/InvoicingDashboard'));
const LeadAutomationDashboard = lazy(() => import('./pages/LeadAutomationDashboard'));
const CircleProspectingDashboard = lazy(() => import('./pages/CircleProspectingDashboard'));
const FormsSurveysDashboard = lazy(() => import('./pages/FormsSurveysDashboard'));
const BusinessAnalyzerDashboard = lazy(() => import('./pages/BusinessAnalyzerDashboard'));
const ContentLibraryDashboard = lazy(() => import('./pages/ContentLibraryDashboard'));
const VoiceProfilesDashboard = lazy(() => import('./pages/VoiceProfilesDashboard'));

// Connected Apps Remote Pages
const FunnelCraftPage = lazy(() => import('./pages/FunnelCraftPage'));
const SmartCRMPage = lazy(() => import('./pages/SmartCRMPage'));
const ContentAIPage = lazy(() => import('./pages/ContentAIPage'));
const AnalyticsRemotePage = lazy(() => import('./pages/AnalyticsRemotePage'));

// User Account Management

// Demo Pages for Sales
const DashboardDemo = lazy(() => import('./pages/demos/DashboardDemo'));
const ContactsDemo = lazy(() => import('./pages/demos/ContactsDemo'));
const PipelineDemo = lazy(() => import('./pages/demos/PipelineDemo'));

// Import AssistantsDashboard component
const AssistantsDashboard = lazy(() => import('./pages/AssistantsDashboard'));

// Added lazy import for IframeOverlapChecker

// Authentication imports
import DemoDashboard from './pages/DemoDashboard';
const AIGoalsWithRemote = lazy(() => import('./pages/AIGoalsWithRemote'));

// Bulk import page
// Admin Dashboard page
import AdminDashboard from './pages/AdminDashboard';

// Entitlements management page

// Feature pages
import AiToolsFeaturePage from './pages/landing/FeaturePage/AiToolsFeaturePage';
import ContactsFeaturePage from './pages/landing/FeaturePage/ContactsFeaturePage';
import PipelineFeaturePage from './pages/landing/FeaturePage/PipelineFeaturePage';
import AiAssistantFeaturePage from './pages/landing/FeaturePage/AiAssistantFeaturePage';
import VisionAnalyzerFeaturePage from './pages/landing/FeaturePage/VisionAnalyzerFeaturePage';
import ImageGeneratorFeaturePage from './pages/landing/FeaturePage/ImageGeneratorFeaturePage';
import FunctionAssistantFeaturePage from './pages/landing/FeaturePage/FunctionAssistantFeaturePage';
import SemanticSearchFeaturePage from './pages/landing/FeaturePage/SemanticSearchFeaturePage';

// Additional whitelabel imports
import LinkRedirect from './components/shared/LinkRedirect';
const WhiteLabelCustomization = lazy(() => import('./pages/WhiteLabelCustomization'));

// Landing page imports
import LandingPage from './pages/LandingPage';

// Dashboard embed import
import DashboardEmbed from './pages/DashboardEmbed';

import './styles/design-system.css';
// ElevenLabs widgets removed to prevent performance issues

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

// Removed conflicting useDarkMode - now using unified ThemeContext

function App() {
  // Initialize universal data sync
  useEffect(() => {
    console.log('🚀 DEBUG: Starting Universal Data Sync System');
    console.log('🔧 DEBUG: Environment variables check:');
    console.log('  - VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing');
    console.log('  - VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
    console.log('  - NODE_ENV:', import.meta.env.NODE_ENV);
    console.log('  - MODE:', import.meta.env.MODE);

    // Test remote app connectivity
    const remoteAppUrls = [
      'https://calendar.smartcrm.vip',
      'https://analytics.smartcrm.vip',
      'https://contacts.smartcrm.vip',
      'https://agency.smartcrm.vip',
      'https://pipeline.smartcrm.vip',
      'https://research.smartcrm.vip',
      'https://salesmax.smartcrm.vip',
      'https://referrals.smartcrm.vip',
      'https://contentai.smartcrm.vip'
    ];

    console.log('🌐 DEBUG: Testing connectivity to remote apps...');
    networkTest.testAllRemoteApps(remoteAppUrls).then(results => {
      console.log('📊 DEBUG: Remote app connectivity results:');
      results.forEach((result, url) => {
        const status = result.accessible ? '✅ Accessible' : '❌ Inaccessible';
        console.log(`  ${status}: ${url}${result.error ? ` (${result.error})` : ''}`);
      });
    }).catch(error => {
      console.error('❌ DEBUG: Failed to test remote app connectivity:', error);
    });

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
                              <NavbarPositionProvider initialPosition="sidebar">
                                <AppContent />
                              </NavbarPositionProvider>
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
  const { loading, user } = useAuth();
  const { setPosition } = useNavbarPosition();

  // Handle navbar drag end
  const handleNavbarDragEnd = (result: DropResult) => {
    const { destination } = result;

    if (!destination) return;

    // If dropped on an edge zone, snap to that position
    if (destination.droppableId.includes('-edge')) {
      const position = destination.droppableId.split('-')[0] as 'top' | 'left' | 'right' | 'bottom';
      setPosition(position);
    }
  };

  if (loading) {
    return <AuthLoadingScreen />;
  }

  return (
    <DragDropContext onDragEnd={handleNavbarDragEnd}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <EdgeZones />
        <LinkRedirect />
        <RemoteAppRefreshManager />
        <Suspense fallback={<LoadingSpinner />}>
        <Routes>
            {/* Show landing page for non-authenticated users, redirect authenticated users to dashboard */}
            <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
            <Route path="/landing" element={<LandingPage />} />

          {/* Dashboard embed - no navbar */}
          <Route path="/dashboard-embed" element={<DashboardEmbed />} />

          {/* Auth pages */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/dev-bypass" element={<DevBypassPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/voice-profiles" element={<VoiceProfiles />} />
          
          {/* Demo Dashboard - Public access for sales page embedding */}
          <Route path="/demo-dashboard" element={<DemoDashboard />} />

          {/* Demo Dashboard - Public access for sales page embedding */}
          <Route path="/demo/dashboard" element={<DashboardDemo />} />

          {/* Demo Contacts - Public access for automation */}
          <Route path="/demo-contacts" element={<ContactsDemo />} />

          {/* Demo Contacts - Public access for sales page embedding */}
          <Route path="/demo/contacts" element={<ContactsDemo />} />

          {/* Demo Pipeline - Public access for automation */}
          <Route path="/demo-pipeline" element={<PipelineDemo />} />

          {/* Demo Pipeline - Public access for sales page embedding */}
          <Route path="/demo/pipeline" element={<PipelineDemo />} />

          {/* Core pages */}
          <Route
            path="/system-overview"
            element={
              <ProtectedRoute>
                <Navbar />
                <SystemOverview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Navbar />
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Navbar />
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-integration"
            element={
              <ProtectedRoute>
                <Navbar />
                <AIIntegration />
              </ProtectedRoute>
            }
          />

          {/* White Label Customization */}
          <Route
            path="/white-label"
            element={
              <ProtectedRoute>
                <Navbar />
                <WhiteLabelCustomization />
              </ProtectedRoute>
            }
          />
          
          {/* White Label Management Routes */}
          <Route
            path="/white-label-management"
            element={
              <ProtectedRoute>
                <Navbar />
                <WhiteLabelManagementDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/package-builder"
            element={
              <ProtectedRoute>
                <Navbar />
                <WhiteLabelPackageBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/revenue-sharing"
            element={
              <ProtectedRoute>
                <Navbar />
                <RevenueSharingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner-dashboard"
            element={
              <ProtectedRoute>
                <Navbar />
                <PartnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner-onboarding"
            element={
              <ProtectedRoute>
                <Navbar />
                <PartnerOnboardingPage />
              </ProtectedRoute>
            }
          />

          {/* AI Goals */}
          <Route
            path="/ai-goals"
            element={
              <ProtectedRoute>
                <Navbar />
                <AIGoalsWithRemote />
              </ProtectedRoute>
            }
          />

          {/* AI Tools */}
          <Route
            path="/ai-tools"
            element={
              <ProtectedRoute>
                <Navbar />
                <AITools />
              </ProtectedRoute>
            }
          />

          {/* AI Assistants */}
          <Route
            path="/assistants"
            element={
              <ProtectedRoute>
                <Navbar />
                <AssistantsDashboard />
              </ProtectedRoute>
            }
          />

          {/* Tasks */}
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Navbar />
                <TasksNew />
              </ProtectedRoute>
            }
          />

          {/* Calendar - Remote Calendar Moderation */}
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <Navbar />
                <RemoteCalendar />
              </ProtectedRoute>
            }
          />

          {/* Communication Apps */}
          <Route
            path="/appointments-dashboard"
            element={
              <ProtectedRoute>
                <Navbar />
                <AppointmentsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/video-email"
            element={
              <ProtectedRoute>
                <Navbar />
                <VideoEmailDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/text-messages"
            element={
              <ProtectedRoute>
                <Navbar />
                <TextMessagingDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/phone-system"
            element={
              <ProtectedRoute>
                <Navbar />
                <PhoneSystemDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoicing"
            element={
              <ProtectedRoute>
                <Navbar />
                <InvoicingDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lead-automation"
            element={
              <ProtectedRoute>
                <Navbar />
                <LeadAutomationDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/circle-prospecting"
            element={
              <ProtectedRoute>
                <Navbar />
                <CircleProspectingDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forms"
            element={
              <ProtectedRoute>
                <Navbar />
                <FormsSurveysDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/business-analyzer"
            element={
              <ProtectedRoute>
                <Navbar />
                <BusinessAnalyzerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/content-library"
            element={
              <ProtectedRoute>
                <Navbar />
                <ContentLibraryDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/voice-profiles"
            element={
              <ProtectedRoute>
                <Navbar />
                <VoiceProfilesDashboard />
              </ProtectedRoute>
            }
          />

          {/* Communication */}
          <Route
            path="/communication"
            element={
              <ProtectedRoute>
                <Navbar />
                <Communication />
              </ProtectedRoute>
            }
          />

          {/* Analytics Remote Routes */}
          <Route
            path="/analytics-remote"
            element={
              <ProtectedRoute>
                <Navbar />
                <AnalyticsRemotePage />
              </ProtectedRoute>
            }
          />

          {/* Communication and CRM Tools */}
          <Route
            path="/appointments-basic"
            element={
              <ProtectedRoute>
                <Navbar />
                <Appointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/video-email-basic"
            element={
              <ProtectedRoute>
                <Navbar />
                <PlaceholderPage title="Video Email" description="Video email functionality coming soon..." />
              </ProtectedRoute>
            }
          />
          <Route
            path="/text-messages"
            element={
              <ProtectedRoute>
                <Navbar />
                <TextMessages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/phone-system"
            element={
              <ProtectedRoute>
                <Navbar />
                <PhoneSystem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoicing"
            element={
              <ProtectedRoute>
                <Navbar />
                <Invoicing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lead-automation"
            element={
              <ProtectedRoute>
                <Navbar />
                <PlaceholderPage title="Lead Automation" description="AI-powered lead automation tools coming soon..." />
              </ProtectedRoute>
            }
          />
          <Route
            path="/circle-prospecting"
            element={
              <ProtectedRoute>
                <Navbar />
                <PlaceholderPage title="Circle Prospecting" description="Circle prospecting tools coming soon..." />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forms"
            element={
              <ProtectedRoute>
                <Navbar />
                <FormsAndSurveys />
              </ProtectedRoute>
            }
          />
          <Route
            path="/business-analysis"
            element={
              <ProtectedRoute>
                <Navbar />
                <BusinessAnalysis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/content-library"
            element={
              <ProtectedRoute>
                <Navbar />
                <ContentLibrary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/voice-profiles"
            element={
              <ProtectedRoute>
                <Navbar />
                <VoiceProfiles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/communication-hub"
            element={
              <ProtectedRoute>
                <Navbar />
                <CommunicationHub />
              </ProtectedRoute>
            }
          />

          {/* Business Intelligence and Remote Apps */}
          <Route
            path="/business-intel"
            element={
              <ProtectedRoute>
                <Navbar />
                <BusinessIntelPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/intel"
            element={
              <ProtectedRoute>
                <Navbar />
                <IntelPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wl"
            element={
              <ProtectedRoute>
                <Navbar />
                <WLPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Navbar />
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Sales Intelligence Routes */}
          <Route
            path="/pipeline-intelligence"
            element={
              <ProtectedRoute>
                <Navbar />
                <PipelineIntelligence />
              </ProtectedRoute>
            }
          />
          <Route
            path="/deal-risk-monitor"
            element={
              <ProtectedRoute>
                <Navbar />
                <DealRiskMonitor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/smart-conversion-insights"
            element={
              <ProtectedRoute>
                <Navbar />
                <SmartConversionInsights />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pipeline-health-dashboard"
            element={
              <ProtectedRoute>
                <Navbar />
                <PipelineHealthDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales-cycle-analytics"
            element={
              <ProtectedRoute>
                <Navbar />
                <SalesCycleAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/win-rate-intelligence"
            element={
              <ProtectedRoute>
                <Navbar />
                <WinRateIntelligence />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-sales-forecast"
            element={
              <ProtectedRoute>
                <Navbar />
                <AISalesForecast />
              </ProtectedRoute>
            }
          />
          <Route
            path="/live-deal-analysis"
            element={
              <ProtectedRoute>
                <Navbar />
                <LiveDealAnalysis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/competitor-insights"
            element={
              <ProtectedRoute>
                <Navbar />
                <CompetitorInsights />
              </ProtectedRoute>
            }
          />
          <Route
            path="/revenue-intelligence"
            element={
              <ProtectedRoute>
                <Navbar />
                <RevenueIntelligence />
              </ProtectedRoute>
            }
          />

          {/* Contacts and Pipeline Routes */}
          <Route
            path="/contacts"
            element={
              <ProtectedRoute>
                <Navbar />
                <ContactsWorking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pipeline"
            element={
              <ProtectedRoute>
                <Navbar />
                <PipelinePage />
              </ProtectedRoute>
            }
          />

          {/* Feature showcase routes */}
          <Route path="/features/ai-tools" element={<AiToolsFeaturePage />} />
          <Route path="/features/contacts" element={<ContactsFeaturePage />} />
          <Route path="/features/pipeline" element={<PipelineFeaturePage />} />
          <Route path="/features/ai-assistant" element={<AiAssistantFeaturePage />} />
          <Route path="/features/vision-analyzer" element={<VisionAnalyzerFeaturePage />} />
          <Route path="/features/image-generator" element={<ImageGeneratorFeaturePage />} />
          <Route path="/features/function-assistant" element={<FunctionAssistantFeaturePage />} />
          <Route path="/features/speech-to-text" element={<SemanticSearchFeaturePage />} />

          {/* Remote App Routes */}
          <Route
            path="/funnelcraft-ai"
            element={
              <ProtectedRoute>
                <Navbar />
                <FunnelCraftPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/smartcrm-closer"
            element={
              <ProtectedRoute>
                <Navbar />
                <SmartCRMPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/content-ai"
            element={
              <ProtectedRoute>
                <Navbar />
                <ContentAIPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      {/* Toaster for notifications */}
      <Toaster />

      {/* ElevenLabs widgets removed to prevent performance issues */}
    </div>
    </DragDropContext>
  );
}

export default App;