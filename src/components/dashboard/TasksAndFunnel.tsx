import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { CheckSquare, BarChart3, ChevronRight, Target } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

const TasksAndFunnel: React.FC = () => {
  const { isDark } = useTheme();

  // Sample tasks data
  const tasks = [
    { id: 1, title: 'Follow up with Microsoft', completed: false, priority: 'high', dueDate: '2h' },
    { id: 2, title: 'Prepare proposal for Ford', completed: false, priority: 'medium', dueDate: 'Today' },
    { id: 3, title: 'Call with Zenith Corp', completed: false, priority: 'low', dueDate: 'Tomorrow' },
    { id: 4, title: 'Send meeting minutes', completed: true, priority: 'medium', dueDate: 'Completed' },
  ];

  // Sample funnel data
  const funnelData = [
    { name: 'Leads', value: 120, color: '#3b82f6' },
    { name: 'Qualified', value: 80, color: '#8b5cf6' },
    { name: 'Proposals', value: 45, color: '#f59e0b' },
    { name: 'Negotiation', value: 20, color: '#10b981' },
    { name: 'Closed', value: 15, color: '#6366f1' },
  ];

  // Function to get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return isDark ? 'text-red-400 bg-red-500/20' : 'text-red-700 bg-red-100';
      case 'medium':
        return isDark ? 'text-orange-400 bg-orange-500/20' : 'text-orange-700 bg-orange-100';
      case 'low':
        return isDark ? 'text-green-400 bg-green-500/20' : 'text-green-700 bg-green-100';
      default:
        return isDark ? 'text-gray-400 bg-gray-500/20' : 'text-gray-700 bg-gray-100';
    }
  };

  // Custom tooltip for funnel chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-2 rounded shadow-md ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{payload[0].name}</p>
          <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Count: <span className="font-medium">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Tasks Card */}
      <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg mr-3 ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
              <CheckSquare className={`h-5 w-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Tasks
            </h2>
          </div>
          <button className={`text-sm flex items-center ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
            View All <ChevronRight size={16} className="ml-1" />
          </button>
        </div>

        <div className="space-y-3">
          {tasks.map(task => (
            <div key={task.id} className={`p-3 rounded-lg ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition-colors ${
              task.completed ? (isDark ? 'opacity-60' : 'opacity-70') : ''
            }`}>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => {}}
                  className={`form-checkbox h-5 w-5 rounded border-2 ${
                    isDark 
                      ? 'border-gray-600 text-purple-500' 
                      : 'border-gray-300 text-purple-600'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    task.completed 
                      ? (isDark ? 'text-gray-500 line-through' : 'text-gray-500 line-through')
                      : (isDark ? 'text-white' : 'text-gray-900')
                  }`}>
                    {task.title}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {task.dueDate}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Task Button */}
        <div className="mt-4 text-center">
          <button className={`text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
            + Add New Task
          </button>
        </div>
      </div>

      {/* Sales Funnel Card */}
      <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg mr-3 ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
              <Target className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Sales Funnel
            </h2>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={funnelData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Funnel Legend */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          {funnelData.map((entry, index) => (
            <div key={index} className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
              <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {entry.name}: {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TasksAndFunnel;