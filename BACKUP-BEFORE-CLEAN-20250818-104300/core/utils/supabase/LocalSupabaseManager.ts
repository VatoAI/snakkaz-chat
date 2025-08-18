/**
 * Local Supabase Development Setup Script
 * 
 * Sets up and manages local Supabase development environment
 * for safely testing database optimizations
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Local Supabase configuration
const LOCAL_SUPABASE_URL = 'http://127.0.0.1:8000';
const LOCAL_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

interface SetupResult {
  success: boolean;
  message: string;
  details?: any;
}

class LocalSupabaseManager {
  private localClient: any = null;
  private isRunning = false;

  constructor() {
    this.checkLocalInstance();
  }

  async checkLocalInstance(): Promise<boolean> {
    try {
      const response = await fetch(`${LOCAL_SUPABASE_URL}/health`);
      this.isRunning = response.ok;
      return this.isRunning;
    } catch (error) {
      this.isRunning = false;
      return false;
    }
  }

  async startLocalSupabase(): Promise<SetupResult> {
    try {
      console.log('🚀 Starting local Supabase instance...');
      
      // Check if already running
      if (await this.checkLocalInstance()) {
        return {
          success: true,
          message: 'Local Supabase is already running',
          details: {
            url: LOCAL_SUPABASE_URL,
            studio: 'http://127.0.0.1:8001'
          }
        };
      }

      // Instructions for manual start (since we can't execute shell commands directly)
      const instructions = `
To start local Supabase, run these commands:

1. Make sure Docker is running
2. Run: npx supabase start

After starting, the following services will be available:
- API: http://127.0.0.1:8000
- Studio: http://127.0.0.1:8001  
- DB: postgresql://postgres:postgres@127.0.0.1:5432/postgres

The local environment will use the configuration from supabase/config.toml
      `;

      return {
        success: false,
        message: 'Manual start required',
        details: { instructions }
      };

    } catch (error) {
      return {
        success: false,
        message: `Failed to start local Supabase: ${error}`
      };
    }
  }

  async connectToLocal(): Promise<SetupResult> {
    try {
      if (!await this.checkLocalInstance()) {
        return {
          success: false,
          message: 'Local Supabase is not running. Please start it first.'
        };
      }

      this.localClient = createClient(LOCAL_SUPABASE_URL, LOCAL_SUPABASE_ANON_KEY);
      
      // Test connection
      const { data, error } = await this.localClient
        .from('profiles')
        .select('count')
        .limit(1);

      if (error) {
        return {
          success: false,
          message: `Connection test failed: ${error.message}`
        };
      }

      return {
        success: true,
        message: 'Successfully connected to local Supabase',
        details: {
          url: LOCAL_SUPABASE_URL,
          client: 'Connected'
        }
      };

    } catch (error) {
      return {
        success: false,
        message: `Connection failed: ${error}`
      };
    }
  }

  async applyDatabaseOptimizations(): Promise<SetupResult> {
    try {
      if (!this.localClient) {
        return {
          success: false,
          message: 'Not connected to local Supabase. Connect first.'
        };
      }

      console.log('📊 Applying database optimizations to local instance...');

      // Read the optimization script
      const optimizationScriptPath = path.join(__dirname, '../../config/database/rls-performance-optimization.sql');
      
      if (!fs.existsSync(optimizationScriptPath)) {
        return {
          success: false,
          message: 'Optimization script not found. Please ensure rls-performance-optimization.sql exists.'
        };
      }

      const optimizationSQL = fs.readFileSync(optimizationScriptPath, 'utf8');

      // Split into individual statements and execute
      const statements = optimizationSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      for (const statement of statements) {
        try {
          if (statement.toLowerCase().includes('begin') || 
              statement.toLowerCase().includes('commit')) {
            continue; // Skip transaction control in this context
          }

          await this.localClient.rpc('exec', { query: statement });
          successCount++;
        } catch (error) {
          errorCount++;
          errors.push(`Statement failed: ${error}`);
        }
      }

      return {
        success: errorCount === 0,
        message: `Optimization complete: ${successCount} successful, ${errorCount} errors`,
        details: {
          successful: successCount,
          errors: errorCount,
          errorDetails: errors.slice(0, 5) // Show first 5 errors
        }
      };

    } catch (error) {
      return {
        success: false,
        message: `Failed to apply optimizations: ${error}`
      };
    }
  }

  async testOptimizedPerformance(): Promise<SetupResult> {
    try {
      if (!this.localClient) {
        return {
          success: false,
          message: 'Not connected to local Supabase'
        };
      }

      console.log('🧪 Testing optimized database performance...');

      const testResults = {
        profilesQuery: 0,
        messagesQuery: 0,
        groupsQuery: 0,
        complexJoinQuery: 0
      };

      // Test 1: Simple profiles query
      const start1 = Date.now();
      await this.localClient.from('profiles').select('*').limit(10);
      testResults.profilesQuery = Date.now() - start1;

      // Test 2: Messages query with user filter
      const start2 = Date.now();
      await this.localClient
        .from('messages')
        .select('*')
        .limit(20);
      testResults.messagesQuery = Date.now() - start2;

      // Test 3: Groups with member count
      const start3 = Date.now();
      await this.localClient
        .from('groups')
        .select('*, group_members(count)')
        .limit(10);
      testResults.groupsQuery = Date.now() - start3;

      // Test 4: Complex join query
      const start4 = Date.now();
      await this.localClient
        .from('messages')
        .select(`
          *,
          profiles:sender_id(username, avatar_url),
          groups:group_id(name)
        `)
        .limit(5);
      testResults.complexJoinQuery = Date.now() - start4;

      const averageTime = Object.values(testResults).reduce((a, b) => a + b, 0) / 4;

      return {
        success: true,
        message: `Performance test completed. Average query time: ${averageTime.toFixed(2)}ms`,
        details: testResults
      };

    } catch (error) {
      return {
        success: false,
        message: `Performance test failed: ${error}`
      };
    }
  }

  async resetLocalDatabase(): Promise<SetupResult> {
    try {
      console.log('🔄 Resetting local database...');
      
      return {
        success: false,
        message: 'Manual reset required. Run: npx supabase db reset',
        details: {
          instructions: 'This will reset your local database and re-run all migrations'
        }
      };

    } catch (error) {
      return {
        success: false,
        message: `Reset failed: ${error}`
      };
    }
  }

  async generateLocalTestData(): Promise<SetupResult> {
    try {
      if (!this.localClient) {
        return {
          success: false,
          message: 'Not connected to local Supabase'
        };
      }

      console.log('📝 Generating test data for local development...');

      // Create test users (would need to be done through auth in real scenario)
      const testData = {
        profiles: [
          {
            id: '00000000-0000-0000-0000-000000000001',
            username: 'testuser1',
            full_name: 'Test User 1',
            bio: 'Test user for development'
          },
          {
            id: '00000000-0000-0000-0000-000000000002', 
            username: 'testuser2',
            full_name: 'Test User 2',
            bio: 'Another test user'
          }
        ],
        groups: [
          {
            id: 'test-group-1',
            name: 'Test Group 1',
            description: 'A test group for development',
            creator_id: '00000000-0000-0000-0000-000000000001'
          }
        ]
      };

      // Note: This is a simplified example
      // In reality, you'd need proper auth setup for user creation
      
      return {
        success: true,
        message: 'Test data generation planned',
        details: {
          note: 'Test data should be inserted after proper auth setup',
          testData
        }
      };

    } catch (error) {
      return {
        success: false,
        message: `Test data generation failed: ${error}`
      };
    }
  }

  getLocalEnvironmentInfo() {
    return {
      supabaseUrl: LOCAL_SUPABASE_URL,
      studioUrl: 'http://127.0.0.1:8001',
      databaseUrl: 'postgresql://postgres:postgres@127.0.0.1:5432/postgres',
      configFile: 'supabase/config.toml',
      isRunning: this.isRunning,
      connected: !!this.localClient
    };
  }
}

// Export for use in other modules
export const localSupabaseManager = new LocalSupabaseManager();

// CLI-like interface for direct execution
export async function runLocalSupabaseSetup() {
  console.log('🏗️  LOCAL SUPABASE DEVELOPMENT SETUP');
  console.log('=====================================');
  
  const manager = new LocalSupabaseManager();
  
  // Step 1: Check if running
  console.log('\n📡 Checking local Supabase status...');
  const isRunning = await manager.checkLocalInstance();
  
  if (!isRunning) {
    console.log('❌ Local Supabase is not running');
    
    const startResult = await manager.startLocalSupabase();
    console.log(`ℹ️  ${startResult.message}`);
    
    if (startResult.details?.instructions) {
      console.log(startResult.details.instructions);
    }
    
    return;
  }
  
  console.log('✅ Local Supabase is running');
  
  // Step 2: Connect
  console.log('\n🔌 Connecting to local instance...');
  const connectResult = await manager.connectToLocal();
  console.log(`${connectResult.success ? '✅' : '❌'} ${connectResult.message}`);
  
  if (!connectResult.success) {
    return;
  }
  
  // Step 3: Test performance before optimization
  console.log('\n⏱️  Testing current performance...');
  const beforeTest = await manager.testOptimizedPerformance();
  console.log(`📊 Performance baseline: ${beforeTest.message}`);
  
  // Step 4: Apply optimizations
  console.log('\n🚀 Applying database optimizations...');
  const optimizationResult = await manager.applyDatabaseOptimizations();
  console.log(`${optimizationResult.success ? '✅' : '❌'} ${optimizationResult.message}`);
  
  if (optimizationResult.details) {
    console.log('Details:', optimizationResult.details);
  }
  
  // Step 5: Test performance after optimization
  if (optimizationResult.success) {
    console.log('\n📈 Testing optimized performance...');
    const afterTest = await manager.testOptimizedPerformance();
    console.log(`📊 Optimized performance: ${afterTest.message}`);
  }
  
  // Step 6: Environment info
  console.log('\n🌍 Local Development Environment:');
  const envInfo = manager.getLocalEnvironmentInfo();
  Object.entries(envInfo).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  
  console.log('\n🎉 Local Supabase setup complete!');
  console.log('You can now safely test database optimizations locally.');
}

// Auto-run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runLocalSupabaseSetup().catch(console.error);
}
