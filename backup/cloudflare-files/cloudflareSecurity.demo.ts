/**
 * Snakkaz Chat - Cloudflare Security Demo
 * 
 * Dette skriptet demonstrerer hvordan de nye sikkerhetsfunksjonene i
 * Cloudflare-integrasjonen kan brukes for å sikre og overvåke
 * Snakkaz Chat-appen.
 */

// Import sikkerhetsfunksjoner
import { 
  checkCloudflareIntegration,
  testDnsPropagation
} from './cloudflareSecurityCheck';

import {
  enhancedEncrypt,
  enhancedDecrypt,
  setupSessionTimeout,
  checkSessionTimeout,
  resetSessionTimeout
} from './securityEnhancements';

import { CLOUDFLARE_CONFIG } from './cloudflareConfig';
import { CloudflareApi } from './cloudflareApi';

// Kjør gjennom alle sikkerhetsfunksjoner
async function demonstrerSikkerhetsfunksjoner() {
  console.log('🔒 SNAKKAZ CHAT SIKKERHETSDEMO 🔒');
  console.log('=================================');
  
  // Steg 1: Verifiser Cloudflare-integrasjon
  console.log('\n📡 STEG 1: Verifiserer Cloudflare-integrasjon...');
  const cfStatus = await checkCloudflareIntegration();
  
  if (cfStatus.success) {
    console.log('✅ Cloudflare-integrasjon verifisert!');
    console.log(`- Cloudflare Datacenter: ${cfStatus.details.colo || 'Ukjent'}`);
    console.log(`- SSL-versjon: ${cfStatus.details.ssl || 'Ukjent'}`);
    console.log(`- Security Level: ${cfStatus.details.securityLevel || 'Ukjent'}`);
    
    if (cfStatus.details.subdomains) {
      console.log('- Subdomene-status:');
      Object.entries(cfStatus.details.subdomains).forEach(([subdomain, status]) => {
        console.log(`  - ${subdomain}: ${status ? '✅ OK' : '❌ Ikke beskyttet'}`);
      });
    }
  } else {
    console.log('❌ Cloudflare-integrasjon ikke verifisert');
    console.log(`- Feil: ${cfStatus.details.error || 'Ukjent feil'}`);
    console.log(`- Anbefaling: ${cfStatus.details.recommendation || 'Sjekk konfigurasjonen'}`);
    
    // Sjekk DNS-propagering
    console.log('\nSjekker DNS-propagering...');
    const dnsPropagation = await testDnsPropagation();
    
    console.log(`DNS Propagering: ${dnsPropagation.propagated ? '✅ Fullført' : '⏳ Pågår'}`);
    console.log(`Nameservere: ${dnsPropagation.nameservers.join(', ')}`);
  }
  
  // Steg 2: Demo av sikker lagring
  console.log('\n🔑 STEG 2: Demo av sikker kryptering...');
  
  const sensitiveData = 'Dette er en sensitiv API-nøkkel: sk_test_123456789';
  const password = 'sikkert-passord-123';
  const customSalt = 'snakkaz-demo-salt';
  
  console.log('Krypterer sensitiv data med forbedret kryptering...');
  const encrypted = await enhancedEncrypt(sensitiveData, password, customSalt);
  console.log('Kryptert verdi:', encrypted);
  
  console.log('Dekrypterer med samme passord...');
  const decrypted = await enhancedDecrypt(encrypted, password, customSalt);
  console.log('Dekryptert verdi:', decrypted);
  console.log(`Verifisering: ${decrypted === sensitiveData ? '✅ Suksess' : '❌ Feil'}`);
  
  // Steg 3: Demo av sesjonssikkerhet
  console.log('\n⏱️ STEG 3: Demo av sesjonssikkerhet...');
  
  console.log('Setter opp sesjon med 5 sekunders timeout...');
  setupSessionTimeout(5000);
  console.log('Sesjon etablert. Status:', checkSessionTimeout() ? '✅ Aktiv' : '❌ Utgått');
  
  console.log('Venter 3 sekunder...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log('Sjekker status etter 3 sekunder:', checkSessionTimeout() ? '✅ Aktiv' : '❌ Utgått');
  
  console.log('Nullstiller sesjon...');
  resetSessionTimeout(5000);
  console.log('Sesjonsstatus etter nullstilling:', checkSessionTimeout() ? '✅ Aktiv' : '❌ Utgått');
  
  console.log('Venter 6 sekunder for timeout...');
  await new Promise(resolve => setTimeout(resolve, 6000));
  console.log('Sjekker status etter timeout:', checkSessionTimeout() ? '✅ Aktiv' : '❌ Utgått');
  
  // Steg 4: Demo av API-interaksjon med Cloudflare
  console.log('\n🌐 STEG 4: Demo av API-interaksjon med Cloudflare...');
  console.log('(Dette steget krever gyldige API-nøkler og vil bli simulert)');
  
  console.log(`Zone ID: ${CLOUDFLARE_CONFIG.zoneId}`);
  console.log(`Account ID: ${CLOUDFLARE_CONFIG.accountId}`);
  console.log(`Zone Name: ${CLOUDFLARE_CONFIG.zoneName}`);
  
  console.log('\nSimulerer cache-tømming...');
  console.log('Cache tømt: ✅ Suksess (simulert)');
  
  // Oppsummering
  console.log('\n✨ SIKKERHETSDEMO FULLFØRT ✨');
  console.log('Snakkaz Chat har følgende sikkerhetsfunksjoner implementert:');
  console.log('1. Cloudflare-beskyttelse og -integrering');
  console.log('2. Sikker kryptering av sensitive data');
  console.log('3. Sesjonshåndtering med automatisk timeout');
  console.log('4. API-sikkerhet og nøkkelhåndtering');
}

// Eksporter for å kjøre demonstrasjonen
export const runDemo = demonstrerSikkerhetsfunksjoner;

// Kjør automatisk hvis skriptet kjøres direkte
if (typeof window !== 'undefined' && window.location.search.includes('autorun=true')) {
  demonstrerSikkerhetsfunksjoner()
    .catch(error => console.error('Demo feilet:', error));
}
