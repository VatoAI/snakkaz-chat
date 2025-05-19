#!/usr/bin/env node

/**
 * DNS Management CLI for Snakkaz Chat
 * 
 * This script provides command line tools for managing DNS settings
 * for the Snakkaz Chat application, integrating with both Namecheap and Cloudflare.
 */

import readline from 'readline';
import { DnsManager } from './dnsManager.js';
import { isNamecheapConfigValid, getNamecheapConfig } from './namecheapConfig.js';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt for input with optional masking for sensitive data
function prompt(question, mask = false) {
  return new Promise((resolve) => {
    if (mask) {
      process.stdout.write(question);
      let input = '';
      
      const stdin = process.stdin;
      stdin.resume();
      stdin.setRawMode(true);
      stdin.on('data', function onData(char) {
        char = char.toString();
        
        // Ctrl+C
        if (char === '\u0003') {
          process.exit();
        }
        
        // Enter key
        if (char === '\r' || char === '\n') {
          stdin.setRawMode(false);
          stdin.removeListener('data', onData);
          process.stdout.write('\n');
          resolve(input);
          return;
        }
        
        // Backspace
        if (char === '\u0008' || char === '\u007F') {
          if (input.length > 0) {
            input = input.substring(0, input.length - 1);
            process.stdout.write('\b \b');
          }
          return;
        }
        
        // Add character to input
        input += char;
        process.stdout.write('*');
      });
    } else {
      rl.question(question, (answer) => {
        resolve(answer);
      });
    }
  });
}

// Display colored console output
function colorLog(message, type = 'info') {
  const colors = {
    success: '\x1b[32m', // Green
    error: '\x1b[31m',   // Red
    info: '\x1b[36m',    // Cyan
    warning: '\x1b[33m', // Yellow
    reset: '\x1b[0m'     // Reset
  };
  
  console.log(`${colors[type] || colors.info}${message}${colors.reset}`);
}

// Main function
async function main() {
  colorLog('Snakkaz Chat DNS Management CLI', 'info');
  colorLog('==============================\n', 'info');
  
  // Initialize DNS manager
  const dnsManager = new DnsManager(true); // Use production by default
  
  // Gather credentials
  colorLog('This tool helps manage DNS settings for snakkaz.com\n', 'info');
  
  let useProduction = true;
  const envChoice = await prompt('Use production environment? (y/n, default: y): ');
  if (envChoice.toLowerCase() === 'n') {
    useProduction = false;
  }
  
  colorLog(`Using ${useProduction ? 'PRODUCTION' : 'SANDBOX'} environment.`, 'info');
  
  // Check if config has API keys already
  const config = getNamecheapConfig(useProduction);
  let namecheapApiKey = config.apiKey;
  
  if (!namecheapApiKey) {
    colorLog('\nNo Namecheap API key found in configuration.', 'warning');
    namecheapApiKey = await prompt('Enter Namecheap API key: ', true);
  }
  
  colorLog('\nChecking Cloudflare configuration...', 'info');
  const cloudflareToken = await prompt('Enter Cloudflare API token: ', true);
  
  colorLog('\nInitializing DNS manager...', 'info');
  try {
    await dnsManager.initialize(namecheapApiKey, cloudflareToken);
    colorLog('DNS manager initialized successfully.', 'success');
  } catch (error) {
    colorLog(`Failed to initialize DNS manager: ${error.message}`, 'error');
    process.exit(1);
  }
  
  // Show menu
  await showMenu(dnsManager);
}

// Display menu and handle options
async function showMenu(dnsManager) {
  console.log('\n');
  colorLog('📋 MENU', 'info');
  colorLog('1. Check DNS health', 'info');
  colorLog('2. Auto-fix DNS issues', 'info');
  colorLog('3. Set Cloudflare nameservers in Namecheap', 'info');
  colorLog('4. Exit', 'info');
  console.log('\n');
  
  const choice = await prompt('Enter your choice (1-4): ');
  
  switch (choice) {
    case '1':
      await checkDnsHealth(dnsManager);
      break;
    case '2':
      await autofixDnsIssues(dnsManager);
      break;
    case '3':
      await setCloudflareNameservers(dnsManager);
      break;
    case '4':
      console.log('\nExiting...');
      rl.close();
      process.exit(0);
      break;
    default:
      colorLog('Invalid choice. Please try again.', 'error');
      await showMenu(dnsManager);
  }
}

