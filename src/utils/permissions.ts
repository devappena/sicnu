/**
 * Système de gestion des rôles et permissions
 * Définit qui peut accéder à quelles pages et fonctionnalités
 */

// Types de rôles disponibles
export type UserRole = 'super_admin' | 'admin' | 'hr' | 'employee';

// Types de permissions
export type Permission =
  | 'view_dashboard'
  | 'view_employees'
  | 'create_employee'
  | 'edit_employee'
  | 'delete_employee'
  | 'view_absences'
  | 'create_absence'
  | 'approve_absence'
  | 'view_trainings'
  | 'create_training'
  | 'manage_trainings'
  | 'view_payroll'
  | 'manage_payroll'
  | 'view_documents'
  | 'upload_documents'
  | 'view_evaluations'
  | 'create_evaluation'
  | 'view_statistics'
  | 'view_advanced_statistics'
  | 'manage_workflow'
  | 'view_notifications'
  | 'manage_settings'
  | 'view_timesheet'
  | 'approve_timesheet'
  | 'request_role_change'
  | 'approve_role_change';

/**
 * Matrice des permissions par rôle
 * super_admin : Accès total à tout
 * admin : Gestion complète sauf paramètres système
 * hr : Gestion RH (absences, formations, évaluations)
 * employee : Consultation et gestion de ses propres données
 */
export const rolePermissions: Record<UserRole, Permission[]> = {
  // Super Admin - Accès complet à TOUT
  super_admin: [
    'view_dashboard',
    'view_employees',
    'create_employee',
    'edit_employee',
    'delete_employee',
    'view_absences',
    'create_absence',
    'approve_absence',
    'view_trainings',
    'create_training',
    'manage_trainings',
    'view_payroll',
    'manage_payroll',
    'view_documents',
    'upload_documents',
    'view_evaluations',
    'create_evaluation',
    'view_statistics',
    'view_advanced_statistics',
    'manage_workflow',
    'view_notifications',
    'manage_settings',
    'view_timesheet',
    'approve_timesheet',
    'request_role_change',
    'approve_role_change',
  ],

  // Admin - Gestion complète sauf paramètres système sensibles
  admin: [
    'view_dashboard',
    'view_employees',
    'create_employee',
    'edit_employee',
    'delete_employee',
    'view_absences',
    'create_absence',
    'approve_absence',
    'view_trainings',
    'create_training',
    'manage_trainings',
    'view_payroll',
    'manage_payroll',
    'view_documents',
    'upload_documents',
    'view_evaluations',
    'create_evaluation',
    'view_statistics',
    'view_advanced_statistics',
    'manage_workflow',
    'view_notifications',
    'view_timesheet',
    'approve_timesheet',
    'approve_role_change',
  ],

  // HR - Gestion des ressources humaines
  hr: [
    'view_dashboard',
    'view_employees',
    'edit_employee',
    'view_absences',
    'create_absence',
    'approve_absence',
    'view_trainings',
    'create_training',
    'manage_trainings',
    'view_documents',
    'upload_documents',
    'view_evaluations',
    'create_evaluation',
    'view_statistics',
    'view_notifications',
    'view_timesheet',
    'approve_timesheet',
  ],

  // Employee - Consultation et gestion personnelle
  employee: [
    'view_dashboard',
    'view_employees', // Voir la liste des collègues (sans modification)
    'view_absences',
    'create_absence', // Demander ses propres absences
    'view_trainings',
    'view_documents',
    'view_evaluations', // Voir ses propres évaluations
    'view_notifications',
    'view_timesheet', // Gérer son propre timesheet
    'request_role_change', // Demander un changement de rôle
  ],
};

/**
 * Pages accessibles par rôle
 * Format: route => rôles autorisés
 */
