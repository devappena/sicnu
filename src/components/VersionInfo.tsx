import React from 'react';
import { identity } from '../config/identity';

interface VersionInfoProps {
  variant?: 'footer' | 'sidebar' | 'modal' | 'badge';
  className?: string;
}

const VersionInfo: React.FC<VersionInfoProps> = ({ 
  variant = 'footer', 
  className = '' 
}) => {
  // Version hardcodée pour éviter les problèmes d'import de package.json
  const version = '1.0.0';
  const appName = identity.appName;

  const getVariantStyles = () => {
    switch (variant) {
      case 'footer':
        return 'text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200';
      case 'sidebar':
        return 'text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md';
      case 'modal':
        return 'text-sm text-gray-600 font-mono bg-gray-100 px-3 py-2 rounded-lg';
      case 'badge':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cnu-blue-100 text-cnu-blue-800';
      default:
        return 'text-xs text-gray-500';
    }
  };

  const formatVersion = () => {
    switch (variant) {
      case 'modal':
        return `${appName} v${version}`;
      case 'badge':
        return `v${version}`;
      default:
        return `Version ${version}`;
    }
  };

  return (
    <div className={`${getVariantStyles()} ${className}`}>
      {formatVersion()}
    </div>
  );
};

export default VersionInfo;
