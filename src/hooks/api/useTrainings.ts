/**
 * Hooks React Query pour la gestion des formations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { trainingService } from '@/api';
import type { TrainingFormData, PaginationParams } from '@/api';
import { config } from '@/config/devConfig';
import { mockTrainings } from '@/data/mockData';
import { unwrapList } from './unwrapList';

// Clés de requête pour le cache
export const trainingKeys = {
  all: ['trainings'] as const,
  lists: () => [...trainingKeys.all, 'list'] as const,
  list: (params?: PaginationParams) => [...trainingKeys.lists(), params] as const,
  details: () => [...trainingKeys.all, 'detail'] as const,
  detail: (id: string) => [...trainingKeys.details(), id] as const,
  upcoming: () => [...trainingKeys.all, 'upcoming'] as const,
  participants: (id: string) => [...trainingKeys.all, 'participants', id] as const,
  byEmployee: (id: string) => [...trainingKeys.all, 'employee', id] as const,
};

/**
 * Hook pour récupérer la liste des formations (paginée)
 */
export function useTrainings(params?: PaginationParams & {
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: trainingKeys.list(params),
    queryFn: async () => {
      // Mode mock pour le développement
      if (config.USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, config.MOCK_DELAY));
        let filteredTrainings = [...mockTrainings];
        
        // Filtrer par statut si spécifié
        if (params?.status) {
          filteredTrainings = filteredTrainings.filter(t => t.status === params.status);
        }
        
        return {
          data: filteredTrainings,
          total: filteredTrainings.length,
          page: params?.page || 1,
          limit: params?.limit || 10
        };
      }
      return trainingService.getAll(params);
    },
    select: unwrapList,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
}

/**
 * Hook pour récupérer une formation par ID
 */
export function useTraining(id: string, enabled = true) {
  return useQuery({
    queryKey: trainingKeys.detail(id),
    queryFn: () => trainingService.getById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook pour récupérer les formations à venir
 */
export function useUpcomingTrainings() {
  return useQuery({
    queryKey: trainingKeys.upcoming(),
    queryFn: () => trainingService.getUpcoming(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Rafraîchir toutes les 5 minutes
  });
}

/**
 * Hook pour récupérer les participants d'une formation
 */
export function useTrainingParticipants(trainingId: string, enabled = true) {
  return useQuery({
    queryKey: trainingKeys.participants(trainingId),
    queryFn: () => trainingService.getParticipants(trainingId),
    enabled: enabled && !!trainingId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook pour récupérer les formations d'un employé
 */
export function useTrainingsByEmployee(employeeId: string, params?: {
  status?: string;
}, enabled = true) {
  return useQuery({
    queryKey: trainingKeys.byEmployee(employeeId),
    queryFn: () => trainingService.getByEmployee(employeeId, params),
    enabled: enabled && !!employeeId,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
}

/**
 * Hook pour créer une formation
 */
export function useCreateTraining() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TrainingFormData) => trainingService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: trainingKeys.upcoming() });
    },
  });
}

/**
 * Hook pour mettre à jour une formation
 */
export function useUpdateTraining() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TrainingFormData> }) =>
      trainingService.update(id, data),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(trainingKeys.detail(variables.id), response);
      queryClient.invalidateQueries({ queryKey: trainingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: trainingKeys.upcoming() });
    },
  });
}

/**
 * Hook pour supprimer une formation
 */
export function useDeleteTraining() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => trainingService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: trainingKeys.upcoming() });
    },
  });
}

/**
 * Hook pour inscrire un employé à une formation
 */
export function useEnrollTraining() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ trainingId, employeeId }: { trainingId: string; employeeId: string }) =>
      trainingService.enroll(trainingId, employeeId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: trainingKeys.participants(variables.trainingId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: trainingKeys.byEmployee(variables.employeeId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: trainingKeys.detail(variables.trainingId) 
      });
    },
  });
}

/**
 * Hook pour désinscrire un employé d'une formation
 */
export function useUnenrollTraining() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ trainingId, employeeId }: { trainingId: string; employeeId: string }) =>
      trainingService.unenroll(trainingId, employeeId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: trainingKeys.participants(variables.trainingId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: trainingKeys.byEmployee(variables.employeeId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: trainingKeys.detail(variables.trainingId) 
      });
    },
  });
}

/**
 * Hook pour marquer une formation comme terminée
 */
export function useCompleteTraining() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      trainingId, 
      employeeId, 
      grade 
    }: { 
      trainingId: string; 
      employeeId: string; 
      grade?: number 
    }) => trainingService.complete(trainingId, employeeId, grade),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: trainingKeys.participants(variables.trainingId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: trainingKeys.byEmployee(variables.employeeId) 
      });
    },
  });
}

/**
 * Hook pour annuler une formation
 */
export function useCancelTraining() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      trainingService.cancel(id, reason),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(trainingKeys.detail(variables.id), response);
      queryClient.invalidateQueries({ queryKey: trainingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: trainingKeys.upcoming() });
    },
  });
}

/**
 * Hook pour générer un certificat
 */
export function useGenerateCertificate() {
  return useMutation({
    mutationFn: ({ trainingId, employeeId }: { trainingId: string; employeeId: string }) =>
      trainingService.generateCertificate(trainingId, employeeId),
  });
}

/**
 * Hook pour exporter les formations
 */
export function useExportTrainings() {
  return useMutation({
    mutationFn: (params?: {
      startDate?: string;
      endDate?: string;
      format?: 'excel' | 'csv' | 'pdf';
    }) => trainingService.export(params),
  });
}
