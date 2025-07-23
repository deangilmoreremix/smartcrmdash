import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { enhancedGeminiService } from '../../services/enhancedGeminiService';
import { aiUsageTracker } from '../../services/aiUsageTracker';
import { AlertTriangle, Download, Search, TrendingDown, Users, Calendar, Target, Mail, Phone } from 'lucide-react';

export default function ChurnPrediction() {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    timeframe: '90',
    includeContactData: true,
    includeDealHistory: true,
    includeEngagementMetrics: true,
    riskThreshold: 'medium'
  });
  const [prediction, setPrediction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generatePrediction = async () => {
    setIsLoading(true);
    const startTime = Date.now();

    try {
      const result = await enhancedGeminiService.predictChurnRisk({
        timeframe: `${formData.timeframe} days`,
        includeContactData: formData.includeContactData,
        includeDealHistory: formData.includeDealHistory,
        includeEngagementMetrics: formData.includeEngagementMetrics,
        riskThreshold: formData.riskThreshold
      });

      setPrediction(result);

      // Track usage
      aiUsageTracker.recordUsage(
        'churn-prediction',
        'Churn Prediction',
        'Analytics',
        Date.now() - startTime,
        true
      );
    } catch (error) {
      console.error('Error generating churn prediction:', error);
      alert('Failed to generate churn prediction. Please try again.');
      
      aiUsageTracker.recordUsage(
        'churn-prediction',
        'Churn Prediction',
        'Analytics',
        Date.now() - startTime,
        false
      );
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReport = () => {
    if (!prediction) return;

    const reportContent = `
CHURN PREDICTION ANALYSIS REPORT
Generated: ${new Date().toLocaleDateString()}
Timeframe: ${formData.timeframe} days
Risk Threshold: ${formData.riskThreshold}

EXECUTIVE SUMMARY:
${prediction.summary}

HIGH RISK CUSTOMERS:
${prediction.highRiskCustomers?.map((customer: any, index: number) => 
  `${index + 1}. ${customer.name || 'Customer'} (${customer.churnProbability}% risk)`
).join('\n') || 'No high-risk customers identified'}

KEY RISK FACTORS:
${prediction.riskFactors?.map((factor: string, index: number) => `${index + 1}. ${factor}`).join('\n') || 'No risk factors identified'}

RECOMMENDATIONS:
${prediction.recommendations?.map((rec: string, index: number) => `${index + 1}. ${rec}`).join('\n') || 'No recommendations available'}

RETENTION STRATEGIES:
${prediction.retentionStrategies?.map((strategy: string, index: number) => `${index + 1}. ${strategy}`).join('\n') || 'No retention strategies available'}
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `churn-prediction-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <TrendingDown className="w-4 h-4" />;
      case 'low': return <Target className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <AlertTriangle className="w-6 h-6 mr-2 text-red-600" />
          <h2 className="text-2xl font-bold">Churn Prediction Analysis</h2>
        </div>
        {prediction && (
          <button
            onClick={downloadReport}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </button>
        )}
      </div>

      {/* Configuration Form */}
      <div className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-lg font-semibold mb-4">Analysis Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Timeframe */}
          <div>
            <label className="block text-sm font-medium mb-2">Prediction Timeframe</label>
            <select
              value={formData.timeframe}
              onChange={(e) => handleInputChange('timeframe', e.target.value)}
              className={`w-full p-3 rounded-lg border ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              <option value="30">30 Days</option>
              <option value="60">60 Days</option>
              <option value="90">90 Days</option>
              <option value="180">180 Days</option>
              <option value="365">1 Year</option>
            </select>
          </div>

          {/* Risk Threshold */}
          <div>
            <label className="block text-sm font-medium mb-2">Risk Threshold</label>
            <select
              value={formData.riskThreshold}
              onChange={(e) => handleInputChange('riskThreshold', e.target.value)}
              className={`w-full p-3 rounded-lg border ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              <option value="low">Low (&gt;30% risk)</option>
              <option value="medium">Medium (&gt;50% risk)</option>
              <option value="high">High (&gt;70% risk)</option>
            </select>
          </div>
        </div>

        {/* Data Sources */}
        <div className="mt-6">
          <label className="block text-sm font-medium mb-3">Include Data Sources</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.includeContactData}
                onChange={(e) => handleInputChange('includeContactData', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm">Contact & Communication Data</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.includeDealHistory}
                onChange={(e) => handleInputChange('includeDealHistory', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm">Deal History & Revenue Data</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.includeEngagementMetrics}
                onChange={(e) => handleInputChange('includeEngagementMetrics', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm">Engagement & Activity Metrics</span>
            </label>
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-6">
          <button
            onClick={generatePrediction}
            disabled={isLoading}
            className="w-full md:w-auto flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing Churn Risk...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Generate Prediction
              </>
            )}
          </button>
        </div>
      </div>

      {/* Prediction Results */}
      {prediction && (
        <div className="space-y-6">
          {/* Summary */}
          <div className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingDown className="w-5 h-5 mr-2" />
              Churn Risk Summary
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {prediction.summary}
            </p>
          </div>

          {/* Risk Metrics */}
          {prediction.metrics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 rounded-lg mr-4">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">High Risk</p>
                    <p className="text-2xl font-bold">{prediction.metrics.highRisk || 0}</p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                    <TrendingDown className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Medium Risk</p>
                    <p className="text-2xl font-bold">{prediction.metrics.mediumRisk || 0}</p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg mr-4">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Low Risk</p>
                    <p className="text-2xl font-bold">{prediction.metrics.lowRisk || 0}</p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Analyzed</p>
                    <p className="text-2xl font-bold">{prediction.metrics.totalCustomers || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* High Risk Customers */}
          {prediction.highRiskCustomers && prediction.highRiskCustomers.length > 0 && (
            <div className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center text-red-600">
                <AlertTriangle className="w-5 h-5 mr-2" />
                High Risk Customers
              </h3>
              <div className="space-y-4">
                {prediction.highRiskCustomers.map((customer: any, index: number) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                          <Users className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{customer.name || `Customer ${index + 1}`}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {customer.company || 'Company Name'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          getRiskColor(customer.riskLevel)
                        }`}>
                          {getRiskIcon(customer.riskLevel)}
                          <span className="ml-1">{customer.churnProbability}%</span>
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Last Contact:</span>
                        <span className="ml-2 font-medium">{customer.lastContact || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Deal Value:</span>
                        <span className="ml-2 font-medium">{customer.dealValue || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Engagement Score:</span>
                        <span className="ml-2 font-medium">{customer.engagementScore || 'N/A'}</span>
                      </div>
                    </div>
                    {customer.riskFactors && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Risk Factors:</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {customer.riskFactors.join(', ')}
                        </p>
                      </div>
                    )}
                    <div className="flex space-x-2 mt-3">
                      <button className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                        <Mail className="w-3 h-3 mr-1" />
                        Contact
                      </button>
                      <button className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
                        <Phone className="w-3 h-3 mr-1" />
                        Call
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risk Factors */}
          {prediction.riskFactors && (
            <div className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Key Risk Factors
              </h3>
              <ul className="space-y-2">
                {prediction.riskFactors.map((factor: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700 dark:text-gray-300">{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations & Retention Strategies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prediction.recommendations && (
              <div className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="text-lg font-semibold mb-4 text-blue-600">Recommendations</h3>
                <ul className="space-y-2">
                  {prediction.recommendations.map((recommendation: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700 dark:text-gray-300">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {prediction.retentionStrategies && (
              <div className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="text-lg font-semibold mb-4 text-green-600">Retention Strategies</h3>
                <ul className="space-y-2">
                  {prediction.retentionStrategies.map((strategy: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700 dark:text-gray-300">{strategy}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
