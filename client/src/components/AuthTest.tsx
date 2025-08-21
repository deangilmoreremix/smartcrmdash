
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const AuthTest: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} border space-y-4`}>
      <h3 className="text-lg font-semibold">Authentication Status</h3>
      
      <div className="space-y-3">
        <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
          <h4 className="font-medium text-green-800 dark:text-green-200">✅ Direct Access Enabled</h4>
          <p className="text-sm text-green-600 dark:text-green-300 mt-1">
            No authentication required - users can access the application directly
          </p>
        </div>
        
        <div className="space-y-2">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-2"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => window.location.href = '/contacts'}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Go to Contacts
          </button>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <h5 className="font-medium mb-2">System Information:</h5>
        <div className="text-sm space-y-1">
          <p><strong>Authentication:</strong> Direct Access (No Auth Required)</p>
          <p><strong>Current URL:</strong> {window.location.pathname}</p>
          <p><strong>Domain:</strong> {window.location.origin}</p>
          <p><strong>Status:</strong> Ready for use</p>
        </div>
      </div>
    </div>
  );
};

export default AuthTest;hTest;
