// src/hooks/useMCPFallback.ts - WebRTC + MCP Integration Hook
import { useState, useEffect, useCallback } from 'react';
import { MCPClient, MCP_CONFIG } from '../config/mcp';

interface MCPStats {
  status: string;
  requests: number;
  uptime: string;
  chatMessages: number;
  isHealthy: boolean;
}

export const useMCPFallback = () => {
  const [mcpClient] = useState(() => new MCPClient());
  const [mcpStatus, setMcpStatus] = useState<MCPStats | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastHeartbeat, setLastHeartbeat] = useState<Date | null>(null);

  // Test MCP connection on mount
  useEffect(() => {
    const testConnection = async () => {
      const connected = await mcpClient.testConnection();
      setIsConnected(connected);
      
      if (connected) {
        const stats = await mcpClient.getStats();
        setMcpStatus({
          status: stats?.status || 'unknown',
          requests: stats?.stats?.totalRequests || 0,
          uptime: stats?.uptimeFormatted || '0s',
          chatMessages: stats?.stats?.chatMessages || 0,
          isHealthy: stats?.status === 'healthy'
        });
        setLastHeartbeat(new Date());
      }
    };

    testConnection();
    
    // Heartbeat every 30 seconds
    const interval = setInterval(testConnection, 30000);
    return () => clearInterval(interval);
  }, [mcpClient]);

  /**
   * Send message with intelligent fallback
   * 1. Try WebRTC first
   * 2. Fall back to MCP if WebRTC fails
   * 3. Final fallback to Supabase
   */
  const sendMessageWithFallback = useCallback(async (
    message: string,
    userId: string,
    webrtcSender?: (msg: string) => Promise<boolean>,
    supabaseSender?: (msg: string) => Promise<boolean>,
    encrypted: boolean = false
  ) => {
    console.log('🚀 Starting intelligent message fallback...');

    // 1. Try WebRTC first (if available)
    if (webrtcSender) {
      try {
        console.log('📡 Attempting WebRTC send...');
        const webrtcSuccess = await webrtcSender(message);
        if (webrtcSuccess) {
          console.log('✅ Message sent via WebRTC (Primary)');
          return { method: 'webrtc', success: true };
        }
      } catch (webrtcError) {
        console.log('⚠️ WebRTC failed:', webrtcError);
      }
    }

    // Add delay before MCP fallback
    await new Promise(resolve => setTimeout(resolve, MCP_CONFIG.FALLBACK_DELAY));

    // 2. Try MCP fallback
    if (isConnected) {
      try {
        console.log('🔄 Falling back to MCP server...');
        const mcpResult = await mcpClient.sendMessage(message, userId, encrypted);
        if (mcpResult.status === 'message_relayed') {
          console.log('✅ Message sent via MCP (Secondary)');
          
          // Update stats
          setMcpStatus(prev => prev ? {
            ...prev,
            chatMessages: prev.chatMessages + 1,
            requests: prev.requests + 1
          } : null);
          
          return { method: 'mcp', success: true, result: mcpResult };
        }
      } catch (mcpError) {
        console.log('⚠️ MCP fallback failed:', mcpError);
      }
    }

    // 3. Final fallback to Supabase
    if (supabaseSender) {
      try {
        console.log('🔄 Final fallback to Supabase...');
        const supabaseSuccess = await supabaseSender(message);
        if (supabaseSuccess) {
          console.log('✅ Message sent via Supabase (Tertiary)');
          return { method: 'supabase', success: true };
        }
      } catch (supabaseError) {
        console.log('❌ All fallback methods failed:', supabaseError);
      }
    }

    // All methods failed
    console.error('❌ All message delivery methods failed');
    return { method: 'none', success: false, error: 'All delivery methods failed' };
  }, [mcpClient, isConnected]);

  /**
   * Test all connection methods
   */
  const testAllConnections = useCallback(async () => {
    console.log('🧪 Testing all connection methods...');
    
    const mcpHealthy = await mcpClient.testConnection();
    setIsConnected(mcpHealthy);
    
    return {
      mcp: mcpHealthy,
      timestamp: new Date()
    };
  }, [mcpClient]);

  /**
   * Open MCP Dashboard
   */
  const openMCPDashboard = useCallback(() => {
    window.open(`${MCP_CONFIG.SERVER_URL}${MCP_CONFIG.ENDPOINTS.DASHBOARD}`, '_blank');
  }, []);

  return {
    // MCP Client
    mcpClient,
    
    // Connection Status
    isConnected,
    mcpStatus,
    lastHeartbeat,
    
    // Core Functions
    sendMessageWithFallback,
    testAllConnections,
    openMCPDashboard,
    
    // Dashboard URL
    dashboardUrl: `${MCP_CONFIG.SERVER_URL}${MCP_CONFIG.ENDPOINTS.DASHBOARD}`
  };
};
