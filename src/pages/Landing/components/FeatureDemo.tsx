import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, MonitorPlay } from 'lucide-react';

interface FeatureDemoProps {
  title: string;
  description: string;
  demoType: 'video' | 'interactive' | 'static';
  demoContent?: string;
  className?: string;
}

export const FeatureDemo: React.FC<FeatureDemoProps> = ({
  title,
  description,
  demoType = 'interactive',
  demoContent,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    'Initialize the feature',
    'Configure settings',
    'Process data',
    'Generate results',
    'Display insights'
  ];

  const handlePlayDemo = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Start demo simulation
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= demoSteps.length - 1) {
            setIsPlaying(false);
            clearInterval(interval);
            return 0;
          }
          return prev + 1;
        });
      }, 1500);
    }
  };

  const resetDemo = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Demo Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePlayDemo}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isPlaying
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Play Demo</span>
                </>
              )}
            </button>
            <button
              onClick={resetDemo}
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              title="Reset Demo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Demo Content Area */}
      <div className="p-6">
        {demoType === 'interactive' && (
          <div className="space-y-6">
            {/* Demo Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Demo Progress</span>
                <span className="text-sm text-gray-500">
                  {currentStep + 1} / {demoSteps.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-blue-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Demo Steps */}
            <div className="space-y-3">
              {demoSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    index <= currentStep
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                      index < currentStep
                        ? 'bg-blue-500 text-white'
                        : index === currentStep && isPlaying
                        ? 'bg-blue-400 text-white animate-pulse'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`font-medium ${
                      index <= currentStep ? 'text-blue-700' : 'text-gray-500'
                    }`}
                  >
                    {step}
                  </span>
                  {index === currentStep && isPlaying && (
                    <motion.div
                      className="flex space-x-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" />
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce delay-100" />
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce delay-200" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Demo Visualization */}
            <div className="bg-gray-50 rounded-xl p-8 h-64 flex items-center justify-center">
              <motion.div
                className="text-center"
                key={currentStep}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
                  <MonitorPlay className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {demoSteps[currentStep]}
                </h4>
                <p className="text-gray-600">
                  {isPlaying ? 'Processing...' : 'Ready to demonstrate'}
                </p>
              </motion.div>
            </div>
          </div>
        )}

        {demoType === 'video' && (
          <div className="bg-gray-900 rounded-xl aspect-video flex items-center justify-center">
            <div className="text-center text-white">
              <MonitorPlay className="w-16 h-16 mx-auto mb-4 opacity-60" />
              <p className="text-lg">Video Demo</p>
              <p className="text-sm opacity-60">Video player would be embedded here</p>
            </div>
          </div>
        )}

        {demoType === 'static' && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 text-center">
            <MonitorPlay className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Static Demo</h4>
            <p className="text-gray-600">
              {demoContent || 'This is a static demonstration of the feature capabilities.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureDemo;
