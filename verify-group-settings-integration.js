#!/usr/bin/env node

/**
 * Verify Snakkaz Chat Group Settings Panel Integration
 * This script checks that the necessary components are properly
 * integrated and ready for deployment.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Starting verification of Group Settings Panel integration...\n');

// Check for necessary files
const requiredFiles = [
  'src/components/chat/groups/EnhancedGroupChat.tsx',
  'src/components/chat/groups/GroupSettingsPanel.tsx',
  'src/components/chat/groups/GroupChatHeader.tsx',
  'src/components/chat/groups/GroupPollSystem.tsx',
  'src/components/chat/groups/GroupFilesManager.tsx',
  'src/types/group.ts'
];

let allFilesExist = true;
console.log('Checking required files:');

requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.resolve(file));
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

if (!allFilesExist) {
  console.error('\n❌ Some required files are missing. Please check the file paths.');
  process.exit(1);
}

console.log('\n✅ All required files exist\n');

// Check Group type definition
const groupTypeContent = fs.readFileSync(path.resolve('src/types/group.ts'), 'utf8');
const requiredProperties = [
  'description',
  'allow_media_sharing',
  'allow_link_previews',
  'allow_member_invites',
  'is_private'
];

console.log('Checking Group interface for required properties:');
const missingProps = [];

requiredProperties.forEach(prop => {
  if (!groupTypeContent.includes(prop)) {
    console.log(`❌ Missing property: ${prop}`);
    missingProps.push(prop);
  } else {
    console.log(`✅ Property exists: ${prop}`);
  }
});

if (missingProps.length > 0) {
  console.error('\n❌ Group interface is missing required properties. Update src/types/group.ts');
  process.exit(1);
}

console.log('\n✅ Group interface has all required properties\n');

// Check GroupChatHeader integration
const headerContent = fs.readFileSync(path.resolve('src/components/chat/groups/GroupChatHeader.tsx'), 'utf8');
if (!headerContent.includes('onOpenSettings')) {
  console.error('❌ GroupChatHeader is missing onOpenSettings prop');
  process.exit(1);
}

if (!headerContent.includes('<Settings className="h-4 w-4" />')) {
  console.error('❌ GroupChatHeader is missing Settings icon');
  process.exit(1);
}

console.log('✅ GroupChatHeader has proper integration');

// Check React Hook dependency issues
console.log('\nChecking React Hook dependencies in components...');

try {
  // Try to build the TypeScript code
  console.log('Building project to check for TypeScript and React Hook errors...');
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✅ Build completed without errors\n');
} catch (error) {
  console.log('❌ Build failed with errors. Check the output above for details.\n');
  console.log(error.stdout.toString());
  process.exit(1);
}

console.log('\n✅ All verifications passed!');
console.log('\n🚀 Group Settings Panel integration is ready for deployment');
