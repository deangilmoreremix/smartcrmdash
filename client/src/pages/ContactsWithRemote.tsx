// AI-Enhanced Contacts Page
import React from 'react';
import { Brain } from 'lucide-react';
import ContactsEnhanced from './Contacts';


const ContactsWithRemote: React.FC = () => {
  console.log('ContactsWithRemote rendered - AI Enhanced mode');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with Remote Settings */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Brain className="h-6 w-6 text-blue-600" />
              AI-Enhanced Contacts
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Advanced contact management with AI-powered insights and enrichment
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full">
              ✓ AI Enhanced
            </div>
          </div>
        </div>


      </div>

      {/* Main Content */}
      <div className="flex-1">
        <ContactsEnhanced />
      </div>
    </div>
  );
};

export default ContactsWithRemote;