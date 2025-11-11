import { get, post, put, del } from '../client';
import type { ApiResponse, PaginatedResponse, QueryParams } from '../types';
import type { Employee } from '../../types';

/**
 * Données pour créer/mettre à jour un employé
 */
export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: string;
  salary?: number;
  status?: 'active' | 'inactive' | 'on_leave';
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

/**
 * Statistiques des employés
 */
export interface EmployeeStatistics {
  total: number;
  active: number;
  inactive: number;
  onLeave: number;
  byDepartment: Record<string, number>;
  byPosition: Record<string, number>;
  averageSalary: number;
  averageTenure: number;
}

/**
 * Résultat d'importation
 */
export interface ImportResult {
  success: number;
  errors: ImportError[];
}

/**
 * Erreur d'importation
 */
export interface ImportError {
  row: number;
  field: string;
  message: string;
}

/**
 * Historique d'un employé
 */
export interface EmployeeHistory {
  id: string;
  employeeId: string;
  action: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  performedBy: string;
  timestamp: string;
}

/**
 * Service de gestion des employés
 */
export const employeeService = {
  /**
   * Récupérer tous les employés (paginé)
   */
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<Employee>> => {
    return await get<PaginatedResponse<Employee>>('/employees', params);
  },

  /**
   * Récupérer un employé par ID
   */
  getById: async (id: string): Promise<Employee> => {
    const response = await get<ApiResponse<Employee>>(`/employees/${id}`);
    return response.data;
  },

  /**
   * Créer un nouvel employé
   */
  create: async (data: EmployeeFormData): Promise<Employee> => {
    const response = await post<ApiResponse<Employee>>('/employees', data);
    return response.data;
  },

  /**
   * Mettre à jour un employé
   */
  update: async (id: string, data: Partial<EmployeeFormData>): Promise<Employee> => {
    const response = await put<ApiResponse<Employee>>(`/employees/${id}`, data);
    return response.data;
  },

  /**
   * Supprimer un employé (soft delete)
   */
  delete: async (id: string): Promise<void> => {
    await del<ApiResponse<void>>(`/employees/${id}`);
  },

  /**
   * Rechercher des employés
   */
  search: async (query: string): Promise<Employee[]> => {
    const response = await get<ApiResponse<Employee[]>>('/employees/search', { q: query });
    return response.data;
  },

  /**
   * Récupérer les employés par département
   */
  getByDepartment: async (department: string): Promise<Employee[]> => {
    const response = await get<ApiResponse<Employee[]>>(`/employees/department/${department}`);
    return response.data;
  },

  /**
   * Récupérer les statistiques des employés
   */
  getStatistics: async (): Promise<EmployeeStatistics> => {
    const response = await get<ApiResponse<EmployeeStatistics>>('/employees/statistics');
    return response.data;
  },

  /**
   * Exporter les employés (CSV/Excel)
   */
  export: async (format: 'csv' | 'excel'): Promise<Blob> => {
    const response = await get<Blob>(`/employees/export?format=${format}`, {
      responseType: 'blob',
    });
    return response;
  },

  /**
   * Importer des employés depuis un fichier
   */
  import: async (file: File): Promise<ImportResult> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await post<ApiResponse<ImportResult>>(
      '/employees/import',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },

  /**
   * Activer/Désactiver un employé
   */
  toggleStatus: async (id: string): Promise<Employee> => {
    const response = await post<ApiResponse<Employee>>(`/employees/${id}/toggle-status`);
    return response.data;
  },

  /**
   * Récupérer l'historique d'un employé
   */
  getHistory: async (id: string): Promise<EmployeeHistory[]> => {
    const response = await get<ApiResponse<EmployeeHistory[]>>(`/employees/${id}/history`);
    return response.data;
  },
};

export default employeeService;
