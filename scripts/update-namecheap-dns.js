/**
 * Script for å oppdatere DNS-oppføringer i Namecheap
 * 
 * Dette scriptet bruker Namecheap API for å legge til de manglende
 * CNAME-oppføringene og fjerne Cloudflare-spesifikke oppføringer.
 */

const https = require('https');
const { DOMParser } = require('xmldom');

// Sjekk om miljøvariabler er satt
const requiredEnvVars = ['NAMECHEAP_API_USER', 'NAMECHEAP_API_KEY', 'NAMECHEAP_USERNAME', 'NAMECHEAP_CLIENT_IP'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Feil: Manglende miljøvariabler:', missingEnvVars.join(', '));
  console.error('Sett disse variablene før du kjører scriptet.');
  process.exit(1);
}

// Namecheap API-konfigurasjon
const config = {
  apiUser: process.env.NAMECHEAP_API_USER,
  apiKey: process.env.NAMECHEAP_API_KEY,
  username: process.env.NAMECHEAP_USERNAME,
  clientIp: process.env.NAMECHEAP_CLIENT_IP,
  baseUrl: 'https://api.namecheap.com/xml.response',
  domain: 'snakkaz.com'
};

// DNS-oppføringer vi ønsker å ha
const desiredRecords = [
  // Beholde eksisterende A-oppføringer
  { Type: 'A', Host: '@', Address: '185.158.133.1', TTL: '300' },
  { Type: 'A', Host: 'mcp', Address: '185.158.133.1', TTL: '300' },
  
  // Beholde www CNAME for Supabase
  { Type: 'CNAME', Host: 'www', Address: 'project-wqpoozpbceucynsojmbk.supabase.co', TTL: '1800' },
  
  // Legg til manglende subdomener
  { Type: 'CNAME', Host: 'dash', Address: 'snakkaz.com', TTL: '1800' },
  { Type: 'CNAME', Host: 'business', Address: 'snakkaz.com', TTL: '1800' },
  { Type: 'CNAME', Host: 'docs', Address: 'snakkaz.com', TTL: '1800' },
  { Type: 'CNAME', Host: 'analytics', Address: 'snakkaz.com', TTL: '1800' },
  
  // Beholde TXT for SSL-sertifikat
  { Type: 'TXT', Host: '_acme-challenge', Address: '9_BtdmyAE5edIukfTcGeY32FhOZCJ4TThuHA1xN_MVM', TTL: '1800' }
];

// Funksjon for å lage Namecheap API-forespørsler
function makeNamecheapApiRequest(params) {
  return new Promise((resolve, reject) => {
    // Legg til felles parametere
    const queryParams = new URLSearchParams({
      ApiUser: config.apiUser,
      ApiKey: config.apiKey,
      UserName: config.username,
      ClientIp: config.clientIp,
      ...params
    });
    
    const url = `${config.baseUrl}?${queryParams.toString()}`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          // Parse XML-respons
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, 'text/xml');
          
          // Sjekk for feil
          const errorNodes = xmlDoc.getElementsByTagName('Error');
          if (errorNodes.length > 0) {
            const errorMessage = errorNodes[0].textContent;
            reject(new Error(`Namecheap API-feil: ${errorMessage}`));
            return;
          }
          
          resolve(xmlDoc);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Hovedfunksjon for å oppdatere DNS-oppføringer
async function updateDnsRecords() {
  try {
    console.log('Starter oppdatering av DNS-oppføringer for', config.domain);
    
    // Del opp domenet i SLD (second-level domain) og TLD (top-level domain)
    const domainParts = config.domain.split('.');
    const tld = domainParts.pop();
    const sld = domainParts.join('.');
    
    console.log(`SLD: ${sld}, TLD: ${tld}`);
    
    // Parametere for setHosts API-kall
    const params = {
      Command: 'namecheap.domains.dns.setHosts',
      SLD: sld,
      TLD: tld
    };
    
    // Legg til oppføringene
    desiredRecords.forEach((record, index) => {
      params[`HostName${index+1}`] = record.Host;
      params[`RecordType${index+1}`] = record.Type;
      params[`Address${index+1}`] = record.Address;
      params[`TTL${index+1}`] = record.TTL;
    });
    
    // Gjør API-kallet
    console.log('Sender DNS-oppdatering til Namecheap API...');
    const response = await makeNamecheapApiRequest(params);
    
    // Sjekk om oppføringene ble lagt til
    const resultElement = response.getElementsByTagName('CommandResponse')[0];
    const isSuccess = resultElement && resultElement.getAttribute('Success') === 'true';
    
    if (isSuccess) {
      console.log('✅ DNS-oppføringer ble oppdatert');
    } else {
      console.error('❌ Kunne ikke oppdatere DNS-oppføringer');
    }
    
    return isSuccess;
  } catch (error) {
    console.error('❌ Feil ved oppdatering av DNS-oppføringer:', error.message);
    return false;
  }
}

// Kjør scriptet
updateDnsRecords()
  .then(success => {
    if (success) {
      console.log('✅ DNS-migrering fullført. Det kan ta opptil 30 minutter før endringene spres.');
    } else {
      console.error('❌ DNS-migrering feilet. Se feilmeldinger ovenfor.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Uventet feil:', error.message);
    process.exit(1);
  });
