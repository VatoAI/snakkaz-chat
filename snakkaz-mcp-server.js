import express from 'express';
import axios from 'axios';
import cors from 'cors';
import helmet from 'helmet';
import { simpleEmbed } from './load-snakkaz-knowledge.js';
import VectorDBManager from './vector-db-manager.js';
import {
  securityConfig,
  createRateLimiter,
  authenticateToken,
  authenticateApiKey,
  validationSchemas,
  handleValidationErrors,
  generateToken,
  helmetConfig,
  authenticateAdmin,
  errorHandler,
  securityHeaders
} from './security-middleware.js';
import { PerformanceCache, QueryOptimizer, PerformanceMonitor } from './performance-utils.js';

const app = express();

// Performance utilities
const cache = new PerformanceCache(300000); // 5 minute cache
const queryOptimizer = new QueryOptimizer();
const performanceMonitor = new PerformanceMonitor();

// Performance monitoring middleware
app.use((req, res, next) => {
  req.performanceData = performanceMonitor.startRequest();
  
  const originalSend = res.send;
  res.send = function(data) {
    performanceMonitor.endRequest(req.performanceData);
    originalSend.call(this, data);
  };
  
  next();
});

// Security Middleware Setup
app.use(helmet(helmetConfig));
app.use(securityHeaders);
app.use(cors({
  origin: securityConfig.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

app.use(express.json({ limit: securityConfig.maxPayloadSize }));

// Rate Limiting
const generalLimiter = createRateLimiter(15 * 60 * 1000, 100); // 100 requests per 15 minutes
const strictLimiter = createRateLimiter(15 * 60 * 1000, 20);   // 20 requests per 15 minutes for sensitive endpoints

app.use('/health', generalLimiter);
app.use('/knowledge', generalLimiter);
app.use('/vector', strictLimiter);

class SnakkaZMCPBrain {
  constructor() {
    this.llamaURL = 'http://localhost:8000';
    this.vectorURL = 'http://localhost:6333';
    this.vectorDB = new VectorDBManager();
    this.isVectorConnected = false;
    this.isLlamaConnected = false;
    
    // Initialize connections
    this.initializeConnections();
  }

  async initializeConnections() {
    try {
      // Connect to Vector DB
      const vectorResult = await this.vectorDB.connect(this.vectorURL);
      this.isVectorConnected = vectorResult.success;
      
      if (this.isVectorConnected) {
        // Ensure collection exists
        await this.vectorDB.createCollection('snakkaz_knowledge', 384);
        console.log('🟢 Vector DB initialized');
      }
      
      // Test Llama connection
      try {
        await axios.get(`${this.llamaURL}/health`, { timeout: 2000 });
        this.isLlamaConnected = true;
        console.log('🟢 Llama AI connected');
      } catch (error) {
        this.isLlamaConnected = false;
        console.log('🟡 Llama AI offline');
      }
      
    } catch (error) {
      console.error('❌ Connection initialization failed:', error);
    }
  }

  async searchKnowledge(query, limit = 3) {
    try {
      if (this.isVectorConnected) {
        // Use new Vector DB Manager
        const result = await this.vectorDB.searchSimilar(query, 'snakkaz_knowledge', limit);
        return result.results;
      } else {
        // Fallback to old method
        const queryVector = simpleEmbed(query);
        
        const response = await axios.post(
          `${this.vectorURL}/collections/snakkaz_memory/points/search`,
          {
            vector: queryVector,
            limit: limit,
            with_payload: true,
            score_threshold: 0.1
          }
        );

        return response.data.result.map(item => ({
          fact: item.payload.fact,
          category: item.payload.category,
          importance: item.payload.importance,
          score: item.score
        }));
      }
      
    } catch (error) {
      console.error('❌ Vector search error:', error.message);
      return [];
    }
  }

  async enhancedChat(userMessage) {
    try {
      // 1. Search for relevant SnakkaZ knowledge
      console.log('🔍 Searching for relevant knowledge...');
      const relevantFacts = await this.searchKnowledge(userMessage);
      
      // 2. Build enhanced context
      const contextFacts = relevantFacts
        .map(fact => `- ${fact.fact}`)
        .join('\n');

      const enhancedPrompt = `Du er SnakkaZ AI Assistant. Du vet ALT om SnakkaZ appen.

VIKTIG KONTEKST OM SNAKKAZ:
${contextFacts}

BRUKERENS SPØRSMÅL: ${userMessage}

Svar basert på SnakkaZ konteksten over. Vær entusiastisk og stolt av SnakkaZ appen! 
Bruk fakta fra konteksten, ikke generell informasjon om andre apper.
Svar på norsk.`;

      // 3. Send to Llama with SnakkaZ context
      console.log('🧠 Sending to Llama with SnakkaZ context...');
      const llamaResponse = await axios.post(`${this.llamaURL}/api/generate`, {
        model: 'llama3.2',
        prompt: enhancedPrompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 500
        }
      });

      return {
        ai_response: llamaResponse.data.response,
        context_used: relevantFacts.length,
        relevant_facts: relevantFacts,
        enhanced_with_mcp: true,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Enhanced chat error:', error.message);
      return {
        ai_response: "Beklager, jeg har problemer med å hente SnakkaZ informasjon akkurat nå. Prøv igjen!",
        error: error.message,
        enhanced_with_mcp: false
      };
    }
  }
}

const mcpBrain = new SnakkaZMCPBrain();

// MCP-Enhanced Chat Endpoint
app.post('/ai/smart', async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.json({
      status: 'error',
      message: 'No message provided'
    });
  }

  console.log(`💬 User asked: "${message}"`);
  
  const response = await mcpBrain.enhancedChat(message);
  
  res.json({
    status: 'success',
    user_message: message,
    ...response
  });
});

// Standard AI endpoint (without MCP enhancement)
app.post('/ai/basic', async (req, res) => {
  const { message } = req.body;
  
  try {
    const response = await axios.post('http://localhost:8000/api/generate', {
      model: 'llama3.2',
      prompt: message,
      stream: false
    });

    res.json({
      status: 'basic_ai',
      ai_response: response.data.response,
      enhanced_with_mcp: false
    });
  } catch (error) {
    res.json({
      status: 'error',
      message: error.message
    });
  }
});

// Health endpoint
app.get('/health', async (req, res) => {
  const health = {
    status: 'online',
    timestamp: new Date().toISOString(),
    mcp_brain: true,
    services: {
      vector_db: mcpBrain.isVectorConnected,
      llama_ai: mcpBrain.isLlamaConnected
    },
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    collections: []
  };

  // Get collection stats if Vector DB is connected
  if (mcpBrain.isVectorConnected) {
    try {
      const collections = await mcpBrain.vectorDB.getCollections();
      const stats = await mcpBrain.vectorDB.getStats('snakkaz_knowledge');
      health.collections = collections.map(col => col.name);
      health.knowledge_stats = stats;
    } catch (error) {
      console.error('Error getting collection stats:', error);
    }
  }

  res.json(health);
});

// Enhanced knowledge search endpoint with caching and optimization
app.post('/knowledge/search', 
  generalLimiter,
  validationSchemas.knowledgeSearch,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { query, limit = 5 } = req.body;
      
      // Optimize query and generate cache key
      const optimization = queryOptimizer.optimizeQuery(query);
      const cacheKey = `${optimization.cacheKey}_${limit}`;
      
      // Check cache first
      const cachedResult = cache.get(cacheKey);
      if (cachedResult) {
        console.log(`⚡ Cache hit for query: "${query}"`);
        return res.json({
          ...cachedResult,
          cached: true,
          cache_key: cacheKey
        });
      }
      
      console.log(`🔍 Knowledge search: "${query}" -> "${optimization.optimizedQuery}" (IP: ${req.ip})`);
      
      // Perform search with optimized query
      const results = await mcpBrain.searchKnowledge(optimization.optimizedQuery, limit);
      
      const response = {
        query,
        optimized_query: optimization.optimizedQuery,
        count: results.length,
        results,
        vector_db_connected: mcpBrain.isVectorConnected,
        timestamp: new Date().toISOString(),
        search_id: `search_${Date.now()}`,
        cached: false
      };
      
      // Cache successful results
      if (results.length > 0) {
        cache.set(cacheKey, response, 600000); // 10 minute cache for search results
      }
      
      res.json(response);
      
    } catch (error) {
      console.error('❌ Knowledge search error:', error);
      performanceMonitor.endRequest(req.performanceData, error);
      res.status(500).json({ 
        error: 'Search failed', 
        details: error.message,
        code: 'SEARCH_ERROR'
      });
    }
  }
);

