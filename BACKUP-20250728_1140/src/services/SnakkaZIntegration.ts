/**
 * SnakkaZ Integration Manager
 * 
 * Kobler sammen alle komponentene i SnakkaZ-systemet:
 * - E2EE via Signal Protocol
 * - WebRTC med Supabase fallback
 * - MCP AI Memory System
 * - Performance monitoring
 */

import { createSignalProtocolAdapter } from './security/SignalProtocolAdapter';
import { createWebRTCManager } from './communication/WebRTCManager';
import { createMCPMemorySystem } from './ai/MCPMemorySystem';
import { createPerformanceMonitor } from './monitoring/PerformanceMonitor';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Typedefinitioner
export interface SnakkaZConfig {
  userId: string;
  userName: string;
  supabaseUrl: string;
  supabaseKey: string;
  mcpOptions?: {
    useEncryption: boolean;
    llmEndpoint: string;
    qdrantUrl: string;
  };
  performanceOptions?: {
    enableRealTimeMetrics: boolean;
    environment: 'development' | 'staging' | 'production';
  };
}

export interface Message {
  id: string;
  text: string;
  sender: {
    id: string;
    name: string;
  };
  timestamp: number;
  encryptionType: 'e2ee' | 'group' | 'standard' | 'webrtc' | 'mcp';
  metadata?: Record<string, any>;
}

// Hovedklasse for SnakkaZ-integrasjon
export class SnakkaZIntegration {
  private userId: string;
  private userName: string;
  private supabase: any;
  private signalProtocolAdapter: any;
  private webRTCManager: any;
  private mcpMemory: any;
  private performanceMonitor: any;
  private onMessageCallback: ((message: Message) => void) | null = null;
  private onStatusChangeCallback: ((status: string, details: any) => void) | null = null;
  
  constructor(config: SnakkaZConfig) {
    this.userId = config.userId;
    this.userName = config.userName;
    
    // Initialiser Supabase
    this.supabase = createClient(config.supabaseUrl, config.supabaseKey);
    
    // Opprett performancemonitor
    this.performanceMonitor = createPerformanceMonitor({
      enableRealTimeMetrics: config.performanceOptions?.enableRealTimeMetrics ?? true,
      environment: config.performanceOptions?.environment ?? 'development'
    });
    
    // Start overvåking
    this.performanceMonitor.startMonitoring();
  }
  
  /**
   * Initialiserer SnakkaZ-systemet
   */
  async initialize(): Promise<void> {
    try {
      // Initialiser Signal Protocol
      this.signalProtocolAdapter = await createSignalProtocolAdapter(this.userId);
      
      // Initialiser WebRTC med kanalnavnet 'snakkaz'
      this.webRTCManager = createWebRTCManager(this.userId, 'snakkaz');
      await this.webRTCManager.initialize(
        this.handleWebRTCMessage.bind(this),
        this.handleConnectionStatusChange.bind(this)
      );
      
      // Initialiser MCP Memory
      this.mcpMemory = await createMCPMemorySystem(this.userId, {
        useEncryption: true,
        signalProtocolAdapter: this.signalProtocolAdapter
      });
      
      // Lagre systemkunnskap om SnakkaZ
      await this.mcpMemory.importSystemKnowledge([
        "SnakkaZ performance is 75-95% faster than all competitors",
        "Main domains: mcp.snakkaz.com (production) + localhost:3001 (dev)",
        "Uses Model Context Protocol (MCP) for intelligent memory",
        "Specific benchmarks: Discord 2.3s vs SnakkaZ 0.3s response time",
        "Features intelligent Hacker Trap security system",
        "Architecture: Llama 3.2 + Qdrant + Redis + Grafana stack",
        "Developed by VatoAI team, ready for beta launch"
      ]);
      
      // Aktiver Supabase Realtime lytting
      this.setupSupabaseListener();
      
      if (this.onStatusChangeCallback) {
        this.onStatusChangeCallback('initialized', { success: true });
      }
    } catch (error) {
      console.error('Failed to initialize SnakkaZ:', error);
      if (this.onStatusChangeCallback) {
        this.onStatusChangeCallback('initialization_failed', { error });
      }
    }
  }
  