export const pageAccess: Record<string, UserRole[]> = {
  // Pages accessibles à tous les utilisateurs authentifiés
  '/': ['super_admin', 'admin', 'hr', 'employee'],
  '/dashboard-optimized': ['super_admin', 'admin', 'hr', 'employee'],
  '/search': ['super_admin', 'admin', 'hr', 'employee'],
  '/profile': ['super_admin', 'admin', 'hr', 'employee'],
  '/notifications': ['super_admin', 'admin', 'hr', 'employee'],

  // Pages employés (vue limitée pour employee)
  '/employees': ['super_admin', 'admin', 'hr', 'employee'],
  
  // Pages absences
  '/absences': ['super_admin', 'admin', 'hr', 'employee'],
  
  // Pages formations
  '/trainings': ['super_admin', 'admin', 'hr', 'employee'],
  
  // Pages timesheet
  '/timesheet': ['super_admin', 'admin', 'hr', 'employee'],
  
  // Pages documents
  '/documents': ['super_admin', 'admin', 'hr', 'employee'],
  
  // Pages évaluations
  '/evaluations': ['super_admin', 'admin', 'hr', 'employee'],
  
  // Pages demande de rôle
  '/demande-role': ['super_admin', 'admin', 'hr', 'employee'],

  // Pages paie (seulement admin et super_admin)
  '/payroll': ['super_admin', 'admin'],

  // Pages statistiques (pas pour employee)
  '/statistics': ['super_admin', 'admin', 'hr'],
  '/statistics-advanced': ['super_admin', 'admin'],

  // Pages workflow (admin seulement)
  '/workflow-management': ['super_admin', 'admin'],

  // Pages paramètres (super_admin seulement)
  '/settings': ['super_admin'],

  // Page about (tous)
  '/about': ['super_admin', 'admin', 'hr', 'employee'],
};

/**
 * Vérifie si un utilisateur a une permission spécifique
 */
export const hasPermission = (
  userRole: UserRole | undefined,
  permission: Permission
): boolean => {
  if (!userRole) return false;
  return rolePermissions[userRole]?.includes(permission) || false;
};

/**
 * Vérifie si un utilisateur peut accéder à une page
 */
export const canAccessPage = (
  userRole: UserRole | undefined,
  path: string
): boolean => {
  if (!userRole) return false;
  
  // Super admin peut tout faire
  if (userRole === 'super_admin') return true;
  
  // Trouver la règle d'accès pour cette page
  const allowedRoles = pageAccess[path];
  
  // Si pas de règle définie, on bloque par sécurité
  if (!allowedRoles) return false;
  
  return allowedRoles.includes(userRole);
};

/**
 * Vérifie si un utilisateur a l'un des rôles spécifiés
 */
export const hasAnyRole = (
  userRole: UserRole | undefined,
  roles: UserRole[]
): boolean => {
  if (!userRole) return false;
  return roles.includes(userRole);
};

/**
 * Vérifie si un utilisateur est admin ou super_admin
 */
export const isAdmin = (userRole: UserRole | undefined): boolean => {
  return userRole === 'admin' || userRole === 'super_admin';
};

/**
 * Vérifie si un utilisateur est super_admin
 */
export const isSuperAdmin = (userRole: UserRole | undefined): boolean => {
  return userRole === 'super_admin';
};

/**
 * Obtient le label d'affichage d'un rôle
 */
export const getRoleLabel = (role: UserRole): string => {
  const labels: Record<UserRole, string> = {
    super_admin: 'Super Administrateur',
    admin: 'Administrateur',
    hr: 'Ressources Humaines',
    employee: 'Employé',
  };
  return labels[role] || role;
};

/**
 * Obtient la couleur d'un badge de rôle
 */
export const getRoleColor = (role: UserRole): string => {
  const colors: Record<UserRole, string> = {
    super_admin: 'bg-purple-100 text-purple-800',
    admin: 'bg-red-100 text-red-800',
    hr: 'bg-blue-100 text-blue-800',
    employee: 'bg-gray-100 text-gray-800',
  };
  return colors[role] || 'bg-gray-100 text-gray-800';
};

/**
 * Obtient toutes les permissions d'un rôle
 */
export const getRolePermissions = (role: UserRole): Permission[] => {
  return rolePermissions[role] || [];
};

/**
 * Vérifie si un rôle A peut gérer un rôle B
 * (pour validation des changements de rôle)
 */
export const canManageRole = (
  userRole: UserRole | undefined,
  targetRole: UserRole
): boolean => {
  if (!userRole) return false;
  
  // Super admin peut gérer tous les rôles
  if (userRole === 'super_admin') return true;
  
  // Admin peut gérer hr et employee
  if (userRole === 'admin') {
    return targetRole === 'hr' || targetRole === 'employee';
  }
  
  // HR ne peut pas gérer de rôles
  // Employee ne peut pas gérer de rôles
  return false;
};
