/**
 * Supabase Connection & Auth Tester
 * Tests all critical authentication functions
 */
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

export const SupabaseAuthTester: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'failed'>('testing');
  const [user, setUser] = useState<User | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [email, setEmail] = useState('test@snakkaz.com');
  const [password, setPassword] = useState('testpass123');
  const [loading, setLoading] = useState(false);

  // Test database connection
  const testConnection = async () => {
    try {
      const { data: profiles, error } = await supabase.from('profiles').select('count').limit(1);
      if (error) throw error;
      
      setConnectionStatus('connected');
      addTestResult('✅ Database connection successful');
      addTestResult(`📊 Found profiles table with ${profiles?.length || 0} records`);
      return true;
    } catch (error) {
      setConnectionStatus('failed');
      addTestResult(`❌ Database connection failed: ${error}`);
      return false;
    }
  };

  // Test user registration
  const testRegistration = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: email.split('@')[0],
            display_name: 'Test User'
          }
        }
      });

      if (error) throw error;
      
      addTestResult('✅ User registration successful');
      if (data.user) {
        addTestResult(`👤 User created: ${data.user.email}`);
      }
    } catch (error) {
      addTestResult(`❌ Registration failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Test user login
  const testLogin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      addTestResult('✅ User login successful');
      setUser(data.user);
      if (data.user) {
        addTestResult(`👤 Logged in as: ${data.user.email}`);
      }
    } catch (error) {
      addTestResult(`❌ Login failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Test user logout
  const testLogout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      addTestResult('✅ User logout successful');
      setUser(null);
    } catch (error) {
      addTestResult(`❌ Logout failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Test profile creation
  const testProfileCreation = async () => {
    if (!user) {
      addTestResult('❌ No user logged in for profile test');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: email.split('@')[0],
          display_name: 'Test User',
          status: 'online'
        })
        .select()
        .single();

      if (error) throw error;
      
      addTestResult('✅ Profile creation successful');
      addTestResult(`👤 Profile created: ${data.username}`);
    } catch (error) {
      addTestResult(`❌ Profile creation failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Add test result to log
  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  // Run initial connection test
  useEffect(() => {
    testConnection();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      addTestResult(`🔄 Auth state changed: ${event}`);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-cyberdark-900/90 rounded-xl border-2 border-cyberblue-500/50 shadow-2xl">
      <h2 className="text-3xl font-bold text-cyberblue-400 mb-6 text-center">
        🧪 Supabase Authentication Tester
      </h2>
      
      <div className="mb-4 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-cyberblue-900/50 rounded-lg border border-cyberblue-500/30">
          <span className="text-cyberblue-300 font-medium">
            Live Testing Environment • Database: wqpoozpbceucynsojmbk
          </span>
        </div>
      </div>
      
      {/* Connection Status */}
      <div className="mb-6 p-4 rounded border border-cyberblue-500/20">
        <h3 className="text-lg font-semibold text-cyberblue-300 mb-2">Connection Status</h3>
        <div className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium ${
          connectionStatus === 'connected' ? 'bg-green-900/30 text-green-400' :
          connectionStatus === 'failed' ? 'bg-red-900/30 text-red-400' :
          'bg-yellow-900/30 text-yellow-400'
        }`}>
          {connectionStatus === 'connected' ? '✅ Connected' :
           connectionStatus === 'failed' ? '❌ Failed' :
           '🔄 Testing...'}
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="mb-6 p-4 rounded border border-green-500/20 bg-green-900/10">
          <h3 className="text-lg font-semibold text-green-400 mb-2">Current User</h3>
          <p className="text-green-300">Email: {user.email}</p>
          <p className="text-green-300">ID: {user.id}</p>
          <p className="text-green-300">Created: {new Date(user.created_at).toLocaleString()}</p>
        </div>
      )}

      {/* Test Controls */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-cyberblue-300 text-sm font-medium mb-2">
            Test Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-cyberdark-800 border border-cyberblue-500/30 rounded text-white focus:border-cyberblue-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-cyberblue-300 text-sm font-medium mb-2">
            Test Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-cyberdark-800 border border-cyberblue-500/30 rounded text-white focus:border-cyberblue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Test Buttons */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-5 gap-2">
        <button
          onClick={testConnection}
          disabled={loading}
          className="px-4 py-2 bg-cyberblue-600 hover:bg-cyberblue-700 text-white rounded disabled:opacity-50"
        >
          Test Connection
        </button>
        <button
          onClick={testRegistration}
          disabled={loading}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
        >
          Test Register
        </button>
        <button
          onClick={testLogin}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
        >
          Test Login
        </button>
        <button
          onClick={testProfileCreation}
          disabled={loading || !user}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded disabled:opacity-50"
        >
          Test Profile
        </button>
        <button
          onClick={testLogout}
          disabled={loading || !user}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50"
        >
          Test Logout
        </button>
      </div>

      {/* Test Results Log */}
      <div className="p-4 bg-cyberdark-800 rounded border border-cyberblue-500/20">
        <h3 className="text-lg font-semibold text-cyberblue-300 mb-3">Test Results</h3>
        <div className="space-y-1 max-h-60 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-400 italic">No test results yet...</p>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono text-gray-300">
                {result}
              </div>
            ))
          )}
        </div>
        <button
          onClick={() => setTestResults([])}
          className="mt-3 px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
        >
          Clear Log
        </button>
      </div>
    </div>
  );
};
