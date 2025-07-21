import Peer, { DataConnection } from 'peerjs';
import pRetry from 'p-retry';
import pTimeout from 'p-timeout';
import * as uint8arrays from 'uint8arrays';
import { EventEmitter } from 'events';
import raceEvent from 'race-event';

export interface PeerJSConfig {
  host?: string;
  port?: number;
  path?: string;
  secure?: boolean;
  debug?: number;
  config?: RTCConfiguration;
}

export interface PeerConnectionStats {
  connected: boolean;
  reliable: boolean;
  latency: number | null;
  connectionType: string;
  bytesReceived?: number;
  bytesSent?: number;
  lastMessageTime?: number;
}

export type ConnectionState = 'connected' | 'connecting' | 'disconnected' | 'failed' | 'closed';
export type DataChannelState = 'open' | 'connecting' | 'closing' | 'closed';

export class PeerJSManager {
  private peer: Peer | null = null;
  private connections: Map<string, DataConnection> = new Map();
  private events = new EventEmitter();
  private stats: Map<string, PeerConnectionStats> = new Map();
  private pingIntervals: Map<string, NodeJS.Timeout> = new Map();
  private pingTimestamps: Map<string, number> = new Map();
  
  // Event handlers
  public onConnectionStateChange: ((peerId: string, state: ConnectionState) => void) | null = null;
  public onDataChannelStateChange: ((peerId: string, state: DataChannelState) => void) | null = null;
  
  constructor(
    private userId: string,
    private config: PeerJSConfig = {}
  ) {
    this.initializePeer();
  }
  
  private initializePeer() {
    try {
      // Default config with STUN/TURN servers
      const defaultConfig: PeerJSConfig = {
        debug: process.env.NODE_ENV === 'development' ? 3 : 0,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
            { 
              urls: 'turn:turn.snakkaz.com:3478',
              username: 'snakkaz', 
              credential: 'turnserver' 
            }
          ],
          iceCandidatePoolSize: 10,
          sdpSemantics: 'unified-plan'
        }
      };
      
      const mergedConfig = { ...defaultConfig, ...this.config };
      
      this.peer = new Peer(this.userId, mergedConfig);
      
      this.peer.on('open', (id) => {
        console.log('SnakkaZ PeerJS initialized with ID:', id);
        this.events.emit('ready', id);
      });
      
      this.peer.on('connection', (conn) => {
        this.handleIncomingConnection(conn);
      });
      
      this.peer.on('error', (err) => {
        console.error('SnakkaZ PeerJS error:', err);
        this.events.emit('error', err);
      });
      
      this.peer.on('disconnected', () => {
        console.log('SnakkaZ PeerJS disconnected');
        this.events.emit('disconnected');
        
        // Try to reconnect
        setTimeout(() => {
          this.peer?.reconnect();
        }, 1000);
      });
      
