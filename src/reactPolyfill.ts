/**
 * React Polyfill - Må importeres før alt annet
 * Dette sikrer at React og useState er tilgjengelig tidlig i lasterekkefølgen
 * 
 * Enhanced with self-healing capabilities - Juni 3, 2025
 */

// Import the improved React state fix with self-healing functionality
import './utils/reactStateFixV2';

// Export dummy functions to ensure this module is used
export const ensureReactAvailable = (): void => {
  if (typeof window !== 'undefined' && !window.React) {
    console.warn('React not available - applying emergency polyfill');
    window.React = {};
    
    if (!window.React.useState) {
      window.React.useState = function(initialState: unknown): [unknown, (value: unknown) => void] {
        return [initialState, function(value: unknown): void {}];
      };
    }
  }
};

// Kjør funksjonen umiddelbart
ensureReactAvailable();

// Gjør ingenting - kun for å sikre at denne filen blir importert
export default {};
