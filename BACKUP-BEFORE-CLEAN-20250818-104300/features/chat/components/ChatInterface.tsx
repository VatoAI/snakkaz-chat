import React, { useState, useEffect, useRef } from 'react';
import { StandardLoading } from '../common/StandardLoading';
import { useMessages, useChatRooms } from '../../hooks/useChat';
import { Send, Hash, Users, Plus, MessageCircle, Sparkles } from 'lucide-react';

export const ChatInterface: React.FC = () => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat rooms
  const { rooms, loading: roomsLoading, createRoom } = useChatRooms();

  // Load messages for selected room
  const {
    messages,
    loading: messagesLoading,
    sendMessage
  } = useMessages(selectedRoomId);

  // Auto-select first room when rooms load
  useEffect(() => {
    if (rooms.length > 0 && !selectedRoomId) {
      setSelectedRoomId(rooms[0].id);
    }
  }, [rooms, selectedRoomId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedRoomId || sending) {
      return;
    }

    setSending(true);
    const success = await sendMessage(messageInput);
    if (success) {
      setMessageInput('');
    }
    setSending(false);
  };

  // Handle key press in message input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Create a demo room if none exist
  const handleCreateDemoRoom = async () => {
    await createRoom('Hovedchat', 'Velkommen til SnakkaZ chat!');
  };

  // Show loading screen while rooms are loading
  if (roomsLoading) {
    return <StandardLoading message="Laster chatrom..." />;
  }

  return (
    <div
      style={{
        height: '100%',
        background: 'linear-gradient(135deg, var(--snakkaz-dark) 0%, var(--snakkaz-surface) 100%)',
        position: 'relative',
        fontFamily: 'var(--font-body)'
      }}
      className="flex"
    >
      {/* Liquid Dream Background Effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `
          radial-gradient(circle at 20% 50%, rgba(100, 181, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(77, 208, 225, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(129, 199, 132, 0.1) 0%, transparent 50%)
        `,
        animation: 'liquidDream 20s ease-in-out infinite',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Sidebar - Room List */}
      <div
        style={{
          width: '320px',
          background: 'var(--glass-bg)',
          backdropFilter: 'var(--backdrop-blur)',
          WebkitBackdropFilter: 'var(--backdrop-blur)',
          border: '1px solid var(--glass-border)',
          borderRadius: '0',
          borderTopLeftRadius: '16px',
          borderBottomLeftRadius: '16px',
          position: 'relative',
          zIndex: 1
        }}
        className="flex flex-col"
      >
        {/* Sidebar Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--glass-border)',
          background: 'rgba(255, 255, 255, 0.05)'
        }}>
          <div className="flex items-center justify-between">
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }} className="flex items-center gap-2">
              <Hash size={20} style={{ color: 'var(--snakkaz-primary)' }} />
              Chatrom
            </h2>
            <button
              onClick={handleCreateDemoRoom}
              style={{
                padding: '0.5rem',
                background: 'rgba(var(--snakkaz-primary-rgb), 0.1)',
                border: '1px solid var(--snakkaz-primary)',
                borderRadius: '8px',
                color: 'var(--snakkaz-primary)',
                transition: 'all 0.3s ease'
              }}
              className="hover:bg-opacity-20"
              title="Lag nytt rom"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Room List */}
        <div className="flex-1 overflow-y-auto">
          {rooms.length === 0 ? (
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{
                background: 'rgba(var(--snakkaz-primary-rgb), 0.1)',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '1px solid rgba(var(--snakkaz-primary-rgb), 0.2)'
              }}>
                <MessageCircle size={32} style={{
                  color: 'var(--snakkaz-primary)',
                  margin: '0 auto 1rem auto'
                }} />
                <p style={{
                  color: 'var(--text-secondary)',
                  marginBottom: '1rem',
                  fontSize: '0.9rem'
                }}>
                  Ingen chatrom ennå
                </p>
                <button
                  onClick={handleCreateDemoRoom}
                  style={{
                    background: 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  className="hover:scale-105"
                >
                  <Sparkles size={16} className="inline mr-2" />
                  Lag Hovedchat
                </button>
              </div>
            </div>
          ) : (
            rooms.map((room) => (
              <div
                key={room.id}
                onClick={() => setSelectedRoomId(room.id)}
                style={{
                  padding: '1rem 1.5rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  background: selectedRoomId === room.id
                    ? 'rgba(var(--snakkaz-primary-rgb), 0.15)'
                    : 'transparent',
                  borderLeft: selectedRoomId === room.id
                    ? '4px solid var(--snakkaz-primary)'
                    : '4px solid transparent',
                  transition: 'all 0.3s ease'
                }}
                className="hover:bg-opacity-20"
              >
                <div className="flex items-center gap-3">
                  <Hash size={16} style={{ color: 'var(--snakkaz-primary)' }} />
                  <div className="flex-1">
                    <h3 style={{
                      color: 'var(--text-primary)',
                      fontWeight: '600',
                      fontSize: '0.95rem'
                    }}>
                      {room.name}
                    </h3>
                    {room.description && (
                      <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.8rem',
                        marginTop: '0.25rem'
                      }} className="truncate">
                        {room.description}
                      </p>
                    )}
                  </div>
                  <Users size={14} style={{ color: 'var(--text-secondary)' }} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div
        style={{
          flex: 1,
          background: 'var(--glass-bg)',
          backdropFilter: 'var(--backdrop-blur)',
          WebkitBackdropFilter: 'var(--backdrop-blur)',
          border: '1px solid var(--glass-border)',
          borderLeft: 'none',
          borderTopRightRadius: '16px',
          borderBottomRightRadius: '16px',
          position: 'relative',
          zIndex: 1
        }}
        className="flex flex-col"
      >
        {selectedRoomId ? (
          <>
            {/* Chat Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid var(--glass-border)',
              background: 'rgba(255, 255, 255, 0.05)'
            }}>
              <div className="flex items-center gap-3">
                <Hash size={20} style={{ color: 'var(--snakkaz-primary)' }} />
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)'
                }}>
                  {rooms.find(r => r.id === selectedRoomId)?.name || 'Chat'}
                </h3>
                <div style={{
                  marginLeft: 'auto',
                  padding: '0.5rem 1rem',
                  background: 'rgba(var(--snakkaz-secondary-rgb), 0.1)',
                  borderRadius: '20px',
                  border: '1px solid rgba(var(--snakkaz-secondary-rgb), 0.3)',
                  fontSize: '0.75rem',
                  color: 'var(--snakkaz-secondary)',
                  fontWeight: '600'
                }}>
                  🌊 LIVE
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1.5rem',
                background: 'rgba(0, 0, 0, 0.1)'
              }}
              className="space-y-4"
            >
              {messagesLoading ? (
                <div className="flex justify-center py-8">
                  <StandardLoading message="Laster meldinger..." />
                </div>
              ) : messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <div style={{
                    background: 'rgba(var(--snakkaz-primary-rgb), 0.1)',
                    borderRadius: '20px',
                    padding: '2rem',
                    border: '1px solid rgba(var(--snakkaz-primary-rgb), 0.2)',
                    maxWidth: '400px',
                    margin: '0 auto'
                  }}>
                    <MessageCircle size={48} style={{
                      color: 'var(--snakkaz-primary)',
                      margin: '0 auto 1rem auto'
                    }} />
                    <p style={{
                      color: 'var(--text-secondary)',
                      marginBottom: '0.5rem',
                      fontSize: '1rem'
                    }}>
                      Ingen meldinger ennå...
                    </p>
                    <p style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.85rem',
                      opacity: 0.8
                    }}>
                      Send den første meldingen og start samtalen! 💬
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="flex gap-3">
                    {/* User Avatar */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      flexShrink: 0,
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                    }}>
                      {message.user_profiles?.username?.[0]?.toUpperCase() ||
                        message.user_profiles?.display_name?.[0]?.toUpperCase() ||
                        'U'}
                    </div>

                    {/* Message Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span style={{
                          color: 'var(--text-primary)',
                          fontWeight: '600',
                          fontSize: '0.9rem'
                        }}>
                          {message.user_profiles?.username ||
                            message.user_profiles?.display_name ||
                            'Bruker'}
                        </span>
                        <span style={{
                          color: 'var(--text-secondary)',
                          fontSize: '0.75rem',
                          opacity: 0.7
                        }}>
                          {new Date(message.created_at).toLocaleTimeString('nb-NO', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div style={{
                        background: 'var(--glass-bg)',
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        lineHeight: '1.4'
                      }}>
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div style={{
              padding: '1.5rem',
              borderTop: '1px solid var(--glass-border)',
              background: 'rgba(255, 255, 255, 0.05)'
            }}>
              <div className="flex gap-3">
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Skriv en melding..."
                  style={{
                    flex: 1,
                    background: 'var(--glass-bg)',
                    color: 'var(--text-primary)',
                    borderRadius: '12px',
                    padding: '1rem 1.25rem',
                    border: '1px solid var(--glass-border)',
                    fontSize: '0.9rem',
                    resize: 'none',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  className="focus:border-opacity-50"
                  rows={1}
                  disabled={sending}
                  onFocus={(e) => e.target.style.borderColor = 'var(--snakkaz-primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || sending}
                  style={{
                    background: sending
                      ? 'rgba(128, 128, 128, 0.5)'
                      : 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
                    color: 'white',
                    padding: '1rem 1.5rem',
                    borderRadius: '12px',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    cursor: sending ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                  }}
                  className={!sending ? 'hover:scale-105' : ''}
                >
                  <Send size={16} />
                  {sending ? 'Sender...' : 'Send'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                background: 'rgba(var(--snakkaz-primary-rgb), 0.1)',
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid rgba(var(--snakkaz-primary-rgb), 0.2)'
              }}>
                <Hash size={48} style={{
                  color: 'var(--snakkaz-primary)',
                  margin: '0 auto 1rem auto'
                }} />
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1rem'
                }}>
                  Velg et chatrom for å begynne
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
