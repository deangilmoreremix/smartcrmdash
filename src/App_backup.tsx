import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { ClerkWrapper } from './components/auth/ClerkWrapper';
import { SaaSProvider } from './contexts/SaaSContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { WhiteLabelProvider } from './contexts/WhiteLabelContext';
import { AIToolsProvider } from './components/AIToolsProvider';
import { ModalsProvider } from './components/ModalsProvider';
import { EnhancedHelpProvider } from './contexts/EnhancedHelpContext';
import { VideoCallProvider } from './contexts/VideoCallContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { DashboardLayoutProvider } from './contexts/DashboardLayoutContext';
import Navbar from './components/Navbar';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Critical pages - load immediately
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/Landing/LandingPage';
import SystemOverview from './pages/SystemOverview';
import PlaceholderPage from './components/ui/PlaceholderPage';

// Auth pages
const SignInPage = lazy(() => import('./pages/auth/SignInPage'));
const SignUpPage = lazy(() => import('./pages/auth/SignUpPage'));
const OnboardingPage = lazy(() => import('./pages/auth/OnboardingPage'));

// Heavy pages - lazy load for better performance
const Tasks = lazy(() => import('./pages/Tasks'));
const TasksNew = lazy(() => import('./pages/TasksNew'));
const Contacts = lazy(() => import('./pages/Contacts'));
const ContactsEnhanced = lazy(() => import('./pages/ContactsEnhanced'));
const Pipeline = lazy(() => import('./pages/Pipeline'));
const AITools = lazy(() => import('./pages/AITools'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Communication = lazy(() => import('./pages/Communication'));
const AIIntegration = lazy(() => import('./pages/AIIntegration'));
const MobileResponsiveness = lazy(() => import('./pages/MobileResponsiveness'));

// Import existing page components from pages folder
const VideoEmail = lazy(() => import('../pages/VideoEmail'));
const TextMessages = lazy(() => import('../pages/TextMessages'));
const Appointments = lazy(() => import('../pages/Appointments'));
const ContentLibrary = lazy(() => import('../pages/ContentLibrary/ContentLibrary'));
const VoiceProfiles = lazy(() => import('../pages/VoiceProfiles/VoiceProfiles'));
const BusinessAnalysis = lazy(() => import('../pages/BusinessAnalysis/BusinessAnalyzer'));
const CircleProspecting = lazy(() => import('../pages/CircleProspecting'));
const PhoneSystem = lazy(() => import('../pages/PhoneSystem'));
const Invoicing = lazy(() => import('../pages/Invoicing'));
const FormsAndSurveys = lazy(() => import('../pages/FormsAndSurveys'));
const SalesTools = lazy(() => import('../pages/SalesTools'));
const LeadAutomation = lazy(() => import('../pages/LeadAutomation'));
const Settings = lazy(() => import('../pages/Settings'));

// Import additional existing components
const FAQ = lazy(() => import('../pages/FAQ'));
const TaskCalendarView = lazy(() => import('../pages/TaskCalendarView'));

// Import AI Tools components
const EmailComposerContent = lazy(() => import('../components/aiTools/EmailComposerContent'));
const SalesInsights = lazy(() => import('../components/aiTools/SalesInsightsContent'));
const SalesForecast = lazy(() => import('../components/aiTools/SalesForecastContent'));
const EmailAnalysisContent = lazy(() => import('../components/aiTools/EmailAnalysisContent'));
const MeetingSummaryContent = lazy(() => import('../components/aiTools/MeetingSummaryContent'));
const CustomerPersonaContent = lazy(() => import('../components/aiTools/CustomerPersonaContent'));
const CompetitorAnalysisContent = lazy(() => import('../components/aiTools/CompetitorAnalysisContent'));
const CallScriptContent = lazy(() => import('../components/aiTools/CallScriptContent'));
const ObjectionHandlerContent = lazy(() => import('../components/aiTools/ObjectionHandlerContent'));
const VoiceAnalysisRealtime = lazy(() => import('../components/aiTools/VoiceAnalysisRealtime'));
const ImageGeneratorContent = lazy(() => import('../components/aiTools/ImageGeneratorContent'));
const FunctionAssistantContent = lazy(() => import('../components/aiTools/FunctionAssistantContent'));
const ReasoningEmailGenerator = lazy(() => import('../components/aiTools/ReasoningEmailGenerator'));
const ReasoningProposalGenerator = lazy(() => import('../components/aiTools/ReasoningProposalGenerator'));
const ReasoningObjectionHandler = lazy(() => import('../components/aiTools/ReasoningObjectionHandler'));

// Import AI Suite and Smart Components (using named exports)
const AISmartFeaturesHub = lazy(() => import('./components/sections/AISmartFeaturesHub'));
const AIModelUsageStats = lazy(() => import('./components/AIModelUsageStats'));
const AIModelSelector = lazy(() => import('./components/AIModelSelector'));
const AIInsightsPanel = lazy(() => import('./components/dashboard/AIInsightsPanel'));
const DemoAgentModal = lazy(() => import('../components/DemoAgentModal'));

// Import communication components
const CallRecordingPage = lazy(() => import('./pages/CallRecordingPage'));
const InCallMessagingPage = lazy(() => import('./pages/InCallMessagingPage'));
const GroupCallView = lazy(() => import('./components/GroupCallView'));
const CallHistory = lazy(() => import('./components/CallHistory'));

// Import task management components
const TaskKanbanBoardPage = lazy(() => import('./pages/TaskKanbanBoardPage'));
const AITaskPrioritizer = lazy(() => import('./components/AITaskPrioritizer'));

// Import AI Goals and Management components
const AIGoalsPanel = lazy(() => import('./components/AIGoalsPanel'));
const AdvancedFeaturesDashboard = lazy(() => import('./components/AdvancedFeaturesDashboard'));
const AIAutomationDashboard = lazy(() => import('./components/AIAutomationDashboard'));
const EnhancedAIInsightsPanel = lazy(() => import('./components/EnhancedAIInsightsPanel'));

// Import Communication Management components  
const ConnectionQuality = lazy(() => import('./components/ConnectionQuality'));
const EmailComposer = lazy(() => import('./components/EmailComposer'));
const GroupCallInterface = lazy(() => import('./components/GroupCallInterface'));
const PreCallSetup = lazy(() => import('./components/PreCallSetup'));
const InCallMessaging = lazy(() => import('./components/InCallMessaging'));

// Import Marketing and Lead Management
const ContactAutomation = lazy(() => import('./components/communications/ContactAutomation'));

// Import Landing and Feature Pages
const LandingHeader = lazy(() => import('../pages/Landing/components/LandingHeader'));
const TestLandingPage = lazy(() => import('../pages/Landing/TestLandingPage'));

// Import Contact Detail component
const ContactDetail = lazy(() => import('../pages/ContactDetail'));

// Import Auth components
const Login = lazy(() => import('../pages/Auth/Login'));
const Register = lazy(() => import('../pages/Auth/Register'));

// Import White Label Editor
const WhiteLabelPage = lazy(() => import('./pages/WhiteLabelPage'));

// Import Landing Feature Pages
const AiToolsFeaturePage = lazy(() => import('../pages/Landing/FeaturePage/AiToolsFeaturePage'));
const ContactsFeaturePage = lazy(() => import('../pages/Landing/FeaturePage/ContactsFeaturePage'));
const PipelineFeaturePage = lazy(() => import('../pages/Landing/FeaturePage/PipelineFeaturePage'));
const AiAssistantFeaturePage = lazy(() => import('../pages/Landing/FeaturePage/AiAssistantFeaturePage'));
const VisionAnalyzerFeaturePage = lazy(() => import('../pages/Landing/FeaturePage/VisionAnalyzerFeaturePage'));
const ImageGeneratorFeaturePage = lazy(() => import('../pages/Landing/FeaturePage/ImageGeneratorFeaturePage'));
const FunctionAssistantFeaturePage = lazy(() => import('../pages/Landing/FeaturePage/FunctionAssistantFeaturePage'));
const SemanticSearchFeaturePage = lazy(() => import('../pages/Landing/FeaturePage/SemanticSearchFeaturePage'));

import './components/styles/design-system.css';

// Placeholder component for routes not yet implemented
const PlaceholderPage = ({ title, description }: { title: string; description?: string }) => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{title}</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">{description || "This page is coming soon..."}</p>
      </div>
    </div>
  </div>
);

// Protected Route component (placeholder for future auth)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // TODO: Add authentication logic here when auth is implemented
  return <>{children}</>;
};

