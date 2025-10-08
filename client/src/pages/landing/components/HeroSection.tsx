import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ParallaxHero from '../../../components/landing/ParallaxHero';
import ClientLogos from '../../../components/landing/ClientLogos';
import FeatureDemo from '../../../components/landing/FeatureDemo';
import ScrollAnimationWrapper from '../../../components/landing/ScrollAnimationWrapper';
import InteractiveFeaturesGrid from '../../../components/landing/InteractiveFeaturesGrid';

const HeroSection: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="landing-section">
        <ParallaxHero />
      </section>

      {/* Client logos */}
      <section className="landing-section">
        <ClientLogos />
      </section>

      {/* Feature Demo Section with interactive components */}
      <section className="landing-section">
        <FeatureDemo />
      </section>

      {/* Interactive Features Grid */}
      <section className="landing-section">
        <ScrollAnimationWrapper animation="fade-up">
          <InteractiveFeaturesGrid />
        </ScrollAnimationWrapper>
      </section>
    </>
  );
};

export default HeroSection;