import React, { useRef, useEffect } from 'react';

interface ScrollAnimationWrapperProps {
  children: React.ReactNode;
  animation?: 'fade-up' | 'fade-in' | 'slide-in' | 'zoom-in';
  delay?: number;
}

const ScrollAnimationWrapper: React.FC<ScrollAnimationWrapperProps> = ({ 
  children, 
  animation = 'fade-up', 
  delay = 0 
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-in');
            }, delay);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    observer.observe(element);

    return () => observer.unobserve(element);
  }, [delay]);

  const getAnimationClasses = () => {
    const baseClasses = 'opacity-0 transition-all duration-700 ease-out';
    
    switch (animation) {
      case 'fade-up':
        return `${baseClasses} translate-y-8`;
      case 'fade-in':
        return baseClasses;
      case 'slide-in':
        return `${baseClasses} translate-x-8`;
      case 'zoom-in':
        return `${baseClasses} scale-95`;
      default:
        return `${baseClasses} translate-y-8`;
    }
  };

  return (
    <div 
      ref={elementRef} 
      className={getAnimationClasses()}
      style={{
        '--animate-in-opacity': '1',
        '--animate-in-transform': 'translate(0) scale(1)',
      } as React.CSSProperties}
    >
      <style jsx>{`
        .animate-in {
          opacity: 1 !important;
          transform: translate(0) scale(1) !important;
        }
      `}</style>
      {children}
    </div>
  );
};

export default ScrollAnimationWrapper;
