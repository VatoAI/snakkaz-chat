import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';

const ChatPageCloudMCP = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const messageEndRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load rooms from Supabase
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data, error } = await supabase
          .from('chat_rooms')
          .select(`
            *,
            profiles:created_by(username, display_name)
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching rooms:', error);
        } else {
          setRooms(data || []);
          
          // If no roomId provided, select the first room
          if (!roomId && data && data.length > 0) {
            navigate(`/chat/${data[0].id}`);
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [roomId, navigate]);

  // Load room details and messages when roomId changes
  useEffect(() => {
    if (!roomId) return;

    const fetchRoomAndMessages = async () => {
      setLoading(true);
      
      // Fetch room details
      const { data: roomData, error: roomError } = await supabase
        .from('chat_rooms')
        .select(`
          *,
          profiles:created_by(username, display_name),
          room_participants(profile_id)
        `)
        .eq('id', roomId)
        .single();
      
      if (roomError) {
        console.error('Error fetching room:', roomError);
        return;
      }
      
      setRoom(roomData);
      
      // Fetch messages for this room
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          profiles:profile_id(username, display_name)
        `)
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });
        
      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
      } else {
        setMessages(messagesData || []);
      }
      
      setLoading(false);
    };
    
    fetchRoomAndMessages();
    
    // Subscribe to new messages
    const messagesSubscription = supabase
      .channel(`room-${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`
      }, (payload) => {
        // Fetch profile info for the new message
        const fetchProfileForMessage = async () => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('username, display_name')
            .eq('id', payload.new.profile_id)
            .single();
            
          // Add the new message with profile info
          const newMessage = {
            ...payload.new,
            profiles: profileData
          };
          
          setMessages(prevMessages => [...prevMessages, newMessage]);
        };
        
        fetchProfileForMessage();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(messagesSubscription);
    };
  }, [roomId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Send a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !roomId || !user) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          room_id: roomId,
          profile_id: user.id,
          content: newMessage,
          message_type: 'text'
        });
        
      if (error) {
        console.error('Error sending message:', error);
      } else {
        setNewMessage('');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };
  
  // Format timestamp to HH:MM
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[1][0]}`;
    }
    return name.substring(0, 2);
  };
  
  // Check if a message was sent by the current user
  const isCurrentUser = (profileId) => {
    return profileId === user?.id;
  };
  
  if (loading && !room) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="glass-container p-8 animate-pulse">
          <div>Loading chat...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-layout">
      {/* Mobile menu toggle */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`sidebar ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src="/icons/snakkaz-icon-192.png" alt="SnakkaZ Logo" />
            <h1>SnakkaZ</h1>
          </div>
          <button className="btn-icon" onClick={() => setMobileMenuOpen(false)}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="chat-list">
          {rooms.map((room) => (
            <div 
              key={room.id}
              className={`chat-item ${roomId === room.id ? 'active' : ''}`}
              onClick={() => {
                navigate(`/chat/${room.id}`);
                setMobileMenuOpen(false);
              }}
            >
              <div className="chat-item-avatar">
                {getInitials(room.name)}
              </div>
              <div className="chat-item-content">
                <div className="chat-item-name">{room.name}</div>
                <div className="chat-item-message">
                  {room.description || 'No description'}
                </div>
              </div>
              <div className="chat-item-time">
                {formatTime(room.created_at)}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="chat-area">
        <div className="chat-header">
          <div className="chat-header-info">
            <button 
              className="btn-icon md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
            <div className="chat-item-avatar">
              {room && getInitials(room.name)}
            </div>
            <div>
              <div className="chat-header-title">{room?.name}</div>
              <div className="chat-header-status">
                {room?.room_participants?.length || 0} members
              </div>
            </div>
          </div>
          <div className="chat-header-actions">
            <button className="btn-icon">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
            <button className="btn-icon">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="message-bubble system animate-fadeIn">
              <div className="message-text">No messages yet. Start the conversation!</div>
            </div>
          ) : (
            messages.map((message) => {
              const isSelf = isCurrentUser(message.profile_id);
              
              if (message.message_type === 'system') {
                return (
                  <div key={message.id} className="message-bubble system animate-fadeIn">
                    <div className="message-text">{message.content}</div>
                    <div className="message-time">{formatTime(message.created_at)}</div>
                  </div>
                );
              }
              
              return (
                <div 
                  key={message.id} 
                  className={`message-bubble ${isSelf ? 'sent' : 'received'} animate-fadeIn`}
                >
                  {!isSelf && (
                    <div className="message-sender">
                      {message.profiles?.display_name || message.profiles?.username || 'Unknown User'}
                    </div>
                  )}
                  <div className="message-text">{message.content}</div>
                  <div className="message-time">{formatTime(message.created_at)}</div>
                </div>
              );
            })
          )}
          <div ref={messageEndRef}></div>
        </div>
        
        <div className="chat-input-area">
          <form onSubmit={handleSendMessage} className="chat-input-container">
            <button type="button" className="btn-icon">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
              </svg>
            </button>
            <input 
              type="text" 
              className="chat-input"
              placeholder="Message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <div className="chat-input-actions">
              <button type="button" className="btn-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </button>
              <button type="submit" className="btn-icon primary">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="mobile-nav">
        <button className="btn-icon">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
        </button>
        <button className="btn-icon active">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
        </button>
        <button className="btn-icon" onClick={() => navigate('/profile')}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </button>
        <button className="btn-icon" onClick={() => navigate('/settings')}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatPageCloudMCP;
