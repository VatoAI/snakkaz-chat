/**
 * Deployment Verification Script for Snakkaz Chat
 * 
 * This script checks if the recent changes and fixes have been properly deployed
 * by making API requests to verify functionality and checking file timestamps.
 * 
 * Usage: node check-deployment.js
 */

const axios = require('axios');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to ask questions
function askQuestion(question) {
  return new Promise(resolve => {
    rl.question(question, answer => {
      resolve(answer);
    });
  });
}

// Function to verify that a file was updated
async function checkFileTimestamp(url) {
  try {
    const response = await axios.head(url);
    const lastModified = response.headers['last-modified'];
    
    if (lastModified) {
      const modifiedDate = new Date(lastModified);
      const now = new Date();
      const diffDays = Math.floor((now - modifiedDate) / (1000 * 60 * 60 * 24));
      
      console.log(`File: ${url}`);
      console.log(`Last Modified: ${lastModified}`);
      console.log(`Days since modification: ${diffDays}`);
      
      if (diffDays <= 1) {
        console.log('✅ File was recently updated (within last 24 hours)');
        return true;
      } else {
        console.log('❌ File was not recently updated');
        return false;
      }
    } else {
      console.log(`❌ Could not retrieve Last-Modified header for ${url}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error checking file timestamp for ${url}:`);
    console.log(error.message);
    return false;
  }
}

// Function to check if API endpoint is working
async function checkApiEndpoint(endpoint) {
  try {
    console.log(`Checking API endpoint: ${endpoint}`);
    const response = await axios.get(`https://www.snakkaz.com/api/${endpoint}`);
    
    if (response.status === 200) {
      console.log('✅ API endpoint is accessible');
      return true;
    } else {
      console.log(`❌ API endpoint returned status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Error accessing API endpoint:');
    console.log(error.message);
    return false;
  }
}

// Function to verify login to a premium account
async function verifyPremiumUserLogin(email, password) {
  try {
    console.log(`Attempting login as premium user: ${email}`);
    
    // This is a simplified example - in a real script, you'd use actual API endpoints
    const response = await axios.post('https://www.snakkaz.com/api/auth/login', {
      email,
      password
    });
    
    if (response.data.user && response.data.user.isPremium) {
      console.log('✅ Successfully logged in as premium user');
      return response.data.token;
    } else {
      console.log('❌ Login failed or account is not premium');
      return null;
    }
  } catch (error) {
    console.log('❌ Error during login:');
    console.log(error.message);
    return null;
  }
}

// Function to check USB wallet integration component
async function checkUsbIntegration(token) {
  try {
    console.log('Checking USB wallet integration component...');
    
    // This is a simplified example - in a real script, you'd use actual API endpoints
    const response = await axios.get('https://www.snakkaz.com/api/bitcoin/wallet/details', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (response.data.usbIntegrationEnabled) {
      console.log('✅ USB wallet integration is available');
      return true;
    } else {
      console.log('❌ USB wallet integration is not available');
      return false;
    }
  } catch (error) {
    console.log('❌ Error checking USB integration:');
    console.log(error.message);
    return false;
  }
}

// Main function
async function verifyDeployment() {
  console.log('=== Snakkaz Chat Deployment Verification ===\n');
  
  // Check that main files were updated
  console.log('\n=== Checking File Timestamps ===');
  await checkFileTimestamp('https://www.snakkaz.com/assets/index-[hash].js');
  await checkFileTimestamp('https://www.snakkaz.com/index.html');
  
  // Check API endpoints
  console.log('\n=== Checking API Endpoints ===');
  await checkApiEndpoint('health');
  await checkApiEndpoint('bitcoin/usb/version');
  
  // Verify premium user functionality
  console.log('\n=== Verifying Premium User Features ===');
  const email = await askQuestion('Enter premium user email: ');
  const password = await askQuestion('Enter password: ');
  
  const token = await verifyPremiumUserLogin(email, password);
  
  if (token) {
    await checkUsbIntegration(token);
  }
  
  console.log('\n=== Manual Verification Steps ===');
  console.log('1. Log in to www.snakkaz.com with a premium account');
  console.log('2. Navigate to the Bitcoin wallet section');
  console.log('3. Check the "Electrum & USB" tab');
  console.log('4. Verify that the USB wallet integration component is visible');
  
  console.log('\n=== Mail Server Verification ===');
  console.log('1. Try accessing webmail directly: https://premium123.web-hosting.com:2096/');
  console.log('2. Try accessing webmail via mail.snakkaz.com');
  console.log('3. If direct access works but mail.snakkaz.com doesn\'t, check DNS settings');
  
  rl.close();
}

// Run the verification
verifyDeployment().catch(error => {
  console.error('Script failed with error:', error);
  rl.close();
});
