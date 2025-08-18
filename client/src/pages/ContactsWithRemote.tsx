// Enhanced Contacts Page with Remote Component Integration
import React, { useState } from 'react';
import { Settings, RefreshCw, ExternalLink } from 'lucide-react';
import RemoteContactsLoader from '../components/RemoteContactsLoader';
import ContactsEnhanced from './Contacts'; // Your existing contacts component
import { useContactStore } from '../hooks/useContactStore';

const ContactsWithRemote: React.FC = () => {
  const [remoteUrl, setRemoteUrl] = useState<string | null>(null);
  const [useRemote, setUseRemote] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const { contacts, fetchContacts } = useContactStore();

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
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="Remote Settings"
            >
              <Settings className="h-5 w-5" />
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
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Remote Contacts Configuration
            </h3>
            
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
                  Use remote contacts app
                </label>
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <p>Enter the URL of your deployed Bolt contacts app to use it instead of the local contacts.</p>
                <p className="mt-1">The remote app must be configured with Module Federation.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-6">
        {useRemote && remoteUrl ? (
          <RemoteContactsLoader
            remoteUrl={remoteUrl}
            onContactSelect={handleContactSelect}
            onContactCreate={handleContactCreate}
            onContactUpdate={handleContactUpdate}
            onContactDelete={handleContactDelete}
            initialContacts={contacts}
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