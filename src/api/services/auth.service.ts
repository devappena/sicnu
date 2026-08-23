import { post, get } from '../client';
import { authConfig } from '@/config/app.config';
import type { ApiResponse } from '../types';
import type { User } from '../../types';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: User['role'];
  department?: string;
  position?: string;
}

/**
 * Credentials pour la connexion
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Credentials pour l'inscription
 */
export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

/**
 * Réponse d'authentification
 */
export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken?: string;
  expiresIn: number;
}

/**
 * Service d'authentification
 */
export const authService = {
  /**
   * Connexion utilisateur
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    
    // Stocker le token
    if (response.data.token) {
      localStorage.setItem(authConfig.tokenStorageKey, response.data.token);
      if (credentials.rememberMe && response.data.refreshToken) {
        localStorage.setItem(authConfig.refreshTokenKey, response.data.refreshToken);
      }
    }
    
    return response.data;
  },

  /**
   * Inscription utilisateur
   */
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await post<ApiResponse<AuthResponse>>('/auth/register', credentials);
    
    // Stocker le token après inscription
    if (response.data.token) {
      localStorage.setItem(authConfig.tokenStorageKey, response.data.token);
    }
    
    return response.data;
  },

  /**
   * Déconnexion
   */
  logout: async (): Promise<void> => {
    try {
      await post('/auth/logout');
    } finally {
      // Nettoyer le localStorage même si la requête échoue
      localStorage.removeItem(authConfig.tokenStorageKey);
      localStorage.removeItem(authConfig.refreshTokenKey);
      localStorage.removeItem('sicnu_user');
      localStorage.removeItem('ena_user');
    }
  },

  /**
   * Récupérer l'utilisateur actuel
   */
  getCurrentUser: async (): Promise<AuthUser> => {
    const response = await get<ApiResponse<AuthUser>>('/auth/me');
    return response.data;
  },

  /**
   * Rafraîchir le token
   */
  refreshToken: async (): Promise<AuthResponse> => {
    const refreshToken = localStorage.getItem(authConfig.refreshTokenKey);
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await post<ApiResponse<AuthResponse>>('/auth/refresh', {
      refreshToken,
    });

    // Mettre à jour le token
    if (response.data.token) {
      localStorage.setItem(authConfig.tokenStorageKey, response.data.token);
    }

    return response.data;
  },

  /**
   * Demander la réinitialisation du mot de passe
   */
  forgotPassword: async (email: string): Promise<void> => {
    await post<ApiResponse<void>>('/auth/forgot-password', { email });
  },

  /**
   * Réinitialiser le mot de passe
   */
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await post<ApiResponse<void>>('/auth/reset-password', {
      token,
      newPassword,
    });
  },

  /**
   * Changer le mot de passe
   */
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await post<ApiResponse<void>>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },

  /**
   * Vérifier si le token est valide
   */
  verifyToken: async (): Promise<boolean> => {
    try {
      await get('/auth/verify');
      return true;
    } catch {
      return false;
    }
  },
};

export default authService;
