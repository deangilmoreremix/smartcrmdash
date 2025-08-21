import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

// Core providers
import { ThemeProvider } from './contexts/ThemeContext';
import { TenantProvider } from './contexts/TenantProvider';
import { AIToolsProvider } from './components/AIToolsProvider';
import { ModalsProvider } from './components/ModalsProvider';
import { EnhancedHelpProvider } from './contexts/EnhancedHelpContext';
import { VideoCallProvider } from './contexts/VideoCallContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { DashboardLayoutProvider } from './contexts/DashboardLayoutContext';
import { AIProvider } from './contexts/AIContext';

// Layout components
import Navbar from './components/Navbar';
import RemoteAppRefreshManager from './components/RemoteAppRefreshManager';

// Main pages
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Pipeline from './pages/Pipeline';
import Tasks from './pages/Tasks';
import Appointments from './pages/Appointments';
import AITools from './pages/AITools';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import CommunicationHub from './pages/CommunicationHub';

// Landing pages
import LandingPage from './pages/LandingPage';
import SalesLandingPage from './pages/SalesLandingPage';

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

function App() {
  return (
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

                          {/* App routes redirect to dashboard */}
                          <Route path="/app" element={<Navigate to="/dashboard" replace />} />

                          {/* Main application routes with navbar */}
                          <Route path="/dashboard" element={
                            <div className="h-screen w-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
                              <Navbar />
                              <div className="flex-1 overflow-hidden navbar-spacing" style={{ paddingTop: '80px', minHeight: 'calc(100vh - 80px)' }}>
                                <Suspense fallback={<LoadingSpinner message="Loading..." size="lg" />}>
                                  <Dashboard />
                                </Suspense>
                              </div>
                            </div>
                          } />
                          <Route path="/contacts" element={
                            <div className="h-screen w-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
                              <Navbar />
                              <div className="flex-1 overflow-hidden navbar-spacing" style={{ paddingTop: '80px', minHeight: 'calc(100vh - 80px)' }}>
                                <Suspense fallback={<LoadingSpinner message="Loading..." size="lg" />}>
                                  <Contacts />
                                </Suspense>
                              </div>
                            </div>
                          } />
                          <Route path="/pipeline" element={
                            <div className="h-screen w-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
                              <Navbar />
                              <div className="flex-1 overflow-hidden navbar-spacing" style={{ paddingTop: '80px', minHeight: 'calc(100vh - 80px)' }}>
                                <Suspense fallback={<LoadingSpinner message="Loading..." size="lg" />}>
                                  <Pipeline />
                                </Suspense>
                              </div>
                            </div>
                          } />
                          <Route path="/tasks" element={
                            <div className="h-screen w-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
                              <Navbar />
                              <div className="flex-1 overflow-hidden navbar-spacing" style={{ paddingTop: '80px', minHeight: 'calc(100vh - 80px)' }}>
                                <Suspense fallback={<LoadingSpinner message="Loading..." size="lg" />}>
                                  <Tasks />
                                </Suspense>
                              </div>
                            </div>
                          } />
                          <Route path="/appointments" element={
                            <div className="h-screen w-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
                              <Navbar />
                              <div className="flex-1 overflow-hidden navbar-spacing" style={{ paddingTop: '80px', minHeight: 'calc(100vh - 80px)' }}>
                                <Suspense fallback={<LoadingSpinner message="Loading..." size="lg" />}>
                                  <Appointments />
                                </Suspense>
                              </div>
                            </div>
                          } />
                          <Route path="/ai-tools" element={
                            <div className="h-screen w-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
                              <Navbar />
                              <div className="flex-1 overflow-hidden navbar-spacing" style={{ paddingTop: '80px', minHeight: 'calc(100vh - 80px)' }}>
                                <Suspense fallback={<LoadingSpinner message="Loading..." size="lg" />}>
                                  <AITools />
                                </Suspense>
                              </div>
                            </div>
                          } />
                          <Route path="/analytics" element={
                            <div className="h-screen w-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
                              <Navbar />
                              <div className="flex-1 overflow-hidden navbar-spacing" style={{ paddingTop: '80px', minHeight: 'calc(100vh - 80px)' }}>
                                <Suspense fallback={<LoadingSpinner message="Loading..." size="lg" />}>
                                  <Analytics />
                                </Suspense>
                              </div>
                            </div>
                          } />
                          <Route path="/settings" element={
                            <div className="h-screen w-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
                              <Navbar />
                              <div className="flex-1 overflow-hidden navbar-spacing" style={{ paddingTop: '80px', minHeight: 'calc(100vh - 80px)' }}>
                                <Suspense fallback={<LoadingSpinner message="Loading..." size="lg" />}>
                                  <Settings />
                                </Suspense>
                              </div>
                            </div>
                          } />
                          <Route path="/communications" element={
                            <div className="h-screen w-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
                              <Navbar />
                              <div className="flex-1 overflow-hidden navbar-spacing" style={{ paddingTop: '80px', minHeight: 'calc(100vh - 80px)' }}>
                                <Suspense fallback={<LoadingSpinner message="Loading..." size="lg" />}>
                                  <CommunicationHub />
                                </Suspense>
                              </div>
                            </div>
                          } />

                          {/* Fallback */}
                          <Route path="*" element={<Navigate to="/dashboard" replace />} />
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
  );
}

export default App;