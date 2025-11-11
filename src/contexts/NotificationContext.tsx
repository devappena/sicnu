import React, { useState, useContext, createContext, useCallback } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  persistent?: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    // Notifications de démonstration
    {
      id: 'demo-1',
      type: 'info',
      title: 'Nouvelle demande d\'absence',
      message: 'Marie Kasongo a soumis une demande de congé pour la semaine prochaine.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      actionUrl: '/absences',
      actionLabel: 'Examiner'
    },
    {
      id: 'demo-2',
      type: 'warning',
      title: 'Formation bientôt complète',
      message: 'La formation "Leadership avancé" n\'a plus que 2 places disponibles.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
      actionUrl: '/formations',
      actionLabel: 'Voir formation'
    },
    {
      id: 'demo-3',
      type: 'success',
      title: 'Rapport mensuel généré',
      message: 'Le rapport RH de décembre est maintenant disponible.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
      actionUrl: '/statistics',
      actionLabel: 'Télécharger'
    },
    {
      id: 'demo-4',
      type: 'error',
      title: 'Problème de synchronisation',
      message: 'Échec de la synchronisation avec le système de paie externe.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      read: false,
      persistent: true
    }
  ]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto-suppression pour les notifications non persistantes
    if (!notification.persistent) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(notif => notif.id !== newNotification.id));
      }, 10000); // 10 secondes
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      markAsRead,
      markAllAsRead,
      clearAll,
      unreadCount
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
