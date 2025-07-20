import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AIToolsProvider } from './components/AIToolsProvider';
import { ModalsProvider } from './components/ModalsProvider';
import { EnhancedHelpProvider } from './contexts/EnhancedHelpContext';
import { VideoCallProvider } from './contexts/VideoCallContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { DashboardLayoutProvider } from './contexts/DashboardLayoutContext';
import Navbar from './components/Navbar';
import Tasks from './pages/Tasks';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Pipeline from './pages/Pipeline';
import AITools from './pages/AITools';
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
                  <Router>
                    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                      <Navbar />
                      <Routes>
        {/* Landing Page */}
        <Route path="/" element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                🚀 Smart CRM Dashboard
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Phase 1: Routing Infrastructure Complete!
              </p>
              <div className="space-x-4">
                <a 
                  href="/dashboard" 
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Dashboard
                </a>
                <a 
                  href="/tasks" 
                  className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  View Tasks
                </a>
                <a 
                  href="/contacts" 
                  className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  View Contacts
                </a>
                <a 
                  href="/pipeline" 
                  className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  View Pipeline
                </a>
                <a 
                  href="/ai-tools" 
                  className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  AI Tools Hub
                </a>
              </div>
            </div>
          </div>
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
        
              {/* Tasks */}
              <Route path="/tasks" element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              } />        <Route path="/ai-tools" element={
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
                  </Router>
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