import React, { useState, useEffect } from 'react';
import { Target, BarChart3, TrendingUp, Check, Clock, Brain, Zap, Activity, Sparkles, Calendar, CheckSquare, ChevronRight, XCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';

interface Goal {
  id: number;
  goal_name: string;
  category: string;
  description: string;
  progress: number;
  status: 'active' | 'completed' | 'paused';
  due_date?: Date;
}

const AIGoalsPanel: React.FC = () => {
  const { isDark } = useTheme();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch goals from Supabase
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Try to fetch from Supabase
        const { data, error } = await supabase
          .from('user_goals')
          .select('*')
          .order('category');
        
        if (error) {
          throw error;
        }
        
        setGoals(data || []);
        
      } catch (err) {
        console.error('Error fetching goals:', err);
        
        // If we couldn't fetch from Supabase, use sample data
        setGoals(sampleGoals);
        
        setError('Failed to fetch goals from database. Using sample data instead.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGoals();
  }, []);

  // Get unique categories
  const categories = [...new Set(goals.map(goal => goal.category))];
  
  // Filter goals by selected category
  const filteredGoals = selectedCategory 
    ? goals.filter(goal => goal.category === selectedCategory) 
    : goals;
  
  // Calculate overall progress
  const overallProgress = goals.length 
    ? goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length 
    : 0;

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Sales':
        return <BarChart3 className={`h-5 w-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />;
      case 'Marketing':
        return <Activity className={`h-5 w-5 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />;
      case 'Operations':
        return <Zap className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />;
      case 'Customer Service':
        return <CheckSquare className={`h-5 w-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />;
      case 'Product Development':
        return <Sparkles className={`h-5 w-5 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />;
      case 'Analytics':
        return <TrendingUp className={`h-5 w-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />;
      case 'General':
      default:
        return <Target className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />;
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700';
      case 'active':
        return isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700';
      case 'paused':
        return isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700';
      default:
        return isDark ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-xl shadow-md border ${isDark ? 'border-gray-800' : 'border-gray-200'} overflow-hidden`}>
      {/* Header */}
      <div className={`p-5 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
              <Target className={`h-5 w-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <div>
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>AI Goals</h2>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Track your AI-powered business objectives
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`py-1 px-3 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'} flex items-center space-x-1`}>
              <Brain className={`h-4 w-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {Math.round(overallProgress)}% complete
              </span>
            </div>
            
            <div className={`py-1 px-3 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {goals.length} goals
              </span>
            </div>
          </div>
        </div>
        
        {/* Category Pills */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === null
                ? (isDark ? 'bg-white text-gray-900' : 'bg-gray-900 text-white')
                : (isDark ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-600 hover:text-gray-900')
            }`}
          >
            All
          </button>
          
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center space-x-1 ${
                category === selectedCategory
                  ? (isDark ? 'bg-white text-gray-900' : 'bg-gray-900 text-white')
                  : (isDark ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-600 hover:text-gray-900')
              }`}
            >
              {getCategoryIcon(category)}
              <span>{category}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="p-6 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-t-2 border-purple-500"></div>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className={`m-4 p-3 rounded-lg ${isDark ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-red-50 text-red-600 border border-red-100'}`}>
          <div className="flex items-center space-x-2">
            <XCircle className="h-5 w-5" />
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
      
      {/* Goals List */}
      {!isLoading && filteredGoals.length > 0 ? (
        <div className={`divide-y ${isDark ? 'divide-gray-800' : 'divide-gray-200'}`}>
          {filteredGoals.map((goal) => (
            <div key={goal.id} className={`p-4 ${isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'} transition-colors cursor-pointer`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getCategoryIcon(goal.category)}
                  <div>
                    <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{goal.goal_name}</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{goal.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(goal.status)}`}>
                    {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                  </span>
                  
                  <ChevronRight className={`h-4 w-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <div className={`w-full h-2 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                    <div
                      className={`h-full rounded-full ${
                        goal.progress >= 100 
                          ? (isDark ? 'bg-green-500' : 'bg-green-500')
                          : (isDark ? 'bg-purple-500' : 'bg-purple-500')
                      } transition-all duration-500`}
                      style={{ width: `${Math.min(100, goal.progress)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {goal.progress}%
                  </span>
                  
                  {goal.due_date && (
                    <span className={`text-xs flex items-center space-x-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Clock className="h-3 w-3" />
                      <span>{new Date(goal.due_date).toLocaleDateString()}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !isLoading ? (
        <div className="p-10 text-center">
          <Target className={`h-12 w-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-2`}>No goals found</p>
          <button className={`px-4 py-2 rounded-lg ${isDark ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-600 hover:bg-purple-700'} text-white transition-colors`}>
            Add Your First Goal
          </button>
        </div>
      ) : null}
    </div>
  );
};

// Sample goals data (used as fallback if database fetch fails)
const sampleGoals: Goal[] = [
  {
    id: 1,
    goal_name: "Increase Lead Conversion Rate",
    category: "Sales",
    description: "Use AI to improve lead scoring and qualification",
    progress: 65,
    status: "active"
  },
  {
    id: 2,
    goal_name: "Automate Email Follow-ups",
    category: "Marketing",
    description: "Implement AI email response system",
    progress: 40,
    status: "active",
    due_date: new Date('2023-12-31')
  },
  {
    id: 3,
    goal_name: "Optimize Sales Calls",
    category: "Sales",
    description: "Use AI to analyze call patterns and improve closing rates",
    progress: 25,
    status: "active"
  },
  {
    id: 4,
    goal_name: "Customer Churn Prediction",
    category: "Analytics",
    description: "Implement AI model to predict customer churn",
    progress: 90,
    status: "active",
    due_date: new Date('2023-11-15')
  },
  {
    id: 5,
    goal_name: "Content Generation System",
    category: "Marketing",
    description: "Create AI-driven personalized content creation",
    progress: 100,
    status: "completed"
  },
  {
    id: 6,
    goal_name: "Pipeline Health Monitoring",
    category: "Sales",
    description: "Use AI to monitor and identify pipeline issues",
    progress: 75,
    status: "active",
    due_date: new Date('2023-12-01')
  },
  {
    id: 7,
    goal_name: "Sentiment Analysis Implementation",
    category: "Customer Service",
    description: "Analyze customer feedback with AI",
    progress: 50,
    status: "paused"
  }
];

export default AIGoalsPanel;