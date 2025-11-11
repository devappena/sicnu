import React, { useEffect, useState } from 'react';
import { 
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { useNotifications } from '../contexts/NotificationContext';
import type { Notification } from '../contexts/NotificationContext';

interface ToastProps {
  notification: Notification;
  onClose: () => void;
}

function Toast({ notification, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animation d'entrée
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-fermeture pour les notifications non persistantes
    if (!notification.persistent) {
      const timer = setTimeout(() => {
        setIsLeaving(true);
        setTimeout(() => {
          onClose();
        }, 300);
      }, 5000); // 5 secondes
      return () => clearTimeout(timer);
    }
  }, [notification.persistent, onClose]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose();
    }, 300); // Durée de l'animation de sortie
  };

  // Icône selon le type
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircleIcon className="h-6 w-6 text-green-600" />;
      case 'error':
        return <ExclamationCircleIcon className="h-6 w-6 text-red-600" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />;
      case 'info':
        return <InformationCircleIcon className="h-6 w-6 text-blue-600" />;
      default:
        return <InformationCircleIcon className="h-6 w-6 text-gray-600" />;
    }
  };

  // Couleurs selon le type
  const getColors = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
        }
        max-w-sm w-full ${getColors()} 
        shadow-lg rounded-lg border pointer-events-auto ring-1 ring-black ring-opacity-5
      `}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium">
              {notification.title}
            </p>
            <p className="mt-1 text-sm opacity-90">
              {notification.message}
            </p>
            
            {notification.actionLabel && notification.actionUrl && (
              <div className="mt-3">
                <button
                  onClick={() => {
                    window.location.href = notification.actionUrl!;
                    handleClose();
                  }}
                  className="text-sm font-medium underline hover:no-underline"
                >
                  {notification.actionLabel}
                </button>
              </div>
            )}
          </div>
          
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleClose}
              className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Barre de progression pour les notifications temporaires */}
      {!notification.persistent && (
        <div className="h-1 bg-black bg-opacity-10">
          <div 
            className="h-full bg-black bg-opacity-20 transition-all duration-5000 ease-linear"
            style={{ 
              width: isVisible ? '0%' : '100%',
              transitionDuration: '5000ms'
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function ToastContainer() {
  const { notifications } = useNotifications();
  const [toastNotifications, setToastNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Afficher seulement les nouvelles notifications comme toasts
    const newNotifications = notifications.filter(notification => {
      const isNew = Date.now() - notification.timestamp.getTime() < 1000; // Moins d'1 seconde
      return isNew && !toastNotifications.find(t => t.id === notification.id);
    });

    if (newNotifications.length > 0) {
      setToastNotifications(prev => [...prev, ...newNotifications]);
    }
  }, [notifications, toastNotifications]);

  const handleCloseToast = (notificationId: string) => {
    setToastNotifications(prev => prev.filter(t => t.id !== notificationId));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {toastNotifications.map(notification => (
        <Toast
          key={notification.id}
          notification={notification}
          onClose={() => handleCloseToast(notification.id)}
        />
      ))}
    </div>
  );
}
