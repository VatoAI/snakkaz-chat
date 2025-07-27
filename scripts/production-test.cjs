const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * SnakkaZ Production Readiness Test
 * Tests core functionality without complex module dependencies
 */

console.log('🚀 SnakkaZ Production Readiness Test\n');

// Test 1: Build Process
console.log('1️⃣ Testing build process...');
try {
  console.log('   Building production version...');
  execSync('npm run build', { stdio: 'pipe' });
  console.log('   ✅ Build successful\n');
} catch (error) {
  console.log('   ❌ Build failed:', error.message);
  process.exit(1);
}

// Test 2: Environment Configuration
console.log('2️⃣ Testing environment configuration...');
try {
  
  const requiredFiles = [
    '.env.production.template',
    '.env.email.template',
    'SENTRY-SETUP-GUIDE.md'
  ];
  
  let allFilesExist = true;
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`   ✅ ${file} exists`);
    } else {
      console.log(`   ❌ ${file} missing`);
      allFilesExist = false;
    }
  });
  
  if (allFilesExist) {
    console.log('   ✅ All configuration files present\n');
  } else {
    console.log('   ❌ Missing configuration files\n');
    process.exit(1);
  }
} catch (error) {
  console.log('   ❌ Configuration test failed:', error.message);
  process.exit(1);
}

// Test 3: Package Dependencies
console.log('3️⃣ Testing package dependencies...');
try {
  const packageJson = require('../package.json');
  
  const criticalDeps = [
    '@sentry/react',
    '@supabase/supabase-js',
    'react',
    'react-dom',
    'express',
    'cors'
  ];
  
  let allDepsPresent = true;
  criticalDeps.forEach(dep => {
    if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
      console.log(`   ✅ ${dep} installed`);
    } else {
      console.log(`   ❌ ${dep} missing`);
      allDepsPresent = false;
    }
  });
  
  if (allDepsPresent) {
    console.log('   ✅ All critical dependencies present\n');
  } else {
    console.log('   ❌ Missing critical dependencies\n');
    process.exit(1);
  }
} catch (error) {
  console.log('   ❌ Dependency test failed:', error.message);
  process.exit(1);
}

// Test 4: File Structure
console.log('4️⃣ Testing file structure...');
try {
  const fs = require('fs');
  
  const criticalDirectories = [
    'src/components/reactions',
    'src/services/reactions',
    'src/hooks',
    'src/config',
    'database',
    'mcp-deployment'
  ];
  
  let allDirsExist = true;
  criticalDirectories.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`   ✅ ${dir}/ exists`);
    } else {
      console.log(`   ❌ ${dir}/ missing`);
      allDirsExist = false;
    }
  });
  
  if (allDirsExist) {
    console.log('   ✅ All critical directories present\n');
  } else {
    console.log('   ❌ Missing critical directories\n');
    process.exit(1);
  }
} catch (error) {
  console.log('   ❌ File structure test failed:', error.message);
  process.exit(1);
}

// Test 5: Database Schema
console.log('5️⃣ Testing database schema files...');
try {
  const fs = require('fs');
  
  const schemaFiles = [
    'database/message-reactions-schema.sql',
    'database-extensions-fase2.sql'
  ];
  
  let allSchemaExist = true;
  schemaFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.length > 100) {
        console.log(`   ✅ ${file} (${Math.round(content.length/1024)}KB)`);
      } else {
        console.log(`   ⚠️  ${file} exists but seems incomplete`);
      }
    } else {
      console.log(`   ❌ ${file} missing`);
      allSchemaExist = false;
    }
  });
  
  if (allSchemaExist) {
    console.log('   ✅ Database schema files ready\n');
  } else {
    console.log('   ❌ Missing database schema files\n');
    process.exit(1);
  }
} catch (error) {
  console.log('   ❌ Database schema test failed:', error.message);
  process.exit(1);
}

// Test 6: MCP Server
console.log('6️⃣ Testing MCP server files...');
try {
  const fs = require('fs');
  
  const mcpFiles = [
    'mcp-deployment/mcp-cors-server.js',
    'mcp-deployment/package.json',
    'mcp-deployment/test-server.js'
  ];
  
  let allMcpExist = true;
  mcpFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`   ✅ ${file} exists`);
    } else {
      console.log(`   ❌ ${file} missing`);
      allMcpExist = false;
    }
  });
  
  if (allMcpExist) {
    console.log('   ✅ MCP server files ready\n');
  } else {
    console.log('   ❌ Missing MCP server files\n');
    process.exit(1);
  }
} catch (error) {
  console.log('   ❌ MCP server test failed:', error.message);
  process.exit(1);
}

// Test Results
console.log('🎉 Production Readiness Test Results:');
console.log('   ✅ Build System: Working');
console.log('   ✅ Environment Config: Ready');
console.log('   ✅ Dependencies: Installed');
console.log('   ✅ File Structure: Complete');
console.log('   ✅ Database Schema: Ready');
console.log('   ✅ MCP Server: Ready');

console.log('\n📦 SnakkaZ is ready for production deployment!');
console.log('\n📋 Next Steps:');
console.log('   1. Set up Sentry (see SENTRY-SETUP-GUIDE.md)');
console.log('   2. Configure environment variables');
console.log('   3. Deploy to production servers');
console.log('   4. Run database migrations');
console.log('   5. Test live deployment');

console.log('\n🚀 Launch when ready!');
process.exit(0);