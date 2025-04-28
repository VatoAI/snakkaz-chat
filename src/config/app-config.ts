// App Configuration
export const APP_CONFIG = {
    // Bruk miljøvariabel eller standard verdi
    DOMAIN: import.meta.env.VITE_APP_DOMAIN || 'snakkaz.com',
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    IS_DEVELOPMENT: import.meta.env.DEV || false,

    // Valider om vi er på riktig domene
    isCorrectDomain: () => {
        // Skip sjekk i utviklingsmodus
        if (import.meta.env.DEV) return true;

        const currentDomain = window.location.hostname;
        const configuredDomain = import.meta.env.VITE_APP_DOMAIN || 'snakkaz.com';

        // Sjekk om nåværende domene matcher konfigurert domene eller er en subdomain
        const isDomainMatch = currentDomain === configuredDomain ||
            currentDomain.endsWith(`.${configuredDomain}`);

        // Logg resultatet for feilsøking
        console.log(`Domain validation: Current=${currentDomain}, Configured=${configuredDomain}, Match=${isDomainMatch}`);

        return isDomainMatch;
    },

    // Sjekk om Supabase er konfigurert korrekt
    validateSupabaseConfig: () => {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        const isValid = Boolean(supabaseUrl && supabaseKey &&
            !supabaseUrl.includes('localhost') &&
            !supabaseKey.includes('placeholder'));

        if (!isValid) {
            console.error('Supabase configuration is incomplete or invalid');
        }

        return isValid;
    }
};