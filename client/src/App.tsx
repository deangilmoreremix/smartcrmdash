import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoadingSpinner from './components/ui/LoadingSpinner';

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
                      <Router>
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

                          {/* All app routes with navbar - No authentication required */}
                          <Route path="/*" element={
                            <div className="h-screen w-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
                              <Navbar />
                              <div className="flex-1 overflow-hidden navbar-spacing" style={{ paddingTop: '80px', minHeight: 'calc(100vh - 80px)' }}>
                                <Suspense fallback={<LoadingSpinner message="Loading..." size="lg" />}>
                                  <Routes>
                                    {/* App routes redirect to dashboard */}
                                    <Route path="/app" element={<Navigate to="/dashboard" replace />} />

                                    {/* Main application routes */}
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/contacts" element={<Contacts />} />
                                    <Route path="/pipeline" element={<Pipeline />} />
                                    <Route path="/tasks" element={<Tasks />} />
                                    <Route path="/appointments" element={<Appointments />} />
                                    <Route path="/ai-tools" element={<AITools />} />
                                    <Route path="/analytics" element={<Analytics />} />
                                    <Route path="/settings" element={<Settings />} />
                                    <Route path="/communications" element={<CommunicationHub />} />

                                    {/* Fallback */}
                                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                                  </Routes>
                                </Suspense>
                              </div>
                            </div>
                          } />
                        </Routes>
                        <RemoteAppRefreshManager />
                      </Router>
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