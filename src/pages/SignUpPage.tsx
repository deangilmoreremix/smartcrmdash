import React from 'react';
import { SignUp } from '@clerk/clerk-react';

const SignUpPage: React.FC = () => {
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
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Start your white-label CRM journey
          </p>
        </div>
        
        <div className="flex justify-center">
          <SignUp 
            routing="path" 
            path="/sign-up"
            redirectUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
