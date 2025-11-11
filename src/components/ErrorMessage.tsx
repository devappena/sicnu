import React from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface ErrorMessageProps {
  error: Error | string;
  onRetry?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry, className = '' }) => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
        <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Une erreur est survenue
      </h3>
      
      <p className="text-sm text-gray-600 text-center mb-4 max-w-md">
        {errorMessage}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <ArrowPathIcon className="w-4 h-4 mr-2" />
          Réessayer
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
