// src/App.tsx

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AIToolsProvider } from './components/AIToolsProvider';
import { ModalsProvider } from './components/ModalsProvider';
import { EnhancedHelpProvider } from './contexts/EnhancedHelpContext';
import { VideoCallProvider } from './contexts/VideoCallContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { DashboardLayoutProvider } from './contexts/DashboardLayoutContext';
import { AIProvider } from './contexts/AIContext';
import Navbar from './components/Navbar';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

// Critical pages - load immediately
import Dashboard from './pages/Dashboard';
import SystemOverview from './pages/SystemOverview';

// Heavy pages - lazy load for better performance
const Tasks = lazy(() => import('./pages/Tasks'));
const TasksNew = lazy(() => import('./pages/TasksNew'));
const Communication = lazy(() => import('./pages/Communication'));
const Contacts = lazy(() => import('./pages/Contacts')); // details handled by modal inside Contacts
const Pipeline = lazy(() => import('./pages/Pipeline'));
const AITools = lazy(() => import('./pages/AITools'));
const Analytics = lazy(() => import('./pages/Analytics'));
const AIIntegration = lazy(() => import('./pages/AIIntegration'));
const MobileResponsiveness = lazy(() => import('./pages/MobileResponsiveness'));

import './components/styles/design-system.css';

// Generic placeholder while some features are WIP
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

// Stub auth wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => <>{children}</>;

