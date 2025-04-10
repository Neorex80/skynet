import { useState, useCallback } from 'react';

/**
 * Toast notification types
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast notification interface
 */
export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Custom hook for managing toast notifications
 */
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  /**
   * Show a toast notification
   */
  const showToast = useCallback((
    message: string, 
    type: ToastType = 'info', 
    options: {
      duration?: number;
      actionLabel?: string;
      onAction?: () => void;
    } = {}
  ) => {
    const id = crypto.randomUUID();
    const { duration = 5000, actionLabel, onAction } = options;
    
    const newToast: Toast = { 
      id, 
      message, 
      type, 
      duration, 
      actionLabel, 
      onAction
    };
    
    setToasts(currentToasts => [...currentToasts, newToast]);
    
    // Auto-dismiss toast after duration
    if (duration !== Infinity) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }
    
    return id;
  }, []);
  
  /**
   * Dismiss a toast notification
   */
  const dismissToast = useCallback((id: string) => {
    setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
  }, []);
  
  /**
   * Convenience methods for different toast types
   */
  const success = useCallback(
    (message: string, options = {}) => showToast(message, 'success', options),
    [showToast]
  );
  
  const error = useCallback(
    (message: string, options = {}) => showToast(message, 'error', options),
    [showToast]
  );
  
  const warning = useCallback(
    (message: string, options = {}) => showToast(message, 'warning', options),
    [showToast]
  );
  
  const info = useCallback(
    (message: string, options = {}) => showToast(message, 'info', options),
    [showToast]
  );
  
  /**
   * Dismiss all toasts
   */
  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    dismissToast,
    dismissAll,
    success,
    error,
    warning,
    info,
  };
}

export default useToast;