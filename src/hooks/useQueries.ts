// Hooks React Query pour la gestion des données
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockEmployees, mockAbsences } from '../data/mockData';
import type { Employee, Absence } from '../types';

// Simulation d'API avec délais réalistes
const simulateApiCall = <T>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// ===== HOOKS POUR LES EMPLOYÉS =====

export const useEmployees = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: () => simulateApiCall(mockEmployees),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useEmployee = (id: string) => {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: () => simulateApiCall(mockEmployees.find(emp => emp.id === id)),
    enabled: !!id,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newEmployee: Omit<Employee, 'id'>) => 
      simulateApiCall({ ...newEmployee, id: Date.now().toString() }, 1000),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Employee> }) => 
      simulateApiCall({ ...data, id }, 800),
    onSuccess: (data: Employee) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', data.id] });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => simulateApiCall(id, 600),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

// ===== HOOKS POUR LES ABSENCES =====

export const useAbsences = () => {
  return useQuery({
    queryKey: ['absences'],
    queryFn: () => simulateApiCall(mockAbsences),
    staleTime: 2 * 60 * 1000, // 2 minutes pour des données plus dynamiques
  });
};

export const useAbsencesByEmployee = (employeeId: string) => {
  return useQuery({
    queryKey: ['absences', 'employee', employeeId],
    queryFn: () => 
      simulateApiCall(mockAbsences.filter(abs => abs.employeeId === employeeId)),
    enabled: !!employeeId,
  });
};

export const useCreateAbsence = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newAbsence: Omit<Absence, 'id'>) => 
      simulateApiCall({ ...newAbsence, id: Date.now().toString() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['absences'] });
    },
  });
};

export const useUpdateAbsence = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Absence> }) => 
      simulateApiCall({ ...data, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['absences'] });
    },
  });
};

// ===== HOOKS POUR LES STATISTIQUES =====

export const useStatistics = () => {
  return useQuery({
    queryKey: ['statistics'],
    queryFn: () => {
      // Simulation de calculs statistiques
      const stats = {
        totalEmployees: mockEmployees.length,
        activeEmployees: mockEmployees.filter(emp => emp.status === 'active').length,
        totalAbsences: mockAbsences.length,
        pendingAbsences: mockAbsences.filter(abs => abs.status === 'pending').length,
        lastUpdated: new Date().toISOString(),
      };
      return simulateApiCall(stats);
    },
    staleTime: 1 * 60 * 1000, // 1 minute pour les stats
  });
};

// ===== HOOKS UTILITAIRES =====

export const usePrefetchEmployee = () => {
  const queryClient = useQueryClient();
  
  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: ['employee', id],
      queryFn: () => simulateApiCall(mockEmployees.find(emp => emp.id === id)),
      staleTime: 5 * 60 * 1000,
    });
  };
};
