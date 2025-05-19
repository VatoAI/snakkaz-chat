// Midlertidig ytelsesanalyse
export function startPerformanceTracking() {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('🔍 Ytelsesanalyse startet');
    
    // Spore komponentrenderinger
    const originalConsoleWarn = console.warn;
    console.warn = function(...args) {
      if (args[0] && typeof args[0] === 'string' && args[0].includes('was not wrapped in act')) {
        // Ignorer React testing warnings
        return;
      }
      originalConsoleWarn.apply(console, args);
    };
    
    // Observer for å spore DOM-endringer
    const observer = new MutationObserver((mutations) => {
      console.log(`🔄 DOM-oppdatering: ${mutations.length} endringer`);
    });
    
    setTimeout(() => {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }, 1000);
    
    // Spor nettverkskall
    if (window.fetch) {
      const originalFetch = window.fetch;
      window.fetch = function(...args) {
        const startTime = performance.now();
        console.log(`🌐 Fetch-kall startet: ${args[0]}`);
        
        return originalFetch.apply(window, args).then(response => {
          const endTime = performance.now();
          console.log(`✅ Fetch-kall fullført: ${args[0]} (${(endTime - startTime).toFixed(2)}ms)`);
          return response;
        }).catch(error => {
          const endTime = performance.now();
          console.log(`❌ Fetch-kall feilet: ${args[0]} (${(endTime - startTime).toFixed(2)}ms)`);
          throw error;
        });
      };
    }
    
    // Spor sideytelse
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const domReadyTime = perfData.domComplete - perfData.domLoading;
        
        console.log(`📊 Sideytelse:
- Total lastetid: ${pageLoadTime}ms
- DOM-byggetid: ${domReadyTime}ms
- Backend (server respons): ${perfData.responseEnd - perfData.requestStart}ms
- Frontendparsing: ${perfData.domInteractive - perfData.responseEnd}ms`);
      }, 0);
    });
  }
}
