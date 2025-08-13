import { useState, useEffect } from 'react';

// Type definisjoner for MCP meldinger og konfigurasjon
export interface MCPMessage {
  id: string;
  type: string;
  content: any;
  metadata?: Record<string, any>;
  timestamp: number;
}

export interface MCPConfig {
  serverUrl: string;
  authToken?: string;
  timeout?: number;
  retryAttempts?: number;
}

/**
 * En basis MCP (Model Context Protocol) klient hook
 * Denne hooken gir grunnleggende funksjonalitet for å kommunisere med en MCP-server
 */
export function useMCPClient(userId: string, config: MCPConfig) {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [messages, setMessages] = useState<MCPMessage[]>([]);

  // Tilkoblingsstatus
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');

  // Konfigurere MCP klienten
  useEffect(() => {
    if (!userId || !config.serverUrl) {
      setConnectionStatus('disconnected');
      return;
    }

    let wsConnection: WebSocket | null = null;
    let reconnectAttempt = 0;
    const maxReconnectAttempts = config.retryAttempts || 5;

    // Funksjon for å håndtere tilkobling til MCP serveren
    const connectToServer = () => {
      setConnectionStatus('connecting');

      try {
        wsConnection = new WebSocket(config.serverUrl);

        wsConnection.onopen = () => {
          setConnectionStatus('connected');
          setConnected(true);
          setError(null);
          reconnectAttempt = 0;

          // Send auth melding etter tilkobling
          if (config.authToken) {
            wsConnection?.send(JSON.stringify({
              type: 'auth',
              userId,
              token: config.authToken,
              timestamp: Date.now()
            }));
          }
        };

        wsConnection.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            if (message.type === 'auth_success') {
              console.log('MCP authentication successful');
            } else {
              setMessages(prev => [...prev, {
                ...message,
                timestamp: message.timestamp || Date.now()
              }]);
            }
          } catch (err) {
            console.error('Failed to parse MCP message:', err);
          }
        };

        wsConnection.onerror = (event) => {
          setError(new Error('WebSocket error occurred'));
          setConnectionStatus('error');
        };

        wsConnection.onclose = () => {
          setConnected(false);
          setConnectionStatus('disconnected');

          // Forsøk gjentilkobling hvis det ikke var en manuell nedkobling
          if (reconnectAttempt < maxReconnectAttempts) {
            reconnectAttempt++;
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempt), 30000);
            setTimeout(connectToServer, delay);
          }
        };
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown connection error'));
        setConnectionStatus('error');
      }
    };

    // Koble til MCP-serveren
    connectToServer();

    // Rydde opp ved unmount
    return () => {
      if (wsConnection) {
        wsConnection.close();
      }
    };
  }, [userId, config.serverUrl, config.authToken, config.retryAttempts]);

  // Funksjon for å sende meldinger til MCP serveren
  const sendMessage = async (message: Omit<MCPMessage, 'timestamp'>) => {
    if (connectionStatus !== 'connected') {
      throw new Error('MCP client not connected');
    }

    return new Promise<boolean>((resolve, reject) => {
      try {
        const fullMessage = {
          ...message,
          timestamp: Date.now(),
          userId
        };

        const messageString = JSON.stringify(fullMessage);

        // Send melding via WebSocket
        const ws = new WebSocket(config.serverUrl);
        ws.onopen = () => {
          ws.send(messageString);
          resolve(true);
          ws.close();
        };

        ws.onerror = (error) => {
          reject(new Error('Failed to send MCP message'));
          ws.close();
        };

        // Timeout for sending
        setTimeout(() => {
          if (ws.readyState !== WebSocket.CLOSED) {
            ws.close();
            reject(new Error('MCP message send timeout'));
          }
        }, config.timeout || 5000);
      } catch (error) {
        reject(error);
      }
    });
  };

  return {
    connected,
    connectionStatus,
    error,
    messages,
    sendMessage
  };
}
