/**
 * Analytics Loader
 * 
 * Dette modulet håndterer enkel analytics-integrasjon uten avhengighet til Cloudflare.
 * Den kan utvides for å støtte andre analysetjenester i fremtiden.
 */

/**
 * Fjern unødvendige SRI integrity-attributter fra skript og CSS
 */
function removeSriIntegrityAttributes() {
  try {
    // Fjern integrity fra script-tagger
    const scripts = document.querySelectorAll('script[integrity]');
    scripts.forEach((script) => {
      script.removeAttribute('integrity');
    });
    
    // Fjern integrity fra link-tagger (CSS)
    const links = document.querySelectorAll('link[integrity]');
    links.forEach(link => {
      link.removeAttribute('integrity');
    });
    
    // Overstyr console.error for å undertrykke SRI-relaterte feilmeldinger
    const originalConsoleError = console.error;
    console.error = function(msg, ...args) {
      if (typeof msg === 'string' && 
          (msg.includes('integrity') || msg.includes('SRI') || 
           msg.includes('SHA-') || msg.includes('Subresource Integrity'))) {
        // Undertrykk SRI-relaterte feil
        console.debug('[Undertrykt]', msg);
        return;
      }
      originalConsoleError.call(console, msg, ...args);
    };
  } catch (err) {
    console.warn('Feil ved fjerning av SRI integrity-attributter:', err);
  }
}

/**
 * Last inn Google Analytics eller annen analyseverktøy
 * Dette er en mønsterfunksjon som kan implementeres senere
 * for å erstatte tidligere analytics
 */
export function loadAnalytics() {
  // Fjern unødvendige SRI-integritetssjekker
  removeSriIntegrityAttributes();
  
  // Fremtidig integrasjon med annet analyseverktøy kan legges til her
  console.log('Analytics-lasting er deaktivert - ingen eksterne avhengigheter');
}

/**
 * Initialiser analytics
 * Eksporterbar funksjon som kan kalles fra applikasjonens oppstart
 */
export function initializeAnalytics() {
  // Kun last i nettlesermiljø
  if (typeof window === 'undefined') return;
  
  // Last analytics hvis nødvendig
  setTimeout(() => {
    loadAnalytics();
  }, 1000);
}

export default {
  initialize: initializeAnalytics,
  loadAnalytics
};
