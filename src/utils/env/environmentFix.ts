/**
 * Environment Variable Patch for Browser Compatibility
 * 
 * Dette skriptet sørger for at alle miljøvariabler fungerer korrekt
 * både i utviklingsmiljøet og i produksjon, uavhengig av om
 * koden kjører på server eller i nettleser.
 */

// Global shim for process.env for å hindre feil i nettleser
// Dette vil erstatte alle process.env kall med import.meta.env
if (typeof window !== 'undefined') {
  // @ts-ignore - Vi ignorerer TypeScript-advarsler her
  window.process = window.process || {
    env: {
      NODE_ENV: import.meta.env.MODE === 'production' ? 'production' : 'development',
      // Map alle VITE_ miljøvariabler til process.env.*
      ...Object.fromEntries(
        Object.entries(import.meta.env)
          .filter(([key]) => key.startsWith('VITE_'))
          .map(([key, value]) => [key.replace('VITE_', ''), value])
      )
    }
  };
  
  // Logg at patcher er aktivert i utviklingsmiljø
  if (import.meta.env.DEV) {
    console.log('Environment compatibility patch applied: process.env is now available');
  }
}

// Eksporter en utility funksjon for å få miljøvariabler
export function getEnvironmentVariable(name: string, fallback: string = ''): string {
  if (typeof window !== 'undefined' && 'process' in window) {
    // @ts-ignore - Vi ignorerer TypeScript-advarsler her
    return window.process.env[name] || import.meta.env['VITE_' + name] || fallback;
  }
  
  // Fallback til Vite's import.meta.env
  return import.meta.env['VITE_' + name] || fallback;
}

// Eksporter et objekt med alle miljøvariabler for enklere bruk
export const ENV = {
  NODE_ENV: import.meta.env.MODE === 'production' ? 'production' : 'development',
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  // Legg til flere miljøvariabler her ved behov
};
