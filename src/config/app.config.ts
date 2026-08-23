/**
 * Configuration de l'application
 * Centralise toutes les variables d'environnement et configurations
 */

import { identity } from './identity';

// Fonction helper pour obtenir une variable d'environnement
const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key];
  if (value === undefined && defaultValue === undefined) {
    console.warn(`Variable d'environnement manquante: ${key}`);
    return '';
  }
  return value || defaultValue || '';
};

// Fonction helper pour obtenir une variable booléenne
const getBoolEnvVar = (key: string, defaultValue = false): boolean => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
};

// Fonction helper pour obtenir une variable numérique
const getNumberEnvVar = (key: string, defaultValue: number): number => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Configuration de l'API
 */
export const apiConfig = {
  baseURL: getEnvVar('VITE_API_BASE_URL', 'http://localhost:3000/api'),
  timeout: getNumberEnvVar('VITE_API_TIMEOUT', 30000),
  enableLogging: getBoolEnvVar('VITE_ENABLE_API_LOGGING', true),
} as const;

/**
 * Configuration de l'authentification
 */
export const authConfig = {
  tokenStorageKey: getEnvVar('VITE_TOKEN_STORAGE_KEY', 'sicnu-auth-token'),
  refreshTokenKey: getEnvVar('VITE_REFRESH_TOKEN_KEY', 'sicnu-refresh-token'),
  tokenExpirationTime: getNumberEnvVar('VITE_TOKEN_EXPIRATION', 3600000), // 1 heure par défaut
} as const;

/**
 * Configuration de React Query
 */
export const reactQueryConfig = {
  enableDevtools: getBoolEnvVar('VITE_ENABLE_REACT_QUERY_DEVTOOLS', true),
  defaultStaleTime: getNumberEnvVar('VITE_QUERY_STALE_TIME', 60000), // 1 minute
  defaultCacheTime: getNumberEnvVar('VITE_QUERY_CACHE_TIME', 300000), // 5 minutes
  refetchOnWindowFocus: getBoolEnvVar('VITE_REFETCH_ON_FOCUS', false),
  retry: getNumberEnvVar('VITE_QUERY_RETRY', 1),
} as const;

/**
 * Configuration de l'application
 */
export const appConfig = {
  env: getEnvVar('VITE_APP_ENV', 'development'),
  isDevelopment: getEnvVar('VITE_APP_ENV', 'development') === 'development',
  isProduction: getEnvVar('VITE_APP_ENV', 'development') === 'production',
  appName: identity.appName,
  appVersion: '1.0.0',
} as const;

/**
 * Configuration des URLs externes
 */
export const externalUrls = {
  storage: getEnvVar('VITE_STORAGE_URL', ''),
  websocket: getEnvVar('VITE_WEBSOCKET_URL', ''),
} as const;

/**
 * Configuration complète exportée
 */
export const config = {
  api: apiConfig,
  auth: authConfig,
  reactQuery: reactQueryConfig,
  app: appConfig,
  external: externalUrls,
} as const;

// Export par défaut
export default config;

// Log de la configuration en développement
if (appConfig.isDevelopment) {
  console.log('📋 Configuration de l\'application:', {
    env: appConfig.env,
    apiBaseURL: apiConfig.baseURL,
    enableLogging: apiConfig.enableLogging,
    enableDevtools: reactQueryConfig.enableDevtools,
  });
}
