// src/App.tsx

import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
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
const Pipeline = lazy(() => import('./pages/Pipeline'));
const PipelinePage = lazy(() => import('./pages/PipelinePage'));
const AITools = lazy(() => import('./pages/AITools'));
const Analytics = lazy(() => import('./pages/AnalyticsDashboard'));
const AIIntegration = lazy(() => import('./pages/AIIntegration'));
const MobileResponsiveness = lazy(() => import('./pages/MobileResponsiveness'));

// Auth pages
const Login = lazy(() => import('./pages/Auth/Login'));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/Auth/ResetPassword'));
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
const AIGoalsPage = lazy(() => import('./pages/AIGoalsPage'));

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

// Whitelabel imports
import WhiteLabelCustomization from './pages/WhiteLabelCustomization';
import LinkRedirect from './components/shared/LinkRedirect';


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

// Inner component that has access to navbar position context
const AppContent: React.FC = () => {
  const { position, setPosition } = useNavbarPosition();

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) return;

    // If dropped on an edge zone, snap to that position
    if (destination.droppableId.includes('-edge')) {
      const newPosition = destination.droppableId.split('-')[0] as 'top' | 'left' | 'right' | 'bottom';
      setPosition(newPosition);
    }
  };

  // Calculate padding based on navbar position
  const getContentPadding = () => {
    const isVertical = position === 'left' || position === 'right';
    const navbarSize = isVertical ? '60px' : '80px'; // Approximate navbar height/width

    switch (position) {
      case 'top':
        return { paddingTop: navbarSize };
      case 'bottom':
        return { paddingBottom: navbarSize };
      case 'left':
        return { paddingLeft: navbarSize };
      case 'right':
        return { paddingRight: navbarSize };
      default:
        return { paddingTop: navbarSize };
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={getContentPadding()}>
        <Navbar />
        <EdgeZones onDragEnd={handleDragEnd} />
        <LinkRedirect />
        <Suspense fallback={<LoadingSpinner message="Loading page..." size="lg" />}>
          <Routes>
                          {/* Redirect root to dashboard */}
                          <Route path="/" element={<Navigate to="/dashboard" replace />} />

                          {/* Auth pages */}
                          <Route
                            path="/auth/login"
                            element={<Login />}
                          />
                          <Route
                            path="/auth/forgot-password"
                            element={<ForgotPassword />}
                          />
                          <Route
                            path="/auth/reset-password"
                            element={<ResetPassword />}
                          />

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
                                <PipelinePage />
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

                          {/* Misc / Settings */}
                          <Route
                            path="/settings"
                            element={<PlaceholderPage title="Settings" description="Settings page coming soon" />}
                          />
                          <Route
                            path="/ai-goals"
                            element={
                              <ProtectedRoute>
                                <AIGoalsPage />
                              </ProtectedRoute>
                            }
                          />

                          {/* Feature showcase routes (optional) */}
                          <Route path="/features/ai-tools" element={<PlaceholderPage title="AI Tools Features" />} />
                          <Route path="/features/contacts" element={<PlaceholderPage title="Contact Management Features" />} />
                          <Route path="/features/pipeline" element={<PlaceholderPage title="Pipeline Features" />} />

                          {/* Fallback */}
                          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </DragDropContext>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TenantProvider>
          <RoleProvider>
            <ThemeProvider>
              <WhitelabelProvider>
                <AIToolsProvider>
                  <ModalsProvider>
                    <EnhancedHelpProvider>
                      <VideoCallProvider>
                        <NavigationProvider>
                          <DashboardLayoutProvider>
                            <AIProvider>
                              <NavbarPositionProvider>
                                <AppContent />
                              </NavbarPositionProvider>
                            </AIProvider>
                          </DashboardLayoutProvider>
                        </NavigationProvider>
                      </VideoCallProvider>
                    </EnhancedHelpProvider>
                  </ModalsProvider>
                </AIToolsProvider>
              </WhitelabelProvider>
            </ThemeProvider>
          </RoleProvider>
        </TenantProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;