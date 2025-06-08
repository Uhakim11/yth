import React, { useEffect, useRef, useState, ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animationClass?: string; // e.g., 'animate-slideInUp', 'animate-fadeIn'
  threshold?: number; // IntersectionObserver threshold
  triggerOnce?: boolean; // Whether to trigger animation only once
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ 
  children, 
  className = '', 
  animationClass = 'animate-slideInUp',
  threshold = 0.1,
  triggerOnce = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce && sectionRef.current) {
            observer.unobserve(sectionRef.current);
          }
        } else {
          if (!triggerOnce) {
            setIsVisible(false); // Re-trigger animation if element scrolls out and back in
          }
        }
      },
      {
        threshold: threshold,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(sectionRef.current);
      }
    };
  }, [threshold, triggerOnce]);

  return (
    <section 
      ref={sectionRef} 
      className={`${className} ${isVisible ? animationClass : 'opacity-0'} transition-opacity duration-300`}
    >
      {children}
    </section>
  );
};

export default AnimatedSection;