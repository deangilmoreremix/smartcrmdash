import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { ModernButton } from '../ui/ModernButton';
import { 
  Brain, 
  Sparkles, 
  User, 
  Building, 
  Mail, 
  TrendingUp, 
  Target, 
  CheckCircle,
  Loader2,
  Award
} from 'lucide-react';

export const InteractiveContactScorerAnimated: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: '',
    email: '',
    industry: '',
    interestLevel: 'medium',
    sources: ''
  });
  const [isScoring, setIsScoring] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [breakdown, setBreakdown] = useState<{fitScore: number, engagementScore: number, conversionProbability: number, urgencyScore: number} | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setScore(null);
    setInsights([]);
    setBreakdown(null);
  };

  const calculateScore = () => {
    setIsScoring(true);
    
    // Simulate AI processing
    setTimeout(() => {
      let calculatedScore = 50; // Base score
      
      // Score calculation logic remains the same
      if (formData.title.toLowerCase().includes('ceo') || formData.title.toLowerCase().includes('founder')) {
        calculatedScore += 25;
      } else if (formData.title.toLowerCase().includes('director') || formData.title.toLowerCase().includes('vp')) {
        calculatedScore += 15;
      } else if (formData.title.toLowerCase().includes('manager')) {
        calculatedScore += 10;
      }
      
      if (formData.interestLevel === 'hot') calculatedScore += 20;
      else if (formData.interestLevel === 'medium') calculatedScore += 10;
      else if (formData.interestLevel === 'cold') calculatedScore -= 10;
      
      if (formData.industry === 'Technology') calculatedScore += 15;
      else if (formData.industry === 'Finance') calculatedScore += 10;
      
      if (formData.company.toLowerCase().includes('corp') || formData.company.toLowerCase().includes('inc')) {
        calculatedScore += 10;
      }
      
      if (formData.sources.toLowerCase().includes('referral')) calculatedScore += 15;
      else if (formData.sources.toLowerCase().includes('linkedin')) calculatedScore += 10;
      
      calculatedScore = Math.max(0, Math.min(100, calculatedScore));
      
      const generatedBreakdown = {
        fitScore: Math.max(0, Math.min(100, calculatedScore + Math.random() * 20 - 10)),
        engagementScore: Math.max(0, Math.min(100, calculatedScore + Math.random() * 30 - 15)),
        conversionProbability: Math.max(0, Math.min(100, calculatedScore + Math.random() * 25 - 12)),
        urgencyScore: Math.max(0, Math.min(100, calculatedScore + Math.random() * 35 - 17))
      };
      
      const generatedInsights = [];
      if (calculatedScore >= 80) {
        generatedInsights.push('High conversion potential - prioritize immediate follow-up');
        generatedInsights.push('Decision-making authority detected');
        generatedInsights.push('Strong industry alignment');
        generatedInsights.push('Optimal engagement window identified');
      } else if (calculatedScore >= 60) {
        generatedInsights.push('Good engagement potential - schedule follow-up within 48 hours');
        generatedInsights.push('Moderate influence in decision process');
        generatedInsights.push('Consider personalized approach');
      } else {
        generatedInsights.push('Lower priority - consider nurturing campaign');
        generatedInsights.push('May require additional qualification');
        generatedInsights.push('Focus on relationship building');
      }
      
      setScore(calculatedScore);
      setInsights(generatedInsights);
      setBreakdown(generatedBreakdown);
      setIsScoring(false);
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const canScore = formData.name && formData.title && formData.company && formData.email;

  return (
    <GlassCard className="p-8 transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-center mb-6 transition-opacity duration-300">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-xl mr-3 transition-transform hover:scale-110">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Interactive AI Contact Scorer</h3>
          <p className="text-gray-600">Enter contact information to see AI scoring in action</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-4">
          {/* Input fields remain the same */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="John Smith"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          {/* Other input fields... */}

          <ModernButton
            variant="primary"
            onClick={calculateScore}
            loading={isScoring}
            disabled={!canScore || isScoring}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 transition-transform hover:scale-[1.02] active:scale-95"
          >
            {isScoring ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI is analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Score with AI</span>
              </>
            )}
          </ModernButton>
        </div>

        {/* Results Display */}
        <div className="space-y-6 transition-all duration-300">
          {score !== null ? (
            <div className="animate-fade-in">
              {/* Score Display and other result components... */}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 transition-opacity duration-300">
              <Brain className="w-16 h-16 text-gray-300 mb-4" />
              <h4 className="text-lg font-semibold text-gray-500 mb-2">Ready to Score</h4>
              <p className="text-gray-400 text-sm">
                Fill in the contact information and click "Score with AI" to see the magic happen
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Demo Notice */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 transition-all duration-300">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">Interactive Demo</span>
        </div>
        <p className="text-sm text-blue-800 mt-1">
          This is a simplified version of our AI scoring engine. The real application uses advanced machine learning models from OpenAI and Google Gemini for even more accurate predictions, with detailed breakdown scores and confidence levels.
        </p>
      </div>
    </GlassCard>
  );
};