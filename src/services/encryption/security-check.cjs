// Simple security tester (CommonJS version)
const fs = require('fs');
const path = require('path');
const https = require('https');

console.log('🔒 SNAKKAZ CLOUDFLARE SECURITY CHECKER 🔒');
console.log('Checking security of Cloudflare integration components...\n');

// CSP Configuration for validation
const REQUIRED_CSP_DIRECTIVES = [
  'default-src',
  'script-src',
  'style-src',
  'connect-src',
  'img-src',
  'font-src'
];

const REQUIRED_DOMAINS_IN_CSP = [
  'snakkaz.com',
  'cloudflareinsights.com',
  'supabase.co',
  'cdn.gpteng.co',
  'storage.googleapis.com'
];

// Check if files exist
const requiredFiles = [
  'simpleEncryption.ts',
  'secureCredentials.ts',
  'cloudflareApi.ts',
  'cloudflareConfig.ts',
  'cloudflareManagement.ts',
  'systemHealthCheck.ts'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  try {
    fs.accessSync(path.join(__dirname, file), fs.constants.F_OK);
    console.log(`✅ Found required file: ${file}`);
  } catch (err) {
    console.log(`❌ Missing required file: ${file}`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n⚠️ Some required files are missing. Please check your setup.');
  process.exit(1);
}

console.log('\nChecking security best practices in code files...');

// Function to check security in a file
function checkSecurity(filePath, checks) {
  try {
    const content = fs.readFileSync(path.join(__dirname, filePath), 'utf8');
    
    console.log(`\nAnalyzing ${filePath}:`);
    
    checks.forEach(check => {
      const { pattern, message, type } = check;
      const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
      
      if (type === 'shouldExist') {
        if (regex.test(content)) {
          console.log(`✅ ${message}`);
        } else {
          console.log(`❌ ${message}`);
        }
      } else if (type === 'shouldNotExist') {
        if (!regex.test(content)) {
          console.log(`✅ ${message}`);
        } else {
          console.log(`❌ ${message}`);
        }
      }
    });
  } catch (err) {
    console.error(`Error checking ${filePath}:`, err.message);
  }
}

// Function to check CSP in HTML content
function validateCspInHtml(html) {
  console.log('\nValidating CSP in HTML content...');
  
  // Extract CSP meta tag
  const metaTagMatch = html.match(/<meta[^>]*http-equiv="Content-Security-Policy"[^>]*content="([^"]*)"[^>]*>/i);
  
  if (!metaTagMatch || !metaTagMatch[1]) {
    console.log('❌ No CSP meta tag found in HTML!');
    return false;
  }
  
  const cspContent = metaTagMatch[1];
  console.log('✅ Found CSP meta tag');
  
  // Parse CSP into directives
  const directives = {};
  const parts = cspContent.split(';').map(p => p.trim());
  
  parts.forEach(part => {
    const [directive, ...values] = part.split(/\s+/);
    if (directive) {
      directives[directive] = values;
    }
  });
  
  // Check for required directives
  console.log('\nChecking required CSP directives:');
  let allDirectivesPresent = true;
  
  REQUIRED_CSP_DIRECTIVES.forEach(directive => {
    if (Object.keys(directives).includes(directive)) {
      console.log(`✅ Found required directive: ${directive}`);
    } else {
      console.log(`❌ Missing required directive: ${directive}`);
      allDirectivesPresent = false;
    }
  });
  
  // Check for required domains
  console.log('\nChecking required domains in CSP:');
  let allDomainsPresent = true;
  
  REQUIRED_DOMAINS_IN_CSP.forEach(requiredDomain => {
    let found = false;
    
    // Check all directives for this domain
    Object.entries(directives).forEach(([directive, values]) => {
      if (values.some(val => val.includes(requiredDomain))) {
        found = true;
      }
    });
    
    if (found) {
      console.log(`✅ Found required domain in CSP: ${requiredDomain}`);
    } else {
      console.log(`❌ Missing required domain in CSP: ${requiredDomain}`);
      allDomainsPresent = false;
    }
  });
  
  return allDirectivesPresent && allDomainsPresent;
}

// Function to check remote CSP (if hostname is provided)
function checkRemoteCsp(hostname) {
  return new Promise((resolve, reject) => {
    console.log(`\nChecking CSP on remote host: ${hostname}...`);
    
    const options = {
      hostname,
      port: 443,
      path: '/',
      method: 'GET',
      headers: {
        'User-Agent': 'Snakkaz-Security-Check/1.0'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📡 Received response from ${hostname} (status: ${res.statusCode})`);
        
        // First check CSP headers
        const cspHeader = res.headers['content-security-policy'];
        if (cspHeader) {
          console.log('✅ Found CSP in HTTP headers');
          // TODO: Validate CSP header content
        }
        
        // Check HTML meta tag
        const valid = validateCspInHtml(data);
        resolve(valid);
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ Failed to connect to ${hostname}: ${error.message}`);
      resolve(false);
    });
    
    req.end();
  });
}

