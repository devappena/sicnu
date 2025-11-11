/**
 * Tests pour le système de permissions
 * Vérifie les rôles, permissions et contrôle d'accès
 */

import { describe, it, expect } from 'vitest';
import {
  type UserRole,
  hasPermission,
  canAccessPage,
  hasAnyRole,
  isAdmin,
  isSuperAdmin,
  getRoleLabel,
  getRoleColor,
  canManageRole,
} from '@/utils/permissions';

describe('Système de Permissions', () => {
  describe('hasPermission', () => {
    it('super_admin devrait avoir toutes les permissions', () => {
      expect(hasPermission('super_admin', 'view_dashboard')).toBe(true);
      expect(hasPermission('super_admin', 'create_employee')).toBe(true);
      expect(hasPermission('super_admin', 'delete_employee')).toBe(true);
      expect(hasPermission('super_admin', 'manage_settings')).toBe(true);
      expect(hasPermission('super_admin', 'approve_role_change')).toBe(true);
    });

    it('admin devrait avoir les permissions administratives sauf settings', () => {
      expect(hasPermission('admin', 'view_dashboard')).toBe(true);
      expect(hasPermission('admin', 'create_employee')).toBe(true);
      expect(hasPermission('admin', 'delete_employee')).toBe(true);
      expect(hasPermission('admin', 'manage_payroll')).toBe(true);
      expect(hasPermission('admin', 'view_advanced_statistics')).toBe(true);
      expect(hasPermission('admin', 'manage_settings')).toBe(false);
    });

    it('hr devrait avoir les permissions RH uniquement', () => {
      expect(hasPermission('hr', 'view_dashboard')).toBe(true);
      expect(hasPermission('hr', 'edit_employee')).toBe(true);
      expect(hasPermission('hr', 'approve_absence')).toBe(true);
      expect(hasPermission('hr', 'manage_trainings')).toBe(true);
      expect(hasPermission('hr', 'create_employee')).toBe(false);
      expect(hasPermission('hr', 'delete_employee')).toBe(false);
      expect(hasPermission('hr', 'manage_payroll')).toBe(false);
      expect(hasPermission('hr', 'view_advanced_statistics')).toBe(false);
    });

    it('employee devrait avoir les permissions limitées', () => {
      expect(hasPermission('employee', 'view_dashboard')).toBe(true);
      expect(hasPermission('employee', 'view_employees')).toBe(true);
      expect(hasPermission('employee', 'create_absence')).toBe(true);
      expect(hasPermission('employee', 'view_trainings')).toBe(true);
      expect(hasPermission('employee', 'request_role_change')).toBe(true);
      expect(hasPermission('employee', 'create_employee')).toBe(false);
      expect(hasPermission('employee', 'approve_absence')).toBe(false);
      expect(hasPermission('employee', 'manage_payroll')).toBe(false);
    });

    it('devrait retourner false pour rôle undefined', () => {
      expect(hasPermission(undefined, 'view_dashboard')).toBe(false);
    });
  });

  describe('canAccessPage', () => {
    it('super_admin devrait accéder à toutes les pages', () => {
      expect(canAccessPage('super_admin', '/')).toBe(true);
      expect(canAccessPage('super_admin', '/settings')).toBe(true);
      expect(canAccessPage('super_admin', '/payroll')).toBe(true);
      expect(canAccessPage('super_admin', '/employees')).toBe(true);
    });

    it('admin devrait accéder aux pages admin mais pas settings', () => {
      expect(canAccessPage('admin', '/')).toBe(true);
      expect(canAccessPage('admin', '/payroll')).toBe(true);
      expect(canAccessPage('admin', '/statistics-advanced')).toBe(true);
      expect(canAccessPage('admin', '/workflow-management')).toBe(true);
      expect(canAccessPage('admin', '/settings')).toBe(false);
    });

    it('hr devrait accéder aux pages RH uniquement', () => {
      expect(canAccessPage('hr', '/')).toBe(true);
      expect(canAccessPage('hr', '/employees')).toBe(true);
      expect(canAccessPage('hr', '/absences')).toBe(true);
      expect(canAccessPage('hr', '/statistics')).toBe(true);
      expect(canAccessPage('hr', '/payroll')).toBe(false);
      expect(canAccessPage('hr', '/statistics-advanced')).toBe(false);
      expect(canAccessPage('hr', '/settings')).toBe(false);
    });

    it('employee devrait accéder aux pages basiques uniquement', () => {
      expect(canAccessPage('employee', '/')).toBe(true);
      expect(canAccessPage('employee', '/profile')).toBe(true);
      expect(canAccessPage('employee', '/absences')).toBe(true);
      expect(canAccessPage('employee', '/trainings')).toBe(true);
      expect(canAccessPage('employee', '/payroll')).toBe(false);
      expect(canAccessPage('employee', '/statistics')).toBe(false);
      expect(canAccessPage('employee', '/settings')).toBe(false);
    });

    it('devrait bloquer l\'accès pour undefined', () => {
      expect(canAccessPage(undefined, '/')).toBe(false);
    });
  });

  describe('hasAnyRole', () => {
    it('devrait vérifier si l\'utilisateur a un des rôles spécifiés', () => {
      expect(hasAnyRole('admin', ['super_admin', 'admin'])).toBe(true);
      expect(hasAnyRole('hr', ['admin', 'hr'])).toBe(true);
      expect(hasAnyRole('employee', ['super_admin', 'admin'])).toBe(false);
      expect(hasAnyRole(undefined, ['admin'])).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('devrait retourner true pour admin et super_admin', () => {
      expect(isAdmin('super_admin')).toBe(true);
      expect(isAdmin('admin')).toBe(true);
      expect(isAdmin('hr')).toBe(false);
      expect(isAdmin('employee')).toBe(false);
      expect(isAdmin(undefined)).toBe(false);
    });
  });

  describe('isSuperAdmin', () => {
    it('devrait retourner true uniquement pour super_admin', () => {
      expect(isSuperAdmin('super_admin')).toBe(true);
      expect(isSuperAdmin('admin')).toBe(false);
      expect(isSuperAdmin('hr')).toBe(false);
      expect(isSuperAdmin('employee')).toBe(false);
      expect(isSuperAdmin(undefined)).toBe(false);
    });
  });

  describe('getRoleLabel', () => {
    it('devrait retourner le label correct pour chaque rôle', () => {
      expect(getRoleLabel('super_admin')).toBe('Super Administrateur');
      expect(getRoleLabel('admin')).toBe('Administrateur');
      expect(getRoleLabel('hr')).toBe('Ressources Humaines');
      expect(getRoleLabel('employee')).toBe('Employé');
    });
  });

  describe('getRoleColor', () => {
    it('devrait retourner la couleur correcte pour chaque rôle', () => {
      expect(getRoleColor('super_admin')).toBe('bg-purple-100 text-purple-800');
      expect(getRoleColor('admin')).toBe('bg-red-100 text-red-800');
      expect(getRoleColor('hr')).toBe('bg-blue-100 text-blue-800');
      expect(getRoleColor('employee')).toBe('bg-gray-100 text-gray-800');
    });
  });

  describe('canManageRole', () => {
    it('super_admin devrait pouvoir gérer tous les rôles', () => {
      expect(canManageRole('super_admin', 'admin')).toBe(true);
      expect(canManageRole('super_admin', 'hr')).toBe(true);
      expect(canManageRole('super_admin', 'employee')).toBe(true);
      expect(canManageRole('super_admin', 'super_admin')).toBe(true);
    });

    it('admin devrait pouvoir gérer hr et employee uniquement', () => {
      expect(canManageRole('admin', 'hr')).toBe(true);
      expect(canManageRole('admin', 'employee')).toBe(true);
      expect(canManageRole('admin', 'admin')).toBe(false);
      expect(canManageRole('admin', 'super_admin')).toBe(false);
    });

    it('hr et employee ne devraient pas pouvoir gérer de rôles', () => {
      expect(canManageRole('hr', 'employee')).toBe(false);
      expect(canManageRole('hr', 'hr')).toBe(false);
      expect(canManageRole('employee', 'employee')).toBe(false);
      expect(canManageRole(undefined, 'employee')).toBe(false);
    });
  });
});
