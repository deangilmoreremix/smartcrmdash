import React from 'react';
import { ClerkProvider } from '@clerk/clerk-react';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key');
}

interface ClerkWrapperProps {
  children: React.ReactNode;
}

export const ClerkWrapper: React.FC<ClerkWrapperProps> = ({ children }) => {
  return (
    <ClerkProvider 
      publishableKey={clerkPubKey}
      appearance={{
        variables: {
          colorPrimary: '#3b82f6',
          colorBackground: '#ffffff',
          colorInputBackground: '#ffffff',
          colorInputText: '#1f2937',
        },
        elements: {
          formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2',
          card: 'shadow-lg border border-gray-200 rounded-lg',
          headerTitle: 'text-2xl font-bold text-gray-900',
          headerSubtitle: 'text-gray-600 mt-2',
          socialButtonsBlockButton: 'border border-gray-300 hover:bg-gray-50',
          dividerLine: 'bg-gray-200',
          dividerText: 'text-gray-500',
          formFieldLabel: 'text-gray-700 font-medium',
          formFieldInput: 'border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          footerActionLink: 'text-blue-600 hover:text-blue-800 font-medium',
        }
      }}
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/onboarding"
      localization={{
        signIn: {
          start: {
            title: 'Welcome to SmartCRM',
            subtitle: 'Sign in to access your dashboard',
          }
        },
        signUp: {
          start: {
            title: 'Create your SmartCRM account',
            subtitle: 'Get started with your free trial',
          }
        }
      }}
    >
      {children}
    </ClerkProvider>
  );
};
