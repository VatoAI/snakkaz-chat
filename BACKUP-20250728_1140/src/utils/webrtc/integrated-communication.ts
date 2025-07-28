/**
 * Integrert Kommunikasjonskontroller
 * 
 * Dette er en kontroller som integrerer WebRTC og MCP for robust peer-to-peer
 * og server-mediated kommunikasjon. Den håndterer automatisk fallback mellom
 * WebRTC og MCP basert på tilkoblingstilstand.
 */

import { MCPSignalingService } from './mcp-integration';
import { PeerJSManager } from './peerjs-manager';

export interface CommunicationConfig {
  userId: string;
  mcpServerUrl: string;
  authToken?: string;
  enableWebRTC: boolean;
  enableMCP: boolean;
  preferWebRTC?: boolean;
  fallbackEnabled?: boolean;
}

export interface MessageOptions {
  priority?: 'high' | 'normal' | 'low';
  ttl?: number;
  encrypted?: boolean;
  requireDelivery?: boolean;
}

type MessageHandler = (from: string, message: any) => void;

/**
 * Integrert kommunikasjonskontroller
 * 
 * Denne klassen kombinerer WebRTC og MCP for robust kommunikasjon,
 * og håndterer automatisk fallback mellom de to metodene.
 */
export class IntegratedCommunicationController {
  private config: CommunicationConfig;
  private peerManager: PeerJSManager | null = null;
  private mcpService: MCPSignalingService | null = null;
  private messageHandlers: Map<string, MessageHandler[]> = new Map();
  private failedMessages: Map<string, { to: string; message: any; options: MessageOptions; timestamp: number }[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private messageDeliveryTimeout = 15000; // 15 sekunder

  // Statistikk
  private stats = {
    webrtcMessagesSent: 0,
    webrtcMessagesReceived: 0,
    mcpMessagesSent: 0,
    mcpMessagesReceived: 0,
    totalFailedMessages: 0,
    fallbackCount: 0,
    reconnectCount: 0,
  };

  constructor(config: CommunicationConfig) {
    this.config = {
      ...config,
      preferWebRTC: config.preferWebRTC !== undefined ? config.preferWebRTC : true,
      fallbackEnabled: config.fallbackEnabled !== undefined ? config.fallbackEnabled : true,
    };
  }

  /**
   * Initialiser kommunikasjonskontrolleren
   */
  async init(): Promise<boolean> {
    try {
      // Initialiser WebRTC hvis aktivert
      if (this.config.enableWebRTC) {
        await this.initWebRTC();
      }

      // Initialiser MCP hvis aktivert
      if (this.config.enableMCP) {
        await this.initMCP();
      }

      return true;
    } catch (err) {
      console.error('Feil ved initialisering av kommunikasjonskontroller:', err);
      return false;
    }
  }

  /**
   * Initialiser WebRTC-tilkobling
   */
  private async initWebRTC(): Promise<void> {
    this.peerManager = new PeerJSManager(this.config.userId);

    // Sett opp event handlers
    this.peerManager.onData((data) => {
      const { peerId, data: message } = data;
      this.stats.webrtcMessagesReceived++;

      // Varsle alle registrerte message handlers
      this.notifyMessageHandlers(peerId, message);
    });

    // Håndter tilkoblingsendringer
    this.peerManager.onConnectionStateChange = (peerId, state) => {
      if (state === 'connected') {
        console.log(`WebRTC tilkoblet til ${peerId}`);

        // Send eventuelle buffrede meldinger
        this.sendBufferedMessages(peerId);
      } else if (state === 'disconnected' || state === 'failed') {
        console.log(`WebRTC frakoblet fra ${peerId} (${state})`);

        // Forsøk fallback til MCP hvis aktivert
        if (this.config.fallbackEnabled && this.config.enableMCP) {
          console.log(`Fallback til MCP for ${peerId}`);
          this.stats.fallbackCount++;
        }
      }
    };
  }

  /**
   * Initialiser MCP-tilkobling
   */
  private async initMCP(): Promise<void> {
    this.mcpService = new MCPSignalingService(this.config.mcpServerUrl, this.config.authToken);

    // Koble til MCP-serveren
    const connected = await this.mcpService.connect(this.config.userId);

    if (!connected) {
      console.error('Kunne ikke koble til MCP-server');
      throw new Error('MCP connection failed');
    }
  }

  /**
   * Koble til en bruker
   */
  async connectTo(peerId: string): Promise<boolean> {
    try {
      // Forsøk WebRTC-tilkobling hvis aktivert og foretrukket
      if (this.config.enableWebRTC && this.config.preferWebRTC) {
        try {
          if (this.peerManager) {
            await this.peerManager.connect(peerId);
            console.log(`WebRTC tilkoblet til ${peerId}`);
            return true;
          }
        } catch (err) {
          console.error(`WebRTC tilkobling til ${peerId} feilet:`, err);

          // Fallback til MCP hvis aktivert
          if (this.config.fallbackEnabled && this.config.enableMCP) {
            this.stats.fallbackCount++;
            console.log(`Fallback til MCP for ${peerId}`);
            return true;
          }
        }
      }

      // Hvis WebRTC ikke er aktivert eller ikke foretrukket, bruk MCP
      if (this.config.enableMCP && !this.config.preferWebRTC) {
        return true; // MCP krever ikke eksplisitt tilkobling til brukere
      }

      return false;
    } catch (err) {
      console.error(`Tilkobling til ${peerId} feilet:`, err);
      return false;
    }
  }

  /**
   * Send en melding til en bruker
   */
  async sendTo(to: string, message: any, options: MessageOptions = {}): Promise<boolean> {
    try {
      // Generer en meldings-ID for sporing
      const messageId = `${this.config.userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Prøv å sende via WebRTC først hvis foretrukket
      if (this.config.enableWebRTC && this.config.preferWebRTC) {
        if (this.peerManager && this.peerManager.getConnectionState(to) === 'connected') {
          const success = await this.peerManager.send(to, {
            id: messageId,
            from: this.config.userId,
            data: message,
            timestamp: Date.now(),
            via: 'webrtc'
          });

          if (success) {
            this.stats.webrtcMessagesSent++;
            return true;
          }
        }

        // WebRTC feilet, prøv MCP hvis fallback er aktivert
        if (this.config.fallbackEnabled && this.config.enableMCP && this.mcpService) {
          this.stats.fallbackCount++;
          console.log(`Fallback til MCP for sending til ${to}`);

          const success = this.mcpService.sendSignal(this.config.userId, to, {
            id: messageId,
            type: 'message',
            from: this.config.userId,
            data: message,
            timestamp: Date.now(),
            via: 'mcp'
          });

          if (success) {
            this.stats.mcpMessagesSent++;
            return true;
          }
        }
      }
      // Send via MCP direkte hvis foretrukket
      else if (this.config.enableMCP && !this.config.preferWebRTC && this.mcpService) {
        const success = this.mcpService.sendSignal(this.config.userId, to, {
          id: messageId,
          type: 'message',
          from: this.config.userId,
          data: message,
          timestamp: Date.now(),
          via: 'mcp'
        });

        if (success) {
          this.stats.mcpMessagesSent++;
          return true;
        }
      }

      // Buffer melding hvis leveranse er påkrevd
      if (options.requireDelivery) {
        this.bufferFailedMessage(to, message, options);
      }

      this.stats.totalFailedMessages++;
      return false;
    } catch (err) {
      console.error(`Sending av melding til ${to} feilet:`, err);

      // Buffer melding hvis leveranse er påkrevd
      if (options.requireDelivery) {
        this.bufferFailedMessage(to, message, options);
      }

      this.stats.totalFailedMessages++;
      return false;
    }
  }

  /**
   * Buffer en mislykket melding for senere sending
   */
  private bufferFailedMessage(to: string, message: any, options: MessageOptions): void {
    if (!this.failedMessages.has(to)) {
      this.failedMessages.set(to, []);
    }

    this.failedMessages.get(to)!.push({
      to,
      message,
      options,
      timestamp: Date.now()
    });

    console.log(`Melding til ${to} buffret for senere sending`);
  }

  /**
   * Send buffrede meldinger til en bruker
   */
  private async sendBufferedMessages(to: string): Promise<void> {
    if (!this.failedMessages.has(to)) {
      return;
    }

    const messages = this.failedMessages.get(to)!;

    if (messages.length === 0) {
      return;
    }

    console.log(`Sender ${messages.length} buffrede meldinger til ${to}`);

    const remainingMessages: typeof messages = [];

    for (const item of messages) {
      const { message, options } = item;

      // Sjekk om meldingen har utløpt
      if (options.ttl && Date.now() - item.timestamp > options.ttl) {
        console.log(`Buffret melding til ${to} har utløpt`);
        continue;
      }

      const success = await this.sendTo(to, message, options);

      if (!success && options.requireDelivery) {
        remainingMessages.push(item);
      }
    }

    // Oppdater buffer med gjenværende meldinger
    if (remainingMessages.length > 0) {
      this.failedMessages.set(to, remainingMessages);
    } else {
      this.failedMessages.delete(to);
    }
  }

  /**
   * Registrer en message handler
   */
  onMessage(handler: MessageHandler): void {
    const allHandlers = this.messageHandlers.get('*') || [];
    allHandlers.push(handler);
    this.messageHandlers.set('*', allHandlers);
  }

  /**
   * Registrer en message handler for en spesifikk bruker
   */
  onMessageFrom(from: string, handler: MessageHandler): void {
    const handlers = this.messageHandlers.get(from) || [];
    handlers.push(handler);
    this.messageHandlers.set(from, handlers);
  }

  /**
   * Varsle message handlers om en melding
   */
  private notifyMessageHandlers(from: string, message: any): void {
    // Varsle spesifikke handlers for denne brukeren
    const specificHandlers = this.messageHandlers.get(from);
    if (specificHandlers) {
      specificHandlers.forEach(handler => {
        try {
          handler(from, message);
        } catch (err) {
          console.error(`Feil i message handler for ${from}:`, err);
        }
      });
    }

    // Varsle generelle handlers
    const allHandlers = this.messageHandlers.get('*');
    if (allHandlers) {
      allHandlers.forEach(handler => {
        try {
          handler(from, message);
        } catch (err) {
          console.error('Feil i generell message handler:', err);
        }
      });
    }
  }

  /**
   * Koble fra alle tilkoblinger
   */
  disconnect(): void {
    if (this.peerManager) {
      this.peerManager.cleanup();
      this.peerManager = null;
    }

    if (this.mcpService) {
      this.mcpService.disconnect();
      this.mcpService = null;
    }
  }

  /**
   * Hent statistikk
   */
  getStats() {
    return { ...this.stats };
  }

  /**
   * Hent tilkoblingstilstand for en bruker
   */
  getConnectionState(peerId: string): string {
    if (this.peerManager) {
      return this.peerManager.getConnectionState(peerId);
    }

    return 'unknown';
  }

  /**
   * Sjekk om en bruker er tilkoblet via WebRTC
   */
  isConnectedViaWebRTC(peerId: string): boolean {
    return !!(this.peerManager && this.peerManager.getConnectionState(peerId) === 'connected');
  }
}
