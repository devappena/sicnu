import axios from 'axios';
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { apiConfig, authConfig } from '@/config/app.config';

/**
 * Instance Axios configurée pour l'application
 * Utilise les variables d'environnement via la configuration centralisée
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Pour les cookies de session
});

/**
 * Intercepteur de requêtes
 * Ajoute le token d'authentification à chaque requête
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Récupérer le token depuis localStorage
    const token = localStorage.getItem(authConfig.tokenStorageKey);
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log en développement uniquement si activé dans la config
    if (apiConfig.enableLogging) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }

    return config;
  },
  (error: AxiosError) => {
    if (apiConfig.enableLogging) {
      console.error('❌ Request Error:', error);
    }
    return Promise.reject(error);
  }
);

/**
 * Intercepteur de réponses
 * Gère les erreurs globalement et les réponses
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log en développement uniquement si activé dans la config
    if (apiConfig.enableLogging) {
      console.log(`✅ API Response: ${response.config.url}`, response.data);
    }

    return response;
  },
  (error: AxiosError) => {
    // Gestion des erreurs HTTP
    if (error.response) {
      const status = error.response.status;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const message = (error.response.data as any)?.message || error.message;

      switch (status) {
        case 401:
          // Non authentifié - rediriger vers login
          if (apiConfig.enableLogging) {
            console.error('🔒 Unauthorized - Redirecting to login');
          }
          localStorage.removeItem(authConfig.tokenStorageKey);
          localStorage.removeItem(authConfig.refreshTokenKey);
          const basename = import.meta.env.BASE_URL.replace(/\/$/, '');
          window.location.href = `${basename}/auth/login`;
          break;

        case 403:
          // Accès interdit
          if (apiConfig.enableLogging) {
            console.error('🚫 Forbidden - Insufficient permissions');
          }
          break;

        case 404:
          // Ressource non trouvée
          if (apiConfig.enableLogging) {
            console.error('❓ Not Found:', error.config?.url);
          }
          break;

        case 422:
          // Erreur de validation
          console.error('⚠️ Validation Error:', message);
          break;

        case 500:
          // Erreur serveur
          console.error('💥 Server Error:', message);
          break;

        default:
          console.error(`❌ HTTP ${status}:`, message);
      }

      // Retourner une erreur formatée
      return Promise.reject({
        status,
        message,
        data: error.response.data,
      });
    } else if (error.request) {
      // La requête a été faite mais pas de réponse
      console.error('📡 Network Error - No response received');
      return Promise.reject({
        status: 0,
        message: 'Impossible de contacter le serveur. Vérifiez votre connexion.',
        data: null,
      });
    } else {
      // Erreur lors de la configuration de la requête
      console.error('⚙️ Request Configuration Error:', error.message);
      return Promise.reject({
        status: -1,
        message: error.message,
        data: null,
      });
    }
  }
);

/**
 * Helper pour gérer les requêtes GET
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const get = async <T>(url: string, params?: any): Promise<T> => {
  const response = await apiClient.get<T>(url, { params });
  return response.data;
};

/**
 * Helper pour gérer les requêtes POST
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const post = async <T>(url: string, data?: any): Promise<T> => {
  const response = await apiClient.post<T>(url, data);
  return response.data;
};

/**
 * Helper pour gérer les requêtes PUT
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const put = async <T>(url: string, data?: any): Promise<T> => {
  const response = await apiClient.put<T>(url, data);
  return response.data;
};

/**
 * Helper pour gérer les requêtes PATCH
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const patch = async <T>(url: string, data?: any): Promise<T> => {
  const response = await apiClient.patch<T>(url, data);
  return response.data;
};

/**
 * Helper pour gérer les requêtes DELETE
 */
export const del = async <T>(url: string): Promise<T> => {
  const response = await apiClient.delete<T>(url);
  return response.data;
};

/**
 * Helper pour upload de fichiers
 */
export const upload = async <T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<T>(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    },
  });

  return response.data;
};

export default apiClient;
