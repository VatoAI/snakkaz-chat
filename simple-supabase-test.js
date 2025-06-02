#!/usr/bin/env node

// Simple Supabase connectivity test
const https = require('https');
const fs = require('fs');

// Read .env file manually
const envContent = fs.readFileSync('.env', 'utf8');
const lines = envContent.split('\n');
let supabaseUrl = '';
let supabaseKey = '';

lines.forEach(line => {
    if (line.startsWith('VITE_SUPABASE_URL=')) {
        supabaseUrl = line.split('=')[1];
    }
    if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) {
        supabaseKey = line.split('=')[1];
    }
});

console.log('🔗 Testing Supabase connection...');
console.log('URL:', supabaseUrl ? 'Found' : 'Missing');
console.log('Key:', supabaseKey ? 'Found (length: ' + supabaseKey.length + ')' : 'Missing');

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase configuration');
    process.exit(1);
}

// Test basic REST API connectivity
const testUrl = `${supabaseUrl}/rest/v1/profiles?select=count&limit=1`;
const options = {
    method: 'GET',
    headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
    }
};

console.log('📡 Testing REST API connectivity...');

const req = https.request(testUrl, options, (res) => {
    console.log('✅ Response status:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        if (res.statusCode === 200) {
            console.log('✅ Supabase connection successful!');
            console.log('🎉 Database is accessible');
        } else {
            console.log('⚠️ Unexpected response:', res.statusCode);
            console.log('Response:', data);
        }
        process.exit(res.statusCode === 200 ? 0 : 1);
    });
});

req.on('error', (error) => {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
});

req.setTimeout(10000, () => {
    console.error('❌ Connection timeout');
    req.destroy();
    process.exit(1);
});

req.end();
