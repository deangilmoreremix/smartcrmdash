import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const DevBypassPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performDevBypass = async () => {
      try {
        console.log('Performing dev bypass...');

        // Call the dev bypass API endpoint
        const response = await fetch('/api/auth/dev-bypass', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        });

        if (!response.ok) {
          throw new Error(`Dev bypass API failed: ${response.status}`);
        }

        const data = await response.json();
        console.log('Dev bypass API response:', data);

        if (data.success && data.user && data.session) {
          // Store the dev session in localStorage
          localStorage.setItem('dev-user-session', JSON.stringify(data.user));
          localStorage.setItem('sb-supabase-auth-token', JSON.stringify(data.session));
          
          console.log('Dev session stored successfully');

          // Trigger a page reload to reinitialize auth context
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1000);
        } else {
          throw new Error('Invalid dev bypass response');
        }

      } catch (error) {
        console.error('Dev bypass failed:', error);

        // Fallback: create session manually
        const fallbackUser = {
          id: 'dev-user-12345',
          email: 'dev@smartcrm.local',
          username: 'developer',
          firstName: 'Development',
          lastName: 'User',
          role: 'super_admin',
          app_context: 'smartcrm',
          created_at: new Date().toISOString()
        };

        const fallbackSession = {
          access_token: 'dev-bypass-token-fallback',
          refresh_token: 'dev-bypass-refresh-fallback',
          expires_at: Date.now() + (24 * 60 * 60 * 1000),
          user: fallbackUser
        };

        localStorage.setItem('dev-user-session', JSON.stringify(fallbackUser));
        localStorage.setItem('sb-supabase-auth-token', JSON.stringify(fallbackSession));

        console.log('Fallback dev session created');

        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      }
    };

    performDevBypass();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md mx-4">
        <div className="mb-6">
          <LoadingSpinner size="lg" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          🚀 Setting up Development Access
        </h2>
        <p className="text-gray-600 mb-4">
          Bypassing authentication for development...
        </p>
        <div className="mt-4 text-sm text-green-600 font-medium">
          Redirecting to dashboard...
        </div>
      </div>
    </div>
  );
};

export default DevBypassPage;