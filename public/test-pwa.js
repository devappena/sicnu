// Script de test pour déclencher l'installation PWA
// À coller dans la console DevTools (F12)

console.log('🚀 Test PWA Installation - ENA Portail RH');

// 1. Vérifier si le navigateur supporte les PWA
if ('serviceWorker' in navigator) {
  console.log('✅ Service Worker supporté');
} else {
  console.log('❌ Service Worker non supporté');
}

// 2. Enregistrer le service worker
navigator.serviceWorker.register('/sw.js')
  .then(registration => {
    console.log('✅ Service Worker enregistré:', registration);
  })
  .catch(error => {
    console.log('❌ Erreur Service Worker:', error);
  });

// 3. Vérifier le manifeste
fetch('/manifest.json')
  .then(response => response.json())
  .then(manifest => {
    console.log('✅ Manifeste chargé:', manifest);
  })
  .catch(error => {
    console.log('❌ Erreur Manifeste:', error);
  });

// 4. Forcer l'événement beforeinstallprompt (pour test)
setTimeout(() => {
  console.log('🔄 Tentative de déclenchement du prompt d\'installation...');
  
  // Créer un événement beforeinstallprompt personnalisé
  const event = new Event('beforeinstallprompt');
  event.prompt = () => {
    console.log('📱 Prompt d\'installation déclenché manuellement');
    return Promise.resolve({ outcome: 'accepted' });
  };
  
  window.dispatchEvent(event);
  
  // Afficher un message dans la console
  console.log(`
🎯 INSTRUCTIONS POUR TESTER L'INSTALLATION PWA :

1. 📱 CHROME/EDGE :
   - Regarder dans la barre d'adresse pour l'icône d'installation
   - Ou aller dans Menu (⋮) → "Installer ENA Portail RH"

2. 🦊 FIREFOX :
   - Menu → "Installer cette application"
   - Ou cliquer sur l'icône + dans la barre d'adresse

3. 🔧 SI L'ICÔNE N'APPARAÎT PAS :
   - Vérifier que vous êtes sur localhost:5173
   - Rafraîchir la page (F5)
   - Vider le cache (Ctrl+Shift+R)
   - Réessayer dans un onglet de navigation privée

4. ✅ VÉRIFICATIONS :
   - DevTools → Application → Manifest (doit afficher le JSON)
   - DevTools → Application → Service Workers (doit être "Running")
   - Console → Aucune erreur rouge

5. 🎮 APRÈS INSTALLATION :
   - L'app s'ouvre dans une fenêtre séparée
   - Déconnecter le réseau pour tester le mode offline
   - Cliquer sur l'icône 🔔 pour tester les notifications
  `);
}, 2000);

// 5. Vérifier l'état des notifications
if ('Notification' in window) {
  console.log('✅ Notifications supportées');
  console.log('🔔 Permission notifications:', Notification.permission);
  
  if (Notification.permission === 'default') {
    console.log('📢 Demande de permission pour les notifications...');
    Notification.requestPermission().then(permission => {
      console.log('🔔 Permission accordée:', permission);
    });
  }
} else {
  console.log('❌ Notifications non supportées');
}

// 6. Tester une notification
setTimeout(() => {
  if (Notification.permission === 'granted') {
    console.log('🔔 Test d\'une notification...');
    new Notification('ENA Portail RH', {
      body: 'PWA installée avec succès ! 🎉',
      icon: '/pwa-icons/icon-192x192.png',
      badge: '/pwa-icons/icon-72x72.png'
    });
  }
}, 5000);

console.log('✨ Script de test PWA terminé. Regardez les instructions ci-dessus ! ✨');
