/**
 * MCP WebRTC Provider
 * 
 * Dette er en React Provider som gir tilgang til den integrerte 
 * kommunikasjonskontrolleren for WebRTC og MCP gjennom hele applikasjonen.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IntegratedCommunicationController, CommunicationConfig } from '@/utils/webrtc/integrated-communication';

// Type definisjon for context
interface MCPWebRTCContextType {
  controller: IntegratedCommunicationController | null;
  isInitialized: boolean;
  isConnecting: boolean;
  error: string | null;
  stats: any;
  connectTo: (peerId: string) => Promise<boolean>;
  sendMessage: (to: string, message: any, options?: any) => Promise<boolean>;
}

// Standard config
const defaultConfig: CommunicationConfig = {
  userId: '',
  mcpServerUrl: import.meta.env.DEV ? 'ws://localhost:3001' : (process.env.REACT_APP_MCP_SERVER_URL || 'wss://mcp.snakkaz.com'),
  enableWebRTC: true,
  enableMCP: true,
  preferWebRTC: true,
  fallbackEnabled: true
};

// Opprett Context
const MCPWebRTCContext = createContext<MCPWebRTCContextType>({
  controller: null,
  isInitialized: false,
  isConnecting: false,
  error: null,
  stats: null,
  connectTo: async () => false,
  sendMessage: async () => false
});

// Hook for å bruke context
export const useMCPWebRTC = () => useContext(MCPWebRTCContext);

interface MCPWebRTCProviderProps {
  children: ReactNode;
  userId?: string;
  config?: Partial<CommunicationConfig>;
}

/**
 * MCP WebRTC Provider
 * 
 * Dette er en provider som gir tilgang til integrert WebRTC og MCP
 * kommunikasjon gjennom hele applikasjonen.
 */
export const MCPWebRTCProvider: React.FC<MCPWebRTCProviderProps> = ({
  children,
  userId = '',
  config = {}
}) => {
  const [controller, setController] = useState<IntegratedCommunicationController | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  // Initialiser kontrolleren når userId endres
  useEffect(() => {
    // Ikke initialiser hvis userId er tom
    if (!userId) return;

    const initController = async () => {
      try {
        setIsConnecting(true);
        setError(null);

        // Opprett full config med userId
        const fullConfig: CommunicationConfig = {
          ...defaultConfig,
          ...config,
          userId
        };

        // Opprett og initialiser kontrolleren
        const newController = new IntegratedCommunicationController(fullConfig);
        const success = await newController.init();

        if (success) {
          setController(newController);
          setIsInitialized(true);

          // Oppdater statistikk periodisk
          const statsInterval = setInterval(() => {
            setStats(newController.getStats());
          }, 5000);

          return () => {
            clearInterval(statsInterval);
            newController.disconnect();
          };
        } else {
          setError('Kunne ikke initialisere kommunikasjonskontrolleren');
        }
      } catch (err) {
        setError(`Initialisering feilet: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setIsConnecting(false);
      }
    };

    const cleanup = initController();

    return () => {
      cleanup?.then(cleanupFn => cleanupFn && cleanupFn());
      setController(null);
      setIsInitialized(false);
    };
  }, [userId, config]);

  // Koble til en bruker
  const connectTo = async (peerId: string): Promise<boolean> => {
    if (!controller || !isInitialized) {
      setError('Kommunikasjonskontrolleren er ikke initialisert');
      return false;
    }

    try {
      return await controller.connectTo(peerId);
    } catch (err) {
      setError(`Tilkobling til ${peerId} feilet: ${err instanceof Error ? err.message : String(err)}`);
      return false;
    }
  };

  // Send en melding til en bruker
  const sendMessage = async (to: string, message: any, options?: any): Promise<boolean> => {
    if (!controller || !isInitialized) {
      setError('Kommunikasjonskontrolleren er ikke initialisert');
      return false;
    }

    try {
      return await controller.sendTo(to, message, options);
    } catch (err) {
      setError(`Sending av melding til ${to} feilet: ${err instanceof Error ? err.message : String(err)}`);
      return false;
    }
  };

  // Context verdi
  const contextValue: MCPWebRTCContextType = {
    controller,
    isInitialized,
    isConnecting,
    error,
    stats,
    connectTo,
    sendMessage
  };

  return (
    <MCPWebRTCContext.Provider value={contextValue}>
      {children}
    </MCPWebRTCContext.Provider>
  );
};

// Eksporter som default for lazy loading
export default MCPWebRTCProvider;
