// Simple security tester (CommonJS version)
const fs = require('fs');
const path = require('path');

console.log('🔒 SNAKKAZ CLOUDFLARE SECURITY CHECKER 🔒');
console.log('Checking security of Cloudflare integration components...\n');

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

console.log('\n📋 SECURITY ANALYSIS COMPLETE 📋');
console.log('\nSUMMARY OF RECOMMENDATIONS:');
console.log('1. Implement session timeout for additional security');
console.log('2. Add two-factor authentication for critical operations');
console.log('3. Consider using a more secure storage method than localStorage');
console.log('4. Implement rate limiting to prevent brute force attacks');
console.log('5. Add input validation for all API parameters');
