import React, { useState } from 'react';
import { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import {
  BellIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
  FireIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import { BellIcon as BellIconSolid } from '@heroicons/react/24/solid';
import { usePushNotificationContext } from '../hooks/usePushNotificationContext';
import { FadeIn, SlideIn, BounceButton } from './Animations';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    isSupported,
    isSubscribed,
    subscribe
  } = usePushNotificationContext();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckIcon className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
      case 'urgent':
        return <FireIcon className="h-5 w-5 text-red-600" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'urgent':
        return 'bg-red-100 border-red-300';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    switch (filter) {
      case 'unread':
        return !notif.read;
      case 'urgent':
        return notif.type === 'urgent';
      default:
        return true;
    }
  });

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    // Ici vous pourriez ajouter une navigation vers une page spécifique
  };

  const handleSubscribe = async () => {
    if (!isSubscribed) {
      await subscribe();
    }
  };

  return (
    <div className="relative">
      {/* Bouton de notification */}
      <BounceButton
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
      >
        {unreadCount > 0 ? (
          <BellIconSolid className="h-6 w-6 text-blue-600" />
        ) : (
          <BellIcon className="h-6 w-6" />
        )}
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </BounceButton>

      {/* Panneau de notifications */}
      <Transition
        show={isOpen}
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* En-tête */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            {/* Filtres */}
            <div className="flex gap-2 mt-3">
              {(['all', 'unread', 'urgent'] as const).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filter === filterType
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filterType === 'all' ? 'Toutes' : filterType === 'unread' ? 'Non lues' : 'Urgentes'}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Marquer toutes comme lues
                </button>
              )}
              <button
                onClick={clearAll}
                className="text-xs text-red-600 hover:text-red-800 font-medium ml-auto"
              >
                Tout effacer
              </button>
            </div>
          </div>

          {/* Message d'abonnement */}
          {isSupported && !isSubscribed && (
            <div className="p-4 bg-blue-50 border-b border-blue-200">
              <div className="flex items-center gap-2">
                <BellIcon className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">
                    Activez les notifications push
                  </p>
                  <p className="text-xs text-blue-700">
                    Recevez des alertes même quand l'app est fermée
                  </p>
                </div>
                <button
                  onClick={handleSubscribe}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700"
                >
                  Activer
                </button>
              </div>
            </div>
          )}

          {/* Liste des notifications */}
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <BellIcon className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2">Aucune notification</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredNotifications.map((notification, index) => (
                  <SlideIn key={notification.id} direction="right" delay={index * 50}>
                    <div
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icône */}
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Contenu */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          
                          {/* Actions */}
                          {notification.actions && (
                            <div className="flex gap-2 mt-2">
                              {notification.actions.map((action) => (
                                <button
                                  key={action.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    action.action();
                                  }}
                                  className={`px-2 py-1 text-xs rounded font-medium ${
                                    action.style === 'primary' 
                                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                                      : action.style === 'danger'
                                      ? 'bg-red-600 text-white hover:bg-red-700'
                                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                  }`}
                                >
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(notification.timestamp, { 
                                addSuffix: true, 
                                locale: fr 
                              })}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SlideIn>
                ))}
              </div>
            )}
          </div>
        </div>
      </Transition>

      {/* Overlay pour fermer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationCenter;
