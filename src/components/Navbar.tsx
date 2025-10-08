import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon, Icons } from '../utils/icons';
import { User, X, Menu, Sun, Moon } from 'lucide-react';
import { aiTools } from '../utils/aiToolsData';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useDealStore } from '../store/dealStore';
import { useContactStore } from '../store/contactStore';
import { useTaskStore } from '../store/taskStore';
import { useAppointmentStore } from '../store/appointmentStore';

interface NavbarProps {
  onOpenPipelineModal?: () => void;
}

// Memoize Navbar to prevent unnecessary re-renders
const Navbar: React.FC<NavbarProps> = React.memo(({ onOpenPipelineModal }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { navigateToTool } = useNavigation();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data for dynamic counters
  const { deals } = useDealStore();
  const { contacts } = useContactStore();
  const { tasks } = useTaskStore();
  const { appointments } = useAppointmentStore();

  // Import the utility function at the top level to use here
  const isDealNotInStages = (deal: any, stageIds: string[]): boolean => {
    if (deal.stage && typeof deal.stage === 'object' && 'id' in deal.stage) {
      return !stageIds.includes(deal.stage.id);
    }
    // @ts-ignore - Fallback for runtime safety
    return !stageIds.includes(deal.stage || '');
  };

  // Use useMemo to calculate counters and prevent recalculation on every render
  const counters = React.useMemo(() => {
    const activeDeals = Object.values(deals).filter(deal =>
      isDealNotInStages(deal, ['closed-won', 'closed-lost'])
    ).length;
    
    const hotContacts = Object.values(contacts).filter(contact => 
      contact.status === 'hot'
    ).length;
    
    const pendingTasks = Object.values(tasks).filter(task => 
      !task.completed
    ).length;
    
    const todayAppointments = Object.values(appointments).filter(apt => {
      if (!apt.startTime) return false;
      const today = new Date();
      const aptDate = new Date(apt.startTime);
      return aptDate.toDateString() === today.toDateString() && apt.status === 'scheduled';
    }).length;

    return {
      activeDeals,
      hotContacts,
      pendingTasks,
      todayAppointments,
      totalNotifications: hotContacts + pendingTasks + todayAppointments
    };
  }, [deals, contacts, tasks, appointments]);

  // Tasks dropdown tools
  const taskTools = [
    { name: 'Task Management', tool: 'task-management', iconName: 'check-square' },
    { name: 'Task Automation', tool: 'task-automation', iconName: 'bot' },
    { name: 'Project Tracker', tool: 'project-tracker', iconName: 'layers' },
    { name: 'Time Tracking', tool: 'time-tracking', iconName: 'clock' },
    { name: 'Workflow Builder', tool: 'workflow-builder', iconName: 'repeat' },
    { name: 'Deadline Manager', tool: 'deadline-manager', iconName: 'alert-triangle' }
  ];

  // Sales dropdown tools
  const salesTools = [
    { name: 'Sales Tools', tool: 'sales-tools', iconName: 'dollar-sign' },
    { name: 'Lead Automation', tool: 'lead-automation', iconName: 'bot' },
    { name: 'Circle Prospecting', tool: 'circle-prospecting', iconName: 'target' },
    { name: 'Appointments', tool: 'appointments', iconName: 'calendar' },
    { name: 'Phone System', tool: 'phone-system', iconName: 'phone' },
    { name: 'Invoicing', tool: 'invoicing', iconName: 'receipt' },
    { name: 'Sales Analytics', tool: 'sales-analytics', iconName: 'trending-up' },
    { name: 'Deal Pipeline', tool: 'deal-pipeline', iconName: 'briefcase' },
    { name: 'Quote Builder', tool: 'quote-builder', iconName: 'file-text' },
    { name: 'Commission Tracker', tool: 'commission-tracker', iconName: 'pie-chart' },
    { name: 'Follow-up Reminders', tool: 'follow-up-reminders', iconName: 'bell' },
    { name: 'Territory Management', tool: 'territory-management', iconName: 'globe' }
  ];

  // Communication dropdown tools - Enhanced with SDRButtons features
  const communicationTools = [
    { name: 'Video Email', tool: 'video-email', iconName: 'video' },
    { name: 'Text Messages', tool: 'text-messages', iconName: 'message-square' },
    { name: 'Email Composer', tool: 'email-composer', iconName: 'mail' },
    { name: 'Campaigns', tool: 'campaigns', iconName: 'megaphone' },
    // Enhanced SDRButtons Communication Features
    { name: 'Group Calls', tool: 'group-calls', iconName: 'users' },
    { name: 'Call Recording', tool: 'call-recording', iconName: 'mic' },
    { name: 'In-Call Messaging', tool: 'in-call-messaging', iconName: 'message-circle' },
    { name: 'Call Analytics', tool: 'call-analytics', iconName: 'bar-chart-3' },
    { name: 'Connection Quality Monitor', tool: 'connection-quality', iconName: 'activity' }
  ];

  // Content dropdown tools
  const contentTools = [
    { name: 'Content Library', tool: 'content-library', iconName: 'book-open' },
    { name: 'Voice Profiles', tool: 'voice-profiles', iconName: 'mic' },
    { name: 'Business Analysis', tool: 'business-analysis', iconName: 'bar-chart-3' },
    { name: 'Image Generator', tool: 'image-generator', iconName: 'camera' },
    { name: 'Forms', tool: 'forms', iconName: 'file-text' },
    { name: 'AI Model Demo', tool: 'ai-model-demo', iconName: 'brain' }
  ];

  // Connected apps
  const connectedApps = [
    { name: 'FunnelCraft AI', url: 'https://funnelcraft-ai.videoremix.io/', iconName: 'megaphone', isExternal: true },
    { name: 'SmartCRM Closer', url: 'https://smartcrm-closer.videoremix.io', iconName: 'users', isExternal: true },
    { name: 'ContentAI', url: 'https://content-ai.videoremix.io', iconName: 'file-text', isExternal: true },
    { name: 'Mobile View', url: '/mobile', iconName: 'camera', isExternal: false },
    { name: 'White-Label Customization', url: '/white-label', iconName: 'palette', isExternal: false }
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Don't close if clicking on a dropdown toggle button
      if ((e.target as HTMLElement).closest('[data-dropdown-toggle]')) {
        return;
      }
      setActiveDropdown(null);
      setIsMobileMenuOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Use useCallback to prevent recreation on every render
  const toggleDropdown = useCallback((dropdown: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  }, [activeDropdown]);

  // Optimize navigation handler with useCallback
  const handleNavigation = useCallback((route: string, tabName: string) => {
    navigate(route);
    setActiveTab(tabName);
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  }, [navigate]);

  // Enhanced click handler using centralized navigation
  const handleAIToolClick = useCallback((toolName: string) => {
    // Special case for deal pipeline which should open the modal directly
    if (toolName === 'deal-pipeline') {
      onOpenPipelineModal?.();
    } else {
      // Use the centralized navigation system
      navigateToTool(toolName);
    }
    
    // Close menus after navigation
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  }, [navigateToTool, onOpenPipelineModal]);

  // Update active tab based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/dashboard') setActiveTab('dashboard');
    else if (path === '/contacts') setActiveTab('contacts');
    else if (path === '/pipeline') setActiveTab('pipeline');
    else if (path === '/tasks') setActiveTab('tasks');
    else if (path === '/ai-tools') setActiveTab('ai-tools');
    else if (path === '/appointments') setActiveTab('appointments');
    else setActiveTab('');
  }, [location.pathname]);

  // AI tools are imported at the top of the file from utils/aiToolsData

  // Main navigation tabs
  const mainTabs = [
    {
      id: 'dashboard',
      label: '',
      icon: Menu,
      iconName: 'menu',
      action: () => handleNavigation('/dashboard', 'dashboard'),
      badge: null,
      color: 'from-blue-500 to-green-500'
    },
    {
      id: 'contacts',
      label: 'Contacts',
      iconName: 'users',
      action: () => handleNavigation('/contacts', 'contacts'),
      badge: 1,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'pipeline',
      label: 'Pipeline',
      iconName: 'briefcase',
      action: () => {
        onOpenPipelineModal?.();
        setActiveTab('pipeline');
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
      },
      badge: counters.activeDeals,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      iconName: 'bar-chart-3',
      action: () => handleNavigation('/analytics', 'analytics'),
      badge: null,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'ai-goals',
      label: 'AI Goals',
      iconName: 'target',
      action: () => handleNavigation('/ai-goals', 'ai-goals'),
      badge: 58,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'ai-tools',
      label: 'AI Tools',
      iconName: 'brain',
      action: () => handleNavigation('/ai-tools', 'ai-tools'),
      badge: aiTools.length,
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'appointments',
      label: 'Calendar',
      iconName: 'calendar',
      action: () => handleNavigation('/appointments', 'appointments'),
      badge: 1,
      color: 'from-cyan-500 to-blue-500'
    }
  ];

  // Dropdown menu configurations
  const dropdownMenus = [
    {
      id: 'sales',
      label: 'Sales',
      iconName: 'dollar-sign',
      badge: salesTools.length,
      color: 'from-green-500 to-teal-500',
      badgeColor: 'bg-green-500'
    },
    {
      id: 'tasks',
      label: 'Tasks',
      iconName: 'check-square',
      badge: taskTools.length,
      color: 'from-orange-500 to-red-500',
      badgeColor: 'bg-orange-500'
    },
    {
      id: 'communication',
      label: 'Comm',
      iconName: 'message-square',
      badge: communicationTools.length,
      color: 'from-blue-500 to-sky-500',
      badgeColor: 'bg-blue-500'
    },
    {
      id: 'content',
      label: 'Content',
      iconName: 'edit-3',
      badge: contentTools.length,
      color: 'from-amber-500 to-orange-500',
      badgeColor: 'bg-amber-500'
    },
    {
      id: 'apps',
      label: 'Apps',
      iconName: 'grid-3x3',
      badge: connectedApps.length,
      color: 'from-purple-500 to-violet-500',
      badgeColor: 'bg-purple-500'
    },
    {
      id: 'ai-categories',
      label: 'AI',
      iconName: 'brain',
      badge: 31,
      color: 'from-pink-500 to-rose-500',
      badgeColor: 'bg-pink-500'
    }
  ];

  // Optimize badge rendering with useCallback
  const renderBadge = useCallback((count: number | null, color: string = 'bg-red-500') => {
    if (!count || count === 0) return null;
    
    return (
      <div className={`absolute -top-1 -right-1 ${color} text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 animate-pulse shadow-lg`}>
        {count > 99 ? '99+' : count}
      </div>
    );
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4">
      {/* Main Navigation Container */}
      <div className="max-w-7xl mx-auto will-change-transform">
        <div className={`${isDark ? 'bg-gray-900/95 border-white/20' : 'bg-white/95 border-gray-200'} backdrop-blur-xl border rounded-full shadow-2xl transition-all duration-500 hover:shadow-3xl ring-1 ${isDark ? 'ring-white/10' : 'ring-gray-100'}`}>
          <div className="flex items-center justify-between px-4 py-2">
            
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <Icon icon={Icons.Sparkles} className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="hidden md:block">
                <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Smart<span className="text-green-400">CRM</span>
                </h1>
              </div>
            </div>

            {/* Desktop Navigation Pills */}
            <div className="hidden lg:flex items-center space-x-1">
              {mainTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                
                return (
                  <div key={tab.id} className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        tab.action();
                      }}
                      className={`
                        relative flex items-center space-x-1 px-2 py-1.5 rounded-full 
                        transition-all duration-300 transform hover:scale-105
                        ${isActive 
                          ? `bg-gradient-to-r ${tab.color} text-white shadow-lg ring-2 ring-white/20` 
                          : `${isDark 
                              ? 'text-white hover:bg-white/20 hover:text-white' 
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`
                        }
                        group
                      `}
                      title={tab.label}
                    >
                      <Icon 
                        name={tab.iconName} 
                        size={14} 
                        className={`transition-transform duration-300 ${
                          isActive ? 'scale-110' : 'group-hover:scale-110'
                        }`} 
                      />
                      <span className="text-xs font-medium">{tab.label}</span>
                      
                      {/* Dynamic Badge */}
                      {tab.badge && renderBadge(
                        tab.badge, 
                        tab.id === 'pipeline' ? 'bg-green-500' :
                        tab.id === 'contacts' ? 'bg-purple-500' :
                        tab.id === 'ai-goals' ? 'bg-orange-500' :
                        tab.id === 'ai-tools' ? 'bg-pink-500' :
                        tab.id === 'appointments' ? 'bg-cyan-500' :
                        'bg-blue-500'
                      )}

                      {/* Active Tab Glow Effect */}
                      {isActive && (
                        <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-full opacity-20 animate-pulse`}></div>
                      )}
                    </button>
                  </div>
                );
              })}

              {/* Dropdown Menu Items */}
              {dropdownMenus.map((menu) => (
                <div key={menu.id} className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown(menu.id, e);
                    }}
                    data-dropdown-toggle="true"
                    className={`
                      relative flex items-center space-x-1 px-2 py-1.5 rounded-full 
                      transition-all duration-300 transform hover:scale-105
                      ${activeDropdown === menu.id 
                        ? `bg-gradient-to-r ${menu.color} text-white shadow-lg ring-2 ring-white/20` 
                        : `${isDark 
                            ? 'text-white hover:bg-white/20 hover:text-white' 
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`
                      }
                      group
                    `}
                  >
                    <Icon name={menu.iconName} size={14} className="transition-transform duration-300 group-hover:scale-110" />
                    <span className="text-xs font-medium">{menu.label}</span>
                    <Icon name="chevron-down"
                      size={12} 
                      className={`transition-transform duration-300 ${
                        activeDropdown === menu.id ? 'rotate-180' : ''
                      }`} 
                    />
                    
                    {/* Badge */}
                    {renderBadge(menu.badge, menu.badgeColor)}

                    {/* Active Dropdown Glow Effect */}
                    {activeDropdown === menu.id && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${menu.color} rounded-full opacity-20 animate-pulse`}></div>
                    )}
                  </button>

                  {/* Sales Dropdown */}
                  {menu.id === 'sales' && activeDropdown === 'sales' && (
                    <div className={`absolute top-14 right-0 w-64 ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-2xl border ${isDark ? 'border-white/10' : 'border-gray-200'} rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in`}>
                      <div className="p-3">
                        {salesTools.map((tool, index) => (
                          <button
                            key={index}
                            onClick={() => handleAIToolClick(tool.tool)}
                            className={`w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${isDark ? 'hover:bg-white/5 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}`}
                          >
                            <Icon name={tool.iconName} size={16} className="text-green-500" />
                            <span className="text-sm font-medium">{tool.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tasks Dropdown */}
                  {menu.id === 'tasks' && activeDropdown === 'tasks' && (
                    <div className={`absolute top-14 right-0 w-64 ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-2xl border ${isDark ? 'border-white/10' : 'border-gray-200'} rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in`}>
                      <div className="p-3">
                        {taskTools.map((tool, index) => (
                          <button
                            key={index}
                            onClick={() => handleAIToolClick(tool.tool)}
                            className={`w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${isDark ? 'hover:bg-white/5 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}`}
                          >
                            <Icon name={tool.iconName} size={16} className="text-orange-500" />
                            <span className="text-sm font-medium">{tool.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Communication Dropdown */}
                  {menu.id === 'communication' && activeDropdown === 'communication' && (
                    <div className={`absolute top-14 right-0 w-64 ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-2xl border ${isDark ? 'border-white/10' : 'border-gray-200'} rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in`}>
                      <div className="p-3">
                        {communicationTools.map((tool, index) => (
                          <button
                            key={index}
                            onClick={() => handleAIToolClick(tool.tool)}
                            className={`w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${isDark ? 'hover:bg-white/5 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}`}
                          >
                            <Icon name={tool.iconName} size={16} className="text-blue-500" />
                            <span className="text-sm font-medium">{tool.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Content Dropdown */}
                  {menu.id === 'content' && activeDropdown === 'content' && (
                    <div className={`absolute top-14 right-0 w-64 ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-2xl border ${isDark ? 'border-white/10' : 'border-gray-200'} rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in`}>
                      <div className="p-3">
                        {contentTools.map((tool, index) => (
                          <button
                            key={index}
                            onClick={() => handleAIToolClick(tool.tool)}
                            className={`w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${isDark ? 'hover:bg-white/5 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}`}
                          >
                            <Icon name={tool.iconName} size={16} className="text-amber-500" />
                            <span className="text-sm font-medium">{tool.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Categories Dropdown */}
                  {menu.id === 'ai-categories' && activeDropdown === 'ai-categories' && (
                    <div className={`absolute top-14 right-0 w-72 ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-2xl border ${isDark ? 'border-white/10' : 'border-gray-200'} rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in`}>
                      <div className="p-3">
                        <div className="mb-3">
                          <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                            AI Tool Categories
                          </h3>
                        </div>
                        
                        {/* Core AI Tools */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              Core AI Tools
                            </span>
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                              {aiTools.filter(tool => tool.category === 'Core AI Tools').length}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            {aiTools.filter(tool => tool.category === 'Core AI Tools').slice(0, 4).map((tool, index) => (
                              <button
                                key={index}
                                onClick={() => handleAIToolClick(tool.tool)}
                                className={`text-left flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 ${isDark ? 'hover:bg-white/5 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}`}
                              >
                                <tool.icon className="w-3 h-3 text-blue-500" />
                                <span className="text-xs">{tool.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Communication Tools */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              Communication
                            </span>
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                              {aiTools.filter(tool => tool.category === 'Communication').length}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            {aiTools.filter(tool => tool.category === 'Communication').map((tool, index) => (
                              <button
                                key={index}
                                onClick={() => handleAIToolClick(tool.tool)}
                                className={`text-left flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 ${isDark ? 'hover:bg-white/5 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}`}
                              >
                                <tool.icon className="w-3 h-3 text-green-500" />
                                <span className="text-xs">{tool.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Real-time Features */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              Real-time Features
                            </span>
                            <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                              {aiTools.filter(tool => tool.category === 'Real-time Features').length}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            {aiTools.filter(tool => tool.category === 'Real-time Features').slice(0, 4).map((tool, index) => (
                              <button
                                key={index}
                                onClick={() => handleAIToolClick(tool.tool)}
                                className={`text-left flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 ${isDark ? 'hover:bg-white/5 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}`}
                              >
                                <tool.icon className="w-3 h-3 text-purple-500" />
                                <span className="text-xs">{tool.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* View All AI Tools Button */}
                        <button
                          onClick={() => handleNavigation('/ai-tools', 'ai-tools')}
                          className={`w-full mt-3 py-2 px-4 rounded-lg border-2 border-dashed transition-all duration-200 ${isDark ? 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white' : 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-900'}`}
                        >
                          <span className="text-sm font-medium">View All {aiTools.length} AI Tools</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Connected Apps Dropdown */}
                  {menu.id === 'apps' && activeDropdown === 'apps' && (
                    <div className={`absolute top-14 right-0 w-72 ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-2xl border ${isDark ? 'border-white/10' : 'border-gray-200'} rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in`}>
                      <div className="p-3">
                        {connectedApps.map((app, index) => (
                          app.isExternal ? (
                            <a
                              key={index}
                              href={app.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`w-full text-left flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${isDark ? 'hover:bg-white/5 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}`}
                            >
                              <div className="flex items-center space-x-3">
                                <Icon name={app.iconName} size={16} className="text-purple-500" />
                                <span className="text-sm font-medium">{app.name}</span>
                              </div>
                              <Icon name="external-link" size={12} className="opacity-50" />
                            </a>
                          ) : (
                            <button
                              key={index}
                              onClick={() => handleNavigation(app.url, 'white-label')}
                              className={`w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${isDark ? 'hover:bg-white/5 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}`}
                            >
                              <Icon name={app.iconName} size={16} className="text-purple-500" />
                              <span className="text-sm font-medium">{app.name}</span>
                            </button>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                {isMobileMenuOpen ? <Icon name="x" size={20} /> : <Icon name="menu" size={20} />}
              </button>
            </div>

            {/* Right Side Controls */}
            <div className="hidden lg:flex items-center space-x-2">
              {/* Search */}
              <button className={`p-2 rounded-full transition-all duration-300 ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                <Icon name="search" size={16} className={isDark ? 'text-white' : 'text-gray-600'} />
              </button>
              
              {/* Notifications */}
              <button className={`relative p-2 rounded-full transition-all duration-300 ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                <Icon name="bell" size={16} className={isDark ? 'text-white' : 'text-gray-600'} />
                {counters.totalNotifications > 0 && renderBadge(counters.totalNotifications)}
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-all duration-300 ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
              >
                {isDark ? <Icon icon={Icons.Sun} size={16} className="text-white" /> : <Icon icon={Icons.Moon} size={16} className="text-gray-600" />}
              </button>
              
              {/* User Profile */}
              <button className={`p-2 rounded-full transition-all duration-300 ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                <User size={16} className={isDark ? 'text-white' : 'text-gray-600'} />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2 rounded-full transition-all duration-300 ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
              >
                {isMobileMenuOpen ? 
                  <X size={16} className={isDark ? 'text-white' : 'text-gray-600'} /> : 
                  <Menu size={16} className={isDark ? 'text-white' : 'text-gray-600'} />
                }
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`lg:hidden mt-4 ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-2xl border ${isDark ? 'border-white/20' : 'border-gray-200'} rounded-2xl shadow-2xl overflow-hidden animate-fade-in`}>
            <div className="p-4 space-y-3">
              {mainTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={tab.action}
                  className={`w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${isDark ? 'hover:bg-white/5 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}`}
                >
                  <Icon name={tab.iconName} size={18} />
                  <span className="font-medium">{tab.label}</span>
                  {tab.badge && renderBadge(tab.badge, 'bg-blue-500')}
                </button>
              ))}
              
              <hr className={`${isDark ? 'border-white/20' : 'border-gray-200'}`} />
              
              <div className="flex items-center justify-between">
                <button
                  onClick={toggleTheme}
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${isDark ? 'hover:bg-white/5 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}`}
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                  <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
});

export default Navbar;