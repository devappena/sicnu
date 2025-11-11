/**
 * Hooks React Query pour la gestion des pointages et feuilles de temps
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { timesheetService } from '@/api';
import type { ClockInData, ClockOutData, TimesheetApproval, WorkSchedule, PaginationParams } from '@/api';

// Clés de requête pour le cache
export const timesheetKeys = {
  all: ['timesheets'] as const,
  lists: () => [...timesheetKeys.all, 'list'] as const,
  list: (params?: PaginationParams) => [...timesheetKeys.lists(), params] as const,
  details: () => [...timesheetKeys.all, 'detail'] as const,
  detail: (id: string) => [...timesheetKeys.details(), id] as const,
  byEmployee: (id: string, params?: Record<string, unknown>) => 
    [...timesheetKeys.all, 'employee', id, params] as const,
  summary: (id: string, params?: Record<string, unknown>) => 
    [...timesheetKeys.all, 'summary', id, params] as const,
  pending: () => [...timesheetKeys.all, 'pending'] as const,
  current: (employeeId: string) => [...timesheetKeys.all, 'current', employeeId] as const,
  schedule: (employeeId: string) => [...timesheetKeys.all, 'schedule', employeeId] as const,
  statistics: (params?: Record<string, unknown>) => 
    [...timesheetKeys.all, 'statistics', params] as const,
};

/**
 * Hook pour récupérer les pointages (paginés)
 */
export function useTimesheets(params?: PaginationParams & {
  employeeId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  type?: string;
}) {
  return useQuery({
    queryKey: timesheetKeys.list(params),
    queryFn: () => timesheetService.getAll(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook pour récupérer un pointage par ID
 */
export function useTimesheet(id: string, enabled = true) {
  return useQuery({
    queryKey: timesheetKeys.detail(id),
    queryFn: () => timesheetService.getById(id),
    enabled: enabled && !!id,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
}

/**
 * Hook pour récupérer les pointages d'un employé
 */
export function useTimesheetsByEmployee(
  employeeId: string,
  params?: { startDate?: string; endDate?: string; status?: string },
  enabled = true
) {
  return useQuery({
    queryKey: timesheetKeys.byEmployee(employeeId, params),
    queryFn: () => timesheetService.getByEmployee(employeeId, params),
    enabled: enabled && !!employeeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook pour récupérer le résumé des heures
 */
export function useTimesheetSummary(
  employeeId: string,
  params?: { startDate?: string; endDate?: string },
  enabled = true
) {
  return useQuery({
    queryKey: timesheetKeys.summary(employeeId, params),
    queryFn: () => timesheetService.getSummary(employeeId, params),
    enabled: enabled && !!employeeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook pour récupérer les pointages en attente d'approbation
 */
export function usePendingTimesheets(params?: PaginationParams & {
  departmentId?: string;
}) {
  return useQuery({
    queryKey: timesheetKeys.pending(),
    queryFn: () => timesheetService.getPending(params),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Rafraîchir toutes les 2 minutes
  });
}

/**
 * Hook pour récupérer le pointage actuel d'un employé
 */
export function useCurrentTimesheet(employeeId: string, enabled = true) {
  return useQuery({
    queryKey: timesheetKeys.current(employeeId),
    queryFn: () => timesheetService.getCurrentEntry(employeeId),
    enabled: enabled && !!employeeId,
    staleTime: 30 * 1000, // 30 secondes
    refetchInterval: 60 * 1000, // Rafraîchir chaque minute
  });
}

/**
 * Hook pour récupérer l'emploi du temps d'un employé
 */
export function useWorkSchedule(employeeId: string, enabled = true) {
  return useQuery({
    queryKey: timesheetKeys.schedule(employeeId),
    queryFn: () => timesheetService.getSchedule(employeeId),
    enabled: enabled && !!employeeId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook pour récupérer les statistiques de pointage
 */
export function useTimesheetStatistics(params?: {
  startDate?: string;
  endDate?: string;
  departmentId?: string;
  employeeId?: string;
}) {
  return useQuery({
    queryKey: timesheetKeys.statistics(params),
    queryFn: () => timesheetService.getStatistics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook pour pointer l'entrée (clock in)
 */
export function useClockIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data?: ClockInData) => timesheetService.clockIn(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: timesheetKeys.lists() });
      if (response.data.employeeId) {
        queryClient.invalidateQueries({ 
          queryKey: timesheetKeys.current(response.data.employeeId) 
        });
        queryClient.invalidateQueries({ 
          queryKey: timesheetKeys.byEmployee(response.data.employeeId) 
        });
      }
    },
  });
}

/**
 * Hook pour pointer la sortie (clock out)
 */
export function useClockOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ entryId, data }: { entryId: string; data?: ClockOutData }) =>
      timesheetService.clockOut(entryId, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: timesheetKeys.lists() });
      if (response.data.employeeId) {
        queryClient.invalidateQueries({ 
          queryKey: timesheetKeys.current(response.data.employeeId) 
        });
        queryClient.invalidateQueries({ 
          queryKey: timesheetKeys.byEmployee(response.data.employeeId) 
        });
      }
    },
  });
}

/**
 * Hook pour créer une entrée de pointage manuelle
 */
export function useCreateTimesheet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      employeeId: string;
      date: string;
      clockIn: string;
      clockOut: string;
      breakDuration?: number;
      type?: 'regular' | 'overtime' | 'remote' | 'on-site';
      notes?: string;
    }) => timesheetService.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: timesheetKeys.lists() });
      if (response.data.employeeId) {
        queryClient.invalidateQueries({ 
          queryKey: timesheetKeys.byEmployee(response.data.employeeId) 
        });
      }
    },
  });
}

