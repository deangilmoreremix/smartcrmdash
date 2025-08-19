import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
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
  ChevronRight,
  CheckCheck,
  ArrowRight,
  Play,
  User,
  Clock,
  Star,
  ExternalLink,
  BarChart,
  Users,
  Briefcase,
  Eye,
  Image,
  Mic,
  Search,
  Zap,
  Calendar
} from 'lucide-react';

// Import landing page components
import PricingCard from './landing/components/PricingCard';
import FeatureCard from './landing/components/FeatureCard';
import TestimonialCard from './landing/components/TestimonialCard';

const LandingPage = () => {
  // Function to handle page initialization only once
  useEffect(() => {
    const preloadHighPriorityAssets = () => {
      // Preload critical images
      const criticalImages = [
        'https://images.pexels.com/photos/6476582/pexels-photo-6476582.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      ];
      
      if (typeof window !== 'undefined') {
        criticalImages.forEach(url => {
          const img = new window.Image();
          img.src = url;
        });
      }
    };

    // Call the preload function
    preloadHighPriorityAssets();
  }, []);  // Empty dependency array ensures this only runs once
  
  return (
    <div className="bg-white content-stable">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Smart CRM</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors">FAQ</a>
              <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors">Sign In</Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white overflow-hidden relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Smart CRM for Modern Sales Teams
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Boost your sales with AI-powered insights, automated workflows, and comprehensive customer relationship management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/dashboard" className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
                Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Counter Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The Impact of Smart CRM</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Real results from businesses using our AI-powered CRM platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">32%</div>
              <div className="text-gray-600">Sales Growth</div>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">9.5</div>
              <div className="text-gray-600">Hours Saved Weekly</div>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <BarChart className="h-8 w-8 text-purple-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">24%</div>
              <div className="text-gray-600">Lead Conversion</div>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <Users className="h-8 w-8 text-orange-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">5000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 content-stable" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              All the Features You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Smart CRM combines powerful sales tools with advanced AI capabilities to streamline your workflow and boost your results.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="h-8 w-8 text-blue-600" />}
              title="AI Sales Tools"
              description="Access 20+ AI tools to automate tasks, get insights, and personalize your sales approach."
              link="/features/ai-tools"
            />
            
            <FeatureCard
              icon={<Users className="h-8 w-8 text-indigo-600" />}
              title="Contact Management"
              description="Organize and track all your contacts, leads, and accounts in one unified database."
              link="/features/contacts"
            />
            
            <FeatureCard
              icon={<Briefcase className="h-8 w-8 text-violet-600" />}
              title="Deal Pipeline"
              description="Visualize and optimize your sales pipeline with drag-and-drop simplicity and AI insights."
              link="/features/pipeline"
            />
            
            <FeatureCard
              icon={<Brain className="h-8 w-8 text-fuchsia-600" />}
              title="AI Assistant"
              description="Work with a context-aware AI assistant that remembers conversations and takes actions for you."
              link="/features/ai-assistant"
            />
            
            <FeatureCard
              icon={<Eye className="h-8 w-8 text-cyan-600" />}
              title="Vision Analyzer"
              description="Extract insights from images, documents, competitor materials, and visual content."
              link="/features/vision-analyzer"
            />
            
            <FeatureCard
              icon={<Image className="h-8 w-8 text-emerald-600" />}
              title="Image Generator"
              description="Create professional images for presentations, proposals, and marketing materials instantly."
              link="/features/image-generator"
            />
            
            <FeatureCard
              icon={<Mic className="h-8 w-8 text-indigo-600" />}
              title="Voice Features"
              description="Voice profiles and audio management for your sales content."
              link="/voice-profiles"
            />
            
            <FeatureCard
              icon={<Search className="h-8 w-8 text-blue-600" />}
              title="Semantic Search"
              description="Find anything in your CRM with natural language queries and contextual understanding."
              link="/features/semantic-search"
            />
            
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-yellow-600" />}
              title="Function Assistant"
              description="Let AI perform real actions in your CRM through natural conversation."
              link="/features/function-assistant"
            />
          </div>
          
          <div className="text-center mt-12">
            <Link to="/ai-tools" className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors">
              Explore AI Tools <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* AI Highlights Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 content-stable">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              AI-Powered Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our cutting-edge AI tools designed specifically for sales professionals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Link to="/features/ai-assistant" className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col hover:border-indigo-300 transform hover:-translate-y-1">
              <div className="p-3 bg-indigo-100 rounded-full w-min mb-4">
                <Brain className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Sales Assistant</h3>
              <p className="text-gray-600 mb-4 flex-1">Get a context-aware AI assistant that can search your CRM, schedule tasks, and take actions for you.</p>
              <span className="text-indigo-600 flex items-center mt-auto">Learn more <ChevronRight className="h-4 w-4 ml-1" /></span>
            </Link>
            
            <Link to="/features/vision-analyzer" className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col hover:border-cyan-300 transform hover:-translate-y-1">
              <div className="p-3 bg-cyan-100 rounded-full w-min mb-4">
                <Eye className="h-6 w-6 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Vision Analysis</h3>
              <p className="text-gray-600 mb-4 flex-1">Upload images of competitor materials, business cards, or documents to extract insights automatically.</p>
              <span className="text-cyan-600 flex items-center mt-auto">Learn more <ChevronRight className="h-4 w-4 ml-1" /></span>
            </Link>
            
            <Link to="/features/image-generator" className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col hover:border-emerald-300 transform hover:-translate-y-1">
              <div className="p-3 bg-emerald-100 rounded-full w-min mb-4">
                <Image className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Image Generation</h3>
              <p className="text-gray-600 mb-4 flex-1">Create professional presentations, marketing materials, and proposal images using AI.</p>
              <span className="text-emerald-600 flex items-center mt-auto">Learn more <ChevronRight className="h-4 w-4 ml-1" /></span>
            </Link>
            
            <Link to="/features/semantic-search" className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col hover:border-blue-300 transform hover:-translate-y-1">
              <div className="p-3 bg-blue-100 rounded-full w-min mb-4">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Semantic Search</h3>
              <p className="text-gray-600 mb-4 flex-1">Find anything in your CRM using natural language. Ask questions and get intelligent answers.</p>
              <span className="text-blue-600 flex items-center mt-auto">Learn more <ChevronRight className="h-4 w-4 ml-1" /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start free and scale as you grow. All plans include our core CRM features.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              tier="Starter"
              price={0}
              description="Perfect for getting started"
              features={[
                "Up to 1,000 contacts",
                "Basic pipeline management",
                "Email integration",
                "Mobile app access",
                "Standard support"
              ]}
              buttonText="Get Started Free"
            />
            
            <PricingCard
              tier="Professional"
              price={29}
              description="Most popular choice"
              features={[
                "Unlimited contacts",
                "Advanced AI tools",
                "Custom automation",
                "Advanced analytics",
                "Priority support",
                "Integrations"
              ]}
              buttonText="Start Free Trial"
              popular={true}
            />
            
            <PricingCard
              tier="Enterprise"
              price={99}
              description="For large organizations"
              features={[
                "Everything in Professional",
                "Custom AI models",
                "Advanced security",
                "Dedicated support",
                "Custom integrations",
                "Training & onboarding"
              ]}
              buttonText="Contact Sales"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of sales teams who have transformed their results with Smart CRM.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="This CRM transformed our sales process. The AI insights helped us increase our close rate by 40%."
              name="Sarah Johnson"
              position="Sales Director"
              company="TechCorp Inc."
              image="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
              stars={5}
            />
            
            <TestimonialCard
              quote="The automation features saved us 20 hours per week. Best investment we've made for our sales team."
              name="Michael Chen"
              position="Founder"
              company="StartupXYZ"
              image="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
              stars={5}
            />
            
            <TestimonialCard
              quote="Incredible platform! The communication hub keeps all our customer interactions organized and accessible."
              name="Emily Davis"
              position="Marketing Manager"
              company="GrowthCo"
              image="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
              stars={5}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50" id="faq">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-2">How does the AI assistant work?</h3>
                <p className="text-gray-600">Our AI assistant uses advanced natural language processing to understand your requests and take actions within your CRM. It can search for contacts, create tasks, analyze deals, and much more.</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Can I integrate with other tools?</h3>
                <p className="text-gray-600">Yes! Smart CRM integrates with popular tools like Gmail, Slack, Calendly, and hundreds of other applications through our API and native integrations.</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Is my data secure?</h3>
                <p className="text-gray-600">Absolutely. We use enterprise-grade encryption, regular security audits, and comply with GDPR, SOC 2, and other industry standards to keep your data safe.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Sales?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of sales teams using Smart CRM to close more deals and build better relationships.
          </p>
          <Link to="/register" className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
            Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold text-white">Smart CRM</span>
              </div>
              <p className="text-gray-400 mb-4">
                The AI-powered CRM that transforms how sales teams work and win.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/features/ai-tools" className="hover:text-white transition-colors">AI Tools</Link></li>
                <li><Link to="/features/contacts" className="hover:text-white transition-colors">Contact Management</Link></li>
                <li><Link to="/features/pipeline" className="hover:text-white transition-colors">Pipeline</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2025 Smart CRM. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;