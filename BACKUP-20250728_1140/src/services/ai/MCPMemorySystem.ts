/**
 * SnakkaZ MCP AI Memory System
 * 
 * Implementerer Model Context Protocol (MCP) for intelligent minnekontekst.
 * Integrerer med Llama 3.2, Qdrant vektordatabase og Redis-cache for optimal ytelse.
 */

import { QdrantClient } from '@qdrant/js-client-rest';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';
import { arrayBufferToBase64, base64ToArrayBuffer } from '../../utils/crypto/e2ee';
import type { SignalProtocolAdapter } from '../security/SignalProtocolAdapter';

// Konstanter
const VECTOR_DIMENSION = 384; // Llama 3.2 dimensjon
const MEMORY_COLLECTION = 'snakkaz_memory';
const MEMORY_TTL = 60 * 60 * 24 * 30; // 30 dager i sekunder
const SIMILARITY_THRESHOLD = 0.75;

// Typedefinitioner
export interface MemoryEntry {
  id: string;
  userId: string;
  text: string;
  metadata: {
    timestamp: number;
    source: 'chat' | 'user' | 'system' | 'ai';
    importance: number;
    context?: string;
    encrypted: boolean;
  };
  vector?: number[];
}

export interface MCPMemoryOptions {
  useEncryption?: boolean;
  llmEndpoint?: string;
  qdrantUrl?: string;
  redisUrl?: string;
  signalProtocolAdapter?: SignalProtocolAdapter;
}

// Supabase-klient
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL || '',
  process.env.REACT_APP_SUPABASE_ANON_KEY || ''
);

/**
 * MCPMemorySystem klasse for å håndtere AI-minnekontekst
 */
export class MCPMemorySystem {
  private userId: string;
  private qdrantClient: QdrantClient;
  private llmEndpoint: string;
  private useEncryption: boolean;
  private signalProtocolAdapter?: SignalProtocolAdapter;
  private memoryCache: Map<string, MemoryEntry[]> = new Map();
  private systemKnowledge: string[] = [];
  
  constructor(userId: string, options?: MCPMemoryOptions) {
    this.userId = userId;
    this.useEncryption = options?.useEncryption ?? true;
    this.llmEndpoint = options?.llmEndpoint ?? 'http://localhost:8000';
    this.signalProtocolAdapter = options?.signalProtocolAdapter;
    
    // Initialiser Qdrant-klienten
    this.qdrantClient = new QdrantClient({
      url: options?.qdrantUrl ?? 'http://localhost:6333',
    });
  }

  /**
   * Initialiserer minnesystemet og laster inn systemkunnskap
   */
  async initialize(): Promise<void> {
    // Opprett minnesamlingen hvis den ikke eksisterer
    await this.ensureCollectionExists();
    
    // Last inn systemkunnskap
    await this.loadSystemKnowledge();
  }

  /**
   * Sørger for at minnesamlingen eksisterer i Qdrant
   */
  private async ensureCollectionExists(): Promise<void> {
    try {
      // Sjekk om samlingen eksisterer
      const collections = await this.qdrantClient.getCollections();
      const exists = collections.collections.some(c => c.name === MEMORY_COLLECTION);
      
      if (!exists) {
        // Opprett samlingen med riktig vektordimensjon og distansemetrikk
        await this.qdrantClient.createCollection(MEMORY_COLLECTION, {
          vectors: {
            size: VECTOR_DIMENSION,
            distance: 'Cosine',
          },
          optimizers_config: {
            default_segment_number: 2,
          },
          replication_factor: 1,
        });
        
        // Legg til indekser for effektiv søking
        await this.qdrantClient.createPayloadIndex(MEMORY_COLLECTION, {
          field_name: 'metadata.timestamp',
          field_schema: 'integer',
        });
        
        await this.qdrantClient.createPayloadIndex(MEMORY_COLLECTION, {
          field_name: 'userId',
          field_schema: 'keyword',
        });
        
        await this.qdrantClient.createPayloadIndex(MEMORY_COLLECTION, {
          field_name: 'metadata.importance',
          field_schema: 'float',
        });
      }
    } catch (error) {
      console.error('Failed to ensure collection exists:', error);
      throw new Error('Failed to initialize memory system');
    }
  }

