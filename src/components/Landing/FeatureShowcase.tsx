import React from 'react';
import { Brain, Users, BarChart3, Zap, MessageSquare, Target } from 'lucide-react';

const FeatureShowcase: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Get intelligent recommendations and predictions to optimize your sales strategy."
    },
    {
      icon: Users,
      title: "Contact Management",
      description: "Organize and manage all your contacts with smart categorization and tracking."
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive reporting and analytics to track your sales performance."
    },
    {
      icon: Zap,
      title: "Workflow Automation",
      description: "Automate repetitive tasks and streamline your sales processes."
    },
    {
      icon: MessageSquare,
      title: "Communication Hub",
      description: "Integrated communication tools for seamless customer interactions."
    },
    {
      icon: Target,
      title: "Lead Scoring",
      description: "AI-driven lead scoring to prioritize your most promising prospects."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Modern Sales
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to accelerate your sales process and drive revenue growth
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
