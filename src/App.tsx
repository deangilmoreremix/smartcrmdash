import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AIToolsProvider } from './components/AIToolsProvider';
import { ModalsProvider } from './components/ModalsProvider';
import { EnhancedHelpProvider } from './contexts/EnhancedHelpContext';
import { VideoCallProvider } from './contexts/VideoCallContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { DashboardLayoutProvider } from './contexts/DashboardLayoutContext';
import Navbar from './components/Navbar';
import Tasks from './pages/Tasks';
import TasksNew from './pages/TasksNew';
import Communication from './pages/Communication';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import ContactsEnhanced from './pages/ContactsEnhanced';
import Pipeline from './pages/Pipeline';
import AITools from './pages/AITools';
import Analytics from './pages/Analytics';
import AIIntegration from './pages/AIIntegration';
import SystemOverview from './pages/SystemOverview';
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
                      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/system-overview" replace />} />
        
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
        
        {/* Feature Pages */}
        <Route path="/features/ai-tools" element={<PlaceholderPage title="AI Tools Features" />} />
        <Route path="/features/contacts" element={<PlaceholderPage title="Contact Management Features" />} />
        <Route path="/features/pipeline" element={<PlaceholderPage title="Pipeline Features" />} />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
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