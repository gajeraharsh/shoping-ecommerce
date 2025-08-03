'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for saved theme preference, but default to light mode
    const savedTheme = localStorage.getItem('theme');
    const shouldUseDark = savedTheme === 'dark'; // Only use dark if explicitly saved

    setDarkMode(shouldUseDark);
    updateTheme(shouldUseDark);
  }, []);

  const updateTheme = (isDark) => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    updateTheme(newDarkMode);
  };

  // Don't render anything on the server
  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative w-11 h-11 sm:w-12 sm:h-12 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 touch-manipulation flex items-center justify-center group"
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-5 h-5">
        <Sun 
          className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
            darkMode ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
          }`} 
        />
        <Moon 
          className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
            darkMode ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'
          }`} 
        />
      </div>
    </button>
  );
}
