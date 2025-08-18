// Enhanced Contacts Page with Remote Component Integration
import React, { useState } from 'react';
import { Settings, ExternalLink } from 'lucide-react';
import RemoteContactsLoader from '../components/RemoteContactsLoader';
import ContactsEnhanced from './Contacts'; // Your existing contacts component
import { useContactStore } from '../hooks/useContactStore';

const ContactsWithRemote: React.FC = () => {
  const [remoteUrl, setRemoteUrl] = useState<string | null>(null);
  const [useRemote, setUseRemote] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
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
              {useRemote && remoteUrl ? 'Using remote contacts app' : 'Using local contacts'}
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
            
            {remoteUrl && (
              <a
                href={remoteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Open Remote App"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>

        {/* Remote Settings Panel */}
        {showSettings && (
          <div className="mt-4 p-6 bg-blue-50 dark:bg-gray-700 rounded-lg border-2 border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🔧 Module Federation Configuration
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Connect your deployed Bolt contacts app to replace the local contacts interface.
            </p>
            
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-sm">
              <strong>Success!</strong> Settings panel is working! Current state: showSettings = {String(showSettings)}
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Remote App URL
                </label>
                <input
                  type="url"
                  value={remoteUrl || ''}
                  onChange={(e) => setRemoteUrl(e.target.value || null)}
                  placeholder="https://your-bolt-contacts-app.vercel.app"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="useRemote"
                  checked={useRemote}
                  onChange={(e) => setUseRemote(e.target.checked)}
                  disabled={!remoteUrl}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="useRemote" className="text-xs text-gray-700 dark:text-gray-300">
                  Use remote contacts app (requires URL above)
                </label>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    if (remoteUrl) {
                      setUseRemote(true);
                      console.log('Enabling remote contacts with URL:', remoteUrl);
                    }
                  }}
                  disabled={!remoteUrl}
                  className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {useRemote && remoteUrl ? (
          <RemoteContactsLoader
            remoteUrl={remoteUrl}
            onContactSelect={handleContactSelect}
            onContactCreate={handleContactCreate}
            onContactUpdate={handleContactUpdate}
            onContactDelete={handleContactDelete}
            initialContacts={contactsArray}
            theme="light"
            fallbackComponent={ContactsEnhanced}
          />
        ) : (
          <ContactsEnhanced />
        )}
      </div>
    </div>
  );
};

export default ContactsWithRemote;