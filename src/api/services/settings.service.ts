/**
 * Service de gestion des paramètres
 * Gère les préférences utilisateur et la configuration système
 */

import { get, put, post } from '../client';
import type { ApiResponse } from '../types';

// Types pour les paramètres
export interface UserSettings {
  profile: {
    language: 'fr' | 'en' | 'ar';
    timezone: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
  };
  display: {
    theme: 'light' | 'dark' | 'auto';
    sidebarCollapsed: boolean;
    density: 'comfortable' | 'compact' | 'spacious';
    fontSize: 'small' | 'medium' | 'large';
  };
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
    sound: boolean;
    desktop: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'team';
    showEmail: boolean;
    showPhone: boolean;
    allowMessages: boolean;
  };
  calendar: {
    firstDayOfWeek: 0 | 1; // 0 = Dimanche, 1 = Lundi
    workingDays: number[]; // 0-6
    workingHours: {
      start: string;
      end: string;
    };
    showWeekNumbers: boolean;
    defaultView: 'month' | 'week' | 'day';
  };
}

export interface SystemSettings {
  general: {
    companyName: string;
    companyLogo: string;
    primaryColor: string;
    secondaryColor: string;
    defaultLanguage: string;
    defaultTimezone: string;
  };
  employees: {
    autoGenerateId: boolean;
    idPrefix: string;
    requireApproval: boolean;
    probationPeriod: number; // en jours
    minPasswordLength: number;
    passwordExpiry: number; // en jours
  };
  absences: {
    requireApproval: boolean;
    autoApproveAfter: number; // en jours
    maxAdvanceRequest: number; // en jours
    minNotice: number; // en jours
    allowNegativeBalance: boolean;
    carryOverDays: boolean;
    maxCarryOver: number; // en jours
  };
  trainings: {
    requireApproval: boolean;
    autoEnrollment: boolean;
    certificateTemplate: string;
    reminderDays: number[];
    maxParticipants: number;
  };
  payroll: {
    paymentDay: number; // 1-31
    currency: string;
    taxRate: number;
    socialSecurityRate: number;
    autoGenerate: boolean;
    requireApproval: boolean;
  };
  security: {
    sessionTimeout: number; // en minutes
    maxLoginAttempts: number;
    lockoutDuration: number; // en minutes
    requireTwoFactor: boolean;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSymbols: boolean;
      expiryDays: number;
    };
  };
}

export interface Department {
  id: string;
  name: string;
  code: string;
  managerId?: string;
  parentId?: string;
  active: boolean;
}

export interface Position {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  level: string;
  active: boolean;
}

export interface LeaveType {
  id: string;
  name: string;
  code: string;
  color: string;
  isPaid: boolean;
  requiresDocument: boolean;
  maxDaysPerYear: number;
  carryOver: boolean;
  active: boolean;
}

const settingsService = {
  // Paramètres utilisateur
  /**
   * Récupère les paramètres de l'utilisateur
   */
  getUserSettings: async (): Promise<ApiResponse<UserSettings>> => {
    return get<UserSettings>('/settings/user');
  },

  /**
   * Met à jour les paramètres de l'utilisateur
   */
  updateUserSettings: async (
    settings: Partial<UserSettings>
  ): Promise<ApiResponse<UserSettings>> => {
    return put<UserSettings>('/settings/user', settings);
  },

  /**
   * Réinitialise les paramètres utilisateur par défaut
   */
  resetUserSettings: async (): Promise<ApiResponse<UserSettings>> => {
    return post<UserSettings>('/settings/user/reset');
  },

  // Paramètres système (Admin uniquement)
  /**
   * Récupère les paramètres système
   */
  getSystemSettings: async (): Promise<ApiResponse<SystemSettings>> => {
    return get<SystemSettings>('/settings/system');
  },

  /**
   * Met à jour les paramètres système
   */
  updateSystemSettings: async (
    settings: Partial<SystemSettings>
  ): Promise<ApiResponse<SystemSettings>> => {
    return put<SystemSettings>('/settings/system', settings);
  },

  /**
   * Réinitialise les paramètres système par défaut
   */
  resetSystemSettings: async (): Promise<ApiResponse<SystemSettings>> => {
    return post<SystemSettings>('/settings/system/reset');
  },

  // Départements
  /**
   * Récupère tous les départements
   */
  getDepartments: async (): Promise<ApiResponse<Department[]>> => {
    return get<Department[]>('/settings/departments');
  },

  /**
   * Crée un département
   */
  createDepartment: async (
    data: Omit<Department, 'id'>
  ): Promise<ApiResponse<Department>> => {
    return post<Department>('/settings/departments', data);
  },

  /**
   * Met à jour un département
   */
  updateDepartment: async (
    id: string,
    data: Partial<Department>
  ): Promise<ApiResponse<Department>> => {
    return put<Department>(`/settings/departments/${id}`, data);
  },

  /**
   * Supprime un département
   */
  deleteDepartment: async (id: string): Promise<ApiResponse<void>> => {
    return post<void>(`/settings/departments/${id}/delete`);
  },

  // Postes
  /**
   * Récupère tous les postes
   */
  getPositions: async (departmentId?: string): Promise<ApiResponse<Position[]>> => {
    return get<Position[]>('/settings/positions', { departmentId });
  },

  /**
   * Crée un poste
   */
  createPosition: async (
    data: Omit<Position, 'id'>
  ): Promise<ApiResponse<Position>> => {
    return post<Position>('/settings/positions', data);
  },

  /**
   * Met à jour un poste
   */
  updatePosition: async (
    id: string,
    data: Partial<Position>
  ): Promise<ApiResponse<Position>> => {
    return put<Position>(`/settings/positions/${id}`, data);
  },

  /**
   * Supprime un poste
   */
  deletePosition: async (id: string): Promise<ApiResponse<void>> => {
    return post<void>(`/settings/positions/${id}/delete`);
  },

  // Types de congés
  /**
   * Récupère tous les types de congés
   */
  getLeaveTypes: async (): Promise<ApiResponse<LeaveType[]>> => {
    return get<LeaveType[]>('/settings/leave-types');
  },

  /**
   * Crée un type de congé
   */
  createLeaveType: async (
    data: Omit<LeaveType, 'id'>
  ): Promise<ApiResponse<LeaveType>> => {
    return post<LeaveType>('/settings/leave-types', data);
  },

  /**
   * Met à jour un type de congé
   */
  updateLeaveType: async (
    id: string,
    data: Partial<LeaveType>
  ): Promise<ApiResponse<LeaveType>> => {
    return put<LeaveType>(`/settings/leave-types/${id}`, data);
  },

  /**
   * Supprime un type de congé
   */
  deleteLeaveType: async (id: string): Promise<ApiResponse<void>> => {
    return post<void>(`/settings/leave-types/${id}/delete`);
  },

  // Sauvegarde et restauration
  /**
   * Exporte tous les paramètres
   */
  exportSettings: async (): Promise<Blob> => {
    const response = await get<Blob>('/settings/export', undefined, {
      responseType: 'blob'
    });
    return response.data;
  },

  /**
   * Importe des paramètres
   */
  importSettings: async (file: File): Promise<ApiResponse<{
    imported: number;
    skipped: number;
    errors: string[];
  }>> => {
    const formData = new FormData();
    formData.append('file', file);
    return post('/settings/import', formData);
  }
};

export default settingsService;
