import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, User, Bell, Search, Settings, LogOut, BarChart3, Users, Target, MessageSquare, Video, FileText, Zap, TrendingUp, Calendar, Phone, Receipt, BookOpen, Mic, Sun, Moon, Brain, Mail, Grid3X3, Briefcase, Building2, Megaphone, Activity, CheckSquare, Home, Sparkles, Presentation as PresentationChart, UserPlus, ClipboardList, Lightbulb, PieChart, Clock, Shield, Globe, Database, Headphones, Camera, Layers, Repeat, Palette, HelpCircle, Plus, DollarSign, HeartHandshake, Volume2, Image, Bot, Eye, Code, MessageCircle, AlertTriangle, LineChart, Edit3, ExternalLink, Menu, X, Key } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useDealStore } from '../store/dealStore';
import { useContactStore } from '../store/contactStore';
import { useTaskStore } from '../store/taskStore';
import { useAppointmentStore } from '../store/appointmentStore';
import { useCallback, useRef } from 'react';

// AI Tools list - 29+ tools organized by category
const aiTools = [
  // Core AI Tools (8 tools)
  { name: 'Email Analysis', tool: 'email-analysis', icon: Mail, category: 'Core AI Tools' },
  { name: 'Meeting Summarizer', tool: 'meeting-summarizer', icon: Video, category: 'Core AI Tools' },
  { name: 'Proposal Generator', tool: 'proposal-generator', icon: FileText, category: 'Core AI Tools' },
  { name: 'Call Script Generator', tool: 'call-script', icon: Phone, category: 'Core AI Tools' },
  { name: 'Subject Line Optimizer', tool: 'subject-optimizer', icon: Mail, category: 'Core AI Tools' },
  { name: 'Competitor Analysis', tool: 'competitor-analysis', icon: Shield, category: 'Core AI Tools' },
  { name: 'Market Trends', tool: 'market-trends', icon: TrendingUp, category: 'Core AI Tools' },
  { name: 'Sales Insights', tool: 'sales-insights', icon: BarChart3, category: 'Core AI Tools' },
  { name: 'Sales Forecast', tool: 'sales-forecast', icon: LineChart, category: 'Core AI Tools' },

  // Communication (4 tools)
  { name: 'Email Composer', tool: 'email-composer', icon: Mail, category: 'Communication' },
  { name: 'Objection Handler', tool: 'objection-handler', icon: MessageSquare, category: 'Communication' },
  { name: 'Email Response', tool: 'email-response', icon: Mail, category: 'Communication' },
  { name: 'Voice Tone Optimizer', tool: 'voice-tone', icon: Volume2, category: 'Communication' },

  // Customer & Content (3 tools)
  { name: 'Customer Persona', tool: 'customer-persona', icon: User, category: 'Customer & Content' },
  { name: 'Visual Content Generator', tool: 'visual-content', icon: Image, category: 'Customer & Content' },
  { name: 'Meeting Agenda', tool: 'meeting-agenda', icon: Calendar, category: 'Customer & Content' },

  // Advanced Features (5 tools)
  { name: 'AI Assistant', tool: 'ai-assistant', icon: Bot, category: 'Advanced Features' },
  { name: 'Vision Analyzer', tool: 'vision-analyzer', icon: Eye, category: 'Advanced Features' },
  { name: 'Image Generator', tool: 'image-generator', icon: Camera, category: 'Advanced Features' },
  { name: 'Semantic Search', tool: 'semantic-search', icon: Search, category: 'Advanced Features' },
  { name: 'Function Assistant', tool: 'function-assistant', icon: Code, category: 'Advanced Features' },

  // Real-time Features (6 tools)
  { name: 'Streaming Chat', tool: 'streaming-chat', icon: MessageCircle, category: 'Real-time Features' },
  { name: 'Form Validation', tool: 'form-validation', icon: CheckSquare, category: 'Real-time Features' },
  { name: 'Live Deal Analysis', tool: 'live-deal-analysis', icon: Activity, category: 'Real-time Features' },
  { name: 'Instant Response', tool: 'instant-response', icon: Zap, category: 'Real-time Features' },
  { name: 'Real-time Email Composer', tool: 'realtime-email', icon: Mail, category: 'Real-time Features' },
  { name: 'Voice Analysis Real-time', tool: 'voice-analysis', icon: Mic, category: 'Real-time Features' },

  // Reasoning Generators (5 tools)
  { name: 'Reasoning Email', tool: 'reasoning-email', icon: Brain, category: 'Reasoning Generators' },
  { name: 'Reasoning Proposal', tool: 'reasoning-proposal', icon: FileText, category: 'Reasoning Generators' },
  { name: 'Reasoning Script', tool: 'reasoning-script', icon: Phone, category: 'Reasoning Generators' },
  { name: 'Reasoning Objection', tool: 'reasoning-objection', icon: AlertTriangle, category: 'Reasoning Generators' },
  { name: 'Reasoning Social', tool: 'reasoning-social', icon: Users, category: 'Reasoning Generators' }
];

