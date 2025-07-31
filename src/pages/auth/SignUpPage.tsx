import React from 'react';
import { SignUp } from '@clerk/clerk-react';

const SignUpPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            SmartCRM
          </h1>
          <p className="mt-2 text-gray-600">
            Start your free trial today
          </p>
        </div>

        {/* Clerk Sign Up Component */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <SignUp 
            path="/sign-up"
            routing="path"
            signInUrl="/sign-in"
            afterSignUpUrl="/onboarding"
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

        {/* Pricing Preview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Included</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Full CRM features</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>AI-powered insights</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>No credit card required</span>
            </div>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Trusted by 10,000+ businesses worldwide
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
