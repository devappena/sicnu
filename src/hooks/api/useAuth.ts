/**
 * Hooks React Query pour l'authentification
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/api';
import type { LoginCredentials, RegisterCredentials } from '@/api';
import { config } from '@/config/devConfig';

// Clés de requête pour le cache
export const authKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authKeys.all, 'current-user'] as const,
};

/**
 * Hook pour récupérer l'utilisateur actuel
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: () => authService.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

/**
 * Hook pour la connexion
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (response) => {
      // Mettre en cache l'utilisateur connecté
      queryClient.setQueryData(authKeys.currentUser(), response);
    },
  });
}

/**
 * Hook pour l'inscription
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterCredentials) => authService.register(data),
    onSuccess: (response) => {
      queryClient.setQueryData(authKeys.currentUser(), response);
    },
  });
}

/**
 * Hook pour la déconnexion
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Nettoyer tout le cache
      queryClient.clear();
    },
  });
}

/**
 * Hook pour le rafraîchissement du token
 */
export function useRefreshToken() {
  return useMutation({
    mutationFn: () => authService.refreshToken(),
  });
}

/**
 * Hook pour la réinitialisation du mot de passe
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });
}

/**
 * Hook pour la définition d'un nouveau mot de passe
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: (data: { token: string; password: string }) =>
      authService.resetPassword(data.token, data.password),
  });
}

/**
 * Hook pour le changement de mot de passe
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: { oldPassword: string; newPassword: string }) => {
      if (config.USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, config.MOCK_DELAY));
        return;
      }
      return authService.changePassword(data.oldPassword, data.newPassword);
    },
  });
}