// Tasks dropdown tools
export const taskTools = [
  { name: 'Task Management', tool: 'task-management', icon: CheckSquare },
  { name: 'Task Automation', tool: 'task-automation', icon: Bot },
  { name: 'Project Tracker', tool: 'project-tracker', icon: Layers },
  { name: 'Time Tracking', tool: 'time-tracking', icon: Clock },
  { name: 'Workflow Builder', tool: 'workflow-builder', icon: Repeat },
  { name: 'Deadline Manager', tool: 'deadline-manager', icon: AlertTriangle }
];

// Sales dropdown tools
export const salesTools = [
  { name: 'Sales Tools', tool: 'sales-tools', icon: DollarSign },
  { name: 'Lead Automation', tool: 'lead-automation', icon: Bot },
  { name: 'Circle Prospecting', tool: 'circle-prospecting', icon: Target },
  { name: 'Appointments', tool: 'appointments', icon: Calendar },
  { name: 'Phone System', tool: 'phone-system', icon: Phone },
  { name: 'Invoicing', tool: 'invoicing', icon: Receipt }
];

// Communication dropdown tools
export const communicationTools = [
  { name: 'Video Email', tool: 'video-email', icon: Video },
  { name: 'Text Messages', tool: 'text-messages', icon: MessageSquare },
  { name: 'Email Composer', tool: 'email-composer', icon: Mail },
  { name: 'Campaigns', tool: 'campaigns', icon: Megaphone }
];

// Content dropdown tools
export const contentTools = [
  { name: 'Content Library', tool: 'content-library', icon: BookOpen },
  { name: 'Voice Profiles', tool: 'voice-profiles', icon: Mic },
  { name: 'Business Analysis', tool: 'business-analysis', icon: BarChart3 },
  { name: 'Image Generator', tool: 'image-generator', icon: Camera },
  { name: 'Forms', tool: 'forms', icon: FileText }
];

// Connected apps
export const connectedApps = [
  { name: 'FunnelCraft AI', url: 'https://funnelcraft-ai.videoremix.io/', icon: Megaphone, isExternal: true },
  { name: 'SmartCRM Closer', url: 'https://smartcrm-closer.videoremix.io', icon: Users, isExternal: true },
  { name: 'ContentAI', url: 'https://content-ai.videoremix.io', icon: FileText, isExternal: true },
  { name: 'White-Label Customization', url: '/white-label', icon: Palette, isExternal: false }
];

