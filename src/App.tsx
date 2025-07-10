import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import VideoCallOverlay from './components/VideoCallOverlay';
import VideoCallPreviewWidget from './components/VideoCallPreviewWidget';
import DevicePermissionChecker from './components/DevicePermissionChecker';
import { AIToolsProvider } from './components/AIToolsProvider';
import { EnhancedHelpProvider } from './contexts/EnhancedHelpContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { DashboardLayoutProvider } from './contexts/DashboardLayoutContext';
import { VideoCallProvider } from './contexts/VideoCallContext';
import { ModalsProvider } from './components/ModalsProvider';
import { ContactsModal } from './components/modals/ContactsModal';
import './components/styles/design-system.css';

function App() {
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);

  return (
    <ThemeProvider>
      <VideoCallProvider>
        <AIToolsProvider>
          <NavigationProvider>
            <DashboardLayoutProvider> 
              <EnhancedHelpProvider>
                <ModalsProvider>
                  <div className="min-h-screen h-full w-full flex flex-col transition-all duration-300 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 bg-gradient-to-br from-gray-50 via-white to-gray-100">
                    <DevicePermissionChecker />
                    <Routes>
                      <Route path="*" element={
                        <>
                          <Navbar onOpenPipelineModal={() => {
                            const modalsContext = document.getElementById('root')?.__MODALS_CONTEXT;
                            if (modalsContext && modalsContext.openPipelineModal) {
                              modalsContext.openPipelineModal();
                            }
                          }} />
                          <div className="flex-1 w-full overflow-hidden">
                            <Dashboard />
                          </div>
                        </>
                      } />
                    </Routes>
                    <VideoCallOverlay />
                    <VideoCallPreviewWidget />
                    
                    {/* ContactsModal rendered at the root level */}
                    <ContactsModal
                      isOpen={isContactsModalOpen}
                      onClose={() => setIsContactsModalOpen(false)}
                    />
                  </div>
                </ModalsProvider>
              </EnhancedHelpProvider>
            </DashboardLayoutProvider>
          </NavigationProvider>
        </AIToolsProvider>
      </VideoCallProvider>
    </ThemeProvider>
  );
}

export default App;