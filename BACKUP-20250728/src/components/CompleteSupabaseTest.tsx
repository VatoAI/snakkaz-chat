/**
 * Complete Supabase Integration Test Component
 * Real-time testing of auth, messaging, and database operations
 */
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { useGlobalChat } from '@/hooks/useGlobalChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Database, User, MessageCircle, Check, X, 
  Send, RefreshCw, Eye, EyeOff, AlertCircle,
  UserPlus, LogIn, LogOut, Wifi
} from 'lucide-react';

export const CompleteSupabaseTest: React.FC = () => {
  // Auth state
  const auth = useAuth();
  const chat = useGlobalChat();
  
  // Test states
  const [testResults, setTestResults] = useState<string[]>([]);
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  const [existingUsers, setExistingUsers] = useState<any[]>([]);
  
  // Form states
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: 'test@snakkaz.com', password: 'TestPass123!' });
  const [registerForm, setRegisterForm] = useState({ 
    email: 'newuser@snakkaz.com', 
    password: 'NewPass123!',
    username: 'newuser'
  });
  const [messageText, setMessageText] = useState('');

  // Test results helper
  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  // Test database connection
  const testDatabaseConnection = async () => {
    try {
      addTestResult('🔄 Testing database connection...');
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('username, display_name, status, created_at')
        .limit(5);
      
      if (error) throw error;
      
      setDbConnected(true);
      setExistingUsers(profiles || []);
      addTestResult(`✅ Database connected! Found ${profiles?.length || 0} existing users`);
      
      if (profiles && profiles.length > 0) {
        addTestResult(`👥 Sample users: ${profiles.map(p => p.username).join(', ')}`);
      }
    } catch (error) {
      setDbConnected(false);
      addTestResult(`❌ Database connection failed: ${error}`);
    }
  };

  // Test user registration
  const testRegistration = async () => {
    try {
      addTestResult('🔄 Testing user registration...');
      const result = await auth.signUp(registerForm.email, registerForm.password, registerForm.username);
      
      if (result.success) {
        addTestResult('✅ Registration successful! Check email for verification.');
      } else {
        addTestResult(`❌ Registration failed: ${result.error}`);
      }
    } catch (error) {
      addTestResult(`❌ Registration error: ${error}`);
    }
  };

  // Test user login
  const testLogin = async () => {
    try {
      addTestResult('🔄 Testing user login...');
      const result = await auth.signIn(loginForm.email, loginForm.password);
      
      if (result.success) {
        addTestResult('✅ Login successful!');
      } else {
        addTestResult(`❌ Login failed: ${result.error}`);
      }
    } catch (error) {
      addTestResult(`❌ Login error: ${error}`);
    }
  };

  // Test logout
  const testLogout = async () => {
    try {
      addTestResult('🔄 Testing logout...');
      const result = await auth.signOut();
      
      if (result.success) {
        addTestResult('✅ Logout successful!');
      } else {
        addTestResult(`❌ Logout failed: ${result.error}`);
      }
    } catch (error) {
      addTestResult(`❌ Logout error: ${error}`);
    }
  };

  // Test sending message
  const testSendMessage = async () => {
    if (!messageText.trim()) {
      addTestResult('❌ Please enter a message to send');
      return;
    }

    try {
      addTestResult('🔄 Testing real-time messaging...');
      const success = await chat.sendMessage(messageText.trim());
      
      if (success) {
        addTestResult('✅ Message sent successfully!');
        setMessageText('');
      } else {
        addTestResult('❌ Failed to send message');
      }
    } catch (error) {
      addTestResult(`❌ Message error: ${error}`);
    }
  };

  // Test all functions
  const runFullTest = async () => {
    setTestResults([]);
    await testDatabaseConnection();
    
    if (auth.authenticated) {
      addTestResult('ℹ️ User already logged in, testing chat functionality...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (chat.connected) {
        addTestResult('✅ Chat system connected and ready');
      } else {
        addTestResult('⚠️ Chat system not connected, attempting to join...');
        await chat.joinGlobalRoom();
      }
    } else {
      addTestResult('ℹ️ No user logged in, test registration or login manually');
    }
  };

  // Auto-run connection test on mount
  useEffect(() => {
    testDatabaseConnection();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-cyberblue-400 mb-2">
          🧪 Complete Supabase Integration Test
        </h2>
        <p className="text-gray-400">
          Testing authentication, real-time messaging, and database operations
        </p>
      </div>

      {/* System Status */}
      <Card className="bg-cyberdark-900/90 border-cyberblue-500/50">
        <CardHeader>
          <CardTitle className="text-cyberblue-400 flex items-center gap-2">
            <Database className="w-5 h-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span className="text-sm">Database:</span>
              <Badge variant={dbConnected ? "default" : dbConnected === false ? "destructive" : "secondary"}>
                {dbConnected === null ? "Testing..." : dbConnected ? "Connected" : "Failed"}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="text-sm">Auth:</span>
              <Badge variant={auth.authenticated ? "default" : "secondary"}>
                {auth.loading ? "Loading..." : auth.authenticated ? "Logged In" : "Not Logged In"}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">Chat:</span>
              <Badge variant={chat.connected ? "default" : "secondary"}>
                {chat.connected ? "Connected" : "Disconnected"}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              <span className="text-sm">Room:</span>
              <Badge variant={chat.currentRoom ? "default" : "secondary"}>
                {chat.currentRoom ? chat.currentRoom.name : "None"}
              </Badge>
            </div>

          </div>

          {/* Current User Info */}
          {auth.profile && (
            <Alert className="bg-green-900/20 border-green-500/30">
              <User className="h-4 w-4" />
              <AlertDescription>
                <strong>Logged in as:</strong> {auth.profile.display_name || auth.profile.username} 
                <span className="ml-2 text-xs text-gray-400">({auth.profile.id.slice(0, 8)}...)</span>
              </AlertDescription>
            </Alert>
          )}

          {/* Existing Users */}
          {existingUsers.length > 0 && (
            <div className="mt-4 p-3 bg-cyberdark-800 rounded border border-cyberblue-500/20">
              <h4 className="text-cyberblue-300 font-medium mb-2">Existing Users ({existingUsers.length})</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                {existingUsers.map((user, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-white">{user.username}</span>
                    <span className="text-gray-400 text-xs">{user.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Authentication Tests */}
      <Card className="bg-cyberdark-900/90 border-cyberblue-500/50">
        <CardHeader>
          <CardTitle className="text-cyberblue-400 flex items-center gap-2">
            <User className="w-5 h-5" />
            Authentication Tests
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {!auth.authenticated ? (
            <>
              {/* Login Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-cyberblue-300 font-medium mb-2 flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Login Test
                  </h4>
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-cyberdark-800 border-cyberblue-500/30"
                    />
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                        className="bg-cyberdark-800 border-cyberblue-500/30 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <Button
                      onClick={testLogin}
                      disabled={auth.loading}
                      className="w-full bg-cyberblue-600 hover:bg-cyberblue-700"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Test Login
                    </Button>
                  </div>
                </div>

                {/* Registration Form */}
                <div>
                  <h4 className="text-cyberblue-300 font-medium mb-2 flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Registration Test
                  </h4>
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Username"
                      value={registerForm.username}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, username: e.target.value }))}
                      className="bg-cyberdark-800 border-cyberblue-500/30"
                    />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-cyberdark-800 border-cyberblue-500/30"
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                      className="bg-cyberdark-800 border-cyberblue-500/30"
                    />
                    <Button
                      onClick={testRegistration}
                      disabled={auth.loading}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Test Registration
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center">
              <Alert className="bg-green-900/20 border-green-500/30 mb-4">
                <Check className="h-4 w-4" />
                <AlertDescription>
                  ✅ Authentication successful! User is logged in as <strong>{auth.profile?.username}</strong>
                </AlertDescription>
              </Alert>
              <Button
                onClick={testLogout}
                disabled={auth.loading}
                variant="destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Test Logout
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Tests */}
      {auth.authenticated && (
        <Card className="bg-cyberdark-900/90 border-cyberblue-500/50">
          <CardHeader>
            <CardTitle className="text-cyberblue-400 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Real-time Chat Test
              <Button
                variant="outline"
                size="sm"
                onClick={chat.refreshMessages}
                disabled={chat.loading}
                className="ml-auto"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            
            {/* Message Display */}
            <div className="h-40 bg-cyberdark-800 rounded border border-cyberblue-500/20 overflow-y-auto p-3 mb-4">
              {chat.messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  {chat.loading ? (
                    <div className="text-center">
                      <div className="w-6 h-6 border-2 border-cyberblue-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      Loading messages...
                    </div>
                  ) : (
                    'No messages yet. Send the first message!'
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {chat.messages.slice(-5).map((message) => (
                    <div key={message.id} className="flex gap-2 text-sm">
                      <div className="w-6 h-6 bg-cyberblue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        {message.profile?.username?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-cyberblue-300 font-medium">
                            {message.profile?.display_name || message.profile?.username || 'Unknown'}
                          </span>
                          <span className="text-gray-400 text-xs">
                            {new Date(message.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-white">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Send Message */}
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Type a test message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && testSendMessage()}
                disabled={chat.sending || !chat.connected}
                className="flex-1 bg-cyberdark-800 border-cyberblue-500/30"
              />
              <Button
                onClick={testSendMessage}
                disabled={chat.sending || !chat.connected || !messageText.trim()}
                className="bg-cyberblue-600 hover:bg-cyberblue-700"
              >
                {chat.sending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>

            <div className="text-xs text-gray-400 text-center mt-2">
              {chat.connected 
                ? `Connected to ${chat.currentRoom?.name} • ${chat.messages.length} messages loaded`
                : "Disconnected from chat"
              }
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Controls */}
      <Card className="bg-cyberdark-900/90 border-cyberblue-500/50">
        <CardHeader>
          <CardTitle className="text-cyberblue-400">Test Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              onClick={runFullTest}
              className="bg-cyberblue-600 hover:bg-cyberblue-700"
            >
              🧪 Run Full Test
            </Button>
            <Button
              onClick={testDatabaseConnection}
              variant="outline"
            >
              🗄️ Test Database
            </Button>
            <Button
              onClick={() => setTestResults([])}
              variant="outline"
            >
              🗑️ Clear Log
            </Button>
          </div>

          {/* Test Results */}
          <div className="bg-cyberdark-800 rounded border border-cyberblue-500/20 p-3 max-h-40 overflow-y-auto">
            <h4 className="text-cyberblue-300 font-medium mb-2">Test Results</h4>
            {testResults.length === 0 ? (
              <p className="text-gray-400 italic text-sm">No test results yet...</p>
            ) : (
              <div className="space-y-1">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono text-gray-300">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  );
};
