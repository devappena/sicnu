/**
 * Hooks React Query pour la gestion des absences
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { absenceService } from '@/api';
import type { AbsenceFormData, PaginationParams } from '@/api';
import { config } from '@/config/devConfig';
import { mockAbsences } from '@/data/mockData';

// Clés de requête pour le cache
export const absenceKeys = {
  all: ['absences'] as const,
  lists: () => [...absenceKeys.all, 'list'] as const,
  list: (params?: PaginationParams) => [...absenceKeys.lists(), params] as const,
  details: () => [...absenceKeys.all, 'detail'] as const,
  detail: (id: string) => [...absenceKeys.details(), id] as const,
  pending: () => [...absenceKeys.all, 'pending'] as const,
  byEmployee: (id: string) => [...absenceKeys.all, 'employee', id] as const,
  balance: (id: string) => [...absenceKeys.all, 'balance', id] as const,
};

/**
 * Hook pour récupérer la liste des absences (paginée)
 */
export function useAbsences(params?: PaginationParams & {
  employeeId?: string;
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: absenceKeys.list(params),
    queryFn: async () => {
      // Mode mock pour le développement
      if (config.USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, config.MOCK_DELAY));
        let filteredAbsences = [...mockAbsences];
        
        // Filtrer par statut si spécifié
        if (params?.status) {
          filteredAbsences = filteredAbsences.filter(a => a.status === params.status);
        }
        
        return {
          data: filteredAbsences,
          total: filteredAbsences.length,
          page: params?.page || 1,
          limit: params?.limit || 10
        };
      }
      return absenceService.getAll(params);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook pour récupérer une absence par ID
 */
export function useAbsence(id: string, enabled = true) {
  return useQuery({
    queryKey: absenceKeys.detail(id),
    queryFn: () => absenceService.getById(id),
    enabled: enabled && !!id,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
}

/**
 * Hook pour récupérer les absences en attente d'approbation
 */
export function usePendingAbsences() {
  return useQuery({
    queryKey: absenceKeys.pending(),
    queryFn: () => absenceService.getPending(),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Rafraîchir toutes les 2 minutes
  });
}

/**
 * Hook pour récupérer les absences d'un employé
 */
export function useAbsencesByEmployee(employeeId: string, params?: {
  startDate?: string;
  endDate?: string;
  status?: string;
}, enabled = true) {
  return useQuery({
    queryKey: absenceKeys.byEmployee(employeeId),
    queryFn: () => absenceService.getByEmployee(employeeId, params),
    enabled: enabled && !!employeeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook pour récupérer le solde de congés d'un employé
 */
export function useAbsenceBalance(employeeId: string, enabled = true) {
  return useQuery({
    queryKey: absenceKeys.balance(employeeId),
    queryFn: () => absenceService.getBalance(employeeId),
    enabled: enabled && !!employeeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook pour créer une demande d'absence
 */
export function useCreateAbsence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AbsenceFormData) => absenceService.create(data),
    onSuccess: (response) => {
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: absenceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: absenceKeys.pending() });
      // Invalider les absences de l'employé concerné
      if (response.data.employeeId) {
        queryClient.invalidateQueries({ 
          queryKey: absenceKeys.byEmployee(response.data.employeeId) 
        });
        queryClient.invalidateQueries({ 
          queryKey: absenceKeys.balance(response.data.employeeId) 
        });
      }
    },
  });
}

/**
 * Hook pour mettre à jour une absence
 */
export function useUpdateAbsence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AbsenceFormData> }) =>
      absenceService.update(id, data),
    onSuccess: (response, variables) => {
      // Mise à jour optimiste
      queryClient.setQueryData(absenceKeys.detail(variables.id), response);
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: absenceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: absenceKeys.pending() });
      if (response.data.employeeId) {
        queryClient.invalidateQueries({ 
          queryKey: absenceKeys.byEmployee(response.data.employeeId) 
        });
      }
    },
  });
}

/**
 * Hook pour supprimer une absence
 */
export function useDeleteAbsence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => absenceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: absenceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: absenceKeys.pending() });
    },
  });
}

/**
 * Hook pour approuver une absence
 */
export function useApproveAbsence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) =>
      absenceService.approve(id, comment),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(absenceKeys.detail(variables.id), response);
      queryClient.invalidateQueries({ queryKey: absenceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: absenceKeys.pending() });
      if (response.data.employeeId) {
        queryClient.invalidateQueries({ 
          queryKey: absenceKeys.balance(response.data.employeeId) 
        });
      }
    },
  });
}

/**
 * Hook pour rejeter une absence
 */
export function useRejectAbsence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) =>
      absenceService.reject(id, comment),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(absenceKeys.detail(variables.id), response);
      queryClient.invalidateQueries({ queryKey: absenceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: absenceKeys.pending() });
    },
  });
}

/**
 * Hook pour vérifier les conflits de dates
 */
export function useCheckAbsenceConflicts() {
  return useMutation({
    mutationFn: (data: { employeeId: string; startDate: string; endDate: string }) =>
      absenceService.checkConflicts(data),
  });
}

/**
 * Hook pour exporter les absences
 */
export function useExportAbsences() {
  return useMutation({
    mutationFn: (params?: {
      startDate?: string;
      endDate?: string;
      format?: 'excel' | 'csv' | 'pdf';
    }) => absenceService.export(params),
  });
}
