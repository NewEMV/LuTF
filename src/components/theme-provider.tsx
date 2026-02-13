'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme') as Theme;
    if (stored) {
      setTheme(stored);
      document.documentElement.classList.toggle('dark', stored === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  if (!mounted) return <>{children}</>;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group overflow-hidden"
      aria-label="Toggle theme"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10 transition-transform duration-500">
        {theme === 'light' ? (
          <Moon className="w-6 h-6 text-white animate-spin-slow" />
        ) : (
          <Sun className="w-6 h-6 text-white animate-pulse" />
        )}
      </div>

      <div className="absolute inset-0 rounded-full bg-white/20 blur-xl scale-0 group-hover:scale-100 transition-transform duration-300" />
    </button>
  );
}
