import React, { useEffect, useState } from 'react';
import { useSidebar } from '../contexts/SidebarContext';

interface MobileOptimizerProps {
  children: React.ReactNode;
}

export default function MobileOptimizer({ children }: MobileOptimizerProps) {
  const { isOpen: isSidebarOpen, openSidebar, closeSidebar } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Détecter si on est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fermer la sidebar quand on scroll sur mobile
  useEffect(() => {
    if (!isMobile) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking && isSidebarOpen) {
        requestAnimationFrame(() => {
          closeSidebar();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, isSidebarOpen, closeSidebar]);

  // Gestion des gestes de swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    // Swipe vers la droite pour ouvrir la sidebar
    if (isRightSwipe && !isSidebarOpen && touchStart < 50) {
      openSidebar();
    }
    
    // Swipe vers la gauche pour fermer la sidebar
    if (isLeftSwipe && isSidebarOpen) {
      closeSidebar();
    }
  };

  // Optimisations CSS pour mobile
  const mobileStyles: React.CSSProperties = isMobile ? {
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation'
  } : {};

  return (
    <div
      style={mobileStyles}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className={`min-h-screen ${isMobile ? 'touch-pan-x touch-pan-y' : ''}`}
    >
      {children}
      
      {/* Overlay pour fermer la sidebar sur mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => closeSidebar()}
          style={{ touchAction: 'none' }}
        />
      )}

      {/* Styles CSS injectés pour les optimisations mobile */}
      <style>{`
        @media (max-width: 768px) {
          /* Améliorer la taille des zones de toucher */
          button {
            min-height: 44px;
            min-width: 44px;
          }
          
          /* Améliorer le scroll sur iOS */
          * {
            -webkit-overflow-scrolling: touch;
          }
          
          /* Éviter le zoom sur les inputs */
          input[type="text"],
          input[type="email"],
          input[type="password"],
          input[type="search"],
          textarea,
          select {
            font-size: 16px !important;
          }
          
          /* Améliorer les interactions tactiles */
          .hover\\:bg-gray-100:hover {
            background-color: rgb(243 244 246);
          }
          
          .hover\\:bg-blue-50:hover {
            background-color: rgb(239 246 255);
          }
        }
        
        /* Animation fluide pour la sidebar */
        .sidebar-transition {
          transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
        }
        
        /* Améliorer les cards sur mobile */
        @media (max-width: 640px) {
          .mobile-card {
            border-radius: 0.5rem;
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
