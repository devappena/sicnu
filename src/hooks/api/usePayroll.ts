/**
 * Hooks React Query pour la gestion de la paie
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { payrollService } from '@/api';
import type { PayslipGenerationData, PaginationParams } from '@/api';

// Clés de requête pour le cache
export const payrollKeys = {
  all: ['payroll'] as const,
  lists: () => [...payrollKeys.all, 'list'] as const,
  list: (params?: PaginationParams) => [...payrollKeys.lists(), params] as const,
  details: () => [...payrollKeys.all, 'detail'] as const,
  detail: (id: string) => [...payrollKeys.details(), id] as const,
  byEmployee: (id: string, params?: Record<string, unknown>) => 
    [...payrollKeys.all, 'employee', id, params] as const,
  statistics: (params?: Record<string, unknown>) => 
    [...payrollKeys.all, 'statistics', params] as const,
};

/**
 * Hook pour récupérer la liste des bulletins de paie (paginée)
 */
export function usePayslips(params?: PaginationParams & {
  month?: number;
  year?: number;
  status?: string;
}) {
  return useQuery({
    queryKey: payrollKeys.list(params),
    queryFn: () => payrollService.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook pour récupérer un bulletin de paie par ID
 */
export function usePayslip(id: string, enabled = true) {
  return useQuery({
    queryKey: payrollKeys.detail(id),
    queryFn: () => payrollService.getById(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook pour récupérer les bulletins d'un employé
 */
export function usePayslipsByEmployee(
  employeeId: string, 
  params?: { year?: number; month?: number },
  enabled = true
) {
  return useQuery({
    queryKey: payrollKeys.byEmployee(employeeId, params),
    queryFn: () => payrollService.getByEmployee(employeeId, params),
    enabled: enabled && !!employeeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook pour récupérer les statistiques de paie
 */
export function usePayrollStatistics(params?: {
  startDate?: string;
  endDate?: string;
  departmentId?: string;
}) {
  return useQuery({
    queryKey: payrollKeys.statistics(params),
    queryFn: () => payrollService.getStatistics(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook pour générer les bulletins du mois
 */
export function useGenerateMonthPayroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ month, year }: { month: number; year: number }) =>
      payrollService.generateMonth(month, year),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: payrollKeys.lists() });
      queryClient.invalidateQueries({ queryKey: payrollKeys.statistics() });
    },
  });
}

/**
 * Hook pour générer un bulletin individuel
 */
export function useGenerateSinglePayslip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PayslipGenerationData) =>
      payrollService.generateSingle(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: payrollKeys.lists() });
      if (response.data.employeeId) {
        queryClient.invalidateQueries({ 
          queryKey: payrollKeys.byEmployee(response.data.employeeId) 
        });
      }
    },
  });
}

/**
 * Hook pour valider un bulletin
 */
export function useValidatePayslip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => payrollService.validate(id),
    onSuccess: (response, id) => {
      queryClient.setQueryData(payrollKeys.detail(id), response);
      queryClient.invalidateQueries({ queryKey: payrollKeys.lists() });
    },
  });
}

/**
 * Hook pour marquer des bulletins comme payés
 */
export function useMarkAsPaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => payrollService.markAsPaid(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: payrollKeys.lists() });
      queryClient.invalidateQueries({ queryKey: payrollKeys.statistics() });
    },
  });
}

/**
 * Hook pour télécharger un bulletin en PDF
 */
export function useDownloadPayslipPDF() {
  return useMutation({
    mutationFn: (id: string) => payrollService.downloadPDF(id),
  });
}

/**
 * Hook pour envoyer un bulletin par email
 */
export function useSendPayslipEmail() {
  return useMutation({
    mutationFn: ({ id, email }: { id: string; email?: string }) =>
      payrollService.sendByEmail(id, email),
  });
}

/**
 * Hook pour exporter les bulletins de paie
 */
export function useExportPayroll() {
  return useMutation({
    mutationFn: (params?: {
      month?: number;
      year?: number;
      format?: 'excel' | 'csv' | 'pdf';
    }) => payrollService.export(params),
  });
}
