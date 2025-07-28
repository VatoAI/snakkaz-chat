// SnakkaZ Beta V2 - MCP Client Integration

interface MCPMessage {
  id: string;
  method: string;
  params?: any;
}

interface MCPResponse {
  id: string;
  result?: any;
  error?: {
    code: number;
    message: string;
  };
}

class MCPClient {
  private url: string;
  private socket: WebSocket | null = null;
  private messageId = 0;
  private pendingRequests = new Map<string, {
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }>();
  private eventListeners = new Map<string, Array<(data: any) => void>>();

  constructor(url: string = 'ws://localhost:3000/mcp') {
    this.url = url;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(this.url);
        
        this.socket.onopen = () => {
          console.log('🤖 MCP Client connected to SnakkaZ server');
          this.initialize();
          resolve();
        };

        this.socket.onmessage = (event) => {
          this.handleMessage(JSON.parse(event.data));
        };

        this.socket.onclose = () => {
          console.log('🔌 MCP Client disconnected');
          this.socket = null;
          // Auto-reconnect after 5 seconds
          setTimeout(() => this.connect(), 5000);
        };

        this.socket.onerror = (error) => {
          console.error('❌ MCP Client error:', error);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private async initialize(): Promise<void> {
    try {
      await this.request('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {
          sampling: {},
          tools: {
            listChanged: true
          },
          resources: {
            subscribe: true,
            listChanged: true
          },
          prompts: {
            listChanged: true
          }
        },
        clientInfo: {
          name: 'SnakkaZ Ultra Premium',
          version: '2.0.0'
        }
      });
      console.log('✅ MCP Client initialized successfully');
    } catch (error) {
      console.error('❌ MCP initialization failed:', error);
    }
  }

  private handleMessage(message: MCPResponse): void {
    // Handle responses to requests
    if (message.id && this.pendingRequests.has(message.id)) {
      const { resolve, reject } = this.pendingRequests.get(message.id)!;
      this.pendingRequests.delete(message.id);
      
      if (message.error) {
        reject(new Error(message.error.message));
      } else {
        resolve(message.result);
      }
      return;
    }

    // Handle notifications and events
    if ('method' in message) {
      const listeners = this.eventListeners.get(message.method) || [];
      listeners.forEach(listener => listener(message.params));
    }
  }

  private request(method: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        reject(new Error('MCP Client not connected'));
        return;
      }

      const id = (++this.messageId).toString();
      const message: MCPMessage = { id, method, params };

      this.pendingRequests.set(id, { resolve, reject });
      this.socket.send(JSON.stringify(message));

      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error('Request timeout'));
        }
      }, 30000);
    });
  }

  // AI Chat Methods
  async sendChatMessage(message: string, context?: any): Promise<string> {
    try {
      const response = await this.request('chat/send', {
        message,
        context,
        features: {
          norwegian: true,
          premium: true,
          snakkaz_knowledge: true
        }
      });
      return response.content || 'Ingen respons fra AI';
    } catch (error) {
      console.error('❌ Chat message failed:', error);
      throw error;
    }
  }

  async getChatSuggestions(context: string): Promise<string[]> {
    try {
      const response = await this.request('chat/suggestions', {
        context,
        language: 'no',
        max_suggestions: 5
      });
      return response.suggestions || [];
    } catch (error) {
      console.error('❌ Getting suggestions failed:', error);
      return [];
    }
  }

  // Tool Methods
  async listTools(): Promise<any[]> {
    try {
      const response = await this.request('tools/list');
      return response.tools || [];
    } catch (error) {
      console.error('❌ Listing tools failed:', error);
      return [];
    }
  }

  async callTool(name: string, arguments_: any): Promise<any> {
    try {
      const response = await this.request('tools/call', {
        name,
        arguments: arguments_
      });
      return response.content || [];
    } catch (error) {
      console.error(`❌ Tool ${name} call failed:`, error);
      throw error;
    }
  }

  // Resource Methods
  async listResources(): Promise<any[]> {
    try {
      const response = await this.request('resources/list');
      return response.resources || [];
    } catch (error) {
      console.error('❌ Listing resources failed:', error);
      return [];
    }
  }

  async readResource(uri: string): Promise<any> {
    try {
      const response = await this.request('resources/read', { uri });
      return response.contents || [];
    } catch (error) {
      console.error(`❌ Reading resource ${uri} failed:`, error);
      throw error;
    }
  }

  // SnakkaZ Specific Methods
  async getSnakkazKnowledge(query: string): Promise<any> {
    try {
      const response = await this.request('snakkaz/knowledge', {
        query,
        language: 'no',
        include_technical: true
      });
      return response.knowledge || {};
    } catch (error) {
      console.error('❌ Getting SnakkaZ knowledge failed:', error);
      return {};
    }
  }

  async analyzeNorwegianText(text: string): Promise<any> {
    try {
      const response = await this.request('norwegian/analyze', {
        text,
        features: ['sentiment', 'keywords', 'entities']
      });
      return response.analysis || {};
    } catch (error) {
      console.error('❌ Norwegian text analysis failed:', error);
      return {};
    }
  }

  async translateToNorwegian(text: string, fromLanguage: string = 'en'): Promise<string> {
    try {
      const response = await this.request('translate/to_norwegian', {
        text,
        from_language: fromLanguage,
        style: 'formal'
      });
      return response.translation || text;
    } catch (error) {
      console.error('❌ Translation failed:', error);
      return text;
    }
  }

  // Event Listeners
  on(event: string, listener: (data: any) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);
  }

  off(event: string, listener: (data: any) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  // Connection Status
  get isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  // Disconnect
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.pendingRequests.clear();
    this.eventListeners.clear();
  }
}

// Create singleton instance
export const mcpClient = new MCPClient();

// Auto-connect when module loads
mcpClient.connect().catch(error => {
  console.warn('⚠️ MCP auto-connect failed, will retry:', error.message);
});

export default mcpClient;