import { createContext } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastContextType {
  showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  hideToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);