// Check DNS health
async function checkDnsHealth(dnsManager) {
  colorLog('\nChecking DNS health...', 'info');
  
  try {
    const healthCheck = await dnsManager.performHealthCheck();
    
    console.log('\n');
    colorLog('=== DNS HEALTH CHECK RESULTS ===', 'info');
    
    // Overall status
    switch (healthCheck.status) {
      case 'healthy':
        colorLog('✅ DNS STATUS: HEALTHY', 'success');
        break;
      case 'issues':
        colorLog('⚠️ DNS STATUS: ISSUES DETECTED', 'warning');
        break;
      case 'critical':
        colorLog('❌ DNS STATUS: CRITICAL ISSUES', 'error');
        break;
    }
    
    console.log('\n');
    colorLog('NAMECHEAP CONFIGURATION:', 'info');
    colorLog(`Using Cloudflare nameservers: ${healthCheck.namecheap.usingCloudflareNameservers ? 'Yes ✅' : 'No ❌'}`, 
      healthCheck.namecheap.usingCloudflareNameservers ? 'success' : 'error');
    colorLog(`Current nameservers: ${healthCheck.namecheap.nameservers.join(', ')}`, 'info');
    
    console.log('\n');
    colorLog('CLOUDFLARE CONFIGURATION:', 'info');
    colorLog(`Zone active: ${healthCheck.cloudflare.zoneActive ? 'Yes ✅' : 'No ❌'}`, 
      healthCheck.cloudflare.zoneActive ? 'success' : 'error');
    colorLog(`www record exists: ${healthCheck.cloudflare.wwwRecordExists ? 'Yes ✅' : 'No ❌'}`, 
      healthCheck.cloudflare.wwwRecordExists ? 'success' : 'error');
    colorLog(`SSL configured: ${healthCheck.cloudflare.sslConfigured ? 'Yes ✅' : 'No ❌'}`, 
      healthCheck.cloudflare.sslConfigured ? 'success' : 'error');
    
    // Issues
    if (healthCheck.issues.length > 0) {
      console.log('\n');
      colorLog('ISSUES DETECTED:', 'warning');
      healthCheck.issues.forEach((issue, index) => {
        colorLog(`${index + 1}. ${issue}`, 'warning');
      });
    }
    
    // Recommendations
    if (healthCheck.recommendations.length > 0) {
      console.log('\n');
      colorLog('RECOMMENDATIONS:', 'info');
      healthCheck.recommendations.forEach((rec, index) => {
        colorLog(`${index + 1}. ${rec}`, 'info');
      });
    }
    
  } catch (error) {
    colorLog(`Error checking DNS health: ${error.message}`, 'error');
  }
  
  console.log('\n');
  await prompt('Press Enter to continue...');
  await showMenu(dnsManager);
}

// Auto-fix DNS issues
async function autofixDnsIssues(dnsManager) {
  colorLog('\nAuto-fixing DNS issues...', 'info');
  
  try {
    const result = await dnsManager.autoFix();
    
    console.log('\n');
    if (result.success) {
      colorLog('✅ Auto-fix completed successfully!', 'success');
    } else {
      colorLog('⚠️ Auto-fix completed with some issues.', 'warning');
    }
    
    // Show fixes applied
    if (result.fixes.length > 0) {
      console.log('\n');
      colorLog('FIXES APPLIED:', 'success');
      result.fixes.forEach((fix, index) => {
        colorLog(`${index + 1}. ${fix}`, 'success');
      });
    }
    
    // Show failures
    if (result.failures.length > 0) {
      console.log('\n');
      colorLog('FAILURES:', 'error');
      result.failures.forEach((failure, index) => {
        colorLog(`${index + 1}. ${failure}`, 'error');
      });
    }
    
  } catch (error) {
    colorLog(`Error auto-fixing DNS issues: ${error.message}`, 'error');
  }
  
  console.log('\n');
  await prompt('Press Enter to continue...');
  await showMenu(dnsManager);
}

// Set Cloudflare nameservers in Namecheap
async function setCloudflareNameservers(dnsManager) {
  colorLog('\nSetting Cloudflare nameservers in Namecheap...', 'info');
  
  try {
    const result = await dnsManager['namecheapApi'].setCloudflareNameservers();
    
    if (result) {
      colorLog('✅ Successfully configured Namecheap to use Cloudflare nameservers.', 'success');
      colorLog('DNS changes may take up to 48 hours to propagate fully.', 'info');
    } else {
      colorLog('❌ Failed to configure Cloudflare nameservers.', 'error');
    }
  } catch (error) {
    colorLog(`Error setting Cloudflare nameservers: ${error.message}`, 'error');
  }
  
  console.log('\n');
  await prompt('Press Enter to continue...');
  await showMenu(dnsManager);
}

// Run the application
main().catch(error => {
  colorLog(`Fatal error: ${error.message}`, 'error');
  process.exit(1);
});
