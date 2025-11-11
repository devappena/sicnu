import React from 'react';
import { useTheme } from '../hooks/useTheme';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  title, 
  children, 
  className = '', 
  padding = 'md',
  hover = false 
}) => {
  const { isDarkMode } = useTheme();
  
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6', 
    lg: 'p-8'
  };

  return (
    <div 
      className={`
        ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}
        border rounded-lg shadow-sm
        ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''}
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {title && (
        <div className={`mb-4 pb-4 border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h3>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
