
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import AuthTest from '../components/AuthTest';

const AuthTestPage: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen p-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Authentication Test Page
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Use this page to test Clerk authentication functionality
          </p>
        </div>

        <div className="grid gap-6">
          <AuthTest />
          
          <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} border`}>
            <h3 className="text-lg font-semibold mb-4">Test Links</h3>
            <div className="grid grid-cols-2 gap-4">
              <a
                href="/signin"
                className="block p-4 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors"
              >
                Custom Sign In Page
              </a>
              <a
                href="/signup"
                className="block p-4 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition-colors"
              >
                Custom Sign Up Page
              </a>
              <a
                href="/auth/login"
                className="block p-4 bg-purple-600 text-white text-center rounded-lg hover:bg-purple-700 transition-colors"
              >
                Clerk Sign In Component
              </a>
              <a
                href="/auth/register"
                className="block p-4 bg-indigo-600 text-white text-center rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Clerk Sign Up Component
              </a>
            </div>
          </div>

          <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} border`}>
            <h3 className="text-lg font-semibold mb-4">Troubleshooting Steps</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded">
                <strong>1. Check Environment Variables:</strong> Ensure VITE_CLERK_PUBLISHABLE_KEY is set
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900 rounded">
                <strong>2. Test Custom Pages:</strong> Try signing in with both custom and Clerk components
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900 rounded">
                <strong>3. Check Console:</strong> Look for any Clerk-related errors in browser console
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-900 rounded">
                <strong>4. Verify Redirects:</strong> Ensure afterSignIn/afterSignUp URLs are correct
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTestPage;
