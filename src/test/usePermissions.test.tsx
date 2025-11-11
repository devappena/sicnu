/**
 * Tests pour le hook usePermissions
 * Vérifie le bon fonctionnement dans un composant React
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePermissions } from '@/hooks/usePermissions';
import * as AuthContext from '@/contexts/AuthContext';

// Mock du contexte Auth
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('usePermissions Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('avec utilisateur super_admin', () => {
    beforeEach(() => {
      vi.mocked(AuthContext.useAuth).mockReturnValue({
        user: { id: '1', email: 'admin@test.com', role: 'super_admin' },
        isAuthenticated: true,
        isLoading: false,
      } as any);
    });

    it('devrait retourner isAdmin et isSuperAdmin à true', () => {
      const { result } = renderHook(() => usePermissions());
      
      expect(result.current.userRole).toBe('super_admin');
      expect(result.current.isAdmin).toBe(true);
      expect(result.current.isSuperAdmin).toBe(true);
      expect(result.current.isHR).toBe(false);
      expect(result.current.isEmployee).toBe(false);
    });

    it('devrait avoir toutes les permissions', () => {
      const { result } = renderHook(() => usePermissions());
      
      expect(result.current.canCreateEmployee).toBe(true);
      expect(result.current.canDeleteEmployee).toBe(true);
      expect(result.current.canApproveAbsence).toBe(true);
      expect(result.current.canManagePayroll).toBe(true);
      expect(result.current.canManageSettings).toBe(true);
    });

    it('devrait retourner le bon label et couleur', () => {
      const { result } = renderHook(() => usePermissions());
      
      expect(result.current.getRoleLabel()).toBe('Super Administrateur');
      expect(result.current.getRoleColor()).toBe('bg-purple-100 text-purple-800');
    });
  });

  describe('avec utilisateur admin', () => {
    beforeEach(() => {
      vi.mocked(AuthContext.useAuth).mockReturnValue({
        user: { id: '2', email: 'admin@test.com', role: 'admin' },
        isAuthenticated: true,
        isLoading: false,
      } as any);
    });

    it('devrait retourner isAdmin true mais isSuperAdmin false', () => {
      const { result } = renderHook(() => usePermissions());
      
      expect(result.current.userRole).toBe('admin');
      expect(result.current.isAdmin).toBe(true);
      expect(result.current.isSuperAdmin).toBe(false);
    });

    it('devrait avoir les permissions admin sauf settings', () => {
      const { result } = renderHook(() => usePermissions());
      
      expect(result.current.canCreateEmployee).toBe(true);
      expect(result.current.canDeleteEmployee).toBe(true);
      expect(result.current.canManagePayroll).toBe(true);
      expect(result.current.canViewAdvancedStatistics).toBe(true);
      expect(result.current.canManageSettings).toBe(false);
    });
  });

  describe('avec utilisateur hr', () => {
    beforeEach(() => {
      vi.mocked(AuthContext.useAuth).mockReturnValue({
        user: { id: '3', email: 'hr@test.com', role: 'hr' },
        isAuthenticated: true,
        isLoading: false,
      } as any);
    });

    it('devrait retourner isHR true', () => {
      const { result } = renderHook(() => usePermissions());
      
      expect(result.current.userRole).toBe('hr');
      expect(result.current.isAdmin).toBe(false);
      expect(result.current.isHR).toBe(true);
      expect(result.current.isEmployee).toBe(false);
    });

    it('devrait avoir les permissions RH limitées', () => {
      const { result } = renderHook(() => usePermissions());
      
      expect(result.current.canViewEmployees).toBe(true);
      expect(result.current.canEditEmployee).toBe(true);
      expect(result.current.canApproveAbsence).toBe(true);
      expect(result.current.canManageTrainings).toBe(true);
      expect(result.current.canCreateEmployee).toBe(false);
      expect(result.current.canDeleteEmployee).toBe(false);
      expect(result.current.canManagePayroll).toBe(false);
    });
  });

  describe('avec utilisateur employee', () => {
    beforeEach(() => {
      vi.mocked(AuthContext.useAuth).mockReturnValue({
        user: { id: '4', email: 'employee@test.com', role: 'employee' },
        isAuthenticated: true,
        isLoading: false,
      } as any);
    });

    it('devrait retourner isEmployee true', () => {
      const { result } = renderHook(() => usePermissions());
      
      expect(result.current.userRole).toBe('employee');
      expect(result.current.isAdmin).toBe(false);
      expect(result.current.isHR).toBe(false);
      expect(result.current.isEmployee).toBe(true);
    });

    it('devrait avoir les permissions limitées', () => {
      const { result } = renderHook(() => usePermissions());
      
      expect(result.current.canViewEmployees).toBe(true);
      expect(result.current.canCreateAbsence).toBe(true);
      expect(result.current.canViewTrainings).toBe(true);
      expect(result.current.canCreateEmployee).toBe(false);
      expect(result.current.canEditEmployee).toBe(false);
      expect(result.current.canApproveAbsence).toBe(false);
      expect(result.current.canManagePayroll).toBe(false);
      expect(result.current.canManageSettings).toBe(false);
    });
  });

  describe('sans utilisateur authentifié', () => {
    beforeEach(() => {
      vi.mocked(AuthContext.useAuth).mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      } as any);
    });

    it('devrait retourner userRole undefined', () => {
      const { result } = renderHook(() => usePermissions());
      
      expect(result.current.userRole).toBeUndefined();
      expect(result.current.isAdmin).toBe(false);
      expect(result.current.isSuperAdmin).toBe(false);
    });

    it('ne devrait avoir aucune permission', () => {
      const { result } = renderHook(() => usePermissions());
      
      expect(result.current.canViewEmployees).toBe(false);
      expect(result.current.canCreateEmployee).toBe(false);
      expect(result.current.canApproveAbsence).toBe(false);
    });

    it('devrait retourner un label par défaut', () => {
      const { result } = renderHook(() => usePermissions());
      
      expect(result.current.getRoleLabel()).toBe('Inconnu');
    });
  });

  describe('gestion de rôle', () => {
    it('super_admin devrait pouvoir gérer tous les rôles', () => {
      vi.mocked(AuthContext.useAuth).mockReturnValue({
        user: { id: '1', email: 'superadmin@test.com', role: 'super_admin' },
        isAuthenticated: true,
        isLoading: false,
      } as any);

      const { result } = renderHook(() => usePermissions());
      
      expect(result.current.canManageRole('admin')).toBe(true);
      expect(result.current.canManageRole('hr')).toBe(true);
      expect(result.current.canManageRole('employee')).toBe(true);
    });

    it('admin devrait gérer hr et employee uniquement', () => {
      vi.mocked(AuthContext.useAuth).mockReturnValue({
        user: { id: '2', email: 'admin@test.com', role: 'admin' },
        isAuthenticated: true,
        isLoading: false,
      } as any);

      const { result } = renderHook(() => usePermissions());
      
      expect(result.current.canManageRole('hr')).toBe(true);
      expect(result.current.canManageRole('employee')).toBe(true);
      expect(result.current.canManageRole('admin')).toBe(false);
    });
  });
});
