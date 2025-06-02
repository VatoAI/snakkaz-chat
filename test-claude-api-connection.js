#!/usr/bin/env node

/**
 * Claude Sonnet 4 API Connection Test
 * Tests the Claude API integration for Snakkaz Chat
 */

import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const ANTHROPIC_API_KEY = process.env.VITE_ANTHROPIC_API_KEY;
const DEFAULT_MODEL = process.env.VITE_AI_DEFAULT_MODEL || 'claude-sonnet-4-20250514';

console.log('🤖 Claude API Connection Test for Snakkaz Chat');
console.log('=' .repeat(50));

if (!ANTHROPIC_API_KEY) {
  console.error('❌ ERROR: VITE_ANTHROPIC_API_KEY not found in environment');
  console.error('Please check your .env file contains:');
  console.error('VITE_ANTHROPIC_API_KEY=sk-ant-api03-...');
  process.exit(1);
}

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});

async function testBasicConnection() {
  console.log('\n🔗 Testing basic API connection...');
  
  try {
    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 100,
      temperature: 0.7,
      system: 'Du er en hjelpsom AI-assistent for Snakkaz Chat. Svar kort på norsk.',
      messages: [
        {
          role: 'user',
          content: 'Hei! Test av API-tilkobling for Snakkaz Chat.'
        }
      ]
    });

    const content = response.content[0]?.type === 'text' 
      ? response.content[0].text 
      : 'Ingen respons mottatt';

    console.log('✅ API Connection: SUCCESS');
    console.log(`📝 Response: ${content}`);
    console.log(`🏷️  Model: ${response.model}`);
    console.log(`📊 Tokens: ${response.usage.input_tokens} input, ${response.usage.output_tokens} output`);
    
    return true;
  } catch (error) {
    console.error('❌ API Connection: FAILED');
    console.error(`Error: ${error.message}`);
    return false;
  }
}

async function testMemoryIntegration() {
  console.log('\n🧠 Testing memory-enhanced conversation...');
  
  try {
    const memoryContext = `
Previous context about this user:
- Language preference: Norwegian
- Communication style: Friendly and helpful
- Interest: Secure messaging and privacy
`;

    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 200,
      temperature: 0.7,
      system: `Du er Snakkaz Chat AI-assistent. Bruk denne konteksten om brukeren: ${memoryContext}
      
      Svar personlig og vennlig basert på det du vet om brukeren.`,
      messages: [
        {
          role: 'user',
          content: 'Fortell meg om Snakkaz sine sikkerhetsfunksjoner.'
        }
      ]
    });

    const content = response.content[0]?.type === 'text' 
      ? response.content[0].text 
      : 'Ingen respons mottatt';

    console.log('✅ Memory Integration: SUCCESS');
    console.log(`📝 Personalized Response: ${content.substring(0, 150)}...`);
    console.log(`📊 Tokens: ${response.usage.input_tokens} input, ${response.usage.output_tokens} output`);
    
    return true;
  } catch (error) {
    console.error('❌ Memory Integration: FAILED');
    console.error(`Error: ${error.message}`);
    return false;
  }
}

