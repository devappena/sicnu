/**
 * Service de gestion des feuilles de temps
 * Gère le pointage et le suivi des heures de travail
 */

import { get, post, put } from '../client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '../types';

// Types pour les feuilles de temps
export interface TimesheetEntry {
  id: string;
  employeeId: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  breakDuration?: number; // en minutes
  totalHours?: number;
  overtime?: number;
  status: 'pending' | 'approved' | 'rejected';
  type: 'regular' | 'overtime' | 'remote' | 'on-site';
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  notes?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimesheetSummary {
  employeeId: string;
  period: {
    start: string;
    end: string;
  };
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  expectedHours: number;
  efficiency: number; // pourcentage
  daysWorked: number;
  daysAbsent: number;
  entries: TimesheetEntry[];
}

export interface ClockInData {
  date?: string; // Par défaut: date actuelle
  time?: string; // Par défaut: heure actuelle
  type?: 'regular' | 'overtime' | 'remote' | 'on-site';
  location?: {
    latitude: number;
    longitude: number;
  };
  notes?: string;
}

export interface ClockOutData {
  time?: string; // Par défaut: heure actuelle
  breakDuration?: number; // en minutes
  notes?: string;
}

export interface TimesheetApproval {
  entryIds: string[];
  status: 'approved' | 'rejected';
  comment?: string;
}

export interface WorkSchedule {
  id: string;
  employeeId: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  startTime: string;
  endTime: string;
  breakDuration: number; // en minutes
  active: boolean;
}

export interface TimesheetStats {
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  averageHoursPerDay: number;
  productivityRate: number;
  punctualityRate: number;
  byWeek: {
    week: string;
    hours: number;
    overtime: number;
  }[];
  byEmployee: {
    employeeId: string;
    employeeName: string;
    totalHours: number;
    overtime: number;
  }[];
}

const timesheetService = {
  /**
   * Récupère les entrées de pointage
   */
  getAll: async (params?: PaginationParams & {
    employeeId?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    type?: string;
  }): Promise<PaginatedResponse<TimesheetEntry>> => {
    return get<PaginatedResponse<TimesheetEntry>>('/timesheets', params);
  },

  /**
   * Récupère une entrée de pointage par ID
   */
  getById: async (id: string): Promise<ApiResponse<TimesheetEntry>> => {
    return get<TimesheetEntry>(`/timesheets/${id}`);
  },

  /**
   * Récupère les entrées d'un employé
   */
  getByEmployee: async (
    employeeId: string,
    params?: {
      startDate?: string;
      endDate?: string;
      status?: string;
    }
  ): Promise<ApiResponse<TimesheetEntry[]>> => {
    return get<TimesheetEntry[]>(`/timesheets/employee/${employeeId}`, params);
  },

  /**
   * Récupère le résumé des heures d'un employé
   */
  getSummary: async (
    employeeId: string,
    params?: {
      startDate?: string;
      endDate?: string;
    }
  ): Promise<ApiResponse<TimesheetSummary>> => {
    return get<TimesheetSummary>(`/timesheets/employee/${employeeId}/summary`, params);
  },

  /**
   * Effectue un pointage d'entrée (clock in)
   */
  clockIn: async (data?: ClockInData): Promise<ApiResponse<TimesheetEntry>> => {
    return post<TimesheetEntry>('/timesheets/clock-in', data || {});
  },

  /**
   * Effectue un pointage de sortie (clock out)
   */
  clockOut: async (
    entryId: string,
    data?: ClockOutData
  ): Promise<ApiResponse<TimesheetEntry>> => {
    return post<TimesheetEntry>(`/timesheets/${entryId}/clock-out`, data || {});
  },

  /**
   * Crée une entrée de pointage manuelle
   */
  create: async (data: {
    employeeId: string;
    date: string;
    clockIn: string;
    clockOut: string;
    breakDuration?: number;
    type?: 'regular' | 'overtime' | 'remote' | 'on-site';
    notes?: string;
  }): Promise<ApiResponse<TimesheetEntry>> => {
    return post<TimesheetEntry>('/timesheets', data);
  },

  /**
   * Met à jour une entrée de pointage
   */
  update: async (
    id: string,
    data: {
      clockIn?: string;
      clockOut?: string;
      breakDuration?: number;
      type?: string;
      notes?: string;
    }
  ): Promise<ApiResponse<TimesheetEntry>> => {
    return put<TimesheetEntry>(`/timesheets/${id}`, data);
  },

  /**
   * Supprime une entrée de pointage
   */
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return post<void>(`/timesheets/${id}/delete`);
  },

  /**
   * Approuve ou rejette des entrées de pointage
   */
  approve: async (data: TimesheetApproval): Promise<ApiResponse<{
    approved: number;
    rejected: number;
  }>> => {
    return post('/timesheets/approve', data);
  },

  /**
   * Récupère les entrées en attente d'approbation
   */
  getPending: async (params?: PaginationParams & {
    departmentId?: string;
  }): Promise<PaginatedResponse<TimesheetEntry>> => {
    return get<PaginatedResponse<TimesheetEntry>>('/timesheets/pending', params);
  },

  /**
   * Vérifie si un employé est actuellement pointé
   */
  getCurrentEntry: async (employeeId: string): Promise<ApiResponse<TimesheetEntry | null>> => {
    return get<TimesheetEntry | null>(`/timesheets/employee/${employeeId}/current`);
  },

  /**
   * Récupère l'emploi du temps d'un employé
   */
  getSchedule: async (employeeId: string): Promise<ApiResponse<WorkSchedule[]>> => {
    return get<WorkSchedule[]>(`/timesheets/employee/${employeeId}/schedule`);
  },

  /**
   * Met à jour l'emploi du temps d'un employé
   */
  updateSchedule: async (
    employeeId: string,
    schedule: Omit<WorkSchedule, 'id' | 'employeeId'>[]
  ): Promise<ApiResponse<WorkSchedule[]>> => {
    return put<WorkSchedule[]>(`/timesheets/employee/${employeeId}/schedule`, { schedule });
  },

  /**
   * Récupère les statistiques de pointage
   */
  getStatistics: async (params?: {
    startDate?: string;
    endDate?: string;
    departmentId?: string;
    employeeId?: string;
  }): Promise<ApiResponse<TimesheetStats>> => {
    return get<TimesheetStats>('/timesheets/statistics', params);
  },

  /**
   * Exporte les feuilles de temps
   */
  export: async (params?: {
    employeeId?: string;
    startDate?: string;
    endDate?: string;
    format?: 'excel' | 'csv' | 'pdf';
  }): Promise<Blob> => {
    const response = await get<Blob>('/timesheets/export', params, {
      responseType: 'blob'
    });
    return response.data;
  },

  /**
   * Calcule les heures travaillées pour une période
   */
  calculateHours: async (data: {
    employeeId: string;
    startDate: string;
    endDate: string;
  }): Promise<ApiResponse<{
    totalHours: number;
    regularHours: number;
    overtimeHours: number;
    expectedHours: number;
    variance: number;
  }>> => {
    return post('/timesheets/calculate-hours', data);
  },

  /**
   * Détecte les anomalies dans les pointages
   */
  detectAnomalies: async (params?: {
    startDate?: string;
    endDate?: string;
    employeeId?: string;
  }): Promise<ApiResponse<{
    id: string;
    employeeId: string;
    date: string;
    type: 'missing_clock_out' | 'long_shift' | 'short_shift' | 'unusual_hours';
    description: string;
    severity: 'low' | 'medium' | 'high';
  }[]>> => {
    return get('/timesheets/anomalies', params);
  }
};

export default timesheetService;
