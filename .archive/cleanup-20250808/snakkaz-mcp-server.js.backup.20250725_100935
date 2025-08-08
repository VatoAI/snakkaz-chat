const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { simpleEmbed } = require('./load-snakkaz-knowledge');

const app = express();
app.use(cors());
app.use(express.json());

class SnakkaZMCPBrain {
  constructor() {
    this.llamaURL = 'http://localhost:8000';
    this.vectorURL = 'http://localhost:6333';
  }

  async searchKnowledge(query, limit = 3) {
    try {
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

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'mcp_brain_online',
    services: {
      llama_ai: 'http://localhost:8000',
      vector_db: 'http://localhost:6333',
      mcp_enhanced: true
    },
    knowledge_base: 'snakkaz_memory_loaded',
    timestamp: new Date().toISOString()
  });
});

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

module.exports = { SnakkaZMCPBrain };
