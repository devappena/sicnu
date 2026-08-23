const CACHE_NAME = 'sicnu-v1.0.0';
const STATIC_CACHE_NAME = 'sicnu-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'sicnu-dynamic-v1.0.0';

// Ressources à mettre en cache immédiatement
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/static/css/main.css',
  '/static/js/main.js',
  '/pwa-icons/icon-192x192.png',
  '/pwa-icons/icon-512x512.png',
  '/offline.html'
];

// Ressources à mettre en cache dynamiquement
const DYNAMIC_ASSETS = [
  '/api/employees',
  '/api/absences',
  '/api/statistics',
  '/api/dashboard'
];

// Pages importantes à mettre en cache
const PAGES_TO_CACHE = [
  '/',
  '/dashboard',
  '/employees',
  '/absences',
  '/statistics',
  '/profile',
  '/settings'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installation en cours...');
  
  event.waitUntil(
    Promise.all([
      // Cache des ressources statiques
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('📦 Cache statique: Ajout des ressources');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Cache des pages principales
      caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
        console.log('📄 Cache dynamique: Préparation');
        return cache.addAll(PAGES_TO_CACHE);
      })
    ]).then(() => {
      console.log('✅ Service Worker: Installation terminée');
      // Force l'activation immédiate
      return self.skipWaiting();
    })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activation en cours...');
  
  event.waitUntil(
    Promise.all([
      // Nettoyage des anciens caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName !== CACHE_NAME) {
              console.log('🗑️ Suppression ancien cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Prise de contrôle immédiate
      self.clients.claim()
    ]).then(() => {
      console.log('✅ Service Worker: Activation terminée');
    })
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Stratégies de mise en cache selon le type de ressource
  if (request.method === 'GET') {
    // Ressources statiques: Cache First
    if (STATIC_ASSETS.some(asset => url.pathname.includes(asset))) {
      event.respondWith(cacheFirstStrategy(request));
      return;
    }

    // API: Network First avec fallback
    if (url.pathname.startsWith('/api/')) {
      event.respondWith(networkFirstStrategy(request));
      return;
    }

    // Pages: Stale While Revalidate
    if (PAGES_TO_CACHE.includes(url.pathname)) {
      event.respondWith(staleWhileRevalidateStrategy(request));
      return;
    }

    // Autres ressources: Network avec fallback cache
    event.respondWith(networkWithCacheFallback(request));
  }
});

// Stratégie Cache First (pour les ressources statiques)
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache First Error:', error);
    return getOfflineFallback(request);
  }
}

// Stratégie Network First (pour les API)
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network First: Fallback vers cache pour', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return getOfflineFallback(request);
  }
}

// Stratégie Stale While Revalidate (pour les pages)
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);

  return cachedResponse || fetchPromise;
}

// Stratégie Network avec fallback cache
async function networkWithCacheFallback(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || getOfflineFallback(request);
  }
}

// Fallback pour les pages hors ligne
function getOfflineFallback(request) {
  if (request.destination === 'document') {
    return caches.match('/offline.html');
  }
  
  // Fallback pour les images
  if (request.destination === 'image') {
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" fill="#9ca3af">Image non disponible</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }

  return new Response('Contenu non disponible hors ligne', {
    status: 503,
    statusText: 'Service indisponible'
  });
}

// Synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
  console.log('🔄 Background Sync:', event.tag);
  
  switch (event.tag) {
    case 'sync-employees':
      event.waitUntil(syncEmployees());
      break;
    case 'sync-absences':
      event.waitUntil(syncAbsences());
      break;
    case 'sync-notifications':
      event.waitUntil(syncNotifications());
      break;
  }
});

// Synchronisation des employés
async function syncEmployees() {
  try {
    const response = await fetch('/api/employees');
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put('/api/employees', response.clone());
      console.log('✅ Employés synchronisés');
    }
  } catch (error) {
    console.error('❌ Erreur sync employés:', error);
  }
}

// Synchronisation des absences
async function syncAbsences() {
  try {
    const response = await fetch('/api/absences');
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put('/api/absences', response.clone());
      console.log('✅ Absences synchronisées');
    }
  } catch (error) {
    console.error('❌ Erreur sync absences:', error);
  }
}

// Synchronisation des notifications
async function syncNotifications() {
  try {
    const response = await fetch('/api/notifications');
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put('/api/notifications', response.clone());
      console.log('✅ Notifications synchronisées');
    }
  } catch (error) {
    console.error('❌ Erreur sync notifications:', error);
  }
}

// Gestion des notifications push
self.addEventListener('push', (event) => {
  console.log('📱 Notification Push reçue');
  
  const options = {
    body: 'Vous avez de nouvelles notifications RH',
    icon: '/pwa-icons/icon-192x192.png',
    badge: '/pwa-icons/badge-72x72.png',
    tag: 'sicnu-notification',
    data: {
      url: '/notifications'
    },
    actions: [
      {
        action: 'open',
        title: 'Voir',
        icon: '/pwa-icons/action-open.png'
      },
      {
        action: 'close',
        title: 'Fermer',
        icon: '/pwa-icons/action-close.png'
      }
    ],
    requireInteraction: true,
    silent: false
  };

  if (event.data) {
    try {
      const data = event.data.json();
      options.body = data.body || options.body;
      options.data = { ...options.data, ...data };
    } catch (error) {
      console.error('Erreur parsing notification:', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification('SICNU', options)
  );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Clic sur notification:', event.action);
  
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const url = event.notification.data?.url || '/dashboard';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // Vérifie si l'app est déjà ouverte
      for (const client of windowClients) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Ouvre une nouvelle fenêtre
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Gestion des messages depuis l'app
self.addEventListener('message', (event) => {
  console.log('💬 Message reçu:', event.data);
  
  switch (event.data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_NAME });
      break;
    case 'CACHE_URLS':
      event.waitUntil(
        cacheUrls(event.data.urls).then(() => {
          event.ports[0].postMessage({ success: true });
        })
      );
      break;
  }
});

// Mise en cache d'URLs spécifiques
async function cacheUrls(urls) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  return Promise.all(
    urls.map(async (url) => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response);
        }
      } catch (error) {
        console.error('Erreur cache URL:', url, error);
      }
    })
  );
}

console.log('Service Worker SICNU prêt');
