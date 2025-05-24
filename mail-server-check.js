/**
 * Mail Server Diagnostics Script
 * 
 * This script tests various aspects of the mail server configuration:
 * 1. Connection to cPanel API
 * 2. IMAP connectivity
 * 3. Email account verification
 * 
 * Usage: node mail-server-check.js
 */

const axios = require('axios');
const { ImapFlow } = require('imapflow');
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

// Function to test cPanel API connection
async function testCpanelApi(username, apiToken, domain) {
  try {
    console.log(`\n=== Testing cPanel API Connection ===`);
    console.log(`URL: https://${domain}:2083/execute/Email/list_pops`);
    
    const response = await axios({
      method: 'get',
      url: `https://${domain}:2083/execute/Email/list_pops`,
      headers: {
        'Authorization': `cpanel ${username}:${apiToken}`
      }
    });
    
    if (response.status === 200) {
      console.log('✅ cPanel API connection successful');
      console.log(`Found ${response.data.data.length} email accounts`);
      return response.data.data;
    } else {
      console.log(`❌ cPanel API connection failed: ${response.status} ${response.statusText}`);
      return null;
    }
  } catch (error) {
    console.log('❌ cPanel API connection failed with error:');
    console.log(error.message);
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log('Response:', error.response.data);
    }
    return null;
  }
}

// Function to test IMAP connection
async function testImapConnection(email, password, domain) {
  try {
    console.log(`\n=== Testing IMAP Connection ===`);
    console.log(`IMAP Server: mail.${domain}`);
    console.log(`Username: ${email}`);
    
    // Create IMAP client
    const client = new ImapFlow({
      host: `mail.${domain}`,
      port: 993,
      secure: true,
      auth: {
        user: email,
        pass: password
      },
      logger: false
    });
    
    // Try to connect and list mailboxes
    await client.connect();
    console.log('✅ IMAP connection successful');
    
    // List mailboxes
    console.log('\nMailboxes:');
    const mailboxes = await client.list();
    mailboxes.forEach(mailbox => {
      console.log(` - ${mailbox.path}`);
    });
    
    // Close connection
    await client.logout();
    return true;
  } catch (error) {
    console.log('❌ IMAP connection failed with error:');
    console.log(error.message);
    return false;
  }
}

// Function to check Roundcube connectivity
async function testRoundcube(domain) {
  try {
    console.log(`\n=== Testing Roundcube Webmail ===`);
    console.log(`URL: https://mail.${domain}/`);
    
    const response = await axios.get(`https://mail.${domain}/`);
    
    if (response.status === 200) {
      console.log('✅ Roundcube webmail accessible');
      return true;
    } else {
      console.log(`❌ Roundcube webmail not accessible: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Roundcube webmail check failed with error:');
    console.log(error.message);
    return false;
  }
}

// Main function
async function runDiagnostics() {
  console.log('=== Mail Server Diagnostic Tool ===\n');
  
  // Get cPanel credentials
  const cpanelUsername = await askQuestion('Enter cPanel username: ');
  const cpanelApiToken = await askQuestion('Enter cPanel API token: ');
  const domain = await askQuestion('Enter domain (e.g., snakkaz.com): ');
  
  // Test cPanel API
  const emailAccounts = await testCpanelApi(cpanelUsername, cpanelApiToken, domain);
  
  if (emailAccounts && emailAccounts.length > 0) {
    console.log('\nAvailable email accounts:');
    emailAccounts.forEach((account, index) => {
      console.log(`${index + 1}. ${account.email} (${account.domain})`);
    });
    
    // Select an account to test IMAP
    const accountIndex = parseInt(await askQuestion('\nSelect an account to test IMAP connection (number): ')) - 1;
    
    if (accountIndex >= 0 && accountIndex < emailAccounts.length) {
      const selectedAccount = emailAccounts[accountIndex];
      const password = await askQuestion(`Enter password for ${selectedAccount.email}: `);
      
      // Test IMAP connection
      await testImapConnection(selectedAccount.email, password, domain);
    }
    
    // Test Roundcube webmail
    await testRoundcube(domain);
    
    console.log('\n=== Recommendations ===');
    console.log('1. Check that mail.snakkaz.com is correctly configured in DNS');
    console.log('2. Verify that IMAP service is enabled in cPanel');
    console.log('3. Confirm that email account passwords are correct');
    console.log('4. Test if direct access to webmail works at https://premium123.web-hosting.com:2096/');
  }
  
  rl.close();
}

// Run the diagnostics
runDiagnostics().catch(error => {
  console.error('Script failed with error:', error);
  rl.close();
});
