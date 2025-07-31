import React from 'react';
import { ArrowLeft, Settings, Users, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ 
  title, 
  description = "This feature is coming soon! We're working hard to bring you the best experience." 
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="max-w-md mx-auto">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-blue-100 p-4 rounded-full">
                <Settings className="h-12 w-12 text-blue-600" />
              </div>
            </div>

            {/* Title and Description */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
            <p className="text-gray-600 mb-8">{description}</p>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-800">User Management</h3>
                <p className="text-sm text-gray-600">Advanced user controls</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-800">Analytics</h3>
                <p className="text-sm text-gray-600">Detailed insights</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <Settings className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-800">Automation</h3>
                <p className="text-sm text-gray-600">Smart workflows</p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="space-y-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Return to Dashboard
              </button>
              <p className="text-sm text-gray-500">
                Want to be notified when this feature launches?{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Contact us
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Coming Soon</h3>
          <p className="text-blue-700">
            We're continuously adding new features to improve your CRM experience. 
            This feature is currently in development and will be available in an upcoming release.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;
