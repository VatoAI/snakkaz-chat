/**
 * SnakkaZ WebRTC Manager
 * 
 * Implementerer WebRTC-kommunikasjon med automatisk fallback til Supabase Realtime.
 * Gir lavlatenskommunikasjon via peer-to-peer-tilkoblinger når tilgjengelig.
 */

import SimplePeer from 'simple-peer';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { EncryptedMessage } from '../../utils/crypto/e2ee';

// Supabase-klient
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL || '',
  process.env.REACT_APP_SUPABASE_ANON_KEY || ''
);

// Konstanter
const PING_INTERVAL = 15000; // 15 sekunder
const RECONNECT_TIMEOUT = 5000; // 5 sekunder

// Typedefinitioner
export interface PeerMessage {
  id: string;
  type: 'message' | 'control' | 'heartbeat';
  payload: EncryptedMessage | any;
  timestamp: number;
  sender: string;
  recipient?: string;
}

export interface PeerConnection {
  peer: SimplePeer.Instance;
  connected: boolean;
  lastActivity: number;
  pending: PeerMessage[];
  transport: 'webrtc' | 'supabase' | 'hybrid';
  stats: {
    sent: number;
    received: number;
    failed: number;
    latency: number[];
  };
}

export interface TransportStats {
  webrtcSuccessRate: number;
  averageLatency: number;
  messagesSent: number;
  messagesReceived: number;
  activeConnections: number;
}

/**
 * WebRTCManager klasse for å håndtere WebRTC-kommunikasjon
 */
