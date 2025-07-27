import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
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
  BarChart,
  Users,
  Briefcase,
  Eye,
  Image,
  Mic,
  Search,
  Zap,
  Upload,
  DollarSign
} from 'lucide-react';

import LandingHeader from './components/LandingHeader';
import LandingFooter from './components/LandingFooter';
import PricingCard from './components/PricingCard';
import FeatureCard from './components/FeatureCard';
import TestimonialCard from './components/TestimonialCard';
import AnimatedFeatureIcon from '../../components/Landing/AnimatedFeatureIcon';
import ProductDemo from '../../components/Landing/ProductDemo';
import ClientLogos from '../../components/Landing/ClientLogos';
import StatCounter from '../../components/Landing/StatCounter';
import FeatureShowcase from '../../components/Landing/FeatureShowcase';
import ParallaxHero from '../../components/Landing/ParallaxHero';
import ScrollAnimationWrapper from '../../components/Landing/ScrollAnimationWrapper';
import FeatureDemo from '../../components/Landing/FeatureDemo';
import InteractiveFeaturesGrid from '../../components/Landing/InteractiveFeaturesGrid';
import ParticleBackground from '../../components/Landing/ParticleBackground';
import CallToAction from '../../components/Landing/CallToAction';

const LandingPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Function to handle page initialization only once
  useEffect(() => {
    console.log("LandingPage component mounted");
    
    const preloadHighPriorityAssets = () => {
      // Preload critical images
      const criticalImages = [
        'https://images.pexels.com/photos/6476582/pexels-photo-6476582.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      ];
      
      if (typeof window !== 'undefined') {
        criticalImages.forEach(url => {
          const img = new window.Image();
          img.onload = () => console.log(`Image loaded: ${url}`);
          img.onerror = () => console.error(`Failed to load image: ${url}`);
          img.src = url;
        });
      }
    };

    // Call the preload function
    preloadHighPriorityAssets();
    
    // Check animations.css is loaded
    const animationsStylesheet = document.querySelector('link[href*="animations.css"]');
    console.log("Animations CSS loaded:", !!animationsStylesheet);
    
    // Add a small delay to ensure everything is ready
    const timer = setTimeout(() => {
      console.log("Setting isLoaded to true");
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Debug CSS classes for background elements
  useEffect(() => {
    if (isLoaded) {
      console.log("Landing page marked as loaded");
      
      // Check animation classes
      const animatedElements = document.querySelectorAll('.animate-float, .animate-pulse, .animate-spin');
      console.log(`Found ${animatedElements.length} animated elements`);
      
      // Check background classes
      const bgElements = document.querySelectorAll('.bg-gradient-to-r, .bg-gradient-to-b, .parallax-bg');
      console.log(`Found ${bgElements.length} background elements`);
      
      if (bgElements.length > 0) {
        Array.from(bgElements).forEach((el, i) => {
          const computedStyle = window.getComputedStyle(el as Element);
          console.log(`Background element ${i} style:`, {
            background: computedStyle.background,
            backgroundImage: computedStyle.backgroundImage,
            opacity: computedStyle.opacity
          });
        });
      }
    }
  }, [isLoaded]);
  
  return (
    <div className="bg-white content-stable">
      <LandingHeader />
      
      {/* Hero Section */}
      <ParallaxHero />
      
      {/* Client logos */}
      <ClientLogos />
      
      {/* Feature Demo Section with interactive components */}
      <FeatureDemo />
      
      {/* Interactive Features Grid */}
      <ScrollAnimationWrapper animation="fade-up">
        <InteractiveFeaturesGrid />
      </ScrollAnimationWrapper>
      
      {/* Stats Counter Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden">
        <ParticleBackground particleCount={30} />
        <div className="container mx-auto px-4">
          <ScrollAnimationWrapper animation="fade-in">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">The SmartCRM Difference</h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Real results from businesses using our AI-powered CRM platform to accelerate growth
              </p>
            </div>
          </ScrollAnimationWrapper>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <ScrollAnimationWrapper animation="fade-up" delay={100}>
              <StatCounter 
                icon={<TrendingUp size={24} />} 
                label="Revenue Growth" 
                value={35} 
                suffix="%" 
              />
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={200}>
              <StatCounter 
                icon={<Clock size={24} />} 
                label="Time Saved Weekly" 
                value={12} 
                decimals={0} 
                suffix=" hrs"
              />
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={300}>
              <StatCounter 
                icon={<BarChart size={24} />} 
                label="Conversion Rate" 
                value={28} 
                suffix="%" 
              />
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={400}>
              <StatCounter 
                icon={<Users size={24} />} 
                label="Active Users" 
                value={10000} 
                suffix="+" 
              />
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>
      
      {/* Product Demo Section */}
      <section className="py-16 bg-white overflow-hidden relative z-10">
        <div className="container mx-auto px-4">
          <ScrollAnimationWrapper animation="fade-up">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">See SmartCRM in Action</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover how our AI-powered platform transforms your sales process and drives results
              </p>
            </div>
            
            <div className="max-w-6xl mx-auto">
              <ProductDemo />
            </div>
          </ScrollAnimationWrapper>
        </div>
        
        {/* Background floating elements */}
        <div className="absolute top-10 right-10 opacity-20">
          <AnimatedFeatureIcon
            icon={<Brain size={30} />}
            color="bg-indigo-100"
            delay={0}
            size="lg"
          />
        </div>
        <div className="absolute bottom-20 left-10 opacity-20">
          <AnimatedFeatureIcon
            icon={<BarChart3 size={30} />}
            color="bg-blue-100"
            delay={1}
            size="lg"
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How SmartCRM Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Streamline your sales process and boost productivity in three simple steps with intelligent automation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <ScrollAnimationWrapper animation="fade-up" delay={100}>
              <div className="text-center bg-white rounded-xl shadow-lg p-8 border border-gray-100 h-full flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  <Upload size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">1. Connect & Organize</h3>
                <p className="text-gray-600 flex-grow">
                  Easily import your existing contacts and deals, and set up your sales pipeline in minutes.
                </p>
              </div>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={200}>
              <div className="text-center bg-white rounded-xl shadow-lg p-8 border border-gray-100 h-full flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  <Zap size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">2. Engage & Automate</h3>
                <p className="text-gray-600 flex-grow">
                  Leverage AI for personalized communication, automate follow-ups, and streamline daily tasks.
                </p>
              </div>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={300}>
              <div className="text-center bg-white rounded-xl shadow-lg p-8 border border-gray-100 h-full flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  <DollarSign size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">3. Analyze & Grow</h3>
                <p className="text-gray-600 flex-grow">
                  Gain deep AI-powered insights into your sales performance to make data-driven decisions and close more deals.
                </p>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>
      
      {/* Feature Showcase */}
      <FeatureShowcase />
      
      {/* Features Section */}
      <section className="py-20 content-stable" id="features">
        <div className="container mx-auto px-4">
          <ScrollAnimationWrapper animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Powerful Features for Modern Sales Teams
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                SmartCRM combines powerful sales tools with advanced AI capabilities to streamline your workflow and boost your results.
              </p>
            </div>
          </ScrollAnimationWrapper>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ScrollAnimationWrapper animation="fade-up" delay={100}>
              <FeatureCard
                icon={<Brain className="h-8 w-8 text-blue-600" />}
                title="AI Sales Tools"
                description="Access 20+ AI tools to automate tasks, get insights, and personalize your sales approach."
                link="/features/ai-tools"
              />
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={200}>
              <FeatureCard
                icon={<Users className="h-8 w-8 text-indigo-600" />}
                title="Contact Management"
                description="Organize and track all your contacts, leads, and accounts in one unified database."
                link="/features/contacts"
              />
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={300}>
              <FeatureCard
                icon={<Briefcase className="h-8 w-8 text-violet-600" />}
                title="Deal Pipeline"
                description="Visualize and optimize your sales pipeline with drag-and-drop simplicity and AI insights."
                link="/features/pipeline"
              />
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={150}>
              <FeatureCard
                icon={<Brain className="h-8 w-8 text-fuchsia-600" />}
                title="AI Assistant"
                description="Work with a context-aware AI assistant that remembers conversations and takes actions for you."
                link="/features/ai-assistant"
              />
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={250}>
              <FeatureCard
                icon={<Eye className="h-8 w-8 text-cyan-600" />}
                title="Vision Analyzer"
                description="Extract insights from images, documents, competitor materials, and visual content."
                link="/features/vision-analyzer"
              />
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={350}>
              <FeatureCard
                icon={<Image className="h-8 w-8 text-emerald-600" />}
                title="Image Generator"
                description="Create professional images for presentations, proposals, and marketing materials instantly."
                link="/features/image-generator"
              />
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={150}>
              <FeatureCard
                icon={<Mic className="h-8 w-8 text-indigo-600" />}
                title="Voice Features"
                description="Voice profiles and audio management for your sales content."
                link="/voice-profiles"
              />
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={250}>
              <FeatureCard
                icon={<Search className="h-8 w-8 text-blue-600" />}
                title="Semantic Search"
                description="Find anything in your CRM with natural language queries and contextual understanding."
                link="/features/semantic-search"
              />
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={350}>
              <FeatureCard
                icon={<Zap className="h-8 w-8 text-yellow-600" />}
                title="Function Assistant"
                description="Let AI perform real actions in your CRM through natural conversation."
                link="/features/function-assistant"
              />
            </ScrollAnimationWrapper>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/ai-tools" className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors">
              Explore AI Tools <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* AI Highlights Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 content-stable gpu-accelerated">
        <div className="container mx-auto px-4">
          <ScrollAnimationWrapper animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                AI-Powered Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover our cutting-edge AI tools designed specifically for sales professionals
              </p>
            </div>
          </ScrollAnimationWrapper>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <ScrollAnimationWrapper animation="slide-in" delay={100}>
              <Link to="/features/ai-assistant" className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col hover:border-indigo-300 transform hover:-translate-y-1 animation-fix">
                <div className="p-3 bg-indigo-100 rounded-full w-min mb-4">
                  <Brain className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI Sales Assistant</h3>
                <p className="text-gray-600 mb-4 flex-1">Get a context-aware AI assistant that can search your CRM, schedule tasks, and take actions for you.</p>
                <span className="text-indigo-600 flex items-center mt-auto">Learn more <ChevronRight className="h-4 w-4 ml-1" /></span>
              </Link>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="slide-in" delay={200}>
              <Link to="/features/vision-analyzer" className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col hover:border-cyan-300 transform hover:-translate-y-1 animation-fix">
                <div className="p-3 bg-cyan-100 rounded-full w-min mb-4">
                  <Eye className="h-6 w-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Vision Analyzer</h3>
                <p className="text-gray-600 mb-4 flex-1">Analyze documents, competitor materials, and visual content to extract valuable sales intelligence.</p>
                <span className="text-cyan-600 flex items-center mt-auto">Learn more <ChevronRight className="h-4 w-4 ml-1" /></span>
              </Link>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="slide-in" delay={300}>
              <Link to="/features/image-generator" className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col hover:border-emerald-300 transform hover:-translate-y-1 animation-fix">
                <div className="p-3 bg-emerald-100 rounded-full w-min mb-4">
                  <Image className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Image Generator</h3>
                <p className="text-gray-600 mb-4 flex-1">Create professional product images, diagrams, and marketing visuals for your sales presentations.</p>
                <span className="text-emerald-600 flex items-center mt-auto">Learn more <ChevronRight className="h-4 w-4 ml-1" /></span>
              </Link>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="slide-in" delay={400}>
              <Link to="/features/function-assistant" className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col hover:border-amber-300 transform hover:-translate-y-1 animation-fix">
                <div className="p-3 bg-amber-100 rounded-full w-min mb-4">
                  <Zap className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Function Assistant</h3>
                <p className="text-gray-600 mb-4 flex-1">Let AI perform actions in your CRM through natural language conversation—search, update, create, and analyze.</p>
                <span className="text-amber-600 flex items-center mt-auto">Learn more <ChevronRight className="h-4 w-4 ml-1" /></span>
              </Link>
            </ScrollAnimationWrapper>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/ai-tools" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:shadow-lg transition duration-300 transform hover:scale-105">
              Explore All AI Tools <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-20 content-stable">
        <div className="container mx-auto px-4">
          <ScrollAnimationWrapper animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How SmartCRM Transforms Your Sales
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See the real benefits our customers experience every day
              </p>
            </div>
          </ScrollAnimationWrapper>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <ScrollAnimationWrapper animation="zoom-in" delay={100}>
              <div className="text-center transform hover:translate-y-[-10px] transition-all duration-300 animation-fix">
                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <PieChart className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold mb-3">35% Higher Win Rate</h3>
                <p className="text-gray-600">
                  AI-driven insights and personalization help you target the right prospects with the right approach, significantly increasing win rates.
                </p>
              </div>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="zoom-in" delay={300}>
              <div className="text-center transform hover:translate-y-[-10px] transition-all duration-300 animation-fix">
                <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <BarChart3 className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold mb-3">40% Faster Sales Cycle</h3>
                <p className="text-gray-600">
                  Automated workflows, smart follow-ups, and AI tools help you move deals through your pipeline more efficiently.
                </p>
              </div>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="zoom-in" delay={500}>
              <div className="text-center transform hover:translate-y-[-10px] transition-all duration-300 animation-fix">
                <div className="w-20 h-20 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Clock className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold mb-3">12+ Hours Saved Weekly</h3>
                <p className="text-gray-600">
                  Automation of routine tasks and AI-powered content generation save your team valuable time to focus on relationship building.
                </p>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 content-stable">
        <div className="container mx-auto px-4">
          <ScrollAnimationWrapper animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Loved by Sales Teams Everywhere
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Don't take our word for it - see what our customers have to say
              </p>
            </div>
          </ScrollAnimationWrapper>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollAnimationWrapper animation="fade-up" delay={100}>
              <TestimonialCard
                quote="SmartCRM has revolutionized our sales operations. The AI tools save us 12+ hours weekly and our win rate increased by 28%. The insights are invaluable."
                name="Sarah Johnson"
                position="VP of Sales"
                company="TechFlow Solutions"
                image="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                stars={5}
              />
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={300}>
              <TestimonialCard
                quote="The AI assistant is like having a senior sales rep on every deal. It anticipates next steps, suggests optimal timing, and helps us close 35% faster."
                name="Michael Rodriguez"
                position="Sales Director"
                company="Global Dynamics Inc"
                image="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                stars={5}
              />
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={500}>
              <TestimonialCard
                quote="We've achieved 42% revenue growth since implementing SmartCRM. The AI-powered pipeline management and lead scoring are absolute game-changers!"
                name="Jennifer Lee"
                position="CEO & Founder"
                company="Innovate Ventures"
                image="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                stars={5}
              />
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-20 content-stable" id="pricing">
        <div className="container mx-auto px-4">
          <ScrollAnimationWrapper animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose the plan that's right for your business
              </p>
            </div>
          </ScrollAnimationWrapper>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <ScrollAnimationWrapper animation="fade-up" delay={100}>
              <PricingCard
                tier="Starter"
                price={25}
                description="Perfect for individuals and small teams"
                buttonText="Get Started"
                features={[
                  "Up to 5 users",
                  "Contact & deal management",
                  "Basic AI tools",
                  "Email integration",
                  "Mobile app access",
                  "5GB storage"
                ]}
              />
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={0}>
              <PricingCard
                tier="Professional"
                price={65}
                description="Ideal for growing teams with advanced needs"
                buttonText="Start Free Trial"
                popular={true}
                color="bg-gradient-to-r from-blue-50 to-indigo-50"
                features={[
                  "Up to 25 users",
                  "All Starter features",
                  "Full AI toolset",
                  "Custom sales pipeline",
                  "Advanced analytics",
                  "API access",
                  "25GB storage",
                  "Priority support"
                ]}
              />
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={200}>
              <PricingCard
                tier="Enterprise"
                price={125}
                description="For organizations requiring maximum capability"
                buttonText="Contact Sales"
                features={[
                  "Unlimited users",
                  "All Professional features",
                  "Dedicated AI resources",
                  "Custom AI model training",
                  "Advanced security controls",
                  "Dedicated account manager",
                  "Unlimited storage",
                  "24/7 premium support",
                  "Custom integrations"
                ]}
              />
            </ScrollAnimationWrapper>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">All plans include a 14-day free trial. No credit card required.</p>
            <Link to="/pricing" className="text-blue-600 hover:text-blue-800 font-medium">
              View full pricing details
            </Link>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <CallToAction
        title="Ready to Transform Your Sales Process?"
        description="Join thousands of sales professionals already using SmartCRM to close more deals."
        primaryCtaText="Start Your Free Trial"
        primaryCtaLink="/register"
        secondaryCtaText="Go to Dashboard"
        secondaryCtaLink="/dashboard"
      />
      
      {/* FAQ Preview */}
      <section className="py-20 bg-white content-stable">
        <div className="container mx-auto px-4">
          <ScrollAnimationWrapper animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Find answers to common questions about SmartCRM
              </p>
            </div>
          </ScrollAnimationWrapper>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <ScrollAnimationWrapper animation="fade-up" delay={100}>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  How quickly can I see results with SmartCRM?
                </h3>
                <p className="text-gray-700">
                  Most customers see immediate productivity gains within the first week. Our AI tools start providing insights from day one, and the average customer reports 25% time savings within their first month of use.
                </p>
              </div>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={200}>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  What makes SmartCRM different from other CRM platforms?
                </h3>
                <p className="text-gray-700">
                  SmartCRM is built AI-first with 20+ intelligent tools that work together seamlessly. Unlike traditional CRMs with bolted-on AI features, our platform uses AI to enhance every aspect of your sales process - from lead scoring to deal forecasting to automated follow-ups.
                </p>
              </div>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={300}>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Can I import my existing CRM data?
                </h3>
                <p className="text-gray-700">
                  Yes, SmartCRM supports importing data from CSV, Excel, and direct connections with other popular CRM systems. Our onboarding team can assist with migrating your existing data seamlessly.
                </p>
              </div>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={400}>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  How secure is my data with SmartCRM?
                </h3>
                <p className="text-gray-700">
                  We use enterprise-grade security with SOC 2 Type II compliance, end-to-end encryption, and regular security audits. Your data is hosted on secure cloud infrastructure with 99.9% uptime guarantee and daily backups.
                </p>
              </div>
            </ScrollAnimationWrapper>
          </div>
          
          <div className="text-center mt-8">
            <Link to="/faq" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center">
              View all FAQs <ChevronRight className="ml-1 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
      
      <LandingFooter />
    </div>
  );
};

export default LandingPage;