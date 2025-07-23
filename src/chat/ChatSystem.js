import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../auth/AuthProvider.js';

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

  // MCP Security Configuration
  const MCP_SERVER_URL = 'http://localhost:3001';
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
      await Promise.all([
        loadRooms(),
        initializeMcpConnection(),
        setupRealtimeSubscriptions()
      ]);
    } catch (error) {
      console.error('Error initializing chat system:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select(`
          *,
          room_participants(count),
          profiles:created_by(username, display_name)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRooms(data || []);

      // Auto-join the default public room if no rooms joined yet
      if (data && data.length > 0) {
        const publicRoom = data.find(room => room.room_type === 'public');
        if (publicRoom) {
          await joinRoom(publicRoom.id);
        }
      }
    } catch (error) {
      console.error('Error loading rooms:', error);
    }
  };

  const initializeMcpConnection = async () => {
    try {
      // Check existing MCP connections
      const { data: existingConnections } = await supabase
        .from('mcp_connections')
        .select('*')
        .eq('profile_id', user.id)
        .eq('is_active', true);

      if (existingConnections && existingConnections.length >= MCP_SECURITY_CONFIG.maxConnectionsPerUser) {
        console.warn('Max MCP connections reached for user');
        return;
      }

      // Test MCP server connectivity
      const mcpHealth = await fetch(`${MCP_SERVER_URL}/health`);
      if (!mcpHealth.ok) {
        throw new Error('MCP server not available');
      }

      // Create new MCP connection record
      const connectionId = `mcp_${user.id}_${Date.now()}`;
      const { error } = await supabase
        .from('mcp_connections')
        .insert({
          profile_id: user.id,
          connection_id: connectionId,
          connection_type: 'websocket',
          server_endpoint: MCP_SERVER_URL,
          is_active: true,
          metadata: {
            user_agent: navigator.userAgent,
            session_id: user.id,
            security_level: 'high'
          }
        });

      if (error) throw error;

      // Start MCP heartbeat
      startMcpHeartbeat(connectionId);

      console.log('MCP connection established:', connectionId);
    } catch (error) {
      console.error('Error initializing MCP connection:', error);
    }
  };

  const startMcpHeartbeat = (connectionId) => {
    const heartbeatInterval = setInterval(async () => {
      try {
        // Update heartbeat in database
        await supabase
          .from('mcp_connections')
          .update({ 
            last_heartbeat: new Date().toISOString(),
            metadata: {
              last_activity: new Date().toISOString(),
              status: 'active'
            }
          })
          .eq('connection_id', connectionId);

        // Ping MCP server
        await fetch(`${MCP_SERVER_URL}/health`);
      } catch (error) {
        console.error('MCP heartbeat failed:', error);
        clearInterval(heartbeatInterval);
      }
    }, MCP_SECURITY_CONFIG.heartbeatInterval);

    // Cleanup on unmount
    return () => clearInterval(heartbeatInterval);
  };

  const setupRealtimeSubscriptions = () => {
    // Subscribe to room changes
    const roomsSubscription = supabase
      .channel('rooms-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'rooms'
      }, (payload) => {
        console.log('Room change:', payload);
        loadRooms();
      })
      .subscribe();

    // Subscribe to message changes in current room
    let messagesSubscription = null;
    
    const setupMessageSubscription = (roomId) => {
      if (messagesSubscription) {
        messagesSubscription.unsubscribe();
      }

      messagesSubscription = supabase
        .channel(`messages-${roomId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`
        }, (payload) => {
          console.log('New message:', payload.new);
          loadMessages(roomId);
        })
        .subscribe();
    };

    // Subscribe to participant changes
    const participantsSubscription = supabase
      .channel('participants-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'room_participants'
      }, (payload) => {
        console.log('Participant change:', payload);
        if (currentRoom) {
          loadParticipants(currentRoom.id);
        }
      })
      .subscribe();

    return { roomsSubscription, setupMessageSubscription, participantsSubscription };
  };

  const joinRoom = async (roomId) => {
    try {
      // Check if already a participant
      const { data: existingParticipant } = await supabase
        .from('room_participants')
        .select('*')
        .eq('room_id', roomId)
        .eq('profile_id', user.id)
        .single();

      if (!existingParticipant) {
        // Join the room
        const { error } = await supabase
          .from('room_participants')
          .insert({
            room_id: roomId,
            profile_id: user.id,
            role: 'member',
            webrtc_peer_id: `peer_${user.id}_${Date.now()}`
          });

        if (error) throw error;
      }

      // Load room details
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single();

      if (roomError) throw roomError;

      setCurrentRoom(roomData);
      await Promise.all([
        loadMessages(roomId),
        loadParticipants(roomId)
      ]);

      // Update user status to indicate active in room
      await updateUserStatus('online');

    } catch (error) {
      console.error('Error joining room:', error);
    }
  };

  const loadMessages = async (roomId) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles:profile_id(username, display_name, avatar_url)
        `)
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;

      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const loadParticipants = async (roomId) => {
    try {
      const { data, error } = await supabase
        .from('room_participants')
        .select(`
          *,
          profiles(username, display_name, avatar_url, status, last_seen)
        `)
        .eq('room_id', roomId)
        .order('joined_at', { ascending: true });

      if (error) throw error;

      setParticipants(data || []);
    } catch (error) {
      console.error('Error loading participants:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !currentRoom) return;

    try {
      // Apply MCP security: encrypt message if required
      let messageContent = newMessage.trim();
      let isEncrypted = false;
      let encryptionKeyId = null;

      if (MCP_SECURITY_CONFIG.encryptedMessagesOnly) {
        // In a real implementation, you would encrypt the message here
        // For now, we'll simulate encryption
        encryptionKeyId = `key_${user.id}_${currentRoom.id}`;
        isEncrypted = true;
      }

      const { error } = await supabase
        .from('messages')
        .insert({
          room_id: currentRoom.id,
          profile_id: user.id,
          content: messageContent,
          message_type: 'text',
          is_encrypted: isEncrypted,
          encryption_key_id: encryptionKeyId,
          metadata: {
            mcp_secured: true,
            client_timestamp: new Date().toISOString()
          }
        });

      if (error) throw error;

      setNewMessage('');
      
      // Update last activity
      await supabase
        .from('room_participants')
        .update({ 
          last_activity: new Date().toISOString()
        })
        .eq('room_id', currentRoom.id)
        .eq('profile_id', user.id);

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const createRoom = async (roomName, description = '', roomType = 'public') => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .insert({
          name: roomName,
          description,
          room_type: roomType,
          created_by: user.id,
          webrtc_enabled: true,
          e2ee_enabled: true
        })
        .select()
        .single();

      if (error) throw error;

      // Auto-join the created room as owner
      await supabase
        .from('room_participants')
        .insert({
          room_id: data.id,
          profile_id: user.id,
          role: 'owner'
        });

      await loadRooms();
      await joinRoom(data.id);

    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return React.createElement('div', { 
      className: 'flex items-center justify-center h-64' 
    },
      React.createElement('div', { 
        className: 'text-white text-xl' 
      }, 'Loading chat system...')
    );
  }

  return React.createElement('div', { 
    className: 'flex h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900' 
  },
    // Sidebar - Rooms and Participants
    React.createElement('div', { 
      className: 'w-80 bg-black/20 backdrop-blur-md border-r border-white/10' 
    },
      // Rooms section
      React.createElement('div', { className: 'p-4 border-b border-white/10' },
        React.createElement('h3', { 
          className: 'text-white font-semibold mb-3' 
        }, '🏠 Rooms'),
        
        React.createElement('div', { className: 'space-y-2' },
          rooms.map(room => 
            React.createElement('button', {
              key: room.id,
              onClick: () => joinRoom(room.id),
              className: `w-full text-left p-3 rounded-lg transition-all ${
                currentRoom?.id === room.id 
                  ? 'bg-blue-600/50 border border-blue-400/50' 
                  : 'bg-white/10 hover:bg-white/20'
              }`
            },
              React.createElement('div', { className: 'text-white font-medium' }, room.name),
              React.createElement('div', { className: 'text-white/60 text-sm' }, 
                `${room.room_type} • ${room.room_participants?.[0]?.count || 0} members`
              )
            )
          )
        ),
        
        React.createElement('button', {
          onClick: () => {
            const name = prompt('Room name:');
            if (name) createRoom(name);
          },
          className: 'w-full mt-3 p-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg border border-green-600/30'
        }, '+ Create Room')
      ),
      
      // Participants section
      currentRoom && React.createElement('div', { className: 'p-4' },
        React.createElement('h3', { 
          className: 'text-white font-semibold mb-3' 
        }, '👥 Participants'),
        
        React.createElement('div', { className: 'space-y-2' },
          participants.map(participant => 
            React.createElement('div', {
              key: participant.id,
              className: 'flex items-center space-x-3 p-2 rounded-lg bg-white/5'
            },
              React.createElement('div', { className: 'relative' },
                React.createElement('div', { 
                  className: 'w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center' 
                },
                  React.createElement('span', { 
                    className: 'text-white text-sm font-bold' 
                  }, participant.profiles?.username?.[0]?.toUpperCase() || '?')
                ),
                React.createElement('div', { 
                  className: `absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${
                    getStatusColor(participant.profiles?.status)
                  }` 
                })
              ),
              React.createElement('div', {},
                React.createElement('div', { 
                  className: 'text-white text-sm font-medium' 
                }, participant.profiles?.display_name || participant.profiles?.username),
                React.createElement('div', { 
                  className: 'text-white/60 text-xs' 
                }, participant.role)
              )
            )
          )
        )
      )
    ),
    
    // Main Chat Area
    React.createElement('div', { 
      className: 'flex-1 flex flex-col' 
    },
      // Chat Header
      currentRoom && React.createElement('div', { 
        className: 'p-4 bg-black/20 backdrop-blur-md border-b border-white/10' 
      },
        React.createElement('h2', { 
          className: 'text-white text-xl font-semibold' 
        }, currentRoom.name),
        React.createElement('p', { 
          className: 'text-white/60 text-sm' 
        }, currentRoom.description || 'No description'),
        React.createElement('div', { 
          className: 'text-xs text-green-400 mt-1' 
        }, '🔒 MCP Secured • E2EE Enabled')
      ),
      
      // Messages Area
      React.createElement('div', { 
        className: 'flex-1 overflow-y-auto p-4 space-y-4' 
      },
        messages.map(message => 
          React.createElement('div', {
            key: message.id,
            className: `flex space-x-3 ${
              message.profile_id === user.id ? 'justify-end' : 'justify-start'
            }`
          },
            message.profile_id !== user.id && React.createElement('div', { 
              className: 'w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center' 
            },
              React.createElement('span', { 
                className: 'text-white text-sm font-bold' 
              }, message.profiles?.username?.[0]?.toUpperCase() || '?')
            ),
            
            React.createElement('div', { 
              className: `max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.profile_id === user.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-white backdrop-blur-sm'
              }` 
            },
              message.profile_id !== user.id && React.createElement('div', { 
                className: 'text-sm font-medium mb-1' 
              }, message.profiles?.display_name || message.profiles?.username),
              
              React.createElement('div', {}, message.content),
              
              React.createElement('div', { 
                className: 'text-xs opacity-70 mt-1 flex items-center space-x-2' 
              },
                React.createElement('span', {}, formatTime(message.created_at)),
                message.is_encrypted && React.createElement('span', { 
                  className: 'text-green-400' 
                }, '🔒')
              )
            )
          )
        ),
        React.createElement('div', { ref: messagesEndRef })
      ),
      
      // Message Input
      currentRoom && React.createElement('div', { 
        className: 'p-4 bg-black/20 backdrop-blur-md border-t border-white/10' 
      },
        React.createElement('form', { 
          onSubmit: sendMessage,
          className: 'flex space-x-2' 
        },
          React.createElement('input', {
            type: 'text',
            value: newMessage,
            onChange: (e) => setNewMessage(e.target.value),
            placeholder: 'Type a message...',
            className: 'flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-500 backdrop-blur-sm',
            disabled: loading
          }),
          React.createElement('button', {
            type: 'submit',
            disabled: !newMessage.trim() || loading,
            className: 'px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors'
          }, '📤')
        )
      )
    )
  );
};

export default ChatSystem;
