
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Users, TrendingUp, Zap, Star, Play } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const LandingPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "AI-Powered Automation",
      description: "Automate your sales process with intelligent AI assistants that work 24/7"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Smart Contact Management",
      description: "Organize and track all your leads and customers with advanced AI insights"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Get deep insights into your sales performance and pipeline health"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      company: "TechCorp Solutions",
      rating: 5,
      text: "Smart CRM has transformed our sales process completely. The AI features save us hours every day."
    },
    {
      name: "Mike Chen",
      company: "StartupXYZ",
      rating: 5,
      text: "The automation and insights we get are incredible. Our conversion rates improved by 40%."
    },
    {
      name: "Emily Rodriguez",
      company: "Global Dynamics",
      rating: 5,
      text: "Best CRM investment we've made. The interface is intuitive and the AI is remarkably smart."
    }
  ];

  const stats = [
    { number: "250+", label: "Companies Trust Us" },
    { number: "40%", label: "Increase in Sales" },
    { number: "60%", label: "Time Saved Daily" },
    { number: "99.9%", label: "Uptime Guarantee" }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <header className={`${isDark ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-sm border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
              <span className="text-xl font-bold">Smart CRM</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/features" className={`${isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'} transition-colors`}>Features</Link>
              <Link to="/pricing" className={`${isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'} transition-colors`}>Pricing</Link>
              <Link to="/about" className={`${isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'} transition-colors`}>About</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link 
                to="/signin" 
                className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              The Future of
              <br />
              Sales Management
            </h1>
            <p className={`text-xl md:text-2xl ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-8 max-w-3xl mx-auto`}>
              Supercharge your sales team with AI-powered insights, automation, and smart contact management that drives results.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link 
                to="/signup"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <button 
                onClick={() => navigate('/demo')}
                className={`${isDark ? 'text-white border-white hover:bg-white hover:text-gray-900' : 'text-gray-900 border-gray-900 hover:bg-gray-900 hover:text-white'} border-2 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 flex items-center`}
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-16 ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">{stat.number}</div>
                <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm md:text-base`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful Features for
              <span className="text-blue-500"> Modern Sales Teams</span>
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-3xl mx-auto`}>
              Everything you need to streamline your sales process and close more deals
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`${isDark ? 'bg-gray-800/50' : 'bg-white'} p-8 rounded-2xl border ${isDark ? 'border-gray-700' : 'border-gray-200'} hover:border-blue-500 transition-all duration-200`}>
                <div className="text-blue-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`py-20 ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Trusted by <span className="text-blue-500">Sales Leaders</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className={`${isDark ? 'bg-gray-800/50' : 'bg-white'} p-6 rounded-2xl border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mb-4`}>"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Sales?
          </h2>
          <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-8 max-w-2xl mx-auto`}>
            Join thousands of sales teams using Smart CRM to close more deals and grow their business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              to="/signup"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              to="/signin"
              className={`${isDark ? 'text-white border-white hover:bg-white hover:text-gray-900' : 'text-gray-900 border-gray-900 hover:bg-gray-900 hover:text-white'} border-2 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200`}
            >
              Sign In
            </Link>
          </div>
          <p className={`${isDark ? 'text-gray-500' : 'text-gray-500'} text-sm mt-4`}>
            No credit card required • Free for 14 days
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'} border-t py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
                <span className="text-xl font-bold">Smart CRM</span>
              </div>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                The future of sales management with AI-powered insights and automation.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/features" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Features</Link></li>
                <li><Link to="/pricing" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Pricing</Link></li>
                <li><Link to="/integrations" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>About</Link></li>
                <li><Link to="/contact" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Contact</Link></li>
                <li><Link to="/careers" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/help" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Help Center</Link></li>
                <li><Link to="/docs" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Documentation</Link></li>
                <li><Link to="/api" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>API</Link></li>
              </ul>
            </div>
          </div>
          <div className={`${isDark ? 'border-gray-700' : 'border-gray-200'} border-t mt-8 pt-8 text-center`}>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
              © 2024 Smart CRM. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
