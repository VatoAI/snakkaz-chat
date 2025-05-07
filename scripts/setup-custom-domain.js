// This script helps set up a custom domain for your Supabase project
// Usage: node scripts/setup-custom-domain.js

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Load existing Supabase config
const supabaseConfigPath = path.join(__dirname, '../supabase/config.toml');
let projectId;

try {
  const configContent = fs.readFileSync(supabaseConfigPath, 'utf8');
  const projectIdMatch = configContent.match(/project_id\s*=\s*"([^"]+)"/);
  if (projectIdMatch) {
    projectId = projectIdMatch[1];
    console.log(`Detected Supabase project ID: ${projectId}`);
  } else {
    console.error('Could not find project_id in supabase/config.toml');
    process.exit(1);
  }
} catch (error) {
  console.error('Error reading Supabase config:', error.message);
  process.exit(1);
}

console.log('\nThis script will guide you through setting up a custom domain for your Supabase project.');
console.log('\n=== PREREQUISITES ===');
console.log('1. Make sure you have the Supabase CLI installed: npm install -g supabase');
console.log('2. You should be logged in to the Supabase CLI: supabase login');
console.log('3. You need to own the domain you want to use');
console.log('4. You must have already set up DNS management for your domain');

console.log('\n=== STEPS TO FOLLOW ===');

rl.question('\nEnter your custom domain (e.g., www.snakkaz.com): ', async (customDomain) => {
  if (!customDomain) {
    console.error('Custom domain is required');
    rl.close();
    return;
  }

  console.log(`\nSetting up custom domain: ${customDomain} for project: ${projectId}`);

  try {
    // Step 1: Configure custom domain in Supabase
    console.log('\nStep 1: Adding custom domain to your Supabase project...');
    console.log('This will return configuration values that you need to add to your DNS records.');
    
    console.log('\nRunning: supabase domains add ' + customDomain);
    console.log('\nFollow the instructions returned by the Supabase CLI:');
    console.log('1. Add the displayed CNAME records to your DNS provider');
    console.log('2. It may take up to 48 hours for DNS changes to propagate');
    
    // We print the command but don't execute it automatically 
    // because the user needs to see and handle the output
    console.log('\n=== MANUAL ACTION REQUIRED ===');
    console.log(`Run this command: supabase domains add ${customDomain} -p ${projectId}`);
    console.log('Then follow the instructions provided by the command output.\n');

    // Step 2: Checking domain status
    console.log('\nAfter adding DNS records, you can check the status with:');
    console.log(`supabase domains verify ${customDomain} -p ${projectId}`);

    // Step 3: Update project configuration
    console.log('\nStep 3: Updating project configuration...');
    
    // Create an environment config file if it doesn't exist
    const envConfigPath = path.join(__dirname, '../src/config/environment.ts');
    let envConfigContent;
    
    try {
      if (fs.existsSync(envConfigPath)) {
        envConfigContent = fs.readFileSync(envConfigPath, 'utf8');
      } else {
        // Create directory if it doesn't exist
        if (!fs.existsSync(path.join(__dirname, '../src/config'))) {
          fs.mkdirSync(path.join(__dirname, '../src/config'), { recursive: true });
        }
        
        envConfigContent = `// Environment configuration
export const environment = {
  production: import.meta.env.PROD || false,
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://${projectId}.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    // More environment variables can be added here
  },
};
`;
      }

      // Update/add custom domain info
      if (!envConfigContent.includes('customDomain')) {
        envConfigContent = envConfigContent.replace(
          'supabase: {',
          `supabase: {
    customDomain: '${customDomain}',`
        );
      } else {
        envConfigContent = envConfigContent.replace(
          /customDomain:.*,/,
          `customDomain: '${customDomain}',`
        );
      }

      fs.writeFileSync(envConfigPath, envConfigContent);
      console.log(`Updated environment configuration at ${envConfigPath}`);

      // Update Supabase client to use custom domain (if it exists)
      const supabaseClientPath = '/workspaces/snakkaz-chat/src/integrations/supabase/client.ts';
      if (fs.existsSync(supabaseClientPath)) {
        let clientContent = fs.readFileSync(supabaseClientPath, 'utf8');
        
        // Check if we need to update the Supabase client code
        if (!clientContent.includes('environment.supabase.customDomain')) {
          const importExists = clientContent.includes('import { environment }');
          
          if (!importExists) {
            clientContent = `import { environment } from '@/config/environment';\n${clientContent}`;
          }
          
          // Modify the Supabase URL to use custom domain when available
          clientContent = clientContent.replace(
            /const supabaseUrl\s*=\s*[^;]+/,
            `const supabaseUrl = environment.supabase.customDomain ? 
  \`https://\${environment.supabase.customDomain}/api\` : 
  (import.meta.env.VITE_SUPABASE_URL || 'https://${projectId}.supabase.co')`
          );
          
          fs.writeFileSync(supabaseClientPath, clientContent);
          console.log(`Updated Supabase client to use custom domain at ${supabaseClientPath}`);
        } else {
          console.log('Supabase client already configured to use custom domain');
        }
      }

    } catch (error) {
      console.error('Error updating project files:', error.message);
    }

    console.log('\n=== CUSTOM DOMAIN SETUP GUIDE ===');
    console.log('1. Add the CNAME records provided by Supabase CLI to your DNS provider');
    console.log('2. Wait for DNS propagation (may take up to 48 hours)');
    console.log(`3. Verify the domain with: supabase domains verify ${customDomain} -p ${projectId}`);
    console.log('4. Update your front-end code to use the custom domain URL');
    console.log('\nOnce verified, your Supabase API will be available at:');
    console.log(`https://${customDomain}/api`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    rl.close();
  }
});

rl.on('close', () => {
  console.log('\nCustom domain setup process completed!');
});