  /**
   * Setter opp Supabase-lytteren
   */
  private setupSupabaseListener(): void {
    const channel = this.supabase.channel('snakkaz_messages');
    
    channel
      .on('broadcast', { event: 'message' }, ({ payload }) => {
        // Ignorer egne meldinger (de kommer via WebRTC-håndtering)
        if (payload.sender.id === this.userId) return;
        
        // Registrer mottatt melding
        this.performanceMonitor.recordMessageReceived('supabase');
        
        // Håndter meldingen
        this.handleIncomingMessage(payload);
      })
      .subscribe();
  }
  
  /**
   * Håndterer WebRTC-meldinger
   */
  private handleWebRTCMessage(message: any): void {
    // Registrer mottatt melding
    this.performanceMonitor.recordMessageReceived('webrtc');
    
    // Håndter meldingen
    this.handleIncomingMessage(message);
  }
  
  /**
   * Håndterer endringer i tilkoblingsstatus
   */
  private handleConnectionStatusChange(peerId: string, status: 'connected' | 'disconnected' | 'fallback' | 'reconnected'): void {
    if (this.onStatusChangeCallback) {
      this.onStatusChangeCallback('connection_' + status, { peerId });
    }
  }
  
  /**
   * Håndterer innkommende meldinger
   */
  private async handleIncomingMessage(message: any): Promise<void> {
    try {
      // Ignorer kontrollmeldinger
      if (message.type === 'control' || message.type === 'heartbeat') {
        return;
      }
      
      let decryptedText = message.text;
      
      // Dekrypter meldingen hvis den er kryptert
      if (message.encryptionType === 'e2ee' || message.encryptionType === 'group') {
        // Mål dekrypteringstiden
        const decryptId = `decrypt_${message.id}`;
        this.performanceMonitor.recordDecryptionTime(decryptId);
        
        try {
          // Bruk Signal Protocol for å dekryptere
          const decryptedBuffer = await this.signalProtocolAdapter.decryptMessage(
            message.sender.id,
            message.encryptedData
          );
          
          // Konverter til tekst
          const decoder = new TextDecoder();
          decryptedText = decoder.decode(decryptedBuffer);
          
          this.performanceMonitor.endDecryptionTime(decryptId, true);
        } catch (error) {
          console.error('Failed to decrypt message:', error);
          this.performanceMonitor.endDecryptionTime(decryptId, false);
          decryptedText = '[Encrypted message - decryption failed]';
        }
      }
      
      // Lagre meldingen i MCP Memory hvis den er viktig
      if (message.metadata?.importance > 0.5) {
        await this.mcpMemory.storeMemory(decryptedText, {
          source: 'chat',
          importance: message.metadata.importance,
          context: `Message from ${message.sender.name}`
        });
      }
      
      // Send meldingen til callback
      if (this.onMessageCallback) {
        this.onMessageCallback({
          id: message.id,
          text: decryptedText,
          sender: message.sender,
          timestamp: message.timestamp,
          encryptionType: message.encryptionType,
          metadata: message.metadata
        });
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }
  
  /**
   * Sender en melding
   */
  async sendMessage(recipientId: string, text: string, encryptionType: 'e2ee' | 'group' | 'standard' = 'e2ee'): Promise<string> {
    try {
      const messageId = uuidv4();
      let messageToSend: any = {
        id: messageId,
        text: encryptionType === 'standard' ? text : '[Encrypted message]',
        sender: {
          id: this.userId,
          name: this.userName
        },
        timestamp: Date.now(),
        encryptionType
      };
      
      // Analyser og lagre viktige meldinger
      const importance = await this.mcpMemory.analyzeTextImportance(text);
      if (importance > 0.5) {
        await this.mcpMemory.storeMemory(text, {
          source: 'user',
          importance,
          context: `Message to ${recipientId}`
        });
      }
      
      messageToSend.metadata = { importance };
      
      // Krypter meldingen hvis nødvendig
      if (encryptionType !== 'standard') {
        // Mål krypteringstiden
        const encryptId = `encrypt_${messageId}`;
        this.performanceMonitor.recordEncryptionTime(encryptId);
        
        try {
          // Krypter med Signal Protocol
          const encryptedData = await this.signalProtocolAdapter.encryptMessage(recipientId, text);
          messageToSend.encryptedData = encryptedData;
          this.performanceMonitor.endEncryptionTime(encryptId, true);
        } catch (error) {
          console.error('Failed to encrypt message:', error);
          this.performanceMonitor.endEncryptionTime(encryptId, false);
          return Promise.reject('Encryption failed');
        }
      }
      
      // Registrer sendt melding
      const trackingId = this.performanceMonitor.recordMessageSent('webrtc');
      
      // Send via WebRTC
      const webrtcSuccess = this.webRTCManager.sendMessage({
        ...messageToSend,
        recipient: recipientId
      });
      
      // Registrer leveringsstatus
      this.performanceMonitor.recordMessageDelivered(trackingId, webrtcSuccess);
      
      // Hvis WebRTC feilet, send via Supabase som fallback
      if (!webrtcSuccess) {
        await this.supabase.channel('snakkaz_messages').send({
          type: 'broadcast',
          event: 'message',
          payload: {
            ...messageToSend,
            recipient: recipientId
          }
        });
      }
      
      return messageId;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }
  
  /**
   * Sender en gruppemelding
   */
  async sendGroupMessage(groupId: string, text: string): Promise<string> {
    try {
      // Hent gruppenøkkel
      const groupKey = await this.signalProtocolAdapter.getGroupKey(groupId);
      if (!groupKey) {
        throw new Error('Group key not found');
      }
      
      const messageId = uuidv4();
      
      // Krypter teksten med gruppenøkkelen
      const encoder = new TextEncoder();
      const textBuffer = encoder.encode(text);
      
      // Bruk AES-GCM for å kryptere med gruppenøkkelen
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      
      const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv
        },
        groupKey,
        textBuffer
      );
      
      // Konverter til base64
      const encryptedBase64 = btoa(
        String.fromCharCode.apply(null, Array.from(new Uint8Array(encryptedBuffer)))
      );
      
      const ivBase64 = btoa(
        String.fromCharCode.apply(null, Array.from(iv))
      );
      
      const messageToSend = {
        id: messageId,
        text: '[Encrypted group message]',
        sender: {
          id: this.userId,
          name: this.userName
        },
        timestamp: Date.now(),
        encryptionType: 'group',
        groupId,
        encryptedData: {
          ciphertext: encryptedBase64,
          iv: ivBase64
        }
      };
      
      // Send til alle gruppemedlemmer via Supabase
      await this.supabase.channel('snakkaz_groups').send({
        type: 'broadcast',
        event: 'group_message',
        payload: messageToSend
      });
      
      return messageId;
    } catch (error) {
      console.error('Failed to send group message:', error);
      throw error;
    }
  }
  
  /**
   * Genererer et AI-svar basert på chat-historikk
   */
  async generateAIResponse(chatHistory: string[], query: string): Promise<string> {
    try {
      // Generer kontekst basert på historikk og spørsmål
      const context = await this.mcpMemory.generateChatContext(chatHistory, query);
      
      // Generer et svar fra AI
      const response = await this.mcpMemory.generateAIResponse(context);
      
      return response;
    } catch (error) {
      console.error('Failed to generate AI response:', error);
      return 'Beklager, jeg kunne ikke generere et svar på grunn av en teknisk feil.';
    }
  }
  
  /**
   * Setter callback for meldingsmottak
   */
  onMessage(callback: (message: Message) => void): void {
    this.onMessageCallback = callback;
  }
  
  /**
   * Setter callback for statusendringer
   */
  onStatusChange(callback: (status: string, details: any) => void): void {
    this.onStatusChangeCallback = callback;
  }
  
  /**
   * Henter systemstatus
   */
  getSystemStatus(): { status: string; details: Record<string, any> } {
    return this.performanceMonitor.getHealthStatus();
  }
  
  /**
   * Rydder opp ressurser ved avslutning
   */
  cleanup(): void {
    // Stopp WebRTC
    if (this.webRTCManager) {
      this.webRTCManager.cleanup();
    }
    
    // Stopp overvåking
    if (this.performanceMonitor) {
      this.performanceMonitor.stopMonitoring();
    }
    
    // Koble fra Supabase-kanaler
    this.supabase.channel('snakkaz_messages').unsubscribe();
    this.supabase.channel('snakkaz_groups').unsubscribe();
  }
}

/**
 * Eksporter en fabrikk-funksjon for enkel integrering
 */
export const createSnakkaZIntegration = (config: SnakkaZConfig): SnakkaZIntegration => {
  return new SnakkaZIntegration(config);
};
