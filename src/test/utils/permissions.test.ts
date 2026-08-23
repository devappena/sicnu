import { describe, it, expect } from 'vitest';
import {
  hasPermission,
  canAccessPage,
  hasAnyRole,
  isAdmin,
  isSuperAdmin,
  getRoleLabel,
  getRoleColor,
  canManageRole,
  type UserRole,
} from '@/utils/permissions';

describe('permissions - hasPermission', () => {
  it('super_admin devrait avoir toutes les permissions', () => {
    expect(hasPermission('super_admin', 'view_dashboard')).toBe(true);
    expect(hasPermission('super_admin', 'create_employee')).toBe(true);
    expect(hasPermission('super_admin', 'delete_employee')).toBe(true);
    expect(hasPermission('super_admin', 'manage_settings')).toBe(true);
    expect(hasPermission('super_admin', 'approve_role_change')).toBe(true);
  });

  it('admin devrait avoir les permissions admin', () => {
    expect(hasPermission('admin', 'view_dashboard')).toBe(true);
    expect(hasPermission('admin', 'create_employee')).toBe(true);
    expect(hasPermission('admin', 'delete_employee')).toBe(true);
    expect(hasPermission('admin', 'manage_payroll')).toBe(true);
    expect(hasPermission('admin', 'approve_role_change')).toBe(true);
  });

  it('admin ne devrait PAS avoir manage_settings', () => {
    expect(hasPermission('admin', 'manage_settings')).toBe(false);
  });

  it('hr devrait avoir les permissions RH', () => {
    expect(hasPermission('hr', 'view_employees')).toBe(true);
    expect(hasPermission('hr', 'edit_employee')).toBe(true);
    expect(hasPermission('hr', 'approve_absence')).toBe(true);
    expect(hasPermission('hr', 'create_training')).toBe(true);
  });

  it('hr ne devrait PAS pouvoir créer/supprimer des employés', () => {
    expect(hasPermission('hr', 'create_employee')).toBe(false);
    expect(hasPermission('hr', 'delete_employee')).toBe(false);
    expect(hasPermission('hr', 'manage_payroll')).toBe(false);
  });

  it('employee devrait avoir les permissions limitées', () => {
    expect(hasPermission('employee', 'view_dashboard')).toBe(true);
    expect(hasPermission('employee', 'view_employees')).toBe(true);
    expect(hasPermission('employee', 'create_absence')).toBe(true);
    expect(hasPermission('employee', 'view_trainings')).toBe(true);
  });

  it('employee ne devrait PAS pouvoir approuver ou gérer', () => {
    expect(hasPermission('employee', 'approve_absence')).toBe(false);
    expect(hasPermission('employee', 'create_employee')).toBe(false);
    expect(hasPermission('employee', 'manage_payroll')).toBe(false);
    expect(hasPermission('employee', 'manage_settings')).toBe(false);
  });

  it('devrait retourner false si rôle undefined', () => {
    expect(hasPermission(undefined, 'view_dashboard')).toBe(false);
  });
});

describe('permissions - canAccessPage', () => {
  it('super_admin peut accéder à toutes les pages', () => {
    expect(canAccessPage('super_admin', '/')).toBe(true);
    expect(canAccessPage('super_admin', '/employees')).toBe(true);
    expect(canAccessPage('super_admin', '/payroll')).toBe(true);
    expect(canAccessPage('super_admin', '/settings')).toBe(true);
    expect(canAccessPage('super_admin', '/statistics')).toBe(true);
  });

  it('admin peut accéder aux pages admin', () => {
    expect(canAccessPage('admin', '/')).toBe(true);
    expect(canAccessPage('admin', '/employees')).toBe(true);
    expect(canAccessPage('admin', '/payroll')).toBe(true);
    expect(canAccessPage('admin', '/statistics')).toBe(true);
    expect(canAccessPage('admin', '/workflow-management')).toBe(true);
  });

  it('admin ne peut PAS accéder aux paramètres', () => {
    expect(canAccessPage('admin', '/settings')).toBe(false);
  });

  it('hr peut accéder aux pages RH', () => {
    expect(canAccessPage('hr', '/')).toBe(true);
    expect(canAccessPage('hr', '/employees')).toBe(true);
    expect(canAccessPage('hr', '/absences')).toBe(true);
    expect(canAccessPage('hr', '/trainings')).toBe(true);
    expect(canAccessPage('hr', '/statistics')).toBe(true);
  });

  it('hr ne peut PAS accéder à la paie et aux paramètres', () => {
    expect(canAccessPage('hr', '/payroll')).toBe(false);
    expect(canAccessPage('hr', '/settings')).toBe(false);
    expect(canAccessPage('hr', '/workflow-management')).toBe(false);
  });

  it('employee peut accéder aux pages basiques', () => {
    expect(canAccessPage('employee', '/')).toBe(true);
    expect(canAccessPage('employee', '/profile')).toBe(true);
    expect(canAccessPage('employee', '/absences')).toBe(true);
    expect(canAccessPage('employee', '/trainings')).toBe(true);
    expect(canAccessPage('employee', '/documents')).toBe(true);
  });

  it('employee ne peut PAS accéder aux pages admin', () => {
    expect(canAccessPage('employee', '/payroll')).toBe(false);
    expect(canAccessPage('employee', '/statistics')).toBe(false);
    expect(canAccessPage('employee', '/recruitment')).toBe(false);
    expect(canAccessPage('employee', '/settings')).toBe(false);
    expect(canAccessPage('employee', '/workflow-management')).toBe(false);
  });

  it('devrait bloquer si rôle undefined', () => {
    expect(canAccessPage(undefined, '/')).toBe(false);
  });

  it('devrait bloquer si page non définie', () => {
    expect(canAccessPage('admin', '/unknown-page')).toBe(false);
  });
});

