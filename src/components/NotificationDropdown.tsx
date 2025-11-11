import React, { useState } from 'react';
import { 
  BellIcon, 
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import { useNotifications } from '../contexts/NotificationContext';
import type { Notification } from '../contexts/NotificationContext';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotifications();
  
  // Formatage du temps relatif
  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `il y a ${diffMinutes} min`;
    } else if (diffHours < 24) {
      return `il y a ${diffHours}h`;
    } else if (diffDays === 1) {
      return 'hier';
    } else {
      return `il y a ${diffDays} jours`;
    }
  };

  // Icône selon le type
  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return CheckCircleIcon;
      case 'error':
        return ExclamationTriangleIcon;
      case 'warning':
        return ExclamationTriangleIcon;
      case 'info':
        return InformationCircleIcon;
      default:
        return InformationCircleIcon;
    }
  };

  // Couleur selon le type
  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'info':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      // Navigation vers l'URL d'action
      window.location.href = notification.actionUrl;
    }
  };

  return (
    <div className="relative">
      {/* Bouton de notification */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:text-gray-200 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-yellow-400 text-blue-900 text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown des notifications */}
      {isOpen && (
        <>
          {/* Overlay pour fermer en cliquant dehors */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel des notifications */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({unreadCount} non lue{unreadCount > 1 ? 's' : ''})
                  </span>
                )}
              </h3>
              
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Tout marquer lu
                  </button>
                )}
                
                <div className="relative">
                  <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                    <EllipsisVerticalIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Liste des notifications */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <BellIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Aucune notification</p>
                  <p className="text-sm mt-1">Vous êtes à jour !</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => {
                    const IconComponent = getTypeIcon(notification.type);
                    const colorClass = getTypeColor(notification.type);
                    
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                          !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-3">
                          {/* Icône de type */}
                          <div className={`p-1 rounded-lg flex-shrink-0 ${colorClass}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          
                          {/* Contenu */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                  {notification.title}
                                </h4>
                                <p className={`text-sm mt-1 ${!notification.read ? 'text-gray-700' : 'text-gray-500'}`}>
                                  {notification.message}
                                </p>
                                
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs text-gray-400">
                                    {getTimeAgo(notification.timestamp)}
                                  </span>
                                  
                                  {notification.actionLabel && (
                                    <span className="text-xs text-blue-600 font-medium">
                                      {notification.actionLabel} →
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              {/* Actions */}
                              <div className="flex items-center gap-1 ml-2">
                                {!notification.read && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markAsRead(notification.id);
                                    }}
                                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                    title="Marquer comme lu"
                                  >
                                    <CheckIcon className="h-3 w-3" />
                                  </button>
                                )}
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeNotification(notification.id);
                                  }}
                                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
                                  title="Supprimer"
                                >
                                  <XMarkIcon className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <button
                    onClick={clearAll}
                    className="text-xs text-red-600 hover:text-red-800 hover:underline"
                  >
                    Tout supprimer
                  </button>
                  
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Voir toutes les notifications
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
