/**
 * Hook d'optimisation générale pour l'application ENA RH
 * Combine React Query, Zustand et optimisations de performance
 */

import { useMemo, useCallback } from 'react';
import { useQueries } from '@tanstack/react-query';
import { useGlobalStore } from '../stores/globalStore';
import { usePerformanceMetrics } from '../utils/performanceUtils';
import type { Employee, Absence } from '../types';

export const useOptimizedApp = () => {
  const {
    employees,
    absences,
    setEmployees,
    setAbsences,
    searchQuery,
    selectedDepartment,
    dateRange,
  } = useGlobalStore();

  const { measureRenderTime } = usePerformanceMetrics();

  // Chargement optimisé des données avec React Query
  const queries = useQueries({
    queries: [
      {
        queryKey: ['employees'],
        queryFn: () => Promise.resolve(employees),
        enabled: employees.length === 0,
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ['absences'],
        queryFn: () => Promise.resolve(absences),
        enabled: absences.length === 0,
        staleTime: 3 * 60 * 1000,
      },
    ],
  });

  // Filtrage optimisé avec useMemo
  const filteredEmployees = useMemo(() => {
    const endMeasure = measureRenderTime('Employee Filtering');
    
    let filtered = employees;

    if (searchQuery) {
      filtered = filtered.filter(emp => 
        emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedDepartment && selectedDepartment !== 'all') {
      filtered = filtered.filter(emp => emp.department === selectedDepartment);
    }

    endMeasure();
    return filtered;
  }, [employees, searchQuery, selectedDepartment, measureRenderTime]);

  // Filtrage des absences avec plage de dates
  const filteredAbsences = useMemo(() => {
    const endMeasure = measureRenderTime('Absence Filtering');
    
    let filtered = absences;

    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter(absence => {
        const startDate = new Date(absence.startDate);
        const endDate = new Date(absence.endDate);

        if (dateRange.start && startDate < dateRange.start) return false;
        if (dateRange.end && endDate > dateRange.end) return false;

        return true;
      });
    }

    endMeasure();
    return filtered;
  }, [absences, dateRange, measureRenderTime]);

  // Actions optimisées avec useCallback
  const addEmployee = useCallback((employee: Employee) => {
    setEmployees([...employees, employee]);
  }, [employees, setEmployees]);

  const updateEmployee = useCallback((id: string, updates: Partial<Employee>) => {
    setEmployees(employees.map(emp => 
      emp.id === id ? { ...emp, ...updates } : emp
    ));
  }, [employees, setEmployees]);

  const removeEmployee = useCallback((id: string) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  }, [employees, setEmployees]);

  const addAbsence = useCallback((absence: Absence) => {
    setAbsences([...absences, absence]);
  }, [absences, setAbsences]);

  const optimizedActions = useMemo(() => ({
    addEmployee,
    updateEmployee,
    removeEmployee,
    addAbsence,
  }), [addEmployee, updateEmployee, removeEmployee, addAbsence]);

  // Statistiques calculées
  const statistics = useMemo(() => {
    const endMeasure = measureRenderTime('Statistics Calculation');
    
    const stats = {
      totalEmployees: filteredEmployees.length,
      activeEmployees: filteredEmployees.filter(emp => emp.status === 'active').length,
      totalAbsences: filteredAbsences.length,
      pendingAbsences: filteredAbsences.filter(abs => abs.status === 'pending').length,
      departments: [...new Set(employees.map(emp => emp.department))],
      averageSalary: employees.reduce((sum, emp) => sum + (emp.salary || 0), 0) / employees.length || 0,
    };

    endMeasure();
    return stats;
  }, [filteredEmployees, filteredAbsences, employees, measureRenderTime]);

  // État de chargement global
  const isLoading = queries.some(query => query.isLoading);
  const hasError = queries.some(query => query.isError);

  return {
    // Données filtrées
    filteredEmployees,
    filteredAbsences,
    
    // Statistiques
    statistics,
    
    // Actions optimisées
    actions: optimizedActions,
    
    // États
    isLoading,
    hasError,
    
    // Méthodes utiles
    refetchAll: useCallback(() => {
      queries.forEach(query => query.refetch());
    }, [queries]),
  };
};
