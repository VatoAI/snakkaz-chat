/**
 * Test-Fixes - Script for å teste at Snakkaz Chat fiksene fungerer
 * 
 * Dette scriptet kjører diagnostiske tester på alle fiksene vi har implementert,
 * inklusive CSP, CORS, og Cloudflare Analytics.
 */

import { applyAllCspFixes } from './cspFixes';
import { runSystemHealthCheck } from './systemHealthCheck';

/**
 * Kjører alle diagnostiske tester og returnerer resultater
 */
export async function runAllTests() {
  console.log('🚀 Kjører Snakkaz Chat diagnostiske tester...');
  console.log('----------------------------------------');

  try {
    // Kjør CSP-fikser først
    console.log('1️⃣ Applying CSP fixes...');
    applyAllCspFixes();
    console.log('✅ CSP fixes applied successfully');
    
    // Kjør systemhelsekontroll
    console.log('\n2️⃣ Running system health check...');
    const healthResults = await runSystemHealthCheck();
    
    console.log('\n📊 Test Results:');
    console.log('----------------------------------------');
    console.log(`Overall System Health: ${healthResults.healthy ? '✅ HEALTHY' : '❌ ISSUES DETECTED'}`);
    
    // Vis detaljerte resultater
    const details = healthResults.details;
    console.log('\n📋 Detailed Results:');
    console.log(`- CSP Configuration: ${details.csp ? '✅ OK' : '❌ ISSUES'}`);
    console.log(`- SRI Hash Checks: ${details.sri ? '✅ OK' : '❌ ISSUES'}`);
    console.log(`- Ping Request Handling: ${details.pingBlocking ? '✅ OK' : '❌ ISSUES'}`);
    console.log(`- Meta Tags: ${details.metaTags ? '✅ OK' : '❌ ISSUES'}`);
    console.log(`- Cloudflare Analytics: ${details.cloudflareAnalytics ? '✅ OK' : '❌ ISSUES'}`);
    console.log(`- Cloudflare DNS: ${details.cloudflareDns ? '✅ OK' : '❌ ISSUES'}`);
    
    // Vis DNS-helsedetaljer
    console.log('\n🔍 DNS Health:');
    const dnsHealth = details.dnsHealth;
    console.log(`- Status: ${getStatusEmoji(dnsHealth.status)} ${dnsHealth.status.toUpperCase()}`);
    
    if (dnsHealth.issues.length > 0) {
      console.log('\n⚠️ Issues Detected:');
      dnsHealth.issues.forEach((issue, i) => {
        console.log(`  ${i+1}. ${issue}`);
      });
    }
    
    if (dnsHealth.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      dnsHealth.recommendations.forEach((rec, i) => {
        console.log(`  ${i+1}. ${rec}`);
      });
    }
    
    return {
      success: healthResults.healthy,
      results: healthResults
    };
  } catch (error) {
    console.error('❌ Error running tests:', error);
    return {
      success: false,
      error
    };
  }
}

// Hjelpefunksjon for å vise emoji basert på status
function getStatusEmoji(status: string): string {
  switch(status) {
    case 'healthy': return '✅';
    case 'issues': return '⚠️';
    case 'critical': return '🚨';
    default: return '❓';
  }
}

// Eksporter en funksjon som kan kjøres direkte fra browser console
if (typeof window !== 'undefined') {
  (window as any).runSnakkazTests = runAllTests;
  console.log('Snakkaz test utility loaded. Run tests with window.runSnakkazTests()');
}
