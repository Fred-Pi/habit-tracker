import { useEffect } from 'react';

type ToastProps = {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
};

export function Toast({ message, isVisible, onClose, action, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 max-w-md">
        <span className="text-sm flex-1">{message}</span>

        {action && (
          <button
            onClick={() => {
              action.onClick();
              onClose();
            }}
            className="text-sm font-semibold text-primary-400 dark:text-primary-600 hover:text-primary-300 dark:hover:text-primary-700 transition-colors uppercase tracking-wide"
          >
            {action.label}
          </button>
        )}

        <button
          onClick={onClose}
          className="text-gray-400 dark:text-gray-600 hover:text-gray-300 dark:hover:text-gray-700 transition-colors ml-2"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
