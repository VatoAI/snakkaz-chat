/**
 * Unified Supabase Client - SINGLETON PATTERN
 * 
 * Dette er den sentrale kilden for Supabase-klienten.
 * Alle komponenter bør importere fra denne filen for å unngå flere instanser.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '@/config/environment';

// Bruk miljøkonfigurasjon eller fallback til direkte env-variabler
const supabaseUrl = environment.supabase.url || import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = environment.supabase.anonKey || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Valider konfigurasjonen
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Supabase-konfigurasjon mangler. Sjekk miljøvariablene eller config/environment.ts');
}

// Opprett en singleton-instans for å forhindre flere GoTrueClient-instanser
let supabaseInstance: SupabaseClient | null = null;

/**
 * Hent Supabase-klientinstansen (singleton-mønster)
 */
function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Opprett en ny instans kun hvis en ikke eksisterer
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      global: {
        headers: {
          'X-Client-Info': 'snakkaz-chat',
        },
      },
    });
    
    // Logg suksess i utviklingsmodus
    if (import.meta.env.DEV) {
      console.log('Supabase-klient initialisert (singleton)');
    }
    
    return supabaseInstance;
  } catch (error) {
    console.error('Feil ved opprettelse av Supabase-klient:', error);
    throw error;
  }
}

// Eksporter singleton-instansen
export const supabase = getSupabaseClient();

// Eksporter også som standard
export default supabase;
