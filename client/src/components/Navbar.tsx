
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Home, 
  Users, 
  BarChart3, 
  CheckSquare, 
  Calendar, 
  Bot, 
  MessageSquare, 
  Settings, 
  Menu, 
  X,
  Bell,
  Search,
  User
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Contacts', path: '/contacts', icon: Users },
    { name: 'Pipeline', path: '/pipeline', icon: BarChart3 },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Calendar', path: '/appointments', icon: Calendar },
    { name: 'AI Tools', path: '/ai-tools', icon: Bot },
    { name: 'Communications', path: '/communications', icon: MessageSquare },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${isDark ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'} backdrop-blur-xl border-b transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SC</span>
              </div>
              <span className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Smart CRM
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                      isActive(item.path)
                        ? isDark
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-100 text-blue-700'
                        : isDark
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} transition-colors`}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            
            <button className={`p-2 rounded-lg ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} transition-colors`}>
              <Bell size={20} />
            </button>
            
            <button className={`p-2 rounded-lg ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} transition-colors`}>
              <Search size={20} />
            </button>

            {/* User menu */}
            <div className="flex items-center space-x-2">
              <button className={`p-2 rounded-lg ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} transition-colors`}>
                <User size={20} />
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-md ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center space-x-2 ${
                    isActive(item.path)
                      ? isDark
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-100 text-blue-700'
                      : isDark
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
