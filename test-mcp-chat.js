const axios = require('axios');

async function testMCPChat() {
  console.log('🧪 TESTING SNAKKAZ MCP-ENHANCED AI CHAT');
  console.log('======================================');
  
  const testQuestions = [
    "Hva er SnakkaZ?",
    "Hvor raskt er SnakkaZ sammenlignet med WhatsApp?",
    "Fortell meg om SnakkaZ sine sikkerhetsfunksjoner",
    "Hvordan fungerer MCP i SnakkaZ?",
    "Hvor kan jeg teste SnakkaZ appen?"
  ];

  for (let i = 0; i < testQuestions.length; i++) {
    const question = testQuestions[i];
    
    console.log(`\n🤔 Spørsmål ${i + 1}: "${question}"`);
    console.log('─'.repeat(50));
    
    try {
      // Test MCP-enhanced response
      const response = await axios.post('http://localhost:3003/ai/smart', {
        message: question
      });

      if (response.data.status === 'success') {
        console.log(`🧠 AI Svar: ${response.data.ai_response}`);
        console.log(`📚 Brukte ${response.data.context_used} relevante fakta`);
        console.log(`🎯 Top fakta:`);
        response.data.relevant_facts.slice(0, 2).forEach((fact, index) => {
          console.log(`   ${index + 1}. ${fact.fact.substring(0, 80)}... (${fact.score.toFixed(3)})`);
        });
      } else {
        console.log('❌ Error:', response.data.message);
      }
      
    } catch (error) {
      console.log('❌ Connection error:', error.message);
      console.log('💡 Make sure MCP server is running: node snakkaz-mcp-server.js');
    }
    
    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n🎉 MCP CHAT TEST COMPLETE!');
  console.log('==========================');
  console.log('🌐 Try it live: http://localhost:3003/ai/smart');
  console.log('🔍 Search knowledge: http://localhost:3003/knowledge/search');
}

async function testKnowledgeSearch() {
  console.log('\n🔍 TESTING KNOWLEDGE SEARCH');
  console.log('===========================');
  
  const searchQueries = [
    "performance ytelse",
    "hacker security sikkerhet", 
    "docker server deployment",
    "ai brain llama"
  ];

  for (const query of searchQueries) {
    try {
      console.log(`\n🔎 Søker: "${query}"`);
      
      const response = await axios.post('http://localhost:3003/knowledge/search', {
        query: query,
        limit: 3
      });

      console.log(`📊 Fant ${response.data.count} relevante fakta:`);
      response.data.results.forEach((result, index) => {
        console.log(`   ${index + 1}. ${result.fact.substring(0, 80)}... (${result.score.toFixed(3)})`);
      });
      
    } catch (error) {
      console.log('❌ Search error:', error.message);
    }
  }
}

// Run tests
async function runAllTests() {
  try {
    // Test server health first
    const healthResponse = await axios.get('http://localhost:3003/health');
    console.log('✅ MCP Server is healthy:', healthResponse.data.status);
    
    await testMCPChat();
    await testKnowledgeSearch();
    
  } catch (error) {
    console.log('❌ MCP Server not running. Start it first:');
    console.log('   node snakkaz-mcp-server.js');
  }
}

runAllTests();
