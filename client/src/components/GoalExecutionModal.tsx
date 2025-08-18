import React, { useState, useEffect } from 'react';
import { Goal, ExecutionStep, GoalExecutionResult } from '../types/goals';
import { 
  X, 
  Play, 
  Pause, 
  Check, 
  AlertTriangle, 
  Brain, 
  Clock, 
  TrendingUp, 
  Users, 
  Zap,
  Eye,
  Sparkles,
  Activity,
  CheckCircle
} from 'lucide-react';

interface GoalExecutionModalProps {
  goal: Goal;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (result: GoalExecutionResult) => void;
  realMode?: boolean;
}

const GoalExecutionModal: React.FC<GoalExecutionModalProps> = ({
  goal,
  isOpen,
  onClose,
  onComplete,
  realMode = false
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<ExecutionStep[]>([]);
  const [executionProgress, setExecutionProgress] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [thinking, setThinking] = useState('');
  const [liveUpdates, setLiveUpdates] = useState<string[]>([]);

  // Initialize execution steps based on goal
  useEffect(() => {
    if (isOpen && goal) {
      const executionSteps: ExecutionStep[] = goal.agentsRequired.map((agent, index) => ({
        id: `step-${index}`,
        name: `${agent} Analysis`,
        status: 'pending',
        progress: 0,
        agent: agent,
        thinking: '',
        toolsUsed: [],
        crmImpact: ''
      }));
      
      setSteps(executionSteps);
      setCurrentStep(0);
      setExecutionProgress(0);
      setIsExecuting(false);
      setLiveUpdates([]);
    }
  }, [isOpen, goal]);

  // Start execution
  const startExecution = () => {
    setIsExecuting(true);
    setStartTime(new Date());
    setLiveUpdates(['🚀 Initializing AI Goal Execution...']);
    
    executeNextStep();
  };

  // Execute individual steps
  const executeNextStep = () => {
    if (currentStep >= steps.length) {
      completeExecution();
      return;
    }

    const step = steps[currentStep];
    setSteps(prev => prev.map((s, i) => 
      i === currentStep ? { ...s, status: 'executing', progress: 0 } : s
    ));

    // Simulate step execution with thinking process
    const thinkingMessages = [
      `🧠 ${step.agent} is analyzing the requirements...`,
      `⚙️ Processing data patterns and correlations...`,
      `🔍 Evaluating optimization opportunities...`,
      `📊 Calculating impact metrics and ROI...`,
      `✨ Generating actionable recommendations...`
    ];

    let stepProgress = 0;
    let thinkingIndex = 0;

    const stepInterval = setInterval(() => {
      stepProgress += Math.random() * 15 + 5;
      
      if (stepProgress >= 100) {
        stepProgress = 100;
        clearInterval(stepInterval);
        
        // Complete current step
        setSteps(prev => prev.map((s, i) => 
          i === currentStep ? { 
            ...s, 
            status: 'completed', 
            progress: 100,
            result: `${step.agent} completed successfully`,
            toolsUsed: goal.toolsNeeded.slice(0, 2),
            crmImpact: `Updated ${Math.floor(Math.random() * 50) + 10} records`
          } : s
        ));
        
        setLiveUpdates(prev => [...prev, `✅ ${step.agent} completed analysis`]);
        
        // Move to next step
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
          setExecutionProgress((currentStep + 1) / steps.length * 100);
          executeNextStep();
        }, 1000);
      } else {
        // Update step progress
        setSteps(prev => prev.map((s, i) => 
          i === currentStep ? { ...s, progress: stepProgress } : s
        ));
        
        // Update thinking message
        if (thinkingIndex < thinkingMessages.length && stepProgress > (thinkingIndex + 1) * 20) {
          setThinking(thinkingMessages[thinkingIndex]);
          setLiveUpdates(prev => [...prev, thinkingMessages[thinkingIndex]]);
          thinkingIndex++;
        }
      }
    }, realMode ? 800 : 400);
  };

  // Complete execution
  const completeExecution = () => {
    setIsExecuting(false);
    setExecutionProgress(100);
    setLiveUpdates(prev => [...prev, '🎉 Goal execution completed successfully!']);
    
    const result: GoalExecutionResult = {
      goalId: goal.id,
      success: true,
      results: {
        stepsCompleted: steps.length,
        totalTime: startTime ? Date.now() - startTime.getTime() : 0,
        improvements: goal.successMetrics,
        nextSteps: ['Monitor performance metrics', 'Review automation rules', 'Schedule follow-up analysis']
      },
      executionTime: startTime ? Date.now() - startTime.getTime() : 0,
      agentsUsed: goal.agentsRequired,
      toolsUsed: goal.toolsNeeded,
      nextRecommendations: [
        'Set up monitoring dashboard',
        'Configure success alerts',
        'Schedule monthly review'
      ],
      crmUpdates: [
        'Created automation rules',
        'Updated contact scoring',
        'Enhanced pipeline tracking'
      ]
    };

    setTimeout(() => {
      onComplete(result);
    }, 2000);
  };

  // Pause execution
  const pauseExecution = () => {
    setIsExecuting(false);
    setLiveUpdates(prev => [...prev, '⏸️ Execution paused by user']);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {goal.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {realMode ? 'Live AI Execution' : 'Preview Mode'} • {goal.category}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Goal Overview */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-1">
                  <Clock className="h-4 w-4 mr-2" />
                  Estimated Time
                </div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {goal.estimatedSetupTime}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-1">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Expected ROI
                </div>
                <div className="font-semibold text-green-600 dark:text-green-400">
                  {goal.roi}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-1">
                  <Users className="h-4 w-4 mr-2" />
                  AI Agents
                </div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {goal.agentsRequired.length}
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300">{goal.description}</p>
          </div>

          {/* Execution Controls */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Execution Progress
              </h3>
              <div className="flex space-x-2">
                {!isExecuting && currentStep === 0 && (
                  <button
                    onClick={startExecution}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Execution
                  </button>
                )}
                
                {isExecuting && (
                  <button
                    onClick={pauseExecution}
                    className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </button>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Overall Progress</span>
                <span>{Math.round(executionProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${executionProgress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Execution Steps */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4">
              AI Agent Execution Steps
            </h4>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`border rounded-lg p-4 transition-all duration-200 ${
                    step.status === 'executing' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : step.status === 'completed'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.status === 'executing' 
                          ? 'bg-blue-500 text-white' 
                          : step.status === 'completed'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                      }`}>
                        {step.status === 'executing' ? (
                          <Activity className="h-4 w-4 animate-pulse" />
                        ) : step.status === 'completed' ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {step.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Agent: {step.agent}
                        </div>
                      </div>
                    </div>
                    
                    {step.status !== 'pending' && (
                      <div className="text-sm font-medium">
                        {Math.round(step.progress)}%
                      </div>
                    )}
                  </div>
                  
                  {step.status !== 'pending' && (
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          step.status === 'executing' ? 'bg-blue-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${step.progress}%` }}
                      ></div>
                    </div>
                  )}
                  
                  {step.result && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {step.result}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Live Updates */}
          {liveUpdates.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-blue-500" />
                Live Updates
              </h4>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 max-h-32 overflow-y-auto">
                <div className="space-y-1">
                  {liveUpdates.slice(-5).map((update, index) => (
                    <div key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      {update}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Current Thinking */}
          {thinking && isExecuting && (
            <div className="mb-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700/50">
                <div className="flex items-center mb-2">
                  <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    AI Thinking Process
                  </span>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200">{thinking}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            {startTime && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Started {startTime.toLocaleTimeString()}
              </div>
            )}
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-1" />
              {realMode ? 'Live Mode' : 'Preview Mode'}
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalExecutionModal;