import React, { useState } from 'react';
import { 
  BellIcon,
  CheckIcon,
  TrashIcon,
  CalendarIcon,
  UserIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { mockNotifications } from '../../data/mockData';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import type { Notification } from '../../types';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'absence_request':
        return CalendarIcon;
      case 'training_reminder':
        return AcademicCapIcon;
      case 'evaluation_due':
        return ExclamationTriangleIcon;
      case 'birthday':
        return UserIcon;
      default:
        return InformationCircleIcon;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'absence_request':
        return 'text-blue-500';
      case 'training_reminder':
        return 'text-green-500';
      case 'evaluation_due':
        return 'text-yellow-500';
      case 'birthday':
        return 'text-pink-500';
      default:
        return 'text-gray-500';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    switch (filter) {
      case 'unread':
        return !notif.read;
      case 'read':
        return notif.read;
      default:
        return true;
    }
  });

  const quickNotificationActions = [
    {
      name: 'Marquer tout lu',
      description: 'Marquer toutes comme lues',
      icon: CheckIcon,
      color: 'bg-green-600 hover:bg-green-700',
      onClick: markAllAsRead
    },
    {
      name: 'Filtrer non lues',
      description: 'Voir les non lues',
      icon: BellIcon,
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => setFilter('unread')
    },
    {
      name: 'Filtrer lues',
      description: 'Voir les lues',
      icon: CheckIcon,
      color: 'bg-gray-600 hover:bg-gray-700',
      onClick: () => setFilter('read')
    },
    {
      name: 'Voir toutes',
      description: 'Afficher toutes',
      icon: InformationCircleIcon,
      color: 'bg-purple-600 hover:bg-purple-700',
      onClick: () => setFilter('all')
    }
  ];

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Notifications" 
        description="Gérez vos notifications et alertes"
        icon={BellIcon}
      />

      {/* Actions rapides de notification */}
      <Card>
        <h3 className="text-lg font-medium mb-4 text-gray-900">Actions Rapides</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickNotificationActions.map((action) => (
            <button
              key={action.name}
              onClick={action.onClick}
              className={`${action.color} text-white p-4 rounded-lg text-center transition-colors duration-200`}
            >
              <action.icon className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">{action.name}</div>
              <div className="text-xs opacity-80 mt-1">{action.description}</div>
            </button>
          ))}
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <BellIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-blue-600">{notifications.length}</p>
          <p className="text-sm text-gray-600">Total</p>
        </Card>

        <Card className="text-center">
          <BellIcon className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
          <p className="text-sm text-gray-600">Non lues</p>
          {unreadCount > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-2">
              Urgent
            </span>
          )}
        </Card>

        <Card className="text-center">
          <CheckIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-green-600">{notifications.length - unreadCount}</p>
          <p className="text-sm text-gray-600">Lues</p>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Toutes ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'unread'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Non lues ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'read'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Lues ({notifications.length - unreadCount})
          </button>
        </div>
      </Card>

      {/* Notifications List */}
      <Card>
        <ul className="divide-y divide-gray-200">
          {filteredNotifications.map((notification) => {
            const IconComponent = getNotificationIcon(notification.type);
            const iconColor = getNotificationColor(notification.type);
            
            return (
              <li key={notification.id} className={`${!notification.read ? 'bg-blue-50' : 'bg-white'} p-4 rounded-lg transition-colors`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <IconComponent className={`h-6 w-6 ${iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {format(new Date(notification.createdAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-red-400 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        
        {filteredNotifications.length === 0 && (
          <div className="px-4 py-8 sm:px-6 text-center">
            <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Aucune notification
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' 
                ? 'Vous n\'avez aucune notification pour le moment.'
                : filter === 'unread'
                ? 'Toutes vos notifications ont été lues.'
                : 'Aucune notification lue.'
              }
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Notifications;
