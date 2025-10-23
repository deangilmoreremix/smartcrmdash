import React, { useState, useEffect } from 'react';
import messagingService, { Provider } from '../services/messagingService';
import { Settings, CheckCircle, AlertCircle, RefreshCw, Save, TestTube } from 'lucide-react';

interface SMSSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const SMSSettings: React.FC<SMSSettingsProps> = ({ isOpen, onClose }) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<Record<string, any>>({});
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  useEffect(() => {
    if (isOpen) {
      loadProviders();
    }
  }, [isOpen]);

  const loadProviders = async () => {
    setLoading(true);
    try {
      const providerList = await messagingService.getProviders();
      setProviders(providerList);

      // Load saved credentials from localStorage
      const savedCredentials = localStorage.getItem('smsCredentials');
      if (savedCredentials) {
        setCredentials(JSON.parse(savedCredentials));
      }
    } catch (error) {
      console.error('Failed to load providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCredentials = (providerId: string, field: string, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [providerId]: {
        ...prev[providerId],
        [field]: value
      }
    }));
  };

  const saveCredentials = async (providerId: string) => {
    try {
      // Save to localStorage for now (in production, this would go to backend)
      const updatedCredentials = {
        ...credentials,
        [providerId]: {
          ...credentials[providerId],
          saved: true,
          savedAt: new Date().toISOString()
        }
      };
      setCredentials(updatedCredentials);
      localStorage.setItem('smsCredentials', JSON.stringify(updatedCredentials));

      // Update provider status
      setProviders(prev => prev.map(p =>
        p.id === providerId
          ? { ...p, status: credentials[providerId] ? 'active' : 'inactive' }
          : p
      ));

      alert('Credentials saved successfully!');
    } catch (error) {
      console.error('Failed to save credentials:', error);
      alert('Failed to save credentials. Please try again.');
    }
  };

  const testProvider = async (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    if (!provider) return;

    setTesting(providerId);

    try {
      const phoneNumber = credentials[providerId]?.testPhone || '';
      if (!phoneNumber) {
        alert('Please enter a test phone number first.');
        return;
      }

      const result = await messagingService.testProvider(providerId, phoneNumber);

      setTestResults(prev => ({
        ...prev,
        [providerId]: result
      }));

      if (result.success) {
        alert(`Test successful! Message ID: ${result.messageId}`);
      } else {
        alert(`Test failed: ${result.note || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Test failed:', error);
      alert('Test failed. Please check your credentials.');
    } finally {
      setTesting(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">SMS Provider Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <Settings size={24} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="animate-spin text-blue-600" size={24} />
            <span className="ml-2 text-gray-600">Loading providers...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {providers.map((provider) => (
              <div key={provider.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      provider.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    <h3 className="text-lg font-medium text-gray-900">{provider.name}</h3>
                    <span className="text-sm text-gray-500">
                      ${provider.costPerMessage}/message
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {provider.status === 'active' && (
                      <CheckCircle size={20} className="text-green-500" />
                    )}
                    {testResults[provider.id]?.success && (
                      <CheckCircle size={20} className="text-green-500" />
                    )}
                    {testResults[provider.id]?.success === false && (
                      <AlertCircle size={20} className="text-red-500" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Provider-specific configuration */}
                  {provider.id === 'twilio' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Account SID
                        </label>
                        <input
                          type="text"
                          value={credentials[provider.id]?.accountSid || ''}
                          onChange={(e) => updateCredentials(provider.id, 'accountSid', e.target.value)}
                          placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Auth Token
                        </label>
                        <input
                          type="password"
                          value={credentials[provider.id]?.authToken || ''}
                          onChange={(e) => updateCredentials(provider.id, 'authToken', e.target.value)}
                          placeholder="Your Auth Token"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={credentials[provider.id]?.phoneNumber || ''}
                          onChange={(e) => updateCredentials(provider.id, 'phoneNumber', e.target.value)}
                          placeholder="+1234567890"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Test Phone Number
                        </label>
                        <input
                          type="tel"
                          value={credentials[provider.id]?.testPhone || ''}
                          onChange={(e) => updateCredentials(provider.id, 'testPhone', e.target.value)}
                          placeholder="+1234567890"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </>
                  )}

                  {provider.id === 'aws-sns' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Access Key ID
                        </label>
                        <input
                          type="text"
                          value={credentials[provider.id]?.accessKeyId || ''}
                          onChange={(e) => updateCredentials(provider.id, 'accessKeyId', e.target.value)}
                          placeholder="AKIAIOSFODNN7EXAMPLE"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Secret Access Key
                        </label>
                        <input
                          type="password"
                          value={credentials[provider.id]?.secretAccessKey || ''}
                          onChange={(e) => updateCredentials(provider.id, 'secretAccessKey', e.target.value)}
                          placeholder="Your Secret Access Key"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Region
                        </label>
                        <input
                          type="text"
                          value={credentials[provider.id]?.region || ''}
                          onChange={(e) => updateCredentials(provider.id, 'region', e.target.value)}
                          placeholder="us-east-1"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Test Phone Number
                        </label>
                        <input
                          type="tel"
                          value={credentials[provider.id]?.testPhone || ''}
                          onChange={(e) => updateCredentials(provider.id, 'testPhone', e.target.value)}
                          placeholder="+1234567890"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <p>Delivery Rate: {Math.round(provider.deliveryRate * 100)}%</p>
                    <p>Response Time: {provider.responseTime}s</p>
                    <p>Features: {provider.supportedFeatures.join(', ')}</p>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => testProvider(provider.id)}
                      disabled={testing === provider.id || !credentials[provider.id]?.testPhone}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50 flex items-center space-x-1"
                    >
                      {testing === provider.id ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <TestTube size={16} />
                      )}
                      <span>Test</span>
                    </button>
                    <button
                      onClick={() => saveCredentials(provider.id)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center space-x-1"
                    >
                      <Save size={16} />
                      <span>Save</span>
                    </button>
                  </div>
                </div>

                {/* Test Results */}
                {testResults[provider.id] && (
                  <div className={`mt-3 p-3 rounded-md ${
                    testResults[provider.id].success
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center space-x-2">
                      {testResults[provider.id].success ? (
                        <CheckCircle size={16} className="text-green-600" />
                      ) : (
                        <AlertCircle size={16} className="text-red-600" />
                      )}
                      <span className={`text-sm font-medium ${
                        testResults[provider.id].success ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {testResults[provider.id].success ? 'Test Successful' : 'Test Failed'}
                      </span>
                    </div>
                    {testResults[provider.id].note && (
                      <p className="text-xs text-gray-600 mt-1">
                        {testResults[provider.id].note}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Setup Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Setup Instructions</h4>
              <div className="text-sm text-blue-800 space-y-2">
                <p><strong>Twilio:</strong></p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Sign up at <a href="https://www.twilio.com" target="_blank" rel="noopener noreferrer" className="underline">twilio.com</a></li>
                  <li>Get your Account SID and Auth Token from the console</li>
                  <li>Purchase a phone number for sending SMS</li>
                  <li>Enter your credentials above and test the connection</li>
                </ol>

                <p className="mt-3"><strong>AWS SNS:</strong></p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Create an AWS account and enable SNS</li>
                  <li>Create an IAM user with SNS permissions</li>
                  <li>Get Access Key ID and Secret Access Key</li>
                  <li>Enter your credentials and region above</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SMSSettings;