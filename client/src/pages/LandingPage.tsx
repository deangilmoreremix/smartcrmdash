
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Users, TrendingUp, Zap, Star, Play, Search, MessageSquare, BarChart3, Mail, Bot, Eye, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const LandingPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Bot className="w-8 h-8" />,
      title: "AI Assistant",
      description: "Smart AI that helps automate your sales workflow"
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Search",
      description: "Advanced search capabilities to find anything instantly"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Contacts",
      description: "Manage all your contacts with intelligent insights"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics",
      description: "Get deep insights into your sales performance"
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Communication",
      description: "Seamless communication across all channels"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Automation",
      description: "Automate repetitive tasks and focus on selling"
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Visuals",
      description: "Beautiful visual reports and dashboards"
    }
  ];

  const floatingIcons = [
    { icon: <Bot className="w-6 h-6" />, label: "AI Assistant", position: "top-20 left-20" },
    { icon: <Search className="w-6 h-6" />, label: "Search", position: "top-32 left-40" },
    { icon: <Users className="w-6 h-6" />, label: "Contacts", position: "top-48 left-32" },
    { icon: <BarChart3 className="w-6 h-6" />, label: "Analytics", position: "top-20 right-20" },
    { icon: <Mail className="w-6 h-6" />, label: "Communication", position: "top-32 right-40" },
    { icon: <Zap className="w-6 h-6" />, label: "Automation", position: "top-48 right-32" },
    { icon: <Eye className="w-6 h-6" />, label: "Visuals", position: "bottom-32 left-24" },
    { icon: <Sparkles className="w-6 h-6" />, label: "AI Magic", position: "bottom-40 right-28" }
  ];

  const companies = [
    { name: "TechCorp", letter: "T" },
    { name: "Innovative Inc", letter: "I" },
    { name: "GlobalSoft", letter: "G" },
    { name: "FutureTech", letter: "F" },
    { name: "NextGen Solutions", letter: "N" },
    { name: "Digital Dynamics", letter: "D" }
  ];

  const demoFeatures = [
    { name: "AI Email Composer", active: false },
    { name: "Meeting Summarizer", active: false },
    { name: "AI Lead Scoring", active: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Floating Icons */}
      {floatingIcons.map((item, index) => (
        <div
          key={index}
          className={`absolute ${item.position} animate-bounce`}
          style={{
            animationDelay: `${index * 0.2}s`,
            animationDuration: '3s'
          }}
        >
          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-lg border border-white/20 hover:scale-110 transition-transform duration-300">
            <div className="text-blue-600">{item.icon}</div>
            <div className="text-xs text-gray-600 mt-1 font-medium">{item.label}</div>
          </div>
        </div>
      ))}

      {/* Header */}
      <header className="relative z-50 bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900">SmartCRM</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <div className="relative group">
                <button className="text-gray-700 hover:text-blue-600 transition-colors flex items-center">
                  Features
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              <Link to="/pricing" className="text-gray-700 hover:text-blue-600 transition-colors">Pricing</Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors">About Us</Link>
              <Link to="/faq" className="text-gray-700 hover:text-blue-600 transition-colors">FAQ</Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link 
                to="/signin" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Log In
              </Link>
              <Link 
                to="/signup" 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Experience the Future of
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Sales Technology
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Our AI-powered CRM transforms how sales teams work by automating routine tasks,
            providing deep insights, and helping you close more deals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <Link 
              to="/signup"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center"
            >
              Try it for Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <button 
              onClick={() => navigate('/demo')}
              className="text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all duration-200"
            >
              Explore Features
            </button>
          </div>

          {/* Trusted by Companies */}
          <div className="mb-16">
            <p className="text-gray-500 mb-8">Trusted by innovative companies worldwide</p>
            <div className="flex justify-center items-center space-x-8 flex-wrap">
              {companies.map((company, index) => (
                <div key={index} className="flex items-center space-x-2 text-gray-400">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold">
                    {company.letter}
                  </div>
                  <span className="font-medium">{company.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Demo Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Experience Our Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how our AI-powered CRM can help you streamline your workflow
            </p>
          </div>

          {/* Interactive Demo */}
          <div className="max-w-4xl mx-auto">
            {/* Feature Tabs */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                {demoFeatures.map((feature, index) => (
                  <button
                    key={index}
                    className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      feature.active
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {feature.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Demo Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Contact: Sarah Williams</h3>
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah Williams</h4>
                  <p className="text-gray-600 text-sm">CTO, TechCorp Inc</p>
                </div>
                <div className="ml-auto">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    87
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Engagement</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Fit Score</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Budget Match</span>
                    <span className="font-medium">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Sales?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of sales teams using Smart CRM to close more deals and grow their business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              to="/signup"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              to="/signin"
              className="text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            No credit card required • Free for 14 days
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-white/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
                <span className="text-xl font-bold text-gray-900">SmartCRM</span>
              </div>
              <p className="text-gray-600 text-sm">
                The future of sales management with AI-powered insights and automation.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</Link></li>
                <li><Link to="/integrations" className="text-gray-600 hover:text-gray-900 transition-colors">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About</Link></li>
                <li><Link to="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</Link></li>
                <li><Link to="/careers" className="text-gray-600 hover:text-gray-900 transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/help" className="text-gray-600 hover:text-gray-900 transition-colors">Help Center</Link></li>
                <li><Link to="/docs" className="text-gray-600 hover:text-gray-900 transition-colors">Documentation</Link></li>
                <li><Link to="/api" className="text-gray-600 hover:text-gray-900 transition-colors">API</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-gray-600 text-sm">
              © 2024 Smart CRM. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