const Navbar = () => {
  // Use useRef for dropdown state to avoid re-renders when only visual state changes
  const activeDropdownRef = useRef<string | null>(null);
  const [activeTab, setActiveTab] = useState(() => {
    // Initialize based on current path to avoid unnecessary state updates
    const path = window.location.pathname;
    if (path.includes('dashboard')) return 'dashboard';
    if (path.includes('contacts')) return 'contacts';
    if (path.includes('pipeline')) return 'pipeline';
    if (path.includes('ai-goals')) return 'ai-goals';
    if (path.includes('ai-tools')) return 'ai-tools';
    if (path.includes('appointments')) return 'appointments';
    return 'dashboard';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const { isDark, toggleTheme } = useTheme();
  const { navigateToFeature, openAITool } = useNavigation();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Memoize these expensive operations
  const { deals } = useDealStore();  
  const { contacts } = useContactStore(); 
  const { tasks } = useTaskStore();
  const { appointments } = useAppointmentStore();

  // Memoize counter calculations to prevent recalculation on every render
  const counters = React.useMemo(() => {
    // Safely access store data with null checks
    const activeDeals = Object.values(deals || {}).filter(deal => 
      deal.stage !== 'closed-won' && deal.stage !== 'closed-lost'
    ).length;
    
    const hotContacts = Object.values(contacts || {}).filter(contact => 
      contact.status === 'hot'
    ).length;
    
    const pendingTasks = Object.values(tasks || {}).filter(task => 
      !task.completed
    ).length;
    
    const todayAppointments = Object.values(appointments || {}).filter(apt => {
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

  // Use an event handler ref to avoid recreating the handler on each render
  const outsideClickHandlerRef = useRef<((e: MouseEvent) => void) | null>(null);

  // Toggle dropdown with debounce to prevent rapid toggling
  const toggleDropdown = useCallback((dropdown: string) => {
    // Use setTimeout to prevent rapid toggling
    setTimeout(() => {
      setActiveDropdown(prev => prev === dropdown ? null : dropdown);
      activeDropdownRef.current = activeDropdown === dropdown ? null : dropdown;
    }, 0);
  }, [activeDropdown]);

  // Navigation handler with memoization
  const handleNavigation = useCallback((route: string, tabName: string) => {
    navigate(route);
    setActiveTab(tabName);
    setActiveDropdown(null);
    activeDropdownRef.current = null;
    setIsMobileMenuOpen(false);
  }, [navigate]);

  // AI tool navigation handler with memoization
  const handleAIToolClick = useCallback((toolName: string) => {
    const toolRoutes: Record<string, string> = {
      'sales-tools': '/sales-tools',
      'lead-automation': '/lead-automation',
      'circle-prospecting': '/circle-prospecting',
      'appointments': '/appointments',
      'phone-system': '/phone-system',
      'invoicing': '/invoicing',
      'video-email': '/video-email',
      'text-messages': '/text-messages',
      'content-library': '/content-library',
      'voice-profiles': '/voice-profiles',
      'business-analysis': '/business-analysis',
      'forms': '/forms',
      'sales-analytics': '/sales-analytics',
      'deal-pipeline': '/pipeline',
      'quote-builder': '/quote-builder',
      'commission-tracker': '/commission-tracker',
      'follow-up-reminders': '/follow-up-reminders',
      'territory-management': '/territory-management',
      'task-management': '/tasks',
      'task-automation': '/task-automation',
      'project-tracker': '/project-tracker',
      'time-tracking': '/time-tracking',
      'workflow-builder': '/workflow-builder',
      'deadline-manager': '/deadline-manager',
      'email-composer': '/email-composer',
      'campaigns': '/campaigns',
      'image-generator': '/image-generator',
      'ai-model-demo': '/ai-model-demo'
    };
    
    // Close all dropdowns
    setActiveDropdown(null);
    activeDropdownRef.current = null;
    setIsMobileMenuOpen(false);
    
    if (toolRoutes[toolName]) {
      navigate(toolRoutes[toolName]);
    } else {
      // For AI tools, use the openAITool function
      openAITool(toolName);
    }
  }, [navigate, openAITool]);

  // Update active tab once on route change
  useEffect(() => {
    const path = location.pathname;
    let newTab = '';
    
    if (path === '/dashboard') newTab = 'dashboard';
    else if (path === '/contacts') newTab = 'contacts';
    else if (path === '/pipeline') newTab = 'pipeline';
    else if (path === '/ai-goals') newTab = 'ai-goals';
    else if (path === '/ai-tools') newTab = 'ai-tools';
    else if (path === '/appointments') newTab = 'appointments';
    else newTab = '';

    if (newTab && newTab !== activeTab) {
      setActiveTab(newTab);
    }
  }, [location.pathname, activeTab]);

  // Set up event listener for outside clicks
  useEffect(() => {
    // Create the handler only once
    if (!outsideClickHandlerRef.current) {
      outsideClickHandlerRef.current = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        // Check if click is outside any dropdown toggle button
        if (!target.closest('[data-dropdown-toggle]') && activeDropdownRef.current) {
          setActiveDropdown(null);
          activeDropdownRef.current = null;
        }
        
        // Always close mobile menu on outside click
        if (!target.closest('#mobile-menu-button')) {
          setIsMobileMenuOpen(false);
        }
      };
    }
    
    // Only add/remove listener when needed
    if (activeDropdown || isMobileMenuOpen) {
      document.addEventListener('click', outsideClickHandlerRef.current);
    } else {
      document.removeEventListener('click', outsideClickHandlerRef.current);
    }
    
    return () => {
      if (outsideClickHandlerRef.current) {
        document.removeEventListener('click', outsideClickHandlerRef.current);
      }
    };
  }, [activeDropdown, isMobileMenuOpen]);

  // Don't recalculate these on every render
  const dropdownMenus = React.useMemo(() => [
    {
      id: 'sales',
      label: 'Sales',
      icon: DollarSign,
      badge: salesTools.length,
      color: 'from-green-500 to-teal-500',
      badgeColor: 'bg-green-500'
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: CheckSquare,
      badge: taskTools.length,
      color: 'from-orange-500 to-red-500',
      badgeColor: 'bg-orange-500'
    },
    {
      id: 'communication',
      label: 'Comm',
      icon: MessageSquare,
      badge: communicationTools.length,
      color: 'from-blue-500 to-sky-500',
      badgeColor: 'bg-blue-500'
    },
    {
      id: 'content',
      label: 'Content',
      icon: Edit3,
      badge: contentTools.length,
      color: 'from-amber-500 to-orange-500',
      badgeColor: 'bg-amber-500'
    },
    {
      id: 'apps',
      label: 'Apps',
      icon: Grid3X3,
      badge: connectedApps.length,
      color: 'from-purple-500 to-violet-500',
      badgeColor: 'bg-purple-500'
    },
    {
      id: 'ai-categories',
      label: 'AI',
      icon: Brain,
      badge: aiTools.length,
      color: 'from-pink-500 to-rose-500',
      badgeColor: 'bg-pink-500'
    }
  ], []);
  }
  // Main navigation tabs
  const mainTabs = React.useMemo(() => [
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
      action: () => handleNavigation('/contacts', 'contacts'),
      badge: 1,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'pipeline',
      label: 'Pipeline',
      icon: Briefcase,
      action: () => handleNavigation('/pipeline', 'pipeline'), 
      badge: counters.activeDeals || null,
      color: 'from-green-500 to-emerald-500'
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
      badge: counters.todayAppointments || null,
      color: 'from-cyan-500 to-blue-500'
    }
  ], [handleNavigation, counters.activeDeals, counters.todayAppointments]);
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
                      <tab.icon 
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
                        tab.id === 'tasks' ? 'bg-indigo-500' :
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

              {/* Dropdown Menu Items - Each with data attribute for click handling */}
              {dropdownMenus.map((menu, idx) => (
                <div key={menu.id} className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown(menu.id);
                    }}
                    data-dropdown-toggle={menu.id}
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
                    <menu.icon size={14} className="transition-transform duration-300 group-hover:scale-110" />
                    <span className="text-xs font-medium">{menu.label}</span>
                    <ChevronDown 
                      size={12} 
                      className={`transition-transform duration-300 ${
                        activeDropdown === menu.id ? 'rotate-180' : ''
                      }`} 
                    />
                    
                    {/* Badge */}
                    {renderBadge(menu.badge, `bg-gradient-to-r ${menu.color}`)}

                    {/* Active Dropdown Glow Effect */}
                    {activeDropdown === menu.id && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${menu.color} rounded-full opacity-20 animate-pulse`}></div>
                    )}
                  </button>

                  {/* Sales Dropdown */}
                  {menu.id === 'sales' && activeDropdown === menu.id && (
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

                  {/* Communication Dropdown */}
                  {menu.id === 'communication' && activeDropdown === menu.id && (
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

                  {/* Content Dropdown */}
                  {menu.id === 'content' && activeDropdown === menu.id && (
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

                  {/* Connected Apps Dropdown */}
                  {menu.id === 'apps' && activeDropdown === menu.id && (
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
                                <app.icon size={16} className="text-purple-500" />
                                <span className="text-sm font-medium">{app.name}</span>
                              </div>
                              <ExternalLink size={12} className="opacity-50" />
                            </a>
                          ) : (
                            <button
                              key={index}
                              onClick={() => handleNavigation(app.url.slice(1), 'white-label')}
                              className={`w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${isDark ? 'hover:bg-white/5 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}`}
                            >
                              <app.icon size={16} className="text-purple-500" />
                              <span className="text-sm font-medium">{app.name}</span>
                            </button>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Tasks Dropdown */}
                  {menu.id === 'tasks' && activeDropdown === menu.id && (
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
                  
                  {/* AI Categories Dropdown */}
                  {menu.id === 'ai-categories' && activeDropdown === menu.id && (
                    <div className={`absolute top-14 right-0 w-72 max-h-[80vh] overflow-y-auto ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-2xl border ${isDark ? 'border-white/10' : 'border-gray-200'} rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in`}>
                      <div className="p-3">
                        <div className="mb-3">
                          <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>AI Tools by Category</h3>
                        </div>
                        {Object.entries(aiTools.reduce((acc, tool) => {
                          acc[tool.category] = [...(acc[tool.category] || []), tool];
                          return acc;
                        }, {} as Record<string, typeof aiTools>)).map(([category, tools]) => (
                          <div key={category} className="mb-3">
                            <h4 className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-2`}>{category}</h4>
                            <div className="space-y-1">
                              {tools.map((tool, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleAIToolClick(tool.tool)}
                                  className={`w-full text-left flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 ${
                                    isDark ? 'hover:bg-white/5 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                                  }`}
                                >
                                  <tool.icon size={14} className="text-pink-500" />
                                  <span className="text-sm">{tool.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
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
                id="mobile-menu-button"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event from propagating
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

            {/* Right Side Controls */}
            <div className="hidden lg:flex items-center space-x-2">
              {/* Search */}
              <button className={`p-2 rounded-full transition-all duration-300 ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                <Search size={16} className={isDark ? 'text-white' : 'text-gray-600'} />
              </button>
              
              {/* Notifications */}
              <button className={`relative p-2 rounded-full transition-all duration-300 ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                <Bell size={16} className={isDark ? 'text-white' : 'text-gray-600'} />
                {counters.totalNotifications > 0 && renderBadge(counters.totalNotifications)}
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-all duration-300 ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
              >
                {isDark ? <Sun size={16} className="text-white" /> : <Moon size={16} className="text-gray-600" />}
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
};

export default Navbar;