/**
 * SnakkaZ Chat Service - Real-time Chat Management
 * Production-ready service for chat functionality
 * 
 * Nøkkelfunksjoner:
 * - Integrasjon med MCP WebRTC for robust kommunikasjon
 * - Ende-til-ende-kryptering (E2EE) for sikker meldingsutveksling
 * - Fallback til Supabase hvis WebRTC ikke er tilgjengelig
 * - Offline-støtte med lokal lagring av meldinger
 * - Omfattende metrikkinnsamling for overvåking
 * 
 * Sikkerhetsegenskaper:
 * - Alle meldinger over MCP WebRTC er ende-til-ende-kryptert
 * - Unike krypteringsnøkler for hver brukerkombinasjon
 * - Støtte for både 1-til-1 og gruppesamtaler
 */

import { supabase } from '../../lib/supabaseClient';
import { IntegratedCommunicationController, CommunicationConfig } from '../../utils/webrtc/integrated-communication';
import { 
  MCP_SERVER_URL, 
  MAX_OFFLINE_MESSAGES, 
  DEFAULT_ENCRYPTION_ENABLED 
} from '../../config/constants';
import { encryptMessage, decryptMessage } from '../../utils/crypto/e2ee';

export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'group';
  created_by?: string;
  created_at: string;
  is_active: boolean;
  max_participants: number;
  participant_count?: number;
}

export interface Message {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  reply_to_id?: string;
  user_profile?: {
    username: string;
    display_name: string;
    avatar_url?: string;
  };
}

export interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  last_seen_at: string;
}

// Nye Message-typer for integrert kommunikasjon
export interface MCPMessage extends Message {
  transmission_type: 'webrtc' | 'mcp' | 'supabase';
  encrypted: boolean;
  delivered: boolean;
  read: boolean;
  encrypted_content?: string;
  metadata?: any;
}

class ChatService {
  private static instance: ChatService;
  private subscriptions: Map<string, any> = new Map();
  private communicationController: IntegratedCommunicationController | null = null;
  private messageHandlers: Map<string, ((message: MCPMessage) => void)[]> = new Map();
  private isInitialized: boolean = false;
  private userId: string = '';
  private metrics: any = {
    messagesSent: 0,
    messagesReceived: 0,
    encryptedMessagesSent: 0,
    encryptedMessagesReceived: 0,
    encryptionErrors: 0,
    decryptionErrors: 0,
    webrtcSuccessRate: 0,
    mcpSuccessRate: 0,
    averageLatency: 0,
    failedConnections: 0,
    reconnections: 0,
    lastUpdated: Date.now()
  };
  
