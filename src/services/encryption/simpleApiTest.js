/**
 * Simple Namecheap API Test
 * 
 * Dette skriptet tester tilkoblingen til Namecheap API og verifiserer 
 * at API-nøkkelen og IP-whitelisting fungerer korrekt.
 */

// Import node-fetch versjon 2 
const fetch = require('node-fetch');

async function getClientIp() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error getting client IP:", error);
    return "127.0.0.1"; // Fallback
  }
}

async function testNamecheapApi() {
  try {
    // API credentials
    const apiUser = 'SnakkaZ';
    const apiKey = '43cb18d3efb341258414943ce1549db7';
    const username = 'SnakkaZ';
    const domain = 'snakkaz.com';
    
    // Get client IP
    const clientIp = await getClientIp();
    console.log(`Current IP address: ${clientIp}`);
    
    // API endpoint (sandbox)
    const apiUrl = 'https://api.sandbox.namecheap.com/xml.response';
    
    // Build request URL
    const url = `${apiUrl}?ApiUser=${apiUser}&ApiKey=${apiKey}&UserName=${username}&ClientIp=${clientIp}&Command=namecheap.domains.getInfo&DomainName=${domain}`;
    
    console.log("Making API request to URL:");
    console.log(url);
    
    try {
      const response = await fetch(url);
      console.log("Response status:", response.status);
      const text = await response.text();
    
    
      console.log("API Response:");
      console.log(text);
      
      if (text.includes("<Status>OK</Status>")) {
        console.log("\n✅ API connection successful!");
      } else if (text.includes("IP not whitelisted")) {
        console.error("\n❌ Your IP address is not whitelisted.");
        console.error(`Add ${clientIp} to the whitelist in Namecheap API settings.`);
        console.error("1. Log in to Namecheap account as 'SnakkaZ'");
        console.error("2. Go to Profile > Tools > API Access");
        console.error(`3. Click EDIT next to 'Whitelisted IPs' and add: ${clientIp}`);
      } else if (text.includes("Invalid ApiKey")) {
        console.error("\n❌ Invalid API key.");
        console.error("Double-check the API key in the code matches the one in Namecheap");
      } else {
        console.error("\n❌ Unknown API error. See response above.");
      }
    
  } catch (error) {
    console.error("Error testing API:", error.message);
    console.error("Make sure you've added the IP address to whitelist:");
    console.log(`IP address to whitelist: ${await getClientIp()}`);
    
    // Print troubleshooting guide
    console.log("\nTroubleshooting Guide:");
    console.log("1. Log in to Namecheap account as 'SnakkaZ'");
    console.log("2. Go to Profile > Tools > API Access");
    console.log(`3. Click EDIT next to 'Whitelisted IPs' and add: ${await getClientIp()}`);
    console.log("4. Click 'Done' to save changes");
    console.log("5. Run this test script again");
  }
}

testNamecheapApi();
