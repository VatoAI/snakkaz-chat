// Theme constants for consistent colors across the application
export const theme = {
  colors: {
    // Main background and surfaces
    background: {
      primary: 'bg-cyberdark-950',      // Mørkeste bakgrunn
      secondary: 'bg-cyberdark-900',    // Litt lysere bakgrunn for kort, sidefelter
      tertiary: 'bg-cyberdark-800',     // For hover states, aktive elementer
      overlay: 'bg-cyberdark-900/95',   // For overlegg med blur
    },
    
    // Text colors
    text: {
      primary: 'text-cybergold-200',      // Standard tekst
      secondary: 'text-cybergold-400',    // Overskrifter, fremhevet tekst
      muted: 'text-cybergold-500',        // Nedtonet tekst
      link: 'text-cybergold-300',         // Lenker
      inverse: 'text-cyberdark-950',      // Tekst på lyse bakgrunner
    },
    
    // Border colors
    border: {
      light: 'border-cybergold-700/30',    // Subtile grenser
      medium: 'border-cyberdark-700',      // Standard grenser
      active: 'border-cybergold-500',      // Aktive/fokuserte elementer
    },
    
    // Button and interactive element colors
    button: {
      primary: {
        bg: 'bg-cybergold-600',
        text: 'text-cyberdark-950',
        hover: 'hover:bg-cybergold-500',
      },
      secondary: {
        bg: 'bg-cyberdark-800',
        text: 'text-cybergold-400',
        hover: 'hover:bg-cyberdark-700',
      },
      outline: {
        bg: 'bg-transparent',
        text: 'text-cybergold-400',
        border: 'border-cyberdark-700',
        hover: 'hover:bg-cyberdark-800',
      },
      ghost: {
        bg: 'bg-transparent',
        text: 'text-cybergold-400',
        hover: 'hover:bg-cyberdark-800',
      },
    },
    
    // Status colors
    status: {
      online: 'bg-green-500',
      away: 'bg-amber-500',
      busy: 'bg-red-500',
      offline: 'bg-gray-500',
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-amber-500',
      info: 'bg-cyberblue-500',
    },
  },
  
  // Standardiserte skyggeeffekter
  shadows: {
    sm: 'shadow-sm shadow-cybergold-900/20',
    md: 'shadow-md shadow-cybergold-900/20',
    lg: 'shadow-lg shadow-cybergold-900/20',
  },
  
  // Animation og transition standarder
  animation: {
    fast: 'transition-all duration-150 ease-in-out',
    normal: 'transition-all duration-300 ease-in-out',
    slow: 'transition-all duration-500 ease-in-out',
  }
};

// Helper for å kombinere flere temastiler
export const cx = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

// Funksjon for å hente button styles basert på variant
export const getButtonStyles = (
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary',
  size: 'sm' | 'md' | 'lg' = 'md'
) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md';
  
  const variantStyles = theme.colors.button[variant];
  
  const sizeStyles = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 text-lg',
  }[size];
  
  return cx(
    baseStyles,
    variantStyles.bg,
    variantStyles.text,
    variantStyles.hover,
    variantStyles.border || '',
    sizeStyles,
    theme.animation.fast
  );
};