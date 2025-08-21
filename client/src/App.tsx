// src/App.tsx

import { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { TenantProvider } from './contexts/TenantProvider';
import { AIToolsProvider } from './components/AIToolsProvider';
import { ModalsProvider } from './components/ModalsProvider';
import { EnhancedHelpProvider } from './contexts/EnhancedHelpContext';
import { VideoCallProvider } from './contexts/VideoCallContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { DashboardLayoutProvider } from './contexts/DashboardLayoutContext';
import { AIProvider } from './contexts/AIContext';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import RemoteAppRefreshManager from './components/RemoteAppRefreshManager';
import { universalDataSync } from './services/universalDataSync';

// Eager pages
import Dashboard from './pages/Dashboard';
import SystemOverview from './pages/SystemOverview';

// Lazy pages
const Tasks = lazy(() => import('./pages/Tasks'));
const TasksNew = lazy(() => import('./pages/TasksNew'));
const Communication = lazy(() => import('./pages/Communication'));
const Contacts = lazy(() => import('./pages/Contacts')); // details handled via modal inside
const ContactsWithRemote = lazy(() => import('./pages/ContactsWithRemote')); // Enhanced with Module Federation
const SimpleContactsTest = lazy(() => import('./pages/SimpleContactsTest')); // Button test
const ContactsWorking = lazy(() => import('./pages/ContactsWorking')); // Working contacts with inline styles
const PipelineWithRemote = lazy(() => import('./pages/PipelineWithRemote'));
const PipelinePage = lazy(() => import('./pages/PipelinePage'));
const AITools = lazy(() => import('./pages/AITools'));
const Analytics = lazy(() => import('./pages/AnalyticsDashboard'));
const AIIntegration = lazy(() => import('./pages/AIIntegration'));
const MobileResponsiveness = lazy(() => import('./pages/MobileResponsiveness'));
import SalesTools from './pages/SalesTools';
import PipelineIntelligence from './pages/PipelineIntelligence';
import DealRiskMonitor from './pages/DealRiskMonitor';
import SmartConversionInsights from './pages/SmartConversionInsights';
import SalesCycleAnalytics from './pages/SalesCycleAnalytics';
import PipelineHealthDashboard from './pages/PipelineHealthDashboard';
import LeadAutomation from './pages/LeadAutomation';
import CircleProspecting from './pages/CircleProspecting';
const VideoEmail = lazy(() => import('./pages/VideoEmail'));
const TextMessages = lazy(() => import('./pages/TextMessages'));
const AIGoalsWithRemote = lazy(() => import('./pages/AIGoalsWithRemote'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
import SalesLandingPage from './pages/SalesLandingPage';
const SignInPage = lazy(() => import('./pages/SignInPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage')); // Added ForgotPasswordPage import

// New comprehensive implementations
const PhoneSystem = lazy(() => import('./pages/PhoneSystem'));
const Invoicing = lazy(() => import('./pages/Invoicing'));
const ContentLibrary = lazy(() => import('./pages/ContentLibrary'));
const FormsAndSurveys = lazy(() => import('./pages/FormsAndSurveys'));
const VoiceProfiles = lazy(() => import('./pages/VoiceProfiles'));
const BusinessAnalysis = lazy(() => import('./pages/BusinessAnalysis'));
const Appointments = lazy(() => import('./pages/Appointments'));
const CommunicationHub = lazy(() => import('./pages/CommunicationHub'));
const RemotePipeline = lazy(() => import('./pages/RemotePipeline'));

// Sales pages added
import WinRateIntelligence from './pages/WinRateIntelligence';
import AISalesForecast from './pages/AISalesForecast';
import LiveDealAnalysis from './pages/LiveDealAnalysis';
import CompetitorInsights from './pages/CompetitorInsights';
import RevenueIntelligence from './pages/RevenueIntelligence';

// Communication pages added
import ActivityAnalytics from './pages/ActivityAnalytics';
import ResponseIntelligence from './pages/ResponseIntelligence';
import ChannelSyncHub from './pages/ChannelSyncHub';
// New imports for additional Communication pages
import SmartEmailOptimizer from './pages/SmartEmailOptimizer';
import SentimentMonitor from './pages/SentimentMonitor';
import CommPerformance from './pages/CommPerformance';

// New remote embed pages
const BusinessIntelPage = lazy(() => import('./pages/BusinessIntelPage'));
const WLPage = lazy(() => import('./pages/WLPage'));
const IntelPage = lazy(() => import('./pages/IntelPage'));

// White-label management components
const WhiteLabelCustomization = lazy(() => import('./pages/WhiteLabelCustomization'));
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


// Added lazy import for IframeOverlapChecker
const IframeOverlapChecker = lazy(() => import('./pages/IframeOverlapChecker'));

// Placeholder imports for routes that might not be implemented yet
import Login from './pages/Auth/Login';
import TaskCalendarView from './pages/TaskCalendarView'; // Assuming this path
import BusinessAnalyzer from './pages/BusinessAnalyzer'; // Assuming this path
import DocumentCenter from './pages/DocumentCenter'; // Assuming this path
import FAQ from './pages/FAQ'; // Assuming this path
import FeaturePackageManagementPage from './pages/FeaturePackageManagementPage'; // Assuming this path
import FormPublic from './pages/FormPublic'; // Assuming this path
import UnauthorizedPage from './pages/UnauthorizedPage';
import UserManagement from './pages/UserManagement';
import PartnerManagementPage from './pages/PartnerManagementPage';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import LeadCapture from './pages/LeadCapture';
import AIGoalsPage from './pages/AIGoals/AIGoalsPage'; // Assuming this path
import GoalCardDemo from './pages/GoalCardDemo'; // Assuming this path
import ContactDetail from './pages/ContactDetail'; // Assuming this path
import Settings from './pages/Settings'; // Assuming this path
import Pipeline from './pages/PipelinePage'; // Assuming this path

// Bulk import page
const BulkImportPage = lazy(() => import('./pages/BulkImportPage'));

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

import './styles/design-system.css';


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

// Simple protected wrapper if/when you add auth
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => <>{children}</>;

function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Initialize universal data sync
  useEffect(() => {
    console.log('🚀 Starting Universal Data Sync System');
    universalDataSync.initialize();

    return () => {
      universalDataSync.destroy();
    };
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <TenantProvider>
          <AIToolsProvider>
            <ModalsProvider>
              <EnhancedHelpProvider>
                <VideoCallProvider>
                  <NavigationProvider>
                    <DashboardLayoutProvider>
                      <AIProvider>
                        <Routes>
                        {/* Landing page routes (no navbar) */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/sales" element={<SalesLandingPage />} />
                        <Route path="/signin" element={<SignInPage />} />
                        <Route path="/signup" element={<SignUpPage />} />
                        <Route path="/login" element={<SignInPage />} />
                        <Route path="/register" element={<SignUpPage />} />
                        <Route path="/demo" element={<LandingPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} /> {/* Added ForgotPasswordPage route */}

                        {/* All other routes with navbar */}
                        <Route path="/*" element={
                          <div className="h-screen w-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
                            <Navbar />
                            <div className="flex-1 overflow-hidden navbar-spacing" style={{ paddingTop: '80px', minHeight: 'calc(100vh - 80px)' }}>
                              <Suspense fallback={<LoadingSpinner message="Loading..." size="lg" />}>
                                <Routes>
                                  {/* App routes redirect to dashboard */}
                                  <Route path="/app" element={<Navigate to="/dashboard" replace />} />

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
                            <Route
                              path="/ai-tools"
                              element={
                                <ProtectedRoute>
                                  <AITools />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/pipeline"
                              element={
                                <ProtectedRoute>
                                  <PipelineWithRemote />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/remote-pipeline"
                              element={
                                <ProtectedRoute>
                                  <RemotePipeline />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/mobile"
                              element={
                                <ProtectedRoute>
                                  <MobileResponsiveness />
                                </ProtectedRoute>
                              }
                            />

                            {/* Test route for debugging buttons */}
                            <Route
                              path="/test-buttons"
                              element={
                                <ProtectedRoute>
                                  <SimpleContactsTest />
                                </ProtectedRoute>
                              }
                            />

                            {/* Contacts page - Using Remote Module Federation */}
                            <Route
                              path="/contacts"
                              element={
                                <ProtectedRoute>
                                  <ContactsWithRemote />
                                </ProtectedRoute>
                              }
                            />
                            {/* Deep-link: /contacts/:id opens same page and the page handles auto-opening modal */}
                            <Route
                              path="/contacts/:id"
                              element={
                                <ProtectedRoute>
                                  <ContactsWithRemote />
                                </ProtectedRoute>
                              }
                            />
                            {/* Legacy contacts route for fallback */}
                            <Route
                              path="/contacts-legacy"
                              element={
                                <ProtectedRoute>
                                  <Contacts />
                                </ProtectedRoute>
                              }
                            />

                            {/* Tasks & Calendar */}
                            <Route
                              path="/tasks"
                              element={
                                <ProtectedRoute>
                                  <TasksNew />
                                </ProtectedRoute>
                              }
                            />
                            {/* Calendar from navbar points here */}
                            <Route
                              path="/appointments"
                              element={
                                <ProtectedRoute>
                                  <Appointments />
                                </ProtectedRoute>
                              }
                            />
                            {/* (If you still use the older Tasks page elsewhere) */}
                            <Route
                              path="/tasks-legacy"
                              element={
                                <ProtectedRoute>
                                  <Tasks />
                                </ProtectedRoute>
                              }
                            />

                            {/* ===== Dropdown: Sales ===== */}
                            <Route
                              path="/sales-tools"
                              element={
                                <ProtectedRoute>
                                  <SalesTools />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/pipeline-intelligence"
                              element={
                                <ProtectedRoute>
                                  <PipelineIntelligence />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/deal-risk-monitor"
                              element={
                                <ProtectedRoute>
                                  <DealRiskMonitor />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/smart-conversion-insights"
                              element={
                                <ProtectedRoute>
                                  <SmartConversionInsights />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/pipeline-health-dashboard"
                              element={
                                <ProtectedRoute>
                                  <PipelineHealthDashboard />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/sales-cycle-analytics"
                              element={
                                <ProtectedRoute>
                                  <SalesCycleAnalytics />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/lead-automation"
                              element={
                                <ProtectedRoute>
                                  <LeadAutomation />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/circle-prospecting"
                              element={
                                <ProtectedRoute>
                                  <CircleProspecting />
                                </ProtectedRoute>
                              }
                            />
                            {/* Appointments already routed to /appointments above */}
                            <Route
                              path="/phone-system"
                              element={
                                <ProtectedRoute>
                                  <PhoneSystem />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/invoicing"
                              element={
                                <ProtectedRoute>
                                  <Invoicing />
                                </ProtectedRoute>
                              }
                            />
                            {/* Newly added sales pages */}
                            <Route
                              path="/win-rate-intelligence"
                              element={
                                <ProtectedRoute>
                                  <WinRateIntelligence />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/ai-sales-forecast"
                              element={
                                <ProtectedRoute>
                                  <AISalesForecast />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/live-deal-analysis"
                              element={
                                <ProtectedRoute>
                                  <LiveDealAnalysis />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/competitor-insights"
                              element={
                                <ProtectedRoute>
                                  <CompetitorInsights />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/revenue-intelligence"
                              element={
                                <ProtectedRoute>
                                  <RevenueIntelligence />
                                </ProtectedRoute>
                              }
                            />

                            {/* ===== Dropdown: Tasks ===== */}
                            <Route
                              path="/task-automation"
                              element={<PlaceholderPage title="Task Automation" />}
                            />
                            <Route
                              path="/project-tracker"
                              element={<PlaceholderPage title="Project Tracker" />}
                            />
                            <Route
                              path="/time-tracking"
                              element={<PlaceholderPage title="Time Tracking" />}
                            />
                            <Route
                              path="/workflow-builder"
                              element={<PlaceholderPage title="Workflow Builder" />}
                            />
                            <Route
                              path="/deadline-manager"
                              element={<PlaceholderPage title="Deadline Manager" />}
                            />

                            {/* ===== Dropdown: Communication ===== */}
                            <Route
                              path="/video-email"
                              element={
                                <ProtectedRoute>
                                  <VideoEmail />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/text-messages"
                              element={
                                <ProtectedRoute>
                                  <TextMessages />
                                </ProtectedRoute>
                              }
                            />
                            {/* Email Composer goes to Communication page you already have */}
                            <Route
                              path="/email-composer"
                              element={
                                <ProtectedRoute>
                                  <Communication />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/communication"
                              element={
                                <ProtectedRoute>
                                  <CommunicationHub />
                                </ProtectedRoute>
                              }
                            />
                            {/* New Communication Routes */}
                            <Route
                              path="/activity-analytics"
                              element={
                                <ProtectedRoute>
                                  <ActivityAnalytics />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/response-intelligence"
                              element={
                                <ProtectedRoute>
                                  <ResponseIntelligence />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/channel-sync-hub"
                              element={
                                <ProtectedRoute>
                                  <ChannelSyncHub />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/smart-email-optimizer"
                              element={
                                <ProtectedRoute>
                                  <SmartEmailOptimizer />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/sentiment-monitor"
                              element={
                                <ProtectedRoute>
                                  <SentimentMonitor />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/comm-performance"
                              element={
                                <ProtectedRoute>
                                  <CommPerformance />
                                </ProtectedRoute>
                              }
                            />

                            <Route
                              path="/campaigns"
                              element={<PlaceholderPage title="Campaigns" />}
                            />
                            <Route
                              path="/group-calls"
                              element={<PlaceholderPage title="Group Calls" />}
                            />
                            <Route
                              path="/call-recording"
                              element={<PlaceholderPage title="Call Recording" />}
                            />
                            <Route
                              path="/in-call-messaging"
                              element={<PlaceholderPage title="In-Call Messaging" />}
                            />
                            <Route
                              path="/call-analytics"
                              element={<PlaceholderPage title="Call Analytics" />}
                            />
                            <Route
                              path="/connection-quality"
                              element={<PlaceholderPage title="Connection Quality Monitor" />}
                            />

                            {/* ===== Dropdown: Content ===== */}
                            <Route
                              path="/content-library"
                              element={
                                <ProtectedRoute>
                                  <ContentLibrary />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/voice-profiles"
                              element={
                                <ProtectedRoute>
                                  <VoiceProfiles />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/business-analysis"
                              element={
                                <ProtectedRoute>
                                  <BusinessAnalysis />
                                </ProtectedRoute>
                              }
                            />

                            {/* Remote Embed Pages */}
                            <Route
                              path="/business-intel"
                              element={
                                <ProtectedRoute>
                                  <BusinessIntelPage />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/wl"
                              element={
                                <ProtectedRoute>
                                  <WLPage />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/intel"
                              element={
                                <ProtectedRoute>
                                  <IntelPage />
                                </ProtectedRoute>
                              }
                            />

                            {/* Connected Apps Remote Pages */}
                            <Route
                              path="/funnelcraft-ai"
                              element={
                                <ProtectedRoute>
                                  <FunnelCraftPage />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/smartcrm-closer"
                              element={
                                <ProtectedRoute>
                                  <SmartCRMPage />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/content-ai"
                              element={
                                <ProtectedRoute>
                                  <ContentAIPage />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/analytics-remote"
                              element={
                                <ProtectedRoute>
                                  <AnalyticsRemotePage />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/image-generator"
                              element={<PlaceholderPage title="Image Generator" />}
                            />
                            <Route
                              path="/forms"
                              element={
                                <ProtectedRoute>
                                  <FormsAndSurveys />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/ai-model-demo"
                              element={<PlaceholderPage title="AI Model Demo" />}
                            />

                            {/* ===== Apps dropdown internal links ===== */}
                            <Route
                              path="/white-label"
                              element={
                                <ProtectedRoute>
                                  <WhiteLabelCustomization />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/white-label-management"
                              element={
                                <ProtectedRoute>
                                  <WhiteLabelManagementDashboard />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/revenue-sharing"
                              element={
                                <ProtectedRoute>
                                  <RevenueSharingPage />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/package-builder"
                              element={
                                <ProtectedRoute>
                                  <WhiteLabelPackageBuilder />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/partner-dashboard"
                              element={
                                <ProtectedRoute>
                                  <PartnerDashboard />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/partner-onboarding"
                              element={
                                <ProtectedRoute>
                                  <PartnerOnboardingPage />
                                </ProtectedRoute>
                              }
                            />

                            {/* Misc / Settings */}
                            <Route
                              path="/settings"
                              element={<PlaceholderPage title="Settings" description="Settings page coming soon" />}
                            />
                            <Route
                              path="/bulk-import"
                              element={
                                <ProtectedRoute>
                                  <BulkImportPage />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/entitlements"
                              element={
                                <ProtectedRoute>
                                  <EntitlementsPage />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/ai-goals"
                              element={
                                <ProtectedRoute>
                                  <AIGoalsWithRemote />
                                </ProtectedRoute>
                              }
                            />

                            {/* Additional feature pages that may be referenced */}
                            <Route path="/features/speech-to-text" element={<PlaceholderPage title="Speech to Text" description="Advanced speech recognition for sales calls and meetings" />} />
                            <Route path="/features/automation" element={<PlaceholderPage title="Sales Automation" description="Automated workflows and sales processes" />} />
                            <Route path="/features/appointments" element={<Appointments />} />

                                  <Route path="/iframe-overlap-checker" element={<Suspense fallback={<LoadingSpinner />}><IframeOverlapChecker /></Suspense>} />

                            {/* Feature pages */}
                            <Route path="/features/ai-assistant" element={<AiAssistantFeaturePage />} />
                            <Route path="/features/ai-tools" element={<AiToolsFeaturePage />} />
                            <Route path="/features/communications" element={<CommunicationsFeaturePage />} />
                            <Route path="/features/contacts" element={<ContactsFeaturePage />} />
                            <Route path="/features/function-assistant" element={<FunctionAssistantFeaturePage />} />
                            <Route path="/features/image-generator" element={<ImageGeneratorFeaturePage />} />
                            <Route path="/features/pipeline" element={<PipelineFeaturePage />} />
                            <Route path="/features/semantic-search" element={<SemanticSearchFeaturePage />} />
                            <Route path="/features/vision-analyzer" element={<VisionAnalyzerFeaturePage />} />

                            {/* Legacy feature page routes for backward compatibility */}
                            <Route path="/landing/features/ai-assistant" element={<AiAssistantFeaturePage />} />
                            <Route path="/landing/features/ai-tools" element={<AiToolsFeaturePage />} />
                            <Route path="/landing/features/communications" element={<CommunicationsFeaturePage />} />
                            <Route path="/landing/features/contacts" element={<ContactsFeaturePage />} />
                            <Route path="/landing/features/function-assistant" element={<FunctionAssistantFeaturePage />} />
                            <Route path="/landing/features/image-generator" element={<ImageGeneratorFeaturePage />} />
                            <Route path="/landing/features/pipeline" element={<PipelineFeaturePage />} />
                            <Route path="/landing/features/semantic-search" element={<SemanticSearchFeaturePage />} />
                            <Route path="/landing/features/vision-analyzer" element={<VisionAnalyzerFeaturePage />} />

                {/* System and Analytics Routes */}
                                  {/* Fallback */}
                                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                                </Routes>
                              </Suspense>
                            </div>
                          </div>
                        } />
                      </Routes>
                      <RemoteAppRefreshManager />
                      </AIProvider>
                    </DashboardLayoutProvider>
                  </NavigationProvider>
                </VideoCallProvider>
              </EnhancedHelpProvider>
            </ModalsProvider>
          </AIToolsProvider>
        </TenantProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;