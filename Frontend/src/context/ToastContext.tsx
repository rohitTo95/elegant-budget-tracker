import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Toast, ToastProps, ToastVariant } from '@/components/ui/custom-toast';

interface ToastContextType {
  showToast: (title: string, description?: string, variant?: ToastVariant, duration?: number) => void;
  showInfo: (title: string, description?: string, duration?: number) => void;
  showError: (title: string, description?: string, duration?: number) => void;
  showSuccess: (title: string, description?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

interface ToastItem extends Omit<ToastProps, 'onClose'> {
  id: string;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((
    title: string, 
    description?: string, 
    variant: ToastVariant = 'info', 
    duration: number = 5000
  ) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newToast: ToastItem = {
      id,
      title,
      description,
      variant,
      duration,
    };

    setToasts(prev => [...prev, newToast]);
  }, []);

  const showInfo = useCallback((title: string, description?: string, duration?: number) => {
    showToast(title, description, 'info', duration);
  }, [showToast]);

  const showError = useCallback((title: string, description?: string, duration?: number) => {
    showToast(title, description, 'error', duration);
  }, [showToast]);

  const showSuccess = useCallback((title: string, description?: string, duration?: number) => {
    showToast(title, description, 'success', duration);
  }, [showToast]);

  const value: ToastContextType = {
    showToast,
    showInfo,
    showError,
    showSuccess,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 left-4 sm:left-auto sm:right-4 z-50 space-y-2 max-h-screen overflow-hidden pointer-events-none">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            className="pointer-events-auto"
            style={{
              transform: `translateY(${index * 8}px)`,
              zIndex: 50 - index,
            }}
          >
            <Toast
              {...toast}
              onClose={removeToast}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
