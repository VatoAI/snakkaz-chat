import { useState, useEffect, useCallback } from 'react';
import { useWebRTC } from './webrtc-hooks';
import { useWebRTCDirectMessaging } from './webrtc-hooks';
import { useMCPClient, MCPMessage } from './useMCPClient';

// Type definisjoner for MCP-WebRTC integrerte meldinger
export interface IntegratedMessage {
  id: string;
  content: string;
  sender: string;
  receiver: string;
  timestamp: number;
  sent: boolean;
  received: boolean;
  method: 'webrtc' | 'mcp' | 'none';
  encrypted: boolean;
  error?: string;
}

export interface IntegratedChatConfig {
  preferWebRTC: boolean;
  mcpServerUrl: string;
  mcpAuthToken?: string;
  enableEncryption: boolean;
  fallbackTimeoutMs: number;
  maxRetries: number;
  debug?: boolean;
}

/**
 * useIntegratedCommunication - Hook som kombinerer WebRTC og MCP for robust kommunikasjon
 * 
 * Denne hooken lar applikasjoner kommunisere via WebRTC P2P når tilgjengelig og
 * falle tilbake på MCP server når WebRTC ikke er tilgjengelig eller feiler.
 */
export function useIntegratedCommunication(
  userId: string,
  peerId: string,
  config: Partial<IntegratedChatConfig> = {}
) {
  // Standardinnstillinger
  const defaultConfig: IntegratedChatConfig = {
    preferWebRTC: true,
    mcpServerUrl: process.env.MCP_SERVER_URL || 'wss://mcp.snakkaz.com',
    enableEncryption: true,
    fallbackTimeoutMs: 5000,
    maxRetries: 3
  };

  // Kombinerte innstillinger
  const fullConfig = { ...defaultConfig, ...config };

  // Initialiser WebRTC og MCP klienter
  const webrtc = useWebRTC();
  const directMessaging = useWebRTCDirectMessaging(userId, peerId);
  const mcpClient = useMCPClient(userId, {
    serverUrl: fullConfig.mcpServerUrl,
    authToken: fullConfig.mcpAuthToken,
    timeout: fullConfig.fallbackTimeoutMs,
    retryAttempts: fullConfig.maxRetries
  });

  // State for meldinger og status
  const [messages, setMessages] = useState<IntegratedMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [connectionMethod, setConnectionMethod] = useState<'webrtc' | 'mcp' | 'none'>('none');
  const [messageCounter, setMessageCounter] = useState(0);

  // Lytt på endringer i tilkoblingsstatus
  useEffect(() => {
    if (directMessaging.connectionState === 'p2p') {
      setConnectionMethod('webrtc');
      setErrorMessage(null);
    } else if (mcpClient.connected) {
      setConnectionMethod('mcp');
      setErrorMessage(null);
    } else if (directMessaging.connectionState === 'error' && mcpClient.connectionStatus === 'error') {
      setConnectionMethod('none');
      setErrorMessage('Kunne ikke koble til via WebRTC eller MCP');
    } else {
      // Enten forsøker vi fortsatt å koble til, eller en av tjenestene er tilgjengelig
      if (directMessaging.connectionState === 'connecting' || mcpClient.connectionStatus === 'connecting') {
        setIsLoading(true);
      } else {
        setIsLoading(false);
      }
    }
  }, [directMessaging.connectionState, mcpClient.connected, mcpClient.connectionStatus]);

  // Lytt på nye MCP-meldinger
  useEffect(() => {
    if (!mcpClient.messages.length) return;

    // Konverter MCP-meldinger til integrerte meldinger
    const lastMcpMessage = mcpClient.messages[mcpClient.messages.length - 1];

    if (lastMcpMessage.type === 'chat_message' && lastMcpMessage.content) {
      const newMessage: IntegratedMessage = {
        id: lastMcpMessage.id || `mcp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: lastMcpMessage.content,
        sender: lastMcpMessage.metadata?.senderId || 'unknown',
        receiver: userId,
        timestamp: lastMcpMessage.timestamp,
        sent: true,
        received: true,
        method: 'mcp',
        encrypted: lastMcpMessage.metadata?.encrypted || false
      };

      setMessages(prev => [...prev, newMessage]);
    }
  }, [mcpClient.messages, userId]);

  // Send melding-funksjon som prøver WebRTC først, deretter MCP som fallback
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return null;

    // Generer melding-ID
    const messageId = `msg-${Date.now()}-${messageCounter}`;
    setMessageCounter(prev => prev + 1);

    // Opprett midlertidig melding for optimistisk UI oppdatering
    const pendingMessage: IntegratedMessage = {
      id: messageId,
      content,
      sender: userId,
      receiver: peerId,
      timestamp: Date.now(),
      sent: false,
      received: false,
      method: 'none',
      encrypted: fullConfig.enableEncryption
    };

    // Legg til meldingen i listen
    setMessages(prev => [...prev, pendingMessage]);

    try {
      // Først, prøv WebRTC hvis foretrukket og tilgjengelig
      if (fullConfig.preferWebRTC && directMessaging.connectionState === 'p2p') {
        const webrtcSuccess = await directMessaging.sendMessage(content);

        if (webrtcSuccess) {
          // Oppdater meldingsstatus
          setMessages(prev => prev.map(msg =>
            msg.id === messageId
              ? { ...msg, sent: true, method: 'webrtc' }
              : msg
          ));
          return messageId;
        }
      }

      // Fallback til MCP hvis WebRTC feilet eller ikke er foretrukket
      if (mcpClient.connected) {
        const mcpMessage: Omit<MCPMessage, 'timestamp'> = {
          id: messageId,
          type: 'chat_message',
          content,
          metadata: {
            senderId: userId,
            receiverId: peerId,
            encrypted: fullConfig.enableEncryption
          }
        };

        const mcpSuccess = await mcpClient.sendMessage(mcpMessage);

        if (mcpSuccess) {
          // Oppdater meldingsstatus
          setMessages(prev => prev.map(msg =>
            msg.id === messageId
              ? { ...msg, sent: true, method: 'mcp' }
              : msg
          ));
          return messageId;
        }
      }

      // Hvis vi kommer hit, feilet både WebRTC og MCP
      throw new Error('Kunne ikke sende melding via WebRTC eller MCP');
    } catch (error) {
      console.error('Error sending message:', error);

      // Oppdater meldingsstatus med feil
      setMessages(prev => prev.map(msg =>
        msg.id === messageId
          ? { ...msg, error: error instanceof Error ? error.message : 'Ukjent feil' }
          : msg
      ));

      return null;
    }
  }, [
    userId,
    peerId,
    messageCounter,
    directMessaging,
    mcpClient,
    fullConfig.preferWebRTC,
    fullConfig.enableEncryption
  ]);

  // Prøv å sende en melding på nytt
  const retrySendMessage = async (messageId: string) => {
    const messageToRetry = messages.find(msg => msg.id === messageId);
    if (!messageToRetry) return false;

    // Fjern den gamle meldingen
    setMessages(prev => prev.filter(msg => msg.id !== messageId));

    // Send på nytt som en ny melding
    return sendMessage(messageToRetry.content) !== null;
  };

  // Koble til ved oppstart
  useEffect(() => {
    if (fullConfig.preferWebRTC) {
      // Forsøk WebRTC-tilkobling først
      directMessaging.connect().catch(error => {
        console.warn('WebRTC connection failed, will use MCP fallback if available', error);
      });
    }
    // MCP-tilkoblingen håndteres automatisk av useMCPClient
  }, [fullConfig.preferWebRTC, directMessaging]);

  return {
    messages,
    isLoading,
    error: errorMessage,
    sendMessage,
    retrySendMessage,
    connectionMethod,
    isEncrypted:
      connectionMethod === 'webrtc'
        ? directMessaging.isEncrypted
        : fullConfig.enableEncryption,
    latency:
      connectionMethod === 'webrtc'
        ? directMessaging.latency
        : null,
    webrtcState: directMessaging.connectionState,
    mcpState: mcpClient.connectionStatus
  };
}
