/**
 * Configuration pour le mode développement
 * Active les données mockées quand le backend n'est pas disponible
 */

export const config = {
  // Mode mock activé par défaut en développement
  USE_MOCK_DATA: import.meta.env.VITE_USE_MOCK_DATA === 'true' || true,
  
  // URL de l'API (sera utilisée quand le backend sera prêt)
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  
  // Délai pour simuler les requêtes réseau (en ms)
  MOCK_DELAY: 500,
};
