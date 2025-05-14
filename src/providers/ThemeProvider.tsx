import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Theme } from '../utils/themeService';

// Define the context type
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider props interface
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = Theme.SYSTEM 
}) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    // Apply the theme to the document
    document.documentElement.setAttribute('data-theme', theme);
    
    // Save the theme preference to local storage
    if (theme !== Theme.SYSTEM) {
      localStorage.setItem('theme', theme);
    } else {
      // Check system preference for initial load
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute(
        'data-theme', 
        prefersDark ? Theme.DARK : Theme.LIGHT
      );
    }

    // Listen for system theme changes when using system preference
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (theme === Theme.SYSTEM) {
        document.documentElement.setAttribute(
          'data-theme', 
          e.matches ? Theme.DARK : Theme.LIGHT
        );
      }
    };

    const systemThemeMatcher = window.matchMedia('(prefers-color-scheme: dark)');
    systemThemeMatcher.addEventListener('change', handleSystemThemeChange);

    return () => {
      systemThemeMatcher.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook for using the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
