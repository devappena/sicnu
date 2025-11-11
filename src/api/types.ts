/**
 * Types pour les réponses API standardisées
 */

/**
 * Réponse API générique
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

/**
 * Réponse API paginée
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message?: string;
}

/**
 * Erreur API standardisée
 */
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
  data?: unknown;
}

/**
 * Paramètres de pagination
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paramètres de filtrage
 */
export interface FilterParams {
  search?: string;
  status?: string;
  department?: string;
  startDate?: string;
  endDate?: string;
  [key: string]: any;
}

/**
 * Paramètres de requête combinés
 */
export interface QueryParams extends PaginationParams, FilterParams {
  [key: string]: string | number | boolean | undefined;
}
