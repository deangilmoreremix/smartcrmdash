import React, { useState } from 'react';
import { useAiApi } from '../hooks/useAiApi';
import { useTheme } from '../contexts/ThemeContext';
import { useTaskStore } from '../store/taskStore';
import { CheckSquare, RefreshCw, ArrowUpDown, Sliders, AlertCircle, ArrowDown, ArrowUp } from 'lucide-react';

interface AITaskPrioritizerProps {
  onTasksReprioritized?: (tasks: any[]) => void;
  className?: string;
}

const AITaskPrioritizer: React.FC<AITaskPrioritizerProps> = ({
  onTasksReprioritized,
  className = ''
}) => {
  const { isDark } = useTheme();
  const { tasks, updateTask } = useTaskStore();
  const { prioritizeTasks, loading, error } = useAiApi();
  
  const [prioritizedTasks, setPrioritizedTasks] = useState<any[] | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [prioritizationCriteria, setPrioritizationCriteria] = useState({
    urgency: 50,
    importance: 50,
    customerValue: 50
  });
  const [reasoning, setReasoning] = useState<string[]>([]);

  const handlePrioritizeTasks = async () => {
    const tasksList = Object.values(tasks);
    
    if (tasksList.length === 0) {
      return;
    }
    
    try {
      const result = await prioritizeTasks(tasksList, {
        criteria: prioritizationCriteria
      });
      
      setPrioritizedTasks(result.prioritizedTasks);
      setReasoning(result.reasoning || []);
      
      if (onTasksReprioritized) {
        onTasksReprioritized(result.prioritizedTasks);
      }
    } catch (err) {
      console.error('Error prioritizing tasks:', err);
    }
  };

  const handleApplyPriorities = () => {
    if (!prioritizedTasks) return;
    
    // Update each task in the store with its new priority
    prioritizedTasks.forEach((task, index) => {
      const priorityLevel = index < prioritizedTasks.length / 3 ? 'high' : 
                            index < prioritizedTasks.length * 2/3 ? 'medium' : 'low';
      
      updateTask(task.id, { 
        priority: priorityLevel as 'high' | 'medium' | 'low'
      });
    });
  };

  // Function to render priority badge
  const renderPriorityBadge = (priority: number) => {
    let color;
    let text;
    
    if (priority >= 80) {
      color = isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-800';
      text = 'Critical';
    } else if (priority >= 60) {
      color = isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-800';
      text = 'High';
    } else if (priority >= 40) {
      color = isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-800';
      text = 'Medium';
    } else {
      color = isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-800';
      text = 'Low';
    }
    
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${color}`}>
        {text} ({priority})
      </span>
    );
  };

  return (
    <div className={`${className}`}>
      <div className={`p-4 rounded-lg border ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-medium flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <CheckSquare className="mr-2 h-5 w-5 text-indigo-500" />
            AI Task Prioritizer
          </h3>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <Sliders size={16} />
          </button>
        </div>
        
        {/* Settings Panel */}
        {showSettings && (
          <div className={`mb-4 p-3 rounded-lg ${
            isDark ? 'bg-gray-800 border border-white/10' : 'bg-gray-50 border border-gray-200'
          }`}>
            <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Prioritization Criteria
            </h4>
            
            <div className="space-y-4">
              {/* Urgency Slider */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Urgency
                  </label>
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {prioritizationCriteria.urgency}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={prioritizationCriteria.urgency}
                  onChange={(e) => setPrioritizationCriteria({
                    ...prioritizationCriteria,
                    urgency: parseInt(e.target.value)
                  })}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              {/* Importance Slider */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Importance
                  </label>
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {prioritizationCriteria.importance}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={prioritizationCriteria.importance}
                  onChange={(e) => setPrioritizationCriteria({
                    ...prioritizationCriteria,
                    importance: parseInt(e.target.value)
                  })}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              {/* Customer Value Slider */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Customer Value
                  </label>
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {prioritizationCriteria.customerValue}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={prioritizationCriteria.customerValue}
                  onChange={(e) => setPrioritizationCriteria({
                    ...prioritizationCriteria,
                    customerValue: parseInt(e.target.value)
                  })}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handlePrioritizeTasks}
            disabled={loading || Object.values(tasks).length === 0}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg ${
              isDark
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            } transition-colors disabled:opacity-50`}
          >
            {loading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <ArrowUpDown size={16} />
                <span>Prioritize Tasks</span>
              </>
            )}
          </button>
          
          {prioritizedTasks && (
            <button
              onClick={handleApplyPriorities}
              className={`flex items-center justify-center space-x-2 py-2 px-4 rounded-lg ${
                isDark
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              } transition-colors`}
            >
              <CheckSquare size={16} />
              <span>Apply</span>
            </button>
          )}
        </div>
        
        {/* Error Display */}
        {error && (
          <div className={`mt-4 p-3 rounded-lg ${
            isDark ? 'bg-red-900/20 border border-red-900/30 text-red-200' : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex items-start">
              <AlertCircle size={16} className="mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}
        
        {/* Results Display */}
        {prioritizedTasks && prioritizedTasks.length > 0 && (
          <div className="mt-4">
            <h4 className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Prioritized Tasks
            </h4>
            
            <div className={`rounded-lg border ${
              isDark ? 'border-white/10' : 'border-gray-200'
            } overflow-hidden`}>
              <div className={`divide-y ${
                isDark ? 'divide-white/10' : 'divide-gray-200'
              }`}>
                {prioritizedTasks.map((task, index) => (
                  <div key={index} className={`p-3 ${
                    isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                  } transition-colors`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          index === 0 ? (isDark ? 'bg-red-500/20' : 'bg-red-100') :
                          index === 1 ? (isDark ? 'bg-orange-500/20' : 'bg-orange-100') :
                          index === 2 ? (isDark ? 'bg-yellow-500/20' : 'bg-yellow-100') :
                          (isDark ? 'bg-blue-500/20' : 'bg-blue-100')
                        }`}>
                          <span className={`text-xs font-medium ${
                            index === 0 ? (isDark ? 'text-red-400' : 'text-red-600') :
                            index === 1 ? (isDark ? 'text-orange-400' : 'text-orange-600') :
                            index === 2 ? (isDark ? 'text-yellow-400' : 'text-yellow-600') :
                            (isDark ? 'text-blue-400' : 'text-blue-600')
                          }`}>
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <h5 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {task.title}
                          </h5>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {task.description?.substring(0, 60) || 'No description'}
                            {task.description?.length > 60 ? '...' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {/* Original Priority */}
                        <div className={`text-xs px-2 py-0.5 rounded-full ${
                          task.priority === 'high' ? (isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700') :
                          task.priority === 'medium' ? (isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700') :
                          (isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700')
                        }`}>
                          {task.priority}
                        </div>
                        
                        {/* Arrow */}
                        <ArrowRight size={12} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                        
                        {/* AI Priority Score */}
                        {renderPriorityBadge(task.priority_score)}
                      </div>
                    </div>
                    
                    {/* Priority Reasoning */}
                    {task.priority_reason && (
                      <p className={`mt-2 text-xs italic ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Reasoning: {task.priority_reason}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Overall Reasoning */}
            {reasoning && reasoning.length > 0 && (
              <div className={`mt-4 p-3 rounded-lg ${
                isDark ? 'bg-blue-500/10 border-blue-500/20 border' : 'bg-blue-50 border-blue-100 border'
              }`}>
                <h5 className={`text-xs font-medium mb-2 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                  AI Prioritization Logic
                </h5>
                <ul className={`text-xs space-y-1 ${isDark ? 'text-blue-200' : 'text-blue-600'}`}>
                  {reasoning.map((reason, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-1">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Arrow component for the task prioritization display
const ArrowRight: React.FC<{ size: number; className?: string }> = ({ size, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14"></path>
    <path d="m12 5 7 7-7 7"></path>
  </svg>
);

export default AITaskPrioritizer;