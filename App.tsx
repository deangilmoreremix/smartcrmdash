import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Layout components
import Navbar from './components/Navbar';

// Authentication
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Landing Pages
import LandingPage from './pages/Landing/LandingPage';
import TestLandingPage from './pages/Landing/TestLandingPage'; // Added for debugging
import AiToolsFeaturePage from './pages/Landing/FeaturePage/AiToolsFeaturePage';
import ContactsFeaturePage from './pages/Landing/FeaturePage/ContactsFeaturePage';
import PipelineFeaturePage from './pages/Landing/FeaturePage/PipelineFeaturePage';
import AiAssistantFeaturePage from './pages/Landing/FeaturePage/AiAssistantFeaturePage';
import VisionAnalyzerFeaturePage from './pages/Landing/FeaturePage/VisionAnalyzerFeaturePage';
import ImageGeneratorFeaturePage from './pages/Landing/FeaturePage/ImageGeneratorFeaturePage';
import FunctionAssistantFeaturePage from './pages/Landing/FeaturePage/FunctionAssistantFeaturePage';
import SemanticSearchFeaturePage from './pages/Landing/FeaturePage/SemanticSearchFeaturePage';

// Protected route wrapper (automatically passes through in development mode)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // In our modified auth store, isAuthenticated is always true in development
  const { isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // This check is maintained for when we switch back to real auth
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Main pages
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Settings from './pages/Settings';
import AITools from './pages/AITools';
import ContactDetail from './pages/ContactDetail';
import FAQ from './pages/FAQ';

// New feature pages
import Pipeline from './pages/Pipeline';
import SalesTools from './pages/SalesTools'; // Import the new SalesTools component
import LeadAutomation from './pages/LeadAutomation';
import VideoEmail from './pages/VideoEmail';
import TextMessages from './pages/TextMessages';
import PhoneSystem from './pages/PhoneSystem';
import Appointments from './pages/Appointments';
import CircleProspecting from './pages/CircleProspecting';
import FormsAndSurveys from './pages/FormsAndSurveys';
import FormPublic from './pages/FormPublic';
import Invoicing from './pages/Invoicing';

// New Supabase-integrated pages
import BusinessAnalyzer from './pages/BusinessAnalysis/BusinessAnalyzer';
import ContentLibrary from './pages/ContentLibrary/ContentLibrary';
import VoiceProfiles from './pages/VoiceProfiles/VoiceProfiles';
// Import removed: ImageLibrary doesn't exist at the specified path

// Task management pages
import Tasks from './pages/Tasks';
import TaskCalendarView from './pages/TaskCalendarView';

function App() {
  const { initializeAuth } = useAuthStore();
  
  useEffect(() => {
    console.log("App component mounted");
    initializeAuth();
    
    // Debug loading of animations.css
    const linkElement = document.querySelector('link[href*="animations.css"]');
    console.log("Animations CSS element:", linkElement);
    if (linkElement) {
      if (linkElement.sheet) {
        console.log("Animations CSS rules count:", linkElement.sheet.cssRules.length);
      } else {
        console.log("Animations CSS sheet not loaded yet");
      }
    } else {
      console.error("Animations CSS not found in document");
      
      // Try to manually load it if not found
      const head = document.head;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = '/animations.css';
      link.onload = () => console.log("Animations CSS manually loaded");
      link.onerror = () => console.error("Failed to manually load animations.css");
      head.appendChild(link);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Landing Pages */}
        <Route path="/" element={<div className="min-h-screen"><LandingPage /></div>} />
        <Route path="/test-landing" element={<TestLandingPage />} />
        <Route path="/features/ai-tools" element={<AiToolsFeaturePage />} />
        <Route path="/features/contacts" element={<ContactsFeaturePage />} />
        <Route path="/features/pipeline" element={<PipelineFeaturePage />} />
        <Route path="/features/ai-assistant" element={<AiAssistantFeaturePage />} />
        <Route path="/features/vision-analyzer" element={<VisionAnalyzerFeaturePage />} />
        <Route path="/features/image-generator" element={<ImageGeneratorFeaturePage />} />
        <Route path="/features/function-assistant" element={<FunctionAssistantFeaturePage />} />
        <Route path="/features/semantic-search" element={<SemanticSearchFeaturePage />} />
        <Route path="/faq" element={<FAQ />} />
        
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Application routes - these remain under authentication */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-1">
                <Dashboard />
              </main>
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/contacts" element={
          <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-1">
                <Contacts />
              </main>
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/contacts/:id" element={
          <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-1">
                <ContactDetail />
              </main>
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-1">
                <Settings />
              </main>
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/ai-tools" element={
          <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-1">
                <AITools />
              </main>
            </div>
          </ProtectedRoute>
        } />
        
        {/* Redirect all specific AI tool routes to main AI tools page */}
        <Route path="/ai-tools/:toolName" element={
          <ProtectedRoute>
            <Navigate to="/ai-tools" replace />
          </ProtectedRoute>
        } />
        
        {/* New Feature Routes */}
        <Route path="/pipeline" element={
          <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-1">
                <Pipeline />
              </main>
            </div>
          </ProtectedRoute>
        } />

        {/* Sales Tools parent route */}
        <Route path="/sales-tools" element={
          <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-1">
                <SalesTools />
              </main>
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/lead-automation" element={
          <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-1">
                <LeadAutomation />
              </main>
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/video-email" element={
          <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-1">
                <VideoEmail />
              </main>
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/text-messages" element={
          <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-1">
                <TextMessages />
              </main>
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/phone-system" element={
          <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-1">
                <PhoneSystem />
              </main>
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/appointments" element={
          <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-1">
                <Appointments />
              </main>
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/circle-prospecting" element={
          <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-1">
                <CircleProspecting />
              </main>
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/forms-surveys" element={
          <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-1">
                <FormsAndSurveys />
              </main>
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/forms/:formId" element={<FormPublic />} />
        
        <Route path="/invoicing" element={
          <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-1">
                <Invoicing />
              </main>
            </div>
          </ProtectedRoute>
        } />
        
        {/* Task Management Routes */}
        <Route path="/tasks" element={
          <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-1">
                <Tasks />
              </main>
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/tasks/calendar" element={
          <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-1">
                <TaskCalendarView />
              </main>
            </div>
          </ProtectedRoute>
        } />
        
        {/* New Supabase-integrated routes */}
        <Route path="/business-analyzer" element={
          <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-1">
                <BusinessAnalyzer />
              </main>
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/content-library" element={
          <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-1">
                <ContentLibrary />
              </main>
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/voice-profiles" element={
          <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-1">
                <VoiceProfiles />
              </main>
            </div>
          </ProtectedRoute>
        } />
        
        {/* Route removed: ImageLibrary component is not available */}
        
        <Route path="/deals" element={
          <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-1 container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold">Deals (Coming Soon)</h1>
              </main>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;