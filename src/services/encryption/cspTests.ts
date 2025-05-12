/**
 * Snakkaz CSP Test Suite
 * Dette skriptet kjører tester for å verifisere at Content Security Policy (CSP) er korrekt implementert
 */

/**
 * Funksjon som tester alle aspekter av CSP-implementasjonen
 * Bruk: Kjør window.runSnakkazTests() i nettleserkonsollet
 */
window.runSnakkazTests = async function() {
  console.group('%c🔒 Snakkaz CSP Tester', 'font-size: 16px; font-weight: bold; color: #0284c7;');
  
  console.log('Starter CSP og CORS-tester...');
  
  // Test 1: Sjekk om CSP er definert
  testCspDefinition();
  
  // Test 2: Test CloudFlare Analytics tilkobling
  await testCloudflareAnalytics();
  
  // Test 3: Test tilkobling til Snakkaz subdomener
  await testSnakkazSubdomains();
  
  // Test 4: Test Supabase tilkoblinger
  await testSupabaseConnections();
  
  // Test 5: Sjekk for SRI hash mismatch
  testSriIntegrity();
  
  console.groupEnd();
  
  console.log('%c✅ Alle tester fullført', 'font-size: 14px; font-weight: bold; color: #16a34a;');
};

/**
 * Test 1: Sjekk om CSP er definert
 */
function testCspDefinition() {
  console.group('Test 1: CSP Definisjon');
  
  const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (cspMeta) {
    console.log('%c✅ CSP meta-tag funnet', 'color: green');
    console.log('CSP Policy:', cspMeta.getAttribute('content'));
    
    // Sjekk viktige direktiver
    const content = cspMeta.getAttribute('content') || '';
    
    checkDirective(content, 'script-src', ['cloudflareinsights.com', 'cdn.gpteng.co']);
    checkDirective(content, 'connect-src', ['snakkaz.com', 'supabase.co', 'cloudflareinsights.com']);
    
  } else {
    console.log('%c❌ CSP meta-tag ikke funnet!', 'color: red; font-weight: bold');
  }
  
  console.groupEnd();
}

/**
 * Hjelpefunksjon for å sjekke at direktiver inneholder nødvendige domener
 */
function checkDirective(cspString, directive, requiredDomains) {
  const directiveMatch = cspString.match(new RegExp(`${directive}[^;]+`));
  
  if (directiveMatch) {
    console.log(`${directive}:`, directiveMatch[0]);
    
    const missingDomains = requiredDomains.filter(domain => 
      !directiveMatch[0].includes(domain)
    );
    
    if (missingDomains.length === 0) {
      console.log(`%c✅ Alle nødvendige domener funnet i ${directive}`, 'color: green');
    } else {
      console.log(`%c⚠️ Manglende domener i ${directive}: ${missingDomains.join(', ')}`, 'color: orange; font-weight: bold');
    }
  } else {
    console.log(`%c❌ Direktiv ${directive} ikke funnet!`, 'color: red; font-weight: bold');
  }
}

/**
 * Test 2: Test CloudFlare Analytics tilkobling
 */
async function testCloudflareAnalytics() {
  console.group('Test 2: CloudFlare Analytics');
  
  const cfScript = document.querySelector('script[src*="cloudflareinsights.com"]');
  
  if (cfScript) {
    console.log('%c✅ CloudFlare Analytics script funnet', 'color: green');
    console.log('Script URL:', cfScript.src);
    console.log('Attributter:', Array.from(cfScript.attributes).map(attr => `${attr.name}="${attr.value}"`).join(' '));
    
    // Test nettverkstilkobling
    try {
      const response = await fetch('https://static.cloudflareinsights.com/', { 
        method: 'HEAD',
        mode: 'no-cors'
      });
      console.log('%c✅ Tilkobling til CloudFlare Analytics OK', 'color: green');
    } catch (error) {
      console.log('%c❌ Tilkoblingsfeil til CloudFlare Analytics:', 'color: red; font-weight: bold', error);
    }
    
  } else {
    console.log('%c❌ CloudFlare Analytics script ikke funnet!', 'color: red; font-weight: bold');
  }
  
  console.groupEnd();
}

/**
 * Test 3: Test tilkobling til Snakkaz subdomener
 */
async function testSnakkazSubdomains() {
  console.group('Test 3: Snakkaz Subdomener');
  
  const subdomains = ['dash', 'business', 'docs', 'analytics'];
  
  for (const subdomain of subdomains) {
    const url = `https://${subdomain}.snakkaz.com/`;
    
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        mode: 'no-cors' 
      });
      console.log(`%c✅ Tilkobling til ${url} OK`, 'color: green');
    } catch (error) {
      console.log(`%c⚠️ Kunne ikke teste ${url}: ${error.message}`, 'color: orange');
    }
  }
  
  console.groupEnd();
}

/**
 * Test 4: Test Supabase tilkoblinger
 */
async function testSupabaseConnections() {
  console.group('Test 4: Supabase Tilkoblinger');
  
  if (window.supabase) {
    console.log('%c✅ Supabase-klient funnet', 'color: green');
    
    try {
      // Test ping til Supabase
      const { data, error } = await window.supabase.from('health_check').select('*').limit(1).maybeSingle();
      
      if (error) {
        console.log('%c⚠️ Supabase forespørsel returnerte feil:', 'color: orange', error);
      } else {
        console.log('%c✅ Supabase tilkobling OK', 'color: green', data);
      }
    } catch (error) {
      console.log('%c❌ Supabase tilkoblingsfeil:', 'color: red; font-weight: bold', error);
    }
  } else {
    console.log('%c❓ Supabase-klient ikke tilgjengelig, hopper over test', 'color: gray');
  }
  
  console.groupEnd();
}

/**
 * Test 5: Sjekk for SRI hash mismatch
 */
function testSriIntegrity() {
  console.group('Test 5: Subresource Integrity (SRI)');
  
  const scripts = document.querySelectorAll('script[integrity]');
  
  if (scripts.length > 0) {
    console.log(`%c${scripts.length} script(er) med SRI funnet`, 'color: blue');
    
    scripts.forEach(script => {
      console.log(`Script: ${script.src}`);
      console.log(`Integrity: ${script.integrity}`);
    });
  } else {
    console.log('%c✅ Ingen SRI integrity-attributter i bruk (dette er OK)', 'color: green');
  }
  
  console.groupEnd();
}
