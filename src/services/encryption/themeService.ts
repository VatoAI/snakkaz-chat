/**
 * Theme Service for Snakkaz Chat
 * 
 * This service handles theme management including a new light theme option
 * and persistent theme preferences.
 */

import { getLocalStorage, setLocalStorage } from '../../utils/storage';

// Theme storage key
const THEME_STORAGE_KEY = 'snakkaz_theme_preference';

// Theme options
export enum Theme {
  DARK = 'dark',     // Original cyberpunk dark theme
  LIGHT = 'light',   // New lighter theme option
  SYSTEM = 'system'  // Follow system preference
}

// Color schemes for different themes
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}

// Theme color definitions
export const themeColors: Record<string, ThemeColors> = {
  [Theme.DARK]: {
    primary: '#0f172a',       // Dark blue background
    secondary: '#1e293b',     // Slightly lighter blue
    background: '#0f172a',    // Dark background
    text: '#e2e8f0',          // Light text
    accent: '#38bdf8'         // Cyan accent
  },
  [Theme.LIGHT]: {
    primary: '#f8fafc',       // Very light background
    secondary: '#e2e8f0',     // Light secondary/card background
    background: '#ffffff',    // White background
    text: '#0f172a',          // Dark text
    accent: '#0284c7'         // Darker blue accent for better contrast
  }
};

/**
 * Get the current theme preference or default to system
 */
export const getCurrentTheme = async (): Promise<Theme> => {
  try {
    const savedTheme = await getLocalStorage<Theme>(THEME_STORAGE_KEY);
    return savedTheme || Theme.SYSTEM;
  } catch (error) {
    console.error('Failed to get theme preference:', error);
    return Theme.SYSTEM;
  }
};

/**
 * Set theme preference and save to storage
 */
export const setTheme = async (theme: Theme): Promise<void> => {
  try {
    await setLocalStorage(THEME_STORAGE_KEY, theme);
    applyTheme(theme);
  } catch (error) {
    console.error('Failed to save theme preference:', error);
  }
};

/**
 * Apply theme to document by updating CSS variables
 */
export const applyTheme = (theme: Theme): void => {
  const root = document.documentElement;
  const colors = themeColors[theme] || themeColors[Theme.DARK];
  
  // Apply CSS variables to the document root
  root.style.setProperty('--color-primary', colors.primary);
  root.style.setProperty('--color-secondary', colors.secondary);
  root.style.setProperty('--color-background', colors.background);
  root.style.setProperty('--color-text', colors.text);
  root.style.setProperty('--color-accent', colors.accent);
  
  // Add theme class to body for component-specific styling
  document.body.classList.remove(Theme.DARK, Theme.LIGHT);
  document.body.classList.add(theme);
  
  // Update meta theme-color for browser UI
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', colors.primary);
  }
};

/**
 * Initialize theme based on saved preference or system preference
 */
export const initializeTheme = async (): Promise<void> => {
  try {
    const savedTheme = await getCurrentTheme();
    
    if (savedTheme === Theme.SYSTEM) {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? Theme.DARK : Theme.LIGHT);
    } else {
      applyTheme(savedTheme);
    }
    
    // Listen for system theme changes if using system preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (getCurrentTheme() === Theme.SYSTEM) {
        applyTheme(e.matches ? Theme.DARK : Theme.LIGHT);
      }
    });
  } catch (error) {
    console.error('Failed to initialize theme:', error);
    applyTheme(Theme.DARK); // Fall back to dark theme
  }
};
