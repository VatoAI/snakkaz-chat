
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper function for conditional merging of Tailwind classes
export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Theme utility for consistent styling
export const theme = {
  colors: {
    background: {
      primary: 'bg-cyberdark-950',
      secondary: 'bg-cyberdark-900',
      tertiary: 'bg-cyberdark-800'
    },
    text: {
      primary: 'text-cybergold-200',
      secondary: 'text-cybergold-400',
      tertiary: 'text-cybergold-500'
    },
    border: {
      light: 'border-cybergold-500/50',
      medium: 'border-cybergold-500/30',
      dark: 'border-cybergold-800'
    },
    button: {
      primary: {
        bg: 'bg-cybergold-600',
        text: 'text-cyberdark-950',
        hover: 'hover:bg-cybergold-500'
      },
      secondary: {
        bg: 'bg-cyberdark-800',
        text: 'text-cybergold-400',
        hover: 'hover:bg-cyberdark-700'
      }
    }
  },
  shadows: {
    sm: 'shadow-sm shadow-cybergold-500/10',
    md: 'shadow-md shadow-cybergold-500/10',
    lg: 'shadow-lg shadow-cybergold-500/20'
  }
};
