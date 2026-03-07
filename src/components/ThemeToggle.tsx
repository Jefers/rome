'use client';

import { useSyncExternalStore, useCallback } from 'react';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getSnapshot(): string {
  if (typeof window === 'undefined') return 'dark';
  return localStorage.getItem('theme') || 'dark';
}

function getServerSnapshot(): string {
  return 'dark';
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isDark = theme === 'dark';

  const toggleTheme = useCallback(() => {
    const newTheme = isDark ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    
    // Dispatch storage event to notify other components
    window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: newTheme }));
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Initialize theme on first render
  if (typeof window !== 'undefined') {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-container flex items-center justify-center rounded-full hover:bg-pink-500/10 transition-colors touch-target"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Sun Icon */}
      <div className={`sun-icon ${isDark ? 'opacity-0 scale-0 rotate-90' : 'opacity-100 scale-100 rotate-0'} transition-all duration-500 ease-out`}>
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-yellow-400"
        >
          <circle cx="12" cy="12" r="4" />
          <path className="sun-ray" d="M12 2v2" style={{ transformOrigin: '12px 12px' }} />
          <path className="sun-ray" d="M12 20v2" style={{ transformOrigin: '12px 12px' }} />
          <path className="sun-ray" d="m4.93 4.93 1.41 1.41" style={{ transformOrigin: '4.93px 4.93px' }} />
          <path className="sun-ray" d="m17.66 17.66 1.41 1.41" style={{ transformOrigin: '17.66px 17.66px' }} />
          <path className="sun-ray" d="M2 12h2" style={{ transformOrigin: '12px 12px' }} />
          <path className="sun-ray" d="M20 12h2" style={{ transformOrigin: '12px 12px' }} />
          <path className="sun-ray" d="m6.34 17.66-1.41 1.41" style={{ transformOrigin: '6.34px 17.66px' }} />
          <path className="sun-ray" d="m19.07 4.93-1.41 1.41" style={{ transformOrigin: '19.07px 4.93px' }} />
        </svg>
      </div>

      {/* Moon Icon */}
      <div className={`moon-icon absolute ${isDark ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 -rotate-90'} transition-all duration-500 ease-out`}>
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-pink-400"
        >
          <defs>
            <mask id="moon-mask">
              <circle cx="12" cy="12" r="10" fill="white" />
              <circle cx="18" cy="6" r="8" fill="black" />
            </mask>
          </defs>
          <circle cx="12" cy="12" r="10" mask="url(#moon-mask)" />
        </svg>
      </div>
    </button>
  );
}
