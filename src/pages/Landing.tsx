import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HashLink as Link } from 'react-router-hash-link';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
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
  Calendar,
  Menu,
  X,
  ChevronDown,
  DollarSign,
  Shield,
  Globe,
  Award,
  Lightbulb,
  Smartphone
} from 'lucide-react';

// Components
const LandingHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDashboardNavigate = () => {
    navigate('/dashboard');
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/20' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className={`text-xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
              SmartCRM
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="#features" 
              className={`font-medium transition-colors ${
                isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white/90 hover:text-white'
              }`}
            >
              Features
            </Link>
            <Link 
              to="#pricing" 
              className={`font-medium transition-colors ${
                isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white/90 hover:text-white'
              }`}
            >
              Pricing
            </Link>
            <Link 
              to="#testimonials" 
              className={`font-medium transition-colors ${
                isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white/90 hover:text-white'
              }`}
            >
              Reviews
            </Link>
            <Link 
              to="#contact" 
              className={`font-medium transition-colors ${
                isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white/90 hover:text-white'
              }`}
            >
              Contact
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDashboardNavigate}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-300"
            >
              Get Started
            </motion.button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${isScrolled ? 'text-gray-900' : 'text-white'}`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white rounded-lg shadow-lg mt-2 py-4"
          >
            <div className="flex flex-col space-y-4 px-4">
              <Link to="#features" className="text-gray-700 hover:text-blue-600 font-medium">
                Features
              </Link>
              <Link to="#pricing" className="text-gray-700 hover:text-blue-600 font-medium">
                Pricing
              </Link>
              <Link to="#testimonials" className="text-gray-700 hover:text-blue-600 font-medium">
                Reviews
              </Link>
              <Link to="#contact" className="text-gray-700 hover:text-blue-600 font-medium">
                Contact
              </Link>
              <button
                onClick={handleDashboardNavigate}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-medium text-center"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

const ParallaxHero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 250]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Floating Background Elements */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            The Future of
            <motion.span 
              className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              Smart CRM
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Transform your sales pipeline with AI-powered insights, automated workflows, 
            and intelligent customer relationship management that grows with your business.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center gap-3 shadow-xl"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 flex items-center gap-3 backdrop-blur-sm"
            >
              <Play className="h-5 w-5" />
              Watch Demo
            </motion.button>
          </motion.div>

          <motion.div
            className="mt-16 flex justify-center items-center gap-8 text-white/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-white">10k+</div>
              <div className="text-sm">Active Users</div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">99.9%</div>
              <div className="text-sm">Uptime</div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-sm">Support</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown className="h-8 w-8 text-white/60" />
      </motion.div>
    </section>
  );
};

const InteractiveFeaturesGrid = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analytics",
      description: "Advanced machine learning algorithms analyze your sales data to provide actionable insights and predictive forecasting.",
      gradient: "from-blue-500 to-cyan-500",
      delay: 0
    },
    {
      icon: Zap,
      title: "Workflow Automation",
      description: "Streamline repetitive tasks with intelligent automation that learns from your team's behavior patterns.",
      gradient: "from-purple-500 to-pink-500",
      delay: 0.1
    },
    {
      icon: BarChart3,
      title: "Real-Time Dashboard",
      description: "Monitor KPIs, track performance metrics, and visualize data with customizable, interactive dashboards.",
      gradient: "from-green-500 to-emerald-500",
      delay: 0.2
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamless collaboration tools that keep your entire sales team aligned and productive.",
      gradient: "from-orange-500 to-red-500",
      delay: 0.3
    },
    {
      icon: MessageSquare,
      title: "Unified Communications",
      description: "Integrate email, chat, social media, and phone communications in one centralized platform.",
      gradient: "from-teal-500 to-blue-500",
      delay: 0.4
    },
    {
      icon: Target,
      title: "Lead Scoring",
      description: "AI-driven lead scoring helps prioritize prospects and focus efforts on high-conversion opportunities.",
      gradient: "from-indigo-500 to-purple-500",
      delay: 0.5
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features for Modern Sales
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to accelerate your sales process and drive revenue growth
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: feature.delay }}
              whileHover={{ 
                y: -10,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProductDemo = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  const demoTabs = [
    {
      id: 0,
      title: "Dashboard Overview",
      description: "Get a bird's eye view of your entire sales operation with our comprehensive dashboard.",
      features: ["Real-time metrics", "Customizable widgets", "Performance trends"]
    },
    {
      id: 1,
      title: "Contact Management",
      description: "Organize and manage all your contacts with advanced filtering and segmentation tools.",
      features: ["Smart contact organization", "Interaction history", "Automated follow-ups"]
    },
    {
      id: 2,
      title: "Sales Pipeline",
      description: "Visualize your sales process and track deals through every stage of your pipeline.",
      features: ["Drag-and-drop interface", "Stage automation", "Revenue forecasting"]
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            See SmartCRM in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the interface and discover how SmartCRM can transform your sales process
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-4 mb-8">
              {demoTabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left p-6 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h3 className="text-lg font-semibold mb-2">{tab.title}</h3>
                  <p className={`text-sm ${activeTab === tab.id ? 'text-blue-100' : 'text-gray-600'}`}>
                    {tab.description}
                  </p>
                </motion.button>
              ))}
            </div>

            <div className="space-y-3">
              {demoTabs[activeTab].features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCheck className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="h-10 w-10" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">{demoTabs[activeTab].title}</h4>
                  <p className="text-blue-100">Interactive Demo</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const StatCounter = () => {
  const stats = [
    { number: "10,000+", label: "Active Users", icon: Users },
    { number: "99.9%", label: "Uptime", icon: Shield },
    { number: "50M+", label: "Data Points", icon: BarChart },
    { number: "24/7", label: "Support", icon: Clock }
  ];

  return (
    <section className="py-20 bg-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-8 w-8 text-blue-300" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-blue-300">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PricingCard = ({ plan, isPopular = false }: { plan: any; isPopular?: boolean }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 ${
        isPopular ? 'border-blue-500' : 'border-gray-200'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <p className="text-gray-600 mb-6">{plan.description}</p>
        
        <div className="mb-6">
          <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
          <span className="text-gray-600">/month</span>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard')}
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
            isPopular
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          }`}
        >
          {plan.buttonText}
        </motion.button>
      </div>
      
      <ul className="mt-8 space-y-4">
        {plan.features.map((feature: string, index: number) => (
          <li key={index} className="flex items-center gap-3">
            <CheckCheck className="h-5 w-5 text-green-500 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

const TestimonialCard = ({ testimonial }: { testimonial: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
  >
    <div className="flex items-center gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
      ))}
    </div>
    
    <blockquote className="text-gray-700 mb-6 leading-relaxed">
      "{testimonial.content}"
    </blockquote>
    
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
        <User className="h-6 w-6 text-white" />
      </div>
      <div>
        <div className="font-semibold text-gray-900">{testimonial.name}</div>
        <div className="text-gray-600 text-sm">{testimonial.title}</div>
      </div>
    </div>
  </motion.div>
);

const Landing = () => {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const pricingPlans = [
    {
      name: "Starter",
      description: "Perfect for small teams getting started",
      price: 29,
      buttonText: "Start Free Trial",
      features: [
        "Up to 5 users",
        "1,000 contacts",
        "Basic reporting",
        "Email support",
        "Mobile app"
      ]
    },
    {
      name: "Professional",
      description: "Advanced features for growing businesses",
      price: 79,
      buttonText: "Start Free Trial",
      features: [
        "Up to 25 users",
        "10,000 contacts",
        "Advanced analytics",
        "Priority support",
        "API access",
        "Custom integrations",
        "Workflow automation"
      ]
    },
    {
      name: "Enterprise",
      description: "Full-featured solution for large organizations",
      price: 149,
      buttonText: "Contact Sales",
      features: [
        "Unlimited users",
        "Unlimited contacts",
        "White-label options",
        "24/7 phone support",
        "Custom development",
        "Advanced security",
        "Dedicated account manager"
      ]
    }
  ];

  const testimonials = [
    {
      content: "SmartCRM transformed our sales process completely. We've seen a 40% increase in deal closure rates since implementing it.",
      name: "Sarah Johnson",
      title: "VP of Sales, TechCorp"
    },
    {
      content: "The AI-powered insights have been game-changing. We can now predict which leads are most likely to convert with incredible accuracy.",
      name: "Michael Chen",
      title: "Sales Director, InnovateLab"
    },
    {
      content: "The automation features saved us countless hours. Our team can now focus on building relationships instead of manual data entry.",
      name: "Emily Rodriguez",
      title: "Sales Manager, GrowthCo"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <ParallaxHero />
      <InteractiveFeaturesGrid />
      <ProductDemo />
      <StatCounter />
      
      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that's right for your team. All plans include a 14-day free trial.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <PricingCard 
                key={index} 
                plan={plan} 
                isPopular={index === 1} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Loved by Sales Teams Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our customers have to say about their experience with SmartCRM
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about SmartCRM
            </p>
          </motion.div>
          
          <div className="space-y-8">
            {[
              {
                question: "How long is the free trial?",
                answer: "We offer a 14-day free trial with full access to all features. No credit card required."
              },
              {
                question: "Can I upgrade or downgrade my plan?",
                answer: "Yes, you can change your plan at any time. Changes take effect immediately, and we'll prorate any billing adjustments."
              },
              {
                question: "Is my data secure?",
                answer: "Absolutely. We use enterprise-grade security measures including SSL encryption, regular backups, and SOC 2 compliance."
              },
              {
                question: "Do you offer customer support?",
                answer: "Yes, we provide 24/7 customer support via email, chat, and phone for all paid plans."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Sales?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of sales teams who have already revolutionized their process with SmartCRM
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className="bg-white text-blue-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Start Your Free Trial
                <ArrowRight className="h-5 w-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300"
              >
                Schedule Demo
              </motion.button>
            </div>
            
            <p className="text-blue-200 mt-6 text-sm">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">SmartCRM</span>
              </div>
              <p className="text-gray-400 max-w-md">
                The most intelligent CRM platform designed to help sales teams close more deals 
                and build stronger customer relationships.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><Link to="#contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 SmartCRM. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
