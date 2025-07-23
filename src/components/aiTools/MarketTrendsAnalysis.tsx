import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { enhancedGeminiService } from '../../services/enhancedGeminiService';
import { aiUsageTracker } from '../../services/aiUsageTracker';
import { TrendingUp, Download, Search, BarChart3, Globe, Calendar, Target, Users, DollarSign } from 'lucide-react';

export default function MarketTrendsAnalysis() {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    industry: '',
    region: 'Global',
    timeframe: '12',
    focusAreas: [],
    includeCompetitors: false,
    includeForecast: true
  });
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing',
    'Real Estate', 'Education', 'Automotive', 'Energy', 'Entertainment'
  ];

  const regions = ['Global', 'North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East & Africa'];
  
  const focusAreaOptions = [
    'Market Size', 'Growth Rate', 'Consumer Behavior', 'Technology Adoption',
    'Regulatory Changes', 'Investment Trends', 'Emerging Players', 'Digital Transformation'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleFocusArea = (area: string) => {
    setFormData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area]
    }));
  };

  const generateAnalysis = async () => {
    if (!formData.industry) {
      alert('Please select an industry');
      return;
    }

    setIsLoading(true);
    const startTime = Date.now();

    try {
      const result = await enhancedGeminiService.analyzeMarketTrends({
        industry: formData.industry,
        region: formData.region,
        timeframe: `${formData.timeframe} months`,
        focusAreas: formData.focusAreas,
        includeCompetitors: formData.includeCompetitors,
        includeForecast: formData.includeForecast
      });

      setAnalysis(result);

      // Track usage
      aiUsageTracker.recordUsage(
        'market-trends',
        'Market Trends Analysis',
        'Analytics',
        Date.now() - startTime,
        true
      );
    } catch (error) {
      console.error('Error generating market trends analysis:', error);
      alert('Failed to generate analysis. Please try again.');
      
      aiUsageTracker.recordUsage(
        'market-trends',
        'Market Trends Analysis',
        'Analytics',
        Date.now() - startTime,
        false
      );
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReport = () => {
    if (!analysis) return;

    const reportContent = `
MARKET TRENDS ANALYSIS REPORT
Generated: ${new Date().toLocaleDateString()}
Industry: ${formData.industry}
Region: ${formData.region}
Timeframe: ${formData.timeframe} months

${analysis.summary}

KEY FINDINGS:
${analysis.keyFindings?.map((finding: string, index: number) => `${index + 1}. ${finding}`).join('\n') || 'No key findings available'}

GROWTH PROJECTIONS:
${analysis.growthProjections || 'No growth projections available'}

OPPORTUNITIES:
${analysis.opportunities?.map((opp: string, index: number) => `${index + 1}. ${opp}`).join('\n') || 'No opportunities identified'}

RISKS:
${analysis.risks?.map((risk: string, index: number) => `${index + 1}. ${risk}`).join('\n') || 'No risks identified'}

RECOMMENDATIONS:
${analysis.recommendations?.map((rec: string, index: number) => `${index + 1}. ${rec}`).join('\n') || 'No recommendations available'}
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `market-trends-${formData.industry}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
          <h2 className="text-2xl font-bold">Market Trends Analysis</h2>
        </div>
        {analysis && (
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
          {/* Industry Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Industry *</label>
            <select
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              className={`w-full p-3 rounded-lg border ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              <option value="">Select Industry</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>

          {/* Region Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Region</label>
            <select
              value={formData.region}
              onChange={(e) => handleInputChange('region', e.target.value)}
              className={`w-full p-3 rounded-lg border ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          {/* Timeframe */}
          <div>
            <label className="block text-sm font-medium mb-2">Analysis Timeframe</label>
            <select
              value={formData.timeframe}
              onChange={(e) => handleInputChange('timeframe', e.target.value)}
              className={`w-full p-3 rounded-lg border ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              <option value="6">6 Months</option>
              <option value="12">12 Months</option>
              <option value="24">24 Months</option>
              <option value="36">36 Months</option>
            </select>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">Additional Options</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.includeCompetitors}
                  onChange={(e) => handleInputChange('includeCompetitors', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm">Include Competitor Analysis</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.includeForecast}
                  onChange={(e) => handleInputChange('includeForecast', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm">Include Future Forecast</span>
              </label>
            </div>
          </div>
        </div>

        {/* Focus Areas */}
        <div className="mt-6">
          <label className="block text-sm font-medium mb-3">Focus Areas (Optional)</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {focusAreaOptions.map(area => (
              <label key={area} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.focusAreas.includes(area)}
                  onChange={() => toggleFocusArea(area)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm">{area}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-6">
          <button
            onClick={generateAnalysis}
            disabled={isLoading || !formData.industry}
            className="w-full md:w-auto flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing Market Trends...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Generate Analysis
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Summary */}
          <div className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Executive Summary
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {analysis.summary}
            </p>
          </div>

          {/* Key Metrics Grid */}
          {analysis.metrics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg mr-4">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Market Growth</p>
                    <p className="text-2xl font-bold">{analysis.metrics.marketGrowth || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Market Size</p>
                    <p className="text-2xl font-bold">{analysis.metrics.marketSize || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg mr-4">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Key Players</p>
                    <p className="text-2xl font-bold">{analysis.metrics.keyPlayers || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Key Findings */}
          {analysis.keyFindings && (
            <div className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Key Findings
              </h3>
              <ul className="space-y-2">
                {analysis.keyFindings.map((finding: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700 dark:text-gray-300">{finding}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Opportunities & Risks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysis.opportunities && (
              <div className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="text-lg font-semibold mb-4 text-green-600">Opportunities</h3>
                <ul className="space-y-2">
                  {analysis.opportunities.map((opportunity: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700 dark:text-gray-300">{opportunity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.risks && (
              <div className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="text-lg font-semibold mb-4 text-red-600">Risks</h3>
                <ul className="space-y-2">
                  {analysis.risks.map((risk: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700 dark:text-gray-300">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Recommendations */}
          {analysis.recommendations && (
            <div className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Strategic Recommendations
              </h3>
              <ul className="space-y-3">
                {analysis.recommendations.map((recommendation: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-sm font-bold mr-3 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
