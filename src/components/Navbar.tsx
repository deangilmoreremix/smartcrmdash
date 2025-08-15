import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronDown, User, Bell, Search, BarChart3, Users, Target, MessageSquare, Video, FileText, Zap,
  TrendingUp, Calendar, Phone, Receipt, BookOpen, Mic, Sun, Moon, Brain, Mail, Grid3X3, Briefcase,
  Megaphone, Activity, CheckSquare, Sparkles, PieChart, Clock, Shield, Globe, Camera, Layers, Repeat,
  Palette, DollarSign, Volume2, Image, Bot, Eye, Code, MessageCircle, AlertTriangle, LineChart,
  Edit3, ExternalLink, Menu, X
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useDealStore } from '../store/dealStore';
import { useContactStore } from '../store/contactStore';
import { useTaskStore } from '../store/taskStore';
import { useAppointmentStore } from '../store/appointmentStore';

interface NavbarProps {
  onOpenPipelineModal?: () => void;
}

const Navbar: React.FC<NavbarProps> = React.memo(({ onOpenPipelineModal }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { openAITool } = useNavigation();
  const navigate = useNavigate();
  const location = useLocation();

  // Data sources
  const { deals } = useDealStore();
  const { contacts } = useContactStore();
  const { tasks } = useTaskStore();
  const { appointments } = useAppointmentStore();

  // Counters
  const counters = React.useMemo(() => {
    const activeDeals = Object.values(deals).filter(
      deal => deal.stage !== 'closed-won' && deal.stage !== 'closed-lost'
    ).length;

    // Use interestLevel (preferred), fall back to status === 'hot'
    const hotContacts = Object.values(contacts).filter(contact =>
      (contact as any)?.interestLevel === 'hot' ||
      (contact as any)?.status?.toLowerCase?.() === 'hot'
    ).length;

    const pendingTasks = Object.values(tasks).filter(task => !task.completed).length;

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

  // Task tools
  const taskTools = [
    { name: 'Task Management', tool: 'task-management', icon: CheckSquare },
    { name: 'Task Automation', tool: 'task-automation', icon: Bot },
    { name: 'Project Tracker', tool: 'project-tracker', icon: Layers },
    { name: 'Time Tracking', tool: 'time-tracking', icon: Clock },
    { name: 'Workflow Builder', tool: 'workflow-builder', icon: Repeat },
    { name: 'Deadline Manager', tool: 'deadline-manager', icon: AlertTriangle }
  ];

  // Sales tools
  const salesTools = [
    { name: 'Sales Tools', tool: 'sales-tools', icon: DollarSign },
    { name: 'Lead Automation', tool: 'lead-automation', icon: Bot },
    { name: 'Circle Prospecting', tool: 'circle-prospecting', icon: Target },
    { name: 'Appointments', tool: 'appointments', icon: Calendar },
    { name: 'Phone System', tool: 'phone-system', icon: Phone },
    { name: 'Invoicing', tool: 'invoicing', icon: Receipt },
    { name: 'Sales Analytics', tool: 'sales-analytics', icon: TrendingUp },
    { name: 'Deal Pipeline', tool: 'deal-pipeline', icon: Briefcase },
    { name: 'Quote Builder', tool: 'quote-builder', icon: FileText },
    { name: 'Commission Tracker', tool: 'commission-tracker', icon: PieChart },
    { name: 'Follow-up Reminders', tool: 'follow-up-reminders', icon: Bell },
    { name: 'Territory Management', tool: 'territory-management', icon: Globe }
  ];

  // Communication tools
  const communicationTools = [
    { name: 'Video Email', tool: 'video-email', icon: Video },
    { name: 'Text Messages', tool: 'text-messages', icon: MessageSquare },
    { name: 'Email Composer', tool: 'email-composer', icon: Mail },
    { name: 'Campaigns', tool: 'campaigns', icon: Megaphone },
    { name: 'Group Calls', tool: 'group-calls', icon: Users },
    { name: 'Call Recording', tool: 'call-recording', icon: Mic },
    { name: 'In-Call Messaging', tool: 'in-call-messaging', icon: MessageCircle },
    { name: 'Call Analytics', tool: 'call-analytics', icon: BarChart3 },
    { name: 'Connection Quality Monitor', tool: 'connection-quality', icon: Activity }
  ];

  // Content tools
  const contentTools = [
    { name: 'Content Library', tool: 'content-library', icon: BookOpen },
    { name: 'Voice Profiles', tool: 'voice-profiles', icon: Mic },
    { name: 'Business Analysis', tool: 'business-analysis', icon: BarChart3 },
    { name: 'Image Generator', tool: 'image-generator', icon: Camera },
    { name: 'Forms', tool: 'forms', icon: FileText },
    { name: 'AI Model Demo', tool: 'ai-model-demo', icon: Brain }
  ];

  // Connected apps
  const connectedApps = [
    { name: 'FunnelCraft AI', url: 'https://funnelcraft-ai.videoremix.io/', icon: Megaphone, isExternal: true },
    { name: 'SmartCRM Closer', url: 'https://smartcrm-closer.videoremix.io', icon: Users, isExternal: true },
    { name: 'ContentAI', url: 'https://content-ai.videoremix.io', icon: FileText, isExternal: true },
    { name: 'Mobile View', url: '/mobile', icon: Camera, isExternal: false },
    { name: 'White-Label Customization', url: '/white-label', icon: Palette, isExternal: false }
  ];

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('[data-dropdown-toggle]')) return;
      setActiveDropdown(null);
      setIsMobileMenuOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleDropdown = useCallback((dropdown: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveDropdown(prev => (prev === dropdown ? null : dropdown));
  }, []);

  const handleNavigation = useCallback((route: string, tabName: string) => {
    navigate(route);
    setActiveTab(tabName);
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  }, [navigate]);

  const handleAIToolClick = useCallback((toolName: string) => {
    if (toolName === 'sales-tools') navigate('/sales-tools');
    else if (toolName === 'lead-automation') navigate('/lead-automation');
    else if (toolName === 'circle-prospecting') navigate('/circle-prospecting');
    else if (toolName === 'appointments') navigate('/appointments');
    else if (toolName === 'phone-system') navigate('/phone-system');
    else if (toolName === 'invoicing') navigate('/invoicing');
    else if (toolName === 'video-email') navigate('/video-email');
    else if (toolName === 'text-messages') navigate('/text-messages');
    else if (toolName === 'content-library') navigate('/content-library');
    else if (toolName === 'voice-profiles') navigate('/voice-profiles');
    else if (toolName === 'business-analysis') navigate('/business-analysis');
    else if (toolName === 'forms') navigate('/forms');
    else if (toolName === 'sales-analytics') navigate('/sales-analytics');
    else if (toolName === 'deal-pipeline') {
      onOpenPipelineModal?.();
      setActiveDropdown(null);
    }
    else if (toolName === 'quote-builder') navigate('/quote-builder');
    else if (toolName === 'commission-tracker') navigate('/commission-tracker');
    else if (toolName === 'follow-up-reminders') navigate('/follow-up-reminders');
    else if (toolName === 'territory-management') navigate('/territory-management');
    else if (toolName === 'task-management') navigate('/tasks');
    else if (toolName === 'task-automation') navigate('/task-automation');
    else if (toolName === 'project-tracker') navigate('/project-tracker');
    else if (toolName === 'time-tracking') navigate('/time-tracking');
    else if (toolName === 'workflow-builder') navigate('/workflow-builder');
    else if (toolName === 'deadline-manager') navigate('/deadline-manager');
    else if (toolName === 'email-composer') navigate('/email-composer');
    else if (toolName === 'campaigns') navigate('/campaigns');
    else if (toolName === 'image-generator') navigate('/image-generator');
    else if (toolName === 'ai-model-demo') navigate('/ai-model-demo');
    else if (toolName === 'group-calls') navigate('/group-calls');
    else if (toolName === 'call-recording') navigate('/call-recording');
    else if (toolName === 'in-call-messaging') navigate('/in-call-messaging');
    else if (toolName === 'call-analytics') navigate('/call-analytics');
    else if (toolName === 'connection-quality') navigate('/connection-quality');
    else {
      openAITool(toolName);
    }
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  }, [navigate, openAITool, onOpenPipelineModal]);

  // Active tab based on route (include /contacts-enhanced)
  useEffect(() => {
    const path = location.pathname;
    if (path === '/dashboard') setActiveTab('dashboard');
    else if (path === '/contacts' || path === '/contacts-enhanced') setActiveTab('contacts'); // 👈 enhanced route
    else if (path === '/pipeline') setActiveTab('pipeline');
    else if (path === '/tasks') setActiveTab('tasks');
    else if (path === '/ai-tools') setActiveTab('ai-tools');
    else if (path === '/appointments') setActiveTab('appointments');
    else setActiveTab('');
  }, [location.pathname]);

  // AI tools list (unchanged, truncated for brevity)
  const aiTools = [
    { name: 'Email Analysis', tool: 'email-analysis', icon: Mail, category: 'Core AI Tools' },
    { name: 'Meeting Summarizer', tool: 'meeting-summarizer', icon: Video, category: 'Core AI Tools' },
    { name: 'Proposal Generator', tool: 'proposal-generator', icon: FileText, category: 'Core AI Tools' },
    { name: 'Call Script Generator', tool: 'call-script', icon: Phone, category: 'Core AI Tools' },
    { name: 'Subject Line Optimizer', tool: 'subject-optimizer', icon: Mail, category: 'Core AI Tools' },
    { name: 'Competitor Analysis', tool: 'competitor-analysis', icon: Shield, category: 'Core AI Tools' },
    { name: 'Market Trends', tool: 'market-trends', icon: TrendingUp, category: 'Core AI Tools' },
    { name: 'Sales Insights', tool: 'sales-insights', icon: BarChart3, category: 'Core AI Tools' },
    { name: 'Sales Forecast', tool: 'sales-forecast', icon: LineChart, category: 'Core AI Tools' },
    // ... (rest unchanged)
  ];

  const mainTabs = [
    {
      id: 'dashboard',
      label: '',
      icon: () => null,
      action: () => handleNavigation('/dashboard', 'dashboard'),
      badge: null,
      color: 'from-blue-500 to-green-500'
    },
    {
      id: 'contacts',
      label: 'Contacts',
      icon: Users,
      action: () => handleNavigation('/contacts-enhanced', 'contacts'), // 👈 route updated
      badge: counters.hotContacts, // 👈 dynamic badge (hot leads). Use total count if you prefer.
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'pipeline',
      label: 'Pipeline',
      icon: Briefcase,
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
      icon: BarChart3,
      action: () => handleNavigation('/analytics', 'analytics'),
      badge: null,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'ai-goals',
      label: 'AI Goals',
      icon: Target,
      action: () => handleNavigation('/ai-goals', 'ai-goals'),
      badge: 58,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'ai-tools',
      label: 'AI Tools',
      icon: Brain,
      action: () => handleNavigation('/ai-tools', 'ai-tools'),
      badge: aiTools.length,
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'appointments',
      label: 'Calendar',
      icon: Calendar,
      action: () => handleNavigation('/appointments', 'appointments'),
      badge: 1,
      color: 'from-cyan-500 to-blue-500'
    }
  ];

  const dropdownMenus = [
    { id: 'sales', label: 'Sales', icon: DollarSign, badge: salesTools.length, color: 'from-green-500 to-teal-500', badgeColor: 'bg-green-500' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: taskTools.length, color: 'from-orange-500 to-red-500', badgeColor: 'bg-orange-500' },
    { id: 'communication', label: 'Comm', icon: MessageSquare, badge: communicationTools.length, color: 'from-blue-500 to-sky-500', badgeColor: 'bg-blue-500' },
    { id: 'content', label: 'Content', icon: Edit3, badge: contentTools.length, color: 'from-amber-500 to-orange-500', badgeColor: 'bg-amber-500' },
    { id: 'apps', label: 'Apps', icon: Grid3X3, badge: connectedApps.length, color: 'from-purple-500 to-violet-500', badgeColor: 'bg-purple-500' },
    { id: 'ai-categories', label: 'AI', icon: Brain, badge: 31, color: 'from-pink-500 to-rose-500', badgeColor: 'bg-pink-500' }
  ];

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
      <div className="max-w-7xl mx-auto will-change-transform">
        <div className={`${isDark ? 'bg-gray-900/95 border-white/20' : 'bg-white/95 border-gray-200'} backdrop-blur-xl border rounded-full shadow-2xl transition-all duration-500 hover:shadow-3xl ring-1 ${isDark ? 'ring-white/10' : 'ring-gray-100'}`}>
          <div className="flex items-center justify-between px-4 py-2">

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

            {/* Desktop nav pills */}
            <div className="hidden lg:flex items-center space-x-1">
              {mainTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <div key={tab.id} className="relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); tab.action(); }}
                      className={`
                        relative flex items-center space-x-1 px-2 py-1.5 rounded-full 
                        transition-all duration-300 transform hover:scale-105
                        ${isActive 
                          ? `bg-gradient-to-r ${tab.color} text-white shadow-lg ring-2 ring-white/20` 
                          : `${isDark ? 'text-white hover:bg-white/20 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
                        }
                        group
                      `}
                      title={tab.label}
                    >
                      <tab.icon
                        size={14}
                        className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                      />
                      <span className="text-xs font-medium">{tab.label}</span>

                      {/* Badge */}
                      {tab.badge && renderBadge(
                        tab.badge,
                        tab.id === 'pipeline' ? 'bg-green-500' :
                        tab.id === 'contacts' ? 'bg-purple-500' :
                        tab.id === 'ai-goals' ? 'bg-orange-500' :
                        tab.id === 'ai-tools' ? 'bg-pink-500' :
                        tab.id === 'appointments' ? 'bg-cyan-500' :
                        'bg-blue-500'
                      )}

                      {isActive && (
                        <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-full opacity-20 animate-pulse`}></div>
                      )}
                    </button>
                  </div>
                );
              })}

              {/* Dropdowns */}
              {[
                { id: 'sales', items: salesTools, color: 'from-green-500 to-teal-500', badgeColor: 'bg-green-500' },
                { id: 'tasks', items: taskTools, color: 'from-orange-500 to-red-500', badgeColor: 'bg-orange-500' },
                { id: 'communication', items: communicationTools, color: 'from-blue-500 to-sky-500', badgeColor: 'bg-blue-500' },
                { id: 'content', items: contentTools, color: 'from-amber-500 to-orange-500', badgeColor: 'bg-amber-500' },
                { id: 'apps', items: connectedApps, color: 'from-purple-500 to-violet-500', badgeColor: 'bg-purple-500' },
                { id: 'ai-categories', items: [], color: 'from-pink-500 to-rose-500', badgeColor: 'bg-pink-500' }
              ].map(menu => (
                <div key={menu.id} className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleDropdown(menu.id, e); }}
                    data-dropdown-toggle="true"
                    className={`
                      relative flex items-center space-x-1 px-2 py-1.5 rounded-full 
                      transition-all duration-300 transform hover:scale-105
                      ${activeDropdown === menu.id 
                        ? `bg-gradient-to-r ${menu.color} text-white shadow-lg ring-2 ring-white/20` 
                        : `${isDark ? 'text-white hover:bg-white/20 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
                      }
                      group
                    `}
                  >
                    {menu.id === 'sales' && <DollarSign size={14} className="transition-transform duration-300 group-hover:scale-110" />}
                    {menu.id === 'tasks' && <CheckSquare size={14} className="transition-transform duration-300 group-hover:scale-110" />}
                    {menu.id === 'communication' && <MessageSquare size={14} className="transition-transform duration-300 group-hover:scale-110" />}
                    {menu.id === 'content' && <Edit3 size={14} className="transition-transform duration-300 group-hover:scale-110" />}
                    {menu.id === 'apps' && <Grid3X3 size={14} className="transition-transform duration-300 group-hover:scale-110" />}
                    {menu.id === 'ai-categories' && <Brain size={14} className="transition-transform duration-300 group-hover:scale-110" />}
                    <span className="text-xs font-medium">
                      {menu.id === 'sales' ? 'Sales'
                        : menu.id === 'tasks' ? 'Tasks'
                        : menu.id === 'communication' ? 'Comm'
                        : menu.id === 'content' ? 'Content'
                        : menu.id === 'apps' ? 'Apps'
                        : 'AI'}
                    </span>
                    <ChevronDown size={12} className={`transition-transform duration-300 ${activeDropdown === menu.id ? 'rotate-180' : ''}`} />
                    {renderBadge(
                      menu.id === 'sales' ? salesTools.length
                        : menu.id === 'tasks' ? taskTools.length
                        : menu.id === 'communication' ? communicationTools.length
                        : menu.id === 'content' ? contentTools.length
                        : menu.id === 'apps' ? connectedApps.length
                        : 31,
                      menu.badgeColor
                    )}
                    {activeDropdown === menu.id && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${menu.color} rounded-full opacity-20 animate-pulse`}></div>
                    )}
                  </button>

                  {/* Example dropdown: Sales */}
                  {menu.id === 'sales' && activeDropdown === 'sales' && (
                    <div className={`absolute top-14 right-0 w-64 ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-2xl border ${isDark ? 'border-white/10' : 'border-gray-200'} rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in`}>
                      <div className="p-3">
                        {salesTools.map((tool, index) => (
                          <button
                            key={index}
                            onClick={() => handleAIToolClick(tool.tool)}
                            className={`w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${isDark ? 'hover:bg-white/5 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}`}
                          >
                            <tool.icon size={16} className="text-green-500" />
                            <span className="text-sm font-medium">{tool.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tasks */}
                  {menu.id === 'tasks' && activeDropdown === 'tasks' && (
                    <div className={`absolute top-14 right-0 w-64 ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-2xl border ${isDark ? 'border-white/10' : 'border-gray-200'} rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in`}>
                      <div className="p-3">
                        {taskTools.map((tool, index) => (
                          <button
                            key={index}
                            onClick={() => handleAIToolClick(tool.tool)}
                            className={`w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${isDark ? 'hover:bg-white/5 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}`}
                          >
                            <tool.icon size={16} className="text-orange-500" />
                            <span className="text-sm font-medium">{tool.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Communication */}
                  {menu.id === 'communication' && activeDropdown === 'communication' && (
                    <div className={`absolute top-14 right-0 w-64 ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-2xl border ${isDark ? 'border-white/10' : 'border-gray-200'} rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in`}>
                      <div className="p-3">
                        {communicationTools.map((tool, index) => (
                          <button
                            key={index}
                            onClick={() => handleAIToolClick(tool.tool)}
                            className={`w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${isDark ? 'hover:bg-white/5 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}`}
                          >
                            <tool.icon size={16} className="text-blue-500" />
                            <span className="text-sm font-medium">{tool.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  {menu.id === 'content' && activeDropdown === 'content' && (
                    <div className={`absolute top-14 right-0 w-64 ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-2xl border ${isDark ? 'border-white/10' : 'border-gray-200'} rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in`}>
                      <div className="p-3">
                        {contentTools.map((tool, index) => (
                          <button
                            key={index}
                            onClick={() => handleAIToolClick(tool.tool)}
                            className={`w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${isDark ? 'hover:bg-white/5 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}`}
                          >
                            <tool.icon size={16} className="text-amber-500" />
                            <span className="text-sm font-medium">{tool.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Categories (collapsed example) */}
                  {menu.id === 'ai-categories' && activeDropdown === 'ai-categories' && (
                    <div className={`absolute top-14 right-0 w-72 ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-2xl border ${isDark ? 'border-white/10' : 'border-gray-200'} rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in`}>
                      <div className="p-3">
                        <div className="mb-3">
                          <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                            AI Tool Categories
                          </h3>
                        </div>
                        {/* Keep your category lists here if needed */}
                        <button
                          onClick={() => handleNavigation('/ai-tools', 'ai-tools')}
                          className={`w-full mt-3 py-2 px-4 rounded-lg border-2 border-dashed transition-all duration-200 ${isDark ? 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white' : 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-900'}`}
                        >
                          <span className="text-sm font-medium">View All AI Tools</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Apps */}
                  {menu.id === 'apps' && activeDropdown === 'apps' && (
                    <div className={`absolute top-14 right-0 w-72 ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-2xl border ${isDark ? 'border-white/10' : 'border-gray-200'} rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in`}>
                      <div className="p-3">
                        {connectedApps.map((app, index) =>
                          app.isExternal ? (
                            <a
                              key={index}
                              href={app.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`w-full text-left flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${isDark ? 'hover:bg-white/5 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}`}
                            >
                              <div className="flex items-center space-x-3">
                                <app.icon size={16} className="text-purple-500" />
                                <span className="text-sm font-medium">{app.name}</span>
                              </div>
                              <ExternalLink size={12} className="opacity-50" />
                            </a>
                          ) : (
                            <button
                              key={index}
                              onClick={() => handleNavigation(app.url, 'white-label')}
                              className={`w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${isDark ? 'hover:bg-white/5 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}`}
                            >
                              <app.icon size={16} className="text-purple-500" />
                              <span className="text-sm font-medium">{app.name}</span>
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={(e) => { e.stopPropagation(); setIsMobileMenuOpen(!isMobileMenuOpen); }}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

            {/* Right controls */}
            <div className="hidden lg:flex items-center space-x-2">
              <button className={`p-2 rounded-full transition-all duration-300 ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                <Search size={16} className={isDark ? 'text-white' : 'text-gray-600'} />
              </button>
              <button className={`relative p-2 rounded-full transition-all duration-300 ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                <Bell size={16} className={isDark ? 'text-white' : 'text-gray-600'} />
                {counters.totalNotifications > 0 && renderBadge(counters.totalNotifications)}
              </button>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-all duration-300 ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
              >
                {isDark ? <Sun size={16} className="text-white" /> : <Moon size={16} className="text-gray-600" />}
              </button>
              <button className={`p-2 rounded-full transition-all duration-300 ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                <User size={16} className={isDark ? 'text-white' : 'text-gray-600'} />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2 rounded-full transition-all duration-300 ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
              >
                {isMobileMenuOpen ? <X size={16} className={isDark ? 'text-white' : 'text-gray-600'} /> : <Menu size={16} className={isDark ? 'text-white' : 'text-gray-600'} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className={`lg:hidden mt-4 ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-2xl border ${isDark ? 'border-white/20' : 'border-gray-200'} rounded-2xl shadow-2xl overflow-hidden animate-fade-in`}>
            <div className="p-4 space-y-3">
              {mainTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={tab.action}
                  className={`w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${isDark ? 'hover:bg-white/5 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}`}
                >
                  <tab.icon size={18} />
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
