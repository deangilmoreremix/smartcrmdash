import React, { useState } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductDemo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState(0);

  const demos = [
    {
      title: "AI-Powered Dashboard",
      description: "Experience our intelligent dashboard with real-time insights"
    },
    {
      title: "Smart Contact Management",
      description: "Organize and track contacts with AI assistance"
    },
    {
      title: "Pipeline Visualization",
      description: "Visual pipeline management with predictive analytics"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-4 transition-all duration-300">
            <Play className="w-12 h-12 text-white" />
          </button>
        </div>
        
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black bg-opacity-50 rounded-lg p-4 text-white">
            <h3 className="font-semibold mb-1">{demos[activeDemo].title}</h3>
            <p className="text-sm opacity-90">{demos[activeDemo].description}</p>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 flex gap-2">
          <button 
            onClick={() => setActiveDemo(prev => prev > 0 ? prev - 1 : demos.length - 1)}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button 
            onClick={() => setActiveDemo(prev => prev < demos.length - 1 ? prev + 1 : 0)}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDemo;
