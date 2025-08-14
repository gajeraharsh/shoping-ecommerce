"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie } from 'lucide-react';

const LS_KEY = 'cookie-consent-accepted-v1';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const accepted = localStorage.getItem(LS_KEY);
      if (!accepted) setVisible(true);
    } catch {}
  }, []);

  const accept = () => {
    try { localStorage.setItem(LS_KEY, '1'); } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[200] p-3 sm:p-4">
      <div className="max-w-5xl mx-auto bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl backdrop-blur px-4 py-3 sm:px-5 sm:py-4 flex gap-3 sm:gap-4 items-start">
        <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex-shrink-0">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          We use cookies to personalize your experience, provide secure checkout, and analyze site traffic. See our{' '}
          <Link href="/cookies" className="underline font-medium hover:opacity-80">Cookie Policy</Link> and{' '}
          <Link href="/privacy" className="underline font-medium hover:opacity-80">Privacy Policy</Link>.
        </div>
        <div className="flex gap-2 sm:gap-3 ml-auto">
          <Link href="/cookies" className="hidden sm:inline-flex items-center justify-center px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
            Learn more
          </Link>
          <button onClick={accept} className="inline-flex items-center justify-center px-4 py-2 text-sm rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
