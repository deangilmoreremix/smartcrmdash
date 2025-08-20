// src/components/Navbar.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronDown, User, Bell, Search, BarChart3, Users, Target, MessageSquare, Video, FileText, Zap,
  TrendingUp, Calendar, Phone, Receipt, BookOpen, Mic, Sun, Moon, Brain, Mail, Grid3X3, Briefcase,
  Megaphone, Activity, CheckSquare, Sparkles, PieChart, Clock, Shield, Globe, Camera, Layers, Repeat,
  Palette, DollarSign, Volume2, Image, Bot, Eye, Code, MessageCircle, AlertTriangle, LineChart,
  Edit3, ExternalLink, Menu, X, RefreshCw, Plus, MapPin, FileCheck, Settings, Package, UserPlus
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '../contexts/NavigationContext';

import { useDealStore } from "../store/dealStore";
import { useContactStore } from "../hooks/useContactStore";
import { useTaskStore } from "../store/taskStore";
import { useAppointmentStore } from "../store/appointmentStore";

interface NavbarProps {
  onOpenPipelineModal?: () => void;
}

type AITool = {
  title: string;
  id: string;       // must match AITools.tsx switch cases
  icon?: any;  // Simplified for compatibility with lucide-react icons
  category?: string;
};

const Navbar: React.FC<NavbarProps> = React.memo(({ onOpenPipelineModal }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { openAITool } = useNavigation(); // expected from your AIToolsProvider/Navigation layer

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
      deal => String(deal.stage) !== 'closed-won' && String(deal.stage) !== 'closed-lost'
    ).length;

    const hotContacts = Object.values(contacts).filter(contact =>
      (contact as any)?.interestLevel === 'hot' ||
      (contact as any)?.status?.toLowerCase?.() === 'hot'
    ).length;

    const pendingTasks = Object.values(tasks).filter(task => !task.completed).length;

    const todayAppointments = Object.values(appointments).filter(apt => {
      if (!apt.date) return false;
      const today = new Date();
      const aptDate = new Date(apt.date);
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

  // ===== UNIFIED TASKS DROPDOWN: View Options + Quick Actions + AI Features =====
  const taskTools = [
    // VIEW OPTIONS (navigate to TasksNew.tsx tabs)
    { name: 'Task Board', tool: 'tasks', icon: CheckSquare, action: 'navigate', tab: 'board' },
    { name: 'Task Calendar', tool: 'tasks', icon: Calendar, action: 'navigate', tab: 'calendar' },
    { name: 'Task Analytics', tool: 'tasks', icon: BarChart3, action: 'navigate', tab: 'analytics' },
    { name: 'Activity Feed', tool: 'tasks', icon: Activity, action: 'navigate', tab: 'activity' },
    { type: 'divider' },
    
    // QUICK ACTIONS
    { name: 'New Task', tool: 'new-task', icon: Plus, action: 'modal' },
    { name: 'Search Tasks', tool: 'search-tasks', icon: Search, action: 'search' },
    { name: 'Task Templates', tool: 'task-templates', icon: FileText, action: 'templates' },
    { type: 'divider' },
    
    // AI ENHANCEMENTS
    { name: 'AI Task Assistant', tool: 'task-automation', icon: Bot },
    { name: 'Smart Prioritization', tool: 'smart-priority', icon: Zap },
    { name: 'Deadline Optimizer', tool: 'deadline-manager', icon: AlertTriangle },
    { name: 'Workflow Builder', tool: 'workflow-builder', icon: Repeat }
  ];

  const salesTools = [
    { name: "Pipeline Intelligence", tool: 'deal-pipeline', icon: BarChart3 },
    { name: "Deal Risk Monitor", tool: 'deal-risk', icon: Shield },
    { name: "Smart Conversion Insights", tool: 'conversion-insights', icon: Zap },
    { name: "Pipeline Health Dashboard", tool: 'pipeline-health', icon: Activity },
    { name: "Sales Cycle Analytics", tool: 'sales-cycle', icon: Clock },
    { name: "Win Rate Intelligence", tool: 'win-rate-analysis', icon: TrendingUp },
    { name: "AI Sales Forecast", tool: 'ai-sales-forecast', icon: LineChart },
    { name: "Live Deal Analysis", tool: 'live-deal-analysis', icon: Briefcase },
    { name: "Competitor Insights", tool: 'competitor-insights', icon: Target },
    { name: "Revenue Intelligence", tool: 'revenue-intelligence', icon: DollarSign },
  ];

  const communicationTools = [
    { name: 'Appointments', tool: 'appointments', icon: Calendar },
    { name: 'Video Email', tool: 'video-email', icon: Video },
    { name: 'Text Messages', tool: 'text-messages', icon: MessageSquare },
    { name: 'Phone System', tool: 'phone-system', icon: Phone },
    { name: 'Invoicing', tool: 'invoicing', icon: FileText },
    { name: 'Lead Automation', tool: 'lead-automation', icon: Bot },
    { name: 'Circle Prospecting', tool: 'circle-prospecting', icon: MapPin },
    { name: 'Forms & Surveys', tool: 'forms', icon: FileCheck },
    { name: 'Business Analyzer', tool: 'business-analysis', icon: BarChart3 },
    { name: 'Content Library', tool: 'content-library', icon: BookOpen },
    { name: 'Voice Profiles', tool: 'voice-profiles', icon: Mic }
  ];

  const contentTools = [
    { name: 'Content Library', tool: 'content-library', icon: BookOpen },
    { name: 'Voice Profiles', tool: 'voice-profiles', icon: Mic },
    { name: 'Business Analysis', tool: 'business-analysis', icon: BarChart3 },
    { name: 'Image Generator', tool: 'image-generator', icon: Camera },
    { name: 'Forms', tool: 'forms', icon: FileText },
    { name: 'AI Model Demo', tool: 'ai-model-demo', icon: Brain }
  ];

  const connectedApps = [
    { name: 'FunnelCraft AI', url: '/funnelcraft-ai', icon: Megaphone, isExternal: false },
    { name: 'SmartCRM Closer', url: '/smartcrm-closer', icon: Users, isExternal: false },
    { name: 'ContentAI', url: '/content-ai', icon: FileText, isExternal: false },
    { name: 'White-Label Customization', url: '/white-label', icon: Palette, isExternal: false },
    { name: 'WL Management Dashboard', url: '/white-label-management', icon: Settings, isExternal: false },
    { name: 'Revenue Sharing', url: '/revenue-sharing', icon: DollarSign, isExternal: false },
    { name: 'Package Builder', url: '/package-builder', icon: Package, isExternal: false },
    { name: 'Partner Dashboard', url: '/partner-dashboard', icon: Users, isExternal: false },
    { name: 'Partner Onboarding', url: '/partner-onboarding', icon: UserPlus, isExternal: false }
  ];

  const analyticsOptions = [
    { name: 'Analytics Dashboard', url: '/analytics', icon: BarChart3 },
    { name: 'Insights AI Module', url: '/analytics-remote', icon: Brain }
  ];



  // ===== All AI tool entries organized by categories =====
  const aiToolCategories = {
    'Core AI Tools': [
      { title: 'Email Analysis', id: 'email-analysis', icon: Mail },
      { title: 'Meeting Summarizer', id: 'meeting-summary', icon: Calendar },
      { title: 'Proposal Generator', id: 'proposal-generator', icon: FileText },
      { title: 'Call Script Generator', id: 'call-script-generator', icon: Phone },
      { title: 'Subject Line Optimizer', id: 'subject-optimizer', icon: Mail },
      { title: 'Competitor Analysis', id: 'competitor-analysis', icon: Shield },
      { title: 'Market Trends', id: 'market-trends', icon: TrendingUp },
      { title: 'Sales Insights', id: 'sales-insights', icon: BarChart3 },
      { title: 'Sales Forecast', id: 'sales-forecast', icon: LineChart },
    ],
    'Communication': [
      { title: 'Email Composer', id: 'email-composer-content', icon: Mail },
      { title: 'Objection Handler', id: 'objection-handler', icon: AlertTriangle },
      { title: 'Email Response', id: 'email-response', icon: Mail },
      { title: 'Voice Tone Optimizer', id: 'voice-tone-optimizer', icon: Volume2 },
    ],
    'Customer & Content': [
      { title: 'Customer Persona', id: 'customer-persona', icon: Users },
      { title: 'Visual Content Generator', id: 'visual-content-generator', icon: Image },
      { title: 'Meeting Agenda', id: 'meeting-agenda', icon: Calendar },
    ],
    'Advanced Features': [
      { title: 'AI Assistant', id: 'ai-assistant-chat', icon: Brain },
      { title: 'Vision Analyzer', id: 'vision-analyzer', icon: Eye },
      { title: 'Image Generator', id: 'image-generator', icon: Image },
      { title: 'Semantic Search', id: 'smart-search-realtime', icon: Search },
      { title: 'Function Assistant', id: 'function-assistant', icon: Code },
    ],
    'Real-time Features': [
      { title: 'Streaming Chat', id: 'ai-assistant-chat', icon: MessageSquare },
      { title: 'Form Validation', id: 'form-validation', icon: CheckSquare },
      { title: 'Live Deal Analysis', id: 'live-deal-analysis', icon: BarChart3 },
      { title: 'Instant Response', id: 'instant-response', icon: Zap },
      { title: 'Real-time Email Composer', id: 'realtime-email-composer', icon: Mail },
      { title: 'Voice Analysis Real-time', id: 'voice-analysis-realtime', icon: Volume2 },
    ],
    'Reasoning Generators': [
      { title: 'Reasoning Email', id: 'reasoning-email', icon: Mail },
      { title: 'Reasoning Proposal', id: 'reasoning-proposal', icon: FileText },
      { title: 'Reasoning Script', id: 'reasoning-script', icon: Phone },
      { title: 'Reasoning Objection', id: 'reasoning-objection', icon: AlertTriangle },
      { title: 'Reasoning Social', id: 'reasoning-social', icon: Megaphone },
    ]
  };

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
    console.log('Navigation triggered:', { route, tabName, currentPath: location.pathname });
    navigate(route);
    setActiveTab(tabName);
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
    // Force update to ensure tab state is properly set
    setTimeout(() => {
      setActiveTab(tabName);
    }, 100);
  }, [navigate, location.pathname]);

  const handleAIToolClick = useCallback((toolId: string) => {
    // Set the current tool & go to the hub page
    openAITool(toolId);
    navigate('/ai-tools');
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  }, [navigate, openAITool]);

  // Active tab based on route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/dashboard') setActiveTab('dashboard');
    else if (path === '/contacts') setActiveTab('contacts');
    else if (path === '/pipeline') setActiveTab('pipeline');
    else if (path === '/tasks' || path === '/appointments') setActiveTab('appointments');
    else if (path === '/ai-tools') setActiveTab('ai-tools');
    else if (path === '/analytics') setActiveTab('analytics');
    else if (path === '/ai-goals') setActiveTab('ai-goals');
    else setActiveTab('');
  }, [location.pathname]);

  const mainTabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      action: () => handleNavigation('/dashboard', 'dashboard'),
      badge: 1,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'contacts',
      label: 'Contacts',
      icon: Users,
      action: () => handleNavigation('/contacts', 'contacts'),
      badge: 10,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'pipeline',
      label: 'Pipeline',
      icon: Briefcase,
      action: () => handleNavigation('/pipeline', 'pipeline'),
      badge: 5,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: TrendingUp,
      action: () => toggleDropdown('analytics'),
      badge: 30,
      color: 'from-blue-500 to-cyan-500',
      hasDropdown: true
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
      action: () => toggleDropdown('ai-tools'),
      badge: Object.values(aiToolCategories).flat().length,
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'appointments',
      label: 'Calendar',
      icon: Calendar,
      action: () => handleNavigation('/appointments', 'appointments'),
      badge: 15,
      color: 'from-cyan-500 to-blue-500'
    }
  ];

  const dropdownMenus = [
    { id: 'sales', label: 'Sales', icon: DollarSign, badge: salesTools.length, color: 'from-green-500 to-teal-500', badgeColor: 'bg-green-500' },
    { id: 'communication', label: 'Comm', icon: MessageSquare, badge: communicationTools.length, color: 'from-blue-500 to-sky-500', badgeColor: 'bg-blue-500' },
    { id: 'business-intel', label: 'Business Intel', icon: BarChart3, badge: 35, color: 'from-amber-500 to-orange-500', badgeColor: 'bg-amber-500' },
    { id: 'wl', label: 'WL', icon: Globe, badge: connectedApps.length, color: 'from-indigo-500 to-purple-500', badgeColor: 'bg-indigo-500' },
    { id: 'intel', label: 'Intel', icon: Brain, badge: 1, color: 'from-purple-500 to-pink-500', badgeColor: 'bg-purple-500' },
    { id: 'apps', label: 'Apps', icon: Grid3X3, badge: connectedApps.length, color: 'from-purple-500 to-violet-500', badgeColor: 'bg-purple-500' }
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
    <nav className="fixed top-0 left-0 right-0 z-50 p-2">
      <div className="max-w-[90rem] mx-auto will-change-transform">
        <div className={`${isDark ? 'bg-gray-900/95 border-white/20' : 'bg-white/95 border-gray-200'} backdrop-blur-xl border rounded-full shadow-2xl transition-all duration-500 hover:shadow-3xl ring-1 ${isDark ? 'ring-white/10' : 'ring-gray-100'}`}>
          <div className="flex items-center justify-between px-6 py-2">

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
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        console.log('Tab clicked:', tab.id, tab.label);
                        tab.action(); 
                      }}
                      className={`
                        relative flex items-center space-x-1 px-2 py-1.5 rounded-full 
                        transition-all duration-300 transform hover:scale-105 text-xs
                        ${isActive 
                          ? `bg-gradient-to-r ${tab.color} text-white shadow-lg ring-2 ring-white/20` 
                          : `${isDark ? 'text-white hover:bg-white/20 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
                        }
                        group
                      `}
                      title={tab.label}
                    >
                      <tab.icon size={12} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                      <span className="text-xs font-medium hidden lg:block">{tab.label}</span>
                      {tab.badge && renderBadge(
                        tab.badge,
                        tab.id === 'pipeline' ? 'bg-green-500' :
                        tab.id === 'contacts' ? 'bg-purple-500' :
                        tab.id === 'ai-goals' ? 'bg-orange-500' :
                        tab.id === 'ai-tools' ? 'bg-pink-500' :
                        tab.id === 'appointments' ? 'bg-cyan-500' :
                        tab.id === 'analytics' ? 'bg-blue-500' :
                        'bg-blue-500'
                      )}
                      {(tab.id === 'ai-tools' || tab.id === 'analytics') && (
                        <ChevronDown size={12} className={`transition-transform duration-300 ${activeDropdown === tab.id ? 'rotate-180' : ''}`} />
                      )}
                      {isActive && <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-full opacity-20 animate-pulse`}></div>}
                    </button>

                    {/* AI Tools Dropdown */}
                    {tab.id === 'ai-tools' && activeDropdown === 'ai-tools' && (
                      <div className={`absolute top-14 right-0 w-64 ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-2xl border ${isDark ? 'border-white/10' : 'border-gray-200'} rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in`}>
                        <div className="p-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                          {Object.values(aiToolCategories).flat().slice(0, 8).map((tool) => (
                            <button
                              key={tool.id}
                              onClick={() => handleAIToolClick(tool.id)}
                              className={`w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${isDark ? 'hover:bg-white/5 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}`}
                            >
                              {tool.icon ? <tool.icon size={16} className="text-pink-500" /> : <Sparkles size={16} className="text-pink-500" />}
                              <span className="text-sm font-medium">{tool.title}</span>
                            </button>
                          ))}
                        </div>
                        <div className="p-3 border-t border-gray-200/30">
                          <button
                            onClick={() => handleNavigation('/ai-tools', 'ai-tools')}
                            className={`w-full py-2 px-4 rounded-xl border-2 border-dashed transition-all duration-200 ${isDark ? 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white' : 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-900'}`}
                          >
                            View All AI Tools
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Analytics Dropdown */}
                    {tab.id === 'analytics' && activeDropdown === 'analytics' && (
                      <div className={`absolute top-14 right-0 w-64 ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-2xl border ${isDark ? 'border-white/10' : 'border-gray-200'} rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in`}>
                        <div className="p-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                          {analyticsOptions.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                navigate(option.url);
                                setActiveDropdown(null);
                                setIsMobileMenuOpen(false);
                              }}
                              className={`w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${isDark ? 'hover:bg-white/5 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}`}
                            >
                              <option.icon size={16} className="text-blue-500" />
                              <span className="text-sm font-medium">{option.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Dropdowns */}
              {dropdownMenus.map(menu => (
                <div key={menu.id} className="relative">
                  <button
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      if (menu.id === 'business-intel') {
                        handleNavigation('/business-intel', 'business-intel');
                      } else if (menu.id === 'intel') {
                        handleNavigation('/intel', 'intel');
                      } else {
                        toggleDropdown(menu.id, e);
                      }
                    }}
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
                    {menu.id === 'communication' && <MessageSquare size={14} className="transition-transform duration-300 group-hover:scale-110" />}
                    {menu.id === 'business-intel' && <BarChart3 size={14} className="transition-transform duration-300 group-hover:scale-110" />}
                    {menu.id === 'wl' && <Globe size={14} className="transition-transform duration-300 group-hover:scale-110" />}
                    {menu.id === 'intel' && <Brain size={14} className="transition-transform duration-300 group-hover:scale-110" />}
                    {menu.id === 'apps' && <Grid3X3 size={14} className="transition-transform duration-300 group-hover:scale-110" />}

                    <span className="text-xs font-medium">
                      {menu.id === 'sales' ? 'Sales'
                        : menu.id === 'communication' ? 'Comm'
                        : menu.id === 'business-intel' ? 'Business Intel'
                        : menu.id === 'wl' ? 'WL'
                        : menu.id === 'intel' ? 'Intel'
                        : 'Apps'}
                    </span>
                    {/* Only show chevron for dropdown menus */}
                    {(menu.id === 'sales' || menu.id === 'communication' || menu.id === 'apps' || menu.id === 'wl') && (
                      <ChevronDown size={12} className={`transition-transform duration-300 ${activeDropdown === menu.id ? 'rotate-180' : ''}`} />
                    )}
                    {renderBadge(menu.badge, menu.badgeColor)}
                    {activeDropdown === menu.id && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${menu.color} rounded-full opacity-20 animate-pulse`}></div>
                    )}
                  </button>



                  {/* Other dropdown panels (sales/tasks/communication/content/apps) — keep your existing code */}
                  {menu.id === 'sales' && activeDropdown === 'sales' && (
                    <div className={`absolute top-14 right-0 w-64 ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-2xl border ${isDark ? 'border-white/10' : 'border-gray-200'} rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in`}>
                      <div className="p-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                        {salesTools.map((tool, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              console.log('Sales tool clicked:', tool.tool, tool.name);
                              const routeMap: { [key: string]: string } = {
                                'deal-pipeline': '/pipeline-intelligence',
                                'deal-risk': '/deal-risk-monitor',
                                'conversion-insights': '/smart-conversion-insights',
                                'pipeline-health': '/pipeline-health-dashboard',
                                'sales-cycle': '/sales-cycle-analytics',
                                'win-rate-analysis': '/win-rate-intelligence',
                                'ai-sales-forecast': '/ai-sales-forecast',
                                'live-deal-analysis': '/live-deal-analysis',
                                'competitor-insights': '/competitor-insights',
                                'revenue-intelligence': '/revenue-intelligence'
                              };
                              
                              const route = routeMap[tool.tool] || `/${tool.tool}`;
                              navigate(route);
                              setActiveDropdown(null);
                              setIsMobileMenuOpen(false);
                            }}
                            className={`w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${isDark ? 'hover:bg-white/5 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}`}
                          >
                            <tool.icon size={16} className="text-green-500" />
                            <span className="text-sm font-medium">{tool.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {menu.id === 'communication' && activeDropdown === 'communication' && (
                    <div className={`absolute top-14 right-0 w-64 ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-2xl border ${isDark ? 'border-white/10' : 'border-gray-200'} rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in`}>
                      <div className="p-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                        {communicationTools.map((tool, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              navigate(`/${tool.tool}`); 
                              setActiveDropdown(null); 
                              setIsMobileMenuOpen(false); 
                            }}
                            className={`w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${isDark ? 'hover:bg-white/5 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}`}
                          >
                            <tool.icon size={16} className="text-blue-500" />
                            <span className="text-sm font-medium">{tool.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {menu.id === 'business-intel' && activeDropdown === 'business-intel' && (
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setActiveDropdown(null)}>
                      <div className={`absolute inset-4 ${isDark ? 'bg-gray-900/98' : 'bg-white/98'} backdrop-blur-2xl border ${isDark ? 'border-white/10' : 'border-gray-200'} rounded-2xl shadow-2xl overflow-hidden`} onClick={(e) => e.stopPropagation()}>
                        <div className="h-full flex flex-col">
                          <div className="flex items-center justify-between p-4 border-b border-gray-200/30">
                            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Business Intelligence Dashboard - Full Screen</h3>
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => window.open('https://ai-powered-analytics-fibd.bolt.host', '_blank')}
                                className={`p-2 rounded-md ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                                title="Open in new tab"
                              >
                                <ExternalLink size={16} />
                              </button>
                              <button 
                                onClick={() => setActiveDropdown(null)}
                                className={`p-2 rounded-md ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                                title="Close"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="flex-1 p-2">
                            <iframe
                              src="https://ai-powered-analytics-fibd.bolt.host"
                              className="w-full h-full rounded-xl border-0"
                              title="Business Intelligence Dashboard"
                              frameBorder="0"
                              allow="clipboard-read; clipboard-write; fullscreen; microphone; camera"
                              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-navigation allow-top-navigation"
                              onLoad={(e) => {
                                try {
                                  (e.target as HTMLIFrameElement).contentWindow?.postMessage({
                                    type: 'FULLSCREEN_MODE',
                                    fullscreen: true
                                  }, '*');
                                } catch (error) {
                                  console.log('Could not communicate with iframe');
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {menu.id === 'wl' && activeDropdown === 'wl' && (
                    <div className={`absolute top-14 right-0 w-72 ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-2xl border ${isDark ? 'border-white/10' : 'border-gray-200'} rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in`}>
                      <div className="p-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
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
                                <app.icon size={16} className="text-indigo-500" />
                                <span className="text-sm font-medium">{app.name}</span>
                              </div>
                              <ExternalLink size={12} className="opacity-50" />
                            </a>
                          ) : (
                            <button
                              key={index}
                              onClick={() => {
                                handleNavigation(app.url, 'white-label');
                                setActiveDropdown(null);
                                setIsMobileMenuOpen(false);
                              }}
                              className={`w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${isDark ? 'hover:bg-white/5 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}`}
                            >
                              <app.icon size={16} className="text-indigo-500" />
                              <span className="text-sm font-medium">{app.name}</span>
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {menu.id === 'intel' && activeDropdown === 'intel' && (
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setActiveDropdown(null)}>
                      <div className={`absolute inset-4 ${isDark ? 'bg-gray-900/98' : 'bg-white/98'} backdrop-blur-2xl border ${isDark ? 'border-white/10' : 'border-gray-200'} rounded-2xl shadow-2xl overflow-hidden`} onClick={(e) => e.stopPropagation()}>
                        <div className="h-full flex flex-col">
                          <div className="flex items-center justify-between p-4 border-b border-gray-200/30">
                            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Intel Dashboard - Full Screen</h3>
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => window.open('https://clever-syrniki-4df87f.netlify.app/', '_blank')}
                                className={`p-2 rounded-md ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                                title="Open in new tab"
                              >
                                <ExternalLink size={16} />
                              </button>
                              <button 
                                onClick={() => setActiveDropdown(null)}
                                className={`p-2 rounded-md ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                                title="Close"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="flex-1 p-2">
                            <iframe
                              src="https://clever-syrniki-4df87f.netlify.app/"
                              className="w-full h-full rounded-xl border-0"
                              title="Intel Dashboard"
                              frameBorder="0"
                              allow="clipboard-read; clipboard-write; fullscreen; microphone; camera"
                              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-navigation allow-top-navigation"
                              onLoad={(e) => {
                                try {
                                  (e.target as HTMLIFrameElement).contentWindow?.postMessage({
                                    type: 'FULLSCREEN_MODE',
                                    fullscreen: true
                                  }, '*');
                                } catch (error) {
                                  console.log('Could not communicate with iframe');
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  

                  {menu.id === 'apps' && activeDropdown === 'apps' && (
                    <div className={`absolute top-14 right-0 w-72 ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-2xl border ${isDark ? 'border-white/10' : 'border-gray-200'} rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in`}>
                      <div className="p-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
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