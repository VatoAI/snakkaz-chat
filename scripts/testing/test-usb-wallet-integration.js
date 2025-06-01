/**
 * Test script for USB wallet integration
 * This script performs a series of tests to verify the USB wallet integration
 * 
 * Usage: node test-usb-wallet-integration.js
 */

const axios = require('axios');
const readline = require('readline');
const { execSync } = require('child_process');

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

// Helper function for API requests
async function makeApiRequest(method, endpoint, data = null) {
  try {
    const url = `http://localhost:3000/api/bitcoin/usb/${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.TEST_AUTH_TOKEN}` 
    };
    
    let response;
    if (method.toLowerCase() === 'get') {
      response = await axios.get(url, { headers });
    } else {
      response = await axios.post(url, data, { headers });
    }
    
    return response.data;
  } catch (error) {
    console.error(`API request failed: ${error.message}`);
    if (error.response?.data) {
      console.error('Response data:', error.response.data);
    }
    return { success: false, error: error.message };
  }
}

// Run the test
async function runTest() {
  console.log('\n=== USB Wallet Integration Test ===\n');
  
  // Test 1: Start monitoring
  console.log('Test 1: Starting USB monitoring...');
  const userId = await askQuestion('Enter a test user ID: ');
  
  const startResult = await makeApiRequest('post', 'monitor', {
    userId,
    action: 'start'
  });
  
  console.log('Start monitoring result:', startResult);
  if (!startResult.success) {
    console.error('Failed to start monitoring. Aborting test.');
    return;
  }
  
  // Test 2: List connected devices
  console.log('\nTest 2: Listing connected USB devices...');
  console.log('Please connect a USB device now, then press Enter...');
  await askQuestion('');
  
  const devicesResult = await makeApiRequest('get', 'devices');
  console.log('Devices result:', devicesResult);
  
  if (!devicesResult.success || !devicesResult.devices || devicesResult.devices.length === 0) {
    console.error('No USB devices detected. Aborting test.');
    await makeApiRequest('post', 'monitor', { userId, action: 'stop' });
    return;
  }
  
  // Test 3: Prepare a device
  console.log('\nTest 3: Preparing a USB device...');
  const deviceId = devicesResult.devices[0].deviceId;
  console.log(`Selected device: ${deviceId}`);
  
  // Get wallet ID
  const walletId = await askQuestion('Enter a wallet ID: ');
  const password = await askQuestion('Enter a password for testing: ');
  const otpCode = await askQuestion('Enter a 2FA code for testing (use 123456 for dev): ');
  
  const prepareResult = await makeApiRequest('post', 'prepare', {
    userId,
    deviceId,
    password,
    otpCode,
    walletId
  });
  
  console.log('Prepare device result:', prepareResult);
  if (!prepareResult.success) {
    console.error('Failed to prepare device. Aborting test.');
    await makeApiRequest('post', 'monitor', { userId, action: 'stop' });
    return;
  }
  
  // Test 4: Launch Electrum transfer
  console.log('\nTest 4: Launching Electrum transfer...');
  const launchResult = await makeApiRequest('post', 'launch', {
    userId,
    deviceId,
    walletId
  });
  
  console.log('Launch result:', launchResult);
  if (!launchResult.success) {
    console.error('Failed to launch Electrum. Aborting test.');
    await makeApiRequest('post', 'monitor', { userId, action: 'stop' });
    return;
  }
  
  // Test 5: Check transfer status
  console.log('\nTest 5: Checking transfer status...');
  let isCompleted = false;
  let attempts = 0;
  
  while (!isCompleted && attempts < 10) {
    const statusResult = await makeApiRequest('get', `status/${deviceId}`);
    console.log(`Status check ${attempts + 1}:`, statusResult);
    
    if (statusResult.success && ['completed', 'failed', 'error'].includes(statusResult.status?.status)) {
      isCompleted = true;
    } else {
      attempts++;
      console.log('Waiting 2 seconds before next status check...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Test 6: Stop monitoring
  console.log('\nTest 6: Stopping USB monitoring...');
  const stopResult = await makeApiRequest('post', 'monitor', {
    userId,
    action: 'stop'
  });
  
  console.log('Stop monitoring result:', stopResult);
  
  console.log('\n=== Test Complete ===');
  console.log('Please check the console output to verify all tests passed successfully.');
  rl.close();
}

// Start the test
runTest().catch(error => {
  console.error('Test failed with error:', error);
  rl.close();
});
