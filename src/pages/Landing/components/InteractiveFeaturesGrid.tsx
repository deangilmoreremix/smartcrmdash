import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Zap, 
  BarChart3, 
  Users, 
  MessageSquare, 
  Calendar,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp
} from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  benefits: string[];
  stats: {
    label: string;
    value: string;
  };
  color: string;
  bgGradient: string;
}

const features: Feature[] = [
  {
    id: 'ai-assistant',
    title: 'AI-Powered Assistant',
    description: 'Intelligent automation that learns from your workflow and suggests optimal actions.',
    icon: <Bot className="w-6 h-6" />,
    category: 'AI & Automation',
    benefits: [
      'Reduce manual tasks by 70%',
      'Smart lead scoring',
      'Automated follow-ups',
      'Predictive analytics'
    ],
    stats: {
      label: 'Time Saved',
      value: '15+ hrs/week'
    },
    color: 'text-blue-600',
    bgGradient: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'analytics',
    title: 'Advanced Analytics',
    description: 'Real-time insights and customizable dashboards to track your business performance.',
    icon: <BarChart3 className="w-6 h-6" />,
    category: 'Analytics & Reporting',
    benefits: [
      'Real-time dashboards',
      'Custom KPI tracking',
      'Trend analysis',
      'ROI measurement'
    ],
    stats: {
      label: 'Revenue Increase',
      value: '25% avg'
    },
    color: 'text-purple-600',
    bgGradient: 'from-purple-500 to-pink-600'
  },
  {
    id: 'collaboration',
    title: 'Team Collaboration',
    description: 'Seamless teamwork with shared workspaces and real-time communication tools.',
    icon: <Users className="w-6 h-6" />,
    category: 'Team & Communication',
    benefits: [
      'Shared team workspace',
      'Real-time chat',
      'Task assignments',
      'Progress tracking'
    ],
    stats: {
      label: 'Team Efficiency',
      value: '40% boost'
    },
    color: 'text-green-600',
    bgGradient: 'from-green-500 to-emerald-600'
  },
  {
    id: 'automation',
    title: 'Smart Automation',
    description: 'Automate repetitive tasks and workflows to focus on high-value activities.',
    icon: <Zap className="w-6 h-6" />,
    category: 'Workflow Automation',
    benefits: [
      'Workflow automation',
      'Email sequences',
      'Lead nurturing',
      'Task scheduling'
    ],
    stats: {
      label: 'Tasks Automated',
      value: '80%+'
    },
    color: 'text-yellow-600',
    bgGradient: 'from-yellow-500 to-orange-600'
  },
  {
    id: 'communication',
    title: 'Unified Communication',
    description: 'All your communication channels in one place for better customer engagement.',
    icon: <MessageSquare className="w-6 h-6" />,
    category: 'Customer Engagement',
    benefits: [
      'Multi-channel messaging',
      'Email integration',
      'SMS campaigns',
      'Social media sync'
    ],
    stats: {
      label: 'Response Time',
      value: '50% faster'
    },
    color: 'text-indigo-600',
    bgGradient: 'from-indigo-500 to-blue-600'
  },
  {
    id: 'scheduling',
    title: 'Smart Scheduling',
    description: 'Intelligent calendar management with automated appointment booking and reminders.',
    icon: <Calendar className="w-6 h-6" />,
    category: 'Time Management',
    benefits: [
      'Automated booking',
      'Calendar sync',
      'Reminder system',
      'Availability management'
    ],
    stats: {
      label: 'No-shows Reduced',
      value: '60%'
    },
    color: 'text-rose-600',
    bgGradient: 'from-rose-500 to-pink-600'
  }
];

export const InteractiveFeaturesGrid: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  return (
    <div className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4"
          >
            <Star className="w-4 h-4 mr-2" />
            Interactive Features
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Explore Our Powerful Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Discover how each feature can transform your business. Click on any feature to see detailed benefits and real-world impact.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              className="relative group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredFeature(feature.id)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div
                className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
                  activeFeature === feature.id
                    ? 'border-blue-500 shadow-xl scale-105'
                    : hoveredFeature === feature.id
                    ? 'border-blue-300 shadow-xl'
                    : 'border-gray-200 hover:shadow-lg'
                }`}
                onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
              >
                {/* Feature Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.bgGradient}`}>
                      <div className="text-white">
                        {feature.icon}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 uppercase tracking-wide">
                        {feature.category}
                      </div>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                        <span className="text-sm font-semibold text-green-600">
                          {feature.stats.value}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {feature.stats.label}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm font-medium text-blue-600">
                      Learn more
                    </span>
                    <ArrowRight className={`w-4 h-4 text-blue-600 transition-transform duration-300 ${
                      hoveredFeature === feature.id ? 'translate-x-1' : ''
                    }`} />
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {activeFeature === feature.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-200 bg-gray-50"
                    >
                      <div className="p-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Key Benefits:</h4>
                        <ul className="space-y-2">
                          {feature.benefits.map((benefit, benefitIndex) => (
                            <motion.li
                              key={benefitIndex}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: benefitIndex * 0.1 }}
                              className="flex items-center text-sm text-gray-700"
                            >
                              <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                              {benefit}
                            </motion.li>
                          ))}
                        </ul>

                        <motion.button
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className={`mt-4 w-full px-4 py-2 bg-gradient-to-r ${feature.bgGradient} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300`}
                        >
                          Try This Feature
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Hover Effect Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.bgGradient} opacity-0 transition-opacity duration-300 ${
                  hoveredFeature === feature.id ? 'opacity-5' : ''
                }`} />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-6">
            Ready to experience these features in action?
          </p>
          <button className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300">
            Start Free Trial
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default InteractiveFeaturesGrid;
