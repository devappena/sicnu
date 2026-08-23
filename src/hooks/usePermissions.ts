/**
 * Hook personnalisé pour gérer les permissions utilisateur
 * Facilite la vérification des droits d'accès dans les composants
 */

import { useAuth } from '../contexts/AuthContext';
import {
  type UserRole,
  type Permission,
  hasPermission,
  canAccessPage,
  hasAnyRole,
  isAdmin,
  isSuperAdmin,
  getRoleLabel,
  getRoleColor,
  getRolePermissions,
  canManageRole,
} from '../utils/permissions';

export const usePermissions = () => {
  const { user } = useAuth();
  const userRole = user?.role as UserRole | undefined;

  return {
    // Rôle de l'utilisateur
    userRole,

    // Vérifications de permissions
    hasPermission: (permission: Permission) => hasPermission(userRole, permission),
    canAccessPage: (path: string) => canAccessPage(userRole, path),
    hasAnyRole: (roles: UserRole[]) => hasAnyRole(userRole, roles),
    canManageRole: (targetRole: UserRole) => canManageRole(userRole, targetRole),

    // Vérifications de rôles spécifiques
    isAdmin: isAdmin(userRole),
    isSuperAdmin: isSuperAdmin(userRole),
    isHR: userRole === 'hr',
    isEmployee: userRole === 'employee',

    // Helpers d'affichage
    getRoleLabel: () => (userRole ? getRoleLabel(userRole) : 'Inconnu'),
    getRoleColor: () => (userRole ? getRoleColor(userRole) : 'bg-gray-100 text-gray-800'),
    getRolePermissions: () => (userRole ? getRolePermissions(userRole) : []),

    // Permissions spécifiques courantes (raccourcis)
    canViewEmployees: hasPermission(userRole, 'view_employees'),
    canCreateEmployee: hasPermission(userRole, 'create_employee'),
    canEditEmployee: hasPermission(userRole, 'edit_employee'),
    canDeleteEmployee: hasPermission(userRole, 'delete_employee'),

    canViewAbsences: hasPermission(userRole, 'view_absences'),
    canCreateAbsence: hasPermission(userRole, 'create_absence'),
    canApproveAbsence: hasPermission(userRole, 'approve_absence'),

    canViewTrainings: hasPermission(userRole, 'view_trainings'),
    canCreateTraining: hasPermission(userRole, 'create_training'),
    canManageTrainings: hasPermission(userRole, 'manage_trainings'),

    canViewPayroll: hasPermission(userRole, 'view_payroll'),
    canManagePayroll: hasPermission(userRole, 'manage_payroll'),

    canViewStatistics: hasPermission(userRole, 'view_statistics'),

    canManageSettings: hasPermission(userRole, 'manage_settings'),
    canManageWorkflow: hasPermission(userRole, 'manage_workflow'),

    canApproveRoleChange: hasPermission(userRole, 'approve_role_change'),
  };
};