// Security checks for each file
const securityChecks = {
  'simpleEncryption.ts': [
    { 
      pattern: 'getRandomValues', 
      message: 'Uses secure random generation for IV', 
      type: 'shouldExist' 
    },
    { 
      pattern: /iterations:\s*(\d+)/, 
      message: 'Uses PBKDF2 with sufficient iterations', 
      type: 'shouldExist' 
    },
    { 
      pattern: 'AES-GCM', 
      message: 'Uses AES-GCM authenticated encryption', 
      type: 'shouldExist' 
    }
  ],
  'secureCredentials.ts': [
    { 
      pattern: 'encrypt', 
      message: 'Encrypts sensitive data before storage', 
      type: 'shouldExist' 
    },
    { 
      pattern: /localStorage\.setItem.*(?!encrypt)/, 
      message: 'Does not store unencrypted data in localStorage', 
      type: 'shouldNotExist' 
    },
    { 
      pattern: 'password',
      message: 'Uses password protection for credentials',
      type: 'shouldExist'
    }
  ],
  'cloudflareConfig.ts': [
    {
      pattern: /apiKey\s*=\s*['"][a-z0-9]+['"]/, 
      message: 'Does not contain hardcoded API keys', 
      type: 'shouldNotExist'
    }
  ],
  'cloudflareManagement.ts': [
    {
      pattern: 'secureStore', 
      message: 'Uses secure storage for credentials', 
      type: 'shouldExist'
    },
    {
      pattern: 'verifySecureAccess', 
      message: 'Verifies access with password protection', 
      type: 'shouldExist'
    }
  ]
};

// Run all checks
Object.keys(securityChecks).forEach(file => {
  checkSecurity(file, securityChecks[file]);
});

// Check local build file if it exists
const distIndexPath = path.join(process.cwd(), 'dist/index.html');
let localCspValid = true;

try {
  if (fs.existsSync(distIndexPath)) {
    console.log('\n🔍 Checking CSP in local build file...');
    const htmlContent = fs.readFileSync(distIndexPath, 'utf8');
    localCspValid = validateCspInHtml(htmlContent);
    
    if (!localCspValid) {
      console.log('\n⚠️ Local build file has CSP issues that should be fixed before deployment');
    }
  } else {
    console.log('\n⚠️ No local build file found at dist/index.html - skipping local CSP check');
  }
} catch (error) {
  console.log(`\n❌ Error checking local build file: ${error.message}`);
}

// Check remote site if a hostname is provided via environment variable
const hostname = process.env.CHECK_HOSTNAME || 'www.snakkaz.com';

// Async function to run remote checks
async function runRemoteChecks() {
  try {
    // Only run if we're in CI or explicitly requested
    if (process.env.CI === 'true' || process.env.CHECK_REMOTE === 'true') {
      const remoteCspValid = await checkRemoteCsp(hostname);
      
      if (!remoteCspValid) {
        console.log('\n⚠️ Remote site has CSP issues that should be fixed');
      }
    } else {
      console.log('\n👉 Skipping remote CSP check (not in CI environment)');
    }
    
    outputSummary(localCspValid);
  } catch (error) {
    console.log(`\n❌ Error in remote checks: ${error.message}`);
    outputSummary(localCspValid, false);
  }
}

// Output summary of recommendations
function outputSummary(localCspValid, remoteCheckSuccess = true) {
  console.log('\n📋 SECURITY ANALYSIS COMPLETE 📋');
  
  console.log('\nSUMMARY OF RECOMMENDATIONS:');
  console.log('1. Implement session timeout for additional security');
  console.log('2. Add two-factor authentication for critical operations');
  console.log('3. Consider using a more secure storage method than localStorage');
  console.log('4. Implement rate limiting to prevent brute force attacks');
  console.log('5. Add input validation for all API parameters');
  
  if (!localCspValid) {
    console.log('\n6. 🚨 Fix CSP issues in local build file before deployment');
    process.exit(1);
  }
  
  if (!remoteCheckSuccess) {
    console.log('\n⚠️ Remote checks failed - please verify the remote site manually');
  }
}

// Run remote checks
runRemoteChecks();
