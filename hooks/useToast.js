'use client';

import { useState, useCallback } from 'react';

let toastId = 0;
let toasts = [];
let listeners = [];

export function useToast() {
  const [, forceUpdate] = useState(0);

  const subscribe = useCallback((listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = ++toastId;
    const toast = { id, message, type, duration };
    
    toasts.push(toast);
    listeners.forEach(listener => listener());

    setTimeout(() => {
      toasts = toasts.filter(t => t.id !== id);
      listeners.forEach(listener => listener());
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    toasts = toasts.filter(t => t.id !== id);
    listeners.forEach(listener => listener());
  }, []);

  return { showToast, removeToast, subscribe, toasts };
}