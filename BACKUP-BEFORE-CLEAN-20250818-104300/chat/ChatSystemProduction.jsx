import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../auth/AuthProvider";
import {
  IconSend,
  IconUserPlus,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import "../styles/ChatSystem.css";

const ChatSystem = ({ onMinimize, isMinimized = false }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  // State management
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadRooms();
    }
  }, [user]);

  useEffect(() => {
    if (currentRoom) {
      loadMessages(currentRoom.id);
      subscribeToMessages(currentRoom.id);
    }
  }, [currentRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadRooms = async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading chat rooms...");

      const { data: roomsData, error: roomsError } = await supabase
        .from("chats")
        .select(
          `
          *,
          chat_participants!inner (
            user_id,
            users (
              display_name,
              avatar_url
            )
          )
        `
        )
        .eq("chat_participants.user_id", user.id)
        .order("updated_at", { ascending: false });

      if (roomsError) {
        console.error("Error loading rooms:", roomsError);
        throw roomsError;
      }

      console.log("✅ Rooms loaded:", roomsData?.length || 0);
      setRooms(roomsData || []);

      // Auto-select first room if available
      if (roomsData && roomsData.length > 0 && !currentRoom) {
        setCurrentRoom(roomsData[0]);
      }
    } catch (error) {
      console.error("Error in loadRooms:", error);
      setError("Failed to load chat rooms");
    } finally {
      setLoading(false);
    }
  };
  const loadMessages = async (roomId) => {
    try {
      console.log("🔄 Loading messages for room:", roomId);

      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select(
          `
          *,
          users (
            display_name,
            avatar_url
          )
        `
        )
        .eq("chat_id", roomId)
        .order("created_at", { ascending: true })
        .limit(100);

      if (messagesError) {
        console.error("Error loading messages:", messagesError);
        throw messagesError;
      }

      console.log("✅ Messages loaded:", messagesData?.length || 0);
      setMessages(messagesData || []);
    } catch (error) {
      console.error("Error loading messages:", error);
      setError("Failed to load messages");
    }
  };

  const subscribeToMessages = (roomId) => {
    console.log("🔗 Subscribing to real-time messages for room:", roomId);

    const subscription = supabase
      .channel(`messages-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${roomId}`,
        },
        async (payload) => {
          console.log("📨 New message received:", payload.new);

          // Fetch the complete message with profile data
          const { data: newMessageData, error } = await supabase
            .from("messages")
            .select(
              `
              *,
              users (
                display_name,
                avatar_url
              )
            `
            )
            .eq("id", payload.new.id)
            .single();

          if (!error && newMessageData) {
            setMessages((prev) => [...prev, newMessageData]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentRoom || sendingMessage) return;

    try {
      setSendingMessage(true);
      console.log("📤 Sending message:", newMessage);

      const { data, error } = await supabase
        .from("messages")
        .insert([
          {
            content: newMessage.trim(),
            sender_id: user.id,
            chat_id: currentRoom.id,
            is_encrypted: false,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error sending message:", error);
        throw error;
      }

      console.log("✅ Message sent successfully:", data);
      setNewMessage("");

      // Update room's last activity
      await supabase
        .from("chats")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", currentRoom.id);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("no-NO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatMessageDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "I dag";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "I går";
    } else {
      return date.toLocaleDateString("no-NO");
    }
  };

  if (loading) {
    return (
      <div className="chat-system loading-state">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Laster chat...</p>
        </div>
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div className="chat-system minimized" onClick={onMinimize}>
        <div className="minimized-header">
          <IconUsers className="w-5 h-5" />
          <span>Chat ({rooms.length})</span>
          {currentRoom && <div className="unread-indicator"></div>}
        </div>
      </div>
    );
  }

  return (
    <div className="chat-system">
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Sidebar with rooms */}
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h3>Chat Rooms</h3>
          <div className="sidebar-actions">
            <button className="action-btn" title="Create Room">
              <IconUserPlus className="w-4 h-4" />
            </button>
            <button className="action-btn" title="Settings">
              <IconSettings className="w-4 h-4" />
            </button>
            {onMinimize && (
              <button
                className="action-btn"
                onClick={onMinimize}
                title="Minimize"
              >
                −
              </button>
            )}
          </div>
        </div>

        <div className="rooms-list">
          {rooms.map((room) => (
            <div
              key={room.id}
              className={`room-item ${
                currentRoom?.id === room.id ? "active" : ""
              }`}
              onClick={() => setCurrentRoom(room)}
            >
              <div className="room-avatar">
                {room.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="room-info">
                <div className="room-name">{room.name}</div>
                <div className="room-description">{room.description}</div>
                <div className="room-meta">
                  <span className="member-count">
                    <IconUsers className="w-3 h-3" />
                    {room.member_count || 0}
                  </span>
                  <span className="last-activity">
                    {formatTime(room.last_message_at)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="chat-main">
        {currentRoom ? (
          <>
            <div className="chat-header">
              <div className="chat-title">
                <h4>{currentRoom.name}</h4>
                <p>{currentRoom.description}</p>
              </div>
              <div className="chat-info">
                <span className="member-count">
                  <IconUsers className="w-4 h-4" />
                  {currentRoom.member_count || 0} medlemmer
                </span>
              </div>
            </div>

            <div className="messages-container">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${
                    message.sender_id === user.id ? "own" : "other"
                  }`}
                >
                  {message.sender_id !== user.id && (
                    <div className="message-avatar">
                      {message.users?.avatar_url ? (
                        <img src={message.users.avatar_url} alt="Avatar" />
                      ) : (
                        message.users?.display_name?.charAt(0)?.toUpperCase() ||
                        "?"
                      )}
                    </div>
                  )}

                  <div className="message-content">
                    {message.sender_id !== user.id && (
                      <div className="message-sender">
                        {message.users?.display_name || "Anonym"}
                      </div>
                    )}
                    <div className="message-text">{message.content}</div>
                    <div className="message-time">
                      {formatTime(message.created_at)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="message-input">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Send melding til ${currentRoom.name}...`}
                disabled={sendingMessage}
                rows={1}
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || sendingMessage}
                className="send-button"
              >
                <IconSend className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="no-room-selected">
            <h4>Velg et chat-rom</h4>
            <p>Velg et rom fra listen for å starte å chatte</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSystem;