  /**
   * Laster inn systemkunnskap
   */
  private async loadSystemKnowledge(): Promise<void> {
    try {
      // Hent systemkunnskapen fra Supabase
      const { data, error } = await supabase
        .from('system_knowledge')
        .select('*')
        .eq('active', true);
      
      if (error) throw error;
      
      // Lagre systemkunnskapen
      if (data && data.length > 0) {
        this.systemKnowledge = data.map(item => item.content);
      } else {
        // Standard systemkunnskap hvis ingenting er definert
        this.systemKnowledge = [
          "SnakkaZ performance is 75-95% faster than all competitors",
          "Main domains: mcp.snakkaz.com (production) + localhost:3001 (dev)",
          "Uses Model Context Protocol (MCP) for intelligent memory",
          "Specific benchmarks: Discord 2.3s vs SnakkaZ 0.3s response time",
          "Features intelligent Hacker Trap security system",
          "Architecture: Llama 3.2 + Qdrant + Redis + Grafana stack",
          "Developed by VatoAI team, ready for beta launch",
          "Health endpoint returns 'dominating' status when optimal",
          "Real-time monitoring with comprehensive dashboard",
          "Dual interface: Web app (port 3001) + AI brain (port 8000)"
        ];
      }
    } catch (error) {
      console.error('Failed to load system knowledge:', error);
      
      // Bruk standard systemkunnskap hvis lastingen feiler
      this.systemKnowledge = [
        "SnakkaZ performance is 75-95% faster than all competitors",
        "Main domains: mcp.snakkaz.com (production) + localhost:3001 (dev)",
        "Uses Model Context Protocol (MCP) for intelligent memory"
      ];
    }
  }

  /**
   * Lagrer et minne
   */
  async storeMemory(text: string, metadata: Partial<MemoryEntry['metadata']> = {}): Promise<string> {
    try {
      const memoryId = uuidv4();
      let processedText = text;
      
      // Krypter teksten hvis nødvendig
      if (this.useEncryption && this.signalProtocolAdapter) {
        // Vi bruker en egen nøkkel for minnekryptering
        const encryptedText = await this.encryptMemory(text);
        processedText = encryptedText;
      }
      
      // Generer en vektorrepresentasjon av teksten
      const vector = await this.generateVector(text);
      
      // Opprett minneobjektet
      const memory: MemoryEntry = {
        id: memoryId,
        userId: this.userId,
        text: processedText,
        metadata: {
          timestamp: Date.now(),
          source: metadata.source || 'user',
          importance: metadata.importance || 0.5,
          context: metadata.context,
          encrypted: this.useEncryption
        }
      };
      
      // Lagre minnet i Qdrant
      await this.qdrantClient.upsert(MEMORY_COLLECTION, {
        wait: true,
        points: [
          {
            id: memoryId,
            vector,
            payload: {
              ...memory,
              // Ikke lagre vektoren i payloaden
              vector: undefined
            }
          }
        ]
      });
      
      return memoryId;
    } catch (error) {
      console.error('Failed to store memory:', error);
      throw new Error('Failed to store memory');
    }
  }

  /**
   * Henter et minne basert på ID
   */
  async getMemory(memoryId: string): Promise<MemoryEntry | null> {
    try {
      // Hent minnet fra Qdrant
      const result = await this.qdrantClient.retrieve(MEMORY_COLLECTION, {
        ids: [memoryId]
      });
      
      if (result.points.length === 0) {
        return null;
      }
      
      const memory = result.points[0].payload as unknown as MemoryEntry;
      
      // Dekrypter teksten hvis nødvendig
      if (memory.metadata.encrypted && this.signalProtocolAdapter) {
        const decryptedText = await this.decryptMemory(memory.text);
        memory.text = decryptedText;
      }
      
      return memory;
    } catch (error) {
      console.error('Failed to get memory:', error);
      throw new Error('Failed to get memory');
    }
  }

