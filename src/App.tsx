import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ClerkWrapper } from './components/auth/ClerkWrapper';
import { SaaSProvider } from './contexts/SaaSAuthContext';
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
import EmbeddedLandingPage from './pages/Landing/EmbeddedLandingPage';

// Auth pages
const SignInPage = lazy(() => import('./pages/SignInPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const OnboardingPage = lazy(() => import('./pages/auth/OnboardingPage'));

// Main pages
const Contacts = lazy(() => import('../pages/Contacts'));
const ContactDetail = lazy(() => import('../pages/ContactDetail'));
const Pipeline = lazy(() => import('../pages/Pipeline'));
const TasksNew = lazy(() => import('../pages/Tasks'));
const AITools = lazy(() => import('../pages/AITools'));
const Settings = lazy(() => import('../pages/Settings'));
const FAQ = lazy(() => import('../pages/FAQ'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const Appointments = lazy(() => import('../pages/Appointments'));
const WhiteLabelPage = lazy(() => import('./pages/WhiteLabelPage'));

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

// Admin Routes Component (placeholder for now)
const AdminRoutes = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Master Admin Dashboard</h1>
      <p>Coming soon - Master admin features for managing organizations and users.</p>
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
                              <Route path="/" element={<EmbeddedLandingPage />} />
                              
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
                              <Route path="/ai-tools/*" element={
                                <ProtectedRoute requireFeature="aiTools">
                                  <AITools />
                                </ProtectedRoute>
                              } />
                              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                              <Route path="/faq" element={<FAQ />} />
                              <Route path="/pricing" element={<PricingPage />} />
                              
                              {/* Additional routes that navbar tries to navigate to */}
                              <Route path="/analytics" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                              <Route path="/ai-goals" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
                              <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
                              
                              {/* Other tool routes - temporarily redirect to appropriate pages */}
                              <Route path="/video-email" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                              <Route path="/text-messages" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                              <Route path="/content-library" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                              <Route path="/voice-profiles" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                              <Route path="/business-analysis" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                              <Route path="/forms" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

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
      </SaaSProvider>
    </ClerkWrapper>
  );
}

export default App;
