import { useState } from 'react';
import { 
  BellIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  AcademicCapIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'absence' | 'training' | 'birthday';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'absence',
    title: 'Demande d\'absence',
    message: 'Fatou Diallo a soumis une demande de congé pour la période du 15-20 juillet',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: '2',
    type: 'training',
    title: 'Formation programmée',
    message: 'Formation en Leadership prévue demain à 9h00 en salle de conférence A',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
  },
  {
    id: '3',
    type: 'birthday',
    title: 'Anniversaire',
    message: 'Pierre Tshisekedi fête son anniversaire aujourd\'hui',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4) // 4 hours ago
  },
  {
    id: '4',
    type: 'info',
    title: 'Mise à jour système',
    message: 'Le système RH sera mis à jour ce weekend de 20h à 22h',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
  }
];

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

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

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'absence':
        return <CalendarIcon className="h-5 w-5 text-yellow-500" />;
      case 'training':
        return <AcademicCapIcon className="h-5 w-5 text-blue-500" />;
      case 'birthday':
        return <InformationCircleIcon className="h-5 w-5 text-purple-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'success':
        return <CheckIcon className="h-5 w-5 text-green-500" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes} min`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `Il y a ${hours}h`;
    } else {
      return format(date, 'dd MMM', { locale: fr });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-25" onClick={onClose} />
      
      <div className="absolute right-0 top-16 w-96 h-screen bg-white shadow-xl transform transition-transform"
           style={{ height: 'calc(100vh - 4rem)' }}>
        <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <BellIcon className="h-6 w-6 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 border-b">
          <button
            onClick={markAllAsRead}
            className="text-sm text-ena-blue hover:text-ena-blue font-medium"
            disabled={unreadCount === 0}
          >
            Tout marquer comme lu
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <BellIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucune notification</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50 border-l-4 border-ena-blue' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 pt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            !notification.read ? 'text-gray-900' : 'text-gray-600'
                          }`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {getTimeAgo(notification.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 rounded-full hover:bg-gray-200"
                              title="Marquer comme lu"
                            >
                              <CheckIcon className="h-4 w-4 text-green-500" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 rounded-full hover:bg-gray-200"
                            title="Supprimer"
                          >
                            <XMarkIcon className="h-4 w-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
