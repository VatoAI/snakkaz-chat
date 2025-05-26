/**
 * Namecheap API Test for Snakkaz Chat
 * 
 * Dette skriptet tester tilkoblingen til Namecheap API og verifiserer at 
 * API-nøkkelen og IP-whitelistingen fungerer korrekt.
 */

const { getClientIp } = require('./namecheapApi');
const { namecheapConfig } = require('./namecheapConfig');
const axios = require('axios');

async function testNamecheapApiConnection() {
  try {
    console.log("Testing Namecheap API connection...");
    
    // Get client IP
    const clientIp = await getClientIp();
    console.log(`Current IP address: ${clientIp}`);
    
    // Prepare API call parameters
    const apiUser = namecheapConfig.sandbox.apiUser;
    const apiKey = namecheapConfig.sandbox.apiKey;
    const username = namecheapConfig.sandbox.username;
    const domain = namecheapConfig.domain;
    const apiUrl = namecheapConfig.sandbox.apiUrl;
    
    // Construct API call URL
    const url = `${apiUrl}?ApiUser=${apiUser}&ApiKey=${apiKey}&UserName=${username}&ClientIp=${clientIp}&Command=namecheap.domains.getInfo&DomainName=${domain}`;
    
    console.log("Making API call...");
    const response = await axios.get(url);
    
    if (response.data && response.data.includes("OK")) {
      console.log("API connection successful!");
      return true;
    } else {
      console.error("API response indicates error:", response.data);
      return false;
    }
  } catch (error) {
    console.error("API connection failed:", error.message);
    
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
