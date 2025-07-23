/**
 * Namecheap Migration Utility
 * 
 * This script completes the migration from Cloudflare to Namecheap
 * by importing DNS records to Namecheap from exported Cloudflare data.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { DOMParser } = require('xmldom');

// Check for required environment variables
const requiredVars = ['NAMECHEAP_API_USER', 'NAMECHEAP_API_KEY', 'NAMECHEAP_USERNAME', 'NAMECHEAP_CLIENT_IP'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Error: Required Namecheap environment variables not set.');
  console.error('Please set the following environment variables:');
  missingVars.forEach(varName => console.error(`- ${varName}`));
  process.exit(1);
}

// Configuration
const config = {
  apiUser: process.env.NAMECHEAP_API_USER,
  apiKey: process.env.NAMECHEAP_API_KEY,
  username: process.env.NAMECHEAP_USERNAME,
  clientIp: process.env.NAMECHEAP_CLIENT_IP,
  baseUrl: 'https://api.namecheap.com/xml.response',
  domains: ['snakkaz.com', 'dash.snakkaz.com', 'business.snakkaz.com', 'docs.snakkaz.com', 'analytics.snakkaz.com'],
  backupDir: path.join(__dirname, '..', '..', 'backup', 'dns')
};

// Helper function to make an API request to Namecheap
function makeNamecheapRequest(params) {
  return new Promise((resolve, reject) => {
    // Add common parameters
    const urlParams = new URLSearchParams({
      ApiUser: config.apiUser,
      ApiKey: config.apiKey,
      UserName: config.username,
      ClientIp: config.clientIp,
      ...params
    });
    
    const url = `${config.baseUrl}?${urlParams.toString()}`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          // Parse XML response
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, 'text/xml');
          
          // Check for errors
          const errorNodes = xmlDoc.getElementsByTagName('Error');
          if (errorNodes.length > 0) {
            const errorMessage = errorNodes[0].textContent;
            reject(new Error(`Namecheap API error: ${errorMessage}`));
            return;
          }
          
          resolve(xmlDoc);
        } catch (error) {
          reject(new Error(`Failed to parse Namecheap API response: ${error.message}`));
        }
      });
    }).on('error', (err) => {
      reject(new Error(`Namecheap API request failed: ${err.message}`));
    });
  });
}

// Parse domain to get SLD and TLD
function parseDomain(domain) {
  const parts = domain.split('.');
  const tld = parts.pop();
  const sld = parts.pop();
  const subdomain = parts.length > 0 ? parts.join('.') : '';
  
  return {
    sld,
    tld,
    subdomain
  };
}

// Convert Cloudflare DNS record to Namecheap format
function convertCloudflareRecordToNamecheap(record, domain) {
  const parsedDomain = parseDomain(domain);
  const { sld, tld, subdomain } = parsedDomain;
  
  // Extract record data from Cloudflare format
  const { type, name, content, ttl, priority } = record;
  
  // Determine the host value for Namecheap
  let host = '@';
  
  if (name !== domain && name !== `${domain}.`) {
    // It's a subdomain
    if (name.endsWith(domain)) {
      host = name.substring(0, name.length - domain.length - 1);
    } else {
      host = name;
    }
  }
  
  // Convert to Namecheap format
  return {
    SLD: sld,
    TLD: tld,
    HostName: host === '' ? '@' : host,
    RecordType: type,
    Address: content,
    TTL: ttl,
    MXPref: type === 'MX' ? (priority || 10) : undefined
  };
}

// Import Cloudflare DNS records to Namecheap
async function importRecordsToNamecheap(domain) {
  try {
    console.log(`🔄 Importing DNS records for ${domain} to Namecheap...`);
    
    // Parse domain components
    const { sld, tld } = parseDomain(domain);
    
    // Check for exported Cloudflare records
    const recordsPath = path.join(config.backupDir, `${domain}-records.json`);
    
    if (!fs.existsSync(recordsPath)) {
      console.log(`⚠️ No exported records found for ${domain}, skipping import`);
      return;
    }
    
    // Read and parse the exported records
    const recordsData = JSON.parse(fs.readFileSync(recordsPath, 'utf8'));
    
    if (!recordsData.result || !Array.isArray(recordsData.result)) {
      console.log(`⚠️ Invalid or empty records file for ${domain}, skipping import`);
      return;
    }
    
    // Convert Cloudflare records to Namecheap format
    const namecheapRecords = recordsData.result.map(record => 
      convertCloudflareRecordToNamecheap(record, domain)
    );
    
    if (namecheapRecords.length === 0) {
      console.log(`⚠️ No valid records found for ${domain}, skipping import`);
      return;
    }
    
    // Build parameters for Namecheap API
    const params = {
      Command: 'namecheap.domains.dns.setHosts',
      SLD: sld,
      TLD: tld
    };
    
    // Add records to params
    namecheapRecords.forEach((record, index) => {
      params[`HostName${index + 1}`] = record.HostName;
      params[`RecordType${index + 1}`] = record.RecordType;
      params[`Address${index + 1}`] = record.Address;
      params[`TTL${index + 1}`] = record.TTL;
      
      if (record.RecordType === 'MX') {
        params[`MXPref${index + 1}`] = record.MXPref;
      }
    });
    
    // Make API request
    const response = await makeNamecheapRequest(params);
    
    // Check for success
    const resultElement = response.getElementsByTagName('CommandResponse')[0];
    const isSuccess = resultElement && resultElement.getAttribute('Success') === 'true';
    
    if (isSuccess) {
      console.log(`✅ Successfully imported ${namecheapRecords.length} DNS records for ${domain} to Namecheap`);
    } else {
      console.error(`❌ Failed to import DNS records for ${domain} to Namecheap`);
    }
  } catch (error) {
    console.error(`❌ Error importing DNS records for ${domain} to Namecheap:`, error.message);
  }
}

// Main function
async function main() {
  console.log('🚀 Starting DNS record import to Namecheap...');
  
  // Create backup directory if it doesn't exist
  if (!fs.existsSync(config.backupDir)) {
    fs.mkdirSync(config.backupDir, { recursive: true });
  }
  
  // Process each domain
  for (const domain of config.domains) {
    await importRecordsToNamecheap(domain);
  }
  
  console.log('✅ DNS record import completed!');
  console.log('🔔 Remember to update your nameservers to point to Namecheap instead of Cloudflare.');
}

// Run the main function
main().catch(error => {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
});
