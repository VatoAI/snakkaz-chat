import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../auth/AuthProvider";
import { supabase } from "../lib/supabaseClient";
import { Database } from "../types/database";

// Simplified types
type Message = Database["public"]["Tables"]["messages"]["Row"];
type ChatRoom = Database["public"]["Tables"]["chat_rooms"]["Row"];
type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];

interface MessageWithProfile extends Message {
  user_profiles?: UserProfile | null;
}

interface ChatRoomWithParticipants extends ChatRoom {
  participant_count?: number;
}

// Hook for managing messages in a room
export const useMessages = (roomId: string | null) => {
  const [messages, setMessages] = useState<MessageWithProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch messages for a room
  const fetchMessages = useCallback(async () => {
    if (!roomId) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          *,
          user_profiles (
            id,
            username,
            full_name,
            avatar_url
          )
        `
        )
        .eq("room_id", roomId)
        .order("created_at", { ascending: true })
        .limit(100);

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch messages");
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  // Send a new message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!roomId || !user || !content.trim()) return false;

      try {
        // Create optimistic message
        const optimisticMessage: MessageWithProfile = {
          id: `temp-${Date.now()}`,
          room_id: roomId,
          user_id: user.id,
          content: content.trim(),
          message_type: "text",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_edited: false,
          metadata: {},
          user_profiles: null, // Will be filled by real-time update
        };

        // Add optimistic message immediately
        setMessages((prev) => [...prev, optimisticMessage]);

        // Send to database
        const { error } = await supabase.from("messages").insert({
          room_id: roomId,
          user_id: user.id,
          content: content.trim(),
          message_type: "text",
        });

        if (error) {
          // Remove optimistic message on error
          setMessages((prev) =>
            prev.filter((m) => m.id !== optimisticMessage.id)
          );
          throw error;
        }

        return true;
      } catch (err) {
        console.error("Error sending message:", err);
        setError(err instanceof Error ? err.message : "Failed to send message");
        return false;
      }
    },
    [roomId, user]
  );

  // Subscribe to real-time updates
  useEffect(() => {
    if (!roomId) return;

    const channel = supabase
      .channel(`messages:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${roomId}`,
        },
        () => {
          // Refetch messages on any change
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, fetchMessages]);

  // Initial fetch
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    refetch: fetchMessages,
  };
};

// Hook for managing chat rooms
export const useChatRooms = () => {
  const [rooms, setRooms] = useState<ChatRoomWithParticipants[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch user's chat rooms
  const fetchRooms = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Get rooms where user is a participant
      const { data: participantData, error: participantError } = await supabase
        .from("room_participants")
        .select("room_id")
        .eq("user_id", user.id)
        .eq("is_active", true);

      if (participantError) throw participantError;

      const roomIds = participantData?.map((p) => p.room_id) || [];

      if (roomIds.length === 0) {
        setRooms([]);
        return;
      }

      // Get room details
      const { data: roomsData, error: roomsError } = await supabase
        .from("chat_rooms")
        .select("*")
        .in("id", roomIds)
        .order("updated_at", { ascending: false });

      if (roomsError) throw roomsError;

      setRooms(roomsData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch rooms");
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create a new room
  const createRoom = useCallback(
    async (name: string, description?: string) => {
      if (!user || !name.trim()) return null;

      try {
        const { data, error } = await supabase
          .from("chat_rooms")
          .insert({
            name: name.trim(),
            description: description?.trim(),
            room_type: "public",
            created_by: user.id,
          })
          .select()
          .single();

        if (error) throw error;

        // Add user as participant
        const { error: participantError } = await supabase
          .from("room_participants")
          .insert({
            room_id: data.id,
            user_id: user.id,
            role: "owner",
          });

        if (participantError) throw participantError;

        // Refresh rooms
        await fetchRooms();

        return data;
      } catch (err) {
        console.error("Error creating room:", err);
        setError(err instanceof Error ? err.message : "Failed to create room");
        return null;
      }
    },
    [user, fetchRooms]
  );

  // Join a room
  const joinRoom = useCallback(
    async (roomId: string) => {
      if (!user) return false;

      try {
        const { error } = await supabase.from("room_participants").insert({
          room_id: roomId,
          user_id: user.id,
          role: "member",
        });

        if (error) throw error;

        // Refresh rooms
        await fetchRooms();
        return true;
      } catch (err) {
        console.error("Error joining room:", err);
        setError(err instanceof Error ? err.message : "Failed to join room");
        return false;
      }
    },
    [user, fetchRooms]
  );

  // Initial fetch
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return {
    rooms,
    loading,
    error,
    createRoom,
    joinRoom,
    refetch: fetchRooms,
  };
};

// Hook for user profiles
export const useUserProfile = (userId?: string) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const targetUserId = userId || user?.id;

  const fetchProfile = useCallback(async () => {
    if (!targetUserId) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", targetUserId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch profile");
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  }, [targetUserId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
  };
};