// Secured knowledge loading endpoint
app.post('/knowledge/load', 
  strictLimiter,
  authenticateApiKey,
  validationSchemas.knowledgeLoad,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { facts } = req.body;
      
      console.log(`📚 Loading ${facts.length} knowledge facts (IP: ${req.ip})`);
      
      if (!mcpBrain.isVectorConnected) {
        return res.status(503).json({ 
          error: 'Vector database not connected',
          code: 'VECTOR_DB_OFFLINE' 
        });
      }

      const result = await mcpBrain.vectorDB.insertFacts(facts, 'snakkaz_knowledge');
      
      res.json({
        success: true,
        loaded: result.count,
        timestamp: new Date().toISOString(),
        load_id: `load_${Date.now()}`
      });
      
    } catch (error) {
      console.error('❌ Knowledge loading error:', error);
      res.status(500).json({ 
        error: 'Loading failed', 
        details: error.message,
        code: 'LOAD_ERROR'
      });
    }
  }
);

// Admin authentication endpoint
app.post('/admin/auth',
  strictLimiter,
  validationSchemas.adminAuth,
  handleValidationErrors,
  authenticateAdmin,
  (req, res) => {
    console.log(`👑 Admin authenticated: ${req.body.username} (IP: ${req.ip})`);
    res.json({
      success: true,
      token: req.adminToken,
      message: 'Admin authenticated successfully',
      expires_in: '24h'
    });
  }
);

