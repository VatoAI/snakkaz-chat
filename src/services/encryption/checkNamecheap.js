/**
 * Namecheap API Test Script
 * 
 * This script tests connection to the Namecheap API and verifies that
 * IP whitelisting is configured correctly.
 */

const fetch = require('node-fetch');

// API credentials
const API_USER = 'SnakkaZ';
const API_KEY = '43cb18d3efb341258414943ce1549db7';
const USERNAME = 'SnakkaZ';
const DOMAIN = 'snakkaz.com';

async function getClientIp() {
  const response = await fetch('https://api.ipify.org?format=json');
  const data = await response.json();
  return data.ip;
}

async function testApi() {
  try {
    // Get client IP
    const clientIp = await getClientIp();
    console.log(`Current IP address: ${clientIp}`);
    
    // Build Namecheap API URL
    const apiUrl = `https://api.sandbox.namecheap.com/xml.response?ApiUser=${API_USER}&ApiKey=${API_KEY}&UserName=${USERNAME}&ClientIp=${clientIp}&Command=namecheap.domains.getinfo&DomainName=${DOMAIN}`;
    
    // Make the API request
    console.log('Testing Namecheap API connection...');
    const response = await fetch(apiUrl);
    const text = await response.text();
    
    console.log(`Response status code: ${response.status}`);
    console.log(`API response: \n${text}`);
    
    if (text.includes('API Key is invalid')) {
      console.log('\n❌ ERROR: API Key appears to be invalid or API access is not enabled');
      console.log('Please verify:');
      console.log('1. API Access is set to "ON" in Namecheap account');
      console.log('2. The API Key matches exactly: 43cb18d3efb341258414943ce1549db7');
    } else if (text.includes('IP not whitelisted')) {
      console.log('\n❌ ERROR: Your IP address is not whitelisted');
      console.log(`Current IP: ${clientIp}`);
      console.log('Add this IP to your Namecheap whitelist at Profile > Tools > API Access');
    } else if (text.includes('<Status>OK</Status>')) {
      console.log('\n✅ SUCCESS: API connection working properly!');
    } else {
      console.log('\n❓ UNKNOWN STATUS: Please check the full response above');
    }

    // Get list of whitelisted IPs (this doesn't actually work with Namecheap API,
    // but including as example of what we would want to check)
    console.log('\nChecking for whitelisted IPs in account...');
    console.log('Note: Namecheap API does not provide a direct way to check whitelisted IPs.');
    console.log('You need to manually check this in your Namecheap account:');
    console.log('1. Log in to Namecheap');
    console.log('2. Go to Profile > Tools > API Access');
    console.log('3. Look for "You\'ve whitelisted X IPs" and verify your IPs are added');
    
  } catch (error) {
    console.error('Error during API test:', error.message);
  }
}

testApi();