/**
 * Hook pour mettre à jour un pointage
 */
export function useUpdateTimesheet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { 
      id: string; 
      data: {
        clockIn?: string;
        clockOut?: string;
        breakDuration?: number;
        type?: string;
        notes?: string;
      };
    }) => timesheetService.update(id, data),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(timesheetKeys.detail(variables.id), response);
      queryClient.invalidateQueries({ queryKey: timesheetKeys.lists() });
    },
  });
}

/**
 * Hook pour supprimer un pointage
 */
export function useDeleteTimesheet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => timesheetService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timesheetKeys.lists() });
    },
  });
}

/**
 * Hook pour approuver/rejeter des pointages
 */
export function useApproveTimesheets() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TimesheetApproval) => timesheetService.approve(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timesheetKeys.lists() });
      queryClient.invalidateQueries({ queryKey: timesheetKeys.pending() });
    },
  });
}

/**
 * Hook pour mettre à jour l'emploi du temps
 */
export function useUpdateWorkSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      employeeId, 
      schedule 
    }: { 
      employeeId: string; 
      schedule: Omit<WorkSchedule, 'id' | 'employeeId'>[] 
    }) => timesheetService.updateSchedule(employeeId, schedule),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(timesheetKeys.schedule(variables.employeeId), variables.schedule);
    },
  });
}

/**
 * Hook pour exporter les pointages
 */
export function useExportTimesheets() {
  return useMutation({
    mutationFn: (params?: {
      employeeId?: string;
      startDate?: string;
      endDate?: string;
      format?: 'excel' | 'csv' | 'pdf';
    }) => timesheetService.export(params),
  });
}

/**
 * Hook pour calculer les heures travaillées
 */
export function useCalculateHours() {
  return useMutation({
    mutationFn: (data: {
      employeeId: string;
      startDate: string;
      endDate: string;
    }) => timesheetService.calculateHours(data),
  });
}

/**
 * Hook pour détecter les anomalies
 */
export function useDetectTimesheetAnomalies(params?: {
  startDate?: string;
  endDate?: string;
  employeeId?: string;
}) {
  return useQuery({
    queryKey: [...timesheetKeys.all, 'anomalies', params],
    queryFn: () => timesheetService.detectAnomalies(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
