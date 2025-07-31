import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, HelpCircle } from 'lucide-react';

import LandingHeader from './Landing/components/LandingHeader';
import LandingFooter from './Landing/components/LandingFooter';
import PricingCard from './Landing/components/PricingCard';
import ScrollAnimationWrapper from '../components/Landing/ScrollAnimationWrapper';

const PricingPage: React.FC = () => {
  return (
    <div className="bg-white">
      <LandingHeader />

      {/* Hero Section */}
      <section className="relative pt-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Simple, Transparent <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Pricing</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Choose the plan that best fits your business needs. All plans include a 14-day free trial, no credit card required.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:shadow-lg transition duration-300">
              Start Your Free Trial
            </Link>
            <Link to="/contact" className="px-8 py-4 bg-white text-blue-600 font-medium rounded-lg border border-blue-200 hover:border-blue-300 hover:shadow-md transition duration-300 flex items-center">
              Contact Sales <ArrowRight size={18} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
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
                  "5GB storage",
                  "Standard support"
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
                  "Priority support",
                  "Customizable reports"
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
                  "Custom integrations",
                  "SLA & Uptime Guarantee"
                ]}
              />
            </ScrollAnimationWrapper>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">All plans are billed annually. Monthly billing options available at a slightly higher rate.</p>
            <Link to="/contact" className="text-blue-600 hover:text-blue-800 font-medium">
              Have questions about pricing? Contact our sales team.
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table (Optional - can be added later) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Detailed Feature Comparison</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive breakdown of features available in each plan.
            </p>
          </div>
          {/* Placeholder for comparison table */}
          <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center text-gray-600 italic">
            Detailed comparison table coming soon!
          </div>
        </div>
      </section>

      {/* Pricing FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Pricing FAQs</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Common questions about our pricing, billing, and plans.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                <HelpCircle size={20} className="text-blue-600 mr-2" />
                What is a "user" in your pricing model?
              </h3>
              <p className="text-gray-700">
                A user is any individual who has a unique login and access to your Smart CRM account. You can add or remove users at any time, and your billing will be adjusted accordingly.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                <HelpCircle size={20} className="text-blue-600 mr-2" />
                Are there any hidden fees?
              </h3>
              <p className="text-gray-700">
                No, our pricing is transparent. The price you see is the price you pay. There are no hidden fees, setup costs, or long-term contracts. You can cancel your subscription at any time.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                <HelpCircle size={20} className="text-blue-600 mr-2" />
                What happens after my free trial ends?
              </h3>
              <p className="text-gray-700">
                At the end of your 14-day free trial, you'll have the option to choose a paid plan. If you don't subscribe, your account will be suspended, but your data will be retained for a limited time, allowing you to reactivate later.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                <HelpCircle size={20} className="text-blue-600 mr-2" />
                Do you offer discounts for non-profits or educational institutions?
              </h3>
              <p className="text-gray-700">
                Yes, we offer special discounts for eligible non-profit organizations and educational institutions. Please contact our sales team for more information and to verify eligibility.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link to="/faq" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center">
              View all FAQs <ArrowRight className="ml-1 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default PricingPage;
