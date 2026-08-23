/**
 * Hooks React Query pour la gestion des employés
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '@/api';
import type { EmployeeFormData, PaginationParams } from '@/api';
import { config } from '@/config/devConfig';
import { mockEmployees } from '@/data/mockData';
import { unwrapList } from './unwrapList';

// Clés de requête
export const employeeKeys = {
  all: ['employees'] as const,
  lists: () => [...employeeKeys.all, 'list'] as const,
  list: (params?: PaginationParams) => [...employeeKeys.lists(), params] as const,
  details: () => [...employeeKeys.all, 'detail'] as const,
  detail: (id: string) => [...employeeKeys.details(), id] as const,
  search: (query: string) => [...employeeKeys.all, 'search', query] as const,
  department: (id: string) => [...employeeKeys.all, 'department', id] as const,
  statistics: () => [...employeeKeys.all, 'statistics'] as const,
  history: (id: string) => [...employeeKeys.all, 'history', id] as const,
};

export function useEmployees(params?: PaginationParams) {
  return useQuery({
    queryKey: employeeKeys.list(params),
    queryFn: async () => {
      // Mode mock pour le développement
      if (config.USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, config.MOCK_DELAY));
        return {
          data: mockEmployees,
          total: mockEmployees.length,
          page: params?.page || 1,
          limit: params?.limit || 10
        };
      }
      return employeeService.getAll(params);
    },
    select: unwrapList,
    staleTime: 2 * 60 * 1000,
  });
}

export function useEmployee(id: string, enabled = true) {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: async () => {
      if (config.USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, config.MOCK_DELAY));
        const found = mockEmployees.find((employee) => employee.id === id);
        if (!found) {
          throw new Error('Employé introuvable');
        }
        return found;
      }
      return employeeService.getById(id);
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EmployeeFormData) => employeeService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: employeeKeys.statistics() });
    },
  });
}

/**
 * Hook pour mettre à jour un employé
 */
export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EmployeeFormData> }) => {
      if (config.USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, config.MOCK_DELAY));
        const current = mockEmployees.find((employee) => employee.id === id);
        return {
          ...(current ?? { id }),
          ...data,
          id,
        };
      }
      return employeeService.update(id, data);
    },
    onSuccess: (response, variables) => {
      queryClient.setQueryData(employeeKeys.detail(variables.id), response);
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: employeeKeys.statistics() });
    },
  });
}

/**
 * Hook pour supprimer un employé
 */
export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => employeeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: employeeKeys.statistics() });
    },
  });
}

/**
 * Hook pour rechercher des employés
 */
export function useEmployeeSearch(query: string, enabled = true) {
  return useQuery({
    queryKey: employeeKeys.search(query),
    queryFn: () => employeeService.search(query),
    enabled: enabled && query.length > 0,
    staleTime: 1 * 60 * 1000,
  });
}

/**
 * Hook pour récupérer les employés d'un département
 */
export function useEmployeesByDepartment(departmentId: string, enabled = true) {
  return useQuery({
    queryKey: employeeKeys.department(departmentId),
    queryFn: () => employeeService.getByDepartment(departmentId),
    enabled: enabled && !!departmentId,
    staleTime: 3 * 60 * 1000,
  });
}

/**
 * Hook pour récupérer les statistiques des employés
 */
export function useEmployeeStatistics() {
  return useQuery({
    queryKey: employeeKeys.statistics(),
    queryFn: () => employeeService.getStatistics(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook pour récupérer l'historique d'un employé
 */
export function useEmployeeHistory(id: string, enabled = true) {
  return useQuery({
    queryKey: employeeKeys.history(id),
    queryFn: () => employeeService.getHistory(id),
    enabled: enabled && !!id,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook pour activer/désactiver un employé
 */
export function useToggleEmployeeStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => employeeService.toggleStatus(id),
    onSuccess: (response, id) => {
      queryClient.setQueryData(employeeKeys.detail(id), response);
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
}

/**
 * Hook pour exporter les employés
 */
export function useExportEmployees() {
  return useMutation({
    mutationFn: (format: 'csv' | 'excel' = 'excel') =>
      employeeService.export(format),
  });
}

/**
 * Hook pour importer des employés
 */
export function useImportEmployees() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => employeeService.import(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: employeeKeys.statistics() });
    },
  });
}
