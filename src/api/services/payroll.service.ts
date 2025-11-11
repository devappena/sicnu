import { get, post } from '../client';
import type { ApiResponse, PaginatedResponse, QueryParams } from '../types';

/**
 * Bulletin de paie
 */
export interface Payslip {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  grossSalary: number;
  netSalary: number;
  deductions: Deduction[];
  bonuses: Bonus[];
  status: 'draft' | 'validated' | 'paid';
  generatedAt: string;
  paidAt?: string;
}

/**
 * Déduction sur salaire
 */
export interface Deduction {
  type: string;
  amount: number;
  description?: string;
}

/**
 * Prime/Bonus
 */
export interface Bonus {
  type: string;
  amount: number;
  description?: string;
}

/**
 * Données pour générer un bulletin de paie
 */
export interface PayslipGenerationData {
  employeeId: string;
  month: number;
  year: number;
  bonuses?: Bonus[];
  deductions?: Deduction[];
}

/**
 * Service de gestion de la paie
 */
export const payrollService = {
  /**
   * Récupérer tous les bulletins de paie (paginé)
   */
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<Payslip>> => {
    return await get<PaginatedResponse<Payslip>>('/payroll', params);
  },

  /**
   * Récupérer un bulletin de paie par ID
   */
  getById: async (id: string): Promise<Payslip> => {
    const response = await get<ApiResponse<Payslip>>(`/payroll/${id}`);
    return response.data;
  },

  /**
   * Récupérer les bulletins d'un employé
   */
  getByEmployee: async (employeeId: string): Promise<Payslip[]> => {
    const response = await get<ApiResponse<Payslip[]>>(`/payroll/employee/${employeeId}`);
    return response.data;
  },

  /**
   * Générer les bulletins de paie pour un mois
   */
  generateMonth: async (month: number, year: number): Promise<{ generated: number; errors: string[] }> => {
    const response = await post<ApiResponse<{ generated: number; errors: string[] }>>(
      '/payroll/generate/month',
      { month, year }
    );
    return response.data;
  },

  /**
   * Générer un bulletin de paie individuel
   */
  generateSingle: async (data: PayslipGenerationData): Promise<Payslip> => {
    const response = await post<ApiResponse<Payslip>>('/payroll/generate/single', data);
    return response.data;
  },

  /**
   * Valider un bulletin de paie
   */
  validate: async (id: string): Promise<Payslip> => {
    const response = await post<ApiResponse<Payslip>>(`/payroll/${id}/validate`);
    return response.data;
  },

  /**
   * Marquer comme payé
   */
  markAsPaid: async (id: string): Promise<Payslip> => {
    const response = await post<ApiResponse<Payslip>>(`/payroll/${id}/mark-paid`);
    return response.data;
  },

  /**
   * Télécharger un bulletin de paie (PDF)
   */
  downloadPDF: async (id: string): Promise<Blob> => {
    const response = await get<Blob>(`/payroll/${id}/pdf`, { responseType: 'blob' });
    return response;
  },

  /**
   * Envoyer un bulletin de paie par email
   */
  sendByEmail: async (id: string): Promise<void> => {
    await post<ApiResponse<void>>(`/payroll/${id}/send-email`);
  },

  /**
   * Récupérer les statistiques de paie
   */
  getStatistics: async (month?: number, year?: number): Promise<PayrollStatistics> => {
    const response = await get<ApiResponse<PayrollStatistics>>('/payroll/statistics', {
      month,
      year,
    });
    return response.data;
  },

  /**
   * Exporter les données de paie
   */
  export: async (format: 'csv' | 'excel', params?: QueryParams): Promise<Blob> => {
    const response = await get<Blob>(`/payroll/export?format=${format}`, params);
    return response;
  },
};

/**
 * Statistiques de paie
 */
export interface PayrollStatistics {
  totalGross: number;
  totalNet: number;
  totalDeductions: number;
  totalBonuses: number;
  employeeCount: number;
  averageGross: number;
  averageNet: number;
}

export default payrollService;
