import React from 'react';
import { Brain, Users, BarChart3 } from 'lucide-react';

const InteractiveFeaturesGrid: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analytics",
      description: "Advanced machine learning algorithms analyze your sales data to provide actionable insights and predictive forecasting.",
      gradient: "from-blue-500 to-cyan-500",
      delay: 0
    },
    {
      icon: BarChart3,
      title: "Real-Time Dashboard",
      description: "Monitor KPIs, track performance metrics, and visualize data with customizable, interactive dashboards.",
      gradient: "from-green-500 to-emerald-500",
      delay: 0.2
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamless collaboration tools that keep your entire sales team aligned and productive.",
      gradient: "from-orange-500 to-red-500",
      delay: 0.3
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
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
              className="group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
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

export default InteractiveFeaturesGrid;
