/**
 * Service de gestion des statistiques
 * Fournit des métriques pour le dashboard et les rapports
 */

import { get, post } from '../client';
import type { ApiResponse } from '../types';

// Types pour les statistiques
export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  totalAbsences: number;
  pendingAbsences: number;
  totalTrainings: number;
  upcomingTrainings: number;
  totalPayslips: number;
  pendingPayslips: number;
}

export interface EmployeeStats {
  byDepartment: {
    department: string;
    count: number;
    percentage: number;
  }[];
  byStatus: {
    status: string;
    count: number;
    percentage: number;
  }[];
  byContract: {
    type: string;
    count: number;
    percentage: number;
  }[];
  growth: {
    month: string;
    hired: number;
    terminated: number;
    net: number;
  }[];
}

export interface AbsenceStats {
  byType: {
    type: string;
    count: number;
    totalDays: number;
  }[];
  byStatus: {
    status: string;
    count: number;
  }[];
  byMonth: {
    month: string;
    count: number;
    days: number;
  }[];
  topAbsentees: {
    employeeId: string;
    employeeName: string;
    totalDays: number;
    absenceCount: number;
  }[];
}

export interface TrainingStats {
  byType: {
    type: string;
    count: number;
    participants: number;
  }[];
  byStatus: {
    status: string;
    count: number;
  }[];
  completion: {
    total: number;
    completed: number;
    inProgress: number;
    cancelled: number;
    rate: number;
  };
  byMonth: {
    month: string;
    count: number;
    participants: number;
    completed: number;
  }[];
}

export interface PayrollStats {
  totalAmount: number;
  averageSalary: number;
  byDepartment: {
    department: string;
    totalAmount: number;
    employeeCount: number;
    average: number;
  }[];
  byMonth: {
    month: string;
    totalAmount: number;
    employeeCount: number;
    average: number;
  }[];
  deductions: {
    type: string;
    totalAmount: number;
  }[];
  bonuses: {
    type: string;
    totalAmount: number;
  }[];
}

export interface ReportConfig {
  type: 'employees' | 'absences' | 'trainings' | 'payroll';
  startDate?: string;
  endDate?: string;
  department?: string;
  format?: 'pdf' | 'excel' | 'csv';
  includeCharts?: boolean;
}

export interface Report {
  id: string;
  type: string;
  name: string;
  generatedAt: string;
  generatedBy: string;
  url: string;
  size: number;
}

const statisticsService = {
  /**
   * Récupère les statistiques du dashboard
   */
  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    return get<DashboardStats>('/statistics/dashboard');
  },

  /**
   * Récupère les statistiques des employés
   */
  getEmployeeStats: async (params?: {
    startDate?: string;
    endDate?: string;
    department?: string;
  }): Promise<ApiResponse<EmployeeStats>> => {
    return get<EmployeeStats>('/statistics/employees', params);
  },

  /**
   * Récupère les statistiques des absences
   */
  getAbsenceStats: async (params?: {
    startDate?: string;
    endDate?: string;
    department?: string;
  }): Promise<ApiResponse<AbsenceStats>> => {
    return get<AbsenceStats>('/statistics/absences', params);
  },

  /**
   * Récupère les statistiques des formations
   */
  getTrainingStats: async (params?: {
    startDate?: string;
    endDate?: string;
    type?: string;
  }): Promise<ApiResponse<TrainingStats>> => {
    return get<TrainingStats>('/statistics/trainings', params);
  },

  /**
   * Récupère les statistiques de la paie
   */
  getPayrollStats: async (params?: {
    startDate?: string;
    endDate?: string;
    department?: string;
  }): Promise<ApiResponse<PayrollStats>> => {
    return get<PayrollStats>('/statistics/payroll', params);
  },

  /**
   * Génère un rapport personnalisé
   */
  generateReport: async (config: ReportConfig): Promise<ApiResponse<Report>> => {
    return post<Report>('/statistics/reports/generate', config);
  },

  /**
   * Récupère l'historique des rapports générés
   */
  getReports: async (params?: {
    type?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<Report[]>> => {
    return get<Report[]>('/statistics/reports', params);
  },

  /**
   * Télécharge un rapport
   */
  downloadReport: async (reportId: string): Promise<Blob> => {
    const response = await get<Blob>(`/statistics/reports/${reportId}/download`, undefined, {
      responseType: 'blob'
    });
    return response.data;
  },

  /**
   * Supprime un rapport
   */
  deleteReport: async (reportId: string): Promise<ApiResponse<void>> => {
    return post<void>(`/statistics/reports/${reportId}/delete`);
  },

  /**
   * Récupère les tendances globales
   */
  getTrends: async (params?: {
    metric: 'employees' | 'absences' | 'trainings' | 'payroll';
    period: 'week' | 'month' | 'quarter' | 'year';
    compare?: boolean;
  }): Promise<ApiResponse<{
    current: number;
    previous: number;
    change: number;
    changePercent: number;
    trend: 'up' | 'down' | 'stable';
  }>> => {
    return get('/statistics/trends', params);
  }
};

export default statisticsService;
