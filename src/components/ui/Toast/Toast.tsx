import React, { useEffect, useState } from 'react';
import { Toast as ToastType } from '../../../hooks/useToast';
import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react';

interface ToastProps extends ToastType {
  onDismiss: () => void;
}

/**
 * Individual toast notification component
 */
const Toast: React.FC<ToastProps> = ({ 
  id,
  message, 
  type, 
  duration = 5000,
  actionLabel,
  onAction,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  
  // Animate in the toast
  useEffect(() => {
    // Small delay before showing for smoother animation
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    
    return () => clearTimeout(timeout);
  }, []);
  
  // Handle toast duration and progress
  useEffect(() => {
    if (duration === Infinity || isPaused) return;
    
    const startTime = Date.now();
    const endTime = startTime + duration;
    
    const updateProgress = () => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      const newProgress = (remaining / duration) * 100;
      
      setProgress(newProgress);
      
      if (remaining > 0) {
        requestAnimationFrame(updateProgress);
      }
    };
    
    const animationFrame = requestAnimationFrame(updateProgress);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [duration, isPaused]);
  
  // Handle toast dismissal
  const handleDismiss = () => {
    setIsVisible(false);
    // Wait for exit animation to complete before removing
    setTimeout(onDismiss, 300);
  };
  
  // Handle action click
  const handleAction = () => {
    if (onAction) {
      onAction();
    }
    handleDismiss();
  };
  
  // Determine icon based on type
  const Icon = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  }[type];
  
  // Background color based on type
  const bgColor = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50',
    warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50'
  }[type];
  
  // Icon color based on type
  const iconColor = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-amber-500',
    info: 'text-blue-500'
  }[type];
  
  // Progress bar color based on type
  const progressColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500'
  }[type];
  
  return (
    <div 
      className={`${bgColor} border rounded-lg shadow-lg overflow-hidden transition-all duration-300 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
      role="alert"
      aria-live="assertive"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className={`mr-3 ${iconColor}`}>
            <Icon size={18} />
          </div>
          <div className="flex-1 mr-2">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{message}</p>
          </div>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            onClick={handleDismiss}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        
        {/* Optional action button */}
        {actionLabel && onAction && (
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              className={`text-sm font-medium ${
                type === 'success' ? 'text-green-600 dark:text-green-400' :
                type === 'error' ? 'text-red-600 dark:text-red-400' :
                type === 'warning' ? 'text-amber-600 dark:text-amber-400' :
                'text-blue-600 dark:text-blue-400'
              }`}
              onClick={handleAction}
            >
              {actionLabel}
            </button>
          </div>
        )}
      </div>
      
      {/* Progress bar */}
      {duration !== Infinity && (
        <div className="h-1 w-full bg-gray-200 dark:bg-gray-700">
          <div 
            className={`h-full ${progressColor} transition-all ease-linear`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Toast;