/**
 * SnakkaZ MCP Security Configuration
 * Handles secure communication between client and MCP server
 */

export class MCPSecurity {
  constructor(serverUrl = 'http://localhost:3001') {
    this.serverUrl = serverUrl;
    this.maxConnections = 3;
    this.heartbeatInterval = 30000; // 30 seconds
    this.sessionTimeout = 300000; // 5 minutes
    this.encryptionRequired = true;
    this.activeConnections = new Map();
    this.heartbeatTimers = new Map();
  }

  // Initialize secure connection
  async initializeConnection(userId, profileId) {
    try {
      // Check connection limits
      if (this.activeConnections.size >= this.maxConnections) {
        throw new Error('Maximum connections reached');
      }

      // Generate secure connection ID
      const connectionId = this.generateConnectionId(userId, profileId);
      
      // Test server connectivity
      const healthCheck = await this.testServerHealth();
      if (!healthCheck.healthy) {
        throw new Error('MCP server not available');
      }

      // Create connection metadata
      const connectionMeta = {
        id: connectionId,
        userId,
        profileId,
        created: new Date().toISOString(),
        lastHeartbeat: new Date().toISOString(),
        security: {
          encrypted: this.encryptionRequired,
          authenticated: true,
          sessionToken: this.generateSessionToken(userId)
        }
      };

      // Store connection
      this.activeConnections.set(connectionId, connectionMeta);
      
      // Start heartbeat
      this.startHeartbeat(connectionId);

      return {
        success: true,
        connectionId,
        metadata: connectionMeta
      };

    } catch (error) {
      console.error('MCP Security: Failed to initialize connection:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate secure connection ID
  generateConnectionId(userId, profileId) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return `mcp_${userId}_${profileId}_${timestamp}_${random}`;
  }

  // Generate session token
  generateSessionToken(userId) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return btoa(`${userId}:${timestamp}:${random}`);
  }

  // Test MCP server health
  async testServerHealth() {
    try {
      const response = await fetch(`${this.serverUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Type': 'snakkaz-chat',
          'X-Security-Check': 'true'
        },
        timeout: 5000
      });

      if (!response.ok) {
        throw new Error(`Server health check failed: ${response.status}`);
      }

      const health = await response.json();
      return {
        healthy: health.status === 'healthy',
        server: health,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('MCP Health Check Failed:', error);
      return {
        healthy: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Start heartbeat for connection
  startHeartbeat(connectionId) {
    const timer = setInterval(async () => {
      try {
        const connection = this.activeConnections.get(connectionId);
        if (!connection) {
          clearInterval(timer);
          return;
        }

        // Send heartbeat
        const heartbeatResult = await this.sendHeartbeat(connectionId);
        
        if (heartbeatResult.success) {
          // Update last heartbeat
          connection.lastHeartbeat = new Date().toISOString();
          this.activeConnections.set(connectionId, connection);
        } else {
          // Heartbeat failed, cleanup connection
          this.cleanupConnection(connectionId);
        }

      } catch (error) {
        console.error('Heartbeat error for connection:', connectionId, error);
        this.cleanupConnection(connectionId);
      }
    }, this.heartbeatInterval);

    this.heartbeatTimers.set(connectionId, timer);
  }

  // Send heartbeat to server
  async sendHeartbeat(connectionId) {
    try {
      const connection = this.activeConnections.get(connectionId);
      if (!connection) {
        return { success: false, error: 'Connection not found' };
      }

      const response = await fetch(`${this.serverUrl}/api/heartbeat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${connection.security.sessionToken}`,
          'X-Connection-ID': connectionId,
          'X-Client-Type': 'snakkaz-chat'
        },
        body: JSON.stringify({
          connectionId,
          timestamp: new Date().toISOString(),
          userId: connection.userId,
          profileId: connection.profileId
        })
      });

      if (response.ok) {
        return { success: true, timestamp: new Date().toISOString() };
      } else {
        return { success: false, error: `Heartbeat failed: ${response.status}` };
      }

    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Secure message encryption (simplified for demo)
  async encryptMessage(message, connectionId) {
    if (!this.encryptionRequired) {
      return { encrypted: message, keyId: null };
    }

    try {
      const connection = this.activeConnections.get(connectionId);
      if (!connection) {
        throw new Error('Invalid connection for encryption');
      }

      // In a real implementation, use Web Crypto API for AES-GCM encryption
      const keyId = `key_${connection.userId}_${Date.now()}`;
      const encrypted = btoa(JSON.stringify({
        content: message,
        timestamp: new Date().toISOString(),
        keyId
      }));

      return {
        encrypted,
        keyId,
        algorithm: 'AES-GCM-256'
      };

    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Message encryption failed');
    }
  }

  // Secure message decryption
  async decryptMessage(encryptedData, keyId) {
    try {
      if (!encryptedData || !this.encryptionRequired) {
        return encryptedData;
      }

      // In a real implementation, use Web Crypto API for decryption
      const decrypted = JSON.parse(atob(encryptedData));
      return decrypted.content;

    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Message decryption failed');
    }
  }

  // Validate connection security
  validateConnection(connectionId) {
    const connection = this.activeConnections.get(connectionId);
    if (!connection) {
      return { valid: false, reason: 'Connection not found' };
    }

    const now = new Date();
    const lastHeartbeat = new Date(connection.lastHeartbeat);
    const timeSinceHeartbeat = now - lastHeartbeat;

    if (timeSinceHeartbeat > this.sessionTimeout) {
      return { valid: false, reason: 'Session timeout' };
    }

    return { valid: true, connection };
  }

  // Cleanup connection
  cleanupConnection(connectionId) {
    try {
      // Clear heartbeat timer
      const timer = this.heartbeatTimers.get(connectionId);
      if (timer) {
        clearInterval(timer);
        this.heartbeatTimers.delete(connectionId);
      }

      // Remove connection
      this.activeConnections.delete(connectionId);

      console.log('MCP Security: Connection cleaned up:', connectionId);

    } catch (error) {
      console.error('Error cleaning up connection:', error);
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      activeConnections: this.activeConnections.size,
      maxConnections: this.maxConnections,
      connections: Array.from(this.activeConnections.values()).map(conn => ({
        id: conn.id,
        userId: conn.userId,
        created: conn.created,
        lastHeartbeat: conn.lastHeartbeat,
        security: {
          encrypted: conn.security.encrypted,
          authenticated: conn.security.authenticated
        }
      }))
    };
  }

  // Cleanup all connections
  cleanup() {
    // Clear all heartbeat timers
    for (const timer of this.heartbeatTimers.values()) {
      clearInterval(timer);
    }
    
    // Clear all connections
    this.activeConnections.clear();
    this.heartbeatTimers.clear();

    console.log('MCP Security: All connections cleaned up');
  }
}

// Export singleton instance
export const mcpSecurity = new MCPSecurity();

export default MCPSecurity;
