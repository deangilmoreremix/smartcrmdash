import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Zap, 
  BarChart3, 
  Users, 
  MessageSquare, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Play
} from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  details: string[];
}

const features: Feature[] = [
  {
    id: 'ai-assistant',
    title: 'AI-Powered Assistant',
    description: 'Intelligent automation that learns from your workflow',
    icon: <Bot className="w-8 h-8" />,
    color: 'text-blue-600',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-indigo-600',
    details: [
      'Natural language processing',
      'Predictive analytics',
      'Automated task scheduling',
      'Smart recommendations'
    ]
  },
  {
    id: 'analytics',
    title: 'Advanced Analytics',
    description: 'Deep insights into your business performance',
    icon: <BarChart3 className="w-8 h-8" />,
    color: 'text-purple-600',
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-pink-600',
    details: [
      'Real-time dashboards',
      'Custom reporting',
      'Trend analysis',
      'Performance metrics'
    ]
  },
  {
    id: 'team-collaboration',
    title: 'Team Collaboration',
    description: 'Seamless teamwork with built-in communication tools',
    icon: <Users className="w-8 h-8" />,
    color: 'text-green-600',
    gradientFrom: 'from-green-500',
    gradientTo: 'to-emerald-600',
    details: [
      'Team chat integration',
      'Shared workspaces',
      'Role-based permissions',
      'Activity tracking'
    ]
  },
  {
    id: 'automation',
    title: 'Smart Automation',
    description: 'Automate repetitive tasks and focus on what matters',
    icon: <Zap className="w-8 h-8" />,
    color: 'text-yellow-600',
    gradientFrom: 'from-yellow-500',
    gradientTo: 'to-orange-600',
    details: [
      'Workflow automation',
      'Smart triggers',
      'Email sequences',
      'Lead scoring'
    ]
  }
];

export const DynamicFeatureShowcase: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextFeature = () => {
    setActiveFeature((prev) => (prev + 1) % features.length);
    setIsAutoPlaying(false);
  };

  const prevFeature = () => {
    setActiveFeature((prev) => (prev - 1 + features.length) % features.length);
    setIsAutoPlaying(false);
  };

  const currentFeature = features[activeFeature];

  return (
    <div className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Experience the Future of CRM
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Discover how our innovative features transform the way you manage relationships and grow your business
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Feature Navigation */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-semibold text-gray-900">Features</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className={`p-2 rounded-lg transition-colors ${
                    isAutoPlaying 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Play className={`w-4 h-4 ${isAutoPlaying ? '' : 'opacity-50'}`} />
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={prevFeature}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextFeature}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                  index === activeFeature
                    ? 'bg-white shadow-lg border-2 border-blue-200'
                    : 'bg-gray-50 hover:bg-white hover:shadow-md border-2 border-transparent'
                }`}
                onClick={() => {
                  setActiveFeature(index);
                  setIsAutoPlaying(false);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.gradientFrom} ${feature.gradientTo}`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                    {index === activeFeature && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4"
                      >
                        <ul className="space-y-2">
                          {feature.details.map((detail, detailIndex) => (
                            <motion.li
                              key={detailIndex}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: detailIndex * 0.1 }}
                              className="flex items-center text-sm text-gray-700"
                            >
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3" />
                              {detail}
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Feature Demo Area */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-2xl p-8 border"
              >
                <div className={`p-4 rounded-xl bg-gradient-to-r ${currentFeature.gradientFrom} ${currentFeature.gradientTo} mb-6`}>
                  <div className="text-white text-center">
                    {currentFeature.icon}
                    <h3 className="text-2xl font-bold mt-2">{currentFeature.title}</h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-lg text-gray-700 mb-6">{currentFeature.description}</p>
                  
                  {/* Interactive Demo Placeholder */}
                  <div className="bg-gray-50 rounded-xl p-6 h-64 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-center"
                    >
                      <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${currentFeature.gradientFrom} ${currentFeature.gradientTo} mb-4`}>
                        <div className="text-white">
                          {currentFeature.icon}
                        </div>
                      </div>
                      <p className="text-gray-600">Interactive demo coming soon</p>
                    </motion.div>
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="flex space-x-2 mt-6 justify-center">
                  {features.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        index === activeFeature 
                          ? 'w-8 bg-blue-500' 
                          : 'w-2 bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicFeatureShowcase;
