// Enhanced Contacts Page with Remote Component Integration
import React, { useState } from 'react';
import { Settings, ExternalLink, Monitor } from 'lucide-react';
import RemoteContactsLoader from '../components/RemoteContactsLoader';
import AutoLoadingRemoteContacts from '../components/contacts/AutoLoadingRemoteContacts';
import ContactsEnhanced from './Contacts'; // Your existing contacts component
import { useContactStore } from '../hooks/useContactStore';

const ContactsWithRemote: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  
  console.log('ContactsWithRemote rendered, showSettings:', showSettings);
  
  const contacts = useContactStore((state) => state.contacts);
  const fetchContacts = useContactStore((state) => state.fetchContacts);
  
  // Convert contacts object to array for remote component
  const contactsArray = Array.isArray(contacts) ? contacts : Object.values(contacts || {});

  const handleContactSelect = (contact: any) => {
    console.log('Contact selected from remote:', contact);
    // Handle contact selection
  };

  const handleContactCreate = (contact: any) => {
    console.log('Contact created from remote:', contact);
    // Refresh local contacts or sync with your backend
    fetchContacts();
  };

  const handleContactUpdate = (contact: any) => {
    console.log('Contact updated from remote:', contact);
    // Refresh local contacts or sync with your backend
    fetchContacts();
  };

  const handleContactDelete = (contactId: string) => {
    console.log('Contact deleted from remote:', contactId);
    // Refresh local contacts or sync with your backend
    fetchContacts();
  };

  const handleSettingsToggle = () => {
    console.log('Settings button clicked! Current showSettings:', showSettings);
    const newValue = !showSettings;
    console.log('Setting showSettings to:', newValue);
    setShowSettings(newValue);
    console.log('After setState call, showSettings should become:', newValue);
  };

  const handleSimpleTest = () => {
    console.log('Simple test button clicked!');
    alert('Button click works!');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with Remote Settings */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Contacts
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {manualMode ? 'Manual configuration mode' : 'Smart auto-loading contacts'}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Simple test button */}
            <button 
              onClick={handleSimpleTest}
              className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Test
            </button>
            
            <button 
              onClick={handleSettingsToggle}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Settings
            </button>
            
            <button 
              onClick={handleSettingsToggle}
              className={`p-3 rounded-md transition-colors border-2 ${
                showSettings 
                  ? 'bg-blue-100 text-blue-600 hover:bg-blue-200 border-blue-300' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 border-gray-300'
              }`}
              title="Remote Settings"
            >
              <Settings className="h-6 w-6" />
            </button>
            
            
          </div>
        </div>

        {/* Advanced Settings Panel */}
        {showSettings && (
          <div className="mt-4 p-6 bg-blue-50 dark:bg-gray-700 rounded-lg border-2 border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              ⚡ Smart Contact Loading
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Auto-loading system tries multiple remote sources and falls back to local contacts seamlessly.
            </p>
            
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-sm">
              <strong>✨ No Configuration Needed!</strong> The system automatically detects and loads the best available contact module.
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="manualMode"
                  checked={manualMode}
                  onChange={(e) => setManualMode(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="manualMode" className="text-xs text-gray-700 dark:text-gray-300">
                  Enable manual configuration mode (for developers)
                </label>
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <p><strong>Auto-loading sources:</strong></p>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>taupe-sprinkles-83c9ee.netlify.app</li>
                  <li>contacts-app.vercel.app</li>
                  <li>your-backup-contacts.netlify.app</li>
                </ul>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {manualMode ? (
          <ContactsEnhanced />
        ) : (
          <AutoLoadingRemoteContacts
            fallbackComponent={ContactsEnhanced}
            onContactSync={fetchContacts}
          />
        )}
      </div>
    </div>
  );
};

export default ContactsWithRemote;