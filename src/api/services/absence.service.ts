import { get, post, put, del } from '../client';
import type { ApiResponse, PaginatedResponse, QueryParams } from '../types';
import type { Absence } from '../../types';

/**
 * Données pour créer/mettre à jour une absence
 */
export interface AbsenceFormData {
  employeeId: string;
  type: 'congé' | 'maladie' | 'personnel' | 'formation';
  startDate: string;
  endDate: string;
  reason: string;
  documents?: File[];
}

/**
 * Service de gestion des absences
 */
export const absenceService = {
  /**
   * Récupérer toutes les absences (paginé)
   */
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<Absence>> => {
    return await get<PaginatedResponse<Absence>>('/absences', params);
  },

  /**
   * Récupérer une absence par ID
   */
  getById: async (id: string): Promise<Absence> => {
    const response = await get<ApiResponse<Absence>>(`/absences/${id}`);
    return response.data;
  },

  /**
   * Créer une nouvelle demande d'absence
   */
  create: async (data: AbsenceFormData): Promise<Absence> => {
    const response = await post<ApiResponse<Absence>>('/absences', data);
    return response.data;
  },

  /**
   * Mettre à jour une absence
   */
  update: async (id: string, data: Partial<AbsenceFormData>): Promise<Absence> => {
    const response = await put<ApiResponse<Absence>>(`/absences/${id}`, data);
    return response.data;
  },

  /**
   * Supprimer une absence
   */
  delete: async (id: string): Promise<void> => {
    await del<ApiResponse<void>>(`/absences/${id}`);
  },

  /**
   * Approuver une demande d'absence
   */
  approve: async (id: string, comment?: string): Promise<Absence> => {
    const response = await post<ApiResponse<Absence>>(`/absences/${id}/approve`, { comment });
    return response.data;
  },

  /**
   * Rejeter une demande d'absence
   */
  reject: async (id: string, reason: string): Promise<Absence> => {
    const response = await post<ApiResponse<Absence>>(`/absences/${id}/reject`, { reason });
    return response.data;
  },

  /**
   * Récupérer les absences en attente
   */
  getPending: async (): Promise<Absence[]> => {
    const response = await get<ApiResponse<Absence[]>>('/absences/pending');
    return response.data;
  },

  /**
   * Récupérer les absences par employé
   */
  getByEmployee: async (employeeId: string): Promise<Absence[]> => {
    const response = await get<ApiResponse<Absence[]>>(`/absences/employee/${employeeId}`);
    return response.data;
  },

  /**
   * Récupérer le solde de congés d'un employé
   */
  getBalance: async (employeeId: string): Promise<{ total: number; used: number; remaining: number }> => {
    const response = await get<ApiResponse<{ total: number; used: number; remaining: number }>>(
      `/absences/balance/${employeeId}`
    );
    return response.data;
  },

  /**
   * Vérifier les conflits de dates
   */
  checkConflicts: async (employeeId: string, startDate: string, endDate: string): Promise<boolean> => {
    const response = await post<ApiResponse<{ hasConflict: boolean }>>('/absences/check-conflicts', {
      employeeId,
      startDate,
      endDate,
    });
    return response.data.hasConflict;
  },

  /**
   * Exporter les absences
   */
  export: async (format: 'csv' | 'excel', params?: QueryParams): Promise<Blob> => {
    const response = await get<Blob>(`/absences/export?format=${format}`, params);
    return response;
  },
};

export default absenceService;
