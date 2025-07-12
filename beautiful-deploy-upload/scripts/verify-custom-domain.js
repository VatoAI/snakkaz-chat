// This script verifies if the custom domain is correctly configured with Supabase
import fetch from 'node-fetch';
import dns from 'dns';
import { promisify } from 'util';

const resolveCname = promisify(dns.resolveCname);
const lookup = promisify(dns.lookup);

const customDomain = 'www.snakkaz.com';
const projectId = 'wqpoozpbceucynsojmbk';

async function checkDnsSetup() {
  console.log('=== DNS VERIFICATION ===');
  try {
    // Check CNAME record for the main custom domain
    console.log(`Checking CNAME record for ${customDomain}...`);
    const cnameRecords = await resolveCname(customDomain);
    
    console.log('CNAME Records:', cnameRecords);
    
    if (cnameRecords.some(record => record.includes(`project-${projectId}.supabase.co`))) {
      console.log('✅ CNAME record for API endpoint is correctly configured');
    } else {
      console.log('❌ CNAME record does not point to the correct Supabase project');
      console.log(`Expected: project-${projectId}.supabase.co`);
    }
    
    // Check Cloudflare Custom Hostname verification
    console.log(`\nChecking CNAME record for _cf-custom-hostname.${customDomain}...`);
    try {
      const cfRecords = await resolveCname(`_cf-custom-hostname.${customDomain.replace(/^www\./, '')}`);
      console.log('CF Verification Records:', cfRecords);
      
      if (cfRecords.some(record => record.includes('_cf-custom-hostname-verification.supabase.co'))) {
        console.log('✅ Cloudflare verification CNAME record is correctly configured');
      } else {
        console.log('❌ Cloudflare verification CNAME record is not correctly configured');
      }
    } catch (error) {
      console.log('❌ Could not resolve Cloudflare verification record:', error.message);
    }
  } catch (error) {
    console.error('Error checking DNS setup:', error.message);
  }
}

async function checkApiEndpoint() {
  console.log('\n=== API ENDPOINT VERIFICATION ===');
  
  // Try accessing the standard Supabase endpoint
  console.log(`Testing standard Supabase endpoint: https://${projectId}.supabase.co/auth/v1/...`);
  try {
    const standardResponse = await fetch(`https://${projectId}.supabase.co/auth/v1/`);
    console.log(`Status: ${standardResponse.status}`);
    if (standardResponse.ok) {
      console.log('✅ Standard Supabase endpoint is accessible');
    } else {
      console.log('❌ Standard Supabase endpoint returned an error');
    }
  } catch (error) {
    console.error('Error accessing standard Supabase endpoint:', error.message);
  }
  
  // Try accessing the custom domain endpoint
  console.log(`\nTesting custom domain endpoint: https://${customDomain}/api/auth/v1/...`);
  try {
    const customResponse = await fetch(`https://${customDomain}/api/auth/v1/`);
    console.log(`Status: ${customResponse.status}`);
    if (customResponse.ok) {
      console.log('✅ Custom domain endpoint is accessible');
      console.log('✅ CUSTOM DOMAIN SETUP IS WORKING CORRECTLY!');
    } else {
      console.log('❌ Custom domain endpoint returned an error');
      console.log('This may mean the custom domain is not yet fully propagated or there is a configuration issue');
    }
  } catch (error) {
    console.error('Error accessing custom domain endpoint:', error.message);
    console.log('❌ Custom domain is not working yet. This could be due to:');
    console.log('   1. DNS propagation is still in progress (can take up to 48 hours)');
    console.log('   2. Custom domain is not properly configured in Supabase');
    console.log('   3. SSL certificate is still being provisioned');
    console.log('\nTry again in a few hours, or check your Supabase dashboard for custom domain status.');
  }
}

async function main() {
  console.log('========= CUSTOM DOMAIN VERIFICATION =========');
  console.log(`Testing custom domain: ${customDomain}`);
  console.log(`Supabase project ID: ${projectId}`);
  console.log('=============================================\n');
  
  await checkDnsSetup();
  await checkApiEndpoint();
}

main().catch(error => {
  console.error('Verification script error:', error);
});