      this.peer.on('close', () => {
        console.log('SnakkaZ PeerJS connection closed');
        this.events.emit('closed');
        this.cleanupConnections();
      });
    } catch (error) {
      console.error('Failed to initialize PeerJS:', error);
      this.events.emit('error', error);
    }
  }
  
  private handleIncomingConnection(conn: DataConnection) {
    console.log(`SnakkaZ PeerJS incoming connection from ${conn.peer}`);
    
    // Store the connection
    this.connections.set(conn.peer, conn);
    
    // Initialize connection stats
    this.stats.set(conn.peer, {
      connected: false,
      reliable: conn.reliable,
      latency: null,
      connectionType: 'incoming',
      lastMessageTime: Date.now()
    });
    
    // Set up connection event handlers
    this.setupConnectionHandlers(conn);
    
    // Notify about the new connection
    this.events.emit('connection', conn.peer);
  }
  
  private setupConnectionHandlers(conn: DataConnection) {
    conn.on('open', () => {
      console.log(`SnakkaZ PeerJS connection opened with ${conn.peer}`);
      
      // Update connection stats
      const currentStats = this.stats.get(conn.peer) || {
        connected: false,
        reliable: conn.reliable,
        latency: null,
        connectionType: 'unknown'
      };
      
      this.stats.set(conn.peer, {
        ...currentStats,
        connected: true
      });
      
      // Start ping measurements for latency
      this.startPingMeasurements(conn.peer);
      
      // Notify state change
      if (this.onConnectionStateChange) {
        this.onConnectionStateChange(conn.peer, 'connected');
      }
      
      if (this.onDataChannelStateChange) {
        this.onDataChannelStateChange(conn.peer, 'open');
      }
      
      this.events.emit('connection:open', conn.peer);
    });
    
    conn.on('data', (data) => {
      // Update last message time for connection health tracking
      const currentStats = this.stats.get(conn.peer);
      if (currentStats) {
        this.stats.set(conn.peer, {
          ...currentStats,
          lastMessageTime: Date.now()
        });
      }
      
      // Handle ping messages internally
      if (typeof data === 'object' && data !== null && 'type' in data) {
        if (data.type === 'ping') {
          // Respond to pings immediately
          conn.send({ type: 'pong', id: data.id, timestamp: data.timestamp });
          return;
        } else if (data.type === 'pong' && data.id && data.timestamp) {
          // Calculate latency from ping-pong
          const latency = Date.now() - Number(data.timestamp);
          const currentStats = this.stats.get(conn.peer);
          if (currentStats) {
            this.stats.set(conn.peer, {
              ...currentStats,
              latency
            });
          }
          return;
        }
      }
      
      // Process actual message data
      this.events.emit('data', {
        peerId: conn.peer,
        data
      });
    });
    
    conn.on('close', () => {
      console.log(`SnakkaZ PeerJS connection closed with ${conn.peer}`);
      
      // Stop ping measurements
      this.stopPingMeasurements(conn.peer);
      
      // Remove the connection
      this.connections.delete(conn.peer);
      
      // Update stats
      const currentStats = this.stats.get(conn.peer);
      if (currentStats) {
        this.stats.set(conn.peer, {
          ...currentStats,
          connected: false
        });
      }
      
      // Notify state change
      if (this.onConnectionStateChange) {
        this.onConnectionStateChange(conn.peer, 'closed');
      }
      
      if (this.onDataChannelStateChange) {
        this.onDataChannelStateChange(conn.peer, 'closed');
      }
      
      this.events.emit('connection:closed', conn.peer);
    });
    
    conn.on('error', (err) => {
      console.error(`SnakkaZ PeerJS connection error with ${conn.peer}:`, err);
      
      // Update stats
      const currentStats = this.stats.get(conn.peer);
      if (currentStats) {
        this.stats.set(conn.peer, {
          ...currentStats,
          connected: false
        });
      }
      
      // Notify state change
      if (this.onConnectionStateChange) {
        this.onConnectionStateChange(conn.peer, 'failed');
      }
      
      this.events.emit('connection:error', { peerId: conn.peer, error: err });
    });
  }
  
  private startPingMeasurements(peerId: string) {
    // Stop any existing interval
    this.stopPingMeasurements(peerId);
    
    // Start a new ping interval
    const interval = setInterval(() => {
      const conn = this.connections.get(peerId);
      if (conn && conn.open) {
        const pingId = Math.random().toString(36).substring(2, 15);
        const timestamp = Date.now();
        
        // Store timestamp for this ping ID
        this.pingTimestamps.set(pingId, timestamp);
        
        // Send ping
        conn.send({
          type: 'ping',
          id: pingId,
          timestamp
        });
        
        // Clean up old ping timestamp after timeout
        setTimeout(() => {
          this.pingTimestamps.delete(pingId);
        }, 10000);
      }
    }, 5000);
    
    this.pingIntervals.set(peerId, interval);
  }
  
  private stopPingMeasurements(peerId: string) {
    const interval = this.pingIntervals.get(peerId);
    if (interval) {
      clearInterval(interval);
      this.pingIntervals.delete(peerId);
    }
  }
  
  public async connect(peerId: string): Promise<DataConnection> {
    // Check if we're already connected
    const existingConn = this.connections.get(peerId);
    if (existingConn && existingConn.open) {
      return existingConn;
    }
    
    // Make sure peer is initialized
    if (!this.peer) {
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout waiting for PeerJS to initialize'));
        }, 10000);
        
        this.events.once('ready', () => {
          clearTimeout(timeout);
          resolve();
        });
        
        this.events.once('error', (err) => {
          clearTimeout(timeout);
          reject(err);
        });
        
        // If not initialized yet, try to initialize
        if (!this.peer) {
          this.initializePeer();
        }
      });
    }
    
    if (!this.peer) {
      throw new Error('PeerJS failed to initialize');
    }
    
    try {
      // Try to establish connection with retries
      return await pRetry(async () => {
        // Update connection state to connecting
        if (this.onConnectionStateChange) {
          this.onConnectionStateChange(peerId, 'connecting');
        }
        
        const conn = this.peer!.connect(peerId, {
          reliable: true,
          serialization: 'json'
        });
        
        this.connections.set(peerId, conn);
        
        // Initialize connection stats
        this.stats.set(peerId, {
          connected: false,
          reliable: conn.reliable,
          latency: null,
          connectionType: 'outgoing'
        });
        
        // Wait for connection to open with timeout
        await pTimeout(
          new Promise<void>((resolve, reject) => {
            // Set up handlers for this connection
            this.setupConnectionHandlers(conn);
            
            // Handle specific connection success/failure for this promise
            const onOpen = () => {
              conn.off('error', onError);
              resolve();
            };
            
            const onError = (err: Error) => {
              conn.off('open', onOpen);
              reject(err);
            };
            
            conn.once('open', onOpen);
            conn.once('error', onError);
            
            // Also resolve if we get the open event through our event emitter
            const openListener = (openPeerId: string) => {
              if (openPeerId === peerId) {
                this.events.off('connection:open', openListener);
                resolve();
              }
            };
            
            this.events.on('connection:open', openListener);
          }),
          10000, // 10 seconds timeout
          () => {
            throw new Error(`Connection timeout to peer ${peerId}`);
          }
        );
        
        return conn;
      }, {
        retries: 3,
        onFailedAttempt: (error) => {
          console.warn(`Connection attempt ${error.attemptNumber} to peer ${peerId} failed. ${error.retriesLeft} retries left.`);
        }
      });
    } catch (error) {
      console.error(`Failed to connect to peer ${peerId} after retries:`, error);
      
      // Update connection state
      if (this.onConnectionStateChange) {
        this.onConnectionStateChange(peerId, 'failed');
      }
      
      throw error;
    }
  }
  
  public async send(peerId: string, data: any): Promise<boolean> {
    try {
      // Get existing connection or create a new one
      let conn = this.connections.get(peerId);
      
      if (!conn || !conn.open) {
        conn = await this.connect(peerId);
      }
      
      if (conn && conn.open) {
        conn.send(data);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Failed to send data to peer ${peerId}:`, error);
      return false;
    }
  }
  
  public broadcast(data: any): void {
    for (const [peerId, conn] of this.connections.entries()) {
      if (conn.open) {
        try {
          conn.send(data);
        } catch (error) {
          console.error(`Error broadcasting to peer ${peerId}:`, error);
        }
      }
    }
  }
  
  public disconnect(peerId: string): void {
    const conn = this.connections.get(peerId);
    if (conn) {
      this.stopPingMeasurements(peerId);
      conn.close();
      this.connections.delete(peerId);
      this.stats.delete(peerId);
    }
  }
  
  public disconnectAll(): void {
    // Close all connections
    for (const [peerId, conn] of this.connections.entries()) {
      this.stopPingMeasurements(peerId);
      conn.close();
    }
    
    this.connections.clear();
    this.stats.clear();
    
    // Close the peer connection
    if (this.peer && !this.peer.destroyed) {
      this.peer.destroy();
      this.peer = null;
    }
  }
  
  public getPeerId(): string | null {
    return this.peer?.id || null;
  }
  
  public getPeerIds(): string[] {
    return Array.from(this.connections.keys());
  }
  
  public getConnectionState(peerId: string): ConnectionState {
    const conn = this.connections.get(peerId);
    if (!conn) return 'disconnected';
    
    if (conn.open) return 'connected';
    return 'disconnected'; // Simple state for PeerJS
  }
  
  public getDataChannelState(peerId: string): DataChannelState {
    const conn = this.connections.get(peerId);
    if (!conn) return 'closed';
    
    if (conn.open) return 'open';
    return 'closed'; // Simple state for PeerJS
  }
  
  public getConnectionStats(peerId: string): PeerConnectionStats | null {
    return this.stats.get(peerId) || null;
  }
  
  public getAllConnectionStats(): Map<string, PeerConnectionStats> {
    return new Map(this.stats);
  }
  
  public onReady(callback: (id: string) => void): void {
    this.events.on('ready', callback);
  }
  
  public onData(callback: (data: { peerId: string; data: any }) => void): void {
    this.events.on('data', callback);
  }
  
  public cleanup(): void {
    this.disconnectAll();
    this.events.removeAllListeners();
  }
  
  // Helper methods for reconnection
  private cleanupConnections(): void {
    // Clean up all connections
    for (const peerId of this.connections.keys()) {
      this.stopPingMeasurements(peerId);
    }
    
    this.connections.clear();
    this.stats.clear();
    this.pingIntervals.clear();
    this.pingTimestamps.clear();
  }
  
  public isPeerReady(peerId: string): boolean {
    const conn = this.connections.get(peerId);
    return !!conn && conn.open;
  }
  
  public async ensurePeerReady(peerId: string): Promise<boolean> {
    try {
      if (this.isPeerReady(peerId)) {
        return true;
      }
      
      await this.connect(peerId);
      return true;
    } catch (error) {
      console.error(`Failed to ensure peer ${peerId} is ready:`, error);
      return false;
    }
  }
}
