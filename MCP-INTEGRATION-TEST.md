# 🧪 SnakkaZ WebRTC + MCP Integration - Full Test Suite

*Komplett testing av live MCP server med SnakkaZ frontend*

## 🎯 **Test Overview:**

### **Intelligent Fallback System:**
```
1️⃣ WebRTC P2P (Primary)    → 5-20ms latency
2️⃣ MCP Fallback (Secondary) → 50-100ms latency  
3️⃣ Supabase (Tertiary)     → 100-200ms latency
```

## 🔧 **Test 1: MCP Server Health Check**

### **Manual Browser Test:**
```bash
✅ Test URLs:
1. https://mcp.snakkaz.com/          (Main info)
2. https://mcp.snakkaz.com/health    (Health status)  
3. https://mcp.snakkaz.com/api/tools (Available tools)
4. https://mcp.snakkaz.com/docs      (API documentation)

Expected Response: JSON med server info
```

### **Frontend Integration Test:**
```javascript
// Test MCP fra SnakkaZ frontend:
const testMCPConnection = async () => {
  try {
    const response = await fetch('https://mcp.snakkaz.com/health');
    const data = await response.json();
    console.log('✅ MCP Server Health:', data);
    return data.status === 'healthy';
  } catch (error) {
    console.log('❌ MCP Connection Failed:', error);
    return false;
  }
};
```

## 🚀 **Test 2: WebRTC Fallback Simulation**

### **Simulate WebRTC Failure:**
```javascript
// In your SnakkaZ chat component:
const sendMessageWithFallback = async (message) => {
  try {
    // 1. Try WebRTC first
    const webrtcSuccess = await sendViaWebRTC(message);
    if (webrtcSuccess) {
      console.log('✅ Message sent via WebRTC');
      return;
    }
  } catch (webrtcError) {
    console.log('⚠️ WebRTC failed, falling back to MCP...');
  }

  try {
    // 2. Fallback to MCP
    const mcpResponse = await fetch('https://mcp.snakkaz.com/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, timestamp: Date.now() })
    });
    console.log('✅ Message sent via MCP fallback');
  } catch (mcpError) {
    console.log('⚠️ MCP failed, falling back to Supabase...');
    // 3. Final fallback to Supabase
    await sendViaSupabase(message);
  }
};
```

## 🔐 **Test 3: E2EE Integration with MCP**

### **Encrypted Message through MCP:**
```javascript
// Test E2EE med MCP fallback:
const sendEncryptedViaMCP = async (message, recipientPublicKey) => {
  // 1. Encrypt message locally
  const encryptedMessage = await encryptMessage(message, recipientPublicKey);
  
  // 2. Send via MCP (encrypted payload)
  const response = await fetch('https://mcp.snakkaz.com/api/relay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'encrypted_message',
      payload: encryptedMessage,
      recipient: recipientId,
      timestamp: Date.now()
    })
  });
  
  return response.json();
};
```

## 📊 **Test 4: Load & Performance Testing**

### **Stress Test MCP Server:**
```javascript
// Test multiple simultaneous connections:
const stressTestMCP = async () => {
  const requests = [];
  
  for (let i = 0; i < 50; i++) {
    requests.push(
      fetch('https://mcp.snakkaz.com/health')
        .then(r => r.json())
        .then(data => ({ success: true, response: data }))
        .catch(error => ({ success: false, error }))
    );
  }
  
  const results = await Promise.all(requests);
  const successful = results.filter(r => r.success).length;
  
  console.log(`✅ Stress Test: ${successful}/50 requests successful`);
  return results;
};
```

## 🎮 **Interactive Test Commands:**

### **Test 1: Manual Health Check**
```bash
# Terminal test:
curl -X GET https://mcp.snakkaz.com/health

# Expected output:
{
  "status": "healthy",
  "version": "2.1.0-lightweight",
  "domain": "mcp.snakkaz.com",
  "uptime": "...",
  "memory": {...}
}
```

### **Test 2: CORS Verification**
```bash
# Test CORS fra different origin:
curl -X OPTIONS https://mcp.snakkaz.com/ \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST"

# Should return CORS headers
```

### **Test 3: API Tools Discovery**
```bash
# Test MCP tools endpoint:
curl -X GET https://mcp.snakkaz.com/api/tools

# Expected: List of available MCP tools
```

## 🌐 **Test 5: Frontend Integration Update**

### **Update SnakkaZ Config:**
```typescript
// src/config/mcp.ts
export const MCP_CONFIG = {
  SERVER_URL: 'https://mcp.snakkaz.com',
  ENDPOINTS: {
    HEALTH: '/health',
    TOOLS: '/api/tools',
    CHAT: '/api/chat',
    RELAY: '/api/relay'
  },
  TIMEOUT: 5000,
  RETRY_ATTEMPTS: 3
};
```

### **Test Integration:**
```typescript
// src/services/mcpClient.ts
import { MCP_CONFIG } from '../config/mcp';

export class MCPClient {
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${MCP_CONFIG.SERVER_URL}${MCP_CONFIG.ENDPOINTS.HEALTH}`);
      const data = await response.json();
      return data.status === 'healthy';
    } catch {
      return false;
    }
  }

  async sendMessage(message: string): Promise<any> {
    // Implementation for sending via MCP
  }
}
```

## 📈 **Test Results Monitoring:**

### **Live Server Logs:**
```bash
# SSH into server og watch logs:
source /home/snakqsqe/nodevenv/mcp-snakkaz/18/bin/activate
cd /home/snakqsqe/mcp-snakkaz

# Server logs show real-time requests:
[2025-07-22T...] GET /health - Mozilla/5.0...
[2025-07-22T...] POST /api/chat - SnakkazApp/1.0...
```

### **Performance Metrics:**
```javascript
// Track MCP performance:
const mcpMetrics = {
  totalRequests: 0,
  successfulRequests: 0,
  averageResponseTime: 0,
  uptime: '...'
};
```

## 🎯 **Expected Test Results:**

```bash
✅ Health Check: HTTP 200, status: "healthy"
✅ CORS Headers: Present and correct
✅ API Tools: Returns MCP tool list
✅ Load Test: Handles 50+ concurrent requests
✅ WebRTC Fallback: Seamless transition to MCP
✅ E2EE: Encrypted messages relay correctly
✅ Frontend Integration: SnakkaZ connects successfully
```

## 🚀 **Live Testing Checklist:**

- [ ] Test https://mcp.snakkaz.com/health
- [ ] Test CORS from SnakkaZ frontend  
- [ ] Simulate WebRTC failure
- [ ] Test MCP fallback mechanism
- [ ] Verify E2EE works through MCP
- [ ] Load test with multiple requests
- [ ] Monitor server logs in real-time
- [ ] Test error handling and recovery

---

**Ready to start testing! Hvilken test vil du kjøre først?** 🎮
