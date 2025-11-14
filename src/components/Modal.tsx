import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  type?: 'info' | 'warning' | 'error' | 'success';
  actionLoading?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm',
  message,
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCancel = true,
  type = 'info',
  actionLoading = false
}: ModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !actionLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, actionLoading]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with transparent background and black shade */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={actionLoading ? undefined : onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-10 mx-4 w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
          <h3 className={`text-lg font-semibold ${getTypeStyles()}`}>
            {title}
          </h3>
          <button
            onClick={onClose}
            disabled={actionLoading}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="text-gray-700 dark:text-gray-300">
            {message}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 p-6 dark:border-gray-700">
          {showCancel && (
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={actionLoading}
            >
              {cancelText}
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={actionLoading}
            className={type === 'error' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
