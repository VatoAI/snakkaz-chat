#!/usr/bin/env node

/**
 * SnakkaZ MCP Server Test Suite
 * Tests all endpoints and functionality
 */

const http = require('http');

const SERVER_URL = 'http://localhost:3000';

async function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://snakkaz.com'
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData, headers: res.headers });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testEndpoint(name, path, method = 'GET', data = null, expectedStatus = 200) {
  try {
    console.log(`🧪 Testing ${name}...`);
    const response = await makeRequest(path, method, data);
    
    if (response.status === expectedStatus) {
      console.log(`✅ ${name}: OK (${response.status})`);
      console.log(`   Response: ${JSON.stringify(response.data).substring(0, 100)}...`);
      return true;
    } else {
      console.log(`❌ ${name}: Expected ${expectedStatus}, got ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${name}: Error - ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting SnakkaZ MCP Server Tests\n');
  
  const tests = [
    {
      name: 'Health Check',
      path: '/api/health',
      method: 'GET'
    },
    {
      name: 'MCP Status',
      path: '/api/mcp/status',
      method: 'GET'
    },
    {
      name: 'Chat Message',
      path: '/api/chat',
      method: 'POST',
      data: {
        message: 'Hei fra test!',
        userId: 'test-user',
        timestamp: new Date().toISOString()
      }
    },
    {
      name: 'Chat Validation (Empty Message)',
      path: '/api/chat',
      method: 'POST',
      data: { message: '' },
      expectedStatus: 400
    },
    {
      name: 'WebRTC Signal',
      path: '/api/webrtc/signal',
      method: 'POST',
      data: {
        signal: { type: 'offer', sdp: 'test-sdp' },
        sourceUserId: 'user1',
        targetUserId: 'user2'
      }
    },
    {
      name: 'AI Processing',
      path: '/api/ai/process',
      method: 'POST',
      data: {
        prompt: 'Test AI prompt',
        context: 'test context',
        userId: 'test-user'
      }
    }
  ];

  let passed = 0;
  let total = tests.length;

  for (const test of tests) {
    const result = await testEndpoint(
      test.name,
      test.path,
      test.method,
      test.data,
      test.expectedStatus || 200
    );
    
    if (result) passed++;
    console.log(''); // Add spacing
  }

  console.log('📊 Test Results:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${total - passed}`);
  console.log(`   📊 Success Rate: ${Math.round((passed / total) * 100)}%`);

  if (passed === total) {
    console.log('\n🎉 All tests passed! MCP Server is ready for production.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Please check the server configuration.');
    process.exit(1);
  }
}

// Check if server is running
async function checkServer() {
  try {
    await makeRequest('/api/health');
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Server is not running on port 3000');
    console.log('💡 Start the server with: npm start');
    process.exit(1);
  }
  
  await runTests();
}

main().catch(console.error);