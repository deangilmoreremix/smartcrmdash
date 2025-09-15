import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function RecoveryPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateRecoverySession = async () => {
      try {
        // Supabase v2 automatically detects the session from URL fragments
        // Let's wait a moment for the session to be established
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError('Failed to validate recovery session. Please try again.');
          setLoading(false);
          return;
        }

        if (session) {
          console.log('Valid recovery session found');
          setIsValidToken(true);
        } else {
          // Check if there are recovery tokens in the URL hash
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const type = hashParams.get('type');
          
          if (type === 'recovery' && accessToken) {
            console.log('Recovery tokens found in URL, session will be established');
            setIsValidToken(true);
          } else {
            setError('Invalid or expired recovery link. Please request a new password reset.');
          }
        }
      } catch (err) {
        console.error('Recovery validation error:', err);
        setError('Failed to validate recovery link. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    validateRecoverySession();
  }, []);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate passwords
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Check password strength
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      setError('Password must contain uppercase letters, lowercase letters, and numbers');
      return;
    }

    setUpdating(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);

    } catch (err: any) {
      console.error('Password update error:', err);
      setError(err.message || 'Failed to update password. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Validating Recovery Link
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Please wait while we verify your password reset request...
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-4 w-20 h-20 mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-3">
              Password Updated Successfully!
            </h2>
            <p className="text-green-700 dark:text-green-300 mb-6">
              Your password has been reset. You will be redirected to your dashboard shortly.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              data-testid="button-go-to-dashboard"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isValidToken || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-4 w-20 h-20 mx-auto mb-6">
              <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-red-900 dark:text-red-100 mb-3">
              Invalid Recovery Link
            </h2>
            <p className="text-red-700 dark:text-red-300 mb-6">
              {error || 'This password reset link has expired or is invalid. Please request a new one.'}
            </p>
            <button
              onClick={() => navigate('/forgot-password')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              data-testid="button-request-new-reset"
            >
              Request New Reset Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-4 w-20 h-20 mx-auto mb-6">
              <Lock className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Set New Password
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Enter your new password below to complete the reset process.
            </p>
          </div>

          <form onSubmit={handlePasswordReset} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white pr-10"
                  placeholder="Enter your new password"
                  required
                  data-testid="input-new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  data-testid="button-toggle-password"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Confirm your new password"
                required
                data-testid="input-confirm-password"
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                </div>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                <strong>Password Requirements:</strong><br/>
                • At least 8 characters long<br/>
                • Contains uppercase and lowercase letters<br/>
                • Contains at least one number<br/>
                • Special characters recommended
              </p>
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              data-testid="button-update-password"
            >
              {updating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Updating Password...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/signin')}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm transition-colors"
              data-testid="button-back-to-signin"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}