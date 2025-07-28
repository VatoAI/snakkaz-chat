import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Hjelpefunksjon for å kombinere Tailwind-klasser på en sikker måte
export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Applikasjonens fargepalett
export const theme = {
  colors: {
    // Primærfarger
    cybergold: {
      100: '#FFF7E0',
      200: '#FFF0C2',
      300: '#FFE9A3',
      400: '#FFE285',
      500: '#FFD966',
      600: '#E6C05C',
      700: '#CCA852',
      800: '#B39147',
      900: '#997A3D'
    },
    // Sekundærfarger
    cyberblue: {
      100: '#E0F7FF',
      200: '#C2F0FF',
      300: '#A3E9FF',
      400: '#85E2FF',
      500: '#66D9FF',
      600: '#5CC0E6',
      700: '#52A8CC',
      800: '#4791B3',
      900: '#3D7A99'
    },
    // Bakgrunnsfarger
    cyberdark: {
      50: '#383944',
      100: '#32333E',
      200: '#2D2E38',
      300: '#292A33',
      400: '#24252D',
      500: '#202128',
      600: '#1B1C22',
      700: '#17181D',
      800: '#121318',
      900: '#0E0E12',
      950: '#0A0A0D'
    }
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    glow: '0 0 15px rgba(255, 217, 102, 0.5)'
  },
  animation: {
    fast: '0.2s',
    default: '0.3s',
    slow: '0.5s'
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    default: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'
  },
  screens: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
};