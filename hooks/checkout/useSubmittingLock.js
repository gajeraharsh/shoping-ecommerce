import { useEffect, useRef, useState } from 'react';

export default function useSubmittingLock(SUBMIT_FLAG_KEY) {
  const [isSubmitting, setIsSubmitting] = useState(() => {
    try {
      return typeof window !== 'undefined' && sessionStorage.getItem(SUBMIT_FLAG_KEY) === '1';
    } catch {
      return false;
    }
  });

  const isSubmittingRef = useRef(false);
  if (isSubmitting && !isSubmittingRef.current) {
    isSubmittingRef.current = true;
  }
  const submitTimeoutRef = useRef(null);

  const releaseSubmitting = () => {
    isSubmittingRef.current = false;
    setIsSubmitting(false);
    try { sessionStorage.removeItem(SUBMIT_FLAG_KEY); } catch {}
    if (submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current);
      submitTimeoutRef.current = null;
    }
  };

  const lockSubmitting = () => {
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    try { sessionStorage.setItem(SUBMIT_FLAG_KEY, '1'); } catch {}
    if (submitTimeoutRef.current) clearTimeout(submitTimeoutRef.current);
    submitTimeoutRef.current = setTimeout(() => {
      releaseSubmitting();
    }, 120000);
  };

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SUBMIT_FLAG_KEY) === '1') {
        isSubmittingRef.current = true;
        setIsSubmitting(true);
        if (submitTimeoutRef.current) clearTimeout(submitTimeoutRef.current);
        submitTimeoutRef.current = setTimeout(() => {
          releaseSubmitting();
        }, 120000);
      }
    } catch {}
    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
    };
  }, [SUBMIT_FLAG_KEY]);

  return { isSubmitting, isSubmittingRef, lockSubmitting, releaseSubmitting };
}
