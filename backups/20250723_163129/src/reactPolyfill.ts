/**
 * React Polyfill - Enkel versjon - Juni 5, 2025
 * Dette sikrer at React og useState er tilgjengelig tidlig i lasterekkefølgen
 */

// Export dummy functions to ensure this module is used
export const ensureReactAvailable = (): void => {
  if (typeof window !== 'undefined' && !window.React) {
    console.warn('React not available - applying emergency polyfill');
    (window as any).React = {};
    
    if (!(window as any).React.useState) {
      (window as any).React.useState = function(initialState: unknown): [unknown, (value: unknown) => void] {
        return [initialState, function(value: unknown): void {}];
      };
    }
  }
};

// Kjør funksjonen umiddelbart
ensureReactAvailable();

// Gjør ingenting - kun for å sikre at denne filen blir importert
export default {};
