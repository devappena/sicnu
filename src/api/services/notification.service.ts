/**
 * Service de gestion des notifications
 * Gère les notifications push et emails
 */

import { get, post, put, patch } from '../client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '../types';

// Types pour les notifications
export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
  metadata?: Record<string, unknown>;
  createdAt: string;
  readAt?: string;
}

export interface NotificationPreferences {
  email: {
    enabled: boolean;
    absenceRequests: boolean;
    absenceApprovals: boolean;
    trainings: boolean;
    payslips: boolean;
    systemUpdates: boolean;
  };
  push: {
    enabled: boolean;
    absenceRequests: boolean;
    absenceApprovals: boolean;
    trainings: boolean;
    payslips: boolean;
    systemUpdates: boolean;
  };
  inApp: {
    enabled: boolean;
    absenceRequests: boolean;
    absenceApprovals: boolean;
    trainings: boolean;
    payslips: boolean;
    systemUpdates: boolean;
  };
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'push' | 'sms';
  subject?: string;
  body: string;
  variables: string[];
  active: boolean;
}

export interface BulkNotification {
  recipients: string[] | 'all' | 'department';
  departmentId?: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  action?: {
    label: string;
    url: string;
  };
  channels: ('email' | 'push' | 'inApp')[];
}

const notificationService = {
  /**
   * Récupère les notifications de l'utilisateur
   */
  getAll: async (params?: PaginationParams & {
    read?: boolean;
    type?: string;
  }): Promise<PaginatedResponse<Notification>> => {
    return get<PaginatedResponse<Notification>>('/notifications', params);
  },

  /**
   * Récupère une notification par ID
   */
  getById: async (id: string): Promise<ApiResponse<Notification>> => {
    return get<Notification>(`/notifications/${id}`);
  },

  /**
   * Marque une notification comme lue
   */
  markAsRead: async (id: string): Promise<ApiResponse<Notification>> => {
    return patch<Notification>(`/notifications/${id}/read`);
  },

  /**
   * Marque toutes les notifications comme lues
   */
  markAllAsRead: async (): Promise<ApiResponse<{ updated: number }>> => {
    return post<{ updated: number }>('/notifications/mark-all-read');
  },

  /**
   * Supprime une notification
   */
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return post<void>(`/notifications/${id}/delete`);
  },

  /**
   * Supprime toutes les notifications lues
   */
  deleteAllRead: async (): Promise<ApiResponse<{ deleted: number }>> => {
    return post<{ deleted: number }>('/notifications/delete-read');
  },

  /**
   * Récupère le nombre de notifications non lues
   */
  getUnreadCount: async (): Promise<ApiResponse<{ count: number }>> => {
    return get<{ count: number }>('/notifications/unread-count');
  },

  /**
   * Récupère les préférences de notification
   */
  getPreferences: async (): Promise<ApiResponse<NotificationPreferences>> => {
    return get<NotificationPreferences>('/notifications/preferences');
  },

  /**
   * Met à jour les préférences de notification
   */
  updatePreferences: async (
    preferences: Partial<NotificationPreferences>
  ): Promise<ApiResponse<NotificationPreferences>> => {
    return put<NotificationPreferences>('/notifications/preferences', preferences);
  },

  /**
   * Envoie une notification à un utilisateur
   */
  send: async (data: {
    userId: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    action?: {
      label: string;
      url: string;
    };
    channels?: ('email' | 'push' | 'inApp')[];
  }): Promise<ApiResponse<Notification>> => {
    return post<Notification>('/notifications/send', data);
  },

  /**
   * Envoie une notification en masse
   */
  sendBulk: async (data: BulkNotification): Promise<ApiResponse<{
    sent: number;
    failed: number;
    errors?: string[];
  }>> => {
    return post('/notifications/send-bulk', data);
  },

  /**
   * Récupère les templates de notification
   */
  getTemplates: async (): Promise<ApiResponse<NotificationTemplate[]>> => {
    return get<NotificationTemplate[]>('/notifications/templates');
  },

  /**
   * Crée un template de notification
   */
  createTemplate: async (
    data: Omit<NotificationTemplate, 'id'>
  ): Promise<ApiResponse<NotificationTemplate>> => {
    return post<NotificationTemplate>('/notifications/templates', data);
  },

  /**
   * Met à jour un template de notification
   */
  updateTemplate: async (
    id: string,
    data: Partial<NotificationTemplate>
  ): Promise<ApiResponse<NotificationTemplate>> => {
    return put<NotificationTemplate>(`/notifications/templates/${id}`, data);
  },

  /**
   * Supprime un template de notification
   */
  deleteTemplate: async (id: string): Promise<ApiResponse<void>> => {
    return post<void>(`/notifications/templates/${id}/delete`);
  },

  /**
   * Envoie une notification basée sur un template
   */
  sendFromTemplate: async (data: {
    templateId: string;
    recipients: string[] | 'all' | 'department';
    departmentId?: string;
    variables: Record<string, string>;
  }): Promise<ApiResponse<{ sent: number; failed: number }>> => {
    return post('/notifications/send-from-template', data);
  },

  /**
   * S'abonne aux notifications push
   */
  subscribePush: async (subscription: PushSubscription): Promise<ApiResponse<void>> => {
    return post<void>('/notifications/push/subscribe', subscription);
  },

  /**
   * Se désabonne des notifications push
   */
  unsubscribePush: async (): Promise<ApiResponse<void>> => {
    return post<void>('/notifications/push/unsubscribe');
  },

  /**
   * Teste l'envoi d'une notification
   */
  test: async (data: {
    type: 'email' | 'push' | 'inApp';
    recipient: string;
  }): Promise<ApiResponse<{ success: boolean; message: string }>> => {
    return post('/notifications/test', data);
  }
};

export default notificationService;
