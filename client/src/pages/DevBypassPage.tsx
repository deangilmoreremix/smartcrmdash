import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const DevBypassPage = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  useEffect(() => {
    const performDevBypass = async () => {
      try {
        console.log('Performing dev bypass...');

        // Create a mock dev session
        const devUser = {
          id: 'dev-user-12345',
          email: 'dev@smartcrm.local',
          name: 'Development User',
          role: 'super_admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Store dev session in localStorage
        localStorage.setItem('dev-user-session', JSON.stringify(devUser));
        localStorage.setItem('sb-supabase-auth-token', JSON.stringify({
          access_token: 'dev-bypass-token',
          refresh_token: 'dev-bypass-refresh',
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          user: devUser
        }));

        console.log('Dev session created successfully');

        // Try to update auth context if available
        try {
          if (signIn) {
            await signIn(devUser.email, 'dev-bypass-password');
          }
        } catch (authError) {
          console.warn('Auth context update failed, continuing with bypass:', authError);
        }

        // Redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1000);

      } catch (error) {
        console.error('Dev bypass failed:', error);

        // Still redirect to dashboard with fallback session
        const fallbackUser = {
          id: 'fallback-user',
          email: 'fallback@smartcrm.local',
          name: 'Fallback User',
          role: 'admin'
        };

        localStorage.setItem('dev-user-session', JSON.stringify(fallbackUser));

        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1500);
      }
    };

    performDevBypass();
  }, [signIn, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md mx-4">
        <div className="mb-6">
          <LoadingSpinner size="lg" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          🚀 Bypassing Authentication
        </h2>
        <p className="text-gray-600">
          Setting up development access...
        </p>
        <div className="mt-4 text-sm text-green-600 font-medium">
          Redirecting to dashboard...
        </div>
      </div>
    </div>
  );
};

export default DevBypassPage;