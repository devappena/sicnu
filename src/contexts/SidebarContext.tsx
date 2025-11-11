import React, { createContext, useContext, useState, useEffect } from 'react';

interface SidebarContextType {
  isOpen: boolean;
  isMobile: boolean;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

interface SidebarProviderProps {
  children: React.ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Détecter si on est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768; // md breakpoint
      setIsMobile(mobile);
      
      // Sur mobile, fermer la sidebar par défaut
      if (mobile) {
        setIsOpen(false);
        setIsCollapsed(false);
      } else {
        setIsOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      // Sur desktop, on alterne entre collapsed et expanded
      if (isOpen && !isCollapsed) {
        setIsCollapsed(true);
      } else if (isOpen && isCollapsed) {
        setIsCollapsed(false);
      } else {
        setIsOpen(true);
        setIsCollapsed(false);
      }
    }
  };

  const closeSidebar = () => {
    setIsOpen(false);
    setIsCollapsed(false);
  };

  const openSidebar = () => {
    setIsOpen(true);
    setIsCollapsed(false);
  };

  const value = {
    isOpen,
    isMobile,
    isCollapsed,
    toggleSidebar,
    closeSidebar,
    openSidebar,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};