describe('permissions - hasAnyRole', () => {
  it('devrait vérifier si utilisateur a un des rôles', () => {
    expect(hasAnyRole('admin', ['admin', 'super_admin'])).toBe(true);
    expect(hasAnyRole('hr', ['admin', 'hr'])).toBe(true);
    expect(hasAnyRole('employee', ['employee'])).toBe(true);
  });

  it('devrait retourner false si rôle non dans la liste', () => {
    expect(hasAnyRole('employee', ['admin', 'hr'])).toBe(false);
    expect(hasAnyRole('hr', ['super_admin', 'admin'])).toBe(false);
  });

  it('devrait retourner false si rôle undefined', () => {
    expect(hasAnyRole(undefined, ['admin'])).toBe(false);
  });
});

describe('permissions - isAdmin', () => {
  it('devrait retourner true pour admin et super_admin', () => {
    expect(isAdmin('admin')).toBe(true);
    expect(isAdmin('super_admin')).toBe(true);
  });

  it('devrait retourner false pour hr et employee', () => {
    expect(isAdmin('hr')).toBe(false);
    expect(isAdmin('employee')).toBe(false);
  });

  it('devrait retourner false si undefined', () => {
    expect(isAdmin(undefined)).toBe(false);
  });
});

describe('permissions - isSuperAdmin', () => {
  it('devrait retourner true seulement pour super_admin', () => {
    expect(isSuperAdmin('super_admin')).toBe(true);
  });

  it('devrait retourner false pour les autres rôles', () => {
    expect(isSuperAdmin('admin')).toBe(false);
    expect(isSuperAdmin('hr')).toBe(false);
    expect(isSuperAdmin('employee')).toBe(false);
  });

  it('devrait retourner false si undefined', () => {
    expect(isSuperAdmin(undefined)).toBe(false);
  });
});

describe('permissions - getRoleLabel', () => {
  it('devrait retourner les labels corrects', () => {
    expect(getRoleLabel('super_admin')).toBe('Super Administrateur');
    expect(getRoleLabel('admin')).toBe('Administrateur');
    expect(getRoleLabel('hr')).toBe('Ressources Humaines');
    expect(getRoleLabel('employee')).toBe('Employé');
  });
});

describe('permissions - getRoleColor', () => {
  it('devrait retourner les couleurs correctes', () => {
    expect(getRoleColor('super_admin')).toBe('bg-purple-100 text-purple-800');
    expect(getRoleColor('admin')).toBe('bg-red-100 text-red-800');
    expect(getRoleColor('hr')).toBe('bg-blue-100 text-blue-800');
    expect(getRoleColor('employee')).toBe('bg-gray-100 text-gray-800');
  });
});

describe('permissions - canManageRole', () => {
  it('super_admin peut gérer tous les rôles', () => {
    expect(canManageRole('super_admin', 'admin')).toBe(true);
    expect(canManageRole('super_admin', 'hr')).toBe(true);
    expect(canManageRole('super_admin', 'employee')).toBe(true);
    expect(canManageRole('super_admin', 'super_admin')).toBe(true);
  });

  it('admin peut gérer hr et employee', () => {
    expect(canManageRole('admin', 'hr')).toBe(true);
    expect(canManageRole('admin', 'employee')).toBe(true);
  });

  it('admin ne peut PAS gérer admin ou super_admin', () => {
    expect(canManageRole('admin', 'admin')).toBe(false);
    expect(canManageRole('admin', 'super_admin')).toBe(false);
  });

  it('hr ne peut gérer aucun rôle', () => {
    expect(canManageRole('hr', 'employee')).toBe(false);
    expect(canManageRole('hr', 'hr')).toBe(false);
    expect(canManageRole('hr', 'admin')).toBe(false);
  });

  it('employee ne peut gérer aucun rôle', () => {
    expect(canManageRole('employee', 'employee')).toBe(false);
    expect(canManageRole('employee', 'hr')).toBe(false);
  });

  it('devrait retourner false si rôle undefined', () => {
    expect(canManageRole(undefined, 'employee')).toBe(false);
  });
});
