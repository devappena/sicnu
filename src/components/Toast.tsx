import React from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ type, title, message, onClose }) => {
  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-400',
          titleColor: 'text-green-800',
          messageColor: 'text-green-700',
          icon: CheckCircleIcon
        };
      case 'error':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-400',
          titleColor: 'text-red-800',
          messageColor: 'text-red-700',
          icon: XCircleIcon
        };
      case 'warning':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-400',
          titleColor: 'text-yellow-800',
          messageColor: 'text-yellow-700',
          icon: ExclamationTriangleIcon
        };
      case 'info':
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-400',
          titleColor: 'text-blue-800',
          messageColor: 'text-blue-700',
          icon: InformationCircleIcon
        };
      default:
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          iconColor: 'text-gray-400',
          titleColor: 'text-gray-800',
          messageColor: 'text-gray-700',
          icon: InformationCircleIcon
        };
    }
  };

  const styles = getToastStyles();
  const IconComponent = styles.icon;

  return (
    <div className={`max-w-sm w-full ${styles.bgColor} shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 border ${styles.borderColor}`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <IconComponent className={`h-6 w-6 ${styles.iconColor}`} />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className={`text-sm font-medium ${styles.titleColor}`}>
              {title}
            </p>
            {message && (
              <p className={`mt-1 text-sm ${styles.messageColor}`}>
                {message}
              </p>
            )}
          </div>
          {onClose && (
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className={`${styles.bgColor} rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                onClick={onClose}
              >
                <span className="sr-only">Fermer</span>
                <XCircleIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toast;
