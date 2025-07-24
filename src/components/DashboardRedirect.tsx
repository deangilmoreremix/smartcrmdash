import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardRedirect: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard immediately
    navigate('/dashboard', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading SmartCRM Dashboard...</p>
      </div>
    </div>
  );
};

export default DashboardRedirect;
