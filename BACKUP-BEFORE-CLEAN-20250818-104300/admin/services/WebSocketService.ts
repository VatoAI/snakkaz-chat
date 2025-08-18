import { ApiService } from './ApiService';
import { AdminUser, SystemMetrics, ApplicationMetrics } from '../types/auth';

/**
 * WebSocket Service for Real-time Updates
 * 
 * Handles real-time communication with the MCP backend,
 * including system metrics, notifications, and live updates.
 */
export class WebSocketService {
  private static instance: WebSocketService | null = null;
  private ws: WebSocket | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();
  
  private constructor() {}
  
  /**
   * Get singleton instance
   */
  static getInstance(): WebSocketService {
    if (!this.instance) {
      this.instance = new WebSocketService();
    }
    return this.instance;
  }
  
  /**
   * Connect to WebSocket server
   */
  async connect(token: string): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }
    
    try {
      const wsUrl = process.env.REACT_APP_WS_URL || 'wss://ws.snakkaz.com';
      this.ws = new WebSocket(`${wsUrl}/admin?token=${token}`);
      
      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);
      
      console.log('🔌 Attempting WebSocket connection...');
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      throw error;
    }
  }
  
  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    
    this.reconnectAttempts = 0;
    console.log('🔌 WebSocket disconnected');
  }
  
  /**
   * Subscribe to specific event types
   */
  subscribe(eventType: string, callback: (data: any) => void): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    
    this.subscribers.get(eventType)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers.get(eventType)?.delete(callback);
      if (this.subscribers.get(eventType)?.size === 0) {
        this.subscribers.delete(eventType);
      }
    };
  }
  
  /**
   * Send message to server
   */
  send(type: string, data: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data, timestamp: new Date().toISOString() }));
    } else {
      console.warn('WebSocket not connected, message not sent:', { type, data });
    }
  }
  
  /**
   * Handle WebSocket open event
   */
  private handleOpen(): void {
    console.log('✅ WebSocket connected successfully');
    this.reconnectAttempts = 0;
    
    // Start heartbeat
    this.startHeartbeat();
    
    // Subscribe to system metrics
    this.send('subscribe', { events: ['system_metrics', 'user_activity', 'notifications'] });
    
    // Notify subscribers
    this.notifySubscribers('connection', { status: 'connected' });
  }
  
  /**
   * Handle WebSocket message
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message = JSON.parse(event.data);
      const { type, data } = message;
      
      // Handle specific message types
      switch (type) {
        case 'heartbeat':
          this.send('heartbeat_ack', {});
          break;
          
        case 'system_metrics':
          this.notifySubscribers('system_metrics', data);
          break;
          
        case 'user_activity':
          this.notifySubscribers('user_activity', data);
          break;
          
        case 'notification':
          this.notifySubscribers('notification', data);
          this.showNotification(data);
          break;
          
        case 'admin_alert':
          this.notifySubscribers('admin_alert', data);
          this.showAlert(data);
          break;
          
        default:
          this.notifySubscribers(type, data);
          break;
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }
  
  /**
   * Handle WebSocket close event
   */
  private handleClose(event: CloseEvent): void {
    console.log('WebSocket connection closed:', event.code, event.reason);
    
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    // Notify subscribers
    this.notifySubscribers('connection', { status: 'disconnected', code: event.code });
    
    // Attempt reconnection if not intentional close
    if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
      this.attemptReconnection();
    }
  }
  
  /**
   * Handle WebSocket error event
   */
  private handleError(error: Event): void {
    console.error('WebSocket error:', error);
    this.notifySubscribers('error', { error });
  }
  
  /**
   * Attempt to reconnect to WebSocket
   */
  private async attemptReconnection(): Promise<void> {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`🔄 Attempting WebSocket reconnection (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);
    
    setTimeout(async () => {
      try {
        const token = localStorage.getItem('mcp_admin_token');
        if (token) {
          await this.connect(token);
        }
      } catch (error) {
        console.error('Reconnection failed:', error);
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.attemptReconnection();
        }
      }
    }, delay);
  }
  
  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send('heartbeat', { timestamp: new Date().toISOString() });
      }
    }, 30000); // Send heartbeat every 30 seconds
  }
  
  /**
   * Notify all subscribers of an event
   */
  private notifySubscribers(eventType: string, data: any): void {
    const subscribers = this.subscribers.get(eventType);
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in subscriber callback for ${eventType}:`, error);
        }
      });
    }
  }
  
  /**
   * Show browser notification
   */
  private showNotification(data: any): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(data.title || 'Snakkaz MCP', {
        body: data.message,
        icon: '/favicon.ico',
        tag: data.id || 'mcp-notification'
      });
    }
  }
  
  /**
   * Show admin alert
   */
  private showAlert(data: any): void {
    // This would integrate with your notification system
    console.warn('Admin Alert:', data);
    
    // You could also dispatch a custom event that your UI listens to
    window.dispatchEvent(new CustomEvent('mcp-admin-alert', { detail: data }));
  }
  
  /**
   * Get connection status
   */
  getConnectionStatus(): 'connecting' | 'open' | 'closing' | 'closed' {
    if (!this.ws) return 'closed';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING: return 'connecting';
      case WebSocket.OPEN: return 'open';
      case WebSocket.CLOSING: return 'closing';
      case WebSocket.CLOSED: return 'closed';
      default: return 'closed';
    }
  }
}

/**
 * React Hook for using WebSocket in components
 */
export const useWebSocket = () => {
  const ws = WebSocketService.getInstance();
  
  return {
    connect: ws.connect.bind(ws),
    disconnect: ws.disconnect.bind(ws),
    subscribe: ws.subscribe.bind(ws),
    send: ws.send.bind(ws),
    getConnectionStatus: ws.getConnectionStatus.bind(ws)
  };
};
