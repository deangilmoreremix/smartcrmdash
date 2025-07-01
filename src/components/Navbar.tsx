import React, { useState, useEffect } from 'react';
import { ChevronDown, User, Bell, Search, Settings, LogOut, BarChart3, Users, Target, MessageSquare, Video, FileText, Zap, TrendingUp, Calendar, Phone, Receipt, BookOpen, Mic, Sun, Moon, Brain, Mail, Grid3X3, Briefcase, Building2, Megaphone, Activity, CheckSquare, Home, Sparkles, Presentation as PresentationChart, UserPlus, ClipboardList, Lightbulb, PieChart, Clock, Shield, Globe, Database, Headphones, Camera, Layers, Repeat, Palette, HelpCircle, Plus, DollarSign, HeartHandshake, Edit3, Monitor, MoreHorizontal } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useDealStore } from '../store/dealStore';
import { useContactStore } from '../store/contactStore';
import { useTaskStore } from '../store/taskStore';
import { useAppointmentStore } from '../store/appointmentStore';

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isDark, toggleTheme } = useTheme();
  const { navigateToFeature, openAITool } = useNavigation();
  
  // Get data for dynamic counters
  const { deals } = useDealStore();
  const { contacts } = useContactStore();
  const { tasks } = useTaskStore();
  const { appointments } = useAppointmentStore();

  // Calculate dynamic counters
  const getCounters = () => {
    const activeDeals = Object.values(deals).filter(deal => 
      deal.stage !== 'closed-won' && deal.stage !== 'closed-lost'
    ).length;
    
    const hotContacts = Object.values(contacts).filter(contact => 
      contact.status === 'hot'
    ).length;
    
    const pendingTasks = Object.values(tasks).filter(task => 
      !task.completed
    ).length;
    
    const todayAppointments = Object.values(appointments).filter(apt => {
      const today = new Date();
      return apt.startTime.toDateString() === today.toDateString() && apt.status === 'scheduled';
    }).length;

    return {
      activeDeals,
      hotContacts,
      pendingTasks,
      todayAppointments,
      totalNotifications: hotContacts + pendingTasks + todayAppointments
    };
  };

  const counters = getCounters();

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleNavigation = (feature: string, tabName: string) => {
    navigateToFeature(feature);
    setActiveTab(tabName);
    setActiveDropdown(null);
  };

  const handleAIToolClick = (toolName: string) => {
    openAITool(toolName);
    setActiveDropdown(null);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // All navigation tabs as requested
  const mainTabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      action: () => handleNavigation('dashboard', 'dashboard'),
      badge: null,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'sales',
      label: 'Sales',
      icon: DollarSign,
      action: () => handleNavigation('pipeline', 'sales'),
      badge: counters.activeDeals,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'ai-goals',
      label: 'AI Goals',
      icon: Brain,
      action: () => handleNavigation('ai-goals', 'ai-goals'),
      badge: 5,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'communication',
      label: 'Communication',
      icon: MessageSquare,
      action: () => handleNavigation('communication', 'communication'),
      badge: counters.todayAppointments,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'content',
      label: 'Content',
      icon: Edit3,
      action: () => handleNavigation('content', 'content'),
      badge: 3,
      color: 'from-amber-500 to-orange-500'
    },
    {
      id: 'apps',
      label: 'Apps',
      icon: Grid3X3,
      action: () => handleNavigation('apps', 'apps'),
      badge: 4,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: CheckSquare,
      action: () => handleNavigation('tasks', 'tasks'),
      badge: counters.pendingTasks,
      color: 'from-orange-500 to-red-500'
    }
  ];

  // Complete AI Tools list for dropdown
  const aiTools = [
    { name: 'Email Composer', tool: 'email-composer', icon: Mail, category: 'Communication' },
    { name: 'Meeting Summary', tool: 'meeting-summary', icon: Video, category: 'Communication' },
    { name: 'Smart Search', tool: 'smart-search', icon: Search, category: 'Analysis' },
    { name: 'Business Analysis', tool: 'business-analysis', icon: BarChart3, category: 'Analysis' },
    { name: 'Content Generator', tool: 'content-generator', icon: FileText, category: 'Content' },
    { name: 'Proposal Generator', tool: 'proposal-generator', icon: FileText, category: 'Content' }
  ];

  const renderBadge = (count: number | null, color: string = 'bg-red-500') => {
    if (!count || count === 0) return null;
    
    return (
      <div className={`absolute -top-1 -right-1 ${color} text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 animate-pulse shadow-lg`}>
        {count > 99 ? '99+' : count}
      </div>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4">
      {/* Main Navigation Container */}
      <div className="max-w-7xl mx-auto">
        <div className={`
          ${isDark 
            ? 'bg-gray-900/95 border-white/20' 
            : 'bg-white/95 border-gray-200'
          } 
          backdrop-blur-xl border rounded-full shadow-2xl 
          transition-all duration-500 hover:shadow-3xl
          ring-1 ${isDark ? 'ring-white/10' : 'ring-gray-100'}
        `}>
          <div className="flex items-center justify-between px-6 py-3">
            
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
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

            {/* Main Navigation Pills - All Icons */}
            <div className="flex items-center space-x-2">
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
                        relative flex items-center space-x-2 px-3 py-2 rounded-full 
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
                      <tab.icon 
                        size={16} 
                        className={`transition-transform duration-300 ${
                          isActive ? 'scale-110' : 'group-hover:scale-110'
                        }`} 
                      />
                      <span className={`text-sm font-medium hidden xl:inline ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {tab.label}
                      </span>
                      
                      {/* Dynamic Badge */}
                      {tab.badge && renderBadge(
                        tab.badge, 
                        tab.id === 'sales' ? 'bg-green-500' :
                        tab.id === 'ai-goals' ? 'bg-purple-500' :
                        tab.id === 'communication' ? 'bg-blue-500' :
                        tab.id === 'content' ? 'bg-amber-500' :
                        tab.id === 'apps' ? 'bg-purple-500' :
                        tab.id === 'tasks' ? 'bg-red-500' :
                        'bg-gray-500'
                      )}

                      {/* Active Tab Glow Effect */}
                      {isActive && (
                        <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-full opacity-20 animate-pulse`}></div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <button className={`
                p-2 rounded-full transition-all duration-300 transform hover:scale-110
                ${isDark 
                  ? 'hover:bg-white/20 text-white hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }
              `}>
                <Search size={18} />
              </button>
              
              {/* Notifications */}
              <button className={`
                relative p-2 rounded-full transition-all duration-300 transform hover:scale-110
                ${isDark 
                  ? 'hover:bg-white/20 text-white hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }
              `}>
                <Bell size={18} />
                {counters.totalNotifications > 0 && renderBadge(counters.totalNotifications)}
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`
                  p-2 rounded-full transition-all duration-500 transform hover:scale-110
                  ${isDark 
                    ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }
                `}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              
              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown('profile');
                  }}
                  className={`
                    flex items-center space-x-2 p-1 rounded-full transition-all duration-300 transform hover:scale-105
                    ${isDark 
                      ? 'hover:bg-white/20 text-white hover:text-white' 
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                    }
                  `}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/20">
                    <span className="text-sm font-bold text-white">JD</span>
                  </div>
                  <ChevronDown 
                    size={14} 
                    className={`transition-transform duration-300 hidden lg:block ${isDark ? 'text-white' : 'text-gray-600'} ${
                      activeDropdown === 'profile' ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                
                {activeDropdown === 'profile' && (
                  <div className={`
                    absolute top-12 right-0 w-64 
                    ${isDark ? 'bg-gray-900/98 border-white/20' : 'bg-white/98 border-gray-200'} 
                    backdrop-blur-2xl border rounded-2xl shadow-2xl z-50 overflow-hidden
                    animate-fade-in
                  `}>
                    <div className="p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-lg font-bold text-white">JD</span>
                        </div>
                        <div>
                          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            John Doe
                          </h3>
                          <p className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>
                            Sales Manager
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <button className={`
                          w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-all duration-200
                          ${isDark 
                            ? 'hover:bg-white/10 text-white hover:text-white' 
                            : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                          }
                        `}>
                          <User size={16} />
                          <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Profile</span>
                        </button>
                        
                        <button className={`
                          w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-all duration-200
                          ${isDark 
                            ? 'hover:bg-white/10 text-white hover:text-white' 
                            : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                          }
                        `}>
                          <Settings size={16} />
                          <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Settings</span>
                        </button>
                        
                        <hr className={`my-2 ${isDark ? 'border-white/20' : 'border-gray-200'}`} />
                        
                        <button className="w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 text-red-400 hover:bg-red-500/10">
                          <LogOut size={16} />
                          <span className="text-sm font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;