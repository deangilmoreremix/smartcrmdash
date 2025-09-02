import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { AlertCircle, CheckCircle, ArrowLeft, Mail } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Determine the correct redirect URL based on current environment
      const currentOrigin = window.location.origin;
      const isDevelopment = currentOrigin.includes('localhost') || 
                           currentOrigin.includes('replit.dev') || 
                           currentOrigin.includes('replit.app');
      
      const redirectUrl = isDevelopment 
        ? `${currentOrigin}/auth/recovery`
        : 'https://smart-crm.videoremix.io/auth/recovery';
      
      console.log('Sending password reset with redirect URL:', redirectUrl);
      console.log('Current origin:', currentOrigin, 'Is development:', isDevelopment);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });
      
      if (error) {
        console.error('Password reset error:', error);
        setError(error.message || 'Failed to send password reset email');
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      console.error('Password reset exception:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-4 w-20 h-20 mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Check Your Email
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We've sent a password reset link to <strong className="text-gray-900 dark:text-white">{email}</strong>
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
                      What to do next:
                    </p>
                    <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>1. Check your inbox and spam folder</li>
                      <li>2. Click the reset link in the email</li>
                      <li>3. Enter your new password</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setSuccess(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  data-testid="button-send-another"
                >
                  Send Another Email
                </button>
                
                <Link
                  to="/signin"
                  className="block w-full text-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white py-2 transition-colors"
                  data-testid="link-back-to-signin"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Smart<span className="text-blue-600">CRM</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Reset your password
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter your email address"
                required
                disabled={loading}
                data-testid="input-email"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              data-testid="button-submit"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Reset Email...
                </>
              ) : (
                'Send Reset Email'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/signin"
              className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm transition-colors"
              data-testid="link-back-to-signin"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;