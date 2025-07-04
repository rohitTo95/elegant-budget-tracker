import React, { useEffect, useState } from 'react';
import "remixicon/fonts/remixicon.css";

export type ToastVariant = 'info' | 'error' | 'success';

export interface ToastProps {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  description,
  variant,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose(id);
    }, 300); // Animation duration
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'info':
        return {
          bg: 'bg-white',
          text: 'text-black',
          border: 'border-gray-200',
          icon: 'ri-information-line',
          iconColor: 'text-blue-500'
        };
      case 'error':
        return {
          bg: 'bg-red-500',
          text: 'text-white',
          border: 'border-red-600',
          icon: 'ri-error-warning-line',
          iconColor: 'text-white'
        };
      case 'success':
        return {
          bg: 'bg-green-500',
          text: 'text-white',
          border: 'border-green-600',
          icon: 'ri-check-line',
          iconColor: 'text-white'
        };
      default:
        return {
          bg: 'bg-white',
          text: 'text-black',
          border: 'border-gray-200',
          icon: 'ri-information-line',
          iconColor: 'text-blue-500'
        };
    }
  };

  const styles = getVariantStyles();

  if (!isVisible) return null;

  return (
    <div
      className={`
        relative w-full max-w-sm sm:max-w-md 
        ${styles.bg} ${styles.text} ${styles.border}
        border rounded-lg shadow-lg p-4
        transform transition-all duration-300 ease-in-out
        ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
        ${isVisible ? 'animate-slide-in' : ''}
      `}
      role="alert"
    >
      {/* Header with icon and close button */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <i className={`${styles.icon} ${styles.iconColor} text-lg`}></i>
          <h4 className="font-semibold text-sm">{title}</h4>
        </div>
        <button
          onClick={handleClose}
          className={`
            ${styles.text} hover:opacity-70 transition-opacity duration-200
            p-1 rounded-full hover:bg-black hover:bg-opacity-10
          `}
          aria-label="Close notification"
        >
          <i className="ri-close-line text-sm"></i>
        </button>
      </div>

      {/* Description */}
      {description && (
        <p className={`text-xs ${styles.text} opacity-90 leading-relaxed`}>
          {description}
        </p>
      )}

      {/* Progress bar */}
      <div className="mt-3 h-1 bg-black bg-opacity-10 rounded-full overflow-hidden">
        <div
          className={`h-full ${variant === 'info' ? 'bg-blue-500' : variant === 'error' ? 'bg-white' : 'bg-white'} 
            animate-progress`}
          style={{
            animation: `progress ${duration}ms linear`,
          }}
        />
      </div>
    </div>
  );
};

// CSS animations (to be added to index.css)
export const toastAnimations = `
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}

.animate-progress {
  animation: progress var(--duration, 5000ms) linear;
}
`;
