// Enhanced environment-aware configuration for SnakkaZ
export const getEnvironmentConfig = () => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const isProduction = hostname !== 'localhost' && hostname !== '127.0.0.1' && !hostname.includes('dev');
  const isDevelopment = !isProduction;
  
  // Production-safe configuration
  const config = {
    isProduction,
    isDevelopment,
    hostname,
    
    // Database configuration
    supabaseUrl: 'https://wqpoozpbceucynsojmbk.supabase.co',
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    
    // MCP Server configuration
    mcpServerUrl: isProduction ? 'https://mcp.snakkaz.com' : 'http://localhost:3000',
    
    // Feature flags
    features: {
      mcpConnections: isDevelopment, // Only enable MCP in development
      voiceMessages: true,
      roomChat: true,
      realtimeSync: true,
      debugMode: isDevelopment,
      analytics: isProduction,
      serviceWorker: isProduction
    },
    
    // Security settings
    security: {
      encryptedMessagesOnly: isProduction,
      requireActiveSession: true,
      maxConnectionsPerUser: isProduction ? 1 : 3,
      heartbeatInterval: 30000,
      sessionTimeout: isProduction ? 1800000 : 3600000 // 30min prod, 1hr dev
    },
    
    // Performance settings
    performance: {
      enableCompression: isProduction,
      enableCaching: isProduction,
      lazyLoading: true,
      imageOptimization: isProduction
    }
  };
  
  // Log configuration in development
  if (isDevelopment && typeof console !== 'undefined') {
    console.log('🔧 SnakkaZ Environment Config:', config);
  }
  
  return config;
};

// Convenience exports
export const isDev = () => getEnvironmentConfig().isDevelopment;
export const isProd = () => getEnvironmentConfig().isProduction;
export const getFeatures = () => getEnvironmentConfig().features;
export const getSecurity = () => getEnvironmentConfig().security;

// Default export
export default getEnvironmentConfig;
