import React from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import VideoCallOverlay from './components/VideoCallOverlay';
import VideoCallPreviewWidget from './components/VideoCallPreviewWidget';
import PersistentVideoCallButton from './components/PersistentVideoCallButton';
import DevicePermissionChecker from './components/DevicePermissionChecker';
import { AIToolsProvider } from './components/AIToolsProvider';
import { EnhancedHelpProvider } from './contexts/EnhancedHelpContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { DashboardLayoutProvider } from './contexts/DashboardLayoutContext';
import { VideoCallProvider } from './contexts/VideoCallContext';

function App() {
  return (
    <ThemeProvider>
      <VideoCallProvider>
        <AIToolsProvider>
          <NavigationProvider>
            <DashboardLayoutProvider>
              <EnhancedHelpProvider>
                <div className="min-h-screen transition-all duration-300 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 bg-gradient-to-br from-gray-50 via-white to-gray-100">
                  <DevicePermissionChecker />
                  <Navbar />
                  <Dashboard />
                  <VideoCallOverlay />
                  <VideoCallPreviewWidget />
                  <PersistentVideoCallButton />
                </div>
              </EnhancedHelpProvider>
            </DashboardLayoutProvider>
          </NavigationProvider>
        </AIToolsProvider>
      </VideoCallProvider>
    </ThemeProvider>
  );
}

export default App;