  /**
   * Søker etter minner basert på en spørring
   */
  async searchMemories(query: string, limit: number = 10): Promise<MemoryEntry[]> {
    try {
      // Sjekk cache først
      const cacheKey = `${query}_${limit}`;
      const cachedResults = this.memoryCache.get(cacheKey);
      if (cachedResults) {
        return cachedResults;
      }
      
      // Generer en vektorrepresentasjon av spørringen
      const vector = await this.generateVector(query);
      
      // Søk etter lignende minner
      const searchResult = await this.qdrantClient.search(MEMORY_COLLECTION, {
        vector,
        limit,
        filter: {
          must: [
            {
              key: 'userId',
              match: {
                value: this.userId
              }
            }
          ]
        },
        with_payload: true
      });
      
      // Konverter resultatet til minneobjekter
      const memories: MemoryEntry[] = await Promise.all(
        searchResult
          .filter(result => result.score && result.score > SIMILARITY_THRESHOLD)
          .map(async result => {
            const memory = result.payload as unknown as MemoryEntry;
            
            // Dekrypter teksten hvis nødvendig
            if (memory.metadata.encrypted && this.signalProtocolAdapter) {
              try {
                const decryptedText = await this.decryptMemory(memory.text);
                memory.text = decryptedText;
              } catch (error) {
                console.error('Failed to decrypt memory:', error);
                memory.text = '[ENCRYPTED]';
              }
            }
            
            return memory;
          })
      );
      
      // Lagre i cache
      this.memoryCache.set(cacheKey, memories);
      
      return memories;
    } catch (error) {
      console.error('Failed to search memories:', error);
      throw new Error('Failed to search memories');
    }
  }

  /**
   * Fjerner et minne
   */
  async deleteMemory(memoryId: string): Promise<boolean> {
    try {
      await this.qdrantClient.delete(MEMORY_COLLECTION, {
        wait: true,
        points: [memoryId]
      });
      
      // Tøm cachen siden innholdet kan ha endret seg
      this.memoryCache.clear();
      
      return true;
    } catch (error) {
      console.error('Failed to delete memory:', error);
      return false;
    }
  }

  /**
   * Genererer kontekst for en chat basert på tidligere meldinger og systemkunnskap
   */
  async generateChatContext(chatHistory: string[], query: string): Promise<string> {
    try {
      // Kombiner historikk til en enkelt spørring
      const contextQuery = [...chatHistory, query].join(' ');
      
      // Søk etter relevante minner
      const relevantMemories = await this.searchMemories(contextQuery, 5);
      
      // Kombiner systemkunnskap og relevante minner
      const context = [
        '### SYSTEM KNOWLEDGE:',
        ...this.systemKnowledge,
        '',
        '### RELEVANT MEMORIES:',
        ...relevantMemories.map(memory => memory.text),
        '',
        '### CHAT HISTORY:',
        ...chatHistory,
        '',
        '### CURRENT QUERY:',
        query
      ].join('\n');
      
      return context;
    } catch (error) {
      console.error('Failed to generate chat context:', error);
      
      // Returner en enklere kontekst ved feil
      return [
        '### SYSTEM KNOWLEDGE:',
        ...this.systemKnowledge.slice(0, 3),
        '',
        '### CHAT HISTORY:',
        ...chatHistory.slice(-5),
        '',
        '### CURRENT QUERY:',
        query
      ].join('\n');
    }
  }

