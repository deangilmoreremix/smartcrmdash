import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useDealStore } from '../store/dealStore';
import { useContactStore } from '../store/contactStore';
import { useTaskStore } from '../store/taskStore';
import { useAppointmentStore } from '../store/appointmentStore';
import { Icon, Icons } from '../utils/icons';
import { aiTools } from '../utils/aiToolsData';

// Example updated Navbar section showing proper icon usage
// You can use this as a reference for updating the full Navbar component

const NavbarIconExample = ({ onOpenPipelineModal }) => {
  const { isDark, toggleTheme } = useTheme();
  const { navigateToTool } = useNavigation();
  const navigate = useNavigate();
  
  // Task Tools with proper icon usage
  const taskTools = [
    { name: 'Task Management', tool: 'task-management', icon: Icons.CheckSquare },
    { name: 'Task Automation', tool: 'task-automation', icon: Icons.Bot },
    { name: 'Project Tracker', tool: 'project-tracker', icon: Icons.Layers },
    { name: 'Time Tracking', tool: 'time-tracking', icon: Icons.Clock },
    { name: 'Workflow Builder', tool: 'workflow-builder', icon: Icons.Repeat },
    { name: 'Deadline Manager', tool: 'deadline-manager', icon: Icons.AlertTriangle }
  ];

  // Example of proper icon rendering in JSX
  return (
    <div className="flex items-center space-x-2">
      {/* Example of icon with size and color */}
      <button onClick={toggleTheme} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
        <Icon 
          icon={isDark ? Icons.Sun : Icons.Moon} 
          size={20} 
          className={isDark ? "text-yellow-300" : "text-gray-600"} 
        />
      </button>
      
      {/* Example dropdown with proper icon */}
      <div className="relative">
        <button className="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <Icon icon={Icons.Bell} size={20} className="text-gray-600 dark:text-gray-300" />
          <Icon icon={Icons.ChevronDown} size={14} className="text-gray-400 dark:text-gray-500" />
        </button>
      </div>

      {/* Task tool example with dynamic icon */}
      <div className="p-2">
        {taskTools.map((tool, index) => (
          <div 
            key={index}
            className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer"
            onClick={() => navigateToTool(tool.tool)}
          >
            <Icon icon={tool.icon} size={16} className="text-blue-500" />
            <span className="text-sm">{tool.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavbarIconExample;
