/**
 * Supabase Integration Test Page
 * Complete test of authentication and real-time messaging
 */
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useGlobalChat } from '@/hooks/useGlobalChat';
import { SupabaseAuthTester } from '@/components/SupabaseAuthTester';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, User, Database, Wifi, Send, RefreshCw } from 'lucide-react';

export default function SupabaseTestPage() {
  const auth = useAuth();
  const chat = useGlobalChat();
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const success = await chat.sendMessage(newMessage.trim());
      if (success) {
        setNewMessage('');
      }
    }
  };

  return (
    <div className="min-h-screen bg-cyberdark-950 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-cyberblue-400">
            🧪 SnakkaZ Supabase Integration Test
          </h1>
          <p className="text-gray-400">
            Testing authentication, profiles, and real-time messaging
          </p>
        </div>

        {/* Status Overview */}
        <Card className="bg-cyberdark-900/80 border-cyberblue-500/30">
          <CardHeader>
            <CardTitle className="text-cyberblue-400 flex items-center gap-2">
              <Database className="w-5 h-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Auth Status */}
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-sm">Authentication:</span>
                <Badge variant={auth.authenticated ? "default" : "destructive"}>
                  {auth.loading ? "Loading..." : auth.authenticated ? "Connected" : "Disconnected"}
                </Badge>
              </div>

              {/* Profile Status */}
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-sm">Profile:</span>
                <Badge variant={auth.profile ? "default" : "secondary"}>
                  {auth.profile ? "Loaded" : "None"}
                </Badge>
              </div>

              {/* Chat Status */}
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">Chat:</span>
                <Badge variant={chat.connected ? "default" : "destructive"}>
                  {chat.connected ? "Connected" : "Disconnected"}
                </Badge>
              </div>

              {/* Room Status */}
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4" />
                <span className="text-sm">Room:</span>
                <Badge variant={chat.currentRoom ? "default" : "secondary"}>
                  {chat.currentRoom ? chat.currentRoom.name : "None"}
                </Badge>
              </div>

            </div>

            {/* User Info */}
            {auth.profile && (
              <div className="p-3 bg-cyberdark-800 rounded border border-cyberblue-500/20">
                <h4 className="text-cyberblue-300 font-medium mb-2">Current User</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Username:</span>
                    <span className="ml-2 text-white">{auth.profile.username}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Display Name:</span>
                    <span className="ml-2 text-white">{auth.profile.display_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <span className="ml-2 text-white">{auth.profile.status}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">ID:</span>
                    <span className="ml-2 text-white font-mono text-xs">{auth.profile.id.slice(0, 8)}...</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Test Section */}
        {auth.authenticated && (
          <Card className="bg-cyberdark-900/80 border-cyberblue-500/30">
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
            <CardContent className="space-y-4">
              
              {/* Messages Display */}
              <div className="h-60 bg-cyberdark-800 rounded border border-cyberblue-500/20 overflow-y-auto p-3 space-y-2">
                {chat.loading && chat.messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <div className="w-6 h-6 border-2 border-cyberblue-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      Loading messages...
                    </div>
                  </div>
                ) : chat.messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No messages yet. Send the first message!
                  </div>
                ) : (
                  chat.messages.map((message) => (
                    <div key={message.id} className="flex gap-2">
                      <div className="w-8 h-8 bg-cyberblue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        {message.profile?.username?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-cyberblue-300 font-medium text-sm">
                            {message.profile?.display_name || message.profile?.username || 'Unknown'}
                          </span>
                          <span className="text-gray-400 text-xs">
                            {new Date(message.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-white text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Send Message Form */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Type a test message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={chat.sending || !chat.connected}
                  className="flex-1 bg-cyberdark-800 border-cyberblue-500/30 text-white placeholder-gray-400"
                />
                <Button
                  type="submit"
                  disabled={chat.sending || !chat.connected || !newMessage.trim()}
                  className="bg-cyberblue-600 hover:bg-cyberblue-700"
                >
                  {chat.sending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>

              <div className="text-xs text-gray-400 text-center">
                {chat.connected 
                  ? `Connected to ${chat.currentRoom?.name} • ${chat.messages.length} messages loaded`
                  : "Disconnected from chat"
                }
              </div>
            </CardContent>
          </Card>
        )}

        <Separator className="bg-cyberblue-500/20" />

        {/* Auth Testing Component */}
        <SupabaseAuthTester />

      </div>
    </div>
  );
}