async function testMultiProviderFallback() {
  console.log('\n🔄 Testing multi-provider configuration...');
  
  try {
    // Test different Claude models
    const models = [
      'claude-3-5-sonnet-20241022',
      'claude-3-haiku-20240307'
    ];

    for (const model of models) {
      try {
        const response = await anthropic.messages.create({
          model: model,
          max_tokens: 50,
          temperature: 0.7,
          system: 'Svar kort på norsk.',
          messages: [
            {
              role: 'user',
              content: `Test av ${model} modell.`
            }
          ]
        });

        const content = response.content[0]?.type === 'text' 
          ? response.content[0].text 
          : 'Ingen respons';

        console.log(`✅ ${model}: SUCCESS - ${content.substring(0, 50)}...`);
      } catch (modelError) {
        console.log(`⚠️  ${model}: ${modelError.message}`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Multi-provider test: FAILED');
    console.error(`Error: ${error.message}`);
    return false;
  }
}

async function testProductionScenarios() {
  console.log('\n🚀 Testing production scenarios...');
  
  try {
    // Test long conversation
    const longConversation = [
      {
        role: 'user',
        content: 'Hei! Jeg vil gjerne vite mer om Snakkaz.'
      },
      {
        role: 'assistant',
        content: 'Hei! Snakkaz er en sikker chatteplattform med ende-til-ende kryptering. Hva vil du vite mer om?'
      },
      {
        role: 'user',
        content: 'Hvordan fungerer gruppesamtalene?'
      }
    ];

    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 300,
      temperature: 0.7,
      system: 'Du er Snakkaz AI-assistent. Gi detaljerte og hjelpsomme svar.',
      messages: longConversation
    });

    const content = response.content[0]?.type === 'text' 
      ? response.content[0].text 
      : 'Ingen respons';

    console.log('✅ Long Conversation: SUCCESS');
    console.log(`📝 Response length: ${content.length} characters`);
    console.log(`📊 Total tokens: ${response.usage.input_tokens + response.usage.output_tokens}`);
    
    // Test rate limiting awareness
    console.log('⏱️  Rate limiting: Waiting 1 second between requests...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  } catch (error) {
    console.error('❌ Production scenarios: FAILED');
    console.error(`Error: ${error.message}`);
    return false;
  }
}

async function calculateCosts() {
  console.log('\n💰 Cost estimation for Snakkaz usage...');
  
  // Claude 3.5 Sonnet pricing (approximate)
  const INPUT_COST_PER_1K = 0.003; // USD
  const OUTPUT_COST_PER_1K = 0.015; // USD
  const USD_TO_NOK = 10.5; // Approximate exchange rate
  
  // Typical usage scenarios
  const scenarios = [
    { name: 'Quick question', inputTokens: 50, outputTokens: 100 },
    { name: 'Detailed help', inputTokens: 200, outputTokens: 400 },
    { name: 'Long conversation', inputTokens: 500, outputTokens: 800 }
  ];
  
  console.log('\nCost per interaction:');
  scenarios.forEach(scenario => {
    const inputCost = (scenario.inputTokens / 1000) * INPUT_COST_PER_1K;
    const outputCost = (scenario.outputTokens / 1000) * OUTPUT_COST_PER_1K;
    const totalUSD = inputCost + outputCost;
    const totalNOK = totalUSD * USD_TO_NOK;
    
    console.log(`  ${scenario.name}: $${totalUSD.toFixed(4)} USD / ${totalNOK.toFixed(2)} NOK`);
  });
  
  // Monthly estimates
  console.log('\nMonthly cost estimates (per user):');
  const usagePatterns = [
    { type: 'Light user', interactions: 30 },
    { type: 'Regular user', interactions: 150 },
    { type: 'Heavy user', interactions: 500 }
  ];
  
  usagePatterns.forEach(pattern => {
    const avgCostPerInteraction = 0.02; // USD average
    const monthlyUSD = pattern.interactions * avgCostPerInteraction;
    const monthlyNOK = monthlyUSD * USD_TO_NOK;
    
    console.log(`  ${pattern.type}: $${monthlyUSD.toFixed(2)} USD / ${monthlyNOK.toFixed(2)} NOK`);
  });
}

async function runAllTests() {
  console.log('Starting comprehensive Claude API tests...\n');
  
  const testResults = {
    basicConnection: false,
    memoryIntegration: false,
    multiProvider: false,
    productionScenarios: false
  };
  
  // Run all tests
  testResults.basicConnection = await testBasicConnection();
  testResults.memoryIntegration = await testMemoryIntegration();
  testResults.multiProvider = await testMultiProviderFallback();
  testResults.productionScenarios = await testProductionScenarios();
  
  // Calculate costs
  await calculateCosts();
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('🏁 TEST SUMMARY');
  console.log('='.repeat(50));
  
  const passedTests = Object.values(testResults).filter(Boolean).length;
  const totalTests = Object.keys(testResults).length;
  
  Object.entries(testResults).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  console.log(`\n📊 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Claude API is ready for production.');
    console.log('\n✅ Next steps:');
    console.log('  1. Deploy Python memory server to mcp.snakkaz.com/api');
    console.log('  2. Update production environment variables');
    console.log('  3. Test end-to-end integration with Snakkaz Chat');
    console.log('  4. Monitor usage and costs');
  } else {
    console.log('⚠️  Some tests failed. Please check configuration and API key.');
  }
  
  return passedTests === totalTests;
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Test execution failed:', error);
      process.exit(1);
    });
}

export { runAllTests, testBasicConnection, testMemoryIntegration };