export class WebRTCManager {
  private peers: Map<string, PeerConnection> = new Map();
  private userId: string;
  private channelName: string;
  private onMessageCallback: (message: PeerMessage) => void;
  private onStatusChangeCallback: (peerId: string, status: 'connected' | 'disconnected' | 'fallback' | 'reconnected') => void;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private reconnectAttempts: Map<string, number> = new Map();
  private defaultConfig: SimplePeer.Options = {
    trickle: true,
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478' },
        {
          urls: 'turn:numb.viagenie.ca',
          username: 'webrtc@live.com',
          credential: 'muazkh'
        }
      ]
    }
  };
  
  constructor(userId: string, channelName: string, options?: SimplePeer.Options) {
    this.userId = userId;
    this.channelName = channelName;
    
    if (options) {
      this.defaultConfig = { ...this.defaultConfig, ...options };
    }
  }

  /**
   * Initialiserer WebRTC-manager og setter opp Supabase Realtime lytting
   */
  async initialize(
    onMessageCallback: (message: PeerMessage) => void,
    onStatusChangeCallback?: (peerId: string, status: 'connected' | 'disconnected' | 'fallback' | 'reconnected') => void
  ): Promise<void> {
    this.onMessageCallback = onMessageCallback;
    this.onStatusChangeCallback = onStatusChangeCallback || (() => {});
    
    // Abonner på Supabase Realtime for signalering og fallback
    const rtcChannel = supabase.channel(`rtc:${this.channelName}`);
    
    rtcChannel
      .on('broadcast', { event: 'signal' }, ({ payload }) => {
        this.handleSignal(payload);
      })
      .on('broadcast', { event: 'request_connection' }, ({ payload }) => {
        if (payload.target === this.userId) {
          this.createPeer(payload.sender, false);
        }
      })
      .subscribe();
    
    // Abonner på meldingskanalen for fallback
    const chatChannel = supabase.channel(`chat:${this.channelName}`);
    
    chatChannel
      .on('broadcast', { event: 'message' }, ({ payload }) => {
        if (payload.recipient === this.userId) {
          this.handleSupabaseFallbackMessage(payload);
        }
      })
      .subscribe();
    
    // Start heartbeat
    this.heartbeatInterval = setInterval(() => this.sendHeartbeats(), PING_INTERVAL);
  }

  /**
   * Kobler til en spesifikk bruker
   */
  connectTo(recipientId: string): void {
    // Hvis vi allerede er tilkoblet, gjør ingenting
    const existingPeer = this.peers.get(recipientId);
    if (existingPeer && existingPeer.connected) return;
    
    // Send en tilkoblingsforespørsel
    supabase.channel(`rtc:${this.channelName}`).send({
      type: 'broadcast',
      event: 'request_connection',
      payload: {
        sender: this.userId,
        target: recipientId,
        timestamp: new Date().toISOString()
      }
    });
    
    // Opprett en peer som initiator
    this.createPeer(recipientId, true);
  }

  /**
   * Oppretter en WebRTC peer
   */
  private createPeer(peerId: string, initiator: boolean): PeerConnection {
    // Hvis peer allerede eksisterer, returner den
    const existingPeer = this.peers.get(peerId);
    if (existingPeer) return existingPeer;
    
    // Opprett en ny peer
    const peer = new SimplePeer({
      ...this.defaultConfig,
      initiator
    });
    
    // Opprett en ny tilkobling
    const connection: PeerConnection = {
      peer,
      connected: false,
      lastActivity: Date.now(),
      pending: [],
      transport: 'supabase', // Start med Supabase til WebRTC er tilkoblet
      stats: {
        sent: 0,
        received: 0,
        failed: 0,
        latency: []
      }
    };
    
    // Håndter signalering
    peer.on('signal', data => {
      supabase.channel(`rtc:${this.channelName}`).send({
        type: 'broadcast',
        event: 'signal',
        payload: {
          signal: data,
          sender: this.userId,
          target: peerId
        }
      });
    });
    
    // Håndter tilkobling
    peer.on('connect', () => {
      console.log(`WebRTC connected to ${peerId}`);
      connection.connected = true;
      connection.transport = 'webrtc';
      connection.lastActivity = Date.now();
      this.onStatusChangeCallback(peerId, 'connected');
      
      // Send ventende meldinger
      if (connection.pending.length > 0) {
        const pendingMessages = [...connection.pending];
        connection.pending = [];
        
        pendingMessages.forEach(message => {
          this.sendMessage(message);
        });
      }
      
      // Nullstill gjenoppkoblingsforsøk
      this.reconnectAttempts.delete(peerId);
    });
    
    // Håndter innkommende data
    peer.on('data', data => {
      try {
        const message: PeerMessage = JSON.parse(data.toString());
        connection.lastActivity = Date.now();
        connection.stats.received++;
        
        // Beregn latency hvis dette er et svar på en heartbeat
        if (message.type === 'heartbeat' && message.payload.isResponse) {
          const latency = Date.now() - message.payload.timestamp;
          connection.stats.latency.push(latency);
          
          // Behold bare de siste 10 målingene
          if (connection.stats.latency.length > 10) {
            connection.stats.latency.shift();
          }
        } else {
          this.onMessageCallback(message);
          
          // Send kvittering for vanlige meldinger
          if (message.type === 'message') {
            this.sendReceipt(message.id, peerId);
          }
        }
      } catch (err) {
        console.error('Failed to parse WebRTC message:', err);
      }
    });
    
    // Håndter feil
    peer.on('error', err => {
      console.error(`WebRTC peer error with ${peerId}:`, err);
      
      // Hvis vi ikke har vært tilkoblet, bruk Supabase
      if (!connection.connected) {
        connection.transport = 'supabase';
      } else {
        // Ellers, gå til hybrid modus mens vi prøver å koble til igjen
        connection.transport = 'hybrid';
        connection.connected = false;
        this.onStatusChangeCallback(peerId, 'fallback');
      }
      
      // Prøv å koble til igjen
      this.scheduleReconnect(peerId);
    });
    
    // Håndter lukking
    peer.on('close', () => {
      console.log(`WebRTC connection closed with ${peerId}`);
      connection.connected = false;
      connection.transport = 'supabase';
      this.onStatusChangeCallback(peerId, 'disconnected');
      
      // Prøv å koble til igjen
      this.scheduleReconnect(peerId);
    });
    
    // Lagre tilkoblingen
    this.peers.set(peerId, connection);
    
    return connection;
  }

  /**
   * Planlegger en gjenoppkobling til en peer
   */
  private scheduleReconnect(peerId: string): void {
    // Øk antall forsøk
    const attempts = this.reconnectAttempts.get(peerId) || 0;
    this.reconnectAttempts.set(peerId, attempts + 1);
    
    // Beregn timeout med eksponensiell backoff
    const timeout = Math.min(30000, RECONNECT_TIMEOUT * Math.pow(1.5, attempts));
    
    // Planlegg gjenoppkobling
    setTimeout(() => {
      const connection = this.peers.get(peerId);
      if (connection && !connection.connected) {
        this.connectTo(peerId);
      }
    }, timeout);
  }

  /**
   * Håndterer signaleringsinformasjon for WebRTC
   */
  private handleSignal(payload: any): void {
    // Ignorer signaler som ikke er for oss
    if (payload.target !== this.userId) return;
    
    const senderId = payload.sender;
    const signalData = payload.signal;
    
    // Opprett peer hvis den ikke eksisterer
    let connection = this.peers.get(senderId);
    if (!connection) {
      connection = this.createPeer(senderId, false);
    }
    
    // Send signaldata til peer
    try {
      connection.peer.signal(signalData);
    } catch (error) {
      console.error('Error handling signal:', error);
    }
  }

  /**
   * Send en melding
   */
  sendMessage(message: PeerMessage): boolean {
    const recipientId = message.recipient;
    if (!recipientId) return false;
    
    // Hent tilkoblingen
    let connection = this.peers.get(recipientId);
    if (!connection) {
      connection = this.createPeer(recipientId, true);
    }
    
    try {
      // Hvis WebRTC er tilkoblet, bruk det
      if (connection.connected) {
        connection.peer.send(JSON.stringify(message));
        connection.stats.sent++;
        connection.lastActivity = Date.now();
        return true;
      } else {
        // Ellers, legg til i ventende eller send via Supabase
        if (connection.transport === 'supabase' || connection.transport === 'hybrid') {
          this.sendMessageViaSupabase(message);
        } else {
          connection.pending.push(message);
        }
        return connection.transport !== 'supabase'; // Returner true hvis vi ikke bruker ren Supabase
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      connection.stats.failed++;
      
      // Fallback til Supabase
      this.sendMessageViaSupabase(message);
      return false;
    }
  }

  /**
   * Send en kvittering for en melding
   */
  private sendReceipt(messageId: string, recipientId: string): void {
    const receipt: PeerMessage = {
      id: uuidv4(),
      type: 'control',
      payload: {
        action: 'receipt',
        messageId
      },
      timestamp: Date.now(),
      sender: this.userId,
      recipient: recipientId
    };
    
    this.sendMessage(receipt);
  }

  /**
   * Fallback-metode som sender melding via Supabase Realtime
   */
  private async sendMessageViaSupabase(message: PeerMessage): Promise<void> {
    await supabase.channel(`chat:${this.channelName}`).send({
      type: 'broadcast',
      event: 'message',
      payload: {
        ...message,
        transport: 'supabase_fallback'
      }
    });
  }

  /**
   * Håndterer en melding som kommer via Supabase fallback
   */
  private handleSupabaseFallbackMessage(payload: any): void {
    // Ignorer meldinger fra oss selv
    if (payload.sender === this.userId) return;
    
    // Oppdater statistikk
    const connection = this.peers.get(payload.sender);
    if (connection) {
      connection.stats.received++;
      connection.lastActivity = Date.now();
    }
    
    // Send meldingen til callback
    this.onMessageCallback(payload);
  }

  /**
   * Sender heartbeats til alle tilkoblede peers
   */
  private sendHeartbeats(): void {
    this.peers.forEach((connection, peerId) => {
      // Sjekk om tilkoblingen er aktiv
      const now = Date.now();
      const inactive = now - connection.lastActivity > PING_INTERVAL * 2;
      
      if (connection.connected) {
        // Send heartbeat
        const heartbeat: PeerMessage = {
          id: uuidv4(),
          type: 'heartbeat',
          payload: {
            timestamp: now,
            isResponse: false
          },
          timestamp: now,
          sender: this.userId,
          recipient: peerId
        };
        
        try {
          connection.peer.send(JSON.stringify(heartbeat));
        } catch (err) {
          console.error('Failed to send heartbeat:', err);
          connection.stats.failed++;
        }
        
        // Hvis tilkoblingen har vært inaktiv for lenge, prøv å koble til igjen
        if (inactive) {
          console.warn(`Connection to ${peerId} seems inactive, attempting to reconnect`);
          connection.connected = false;
          connection.transport = 'hybrid';
          this.onStatusChangeCallback(peerId, 'disconnected');
          this.scheduleReconnect(peerId);
        }
      } else if (inactive) {
        // Hvis tilkoblingen er inaktiv og ikke tilkoblet, prøv å koble til igjen
        this.scheduleReconnect(peerId);
      }
    });
  }

  /**
   * Henter transportstatistikk
   */
  getTransportStats(): TransportStats {
    let totalWebRTCMessages = 0;
    let totalSupabaseMessages = 0;
    let totalLatency = 0;
    let latencyCount = 0;
    let activeConnections = 0;
    let totalSent = 0;
    let totalReceived = 0;
    
    this.peers.forEach(connection => {
      if (connection.connected) {
        activeConnections++;
      }
      
      totalSent += connection.stats.sent;
      totalReceived += connection.stats.received;
      
      if (connection.transport === 'webrtc') {
        totalWebRTCMessages += connection.stats.sent;
      } else {
        totalSupabaseMessages += connection.stats.sent;
      }
      
      if (connection.stats.latency.length > 0) {
        totalLatency += connection.stats.latency.reduce((a, b) => a + b, 0);
        latencyCount += connection.stats.latency.length;
      }
    });
    
    const totalMessages = totalWebRTCMessages + totalSupabaseMessages;
    const webrtcSuccessRate = totalMessages > 0 ? totalWebRTCMessages / totalMessages : 0;
    const averageLatency = latencyCount > 0 ? totalLatency / latencyCount : 0;
    
    return {
      webrtcSuccessRate,
      averageLatency,
      messagesSent: totalSent,
      messagesReceived: totalReceived,
      activeConnections
    };
  }

  /**
   * Rydder opp alle tilkoblinger
   */
  cleanup(): void {
    // Stopp heartbeat
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    // Lukk alle peers
    this.peers.forEach(connection => {
      connection.peer.destroy();
    });
    this.peers.clear();
    
    // Avslutt Supabase-abonnementer
    supabase.channel(`rtc:${this.channelName}`).unsubscribe();
    supabase.channel(`chat:${this.channelName}`).unsubscribe();
  }
}

/**
 * Eksporter en enkel versjon for integrering med eksisterende chat-tjeneste
 */
export const createWebRTCManager = (userId: string, channelName: string): WebRTCManager => {
  return new WebRTCManager(userId, channelName);
};
