const axios = require('axios');

async function createCollection() {
  console.log('🏗️  Creating SnakkaZ memory collection...');
  
  try {
    // Create the collection first
    const createResponse = await axios.put('http://localhost:6333/collections/snakkaz_memory', {
      vectors: {
        size: 384,
        distance: 'Cosine'
      }
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('✅ Collection created successfully!');
    console.log('📊 Response:', createResponse.data);
    
    // Now load the knowledge
    console.log('\n🧠 Loading SnakkaZ knowledge...');
    const { loadSnakkaZKnowledge } = require('./load-snakkaz-knowledge.js');
    await loadSnakkaZKnowledge();
    
  } catch (error) {
    console.error('❌ Error creating collection:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

createCollection();
