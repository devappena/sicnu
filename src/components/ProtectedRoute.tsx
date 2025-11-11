import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import LoadingSpinner from './LoadingSpinner';
import type { UserRole, Permission } from '../utils/permissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[]; // Rôles autorisés à accéder à cette route
  requirePermission?: Permission; // Permission spécifique requise (optionnel)
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  requirePermission 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { hasAnyRole, hasPermission } = usePermissions();
  const location = useLocation();

  // Afficher le loader pendant la vérification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Rediriger vers login si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Vérifier les rôles autorisés si spécifiés
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role as UserRole | undefined;
    
    // Super admin a toujours accès
    if (userRole !== 'super_admin' && !hasAnyRole(allowedRoles)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Vérifier la permission spécifique si requise
  if (requirePermission && !hasPermission(requirePermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
