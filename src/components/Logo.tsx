import React from 'react';
import cnuLogoImage from '../assets/images/Logo.jpg';
import { identity } from '../config/identity';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`${sizeClasses[size]} flex-shrink-0 overflow-hidden rounded-lg bg-white shadow-sm`}>
        <img 
          src={cnuLogoImage} 
          alt={`Logo ${identity.orgShort} — ${identity.orgName}`} 
          className="h-full w-full object-contain"
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <h1 className={`font-bold text-white ${textSizeClasses[size]} leading-tight`}>
            {identity.appName}
          </h1>
          <p className={`text-blue-200 text-xs ${size === 'sm' ? 'hidden' : ''} leading-tight`}>
            {identity.orgShort}
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo;
