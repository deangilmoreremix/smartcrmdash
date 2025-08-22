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
        const response = await fetch('/api/auth/dev-bypass', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.success) {
            // Store dev session in localStorage
            localStorage.setItem('sb-supabase-auth-token', JSON.stringify({
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token,
              expires_at: data.session.expires_at,
              user: data.user
            }));
            
            localStorage.setItem('dev-user-session', JSON.stringify(data.user));
            
            // Update auth context if available
            if (signIn) {
              await signIn(data.user.email, 'dev-bypass-password');
            }
            
            // Redirect to dashboard
            setTimeout(() => {
              navigate('/dashboard', { replace: true });
            }, 1000);
          } else {
            navigate('/signin', { replace: true });
          }
        } else {
          // If dev bypass fails, redirect to signin
          navigate('/signin', { replace: true });
        }
      } catch (error) {
        console.error('Dev bypass failed:', error);
        navigate('/signin', { replace: true });
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