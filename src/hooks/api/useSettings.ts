import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '@/api';
import type { UserSettings, SystemSettings, Department, Position, LeaveType } from '@/api';

export const settingsKeys = {
  all: ['settings'] as const,
  user: () => [...settingsKeys.all, 'user'] as const,
  system: () => [...settingsKeys.all, 'system'] as const,
  departments: () => [...settingsKeys.all, 'departments'] as const,
  positions: (departmentId?: string) => [...settingsKeys.all, 'positions', departmentId] as const,
  leaveTypes: () => [...settingsKeys.all, 'leave-types'] as const,
};

export function useUserSettings(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: settingsKeys.user(),
    queryFn: () => settingsService.getUserSettings(),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useUpdateUserSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: Partial<UserSettings>) => settingsService.updateUserSettings(settings),
    onSuccess: (response) => {
      queryClient.setQueryData(settingsKeys.user(), response);
    },
  });
}

export function useResetUserSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => settingsService.resetUserSettings(),
    onSuccess: (response) => {
      queryClient.setQueryData(settingsKeys.user(), response);
    },
  });
}

export function useSystemSettings(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: settingsKeys.system(),
    queryFn: () => settingsService.getSystemSettings(),
    staleTime: 15 * 60 * 1000,
    ...options,
  });
}

export function useUpdateSystemSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: Partial<SystemSettings>) => settingsService.updateSystemSettings(settings),
    onSuccess: (response) => {
      queryClient.setQueryData(settingsKeys.system(), response);
    },
  });
}

export function useDepartments(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: settingsKeys.departments(),
    queryFn: () => settingsService.getDepartments(),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Department, 'id'>) => settingsService.createDepartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.departments() });
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Department> }) => settingsService.updateDepartment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.departments() });
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => settingsService.deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.departments() });
    },
  });
}

export function usePositions(departmentId?: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: settingsKeys.positions(departmentId),
    queryFn: () => settingsService.getPositions(departmentId),
    staleTime: 10 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
}

export function useCreatePosition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Position, 'id'>) => settingsService.createPosition(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...settingsKeys.all, 'positions'] });
    },
  });
}

export function useUpdatePosition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Position> }) => settingsService.updatePosition(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...settingsKeys.all, 'positions'] });
    },
  });
}

export function useDeletePosition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => settingsService.deletePosition(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...settingsKeys.all, 'positions'] });
    },
  });
}

export function useLeaveTypes(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: settingsKeys.leaveTypes(),
    queryFn: () => settingsService.getLeaveTypes(),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useCreateLeaveType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<LeaveType, 'id'>) => settingsService.createLeaveType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.leaveTypes() });
    },
  });
}

export function useUpdateLeaveType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LeaveType> }) => settingsService.updateLeaveType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.leaveTypes() });
    },
  });
}

export function useDeleteLeaveType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => settingsService.deleteLeaveType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.leaveTypes() });
    },
  });
}

export function useExportSettings() {
  return useMutation({
    mutationFn: (format: 'json' | 'csv') => settingsService.exportSettings(format),
  });
}

export function useImportSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => settingsService.importSettings(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
    },
  });
}