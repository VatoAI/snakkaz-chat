// Production configuration for SnakkaZ
export const PRODUCTION_CONFIG = {
  MCP_SERVER_URL: 'https://mcp.snakkaz.com',
  API_BASE_URL: 'https://mcp.snakkaz.com/api',
  WEBSOCKET_URL: 'wss://mcp.snakkaz.com',
  
  // Endpoints
  ENDPOINTS: {
    HEALTH: '/api/health',
    CHAT: '/api/chat', 
    MCP_STATUS: '/api/mcp/status',
    WEBRTC_SIGNAL: '/api/webrtc/signal',
    AI_PROCESS: '/api/ai/process'
  }
};

// Get base URL based on environment
export const getApiBaseUrl = () => {
  if (import.meta.env.PROD) {
    return PRODUCTION_CONFIG.API_BASE_URL;
  }
  return import.meta.env.VITE_MCP_API_URL || import.meta.env.VITE_MCP_SERVER_URL || 'http://localhost:3000/api';
};