// Protected admin status endpoint
app.get('/admin/status',
  strictLimiter,
  authenticateToken,
  async (req, res) => {
    try {
      const systemStats = {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        vector_db: mcpBrain.isVectorConnected,
        llama_ai: mcpBrain.isLlamaConnected,
        node_version: process.version,
        environment: process.env.NODE_ENV || 'development'
      };

      if (mcpBrain.isVectorConnected) {
        systemStats.collections = await mcpBrain.vectorDB.getCollections();
        systemStats.knowledge_stats = await mcpBrain.vectorDB.getStats('snakkaz_knowledge');
      }

      res.json({
        status: 'Admin access granted',
        system: systemStats,
        timestamp: new Date().toISOString(),
        admin: req.user.username
      });
      
    } catch (error) {
      console.error('❌ Admin status error:', error);
      res.status(500).json({ 
        error: 'Status check failed', 
        details: error.message 
      });
    }
  }
);

// Protected vector database status endpoint
app.get('/vector/status', 
  strictLimiter,
  authenticateApiKey,
  async (req, res) => {
    try {
      if (!mcpBrain.isVectorConnected) {
        return res.json({ 
          connected: false, 
          error: 'Not connected to vector database',
          code: 'VECTOR_DB_OFFLINE'
        });
      }

      const collections = await mcpBrain.vectorDB.getCollections();
      const stats = await mcpBrain.vectorDB.getStats('snakkaz_knowledge');
      
      res.json({
        connected: true,
        collections: collections.map(col => ({
          name: col.name,
          vectors_count: col.vectors_count || 0
        })),
        knowledge_stats: stats,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Vector status error:', error);
      res.status(500).json({ 
        error: 'Status check failed', 
        details: error.message,
        code: 'STATUS_ERROR'
      });
    }
  }
);

// Protected reconnection endpoint
app.post('/vector/reconnect',
  strictLimiter,
  authenticateToken,
  async (req, res) => {
    try {
      console.log(`🔄 Vector DB reconnection requested by: ${req.user.username} (IP: ${req.ip})`);
      
      await mcpBrain.initializeConnections();
      
      res.json({
        success: true,
        vector_connected: mcpBrain.isVectorConnected,
        llama_connected: mcpBrain.isLlamaConnected,
        timestamp: new Date().toISOString(),
        reconnection_id: `reconnect_${Date.now()}`
      });
      
    } catch (error) {
      console.error('❌ Reconnection error:', error);
      res.status(500).json({ 
        error: 'Reconnection failed', 
        details: error.message,
        code: 'RECONNECTION_ERROR'
      });
    }
  }
);

// Performance and analytics endpoint
app.get('/admin/analytics',
  strictLimiter,
  authenticateToken,
  (req, res) => {
    try {
      const performanceStats = performanceMonitor.getStats();
      const cacheStats = cache.getStats();
      const popularQueries = queryOptimizer.getPopularQueries(10);
      const slowQueries = performanceMonitor.getSlowQueries(5);
      
      res.json({
        performance: performanceStats,
        cache: cacheStats,
        popular_queries: popularQueries,
        slow_queries: slowQueries,
        system: {
          node_version: process.version,
          platform: process.platform,
          uptime: process.uptime(),
          memory: process.memoryUsage()
        },
        timestamp: new Date().toISOString(),
        admin: req.user.username
      });
      
    } catch (error) {
      console.error('❌ Analytics error:', error);
      res.status(500).json({ 
        error: 'Analytics failed', 
        details: error.message 
      });
    }
  }
);

// Cache management endpoint
app.post('/admin/cache/:action',
  strictLimiter,
  authenticateToken,
  (req, res) => {
    try {
      const { action } = req.params;
      
      switch (action) {
        case 'clear':
          cache.clear();
          res.json({ success: true, message: 'Cache cleared' });
          break;
          
        case 'stats':
          res.json({ success: true, stats: cache.getStats() });
          break;
          
        default:
          res.status(400).json({ error: 'Invalid cache action' });
      }
      
    } catch (error) {
      console.error('❌ Cache management error:', error);
      res.status(500).json({ 
        error: 'Cache operation failed', 
        details: error.message 
      });
    }
  }
);

// Error handling middleware (must be last)
app.use(errorHandler);

// Knowledge search endpoint
app.post('/knowledge/search', async (req, res) => {
  const { query, limit = 5 } = req.body;
  const results = await mcpBrain.searchKnowledge(query, limit);
  
  res.json({
    query: query,
    results: results,
    count: results.length
  });
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log('🧠 SnakkaZ MCP Brain Server started!');
  console.log('=================================');
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log(`💬 Smart Chat: POST http://localhost:${PORT}/ai/smart`);
  console.log(`🔍 Knowledge Search: POST http://localhost:${PORT}/knowledge/search`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
  console.log('');
  console.log('🎉 AI now knows everything about SnakkaZ!');
});

export { SnakkaZMCPBrain };
