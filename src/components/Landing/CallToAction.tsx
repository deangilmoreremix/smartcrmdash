import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';

interface CallToActionProps {
  title: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

const CallToAction: React.FC<CallToActionProps> = ({
  title,
  description,
  primaryCtaText,
  primaryCtaLink,
  secondaryCtaText,
  secondaryCtaLink,
}) => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-1/4 left-1/4 w-48 h-48 bg-white rounded-full mix-blend-overlay opacity-10"
      ></motion.div>
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 0.15 }}
        transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white rounded-full mix-blend-overlay opacity-15"
      ></motion.div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-6"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl opacity-90 mb-8 max-w-3xl mx-auto"
        >
          {description}
        </motion.p>
        <div className="flex flex-wrap justify-center gap-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              to={primaryCtaLink}
              className="px-8 py-4 bg-white text-blue-700 font-medium rounded-lg hover:shadow-lg transition duration-300 transform hover:scale-105 inline-flex items-center"
            >
              {primaryCtaText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
          {secondaryCtaText && secondaryCtaLink && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Link
                to={secondaryCtaLink}
                className="px-8 py-4 bg-blue-500 bg-opacity-30 hover:bg-opacity-40 text-white font-medium rounded-lg transition-colors inline-flex items-center"
              >
                {secondaryCtaText}
                <Zap className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          )}
        </div>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-4 opacity-80 text-sm"
        >
          No credit card required • Free for 14 days
        </motion.p>
      </div>
    </section>
  );
};

export default CallToAction;
