import { useEffect, useState, useCallback } from 'react';

interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAHook {
  isSupported: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  canInstall: boolean;
  install: () => Promise<void>;
  registration: ServiceWorkerRegistration | null;
  updateAvailable: boolean;
  updateApp: () => void;
}

interface PendingAction {
  id: string;
  type: 'CREATE_EMPLOYEE' | 'UPDATE_EMPLOYEE' | 'DELETE_EMPLOYEE' | 'CREATE_ABSENCE' | 'UPDATE_ABSENCE';
  data: unknown;
  timestamp: number;
}

export const usePWA = (): PWAHook => {
  const [isSupported, setIsSupported] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [canInstall, setCanInstall] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<PWAInstallPrompt | null>(null);

  // Initialisation du PWA
  useEffect(() => {
    // Vérification du support PWA
    if ('serviceWorker' in navigator) {
      setIsSupported(true);
    }

    // Vérification de l'installation
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Enregistrement du Service Worker
    registerServiceWorker();

    // Écoute des événements
    setupEventListeners();

    return () => {    // Nettoyage
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Enregistrement du Service Worker
  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none'
        });

        setRegistration(registration);
        // Service Worker enregistré avec succès

        // Écoute des mises à jour
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
                // Mise à jour disponible
              }
            });
          }
        });

        // Écoute des messages du Service Worker
        navigator.serviceWorker.addEventListener('message', (_event) => {
          // Message reçu du Service Worker (événement traité)
        });

      } catch (error) {
        console.error('❌ Erreur enregistrement Service Worker:', error);
      }
    }
  };

  // Gestion de l'événement d'installation
  const handleBeforeInstallPrompt = (event: Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> }) => {
    event.preventDefault();
    setDeferredPrompt(event);
    setCanInstall(true);
    // Possibilité d'installation PWA détectée
  };

  // Configuration des écouteurs d'événements
  const setupEventListeners = () => {
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  };

  // Gestion de l'état en ligne
  const handleOnline = () => {
    setIsOffline(false);
    // Connexion rétablie
  };

  // Gestion de l'état hors ligne
  const handleOffline = () => {
    setIsOffline(true);
    // Mode hors ligne activé
  };

  // Installation de l'application
  const install = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          // PWA installée avec succès
          setIsInstalled(true);
        } else {
          // Installation PWA annulée
        }
        
        setDeferredPrompt(null);
        setCanInstall(false);
      } catch (error) {
        console.error('❌ Erreur installation PWA:', error);
      }
    }
  };

  // Mise à jour de l'application
  const updateApp = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  return {
    isSupported,
    isInstalled,
    isOffline,
    canInstall,
    install,
    registration,
    updateAvailable,
    updateApp
  };
};

// Hook pour les notifications push
export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true);
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        setSubscription(subscription);
        setIsSubscribed(!!subscription);
      }
    } catch (error) {
      console.error('Erreur vérification subscription:', error);
    }
  };

  const requestPermission = async () => {
    if (!isSupported) return false;

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  };

  const subscribe = async () => {
    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) return false;

      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) return false;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: generateVAPIDKey()
      });

      setSubscription(subscription);
      setIsSubscribed(true);

      // Envoyer la subscription au serveur
      await sendSubscriptionToServer(subscription);
      
      return true;
    } catch (error) {
      console.error('Erreur subscription push:', error);
      return false;
    }
  };

  const unsubscribe = async () => {
    if (subscription) {
      await subscription.unsubscribe();
      setSubscription(null);
      setIsSubscribed(false);
    }
  };

  const sendSubscriptionToServer = async (_subscription: PushSubscription) => {
    // TODO: Implémenter l'envoi de la subscription au serveur backend
  };

  const generateVAPIDKey = () => {
    // Clé VAPID pour les notifications push
    return 'BEl62iUYgUivxIkv69yViEuiBIa40HI8v5bZKNKfMNlz6nEEGYKJOJZjI6wZMpBrqNPuRJq7B7c8x3VZA4U8jIE';
  };

  return {
    isSupported,
    isSubscribed,
    subscribe,
    unsubscribe,
    requestPermission
  };
};

// Hook pour la synchronisation hors ligne
export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addPendingAction = (action: PendingAction) => {
    setPendingActions(prev => [...prev, action]);
    
    // Stocker dans localStorage pour persistance
    const stored = localStorage.getItem('pendingActions');
    const actions = stored ? JSON.parse(stored) : [];
    localStorage.setItem('pendingActions', JSON.stringify([...actions, action]));
  };

  const syncPendingActions = async () => {
    if (!isOnline || pendingActions.length === 0) return;

    try {
      // Traiter chaque action en attente
      for (const action of pendingActions) {
        await processAction(action);
      }
      
      // Nettoyer les actions traitées
      setPendingActions([]);
      localStorage.removeItem('pendingActions');
      
    } catch (error) {
      console.error('Erreur sync actions:', error);
    }
  };

  const processAction = async (action: PendingAction) => {
    switch (action.type) {
      case 'CREATE_EMPLOYEE':
        await fetch('/api/employees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.data)
        });
        break;
      case 'UPDATE_EMPLOYEE':
        await fetch(`/api/employees/${action.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.data)
        });
        break;
      // Ajouter d'autres types d'actions...
    }
  };

  return {
    isOnline,
    pendingActions,
    addPendingAction,
    syncPendingActions
  };
};
