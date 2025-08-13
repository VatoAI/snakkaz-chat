/**
 * WebRTC og MCP Server Integrasjon
 * 
 * Dette modulet gir funksjonalitet for å sette opp en MCP-server som kan brukes
 * som et robust alternativ til WebRTC-kommunikasjon.
 */

import { PeerJSManager } from './peerjs-manager';

// Konfigurasjon for MCP-serveren
export interface MCPServerConfig {
  serverUrl: string;
  authToken?: string;
  enableSignaling: boolean;
  enableFallback: boolean;
  enableMetrics: boolean;
  maxConnections?: number;
  timeout?: number;
}

/**
 * MCPSignalingService - Klasse for WebRTC-signalering via MCP
 * 
 * Denne tjenesten lar WebRTC-peers signalere gjennom en MCP-server,
 * noe som gir mer pålitelig signalering enn tradisjonelle metoder.
 */
export class MCPSignalingService {
  private serverUrl: string;
  private authToken?: string;
  private wsConnection: WebSocket | null = null;
  private connected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private peers = new Map<string, (signal: any) => void>();

  constructor(serverUrl: string, authToken?: string) {
    this.serverUrl = serverUrl;
    this.authToken = authToken;
  }

  /**
   * Koble til MCP-signalering-serveren
   */
  connect(userId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        this.wsConnection = new WebSocket(this.serverUrl);

        this.wsConnection.onopen = () => {
          this.connected = true;
          this.reconnectAttempts = 0;

          // Send auth melding
          if (this.authToken) {
            this.wsConnection?.send(JSON.stringify({
              type: 'auth',
              userId,
              token: this.authToken,
              timestamp: Date.now()
            }));
          }

          // Send registrering for signalering
          this.wsConnection?.send(JSON.stringify({
            type: 'register_signaling',
            userId,
            timestamp: Date.now()
          }));

          resolve(true);
        };

        this.wsConnection.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);

            // Håndter signalerings-meldinger
            if (message.type === 'webrtc_signal' && message.payload) {
              const { fromUserId, signal } = message.payload;
              const handler = this.peers.get(fromUserId);

              if (handler) {
                handler(signal);
              }
            }
          } catch (err) {
            console.error('Failed to parse MCP message:', err);
          }
        };

        this.wsConnection.onerror = () => {
          this.connected = false;
          reject(new Error('WebSocket connection failed'));
        };

        this.wsConnection.onclose = () => {
          this.connected = false;

          // Forsøk gjentilkobling
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

            setTimeout(() => {
              this.connect(userId).catch(console.error);
            }, delay);
          }
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Send et WebRTC-signal til en annen peer
   */
  sendSignal(fromUserId: string, toUserId: string, signal: any): boolean {
    if (!this.connected || !this.wsConnection) {
      return false;
    }

    try {
      this.wsConnection.send(JSON.stringify({
        type: 'webrtc_signal',
        payload: {
          fromUserId,
          toUserId,
          signal
        },
        timestamp: Date.now()
      }));

      return true;
    } catch (err) {
      console.error('Failed to send signal:', err);
      return false;
    }
  }

  /**
   * Registrer en callback for å motta signaler fra en bestemt peer
   */
  onSignal(fromUserId: string, callback: (signal: any) => void): void {
    this.peers.set(fromUserId, callback);
  }

  /**
   * Fjern en tidligere registrert callback
   */
  removeSignalHandler(fromUserId: string): void {
    this.peers.delete(fromUserId);
  }

  /**
   * Lukk tilkoblingen til MCP-serveren
   */
  disconnect(): void {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
      this.connected = false;
    }
  }
}

/**
 * Opprett en forsterket PeerJSManager med MCP-signalering
 */
export function createEnhancedPeerManager(
  userId: string,
  config: MCPServerConfig
): PeerJSManager {
  const peerManager = new PeerJSManager(userId);

  // Hvis MCP-signalering er aktivert, opprett en signalerings-tjeneste
  if (config.enableSignaling) {
    const signalingService = new MCPSignalingService(config.serverUrl, config.authToken);

    // Koble til MCP-serveren
    signalingService.connect(userId).then(() => {
      console.log('MCP signaling service connected');

      // Overskriv standard signalering med MCP-signalering
      // Dette er bare et eksempel og vil kreve tilpasning til den faktiske PeerJSManager-implementasjonen
      // peerManager.setCustomSignaling({
      //   send: (peerId: string, signal: any) => signalingService.sendSignal(userId, peerId, signal),
      //   onSignal: (peerId: string, handler: (signal: any) => void) => signalingService.onSignal(peerId, handler),
      //   removeHandler: (peerId: string) => signalingService.removeSignalHandler(peerId)
      // });
    }).catch(err => {
      console.error('Failed to connect to MCP signaling service:', err);
    });
  }

  return peerManager;
}

/**
 * WebRTC-MCP Monitor for statistikk og tilstandsovervåking
 */
export class WebRTCMCPMonitor {
  private metrics: {
    webrtcConnections: number;
    mcpConnections: number;
    fallbackCount: number;
    messagesSent: number;
    messagesReceived: number;
    failedMessages: number;
    averageLatency: number;
    latencyMeasurements: number;
  };

  constructor() {
    this.metrics = {
      webrtcConnections: 0,
      mcpConnections: 0,
      fallbackCount: 0,
      messagesSent: 0,
      messagesReceived: 0,
      failedMessages: 0,
      averageLatency: 0,
      latencyMeasurements: 0
    };
  }

  recordWebRTCConnection(): void {
    this.metrics.webrtcConnections++;
  }

  recordMCPConnection(): void {
    this.metrics.mcpConnections++;
  }

  recordFallback(): void {
    this.metrics.fallbackCount++;
  }

  recordMessageSent(method: 'webrtc' | 'mcp'): void {
    this.metrics.messagesSent++;
    // Vi kan senere legge til mer detaljert telemetri basert på metode
  }

  recordMessageReceived(method: 'webrtc' | 'mcp'): void {
    this.metrics.messagesReceived++;
    // Vi kan senere legge til mer detaljert telemetri basert på metode
  }

  recordFailedMessage(): void {
    this.metrics.failedMessages++;
  }

  recordLatency(latencyMs: number): void {
    // Oppdater gjennomsnittlig ventetid
    const totalLatency = this.metrics.averageLatency * this.metrics.latencyMeasurements;
    this.metrics.latencyMeasurements++;
    this.metrics.averageLatency = (totalLatency + latencyMs) / this.metrics.latencyMeasurements;
  }

  getMetrics() {
    return { ...this.metrics };
  }

  resetMetrics(): void {
    this.metrics = {
      webrtcConnections: 0,
      mcpConnections: 0,
      fallbackCount: 0,
      messagesSent: 0,
      messagesReceived: 0,
      failedMessages: 0,
      averageLatency: 0,
      latencyMeasurements: 0
    };
  }
}
