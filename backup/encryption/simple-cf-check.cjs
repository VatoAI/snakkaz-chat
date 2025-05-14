// Simple Cloudflare check
const https = require('https');

console.log('Running Cloudflare integration check...');

// Function to make an HTTPS request
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (resp) => {
      let data = '';
      
      resp.on('data', (chunk) => {
        data += chunk;
      });
      
      resp.on('end', () => {
        resolve({
          statusCode: resp.statusCode,
          headers: resp.headers,
          data: data
        });
      });
      
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Check Cloudflare DNS status
async function checkCloudflare() {
  try {
    console.log('Checking Cloudflare integration for snakkaz.com...');
    const response = await makeRequest('https://www.snakkaz.com/cdn-cgi/trace');
    
    console.log('Response status code:', response.statusCode);
    console.log('Response data:', response.data);
    
    if (response.data.includes('cf-ray=')) {
      console.log('✅ Cloudflare is active!');
    } else {
      console.log('❌ Cloudflare does not appear to be active.');
    }
  } catch (error) {
    console.error('Error checking Cloudflare:', error.message);
  }
}

// Run the check
checkCloudflare();