function App() {
  return (
    <ThemeProvider>
      <AIToolsProvider>
        <ModalsProvider>
          <EnhancedHelpProvider>
            <VideoCallProvider>
              <NavigationProvider>
                <DashboardLayoutProvider>
                  <AIProvider>
                    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                      <Navbar />
                      <Suspense fallback={<LoadingSpinner message="Loading page..." size="lg" />}>
                        <Routes>
                          {/* Redirect root to dashboard */}
                          <Route path="/" element={<Navigate to="/dashboard" replace />} />

                          {/* -------- Core pages (main tabs) -------- */}
                          <Route
                            path="/dashboard"
                            element={
                              <ProtectedRoute>
                                <Dashboard />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/contacts"
                            element={
                              <ProtectedRoute>
                                <Contacts />
                              </ProtectedRoute>
                            }
                          />
                          {/* Deep link: open modal by :id inside Contacts */}
                          <Route
                            path="/contacts/:id"
                            element={
                              <ProtectedRoute>
                                <Contacts />
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
                            path="/ai-tools"
                            element={
                              <ProtectedRoute>
                                <AITools />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/appointments"
                            element={
                              <ProtectedRoute>
                                <TasksNew /> {/* Calendar lives here per your mapping */}
                              </ProtectedRoute>
                            }
                          />

                          {/* -------- Other top-level pages you have -------- */}
                          <Route
                            path="/system-overview"
                            element={
                              <ProtectedRoute>
                                <SystemOverview />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/pipeline"
                            element={
                              <ProtectedRoute>
                                <Pipeline />
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
                            path="/mobile"
                            element={
                              <ProtectedRoute>
                                <MobileResponsiveness />
                              </ProtectedRoute>
                            }
                          />

                          {/* -------- Tasks group -------- */}
                          <Route
                            path="/tasks"
                            element={
                              <ProtectedRoute>
                                <TasksNew />
                              </ProtectedRoute>
                            }
                          />
                          {/* keep legacy tasks reachable if you want */}
                          <Route
                            path="/tasks-legacy"
                            element={
                              <ProtectedRoute>
                                <Tasks />
                              </ProtectedRoute>
                            }
                          />

                          {/* -------- Communication group -------- */}
                          <Route
                            path="/communication"
                            element={
                              <ProtectedRoute>
                                <Communication />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/email-composer"
                            element={
                              <ProtectedRoute>
                                <Communication /> {/* opens composer within this page */}
                              </ProtectedRoute>
                            }
                          />

                          {/* -------- Sales dropdown -------- */}
                          <Route path="/sales-tools" element={<PlaceholderPage title="Sales Tools" />} />
                          <Route path="/lead-automation" element={<PlaceholderPage title="Lead Automation" />} />
                          <Route path="/circle-prospecting" element={<PlaceholderPage title="Circle Prospecting" />} />
                          {/* Appointments already mapped to /appointments -> TasksNew */}
                          <Route path="/phone-system" element={<PlaceholderPage title="Phone System" />} />
                          <Route path="/invoicing" element={<PlaceholderPage title="Invoicing" />} />
                          <Route path="/sales-analytics" element={<PlaceholderPage title="Sales Analytics" />} />
                          {/* Deal Pipeline opens a modal from Navbar; route kept for safety */}
                          <Route path="/quote-builder" element={<PlaceholderPage title="Quote Builder" />} />
                          <Route path="/commission-tracker" element={<PlaceholderPage title="Commission Tracker" />} />
                          <Route path="/follow-up-reminders" element={<PlaceholderPage title="Follow-up Reminders" />} />
                          <Route path="/territory-management" element={<PlaceholderPage title="Territory Management" />} />

                          {/* -------- Tasks dropdown -------- */}
                          <Route path="/task-automation" element={<PlaceholderPage title="Task Automation" />} />
                          <Route path="/project-tracker" element={<PlaceholderPage title="Project Tracker" />} />
                          <Route path="/time-tracking" element={<PlaceholderPage title="Time Tracking" />} />
                          <Route path="/workflow-builder" element={<PlaceholderPage title="Workflow Builder" />} />
                          <Route path="/deadline-manager" element={<PlaceholderPage title="Deadline Manager" />} />

                          {/* -------- Communication dropdown -------- */}
                          <Route path="/video-email" element={<PlaceholderPage title="Video Email" />} />
                          <Route path="/text-messages" element={<PlaceholderPage title="Text Messages" />} />
                          <Route path="/campaigns" element={<PlaceholderPage title="Campaigns" />} />
                          <Route path="/group-calls" element={<PlaceholderPage title="Group Calls" />} />
                          <Route path="/call-recording" element={<PlaceholderPage title="Call Recording" />} />
                          <Route path="/in-call-messaging" element={<PlaceholderPage title="In-Call Messaging" />} />
                          <Route path="/call-analytics" element={<PlaceholderPage title="Call Analytics" />} />
                          <Route path="/connection-quality" element={<PlaceholderPage title="Connection Quality Monitor" />} />

                          {/* -------- Content dropdown -------- */}
                          <Route path="/content-library" element={<PlaceholderPage title="Content Library" />} />
                          <Route path="/voice-profiles" element={<PlaceholderPage title="Voice Profiles" />} />
                          <Route path="/business-analysis" element={<PlaceholderPage title="Business Analysis" />} />
                          <Route path="/image-generator" element={<PlaceholderPage title="Image Generator" />} />
                          <Route path="/forms" element={<PlaceholderPage title="Forms" />} />
                          <Route path="/ai-model-demo" element={<PlaceholderPage title="AI Model Demo" />} />

                          {/* -------- AI Goals (main tab) -------- */}
                          <Route path="/ai-goals" element={<PlaceholderPage title="AI Goals" />} />

                          {/* -------- Apps dropdown -------- */}
                          <Route path="/white-label" element={<PlaceholderPage title="White-Label Customization" />} />
                          {/* External links (FunnelCraft, SmartCRM Closer, ContentAI) are handled by <a href> in Navbar */}

                          {/* -------- Feature pages from earlier app -------- */}
                          <Route path="/features/ai-tools" element={<PlaceholderPage title="AI Tools Features" />} />
                          <Route path="/features/contacts" element={<PlaceholderPage title="Contact Management Features" />} />
                          <Route path="/features/pipeline" element={<PlaceholderPage title="Pipeline Features" />} />

                          {/* Catch-all */}
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                      </Suspense>
                    </div>
                  </AIProvider>
                </DashboardLayoutProvider>
              </NavigationProvider>
            </VideoCallProvider>
          </EnhancedHelpProvider>
        </ModalsProvider>
      </AIToolsProvider>
    </ThemeProvider>
  );
}

export default App;
