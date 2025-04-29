/**
 * Secure Supabase Client med sertifikat-pinning
 * 
 * Denne klienten beskytter mot man-in-the-middle angrep ved å bekrefte at
 * serveren har det korrekte sertifikatet.
 */

import { createClient } from '@supabase/supabase-js';
import { supabasePinnedFetch } from '@/utils/security/network/certificate-pinning';
import { toast } from '@/components/ui/use-toast';

// Hent miljøvariabler
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Oppsett av sikre globale opsjoner
const secureOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
  global: {
    fetch: supabasePinnedFetch,
    headers: {
      'X-Client-Info': 'snakkaz-secure-client',
    }
  },
  // Ekstra sikkerhetsinnstillinger
  realtime: {
    params: {
      eventsPerSecond: 10, // Forebygger DoS-angrep
    }
  }
};

// Opprett den sikre klienten
export const secureSupabase = createClient(supabaseUrl, supabaseAnonKey, secureOptions);

// Sikker autentisering med ekstra validering
export async function secureSignIn(email: string, password: string) {
  try {
    // Sjekk for tegn på forsøk på SQL-injeksjon eller XSS
    if (containsSuspiciousContent(email) || containsSuspiciousContent(password)) {
      throw new Error('Potensielt skadelig innhold oppdaget i innloggingsinformasjonen');
    }
    
    // Utfør innlogging med rate-limiting (forhindrer brute-force)
    const { data, error } = await secureSupabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    // Logger feil sikkert (uten å lekke sensitiv informasjon)
    console.error('Secure sign-in error:', error.message);
    // Viser generisk feilmelding til brukeren for å unngå data-lekkasje
    toast({
      title: 'Innloggingsfeil',
      description: 'Kunne ikke logge inn. Vennligst sjekk innloggingsinformasjonen og prøv igjen.',
      variant: 'destructive'
    });
    throw error;
  }
}

// Sikker utlogging
export async function secureSignOut() {
  try {
    const { error } = await secureSupabase.auth.signOut();
    if (error) throw error;
    
    // Fjern eventuelle lokalt lagrede tokens eller sensitiv data
    localStorage.removeItem('supabase-auth-token');
    sessionStorage.removeItem('supabase-auth-token');
    
    return true;
  } catch (error) {
    console.error('Secure sign-out error:', error);
    return false;
  }
}

// Hjelpefunksjon for å oppdage potensielt skadelig innhold
function containsSuspiciousContent(input: string): boolean {
  // Sjekk for SQL-injeksjon forsøk
  const sqlInjectionPatterns = [
    /'\s*OR\s*['"]?[0-9a-zA-Z]+=\s*['"]?[0-9a-zA-Z]+/i,  // ' OR '1'='1
    /;\s*DROP\s+TABLE/i,                                 // ; DROP TABLE
    /UNION\s+SELECT/i,                                   // UNION SELECT
  ];
  
  // Sjekk for XSS-forsøk
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/i, // <script> tags
    /javascript\s*:/i,                                     // javascript:
    /on\w+\s*=\s*["']/i                                    // onerror=", onclick=, etc.
  ];
  
  // Sjekk alle mønstre
  return [...sqlInjectionPatterns, ...xssPatterns].some(pattern => pattern.test(input));
}