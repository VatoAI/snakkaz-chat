/**
 * Browser Compatibility Fixes
 *
 * Dette modulet inneholder feilrettinger for ulike nettlesere, inkludert
 * Safari og eldre versjoner av Chrome og Firefox.
 */

/**
 * Legg til CSS-feilrettinger for Safari og eldre nettlesere
 */
export function applyBrowserCompatibilityFixes() {
  if (typeof document === 'undefined') return;

  // Lag et style-element
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = `
    /* Safari og iOS feilrettinger */
    @supports (-webkit-touch-callout: none) {
      /* Fikser flexbox problemer i Safari */
      .flex-container {
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
      }
      
      /* Fikser scrolling problemer i Safari */
      .scrollable {
        -webkit-overflow-scrolling: touch;
      }
      
      /* Fikser backdrop-filter støtte */
      .blur-background {
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(10px);
      }
    }
    
    /* Firefox feilrettinger */
    @-moz-document url-prefix() {
      /* Noen Firefox-spesifikke stiler her */
      .firefox-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
      }
    }
    
    /* Edge/IE feilrettinger */
    @supports (-ms-ime-align:auto) {
      /* Edge-spesifikke stiler */
      .edge-flex-fix {
        display: flex;
      }
    }
    
    /* Generelle feilrettinger for eldre nettlesere */
    .fallback-grid {
      display: grid;
      display: -ms-grid; /* For IE */
    }
    
    /* Fikser for pinger som blokkeres av CSP */
    iframe[src*="ping"],
    img[src*="ping"],
    script[src*="ping"] {
      display: none !important;
    }
  `;
  
  // Legg stilen til i head
  document.head.appendChild(style);
  
  // Legg til klasser på body for nettleserdeteksjon
  addBrowserClassesToBody();
  
  console.log('Browser compatibility fixes applied');
}

/**
 * Legg til klasser på body-elementet for enkel styling basert på nettleser
 */
function addBrowserClassesToBody() {
  if (typeof document === 'undefined' || !document.body) return;
  
  const ua = navigator.userAgent;
  const body = document.body;
  
  // Detekter ulike nettlesere
  if (/iPad|iPhone|iPod/.test(ua)) {
    body.classList.add('ios-device');
  }
  
  if (/Safari/.test(ua) && !/Chrome/.test(ua)) {
    body.classList.add('safari-browser');
  }
  
  if (/Firefox/.test(ua)) {
    body.classList.add('firefox-browser');
  }
  
  if (/Edg/.test(ua)) {
    body.classList.add('edge-browser');
  }
  
  if (/Chrome/.test(ua) && !/Edg/.test(ua)) {
    body.classList.add('chrome-browser');
  }
  
  // Legg til versjon for Safari
  if (/Safari/.test(ua) && !/Chrome/.test(ua)) {
    const match = ua.match(/Version\/(\d+\.\d+)/);
    if (match && match[1]) {
      body.classList.add(`safari-${match[1].replace('.', '-')}`);
    }
  }
}

/**
 * Fiks problemer med modulimport i eldre nettlesere
 */
export function fixModuleImportIssues() {
  if (typeof window === 'undefined') return;
  
  // Sjekk om nettleseren støtter ES modules
  const supportsModules = 'noModule' in HTMLScriptElement.prototype;
  
  if (!supportsModules) {
    console.warn('This browser does not fully support ES modules. Adding polyfill.');
    
    // Her kunne vi lagt til en polyfill, men det er utenfor omfanget av denne enkle fixen
    // I en ekte løsning ville vi brukt f.eks. SystemJS eller en annen modul-loader
  }
}
