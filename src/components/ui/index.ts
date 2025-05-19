/**
 * Index-fil for UI-komponenter
 * Forenkler imports ved å eksportere alle UI-komponenter fra ett sted
 * 
 * Now includes dynamic imports for better code splitting and performance
 */

// Re-eksporterer alle UI-komponenter for enklere import
export * from './accordion';
export * from './alert';
export * from './alert-dialog';
export * from './avatar';
export * from './badge';
export * from './button';
export * from './calendar';
export * from './card';
export * from './checkbox';
export * from './collapsible';
export * from './command';
export * from './dialog';
export * from './dropdown-menu';
export * from './form';
export * from './hover-card';
export * from './input';
export * from './label';
export * from './menubar';
export * from './navigation-menu';
export * from './popover';
export * from './progress';
export * from './radio-group';
export * from './scroll-area';
export * from './select';
export * from './separator';
export * from './sheet';
export * from './skeleton';
export * from './slider';
export * from './switch';
export * from './table';
export * from './tabs';
export * from './textarea';
export * from './toast';
export * from './toaster';
export * from './tooltip';
export * from './use-toast';

// Export dynamically loaded components
export * from './dynamic-ui';