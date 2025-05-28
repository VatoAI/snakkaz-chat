#!/usr/bin/env node

// Snakkaz Chat Storage Verification
// Checks if the app has been successfully stored on all subdomains

const https = require('https');

const subdomains = ['dash', 'business', 'docs', 'analytics', 'mcp', 'help'];
const baseUrl = 'snakkaz.com';

async function checkSubdomain(subdomain) {
    return new Promise((resolve) => {
        const url = `https://${subdomain}.${baseUrl}`;
        
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const isSnakkazApp = data.includes('Snakkaz Chat') || data.includes('react-app');
                const status = res.statusCode === 200 ? '✅' : '❌';
                const content = isSnakkazApp ? 'Snakkaz App' : 'Generic Content';
                
                console.log(`${status} ${subdomain}.${baseUrl} - ${content}`);
                resolve({ subdomain, success: isSnakkazApp, status: res.statusCode });
            });
        }).on('error', (err) => {
            console.log(`❌ ${subdomain}.${baseUrl} - Error: ${err.message}`);
            resolve({ subdomain, success: false, error: err.message });
        });
    });
}

async function verifyAllSubdomains() {
    console.log('🔍 Verifying Snakkaz Chat Storage Status');
    console.log('=====================================');
    
    const results = await Promise.all(
        subdomains.map(subdomain => checkSubdomain(subdomain))
    );
    
    const successful = results.filter(r => r.success).length;
    const total = results.length;
    
    console.log('\n📊 Storage Summary:');
    console.log(`✅ Successfully stored: ${successful}/${total} subdomains`);
    
    if (successful === total) {
        console.log('\n🎉 SUCCESS! All subdomains have Snakkaz Chat stored!');
    } else {
        console.log('\n⏳ Some subdomains still need deployment...');
    }
    
    return results;
}

verifyAllSubdomains();