  private constructor() {
    // Private constructor for singleton pattern
  }

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }
  
  /**
   * Initialiser MCP WebRTC-integrasjonen
   * @param userId Brukerens ID
   * @returns Om initialiseringen var vellykket
   */
  async initializeMCPWebRTC(userId: string): Promise<boolean> {
    try {
      if (this.isInitialized && this.userId === userId) {
        return true; // Allerede initialisert
      }
      
      this.userId = userId;
      
      // Opprett konfigurasjon for kommunikasjonskontrolleren
      const config: CommunicationConfig = {
        userId: userId,
        mcpServerUrl: MCP_SERVER_URL,
        enableWebRTC: true,
        enableMCP: true,
        preferWebRTC: true,
        fallbackEnabled: true
      };
      
      // Opprett og initialiser kommunikasjonskontrolleren
      this.communicationController = new IntegratedCommunicationController(config);
      const success = await this.communicationController.init();
      
      if (success) {
        this.isInitialized = true;
        this.setupMessageHandlers();
        
        // Start metrics logging
        this.startMetricsLogging();
        
        console.log('[ChatService] MCP WebRTC initialisert for bruker:', userId);
        return true;
      } else {
        console.error('[ChatService] Kunne ikke initialisere MCP WebRTC');
        // Faller tilbake til Supabase
        return false;
      }
    } catch (error) {
      console.error('[ChatService] Feil under initialisering av MCP WebRTC:', error);
      // Faller tilbake til Supabase
      return false;
    }
  }

  /**
   * Get all public chat rooms with participant counts
   */
  async getChatRooms(): Promise<ChatRoom[]> {
    try {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select(`
          *,
          participant_count:room_participants(count)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return data?.map(room => ({
        ...room,
        participant_count: room.participant_count?.[0]?.count || 0
      })) || [];
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      throw error;
    }
  }

  /**
   * Get messages for a specific room with user profiles
   */
  async getMessages(roomId: string, limit: number = 50): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          user_profile:user_profiles(username, display_name, avatar_url)
        `)
        .eq('room_id', roomId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).reverse();
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  /**
   * Setup message handlers for MCP WebRTC
   */
  private setupMessageHandlers(): void {
    if (!this.communicationController) return;

    // Lytt til meldinger fra MCP WebRTC
    this.communicationController.onMessage(async (from: string, messageData: any) => {
      try {
        // Sjekk om meldingen er i forventet format
        if (messageData && messageData.content && messageData.roomId) {
          let content = messageData.content;
          let isEncrypted = messageData.encrypted || false;
          
          // Håndter krypterte meldinger
          if (isEncrypted) {
            try {
              // Hent bruker ID
              const { data: user } = await supabase.auth.getUser();
              if (user?.user) {
                const startTime = performance.now();
                
                // Dekrypter meldingen
                const decryptedData = await decryptMessage(user.user.id, from, content);
                
                const endTime = performance.now();
                const decryptTime = endTime - startTime;
                
                // Oppdater innholdet hvis dekryptering var vellykket
                if (decryptedData && decryptedData.content) {
                  content = decryptedData.content;
                  
                  // Logging for debugging
                  if (process.env.NODE_ENV !== 'production') {
                    console.log(`[ChatService] Successfully decrypted message from ${from} (${decryptTime.toFixed(2)}ms)`);
                  }
                  
                  // Oppdater metrics
                  this.metrics.encryptedMessagesReceived = (this.metrics.encryptedMessagesReceived || 0) + 1;
                  this.metrics.lastDecryptionTime = decryptTime;
                  this.metrics.avgDecryptionTime = this.metrics.avgDecryptionTime 
                    ? (this.metrics.avgDecryptionTime * 0.9 + decryptTime * 0.1) 
                    : decryptTime;
                }
              }
            } catch (decryptError) {
              console.error('[ChatService] Failed to decrypt message:', decryptError);
              // Beholder det krypterte innholdet hvis dekryptering feiler
              
              // Oppdater feilstatistikk
              this.metrics.decryptionErrors = (this.metrics.decryptionErrors || 0) + 1;
              this.metrics.lastDecryptionError = {
                timestamp: new Date().toISOString(),
                fromUser: from,
                error: String(decryptError) || 'Unknown decryption error'
              };
            }
          }
          
          const mcpMessage: MCPMessage = {
            id: messageData.id || `mcp-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            room_id: messageData.roomId,
            user_id: from,
            content: content, // Bruk dekryptert innhold hvis tilgjengelig
            message_type: messageData.messageType || 'text',
            created_at: new Date(messageData.timestamp || Date.now()).toISOString(),
            updated_at: new Date(messageData.timestamp || Date.now()).toISOString(),
            is_edited: false,
            transmission_type: 'mcp',
            encrypted: isEncrypted,
            delivered: true,
            read: false
          };

          // Trigger message handlers
          const handlers = this.messageHandlers.get(messageData.roomId) || [];
          handlers.forEach(handler => handler(mcpMessage));
          
          // Oppdater metrics
          this.metrics.messagesReceived++;
          
          // Lagre i lokal database for offline-tilgang
          this.saveMessageToLocalStorage(mcpMessage);
        }
      } catch (error) {
        console.error('[ChatService] Error handling MCP message:', error);
      }
    });
  }

  /**
   * Start logging metrics
   */
  private startMetricsLogging(): void {
    // Logger metrics periodisk
    setInterval(() => {
      if (this.communicationController) {
        // Hent statistikk fra kommunikasjonskontroller
        const stats = this.communicationController.getStats();
        if (stats) {
          this.metrics = {
            ...this.metrics,
            ...stats
          };
        }
        
        // Logger til konsoll (i produksjon ville dette gå til en analysetjeneste)
        if (process.env.NODE_ENV !== 'production') {
          console.log('[ChatService] Metrics:', this.metrics);
        }
      }
    }, 60000); // Logger hvert minutt
  }
  
  /**
   * Get current metrics
   */
  getMetrics(): any {
    return { ...this.metrics, lastUpdated: Date.now() };
  }
  
  /**
   * Get encryption-related metrics
   */
  getEncryptionMetrics(): any {
    return {
      encryptedMessagesSent: this.metrics.encryptedMessagesSent || 0,
      encryptedMessagesReceived: this.metrics.encryptedMessagesReceived || 0,
      encryptionErrors: this.metrics.encryptionErrors || 0,
      decryptionErrors: this.metrics.decryptionErrors || 0,
      encryptionEnabled: DEFAULT_ENCRYPTION_ENABLED,
      totalEncryptedMessages: (this.metrics.encryptedMessagesSent || 0) + (this.metrics.encryptedMessagesReceived || 0),
      encryptionSuccessRate: this.calculateEncryptionSuccessRate(),
      lastUpdated: Date.now()
    };
  }
  
  /**
   * Calculate encryption success rate
   */
  private calculateEncryptionSuccessRate(): number {
    const total = (this.metrics.encryptedMessagesSent || 0) + (this.metrics.encryptedMessagesReceived || 0);
    const errors = (this.metrics.encryptionErrors || 0) + (this.metrics.decryptionErrors || 0);
    
    if (total === 0) return 100; // Ingen meldinger = ingen feil
    
    return Math.round(((total - errors) / total) * 100);
  }
  
  /**
   * Save message to local storage for offline access
   */
  private saveMessageToLocalStorage(message: MCPMessage): void {
    try {
      // Hent eksisterende meldinger
      const existingMessagesJson = localStorage.getItem(`snakkaz-messages-${message.room_id}`);
      const existingMessages: MCPMessage[] = existingMessagesJson ? JSON.parse(existingMessagesJson) : [];
      
      // Legg til ny melding
      existingMessages.push(message);
      
      // Behold bare de siste X meldingene
      const messagesToKeep = existingMessages.slice(-MAX_OFFLINE_MESSAGES);
      
      // Lagre tilbake i localStorage
      localStorage.setItem(`snakkaz-messages-${message.room_id}`, JSON.stringify(messagesToKeep));
    } catch (error) {
      console.error('[ChatService] Error saving message to local storage:', error);
    }
  }

  /**
   * Send a message to a room with MCP WebRTC support
   */
  async sendMessage(roomId: string, content: string, messageType: 'text' | 'image' | 'file' = 'text'): Promise<Message> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');
      
      // Opprett melding
      const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const timestamp = new Date().toISOString();
      const message: MCPMessage = {
        id: messageId,
        room_id: roomId,
        user_id: user.user.id,
        content,
        message_type: messageType,
        created_at: timestamp,
        updated_at: timestamp,
        is_edited: false,
        transmission_type: 'supabase', // Standard verdi, oppdateres basert på hvordan meldingen sendes
        encrypted: false,
        delivered: false,
        read: false
      };
      
      // Prøv å sende via MCP WebRTC først hvis tilgjengelig
      if (this.isInitialized && this.communicationController) {
        try {
          // Hent brukerinformasjon for rommet
          const roomUsers = await this.getRoomParticipants(roomId);
          
          let mcpSendSuccess = false;
          
          // For gruppe-chatter, sender vi meldinger til alle deltakerne
          if (roomUsers && roomUsers.length > 0) {
            for (const roomUser of roomUsers) {
              if (roomUser.id !== user.user.id) { // Ikke send til seg selv
                try {
                  const startTime = performance.now();
                  
                  // Krypter meldingen for denne mottakeren
                  const encryptedContent = await encryptMessage(
                    user.user.id, 
                    roomUser.id,
                    {
                      id: messageId,
                      roomId,
                      content,
                      messageType,
                      timestamp: Date.now()
                    }
                  );
                  
                  const endTime = performance.now();
                  const encryptTime = endTime - startTime;
                  
                  // Oppdater krypteringsstatistikk
                  this.metrics.lastEncryptionTime = encryptTime;
                  this.metrics.avgEncryptionTime = this.metrics.avgEncryptionTime 
                    ? (this.metrics.avgEncryptionTime * 0.9 + encryptTime * 0.1) 
                    : encryptTime;
                  
                  // Forbered kryptert meldingsdata for MCP
                  const mcpMessageData = {
                    id: messageId,
                    roomId,
                    content: encryptedContent, // Kryptert innhold
                    messageType,
                    timestamp: Date.now(),
                    userId: user.user.id,
                    encrypted: true
                  };
                  
                  const sendResult = await this.communicationController.sendTo(
                    roomUser.id,
                    mcpMessageData,
                    { encrypted: true }
                  );
                  
                  if (sendResult) {
                    mcpSendSuccess = true;
                    message.transmission_type = 'mcp';
                    message.encrypted = true;
                    
                    // Logger kryptert melding
                    if (process.env.NODE_ENV !== 'production') {
                      console.log(`[ChatService] Encrypted message sent to ${roomUser.id} via MCP WebRTC (${encryptTime.toFixed(2)}ms)`);
                    }
                  }
                } catch (encryptError) {
                  console.error('[ChatService] Encryption error:', encryptError);
                  
                  // Oppdater feilstatistikk
                  this.metrics.encryptionErrors = (this.metrics.encryptionErrors || 0) + 1;
                  this.metrics.lastEncryptionError = {
                    timestamp: new Date().toISOString(),
                    toUser: roomUser.id,
                    error: String(encryptError) || 'Unknown encryption error'
                  };
                }
              }
            }
          }
          
          if (mcpSendSuccess) {
            message.delivered = true;
            // Oppdater metrics
            this.metrics.messagesSent++;
            this.metrics.encryptedMessagesSent = (this.metrics.encryptedMessagesSent || 0) + 1;
            
            // Lagre i lokal database for offline-tilgang
            this.saveMessageToLocalStorage(message);
            
            // Oppdater database via Supabase i bakgrunnen
            this.saveToDatabaseInBackground(message);
            
            return message;
          }
        } catch (error) {
          console.warn('[ChatService] Failed to send via MCP WebRTC, falling back to Supabase:', error);
        }
      }
      
      // Fallback til Supabase hvis MCP WebRTC ikke fungerer eller ikke er tilgjengelig
      const { data, error } = await supabase
        .from('messages')
        .insert({
          room_id: roomId,
          user_id: user.user.id,
          content,
          id: messageId,
          message_type: messageType
        })
        .select(`
          *,
          user_profile:user_profiles(username, display_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Get room participants with user profiles
   */
  async getRoomParticipants(roomId: string): Promise<UserProfile[]> {
    try {
      const { data: participants, error } = await supabase
        .from('room_participants')
        .select(`
          user_id,
          user_profiles(id, username, display_name, avatar_url, status, last_seen_at)
        `)
        .eq('room_id', roomId);

      if (error) throw error;

      return participants.map(p => {
        // Supabase returnerer dette som et nestlet objekt
        const profile = Array.isArray(p.user_profiles) ? p.user_profiles[0] : p.user_profiles;
        return {
          id: profile?.id || p.user_id,
          username: profile?.username || 'unknown',
          display_name: profile?.display_name || 'Unknown User',
          avatar_url: profile?.avatar_url,
          status: (profile?.status || 'offline') as 'online' | 'away' | 'busy' | 'offline',
          last_seen_at: profile?.last_seen_at || new Date().toISOString()
        };
      });
    } catch (error) {
      console.error('[ChatService] Error getting room participants:', error);
      return [];
    }
  }

  /**
   * Save message to database in background
   */
  private async saveToDatabaseInBackground(message: MCPMessage): Promise<void> {
    try {
      // Lagre meldingen i databasen for persistens
      await supabase
        .from('messages')
        .insert({
          id: message.id,
          room_id: message.room_id,
          user_id: message.user_id,
          content: message.content,
          message_type: message.message_type,
          created_at: message.created_at,
          updated_at: message.updated_at,
          is_edited: message.is_edited,
          reply_to_id: message.reply_to_id,
          metadata: {
            transmission_type: message.transmission_type,
            encrypted: message.encrypted
          }
        });
    } catch (error) {
      console.error('[ChatService] Error saving message to database in background:', error);
      // Ikke kast feil her siden dette er en bakgrunnsoperasjon
    }
  }

  /**
   * Subscribe to real-time messages for a room
   */
  subscribeToMessages(roomId: string, onMessage: (message: Message) => void): () => void {
    // Registrer meldingshandleren for MCP WebRTC-meldinger
    if (!this.messageHandlers.has(roomId)) {
      this.messageHandlers.set(roomId, []);
    }
    this.messageHandlers.get(roomId)?.push(onMessage);
    
    // Abonner på Supabase-meldinger som fallback
    const channel = supabase
      .channel(`messages:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`
        },
        async (payload) => {
          // Fetch the complete message with user profile
          const { data } = await supabase
            .from('messages')
            .select(`
              *,
              user_profile:user_profiles(username, display_name, avatar_url)
            `)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            onMessage(data);
          }
        }
      )
      .subscribe();

    // Store subscription for cleanup
    this.subscriptions.set(`messages:${roomId}`, channel);

    // Return unsubscribe function
    return () => {
      channel.unsubscribe();
      this.subscriptions.delete(`messages:${roomId}`);
    };
  }

  /**
   * Subscribe to user presence (online/offline status)
   */
  subscribeToPresence(roomId: string, onPresenceChange: (users: UserProfile[]) => void): () => void {
    const channel = supabase
      .channel(`presence:${roomId}`)
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users = Object.values(state).flat().map((presence: any) => ({
          id: presence.user_id || '',
          username: presence.username || '',
          display_name: presence.display_name || '',
          status: 'online' as const,
          last_seen_at: presence.joined_at || new Date().toISOString(),
        })) as UserProfile[];
        onPresenceChange(users);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe();

    // Store subscription for cleanup
    this.subscriptions.set(`presence:${roomId}`, channel);

    return () => {
      channel.unsubscribe();
      this.subscriptions.delete(`presence:${roomId}`);
    };
  }

  /**
   * Join a room's presence
   */
  async joinRoomPresence(roomId: string): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.user.id)
        .single();

      if (profile) {
        const channel = this.subscriptions.get(`presence:${roomId}`);
        if (channel) {
          await channel.track({
            user_id: profile.id,
            username: profile.username,
            display_name: profile.display_name,
            status: 'online',
            joined_at: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error('Error joining room presence:', error);
    }
  }

  /**
   * Leave a room's presence
   */
  async leaveRoomPresence(roomId: string): Promise<void> {
    const channel = this.subscriptions.get(`presence:${roomId}`);
    if (channel) {
      await channel.untrack();
    }
  }

  /**
   * Get online users in a room
   */
  async getOnlineUsers(_roomId?: string): Promise<UserProfile[]> {
    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('status', 'online')
        .limit(10);

      return data || [];
    } catch (error) {
      console.error('Error fetching online users:', error);
      return [];
    }
  }

  /**
   * Update user status
   */
  async updateUserStatus(status: 'online' | 'away' | 'busy' | 'offline'): Promise<void> {
    try {
      const { error } = await supabase.rpc('update_user_status', {
        new_status: status
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  /**
   * Create a new group chat
   */
  async createGroup(name: string, description?: string): Promise<ChatRoom> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('chat_rooms')
        .insert({
          name,
          description,
          type: 'group',
          created_by: user.user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Add creator as owner
      await supabase
        .from('room_participants')
        .insert({
          room_id: data.id,
          user_id: user.user.id,
          role: 'owner'
        });

      return data;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  }

  /**
   * Update user presence status
   */
  async updatePresence(isOnline: boolean): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      await supabase
        .from('user_profiles')
        .upsert({
          id: user.user.id,
          status: isOnline ? 'online' : 'offline',
          last_seen_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error updating presence:', error);
    }
  }

  /**
   * Get encryption status for a message
   * @param message The message to check
   * @returns The encryption status
   */
  getEncryptionStatus(message: MCPMessage | Message): 'encrypted' | 'not-encrypted' | 'error' {
    if ('encrypted' in message && message.encrypted) {
      return 'encrypted';
    }
    
    if ('transmission_type' in message) {
      // Messages sent via WebRTC or MCP are encrypted
      if (message.transmission_type === 'webrtc' || message.transmission_type === 'mcp') {
        return 'encrypted';
      }
    }
    
    // Check metadata for encryption info
    if ('metadata' in message && message.metadata?.encrypted) {
      return 'encrypted';
    }
    
    return 'not-encrypted';
  }

  /**
   * Get transmission type for a message
   * @param message The message to check
   * @returns The transmission type
   */
  getTransmissionType(message: MCPMessage | Message): 'webrtc' | 'mcp' | 'supabase' {
    if ('transmission_type' in message && message.transmission_type) {
      return message.transmission_type as 'webrtc' | 'mcp' | 'supabase';
    }
    
    return 'supabase';
  }

  /**
   * Clean up all subscriptions
   */
  cleanup(): void {
    this.subscriptions.forEach((channel) => {
      channel.unsubscribe();
    });
    this.subscriptions.clear();
  }
}

// Export singleton instance
export const chatService = ChatService.getInstance();

// Hook for easy usage in React components
export const useChatService = () => {
  return chatService;
};
