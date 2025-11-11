import React from 'react';
import Logo from './Logo';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showLogo?: boolean;
  actions?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  subtitle, 
  showLogo = false, 
  actions 
}) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200 mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showLogo && <Logo size="lg" showText={false} />}
            <div>
              <h1 className="text-2xl font-bold text-ena-dark">{title}</h1>
              {subtitle && (
                <p className="text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          {actions && <div className="flex items-center space-x-4">{actions}</div>}
        </div>
      </div>
    </div>
  );
};

export default Header;
