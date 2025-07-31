import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const SignInPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            SmartCRM
          </h1>
          <p className="mt-2 text-gray-600">
            Your intelligent business management platform
          </p>
        </div>

        {/* Clerk Sign In Component */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <SignIn 
            path="/sign-in"
            routing="path"
            signUpUrl="/sign-up"
            afterSignInUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'w-full shadow-none border-0',
                headerTitle: 'text-2xl font-bold text-gray-900',
                headerSubtitle: 'text-gray-600',
                socialButtonsBlockButton: 'border border-gray-300 hover:bg-gray-50',
                formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white rounded-md',
                footerActionLink: 'text-blue-600 hover:text-blue-500',
              }
            }}
          />
        </div>

        {/* Features */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-4">
            Join thousands of businesses using SmartCRM
          </p>
          <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                📊
              </div>
              <span>Analytics</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-2">
                🤖
              </div>
              <span>AI Tools</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                🎨
              </div>
              <span>White Label</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
