// Environment-aware configuration for SnakkaZ
export const getEnvironmentConfig = () => {
  const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  
  return {
    isProduction,
    mcpServerUrl: isProduction ? null : 'http://localhost:3001', // Disable MCP in production for now
    supabaseUrl: 'https://wqpoozpbceucynsojmbk.supabase.co',
    features: {
      mcpConnections: !isProduction, // Disable MCP in production
      voiceMessages: true,
      roomChat: true,
      realtimeSync: true
    }
  };
};

export const isDev = () => !getEnvironmentConfig().isProduction;
export const isProd = () => getEnvironmentConfig().isProduction;