// Layout wrapper that conditionally shows navbar
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  // Pages that should NOT show the navbar (landing page and auth pages)
  const noNavbarPaths = ['/', '/sign-in', '/sign-up', '/onboarding'];
  const shouldShowNavbar = !noNavbarPaths.includes(location.pathname);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {shouldShowNavbar && <Navbar />}
      {children}
    </div>
  );
};

function App() {
  return (
    <ClerkWrapper>
      <SaaSProvider>
        <ThemeProvider>
          <WhiteLabelProvider>
            <AIToolsProvider>
              <ModalsProvider>
                <EnhancedHelpProvider>
                  <VideoCallProvider>
                    <NavigationProvider>
                      <DashboardLayoutProvider>
                        <AppLayout>
                          <Suspense fallback={<LoadingSpinner message="Loading page..." size="lg" />}>
                            <Routes>
                              {/* Public Routes */}
                              <Route path="/" element={<LandingPage />} />
                              
                              {/* Auth Routes */}
                              <Route path="/sign-in" element={<SignInPage />} />
                              <Route path="/sign-up" element={<SignUpPage />} />
                              <Route path="/onboarding" element={
                                <ProtectedRoute>
                                  <OnboardingPage />
                                </ProtectedRoute>
                              } />

                              {/* Protected Application Routes */}
                              <Route path="/dashboard" element={
                                <ProtectedRoute>
                                  <Dashboard />
                                </ProtectedRoute>
                              } />

                              {/* White Label - Feature Gated */}
                              <Route path="/white-label" element={
                                <ProtectedRoute requireFeature="whiteLabel">
                                  <WhiteLabelPage />
                                </ProtectedRoute>
                              } />

                              {/* Master Admin Routes */}
                              <Route path="/admin/*" element={
                                <ProtectedRoute requireMasterAdmin={true}>
                                  <AdminRoutes />
                                </ProtectedRoute>
                              } />

                              {/* Existing Routes - All Protected */}
                              <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
                              <Route path="/contacts/:id" element={<ProtectedRoute><ContactDetail /></ProtectedRoute>} />
                              <Route path="/pipeline" element={<ProtectedRoute><Pipeline /></ProtectedRoute>} />
                              <Route path="/tasks" element={<ProtectedRoute><TasksNew /></ProtectedRoute>} />
                              <Route path="/ai-tools" element={<ProtectedRoute requireFeature="aiTools"><AITools /></ProtectedRoute>} />
                              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                              <Route path="/faq" element={<FAQ />} />

                              export default App;
}
                        <Routes>
        {/* Landing Page - Root Route */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* FAQ Route */}
        <Route path="/faq" element={<FAQ />} />
        
        {/* Landing Feature Pages */}
        <Route path="/features/ai-tools" element={<AiToolsFeaturePage />} />
        <Route path="/features/contacts" element={<ContactsFeaturePage />} />
        <Route path="/features/pipeline" element={<PipelineFeaturePage />} />
        <Route path="/features/ai-assistant" element={<AiAssistantFeaturePage />} />
        <Route path="/features/vision-analyzer" element={<VisionAnalyzerFeaturePage />} />
        <Route path="/features/image-generator" element={<ImageGeneratorFeaturePage />} />
        <Route path="/features/function-assistant" element={<FunctionAssistantFeaturePage />} />
        <Route path="/features/semantic-search" element={<SemanticSearchFeaturePage />} />
        
        {/* System Overview - Development Status Page */}
        <Route path="/system-overview" element={
          <ProtectedRoute>
            <SystemOverview />
          </ProtectedRoute>
        } />
        
        {/* Main Application Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/contacts" element={
          <ProtectedRoute>
            <Contacts />
          </ProtectedRoute>
        } />
        
        <Route path="/contacts-enhanced" element={
          <ProtectedRoute>
            <ContactsEnhanced />
          </ProtectedRoute>
        } />
        
        <Route path="/contacts/:id" element={
          <ProtectedRoute>
            <ContactDetail />
          </ProtectedRoute>
        } />
        
        {/* AI Goals */}
        <Route path="/ai-goals" element={
          <ProtectedRoute>
            <AIGoalsPanel />
          </ProtectedRoute>
        } />
        
              {/* Tasks */}
              <Route path="/tasks" element={
                <ProtectedRoute>
                  <TasksNew />
                </ProtectedRoute>
              } />
              
              {/* Communication */}
              <Route path="/communication" element={
                <ProtectedRoute>
                  <Communication />
                </ProtectedRoute>
              } />

              {/* Analytics */}
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } />              {/* AI Integration */}
              <Route path="/ai-integration" element={
                <ProtectedRoute>
                  <AIIntegration />
                </ProtectedRoute>
              } />

        <Route path="/ai-tools" element={
          <ProtectedRoute>
            <AITools />
          </ProtectedRoute>
        } />
        
        <Route path="/sales-tools" element={
          <ProtectedRoute>
            <SalesTools />
          </ProtectedRoute>
        } />
        
        <Route path="/pipeline" element={
          <ProtectedRoute>
            <Pipeline />
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        
        {/* Mobile Responsiveness */}
        <Route path="/mobile" element={
          <ProtectedRoute>
            <MobileResponsiveness />
          </ProtectedRoute>
        } />
        
        {/* AI Tools Individual Routes */}
        <Route path="/ai-tools/email-analysis" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
        <Route path="/ai-tools/meeting-summarizer" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
        <Route path="/ai-tools/proposal-generator" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
        <Route path="/ai-tools/call-script" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
        <Route path="/ai-tools/subject-optimizer" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
        <Route path="/ai-tools/competitor-analysis" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
        <Route path="/ai-tools/market-trends" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
        <Route path="/ai-tools/sales-insights" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
        <Route path="/ai-tools/sales-forecast" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
        <Route path="/ai-tools/email-composer" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
        <Route path="/ai-tools/objection-handler" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
        <Route path="/ai-tools/email-response" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
        <Route path="/ai-tools/voice-tone" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
        <Route path="/ai-tools/customer-persona" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
        <Route path="/ai-tools/visual-content" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
        <Route path="/ai-tools/meeting-agenda" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
        <Route path="/ai-tools/ai-assistant" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
        <Route path="/ai-tools/vision-analyzer" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
        <Route path="/ai-tools/image-generator" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
        <Route path="/ai-tools/semantic-search" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
        <Route path="/ai-tools/function-assistant" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
        <Route path="/ai-tools/streaming-chat" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
        <Route path="/ai-tools/form-validation" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
        <Route path="/ai-tools/live-deal-analysis" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
        <Route path="/ai-tools/instant-response" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
        <Route path="/ai-tools/realtime-email" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
        <Route path="/ai-tools/voice-analysis" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
        <Route path="/ai-tools/reasoning-email" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
        <Route path="/ai-tools/reasoning-proposal" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
        <Route path="/ai-tools/reasoning-script" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
        <Route path="/ai-tools/reasoning-objection" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
        
        {/* Sales Tools Routes */}
        <Route path="/lead-automation" element={<ProtectedRoute><LeadAutomation /></ProtectedRoute>} />
        <Route path="/circle-prospecting" element={<ProtectedRoute><CircleProspecting /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
        <Route path="/phone-system" element={<ProtectedRoute><PhoneSystem /></ProtectedRoute>} />
        <Route path="/invoicing" element={<ProtectedRoute><Invoicing /></ProtectedRoute>} />
        <Route path="/sales-analytics" element={<ProtectedRoute><SalesInsights /></ProtectedRoute>} />
        <Route path="/quote-builder" element={<ProtectedRoute><PlaceholderPage title="Quote Builder" /></ProtectedRoute>} />
        <Route path="/commission-tracker" element={<ProtectedRoute><PlaceholderPage title="Commission Tracker" /></ProtectedRoute>} />
        <Route path="/follow-up-reminders" element={<ProtectedRoute><PlaceholderPage title="Follow-up Reminders" /></ProtectedRoute>} />
        <Route path="/territory-management" element={<ProtectedRoute><PlaceholderPage title="Territory Management" /></ProtectedRoute>} />
        
        {/* Task Tools Routes */}
        <Route path="/task-automation" element={<ProtectedRoute><AITaskPrioritizer /></ProtectedRoute>} />
        <Route path="/project-tracker" element={<ProtectedRoute><TaskKanbanBoardPage /></ProtectedRoute>} />
        <Route path="/time-tracking" element={<ProtectedRoute><TaskCalendarView /></ProtectedRoute>} />
        <Route path="/workflow-builder" element={<ProtectedRoute><PlaceholderPage title="Workflow Builder" /></ProtectedRoute>} />
        <Route path="/deadline-manager" element={<ProtectedRoute><PlaceholderPage title="Deadline Manager" /></ProtectedRoute>} />
        
        {/* Communication Tools Routes */}
        <Route path="/video-email" element={<ProtectedRoute><VideoEmail /></ProtectedRoute>} />
        <Route path="/text-messages" element={<ProtectedRoute><TextMessages /></ProtectedRoute>} />
        <Route path="/campaigns" element={<ProtectedRoute><PlaceholderPage title="Campaigns" description="Marketing campaigns management coming soon" /></ProtectedRoute>} />
        <Route path="/group-calls" element={<ProtectedRoute><GroupCallView /></ProtectedRoute>} />
        <Route path="/call-recording" element={<ProtectedRoute><CallRecordingPage /></ProtectedRoute>} />
        <Route path="/in-call-messaging" element={<ProtectedRoute><InCallMessagingPage /></ProtectedRoute>} />
        <Route path="/call-analytics" element={<ProtectedRoute><CallHistory /></ProtectedRoute>} />
        <Route path="/connection-quality" element={<ProtectedRoute><PlaceholderPage title="Connection Quality Monitor" description="Real-time connection quality monitoring coming soon" /></ProtectedRoute>} />
        <Route path="/ai-model-demo" element={<ProtectedRoute><PlaceholderPage title="AI Model Demo" /></ProtectedRoute>} />
        {/* Content Tools Routes */}
        <Route path="/content-library" element={<ProtectedRoute><ContentLibrary /></ProtectedRoute>} />
        <Route path="/voice-profiles" element={<ProtectedRoute><VoiceProfiles /></ProtectedRoute>} />
        <Route path="/business-analysis" element={<ProtectedRoute><BusinessAnalysis /></ProtectedRoute>} />
        <Route path="/forms" element={<ProtectedRoute><FormsAndSurveys /></ProtectedRoute>} />
        <Route path="/ai-model-demo" element={<ProtectedRoute><PlaceholderPage title="AI Model Demo" /></ProtectedRoute>} />
        
        {/* AI Suite Routes */}
        <Route path="/ai-suite" element={<ProtectedRoute><AISmartFeaturesHub /></ProtectedRoute>} />
        <Route path="/ai-insights" element={<ProtectedRoute><AIInsightsPanel /></ProtectedRoute>} />
        <Route path="/ai-model-stats" element={<ProtectedRoute><PlaceholderPage title="AI Model Usage Stats" description="Detailed AI model usage statistics coming soon" /></ProtectedRoute>} />
        <Route path="/ai-model-selector" element={<ProtectedRoute><PlaceholderPage title="AI Model Selector" description="Choose and configure AI models" /></ProtectedRoute>} />
        
        {/* Additional Routes */}
        <Route path="/white-label" element={<ProtectedRoute><WhiteLabelPage /></ProtectedRoute>} />
        
        {/* Special Routes */}
        <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </Suspense>
                  </AppLayout>
                </DashboardLayoutProvider>
              </NavigationProvider>
            </VideoCallProvider>
          </EnhancedHelpProvider>
        </ModalsProvider>
      </AIToolsProvider>
      </WhiteLabelProvider>
    </ThemeProvider>
  );
}

export default App;