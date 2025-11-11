// Hook pour l'observation d'intersection
import { useEffect, useRef, useState } from 'react';

export const useIntersectionObserver = (threshold = 0.1) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold }
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold]);

  return { ref, isIntersecting };
};

// Hook pour les animations
export const useAnimation = (type: string, duration = 300) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  const triggerAnimation = () => {
    setIsVisible(true);
    setHasAnimated(true);
    
    if (duration > 0) {
      setTimeout(() => setIsVisible(false), duration);
    }
  };

  return {
    isVisible,
    hasAnimated,
    triggerAnimation,
    animationClass: isVisible ? `animate-${type}` : ''
  };
};
