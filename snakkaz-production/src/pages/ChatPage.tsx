import React, { useState, useEffect, useRef } from 'react'
import { Send, Paperclip, Smile, Users, Search, Settings, MessageCircle, Phone, Video, MoreVertical } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { mcpChat, mcpAnalytics, mcpFiles } from '../lib/mcp-api'

interface Message {
  id: string
  content: string
  user_id: string
  created_at: string
  message_type: 'text' | 'file' | 'image'
  file_url?: string
  user?: {
    full_name: string
    avatar_url?: string
  }
}

interface ChatRoom {
  id: string
  name: string
  description?: string
  is_private: boolean
  premium_only: boolean
  member_count?: number
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    checkUser()
    loadRooms()
    mcpAnalytics.trackEvent('page_view', { page: 'chat' })
  }, [])

  useEffect(() => {
    if (activeRoom) {
      loadMessages(activeRoom.id)
    }
  }, [activeRoom])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      setUser(session.user)
    }
  }

  const loadRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setRooms(data || [])
      if (data && data.length > 0 && !activeRoom) {
        setActiveRoom(data[0])
      }
    } catch (error) {
      console.error('Error loading rooms:', error)
    }
  }

  const loadMessages = async (roomId: string) => {
    try {
      // Try to load from MCP API first
      const mcpResponse = await mcpChat.getMessages(roomId)
      if (mcpResponse.success) {
        setMessages(mcpResponse.data || [])
      } else {
        // Fallback to Supabase
        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            profiles:user_id (
              full_name,
              avatar_url
            )
          `)
          .eq('room_id', roomId)
          .order('created_at', { ascending: true })
          .limit(50)

        if (error) throw error

        setMessages(data?.map(msg => ({
          ...msg,
          user: msg.profiles
        })) || [])
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeRoom || !user) return

    setLoading(true)
    try {
      // Try MCP API first
      const mcpResponse = await mcpChat.sendMessage(
        newMessage.trim(),
        activeRoom.id,
        user.id
      )

      if (mcpResponse.success) {
        // Message sent via MCP, reload messages
        loadMessages(activeRoom.id)
      } else {
        // Fallback to Supabase
        const { data, error } = await supabase
          .from('messages')
          .insert([
            {
              content: newMessage.trim(),
              room_id: activeRoom.id,
              user_id: user.id,
              message_type: 'text'
            }
          ])
          .select()

        if (error) throw error

        // Add message to local state
        const newMsg: Message = {
          id: data[0].id,
          content: newMessage.trim(),
          user_id: user.id,
          created_at: data[0].created_at,
          message_type: 'text',
          user: {
            full_name: user.user_metadata?.full_name || user.email,
            avatar_url: user.user_metadata?.avatar_url
          }
        }

        setMessages(prev => [...prev, newMsg])
      }

      setNewMessage('')
      mcpAnalytics.trackEvent('message_sent', { room_id: activeRoom.id })
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !activeRoom || !user) return

    try {
      const uploadResult = await mcpFiles.uploadFile(file, user.id)
      if (uploadResult.success && uploadResult.data) {
        // Send file message
        const { data, error } = await supabase
          .from('messages')
          .insert([
            {
              content: file.name,
              room_id: activeRoom.id,
              user_id: user.id,
              message_type: file.type.startsWith('image/') ? 'image' : 'file',
              file_url: uploadResult.data.url
            }
          ])
          .select()

        if (error) throw error

        loadMessages(activeRoom.id)
        mcpAnalytics.trackEvent('file_uploaded', { 
          file_type: file.type,
          file_size: file.size,
          room_id: activeRoom.id 
        })
      }
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  const createRoom = async () => {
    if (!user) return

    const roomName = prompt('Navn på nytt rom:')
    if (!roomName) return

    try {
      const mcpResponse = await mcpChat.createRoom(roomName, user.id)
      if (mcpResponse.success) {
        loadRooms()
      } else {
        // Fallback to Supabase
        const { data, error } = await supabase
          .from('chat_rooms')
          .insert([
            {
              name: roomName,
              created_by: user.id,
              is_private: false,
              premium_only: false
            }
          ])
          .select()

        if (error) throw error
        loadRooms()
      }

      mcpAnalytics.trackEvent('room_created', { room_name: roomName })
    } catch (error) {
      console.error('Error creating room:', error)
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('nb-NO', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Logg inn for å chatte</h2>
          <p className="text-gray-600 mb-4">Du må være logget inn for å bruke chat-funksjonen</p>
          <a
            href="/auth"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Logg inn
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Chat-rom</h1>
            <button
              onClick={createRoom}
              className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50"
              title="Opprett nytt rom"
            >
              <Users className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Søk i rom..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Rooms List */}
        <div className="flex-1 overflow-y-auto">
          {rooms.map((room) => (
            <div
              key={room.id}
              onClick={() => setActiveRoom(room)}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                activeRoom?.id === room.id ? 'bg-blue-50 border-r-2 border-r-blue-600' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900">{room.name}</h3>
                    {room.premium_only && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                        Premium
                      </span>
                    )}
                    {room.is_private && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                        Privat
                      </span>
                    )}
                  </div>
                  {room.description && (
                    <p className="text-sm text-gray-500 mt-1 truncate">{room.description}</p>
                  )}
                  <div className="flex items-center mt-2 text-xs text-gray-400">
                    <Users className="w-3 h-3 mr-1" />
                    <span>{room.member_count || 0} medlemmer</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeRoom ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{activeRoom.name}</h2>
                {activeRoom.description && (
                  <p className="text-sm text-gray-500">{activeRoom.description}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                  <Settings className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.user_id === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md ${
                      message.user_id === user.id
                        ? 'bg-blue-600 text-white rounded-l-2xl rounded-tr-2xl'
                        : 'bg-white text-gray-900 rounded-r-2xl rounded-tl-2xl border border-gray-200'
                    } p-3 shadow-sm`}
                  >
                    {message.user_id !== user.id && (
                      <div className="text-xs font-medium mb-1 opacity-70">
                        {message.user?.full_name || 'Ukjent bruker'}
                      </div>
                    )}
                    
                    {message.message_type === 'image' && message.file_url ? (
                      <div>
                        <img
                          src={message.file_url}
                          alt={message.content}
                          className="rounded-lg max-w-full h-auto mb-1"
                        />
                        <p className="text-sm">{message.content}</p>
                      </div>
                    ) : message.message_type === 'file' && message.file_url ? (
                      <div className="flex items-center space-x-2">
                        <Paperclip className="w-4 h-4" />
                        <a
                          href={message.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:no-underline"
                        >
                          {message.content}
                        </a>
                      </div>
                    ) : (
                      <p>{message.content}</p>
                    )}
                    
                    <div
                      className={`text-xs mt-1 opacity-70 ${
                        message.user_id === user.id ? 'text-right' : 'text-left'
                      }`}
                    >
                      {formatTime(message.created_at)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <form onSubmit={sendMessage} className="flex items-end space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Skriv en melding..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!newMessage.trim() || loading}
                  className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">Velg et rom for å starte</h2>
              <p className="text-gray-500">Velg et rom fra listen eller opprett et nytt</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatPage
