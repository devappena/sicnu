/**
 * Hooks React Query pour les notifications
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/api';
import type { NotificationPreferences, BulkNotification, PaginationParams } from '@/api';

// Clés de requête pour le cache
export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (params?: PaginationParams) => [...notificationKeys.lists(), params] as const,
  details: () => [...notificationKeys.all, 'detail'] as const,
  detail: (id: string) => [...notificationKeys.details(), id] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
  preferences: () => [...notificationKeys.all, 'preferences'] as const,
  templates: () => [...notificationKeys.all, 'templates'] as const,
};

/**
 * Hook pour récupérer les notifications (paginées)
 */
export function useNotifications(params?: PaginationParams & {
  read?: boolean;
  type?: string;
}) {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => notificationService.getAll(params),
    staleTime: 30 * 1000, // 30 secondes
    refetchInterval: 60 * 1000, // Rafraîchir chaque minute
  });
}

/**
 * Hook pour récupérer une notification par ID
 */
export function useNotification(id: string, enabled = true) {
  return useQuery({
    queryKey: notificationKeys.detail(id),
    queryFn: () => notificationService.getById(id),
    enabled: enabled && !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook pour récupérer le nombre de notifications non lues
 */
export function useUnreadNotificationsCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () => notificationService.getUnreadCount(),
    staleTime: 30 * 1000, // 30 secondes
    refetchInterval: 60 * 1000, // Rafraîchir chaque minute
  });
}

/**
 * Hook pour récupérer les préférences de notification
 */
export function useNotificationPreferences() {
  return useQuery({
    queryKey: notificationKeys.preferences(),
    queryFn: () => notificationService.getPreferences(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook pour mettre à jour les préférences
 */
export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: Partial<NotificationPreferences>) =>
      notificationService.updatePreferences(preferences),
    onSuccess: (response) => {
      queryClient.setQueryData(notificationKeys.preferences(), response);
    },
  });
}

/**
 * Hook pour marquer une notification comme lue
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: (response, id) => {
      queryClient.setQueryData(notificationKeys.detail(id), response);
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    },
  });
}

/**
 * Hook pour marquer toutes les notifications comme lues
 */
export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    },
  });
}

/**
 * Hook pour supprimer une notification
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    },
  });
}

/**
 * Hook pour supprimer toutes les notifications lues
 */
export function useDeleteAllReadNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.deleteAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    },
  });
}

/**
 * Hook pour envoyer une notification
 */
export function useSendNotification() {
  return useMutation({
    mutationFn: (data: {
      userId: string;
      type: 'info' | 'success' | 'warning' | 'error';
      title: string;
      message: string;
      action?: { label: string; url: string };
      channels?: ('email' | 'push' | 'inApp')[];
    }) => notificationService.send(data),
  });
}

/**
 * Hook pour envoyer des notifications en masse
 */
export function useSendBulkNotification() {
  return useMutation({
    mutationFn: (data: BulkNotification) => notificationService.sendBulk(data),
  });
}

/**
 * Hook pour récupérer les templates
 */
export function useNotificationTemplates() {
  return useQuery({
    queryKey: notificationKeys.templates(),
    queryFn: () => notificationService.getTemplates(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook pour s'abonner aux notifications push
 */
export function useSubscribePush() {
  return useMutation({
    mutationFn: (subscription: PushSubscription) =>
      notificationService.subscribePush(subscription),
  });
}

/**
 * Hook pour se désabonner des notifications push
 */
export function useUnsubscribePush() {
  return useMutation({
    mutationFn: () => notificationService.unsubscribePush(),
  });
}
