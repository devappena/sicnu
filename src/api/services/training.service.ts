import { get, post, put, del } from '../client';
import type { ApiResponse, PaginatedResponse, QueryParams } from '../types';
import type { Training } from '../../types';

/**
 * Données pour créer/mettre à jour une formation
 */
export interface TrainingFormData {
  title: string;
  description: string;
  instructor: string;
  startDate: string;
  endDate: string;
  location: string;
  maxParticipants: number;
  cost: number;
  category: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  status?: 'planned' | 'ongoing' | 'completed' | 'cancelled';
}

/**
 * Inscription à une formation
 */
export interface TrainingEnrollment {
  trainingId: string;
  employeeId: string;
  notes?: string;
}

/**
 * Service de gestion des formations
 */
export const trainingService = {
  /**
   * Récupérer toutes les formations (paginé)
   */
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<Training>> => {
    return await get<PaginatedResponse<Training>>('/trainings', params);
  },

  /**
   * Récupérer une formation par ID
   */
  getById: async (id: string): Promise<Training> => {
    const response = await get<ApiResponse<Training>>(`/trainings/${id}`);
    return response.data;
  },

  /**
   * Créer une nouvelle formation
   */
  create: async (data: TrainingFormData): Promise<Training> => {
    const response = await post<ApiResponse<Training>>('/trainings', data);
    return response.data;
  },

  /**
   * Mettre à jour une formation
   */
  update: async (id: string, data: Partial<TrainingFormData>): Promise<Training> => {
    const response = await put<ApiResponse<Training>>(`/trainings/${id}`, data);
    return response.data;
  },

  /**
   * Supprimer une formation
   */
  delete: async (id: string): Promise<void> => {
    await del<ApiResponse<void>>(`/trainings/${id}`);
  },

  /**
   * Inscrire un employé à une formation
   */
  enroll: async (data: TrainingEnrollment): Promise<void> => {
    await post<ApiResponse<void>>('/trainings/enroll', data);
  },

  /**
   * Désinscrire un employé d'une formation
   */
  unenroll: async (trainingId: string, employeeId: string): Promise<void> => {
    await del<ApiResponse<void>>(`/trainings/${trainingId}/participants/${employeeId}`);
  },

  /**
   * Récupérer les participants d'une formation
   */
  getParticipants: async (trainingId: string): Promise<string[]> => {
    const response = await get<ApiResponse<string[]>>(`/trainings/${trainingId}/participants`);
    return response.data;
  },

  /**
   * Récupérer les formations d'un employé
   */
  getByEmployee: async (employeeId: string): Promise<Training[]> => {
    const response = await get<ApiResponse<Training[]>>(`/trainings/employee/${employeeId}`);
    return response.data;
  },

  /**
   * Récupérer les formations à venir
   */
  getUpcoming: async (): Promise<Training[]> => {
    const response = await get<ApiResponse<Training[]>>('/trainings/upcoming');
    return response.data;
  },

  /**
   * Marquer une formation comme terminée
   */
  complete: async (id: string, feedback?: Record<string, unknown>): Promise<Training> => {
    const response = await post<ApiResponse<Training>>(`/trainings/${id}/complete`, { feedback });
    return response.data;
  },

  /**
   * Annuler une formation
   */
  cancel: async (id: string, reason: string): Promise<Training> => {
    const response = await post<ApiResponse<Training>>(`/trainings/${id}/cancel`, { reason });
    return response.data;
  },

  /**
   * Générer un certificat de formation
   */
  generateCertificate: async (trainingId: string, employeeId: string): Promise<Blob> => {
    const response = await get<Blob>(
      `/trainings/${trainingId}/certificate/${employeeId}`,
      { responseType: 'blob' }
    );
    return response;
  },

  /**
   * Exporter les formations
   */
  export: async (format: 'csv' | 'excel', params?: QueryParams): Promise<Blob> => {
    const response = await get<Blob>(`/trainings/export?format=${format}`, params);
    return response;
  },
};

export default trainingService;
