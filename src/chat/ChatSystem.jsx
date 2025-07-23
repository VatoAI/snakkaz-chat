import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../auth/AuthProvider.js';
import { getEnvironmentConfig } from '../config/environment.js';

const ChatSystem = () => {
  const { user, profile, supabase, updateUserStatus } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState([]);
  const [mcpConnections, setMcpConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Environment-aware configuration
  const envConfig = getEnvironmentConfig();
  const MCP_SERVER_URL = envConfig.mcpServerUrl;
  const MCP_SECURITY_CONFIG = {
    maxConnectionsPerUser: 3,
    encryptedMessagesOnly: true,
    requireActiveSession: true,
    heartbeatInterval: 30000, // 30 seconds
  };

  useEffect(() => {
    if (user && profile) {
      initializeChatSystem();
    }
  }, [user, profile]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChatSystem = async () => {
    try {
      const promises = [
        loadRooms(),
        setupRealtimeSubscriptions()
      ];
      
      // Only initialize MCP in development
      if (envConfig.features.mcpConnections && MCP_SERVER_URL) {
        promises.push(initializeMcpConnection());
      } else {
        console.log('MCP connections disabled in production');
      }
      
      await Promise.all(promises);
    } catch (error) {
      console.error('Error initializing chat system:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRooms = async () => {
    try {
      // Fixed query for rooms - simplified to avoid join errors
      const { data, error } = await supabase
        .from('rooms')
        .select(`
          *,
          profiles:created_by(username, display_name)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading rooms:', error);
        // Fallback: try simpler query
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('rooms')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });
          
        if (!fallbackError) {
          setRooms(fallbackData || []);
        }
      } else {
        setRooms(data || []);
      }
    } catch (error) {
      console.error('Error loading rooms:', error);
      setRooms([]); // Set empty array as fallback
    }
  };

  const initializeMcpConnection = async () => {
    // Skip MCP in production
    if (!envConfig.features.mcpConnections || !MCP_SERVER_URL) {
      console.log('MCP connections disabled');
      return;
    }

    try {
      // Check if mcp_connections table exists - handle gracefully if not
      const { data: existingConnections, error: queryError } = await supabase
        .from('mcp_connections')
        .select('*')
        .eq('profile_id', user.id)
        .eq('is_active', true);

      if (queryError) {
        console.warn('MCP connections table not available:', queryError.message);
        return;
      }

      if (existingConnections && existingConnections.length >= MCP_SECURITY_CONFIG.maxConnectionsPerUser) {
        console.warn('Max MCP connections reached for user');
        return;
      }

      // Test MCP server connectivity
      try {
        const mcpHealth = await fetch(`${MCP_SERVER_URL}/health`);
        if (!mcpHealth.ok) {
          throw new Error('MCP server not available');
        }
      } catch (fetchError) {
        console.warn('MCP server not reachable:', fetchError.message);
        return;
      }

      // Create new MCP connection record
      const connectionId = `mcp_${user.id}_${Date.now()}`;
      const { error } = await supabase
        .from('mcp_connections')
        .insert({
          id: connectionId,
          profile_id: user.id,
          server_url: MCP_SERVER_URL,
          is_active: true,
          connection_type: 'websocket',
          encryption_enabled: MCP_SECURITY_CONFIG.encryptedMessagesOnly,
          heartbeat_interval: MCP_SECURITY_CONFIG.heartbeatInterval,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error creating MCP connection:', error);
      } else {
        console.log('MCP connection established:', connectionId);
        loadMcpConnections();
      }
    } catch (error) {
      console.error('Error initializing MCP connection:', error);
    }
  };

  const loadMcpConnections = async () => {
    if (!envConfig.features.mcpConnections) return;

    try {
      const { data, error } = await supabase
        .from('mcp_connections')
        .select('*')
        .eq('profile_id', user.id)
        .eq('is_active', true);

      if (error) {
        console.warn('Could not load MCP connections:', error.message);
        return;
      }

      setMcpConnections(data || []);
    } catch (error) {
      console.error('Error loading MCP connections:', error);
    }
  };

  const setupRealtimeSubscriptions = async () => {
    if (!supabase) return;

    try {
      // Subscribe to room changes
      const roomSubscription = supabase
        .channel('rooms')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'rooms' },
          (payload) => {
            console.log('Room change:', payload);
            loadRooms();
          }
        )
        .subscribe();

      // Subscribe to message changes if in a room
      if (currentRoom) {
        const messageSubscription = supabase
          .channel(`messages:${currentRoom.id}`)
          .on('postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${currentRoom.id}` },
            (payload) => {
              console.log('New message:', payload);
              loadMessages();
            }
          )
          .subscribe();
      }
    } catch (error) {
      console.error('Error setting up realtime subscriptions:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    if (!currentRoom) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles:author_id(username, display_name, avatar_url)
        `)
        .eq('room_id', currentRoom.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
      } else {
        setMessages(data || []);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const joinRoom = async (room) => {
    try {
      setCurrentRoom(room);
      await loadMessages();
      await loadParticipants(room.id);
      
      // Update user status
      await updateUserStatus('online', `In room: ${room.name}`);
    } catch (error) {
      console.error('Error joining room:', error);
    }
  };

  const loadParticipants = async (roomId) => {
    try {
      const { data, error } = await supabase
        .from('room_participants')
        .select(`
          *,
          profiles:profile_id(username, display_name, avatar_url, status)
        `)
        .eq('room_id', roomId)
        .eq('is_active', true);

      if (error) {
        console.error('Error loading participants:', error);
      } else {
        setParticipants(data || []);
      }
    } catch (error) {
      console.error('Error loading participants:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentRoom) return;

    try {
      const messageData = {
        room_id: currentRoom.id,
        author_id: user.id,
        content: newMessage.trim(),
        message_type: 'text',
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('messages')
        .insert(messageData);

      if (error) {
        console.error('Error sending message:', error);
      } else {
        setNewMessage('');
        await loadMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const createRoom = async (roomName, description = '') => {
    try {
      const roomData = {
        name: roomName,
        description: description,
        created_by: user.id,
        is_active: true,
        room_type: 'public',
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('rooms')
        .insert(roomData)
        .select()
        .single();

      if (error) {
        console.error('Error creating room:', error);
        return null;
      }

      // Join the creator to the room
      await supabase
        .from('room_participants')
        .insert({
          room_id: data.id,
          profile_id: user.id,
          role: 'admin',
          is_active: true,
          joined_at: new Date().toISOString()
        });

      await loadRooms();
      return data;
    } catch (error) {
      console.error('Error creating room:', error);
      return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-400">Loading chat system...</span>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-slate-900 text-white">
      {/* Rooms Sidebar */}
      <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-blue-400">SnakkaZ Rooms</h2>
          {envConfig.isProduction && (
            <div className="mt-2 text-xs text-yellow-400 bg-yellow-900/20 px-2 py-1 rounded">
              🚀 Production Mode
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => joinRoom(room)}
              className={`w-full text-left p-3 hover:bg-slate-700 border-b border-slate-700 transition-colors ${
                currentRoom?.id === room.id ? 'bg-slate-700 border-l-2 border-l-blue-500' : ''
              }`}
            >
              <div className="font-medium text-white">{room.name}</div>
              {room.description && (
                <div className="text-sm text-gray-400 mt-1">{room.description}</div>
              )}
              <div className="text-xs text-gray-500 mt-1">
                Created {new Date(room.created_at).toLocaleDateString()}
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-700">
          <button 
            onClick={() => {
              const roomName = prompt('Enter room name:');
              if (roomName) {
                const description = prompt('Enter room description (optional):');
                createRoom(roomName, description);
              }
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
          >
            + Create Room
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentRoom ? (
          <>
            {/* Chat Header */}
            <div className="bg-slate-800 border-b border-slate-700 p-4">
              <h3 className="text-lg font-semibold text-white">{currentRoom.name}</h3>
              {currentRoom.description && (
                <p className="text-sm text-gray-400 mt-1">{currentRoom.description}</p>
              )}
              <div className="text-xs text-gray-500 mt-2">
                {participants.length} participant{participants.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {message.profiles?.display_name?.[0] || message.profiles?.username?.[0] || 'U'}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-white">
                        {message.profiles?.display_name || message.profiles?.username || 'Unknown User'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-gray-300 mt-1">{message.content}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-slate-800 border-t border-slate-700 p-4">
              <form onSubmit={sendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message ${currentRoom.name}...`}
                  className="flex-1 bg-slate-700 text-white border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white px-4 py-2 rounded transition-colors"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-2">Welcome to SnakkaZ</h3>
              <p className="text-gray-400 mb-4">Select a room to start chatting</p>
              {rooms.length === 0 && (
                <p className="text-sm text-gray-500">No rooms available. Create one to get started!</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Participants Sidebar */}
      {currentRoom && participants.length > 0 && (
        <div className="w-48 bg-slate-800 border-l border-slate-700">
          <div className="p-4 border-b border-slate-700">
            <h4 className="text-sm font-semibold text-gray-300">Participants</h4>
          </div>
          <div className="p-2">
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center space-x-2 p-2 rounded hover:bg-slate-700">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs">
                  {participant.profiles?.display_name?.[0] || participant.profiles?.username?.[0] || 'U'}
                </div>
                <span className="text-sm text-white truncate">
                  {participant.profiles?.display_name || participant.profiles?.username || 'Unknown'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSystem;
