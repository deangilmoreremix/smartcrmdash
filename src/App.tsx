import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './components/styles/design-system.css';

// Temporary placeholder component for pages we haven't migrated yet
const PlaceholderPage: React.FC<{ title: string; description?: string }> = ({ title, description }) => (
  <div className="container mx-auto px-4 py-8 max-w-7xl">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{title}</h1>
      {description && (
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">{description}</p>
      )}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
        <p className="text-blue-800 dark:text-blue-300">
          🚧 This page is coming soon! We're migrating the full functionality from SDRButtons.
        </p>
      </div>
    </div>
  </div>
);

// Protected route wrapper (temporarily allow all routes during migration)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // During migration, we'll allow all routes. Auth will be added in the final phase.
  return <>{children}</>;
};

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
                  View Tasks (Placeholder)
                </a>
                <a 
                  href="/contacts" 
                  className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  View Contacts (Placeholder)
                </a>
              </div>
            </div>
          </div>
        } />
        
        {/* Main Application Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <PlaceholderPage title="Dashboard" description="Dashboard coming soon - will integrate existing dashboard" />
          </ProtectedRoute>
        } />
        
        <Route path="/contacts" element={
          <ProtectedRoute>
            <PlaceholderPage title="Contacts" description="Contact management page coming soon" />
          </ProtectedRoute>
        } />
        
        <Route path="/tasks" element={
          <ProtectedRoute>
            <PlaceholderPage title="Tasks" description="Task management coming soon" />
          </ProtectedRoute>
        } />
        
        <Route path="/ai-tools" element={
          <ProtectedRoute>
            <PlaceholderPage title="AI Tools" description="AI tools page coming soon" />
          </ProtectedRoute>
        } />
        
        <Route path="/sales-tools" element={
          <ProtectedRoute>
            <PlaceholderPage title="Sales Tools" description="Sales tools collection coming soon" />
          </ProtectedRoute>
        } />
        
        <Route path="/pipeline" element={
          <ProtectedRoute>
            <PlaceholderPage title="Sales Pipeline" description="Pipeline management coming soon" />
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
  );
}

export default App;