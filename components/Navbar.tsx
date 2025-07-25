import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAITools } from '../components/AIToolsProvider';
import { 
  Home, 
  Users, 
  Briefcase, 
  CheckSquare, 
  Settings, 
  Menu, 
  X,
  Brain,
  Mail,
  MessageSquare,
  FileText,
  Phone,
  Target,
  FileSearch,
  TrendingUp,
  BarChart3,
  PieChart,
  ChevronDown,
  ChevronRight,
  Video,
  MessageCircle,
  CalendarDays,
  Map,
  FileSpreadsheet,
  Package,
  Receipt,
  Building,
  Music,
  Headphones,
  Image,
  HelpCircle
} from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const [salesMenuOpen, setSalesMenuOpen] = useState(false);
  const [marketingMenuOpen, setMarketingMenuOpen] = useState(false);
  const [contentMenuOpen, setContentMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const { openTool } = useAITools();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleAiMenu = () => setAiMenuOpen(!aiMenuOpen);
  const toggleSalesMenu = () => setSalesMenuOpen(!salesMenuOpen);
  const toggleMarketingMenu = () => setMarketingMenuOpen(!marketingMenuOpen);
  const toggleContentMenu = () => setContentMenuOpen(!contentMenuOpen);
  
  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { path: '/contacts', icon: <Users size={20} />, label: 'Contacts' },
    { path: '/pipeline', icon: <Briefcase size={20} />, label: 'Pipeline' },
    { path: '/tasks', icon: <CheckSquare size={20} />, label: 'Tasks',
      subItems: [
        { path: '/tasks', icon: <CheckSquare size={18} />, label: 'Task List' },
        { path: '/tasks/calendar', icon: <CalendarDays size={18} />, label: 'Calendar View' }
      ]
    },
    { 
      path: '/sales-tools', 
      icon: <CheckSquare size={20} />, 
      label: 'Sales Tools',
      subItems: [
        { path: '/appointments', icon: <CalendarDays size={18} />, label: 'Appointments' },
        { path: '/video-email', icon: <Video size={18} />, label: 'Video Email' },
        { path: '/text-messages', icon: <MessageCircle size={18} />, label: 'Text Messages' },
        { path: '/phone-system', icon: <Phone size={18} />, label: 'Phone System' },
        { path: '/invoicing', icon: <Receipt size={18} />, label: 'Invoicing' },
      ]
    },
    { 
      path: '/marketing-tools', 
      icon: <Target size={20} />, 
      label: 'Marketing',
      subItems: [
        { path: '/lead-automation', icon: <Target size={18} />, label: 'Lead Automation' },
        { path: '/circle-prospecting', icon: <Map size={18} />, label: 'Circle Prospecting' },
        { path: '/forms-surveys', icon: <FileSpreadsheet size={18} />, label: 'Forms & Surveys' }
      ]
    },
    { 
      path: '/ai-tools', 
      icon: <Brain size={20} />, 
      label: 'AI Tools',
      subItems: [
        { id: 'email-analysis', icon: <Mail size={18} />, label: 'Email Analysis' },
        { id: 'meeting-summary', icon: <MessageSquare size={18} />, label: 'Meeting Summarizer' },
        { id: 'proposal-generator', icon: <FileText size={18} />, label: 'Proposal Generator' },
        { id: 'call-script', icon: <Phone size={18} />, label: 'Call Script Generator' },
        { id: 'subject-optimizer', icon: <Target size={18} />, label: 'Subject Line Optimizer' },
        { id: 'competitor-analysis', icon: <FileSearch size={18} />, label: 'Competitor Analysis' },
        { id: 'market-trends', icon: <TrendingUp size={18} />, label: 'Market Trend Analysis' },
        { id: 'sales-insights', icon: <BarChart3 size={18} />, label: 'Sales Insights Generator' },
        { id: 'sales-forecast', icon: <PieChart size={18} />, label: 'Sales Forecasting' },
        { path: '/business-analyzer', icon: <Building size={18} />, label: 'Business Analyzer' }
      ]
    },
    { 
      path: '/content-management', 
      icon: <FileText size={20} />, 
      label: 'Content',
      subItems: [
        { path: '/content-library', icon: <Headphones size={18} />, label: 'Content Library' },
        { path: '/voice-profiles', icon: <Music size={18} />, label: 'Voice Profiles' },
        { path: '/image-library', icon: <Image size={18} />, label: 'Image Library' },
      ]
    },
    { path: '/faq', icon: <HelpCircle size={20} />, label: 'FAQ' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isActiveParent = (path: string) => location.pathname.startsWith(path);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              <span>Smart</span>
              <span>CRM</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => 
              item.subItems ? (
                <div key={item.path || item.label} className="relative group inline-block">
                  <Link 
                    to={item.path || '/ai-tools'}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActiveParent(item.path || '/ai-tools') 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
                    } transition-colors duration-200`}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                    <ChevronDown size={16} className="ml-1" />
                  </Link>
                  <div className="hidden group-hover:block absolute z-10 w-56 mt-1 bg-white rounded-md shadow-lg border border-gray-100">
                    <div className="py-1">
                      {item.subItems.map((subItem) => (
                        subItem.path ? (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={`flex items-center px-4 py-2 text-sm ${
                              isActive(subItem.path) 
                                ? 'bg-blue-50 text-blue-600' 
                                : 'text-gray-700 hover:bg-gray-50'
                            } transition-colors duration-200`}
                          >
                            {subItem.icon}
                            <span className="ml-2">{subItem.label}</span>
                          </Link>
                        ) : (
                          <button
                            key={subItem.id}
                            onClick={() => openTool(subItem.id as any)}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          >
                            {subItem.icon}
                            <span className="ml-2">{subItem.label}</span>
                          </button>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive(item.path) 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
                  } transition-colors duration-200`}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Link>
              )
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <div key={item.path || item.label}>
                {item.subItems ? (
                  <>
                    <div 
                      className={`flex items-center justify-between px-3 py-2 rounded-md ${
                        isActiveParent(item.path || '/ai-tools') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        if (item.label === 'AI Tools') toggleAiMenu();
                        if (item.label === 'Sales Tools') toggleSalesMenu();
                        if (item.label === 'Marketing') toggleMarketingMenu();
                        if (item.label === 'Content') toggleContentMenu();
                        if (item.label === 'Tasks') toggleContentMenu();
                      }}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span className="ml-2 text-sm font-medium">{item.label}</span>
                      </div>
                      {
                        (item.label === 'AI Tools' && aiMenuOpen) || 
                        (item.label === 'Sales Tools' && salesMenuOpen) || 
                        (item.label === 'Marketing' && marketingMenuOpen) ||
                        (item.label === 'Content' && contentMenuOpen) ? 
                          <ChevronDown size={18} /> : <ChevronRight size={18} />
                      }
                    </div>
                    
                    {
                      (
                        (item.label === 'AI Tools' && aiMenuOpen) ||
                        (item.label === 'Sales Tools' && salesMenuOpen) ||
                        (item.label === 'Marketing' && marketingMenuOpen) ||
                        (item.label === 'Content' && contentMenuOpen) ||
                        (item.label === 'Tasks' && contentMenuOpen)
                      ) && (
                        <div className="pl-6 mt-1 space-y-1">
                          {item.subItems.map((subItem) => (
                            subItem.path ? (
                              <Link
                                key={subItem.path}
                                to={subItem.path}
                                className={`flex items-center px-3 py-2 text-sm rounded-md ${
                                  isActive(subItem.path) ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                                onClick={() => setIsOpen(false)}
                              >
                                {subItem.icon}
                                <span className="ml-2">{subItem.label}</span>
                              </Link>
                            ) : (
                              <button
                                key={subItem.id}
                                onClick={() => {
                                  openTool(subItem.id as any);
                                  setIsOpen(false);
                                }}
                                className="flex w-full items-center px-3 py-2 text-sm rounded-md text-gray-600 hover:bg-gray-50"
                              >
                                {subItem.icon}
                                <span className="ml-2">{subItem.label}</span>
                              </button>
                            )
                          ))}
                        </div>
                      )
                    }
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive(item.path) ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;