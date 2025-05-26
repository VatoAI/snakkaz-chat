/**
 * Namecheap API Test for Snakkaz Chat
 * 
 * Dette skriptet tester tilkoblingen til Namecheap API og verifiserer at 
 * API-nøkkelen og IP-whitelistingen fungerer korrekt.
 */

import { createNamecheapApi, getClientIp } from './namecheapApi';
import { namecheapConfig } from './namecheapConfig';

async function testNamecheapApiConnection() {
  try {
    console.log("Testing Namecheap API connection...");
    
    // Get client IP
    const clientIp = await getClientIp();
    console.log(`Current IP address: ${clientIp}`);
    
    // Create API instance
    const api = createNamecheapApi({
      ...namecheapConfig.sandbox,
      clientIp,
      useProduction: false,
    });
    
    // Get domain info as a test
    console.log(`Getting domain info for: ${namecheapConfig.domain}`);
    const domainInfo = await api.getDomainInfo(namecheapConfig.domain);
    
    console.log("API connection successful!");
    console.log("Domain info:", domainInfo);
    
    return true;
  } catch (error) {
    console.error("API connection failed:", error);
    
    // Give specific advice based on error
    if (error.message && error.message.includes("not whitelisted")) {
      console.error("\nERROR: Your IP address is not whitelisted.");
      console.error(`Make sure to add ${await getClientIp()} to your Namecheap API whitelist.`);
    } else if (error.message && error.message.includes("Invalid API key")) {
      console.error("\nERROR: Invalid API key.");
      console.error("Double-check your API key in namecheapConfig.ts");
    }
    
    return false;
  }
}

// Run the test
testNamecheapApiConnection()
  .then(success => {
    if (success) {
      console.log("\n✅ Namecheap API is properly configured!");
    } else {
      console.error("\n❌ Namecheap API configuration has issues.");
    }
  })
  .catch(err => {
    console.error("Test failed with error:", err);
  });
