import React, { useState, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useAnimations';

// Interface pour les props des composants d'animation
interface AnimationProps {
  children: React.ReactNode;
  delay?: number;
  duration?: string;
  className?: string;
}

// Composant d'animation fade-in
export const FadeIn: React.FC<AnimationProps> = ({ 
  children, 
  delay = 0, 
  duration = '300ms',
  className = '' 
}) => {
  const { ref, isIntersecting } = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={`transition-opacity ${className}`}
      style={{
        opacity: isIntersecting ? 1 : 0,
        transitionDelay: `${delay}ms`,
        transitionDuration: duration
      }}
    >
      {children}
    </div>
  );
};

// Composant d'animation slide-in
interface SlideInProps extends AnimationProps {
  direction?: 'left' | 'right' | 'up' | 'down';
}

export const SlideIn: React.FC<SlideInProps> = ({ 
  children, 
  direction = 'left',
  delay = 0, 
  duration = '300ms',
  className = '' 
}) => {
  const { ref, isIntersecting } = useIntersectionObserver();

  const getTransform = () => {
    if (!isIntersecting) {
      switch (direction) {
        case 'left': return 'translateX(-100px)';
        case 'right': return 'translateX(100px)';
        case 'up': return 'translateY(-100px)';
        case 'down': return 'translateY(100px)';
        default: return 'translateX(-100px)';
      }
    }
    return 'translateX(0) translateY(0)';
  };

  return (
    <div
      ref={ref}
      className={`transition-transform ${className}`}
      style={{
        transform: getTransform(),
        opacity: isIntersecting ? 1 : 0,
        transitionDelay: `${delay}ms`,
        transitionDuration: duration
      }}
    >
      {children}
    </div>
  );
};

// Composant d'animation scale-in
export const ScaleIn: React.FC<AnimationProps> = ({ 
  children, 
  delay = 0, 
  duration = '300ms',
  className = '' 
}) => {
  const { ref, isIntersecting } = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={`transition-transform ${className}`}
      style={{
        transform: isIntersecting ? 'scale(1)' : 'scale(0.95)',
        opacity: isIntersecting ? 1 : 0,
        transitionDelay: `${delay}ms`,
        transitionDuration: duration
      }}
    >
      {children}
    </div>
  );
};

// Composant bounce
export const BounceButton: React.FC<{ children: React.ReactNode; onClick?: () => void; className?: string }> = ({ 
  children, 
  onClick,
  className = '' 
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      className={`transition-transform duration-150 ${className}`}
      style={{
        transform: isPressed ? 'scale(0.95)' : 'scale(1)'
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Composant pulse
export const PulseElement: React.FC<AnimationProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {children}
    </div>
  );
};

// Composant float
export const FloatElement: React.FC<AnimationProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`animate-bounce ${className}`}>
      {children}
    </div>
  );
};

// Composant typing effect
export const TypingEffect: React.FC<{ 
  text: string; 
  speed?: number; 
  className?: string;
}> = ({ 
  text, 
  speed = 50, 
  className = '' 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={className}>
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

// Composant stagger
export const StaggerChildren: React.FC<{ 
  children: React.ReactNode[]; 
  delay?: number;
  className?: string;
}> = ({ 
  children, 
  delay = 100,
  className = '' 
}) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <FadeIn key={index} delay={index * delay}>
          {child}
        </FadeIn>
      ))}
    </div>
  );
};

// Styles CSS pour les animations personnalisées
export const AnimationStyles = () => (
  <style>{`
    @keyframes loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
    
    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-20px);
      }
    }
    
    @keyframes morphing {
      0% {
        border-radius: 0;
      }
      50% {
        border-radius: 50%;
      }
      100% {
        border-radius: 0;
      }
    }
    
    .animate-loading {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }
    
    .animate-float {
      animation: float 3s ease-in-out infinite;
    }
    
    .animate-morphing {
      animation: morphing 2s ease-in-out infinite;
    }
    
    .animate-fade-in {
      animation: fadeIn 0.3s ease-in-out;
    }
    
    .animate-slide-in-left {
      animation: slideInLeft 0.3s ease-in-out;
    }
    
    .animate-slide-in-right {
      animation: slideInRight 0.3s ease-in-out;
    }
    
    .animate-slide-in-up {
      animation: slideInUp 0.3s ease-in-out;
    }
    
    .animate-slide-in-down {
      animation: slideInDown 0.3s ease-in-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideInLeft {
      from { transform: translateX(-100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideInUp {
      from { transform: translateY(-100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes slideInDown {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `}</style>
);

export default AnimationStyles;

// Export explicite pour résoudre le problème d'import
export { StaggerChildren as Stagger };