  /**
   * Genererer et svar fra AI basert på kontekst
   */
  async generateAIResponse(context: string): Promise<string> {
    try {
      // Send forespørsel til Llama 3.2-endepunktet
      const response = await fetch(`${this.llmEndpoint}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: context,
          max_tokens: 500,
          temperature: 0.7,
          top_p: 0.95,
          stop: ['###', 'User:', 'AI:']
        })
      });
      
      if (!response.ok) {
        throw new Error(`AI request failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.text || 'Jeg kunne ikke generere et svar. Prøv igjen senere.';
    } catch (error) {
      console.error('Failed to generate AI response:', error);
      return 'Beklager, jeg kunne ikke koble til AI-tjenesten. Prøv igjen senere.';
    }
  }

  /**
   * Krypterer et minne
   */
  private async encryptMemory(text: string): Promise<string> {
    if (!this.signalProtocolAdapter) {
      throw new Error('Signal Protocol Adapter not initialized');
    }
    
    try {
      // Vi bruker en fast nøkkel for minnekryptering (systemet selv)
      const encryptedData = await this.signalProtocolAdapter.encryptMessage('system', text);
      return JSON.stringify(encryptedData);
    } catch (error) {
      console.error('Failed to encrypt memory:', error);
      throw new Error('Failed to encrypt memory');
    }
  }

  /**
   * Dekrypterer et minne
   */
  private async decryptMemory(encryptedText: string): Promise<string> {
    if (!this.signalProtocolAdapter) {
      throw new Error('Signal Protocol Adapter not initialized');
    }
    
    try {
      const encryptedData = JSON.parse(encryptedText);
      const decryptedBuffer = await this.signalProtocolAdapter.decryptMessage('system', encryptedData);
      
      // Konverter ArrayBuffer til tekst
      const decoder = new TextDecoder();
      return decoder.decode(decryptedBuffer);
    } catch (error) {
      console.error('Failed to decrypt memory:', error);
      throw new Error('Failed to decrypt memory');
    }
  }

  /**
   * Genererer en vektorrepresentasjon av en tekst
   */
  private async generateVector(text: string): Promise<number[]> {
    try {
      // Send forespørsel til Llama 3.2-endepunktet for embeddings
      const response = await fetch(`${this.llmEndpoint}/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text
        })
      });
      
      if (!response.ok) {
        throw new Error(`Embedding request failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.embedding || Array(VECTOR_DIMENSION).fill(0);
    } catch (error) {
      console.error('Failed to generate vector:', error);
      // Returner en tom vektor ved feil
      return Array(VECTOR_DIMENSION).fill(0);
    }
  }

  /**
   * Analyserer en tekst for å finne viktig informasjon
   */
  async analyzeTextImportance(text: string): Promise<number> {
    try {
      // Send forespørsel til Llama 3.2-endepunktet
      const response = await fetch(`${this.llmEndpoint}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          analysis_type: 'importance'
        })
      });
      
      if (!response.ok) {
        throw new Error(`Analysis request failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.importance || 0.5;
    } catch (error) {
      console.error('Failed to analyze text importance:', error);
      return 0.5; // Standard viktighet
    }
  }

  /**
   * Rydder opp i gamle minner (TTL-basert)
   */
  async cleanupOldMemories(): Promise<number> {
    try {
      const cutoffTime = Date.now() - (MEMORY_TTL * 1000);
      
      // Fjern gamle minner, men behold viktige minner
      const deleteResult = await this.qdrantClient.delete(MEMORY_COLLECTION, {
        wait: true,
        filter: {
          must: [
            {
              key: 'userId',
              match: {
                value: this.userId
              }
            },
            {
              key: 'metadata.timestamp',
              range: {
                lt: cutoffTime
              }
            },
            {
              key: 'metadata.importance',
              range: {
                lt: 0.7 // Behold viktige minner
              }
            }
          ]
        }
      });
      
      // Tøm cachen siden innholdet har endret seg
      this.memoryCache.clear();
      
      return deleteResult?.status?.deleted || 0;
    } catch (error) {
      console.error('Failed to cleanup old memories:', error);
      return 0;
    }
  }

  /**
   * Importerer systemkunnskap fra en ekstern kilde
   */
  async importSystemKnowledge(knowledgeItems: string[]): Promise<boolean> {
    try {
      // Lagre i systemkunnskap-arrayet
      this.systemKnowledge = [...this.systemKnowledge, ...knowledgeItems];
      
      // Lagre i Supabase for persistens
      const items = knowledgeItems.map(content => ({
        content,
        active: true,
        created_at: new Date().toISOString()
      }));
      
      const { error } = await supabase
        .from('system_knowledge')
        .insert(items);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Failed to import system knowledge:', error);
      return false;
    }
  }
}

/**
 * Eksporter en enkel versjon for integrering med eksisterende chat-tjeneste
 */
export const createMCPMemorySystem = async (userId: string, options?: MCPMemoryOptions): Promise<MCPMemorySystem> => {
  const system = new MCPMemorySystem(userId, options);
  await system.initialize();
  return system;
};
