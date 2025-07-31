import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const SignInPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Smart<span className="text-blue-600">CRM</span>
            </h1>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your white-label CRM platform
          </p>
        </div>
        
        <div className="flex justify-center">
          <SignIn 
            routing="path" 
            path="/sign-in"
            redirectUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
