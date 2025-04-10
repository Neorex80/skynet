import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Toast as ToastType } from '../../../hooks/useToast';
import Toast from './Toast';

interface ToastContainerProps {
  toasts: ToastType[];
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  onDismiss: (id: string) => void;
}

/**
 * Container component for rendering toast notifications
 */
const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  position = 'top-right',
  onDismiss
}) => {
  const [mounted, setMounted] = useState(false);
  
  // Create portal container after mount
  useEffect(() => {
    setMounted(true);
    
    // Create portal container if it doesn't exist
    let portalContainer = document.getElementById('toast-container');
    if (!portalContainer) {
      portalContainer = document.createElement('div');
      portalContainer.id = 'toast-container';
      document.body.appendChild(portalContainer);
    }
    
    return () => {
      // Cleanup on component unmount
      if (portalContainer && !portalContainer.childElementCount) {
        document.body.removeChild(portalContainer);
      }
    };
  }, []);
  
  // Position class mapping
  const positionClasses = {
    'top-right': 'fixed top-4 right-4 flex flex-col items-end',
    'top-left': 'fixed top-4 left-4 flex flex-col items-start',
    'bottom-right': 'fixed bottom-4 right-4 flex flex-col items-end',
    'bottom-left': 'fixed bottom-4 left-4 flex flex-col items-start',
    'top-center': 'fixed top-4 left-1/2 -translate-x-1/2 flex flex-col items-center',
    'bottom-center': 'fixed bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center',
  };
  
  // Render toasts in portal
  if (!mounted) return null;
  
  const container = document.getElementById('toast-container');
  if (!container) return null;
  
  return createPortal(
    <div 
      className={`${positionClasses[position]} z-50 space-y-2 min-w-[300px] max-w-md`}
      aria-live="polite"
    >
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onDismiss={() => onDismiss(toast.id)}
        />
      ))}
    </div>,
    container
  );
};

export default ToastContainer;