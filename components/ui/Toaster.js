'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export function Toaster() {
  const { toasts, removeToast, subscribe } = useToast();
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      forceUpdate(prev => prev + 1);
    });
    return unsubscribe;
  }, [subscribe]);

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`max-w-sm w-full border rounded-lg p-4 shadow-lg animate-in fade-in slide-in-from-right ${getToastStyles(toast.type)}`}
        >
          <div className="flex items-start gap-3">
            {getToastIcon(toast.type)}
            <div className="flex-1">
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}