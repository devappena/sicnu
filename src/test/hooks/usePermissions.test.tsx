/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePermissions } from '@/hooks/usePermissions';
import * as AuthContext from '@/contexts/AuthContext';

// Mock du contexte Auth
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('usePermissions', () => {
  it('devrait retourner les permissions pour super_admin', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: { id: '1', email: 'admin@comnat-unesco.cd', role: 'super_admin' },
      isAuthenticated: true,
      isLoading: false,
    } as any);

    const { result } = renderHook(() => usePermissions());

    expect(result.current.userRole).toBe('super_admin');
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.isSuperAdmin).toBe(true);
    expect(result.current.isHR).toBe(false);
    expect(result.current.isEmployee).toBe(false);

    // Toutes les permissions
    expect(result.current.canCreateEmployee).toBe(true);
    expect(result.current.canDeleteEmployee).toBe(true);
    expect(result.current.canManagePayroll).toBe(true);
    expect(result.current.canManageSettings).toBe(true);
    expect(result.current.canApproveAbsence).toBe(true);
  });

  it('devrait retourner les permissions pour admin', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: { id: '2', email: 'admin@comnat-unesco.cd', role: 'admin' },
      isAuthenticated: true,
      isLoading: false,
    } as any);

    const { result } = renderHook(() => usePermissions());

    expect(result.current.userRole).toBe('admin');
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.isSuperAdmin).toBe(false);
    expect(result.current.isHR).toBe(false);

    // Permissions admin
    expect(result.current.canCreateEmployee).toBe(true);
    expect(result.current.canDeleteEmployee).toBe(true);
    expect(result.current.canManagePayroll).toBe(true);
    expect(result.current.canApproveAbsence).toBe(true);
    expect(result.current.canViewStatistics).toBe(true);

    // Pas de settings
    expect(result.current.canManageSettings).toBe(false);
  });

  it('devrait retourner les permissions pour hr', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: { id: '3', email: 'hr@comnat-unesco.cd', role: 'hr' },
      isAuthenticated: true,
      isLoading: false,
    } as any);

    const { result } = renderHook(() => usePermissions());

    expect(result.current.userRole).toBe('hr');
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isHR).toBe(true);

    // Permissions HR
    expect(result.current.canViewEmployees).toBe(true);
    expect(result.current.canEditEmployee).toBe(true);
    expect(result.current.canApproveAbsence).toBe(true);
    expect(result.current.canManageTrainings).toBe(true);
    expect(result.current.canViewStatistics).toBe(true);

    // Pas de création/suppression/paie
    expect(result.current.canCreateEmployee).toBe(false);
    expect(result.current.canDeleteEmployee).toBe(false);
    expect(result.current.canManagePayroll).toBe(false);
    expect(result.current.canViewStatistics).toBe(true);
    expect(result.current.canManageSettings).toBe(false);
  });

  it('devrait retourner les permissions pour employee', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: { id: '4', email: 'employee@comnat-unesco.cd', role: 'employee' },
      isAuthenticated: true,
      isLoading: false,
    } as any);

    const { result } = renderHook(() => usePermissions());

    expect(result.current.userRole).toBe('employee');
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isEmployee).toBe(true);

    // Permissions limitées
    expect(result.current.canViewEmployees).toBe(true);
    expect(result.current.canViewAbsences).toBe(true);
    expect(result.current.canCreateAbsence).toBe(true);
    expect(result.current.canViewTrainings).toBe(true);

    // Pas de gestion
    expect(result.current.canCreateEmployee).toBe(false);
    expect(result.current.canEditEmployee).toBe(false);
    expect(result.current.canDeleteEmployee).toBe(false);
    expect(result.current.canApproveAbsence).toBe(false);
    expect(result.current.canManagePayroll).toBe(false);
    expect(result.current.canViewStatistics).toBe(false);
    expect(result.current.canManageSettings).toBe(false);
  });

  it('devrait retourner les labels et couleurs corrects', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: { id: '1', email: 'admin@comnat-unesco.cd', role: 'super_admin' },
      isAuthenticated: true,
      isLoading: false,
    } as any);

    const { result } = renderHook(() => usePermissions());

    expect(result.current.getRoleLabel()).toBe('Super Administrateur');
    expect(result.current.getRoleColor()).toBe('bg-purple-100 text-purple-800');
  });

  it('devrait gérer l\'absence d\'utilisateur', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    } as any);

    const { result } = renderHook(() => usePermissions());

    expect(result.current.userRole).toBeUndefined();
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.canCreateEmployee).toBe(false);
    expect(result.current.getRoleLabel()).toBe('Inconnu');
  });

  it('devrait vérifier l\'accès aux pages', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: { id: '2', email: 'admin@comnat-unesco.cd', role: 'admin' },
      isAuthenticated: true,
      isLoading: false,
    } as any);

    const { result } = renderHook(() => usePermissions());

    expect(result.current.canAccessPage('/')).toBe(true);
    expect(result.current.canAccessPage('/payroll')).toBe(true);
    expect(result.current.canAccessPage('/settings')).toBe(false);
  });

  it('devrait vérifier les rôles multiples', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: { id: '3', email: 'hr@comnat-unesco.cd', role: 'hr' },
      isAuthenticated: true,
      isLoading: false,
    } as any);

    const { result } = renderHook(() => usePermissions());

    expect(result.current.hasAnyRole(['admin', 'hr'])).toBe(true);
    expect(result.current.hasAnyRole(['admin', 'super_admin'])).toBe(false);
  });

  it('devrait vérifier la gestion de rôles', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: { id: '2', email: 'admin@comnat-unesco.cd', role: 'admin' },
      isAuthenticated: true,
      isLoading: false,
    } as any);

    const { result } = renderHook(() => usePermissions());

    expect(result.current.canManageRole('hr')).toBe(true);
    expect(result.current.canManageRole('employee')).toBe(true);
    expect(result.current.canManageRole('admin')).toBe(false);
    expect(result.current.canManageRole('super_admin')).toBe(false);
  });
});
