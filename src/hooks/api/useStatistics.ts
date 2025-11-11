/**
 * Hooks React Query pour les statistiques
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { statisticsService } from '@/api';
import type { ReportConfig } from '@/api';

// Clés de requête pour le cache
export const statisticsKeys = {
  all: ['statistics'] as const,
  dashboard: () => [...statisticsKeys.all, 'dashboard'] as const,
  employees: (params?: Record<string, unknown>) => 
    [...statisticsKeys.all, 'employees', params] as const,
  absences: (params?: Record<string, unknown>) => 
    [...statisticsKeys.all, 'absences', params] as const,
  trainings: (params?: Record<string, unknown>) => 
    [...statisticsKeys.all, 'trainings', params] as const,
  payroll: (params?: Record<string, unknown>) => 
    [...statisticsKeys.all, 'payroll', params] as const,
  reports: (params?: Record<string, unknown>) => 
    [...statisticsKeys.all, 'reports', params] as const,
  trends: (params?: Record<string, unknown>) => 
    [...statisticsKeys.all, 'trends', params] as const,
};

/**
 * Hook pour récupérer les statistiques du dashboard
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: statisticsKeys.dashboard(),
    queryFn: () => statisticsService.getDashboardStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Rafraîchir toutes les 5 minutes
  });
}

/**
 * Hook pour récupérer les statistiques des employés
 */
export function useEmployeeStats(params?: {
  startDate?: string;
  endDate?: string;
  department?: string;
}) {
  return useQuery({
    queryKey: statisticsKeys.employees(params),
    queryFn: () => statisticsService.getEmployeeStats(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook pour récupérer les statistiques des absences
 */
export function useAbsenceStats(params?: {
  startDate?: string;
  endDate?: string;
  department?: string;
}) {
  return useQuery({
    queryKey: statisticsKeys.absences(params),
    queryFn: () => statisticsService.getAbsenceStats(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook pour récupérer les statistiques des formations
 */
export function useTrainingStats(params?: {
  startDate?: string;
  endDate?: string;
  type?: string;
}) {
  return useQuery({
    queryKey: statisticsKeys.trainings(params),
    queryFn: () => statisticsService.getTrainingStats(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook pour récupérer les statistiques de la paie
 */
export function usePayrollStats(params?: {
  startDate?: string;
  endDate?: string;
  department?: string;
}) {
  return useQuery({
    queryKey: statisticsKeys.payroll(params),
    queryFn: () => statisticsService.getPayrollStats(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook pour récupérer les tendances
 */
export function useTrends(params: {
  metric: 'employees' | 'absences' | 'trainings' | 'payroll';
  period: 'week' | 'month' | 'quarter' | 'year';
  compare?: boolean;
}) {
  return useQuery({
    queryKey: statisticsKeys.trends(params),
    queryFn: () => statisticsService.getTrends(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook pour générer un rapport
 */
export function useGenerateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (config: ReportConfig) => statisticsService.generateReport(config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: statisticsKeys.reports() });
    },
  });
}

/**
 * Hook pour récupérer l'historique des rapports
 */
export function useReports(params?: {
  type?: string;
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: statisticsKeys.reports(params),
    queryFn: () => statisticsService.getReports(params),
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
}

/**
 * Hook pour télécharger un rapport
 */
export function useDownloadReport() {
  return useMutation({
    mutationFn: (reportId: string) => statisticsService.downloadReport(reportId),
  });
}

/**
 * Hook pour supprimer un rapport
 */
export function useDeleteReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reportId: string) => statisticsService.deleteReport(reportId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: statisticsKeys.reports() });
    },
  });
}
