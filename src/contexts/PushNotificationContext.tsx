import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { usePushNotifications } from '../hooks/usePWA';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'urgent';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  persistent: boolean;
  actions?: NotificationAction[];
  metadata?: Record<string, unknown>;
}

interface NotificationAction {
  id: string;
  label: string;
  action: () => void;
  style: 'primary' | 'secondary' | 'danger';
}

interface PushNotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  isSupported: boolean;
  isSubscribed: boolean;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<void>;
  showBrowserNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
}

const PushNotificationContext = createContext<PushNotificationContextValue | undefined>(undefined);

export { PushNotificationContext };

interface PushNotificationProviderProps {
  children: React.ReactNode;
}

export const PushNotificationProvider: React.FC<PushNotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { isSupported, isSubscribed, subscribe, unsubscribe } = usePushNotifications();

  // Charger les notifications depuis localStorage au démarrage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('ena-notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        const notificationsWithDates = parsed.map((notif: Notification) => ({
          ...notif,
          timestamp: new Date(notif.timestamp)
        }));
        setNotifications(notificationsWithDates);
      } catch (error) {
        console.error('Erreur chargement notifications:', error);
      }
    }
  }, []);

  // Sauvegarder les notifications dans localStorage
  useEffect(() => {
    localStorage.setItem('ena-notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Simuler la réception de notifications en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulation de notifications aléatoires
      if (Math.random() > 0.95) { // 5% de chance toutes les 10 secondes
        const randomNotifications = [
          {
            type: 'info' as const,
            title: 'Nouveau message',
            message: 'Vous avez reçu un nouveau message de la direction',
            persistent: false
          },
          {
            type: 'warning' as const,
            title: 'Demande d\'absence',
            message: 'Une nouvelle demande d\'absence nécessite votre approbation',
            persistent: true,
            actions: [
              {
                id: 'approve',
                label: 'Approuver',
                action: () => {/* TODO: Implémenter l'approbation */},
                style: 'primary' as const
              },
              {
                id: 'reject',
                label: 'Rejeter',
                action: () => {/* TODO: Implémenter le rejet */},
                style: 'danger' as const
              }
            ]
          },
          {
            type: 'success' as const,
            title: 'Objectif atteint',
            message: 'Félicitations ! Vous avez atteint 100% de vos objectifs ce mois-ci',
            persistent: false
          },
          {
            type: 'urgent' as const,
            title: 'Action requise',
            message: 'Le rapport mensuel doit être soumis avant 17h aujourd\'hui',
            persistent: true
          }
        ];
        
        const randomNotif = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
        addNotification(randomNotif);
      }
    }, 10000); // Toutes les 10 secondes

    return () => clearInterval(interval);
  }, []);

  // Ajouter une notification
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Afficher la notification du navigateur si supportée
    if (isSupported && isSubscribed) {
      showBrowserNotification(notification);
    }

    // Auto-supprimer les notifications non persistantes après 5 secondes
    if (!notification.persistent) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 5000);
    }
  }, [isSupported, isSubscribed]);

  // Marquer comme lu
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  }, []);

  // Marquer toutes comme lues
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  }, []);

  // Supprimer une notification
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  // Supprimer toutes les notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Afficher une notification du navigateur
  const showBrowserNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    if (!('Notification' in window)) return;

    const options: NotificationOptions = {
      body: notification.message,
      icon: '/pwa-icons/icon-192x192.png',
      badge: '/pwa-icons/badge-72x72.png',
      tag: notification.type,
      data: notification.metadata,
      requireInteraction: notification.persistent
    };

    // Définir l'icône selon le type
    switch (notification.type) {
      case 'success':
        options.icon = '/pwa-icons/success.png';
        break;
      case 'warning':
        options.icon = '/pwa-icons/warning.png';
        break;
      case 'error':
        options.icon = '/pwa-icons/error.png';
        break;
      case 'urgent':
        options.icon = '/pwa-icons/urgent.png';
        break;
    }

    const browserNotification = new Notification(notification.title, options);

    // Gestion des clics
    browserNotification.onclick = () => {
      window.focus();
      browserNotification.close();
    };

    // Auto-fermeture pour les notifications non persistantes
    if (!notification.persistent) {
      setTimeout(() => {
        browserNotification.close();
      }, 5000);
    }
  }, []);

  // Calculer le nombre de notifications non lues
  const unreadCount = notifications.filter(notif => !notif.read).length;

  const value: PushNotificationContextValue = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    isSupported,
    isSubscribed,
    subscribe,
    unsubscribe,
    showBrowserNotification
  };

  return (
    <PushNotificationContext.Provider value={value}>
      {children}
    </PushNotificationContext.Provider>
  );
};

export const usePushNotificationContext = () => {
  const context = useContext(PushNotificationContext);
  if (context === undefined) {
    throw new Error('usePushNotificationContext must be used within a PushNotificationProvider');
  }
  return context;
};

// Hook pour envoyer des notifications prédéfinies
export const useNotificationTemplates = () => {
  const { addNotification } = usePushNotificationContext();

  const sendEmployeeNotification = useCallback((type: 'hired' | 'promoted' | 'terminated', employeeName: string) => {
    const templates = {
      hired: {
        type: 'success' as const,
        title: 'Nouvel employé',
        message: `${employeeName} a rejoint l'équipe`,
        persistent: false
      },
      promoted: {
        type: 'success' as const,
        title: 'Promotion',
        message: `${employeeName} a été promu`,
        persistent: false
      },
      terminated: {
        type: 'info' as const,
        title: 'Départ',
        message: `${employeeName} a quitté l'entreprise`,
        persistent: false
      }
    };

    addNotification(templates[type]);
  }, [addNotification]);

  const sendAbsenceNotification = useCallback((type: 'request' | 'approved' | 'rejected', employeeName: string) => {
    const templates = {
      request: {
        type: 'warning' as const,
        title: 'Demande d\'absence',
        message: `${employeeName} a demandé une absence`,
        persistent: true,
        actions: [
          {
            id: 'approve',
            label: 'Approuver',
            action: () => {/* TODO: Implémenter l'approbation d'absence */},
            style: 'primary' as const
          },
          {
            id: 'reject',
            label: 'Rejeter',
            action: () => {/* TODO: Implémenter le rejet d'absence */},
            style: 'danger' as const
          }
        ]
      },
      approved: {
        type: 'success' as const,
        title: 'Absence approuvée',
        message: `L'absence de ${employeeName} a été approuvée`,
        persistent: false
      },
      rejected: {
        type: 'error' as const,
        title: 'Absence rejetée',
        message: `L'absence de ${employeeName} a été rejetée`,
        persistent: false
      }
    };

    addNotification(templates[type]);
  }, [addNotification]);

  const sendSystemNotification = useCallback((type: 'maintenance' | 'update' | 'error', message?: string) => {
    const templates = {
      maintenance: {
        type: 'warning' as const,
        title: 'Maintenance programmée',
        message: message || 'Une maintenance est programmée ce soir à 22h',
        persistent: true
      },
      update: {
        type: 'info' as const,
        title: 'Mise à jour disponible',
        message: message || 'Une nouvelle version de l\'application est disponible',
        persistent: false
      },
      error: {
        type: 'error' as const,
        title: 'Erreur système',
        message: message || 'Une erreur technique a été détectée',
        persistent: true
      }
    };

    addNotification(templates[type]);
  }, [addNotification]);

  return {
    sendEmployeeNotification,
    sendAbsenceNotification,
    sendSystemNotification
  };
};
