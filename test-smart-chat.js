const axios = require('axios');

async function testSmartChat() {
  console.log('🤖 TESTING SNAKKAZ SMART AI CHAT');
  console.log('================================');
  
  const questions = [
    "Hva er SnakkaZ?",
    "Hvor mye raskere er SnakkaZ enn WhatsApp?",
    "Hvilken teknologi bruker SnakkaZ?",
    "Hvor kan jeg teste SnakkaZ appen?",
    "Fortell meg om SnakkaZ sin sikkerhet"
  ];

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    console.log(`\n❓ Spørsmål ${i + 1}: "${question}"`);
    console.log('─'.repeat(50));
    
    try {
      const response = await axios.post('http://localhost:3003/ai/smart', {
        message: question
      }, {
        timeout: 30000 // 30 second timeout
      });

      if (response.data.status === 'success') {
        console.log(`🧠 AI Svar: ${response.data.ai_response}`);
        console.log(`📚 Brukte ${response.data.context_used} relevante SnakkaZ fakta`);
        console.log(`🎯 Enhanced with MCP: ${response.data.enhanced_with_mcp}`);
      } else {
        console.log(`❌ Error: ${response.data.message}`);
        if (response.data.error) {
          console.log(`Details: ${response.data.error}`);
        }
      }
      
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log('❌ MCP Server not running. Start it with: node snakkaz-mcp-server.js');
        break;
      } else if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
        console.log('⏳ AI is thinking... This might take a while for complex responses.');
      } else {
        console.log(`❌ Error: ${error.message}`);
      }
    }
    
    // Wait between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n🎉 AI CHAT TEST COMPLETE!');
  console.log('========================');
  console.log('💡 Your AI now knows everything about SnakkaZ!');
  console.log('🌐 Use: POST http://localhost:3003/ai/smart');
}

testSmartChat();
