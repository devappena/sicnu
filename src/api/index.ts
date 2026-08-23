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

// Export du client HTTP
export { default as apiClient } from './client';
export { get, post, put, patch, del, upload } from './client';

// Export des types API
export type { ApiResponse, PaginatedResponse, ApiError, QueryParams, PaginationParams, FilterParams } from './types';
