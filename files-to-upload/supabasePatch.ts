/**
 * Supabase Client Configuration Patch
 * 
 * Dette modulet gir korrigert konfigurasjon for Supabase-klienten
 * for å løse CORS og API-tilkoblingsproblemer.
 * 
 * OPPDATERT: Bruker nå singleton-mønsteret for å unngå flere GoTrueClient-instanser
 */

import { supabase as supabaseInstance } from '@/lib/supabaseClient';

// For konfigureringsdiagnostikk - bruk import.meta.env for konsistens
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const ENV_CHECK = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;

// Hjelper til å logge konfigurasjonsproblemer under utvikling
if (import.meta.env.DEV && !ENV_CHECK) {
  console.warn(
    'Supabase-konfigureringsproblem oppdaget! Sørg for at du har satt følgende miljøvariabler:\n' +
    '- VITE_SUPABASE_URL\n' + 
    '- VITE_SUPABASE_ANON_KEY\n\n' +
    'Legg disse til i .env-filen eller miljøvariablene dine.'
  );
}

// Eksporter singleton Supabase-klienten - ingen behov for å opprette en ny instans
export const supabaseClient = supabaseInstance;

// VIKTIG: Eksporter en funksjon som returnerer singleton for å unngå å ødelegge eksisterende kode
export const createSupabaseClient = () => {
  // Varsle om utdatert bruk i utviklingsmodus
  if (import.meta.env.DEV) {
    console.warn(
      'createSupabaseClient()-funksjonen er utdatert og vil bli fjernet i en fremtidig versjon.\n' +
      'Vennligst importer Supabase-klienten direkte fra @/lib/supabaseClient i stedet.'
    );
  }
  
  return supabaseInstance;
};

// Konfigureringsverifikasjonsfunksjon - nyttig for debugging
export const verifySupabaseConfig = () => {
  try {
    const isConfigValid = !!supabaseInstance && ENV_CHECK;
    
    if (import.meta.env.DEV) {
      console.log('Supabase-konfigurering verifikasjonsresultat:', isConfigValid ? 'Gyldig ✓' : 'Ugyldig ✗');
      
      if (!isConfigValid) {
        console.warn('Supabase-konfigurering er ufullstendig eller ugyldig. Sjekk miljøvariablene dine.');
      }
    }
    
    return isConfigValid;
  } catch (error) {
    console.error('Feil ved verifisering av Supabase-konfigurering:', error);
    return false;
  }
};

// Sikkerhetsforbedringsalternativer
export const getEnhancedSupabaseOptions = () => ({
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'snakkaz-chat',
      'Content-Type': 'application/json'
    }
  }
});

// Kall verifikasjon ved import for tidlig oppdagelse av problemer
verifySupabaseConfig();

// Eksporter et verktøy for å teste tilkoblingen
export const testConnection = async () => {
  try {
    const { error } = await supabaseInstance.from('profiles').select('*').limit(1);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Ukjent feil' };
  }
};

// Eksporter den konfigurerte klienten
export const supabase = supabaseInstance;
