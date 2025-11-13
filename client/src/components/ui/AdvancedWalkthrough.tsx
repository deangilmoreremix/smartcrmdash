import React, { useState, useEffect, useCallback } from 'react';
import Joyride, { CallBackProps, STATUS, EVENTS, Step } from 'react-joyride';
import {
  CheckCircle,
  Circle,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Target,
  Play,
  Pause,
  SkipForward,
  Settings
} from 'lucide-react';
import { useTheme } from "../../contexts/ThemeContext";';
import { useGemini } from '../../services/geminiService';

interface AdvancedWalkthroughProps {
  run: boolean;
  context: 'dashboard' | 'pipeline' | 'remote-app' | 'onboarding';
  federatedApps?: string[];
  onComplete: () => void;
  onStepChange?: (step: number) => void;
}

const AdvancedWalkthrough: React.FC<AdvancedWalkthroughProps> = ({
  run,
  context,
  federatedApps = [],
  onComplete,
  onStepChange
}) => {
  const { isDark } = useTheme();
  const { generateContent } = useGemini();
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (run) {
      initializeSteps();
    }
  }, [run, context, federatedApps]);

  const initializeSteps = useCallback(async () => {
    const baseSteps = getStepsForContext(context);

    // Add AI-generated suggestions for complex contexts
    if (context === 'dashboard' || context === 'pipeline') {
      try {
        const response = await generateContent({
          prompt: `Suggest 3 key walkthrough steps for ${context} that would help a new user understand the interface`
        });
        const suggestions = response.content.split('\n').filter((s: string) => s.trim());
        setAiSuggestions(suggestions);
      } catch (error) {
        console.warn('AI suggestions failed:', error);
      }
    }

    // Add federated app steps if applicable
    const federatedSteps = federatedApps.map(app => ({
      target: `.federated-${app}`,
      content: (
        <div>
          <h3 className="font-semibold mb-2 flex items-center">
            <Target className="h-5 w-5 mr-2 text-indigo-600" />
            {app} Integration
          </h3>
          <p className="mb-3">This feature is powered by our {app} remote application via Module Federation.</p>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
            <p className="text-sm text-indigo-700 dark:text-indigo-300">
              Remote apps load dynamically, ensuring optimal performance and modularity.
            </p>
          </div>
        </div>
      ),
      placement: 'auto' as const,
    }));

    setSteps([...baseSteps, ...federatedSteps]);
  }, [context, federatedApps, generateContent]);

  const getStepsForContext = (ctx: string): Step[] => {
    const commonStyles = {
      titleClass: 'text-lg font-semibold mb-3',
      contentClass: 'text-sm leading-relaxed',
      actionClass: 'mt-4 flex space-x-2'
    };

    switch (ctx) {
      case 'dashboard':
        return [
          {
            target: '.dashboard-header',
            content: (
              <div>
                <h3 className={commonStyles.titleClass}>Welcome to Smart CRM</h3>
                <p className={commonStyles.contentClass}>
                  Your AI-powered dashboard provides real-time insights and automation tools.
                </p>
                <div className={commonStyles.actionClass}>
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                    Get Started
                  </button>
                </div>
              </div>
            ),
            placement: 'bottom',
          },
          {
            target: '.metrics-cards',
            content: (
              <div>
                <h3 className={commonStyles.titleClass}>Key Performance Metrics</h3>
                <p className={commonStyles.contentClass}>
                  Track your sales performance with AI-enhanced KPIs that update in real-time.
                </p>
                {aiSuggestions.length > 0 && (
                  <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">AI Tip</span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {aiSuggestions[0]}
                    </p>
                  </div>
                )}
              </div>
            ),
          },
          {
            target: '.ai-tools-section',
            content: (
              <div>
                <h3 className={commonStyles.titleClass}>AI Tools Hub</h3>
                <p className={commonStyles.contentClass}>
                  Access 20+ AI tools for lead generation, content creation, and predictive analytics.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-center">
                    <span className="text-xs font-medium text-blue-600">Lead Scoring</span>
                  </div>
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded text-center">
                    <span className="text-xs font-medium text-green-600">Email Assistant</span>
                  </div>
                </div>
              </div>
            ),
          },
        ];
      case 'pipeline':
        return [
          {
            target: '.pipeline-container',
            content: (
              <div>
                <h3 className={commonStyles.titleClass}>Visual Sales Pipeline</h3>
                <p className={commonStyles.contentClass}>
                  Drag and drop deals through stages. AI provides insights on conversion probabilities.
                </p>
              </div>
            ),
          },
        ];
      default:
        return [];
    }
  };

  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { status, type, index } = data;

    setCurrentStep(index);
    onStepChange?.(index);

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      onComplete();
    }
  }, [onComplete, onStepChange]);

  const customStyles = {
    options: {
      primaryColor: '#2563eb',
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      textColor: isDark ? '#ffffff' : '#111827',
      overlayColor: 'rgba(0, 0, 0, 0.7)',
      spotlightShadow: '0 0 30px rgba(37, 99, 235, 0.3)',
      zIndex: 10000,
    },
    tooltip: {
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderRadius: '16px',
      boxShadow: isDark
        ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      fontSize: '14px',
      padding: '24px',
      maxWidth: '400px',
    },
    buttonNext: {
      backgroundColor: '#2563eb',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      padding: '10px 16px',
      boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
    },
    buttonBack: {
      color: '#6b7280',
      fontSize: '14px',
      padding: '10px 16px',
    },
    buttonSkip: {
      color: '#6b7280',
      fontSize: '14px',
      padding: '10px 16px',
    },
    buttonClose: {
      height: 14,
      width: 14,
      color: '#6b7280',
    },
  };

  const ProgressIndicator = () => (
    <div className="flex items-center justify-center mb-4">
      {steps.map((_, index) => (
        <div key={index} className="flex items-center">
          {index < currentStep ? (
            <CheckCircle className="h-6 w-6 text-green-600" />
          ) : index === currentStep ? (
            <Circle className="h-6 w-6 text-blue-600 fill-current animate-pulse" />
          ) : (
            <Circle className="h-6 w-6 text-gray-300" />
          )}
          {index < steps.length - 1 && (
            <div
              className={`w-12 h-1 mx-3 rounded ${
                index < currentStep
                  ? 'bg-green-600'
                  : 'bg-gray-300'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const ControlPanel = () => (
    <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </button>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        Step {currentStep + 1} of {steps.length}
      </span>
    </div>
  );

  return (
    <>
      <Joyride
        steps={steps}
        run={run && !isPaused}
        callback={handleJoyrideCallback}
        continuous
        showProgress={false}
        showSkipButton
        disableOverlayClose
        disableCloseOnEsc={false}
        styles={customStyles}
        locale={{
          back: 'Previous',
          close: 'Close',
          last: 'Complete',
          next: 'Continue',
          open: 'Open',
          skip: 'Skip Tour'
        }}
      />

      {showSettings && (
        <div className="fixed top-4 right-4 z-[10001] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 min-w-64">
          <h4 className="font-semibold mb-3">Walkthrough Settings</h4>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Show AI suggestions</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" defaultChecked />
              <span className="text-sm">Auto-advance steps</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Play sound effects</span>
            </label>
          </div>
          <button
            onClick={() => setShowSettings(false)}
            className="mt-3 w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default AdvancedWalkthrough;