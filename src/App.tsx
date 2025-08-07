import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AIToolsProvider } from './components/AIToolsProvider';
import { ModalsProvider } from './components/ModalsProvider';
import { EnhancedHelpProvider } from './contexts/EnhancedHelpContext';
import { VideoCallProvider } from './contexts/VideoCallContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { DashboardLayoutProvider } from './contexts/DashboardLayoutContext';
import Navbar from './components/Navbar';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

// Critical pages - load immediately
import Dashboard from './pages/Dashboard';
import SystemOverview from './pages/SystemOverview';

// Heavy pages - lazy load for better performance
const Tasks = lazy(() => import('./pages/Tasks'));
const TasksNew = lazy(() => import('./pages/TasksNew'));
const Communication = lazy(() => import('./pages/Communication'));
const Contacts = lazy(() => import('./pages/Contacts'));
const ContactsEnhanced = lazy(() => import('./pages/ContactsEnhanced'));
const Pipeline = lazy(() => import('./pages/Pipeline'));
const AITools = lazy(() => import('./pages/AITools'));
const Analytics = lazy(() => import('./pages/Analytics'));
const AIIntegration = lazy(() => import('./pages/AIIntegration'));
const MobileResponsiveness = lazy(() => import('./pages/MobileResponsiveness'));

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

function App() {
  return (
    <ThemeProvider>
      <AIToolsProvider>
        <ModalsProvider>
          <EnhancedHelpProvider>
            <VideoCallProvider>
              <NavigationProvider>
                <DashboardLayoutProvider>
                  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                    <Navbar />
                    <Suspense fallback={<LoadingSpinner message="Loading page..." size="lg" />}>
                      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* System Overview - Main Landing Page */}
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
            <PlaceholderPage title="Sales Tools" description="Sales tools collection coming soon" />
          </ProtectedRoute>
        } />
        
        <Route path="/pipeline" element={
          <ProtectedRoute>
            <Pipeline />
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <PlaceholderPage title="Settings" description="Settings page coming soon" />
          </ProtectedRoute>
        } />
        
        {/* Mobile Responsiveness */}
        <Route path="/mobile" element={
          <ProtectedRoute>
            <MobileResponsiveness />
          </ProtectedRoute>
        } />
        
        {/* Feature Pages */}
        <Route path="/features/ai-tools" element={<PlaceholderPage title="AI Tools Features" />} />
        <Route path="/features/contacts" element={<PlaceholderPage title="Contact Management Features" />} />
        <Route path="/features/pipeline" element={<PlaceholderPage title="Pipeline Features" />} />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </Suspense>
                    </div>
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