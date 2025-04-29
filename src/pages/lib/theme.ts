import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for combining Tailwind CSS classes efficiently
export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Cyberpunk-inspirert fargeskjema for hele applikasjonen
export const theme = {
  colors: {
    background: {
      primary: 'bg-cyberdark-950',
      secondary: 'bg-cyberdark-900',
      tertiary: 'bg-cyberdark-800',
      accent: 'bg-cybergold-900/20'
    },
    text: {
      primary: 'text-white',
      secondary: 'text-cybergold-400',
      muted: 'text-cybergold-600',
      accent: 'text-cybergold-500'
    },
    border: {
      light: 'border-cyberdark-700',
      medium: 'border-cyberdark-800',
      accent: 'border-cybergold-700'
    },
    button: {
      primary: {
        bg: 'bg-cybergold-600',
        text: 'text-cyberdark-950',
        hover: 'hover:bg-cybergold-500',
        disabled: 'disabled:bg-cyberdark-800 disabled:text-cyberdark-600'
      },
      secondary: {
        bg: 'bg-cyberdark-800',
        text: 'text-cybergold-400',
        hover: 'hover:bg-cyberdark-700',
        disabled: 'disabled:bg-cyberdark-900 disabled:text-cyberdark-700'
      },
      danger: {
        bg: 'bg-red-900/30',
        text: 'text-red-400',
        hover: 'hover:bg-red-900/50',
        disabled: 'disabled:bg-red-900/10 disabled:text-red-900/30'
      }
    },
    status: {
      online: 'bg-green-500',
      offline: 'bg-gray-500',
      away: 'bg-yellow-500',
      busy: 'bg-red-500'
    }
  },
  shadows: {
    sm: 'shadow-sm shadow-black/30',
    md: 'shadow-md shadow-black/30',
    lg: 'shadow-lg shadow-black/30'
  },
  animation: {
    normal: 'transition-all duration-200',
    slow: 'transition-all duration-300',
    fast: 'transition-all duration-100'
  }
};

// Legger til Tailwind CSS utility klasser for cyberpunk-temaet
export const cyberColors = {
  gold: {
    400: '#e6c06a',
    500: '#d4af37',
    600: '#b8962e',
    700: '#8c6d1f',
    900: '#3e2e0a'
  },
  dark: {
    700: '#2e3033',
    800: '#1d1e20',
    900: '#141416',
    950: '#0a0a0b'
  },
  blue: {
    400: '#6ac3e6',
    500: '#37a6d4',
    600: '#2e8cb8',
    700: '#1f688c',
    900: '#0a2d3e'
  }
};