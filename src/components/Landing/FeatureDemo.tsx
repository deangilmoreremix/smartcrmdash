import React from 'react';
import { Brain, Users, BarChart3 } from 'lucide-react';

const FeatureDemo: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: "AI Assistant",
      description: "Your personal AI assistant that understands your sales context and helps automate tasks.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Smart Contacts",
      description: "Intelligent contact management with automated data enrichment and interaction tracking.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: BarChart3,
      title: "Predictive Analytics",
      description: "AI-powered forecasting and insights to optimize your sales strategy and performance.",
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Experience the Power of AI-Driven Sales
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how our intelligent features work together to transform your sales process
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureDemo;
