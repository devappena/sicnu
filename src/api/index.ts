/**
 * Point d'entrée centralisé pour tous les services API
 * Facilite les imports et la maintenance
 */

// Export des services
export { default as authService } from './services/auth.service';
export { default as employeeService } from './services/employee.service';
export { default as absenceService } from './services/absence.service';
export { default as trainingService } from './services/training.service';
export { default as payrollService } from './services/payroll.service';
export { default as statisticsService } from './services/statistics.service';
export { default as notificationService } from './services/notification.service';
export { default as settingsService } from './services/settings.service';
export { default as timesheetService } from './services/timesheet.service';

// Export des types - Auth
export type { LoginCredentials, RegisterCredentials, AuthResponse } from './services/auth.service';

// Export des types - Employee
export type { EmployeeFormData, EmployeeStatistics, ImportResult, EmployeeHistory } from './services/employee.service';

// Export des types - Absence
export type { AbsenceFormData } from './services/absence.service';

// Export des types - Training
export type { TrainingFormData, TrainingEnrollment } from './services/training.service';

// Export des types - Payroll
export type { Payslip, PayslipGenerationData, PayrollStatistics, Deduction, Bonus } from './services/payroll.service';

// Export des types - Statistics
export type { 
  DashboardStats, 
  EmployeeStats, 
  AbsenceStats, 
  TrainingStats, 
  PayrollStats,
  ReportConfig,
  Report
} from './services/statistics.service';

// Export des types - Notification
export type {
  Notification,
  NotificationPreferences,
  NotificationTemplate,
  BulkNotification
} from './services/notification.service';

// Export des types - Settings
export type {
  UserSettings,
  SystemSettings,
  Department,
  Position,
  LeaveType
} from './services/settings.service';

// Export des types - Timesheet
export type {
  TimesheetEntry,
  TimesheetSummary,
  ClockInData,
  ClockOutData,
  TimesheetApproval,
  WorkSchedule,
  TimesheetStats
} from './services/timesheet.service';

// Export du client HTTP
export { default as apiClient } from './client';
export { get, post, put, patch, del, upload } from './client';

// Export des types API
export type { ApiResponse, PaginatedResponse, ApiError, QueryParams, PaginationParams, FilterParams } from './types';

// ============================================
// LEGACY API - À MIGRER PROGRESSIVEMENT
// ============================================

import { 
  mockEmployees, 
  mockAbsences, 
  mockTrainings, 
  mockPayrolls,
  mockTimeSheets,
  mockApprovalWorkflows
} from '../data/mockData';
import type { 
  Employee, 
  AbsenceRequest, 
  Training, 
  Payroll,
  TimeSheet,
  ApprovalWorkflow
} from '../types';

// Simulation d'appels API avec délai pour tester le loading
const apiDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// API Employees (LEGACY - Utiliser employeeService à la place)
export const fetchEmployees = async (): Promise<Employee[]> => {
  await apiDelay();
  return mockEmployees;
};

export const fetchEmployee = async (id: string): Promise<Employee | undefined> => {
  await apiDelay();
  return mockEmployees.find(emp => emp.id === id);
};

// API Absences (LEGACY - Utiliser absenceService à la place)
export const fetchAbsences = async (): Promise<AbsenceRequest[]> => {
  await apiDelay();
  return mockAbsences;
};

// API Formations (LEGACY - Utiliser trainingService à la place)
export const fetchTrainings = async (): Promise<Training[]> => {
  await apiDelay();
  return mockTrainings;
};

// API Paie (LEGACY - Utiliser payrollService à la place)
export const fetchPayrolls = async (): Promise<Payroll[]> => {
  await apiDelay();
  return mockPayrolls;
};

// API Feuilles de temps
export const fetchTimesheets = async (): Promise<TimeSheet[]> => {
  await apiDelay();
  return mockTimeSheets;
};

// API Workflows
export const fetchWorkflows = async (): Promise<ApprovalWorkflow[]> => {
  await apiDelay();
  return mockApprovalWorkflows;
};

// Mutations (CREATE, UPDATE, DELETE)
export const createEmployee = async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
  await apiDelay();
  const newEmployee: Employee = {
    ...employee,
    id: `emp_${Date.now()}`,
    hireDate: new Date(),
    status: 'active'
  };
  return newEmployee;
};

export const updateEmployee = async (id: string, updates: Partial<Employee>): Promise<Employee> => {
  await apiDelay();
  const existing = mockEmployees.find(emp => emp.id === id);
  if (!existing) throw new Error('Employee not found');
  
  return { ...existing, ...updates };
};

export const deleteEmployee = async (_id: string): Promise<void> => {
  await apiDelay();
  // En production, cela ferait un appel DELETE à l'API
};
