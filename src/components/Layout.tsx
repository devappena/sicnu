import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import { useTheme } from '../hooks/useTheme';
import { useSidebar } from '../contexts/SidebarContext';
import { identity } from '../config/identity';

interface LayoutProps {
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ title = identity.appName }) => {
  const { isDarkMode } = useTheme();
  const { isOpen, isMobile, closeSidebar } = useSidebar();

  return (
    <div className={`h-screen flex overflow-hidden ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <Sidebar />
      
      {/* Overlay pour mobile quand sidebar est ouverte */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Main content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <TopHeader title={title} />
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className={`p-4 sm:p-6 lg:p-8 ${isDarkMode ? 'bg-slate-900' : ''}`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
