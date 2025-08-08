const axios = require('axios');

// SnakkaZ Knowledge Base - All facts about your app!
const snakkaZKnowledge = [
  {
    id: 1,
    fact: "SnakkaZ er en revolusjonær AI-powered chat aplikasjon som dominerer alle konkurrenter med 75-95% bedre ytelse",
    category: "performance",
    importance: 10,
    keywords: ["snakkaz", "ai", "chat", "app", "ytelse", "konkurrenter"]
  },
  {
    id: 2,
    fact: "SnakkaZ kjører live på mcp.snakkaz.com og lokalt på localhost:3001 med fullstendig Docker AI stack",
    category: "technical",
    importance: 9,
    keywords: ["server", "mcp.snakkaz.com", "localhost", "docker", "deployment"]
  },
  {
    id: 3,
    fact: "SnakkaZ har Memory Context Protocol (MCP) som gir AI persistent hukommelse på tvers av samtaler",
    category: "features",
    importance: 10,
    keywords: ["mcp", "memory", "context", "ai", "samtaler", "hukommelse"]
  },
  {
    id: 4,
    fact: "SnakkaZ er 75% raskere enn Signal, 80% raskere enn Telegram, 85% raskere enn WhatsApp, 70% raskere enn Snapchat, og 95% raskere enn Wickr",
    category: "benchmarks",
    importance: 9,
    keywords: ["benchmark", "signal", "telegram", "whatsapp", "snapchat", "wickr", "raskere"]
  },
  {
    id: 5,
    fact: "SnakkaZ har intelligent Hacker Trap system som lokker hackere til å hjelpe med sikkerhetsutvikling",
    category: "security",
    importance: 8,
    keywords: ["hacker", "trap", "sikkerhet", "security", "intelligent", "forsvar"]
  },
  {
    id: 6,
    fact: "SnakkaZ bruker Llama 3.2 AI lokalt, Qdrant vector database, Redis caching, og Grafana analytics",
    category: "architecture",
    importance: 8,
    keywords: ["llama", "qdrant", "redis", "grafana", "ai", "database", "analytics"]
  },
  {
    id: 7,
    fact: "SnakkaZ er utviklet av VatoAI team og er klar for beta launch med live kunde-testing",
    category: "development",
    importance: 7,
    keywords: ["vatoai", "beta", "launch", "kunder", "testing", "team"]
  },
  {
    id: 8,
    fact: "SnakkaZ har health endpoint på /health som viser 'dominating' status og competitor performance data",
    category: "api",
    importance: 6,
    keywords: ["health", "endpoint", "api", "status", "dominating", "monitoring"]
  },
  {
    id: 9,
    fact: "SnakkaZ dashboard på /dashboard gir real-time innsikt i app performance og brukerstatistikk",
    category: "monitoring",
    importance: 7,
    keywords: ["dashboard", "real-time", "performance", "statistikk", "monitoring"]
  },
  {
    id: 10,
    fact: "SnakkaZ støtter både web-interface på port 3001 og AI brain på port 8000 for advanced chat",
    category: "interface",
    importance: 6,
    keywords: ["web", "interface", "port", "3001", "8000", "ai", "brain", "chat"]
  }
];

// Simple text to vector embedding (in production, use proper embedding model)
function simpleEmbed(text) {
  const words = text.toLowerCase().split(/\s+/);
  const vector = new Array(384).fill(0);
  
  words.forEach((word, index) => {
    for (let i = 0; i < word.length && i < 384; i++) {
      vector[i] += word.charCodeAt(i % word.length) * (1 + index * 0.1);
    }
  });
  
  // Normalize vector
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map(val => magnitude > 0 ? val / magnitude : 0);
}

async function loadSnakkaZKnowledge() {
  console.log('🧠 Loading SnakkaZ Knowledge into Vector Database...');
  
  try {
    // First, create the collection if it doesn't exist
    console.log('🏗️  Creating collection...');
    try {
      await axios.put('http://localhost:6333/collections/snakkaz_memory', {
        vectors: { size: 384, distance: 'Cosine' }
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('✅ Collection created successfully!');
    } catch (createError) {
      if (createError.response?.status === 409) {
        console.log('ℹ️  Collection already exists, continuing...');
      } else {
        throw createError;
      }
    }
    
    // Prepare knowledge points for Qdrant
    const points = snakkaZKnowledge.map(knowledge => ({
      id: knowledge.id,
      payload: {
        fact: knowledge.fact,
        category: knowledge.category,
        importance: knowledge.importance,
        keywords: knowledge.keywords.join(', ')
      },
      vector: simpleEmbed(knowledge.fact + ' ' + knowledge.keywords.join(' '))
    }));

    // Upload to Qdrant
    const response = await axios.put('http://localhost:6333/collections/snakkaz_memory/points', {
      points: points
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('✅ Successfully loaded', snakkaZKnowledge.length, 'SnakkaZ facts!');
    console.log('📊 Vector Database Response:', response.data);
    
    // Test search
    console.log('\n🔍 Testing knowledge search...');
    const searchVector = simpleEmbed('snakkaz app performance');
    const searchResponse = await axios.post('http://localhost:6333/collections/snakkaz_memory/points/search', {
      vector: searchVector,
      limit: 3,
      with_payload: true
    });
    
    console.log('🎯 Top 3 relevant facts:');
    searchResponse.data.result.forEach((result, index) => {
      console.log(`${index + 1}. ${result.payload.fact} (Score: ${result.score.toFixed(3)})`);
    });
    
  } catch (error) {
    console.error('❌ Error loading knowledge:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run if called directly
if (require.main === module) {
  loadSnakkaZKnowledge();
}

module.exports = { loadSnakkaZKnowledge, snakkaZKnowledge, simpleEmbed };
