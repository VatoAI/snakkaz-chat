import { createClient } from '@supabase/supabase-js';

// Hent miljøvariabler for Supabase-tilkobling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Sjekk om miljøvariablene er satt
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase miljøvariabler mangler. Sørg for at .env-filen er konfigurert riktig.');
}

// Opprett Supabase-klient
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export default supabase;