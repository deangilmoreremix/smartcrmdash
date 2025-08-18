// Remote Contacts Page - Embedded Module
import React from 'react';
import { ExternalLink } from 'lucide-react';

const ContactsWithRemote: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ExternalLink className="h-6 w-6 text-blue-600" />
              Contacts Module
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Remote contact management system
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
              ✓ Remote Module
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Remote App */}
      <div className="flex-1" style={{ height: 'calc(100vh - 100px)' }}>
        <iframe
          src="https://taupe-sprinkles-83c9ee.netlify.app"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            overflow: 'hidden'
          }}
          title="Remote Contacts Module"
          allow="clipboard-read; clipboard-write"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
        />
      </div>
    </div>
  );
};

export default ContactsWithRemote;