import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  Building, 
  Users, 
  Crown, 
  ArrowRight, 
  Check,
  Rocket,
  Settings,
  BarChart3
} from 'lucide-react';

const OnboardingPage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: '',
    teamSize: '',
    goals: [] as string[],
  });

  const organizationTypes = [
    { id: 'startup', label: 'Startup', icon: Rocket },
    { id: 'smb', label: 'Small/Medium Business', icon: Building },
    { id: 'enterprise', label: 'Enterprise', icon: Crown },
    { id: 'agency', label: 'Agency/Consultancy', icon: Users },
  ];

  const teamSizes = [
    '1-5 employees',
    '6-25 employees',
    '26-100 employees',
    '100+ employees'
  ];

  const businessGoals = [
    { id: 'sales', label: 'Increase Sales', icon: BarChart3 },
    { id: 'efficiency', label: 'Improve Efficiency', icon: Settings },
    { id: 'customer', label: 'Better Customer Management', icon: Users },
    { id: 'analytics', label: 'Data-Driven Insights', icon: BarChart3 },
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      navigate('/dashboard');
    }
  };

  const handleGoalToggle = (goalId: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Step {step} of 3</span>
            <span className="text-sm text-gray-500">{Math.round((step / 3) * 100)}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Welcome to SmartCRM, {user?.firstName}! 🎉
            </CardTitle>
            <CardDescription>
              Let's set up your workspace to get you started quickly
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="org-name" className="text-base font-medium">
                    What's your organization name?
                  </Label>
                  <Input
                    id="org-name"
                    placeholder="Acme Corporation"
                    value={formData.organizationName}
                    onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">
                    What type of organization is this?
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {organizationTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setFormData(prev => ({ ...prev, organizationType: type.id }))}
                          className={`p-4 border rounded-lg text-left transition-all hover:border-blue-300 ${
                            formData.organizationType === type.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200'
                          }`}
                        >
                          <Icon className="w-6 h-6 text-blue-600 mb-2" />
                          <div className="font-medium text-gray-900">{type.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    How large is your team?
                  </Label>
                  <div className="space-y-2">
                    {teamSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setFormData(prev => ({ ...prev, teamSize: size }))}
                        className={`w-full p-3 border rounded-lg text-left transition-all hover:border-blue-300 ${
                          formData.teamSize === size
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{size}</span>
                          {formData.teamSize === size && (
                            <Check className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    What are your main goals? (Select all that apply)
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {businessGoals.map((goal) => {
                      const Icon = goal.icon;
                      const isSelected = formData.goals.includes(goal.id);
                      return (
                        <button
                          key={goal.id}
                          onClick={() => handleGoalToggle(goal.id)}
                          className={`p-4 border rounded-lg text-left transition-all hover:border-blue-300 ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <Icon className="w-6 h-6 text-blue-600 mb-2" />
                              <div className="font-medium text-gray-900">{goal.label}</div>
                            </div>
                            {isSelected && (
                              <Check className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        You're all set!
                      </h3>
                      <p className="text-sm text-green-700 mt-1">
                        We'll customize your dashboard based on your preferences.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                className="ml-auto flex items-center"
                disabled={
                  (step === 1 && (!formData.organizationName || !formData.organizationType)) ||
                  (step === 2 && !formData.teamSize)
                }
              >
                {step === 3 ? 'Get Started' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@smart-crm.videoremix.io" className="text-blue-600 hover:text-blue-500">
              support@smart-crm.videoremix.io
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
