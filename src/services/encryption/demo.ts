// Script for å demonstrere sikkerhet og kryptering i Snakkaz Chat
// Kjør dette for å se hvordan løsningen fungerer

import { 
  setupSnakkazSecurity, 
  runFullDiagnostics,
  testGroupE2EE,
  testContentSecurityPolicy,
  testBrowserCompatibility
} from './index';

/**
 * Hoveddemonstrasjon som viser hvordan løsningen fungerer
 */
async function demonstrateSnakkazSecurity() {
  console.log('===============================================');
  console.log('SNAKKAZ CHAT SIKKERHETS DEMO');
  console.log('===============================================');
  
  // Steg 1: Initialiser sikkerhet
  console.log('\n--- STEG 1: Initialiserer sikkerhet ---');
  setupSnakkazSecurity();
  
  // Vent et øyeblikk for å la CSP bli anvendt
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Steg 2: Vis CSP konfigurasjon
  console.log('\n--- STEG 2: CSP Konfigurasjon ---');
  const cspResults = testContentSecurityPolicy();
  console.log(`CSP aktivert: ${cspResults.cspApplied ? 'Ja' : 'Nei'}`);
  console.log(`CSP validering: ${cspResults.success ? 'OK' : 'Problemer oppdaget'}`);
  
  // Steg 3: Kjør browser kompabilitetstest
  console.log('\n--- STEG 3: Browser Kompatibilitet ---');
  const browserResults = await testBrowserCompatibility();
  console.log('Støttet funksjonalitet:');
  browserResults.supportedFeatures.forEach(feature => console.log(`  ✓ ${feature}`));
  
  if (browserResults.unsupportedFeatures.length > 0) {
    console.log('Manglende funksjonalitet:');
    browserResults.unsupportedFeatures.forEach(feature => console.log(`  ✗ ${feature}`));
  }
  
  // Steg 4: Test E2EE
  console.log('\n--- STEG 4: Ende-til-Ende Kryptering Demo ---');
  try {
    const e2eeResults = await testGroupE2EE();
    console.log(`E2EE test: ${e2eeResults.success ? 'Bestått' : 'Feilet'}`);
    
    if (e2eeResults.success) {
      console.log('Testet kryptering og dekryptering av melding med gruppnøkkel');
      console.log(`Nøkkel-ID: ${e2eeResults.groupKeyId}`);
    }
  } catch (error) {
    console.error('E2EE test feilet:', error);
  }
  
  // Steg 5: Full diagnostikk
  console.log('\n--- STEG 5: Fullstendig Diagnostikk ---');
  console.log('Kjører fullstendig diagnostikk...');
  try {
    await runFullDiagnostics();
  } catch (error) {
    console.error('Diagnostikk feilet:', error);
  }
  
  console.log('\n===============================================');
  console.log('DEMO FULLFØRT');
  console.log('===============================================');
  console.log('For å teste løsningen ytterligere, prøv:');
  console.log('1. Åpne csp-test.html i nettleseren');
  console.log('2. Kjør testene gjennom brukergrensesnittet');
  console.log('3. Se på nettleserkonsoll for detaljerte resultater');
}

// Kjør demonstrasjonen hvis dette skriptet blir kjørt direkte
if (typeof window !== 'undefined' && window.location.href.includes('demo')) {
  demonstrateSnakkazSecurity();
}

export default demonstrateSnakkazSecurity;
