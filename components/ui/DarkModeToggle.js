'use client';

import { useEffect } from 'react';

export default function DarkModeToggle() {
  useEffect(() => {
    // Force light mode by removing dark class and setting light theme
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }, []);

  // Return null to hide the component
  return null;
}
