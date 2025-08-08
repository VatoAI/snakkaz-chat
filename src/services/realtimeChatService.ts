import { supabase } from "../config/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";

export interface ChatMessage {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  message_type: "text" | "image" | "file" | "voice" | "video";
  file_url?: string;
  file_name?: string;
  file_size?: number;
  reply_to?: string;
  edited_at?: string;
  created_at: string;
  // Joined data
  username?: string;
  user_avatar?: string;
  reactions?: MessageReaction[];
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
  username?: string;
}

export interface ChatGroup {
  id: string;
  name: string;
  description?: string;
  avatar_url?: string;
  group_type: "public" | "private" | "channel";
  member_count: number;
  max_members: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: "owner" | "admin" | "member" | "restricted";
  joined_at: string;
  // Joined data
  username?: string;
  avatar_url?: string;
  is_online?: boolean;
  last_seen?: string;
}

export interface TypingIndicator {
  group_id: string;
  user_id: string;
  username: string;
  is_typing: boolean;
}

class RealtimeChatService {
  private channels: Map<string, RealtimeChannel> = new Map();
  private messageListeners: Map<string, Function[]> = new Map();
  private typingListeners: Map<string, Function[]> = new Map();
  private onlineUsersListeners: Map<string, Function[]> = new Map();

  // Subscribe to real-time updates for a group
  async subscribeToGroup(
    groupId: string,
    callbacks: {
      onMessage?: (message: ChatMessage) => void;
      onTyping?: (typing: TypingIndicator[]) => void;
      onOnlineUsers?: (users: GroupMember[]) => void;
    }
  ) {
    const channelName = `group:${groupId}`;

    // Don't create duplicate subscriptions
    if (this.channels.has(channelName)) {
      return;
    }

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `group_id=eq.${groupId}`,
        },
        async (payload) => {
          const newMessage = await this.enrichMessage(payload.new as any);
          callbacks.onMessage?.(newMessage);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `group_id=eq.${groupId}`,
        },
        async (payload) => {
          const updatedMessage = await this.enrichMessage(payload.new as any);
          callbacks.onMessage?.(updatedMessage);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "typing_indicators",
          filter: `group_id=eq.${groupId}`,
        },
        async () => {
          const typingUsers = await this.getTypingUsers(groupId);
          callbacks.onTyping?.(typingUsers);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "group_members",
          filter: `group_id=eq.${groupId}`,
        },
        async () => {
          const onlineUsers = await this.getOnlineGroupMembers(groupId);
          callbacks.onOnlineUsers?.(onlineUsers);
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);
  }

  // Unsubscribe from group updates
  unsubscribeFromGroup(groupId: string) {
    const channelName = `group:${groupId}`;
    const channel = this.channels.get(channelName);

    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
    }
  }

  // Send a message
  async sendMessage(
    groupId: string,
    content: string,
    messageType: string = "text",
    replyTo?: string
  ): Promise<ChatMessage | null> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("messages")
        .insert({
          group_id: groupId,
          user_id: user.id,
          content,
          message_type: messageType,
          reply_to: replyTo,
        })
        .select()
        .single();

      if (error) throw error;

      return await this.enrichMessage(data);
    } catch (error) {
      console.error("Error sending message:", error);
      return null;
    }
  }

  // Get messages for a group with pagination
  async getMessages(
    groupId: string,
    limit: number = 50,
    before?: string
  ): Promise<ChatMessage[]> {
    try {
      let query = supabase
        .from("messages")
        .select(
          `
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `
        )
        .eq("group_id", groupId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (before) {
        query = query.lt("created_at", before);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Reverse to show oldest first
      const messages = (data || []).reverse();

      // Enrich with reactions
      const enrichedMessages = await Promise.all(
        messages.map((msg) => this.enrichMessage(msg))
      );

      return enrichedMessages;
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  }

  // Add reaction to message
  async addReaction(messageId: string, emoji: string): Promise<boolean> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase.from("message_reactions").upsert({
        message_id: messageId,
        user_id: user.id,
        emoji,
      });

      return !error;
    } catch (error) {
      console.error("Error adding reaction:", error);
      return false;
    }
  }

  // Remove reaction from message
  async removeReaction(messageId: string, emoji: string): Promise<boolean> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("message_reactions")
        .delete()
        .eq("message_id", messageId)
        .eq("user_id", user.id)
        .eq("emoji", emoji);

      return !error;
    } catch (error) {
      console.error("Error removing reaction:", error);
      return false;
    }
  }

  // Set typing status
  async setTyping(groupId: string, isTyping: boolean): Promise<void> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      if (isTyping) {
        await supabase.from("typing_indicators").upsert({
          group_id: groupId,
          user_id: user.id,
          is_typing: true,
        });
      } else {
        await supabase
          .from("typing_indicators")
          .delete()
          .eq("group_id", groupId)
          .eq("user_id", user.id);
      }
    } catch (error) {
      console.error("Error setting typing status:", error);
    }
  }

  // Get typing users
  async getTypingUsers(groupId: string): Promise<TypingIndicator[]> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      const currentUserId = user?.id;

      const { data, error } = await supabase
        .from("typing_indicators")
        .select(
          `
          *,
          profiles:user_id (
            username
          )
        `
        )
        .eq("group_id", groupId)
        .eq("is_typing", true)
        .neq("user_id", currentUserId) // Exclude current user
        .gte("created_at", new Date(Date.now() - 30000).toISOString()); // Only recent typing

      if (error) throw error;

      return (data || []).map((item) => ({
        group_id: item.group_id,
        user_id: item.user_id,
        username: (item.profiles as any)?.username || "Unknown",
        is_typing: item.is_typing,
      }));
    } catch (error) {
      console.error("Error fetching typing users:", error);
      return [];
    }
  }

  // Get online group members
  async getOnlineGroupMembers(groupId: string): Promise<GroupMember[]> {
    try {
      const { data, error } = await supabase
        .from("group_members")
        .select(
          `
          *,
          profiles:user_id (
            username,
            avatar_url,
            is_online,
            last_seen
          )
        `
        )
        .eq("group_id", groupId);

      if (error) throw error;

      return (data || []).map((member) => ({
        id: member.id,
        group_id: member.group_id,
        user_id: member.user_id,
        role: member.role,
        joined_at: member.joined_at,
        username: (member.profiles as any)?.username,
        avatar_url: (member.profiles as any)?.avatar_url,
        is_online: (member.profiles as any)?.is_online,
        last_seen: (member.profiles as any)?.last_seen,
      }));
    } catch (error) {
      console.error("Error fetching group members:", error);
      return [];
    }
  }

  // Join a group
  async joinGroup(groupId: string): Promise<boolean> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase.from("group_members").insert({
        group_id: groupId,
        user_id: user.id,
        role: "member",
      });

      return !error;
    } catch (error) {
      console.error("Error joining group:", error);
      return false;
    }
  }

  // Leave a group
  async leaveGroup(groupId: string): Promise<boolean> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("group_members")
        .delete()
        .eq("group_id", groupId)
        .eq("user_id", user.id);

      return !error;
    } catch (error) {
      console.error("Error leaving group:", error);
      return false;
    }
  }

  // Update user online status
  async updateOnlineStatus(isOnline: boolean): Promise<void> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      await supabase
        .from("profiles")
        .update({
          is_online: isOnline,
          last_seen: new Date().toISOString(),
        })
        .eq("id", user.id);
    } catch (error) {
      console.error("Error updating online status:", error);
    }
  }

  // Private helper to enrich message with user data and reactions
  private async enrichMessage(message: any): Promise<ChatMessage> {
    try {
      // Get user info if not already included
      let username = message.profiles?.username;
      let userAvatar = message.profiles?.avatar_url;

      if (!username && message.user_id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("id", message.user_id)
          .single();

        username = profile?.username;
        userAvatar = profile?.avatar_url;
      }

      // Get reactions
      const { data: reactions } = await supabase
        .from("message_reactions")
        .select(
          `
          *,
          profiles:user_id (username)
        `
        )
        .eq("message_id", message.id);

      const enrichedReactions = (reactions || []).map((reaction) => ({
        id: reaction.id,
        message_id: reaction.message_id,
        user_id: reaction.user_id,
        emoji: reaction.emoji,
        created_at: reaction.created_at,
        username: (reaction.profiles as any)?.username,
      }));

      return {
        id: message.id,
        group_id: message.group_id,
        user_id: message.user_id,
        content: message.content,
        message_type: message.message_type,
        file_url: message.file_url,
        file_name: message.file_name,
        file_size: message.file_size,
        reply_to: message.reply_to,
        edited_at: message.edited_at,
        created_at: message.created_at,
        username: username || "Unknown",
        user_avatar: userAvatar,
        reactions: enrichedReactions,
      };
    } catch (error) {
      console.error("Error enriching message:", error);
      return message;
    }
  }

  // Cleanup all subscriptions
  cleanup() {
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
    this.messageListeners.clear();
    this.typingListeners.clear();
    this.onlineUsersListeners.clear();
  }
}

// Export singleton instance
export const chatService = new RealtimeChatService();

// Utility function to format message time
export const formatMessageTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Today - show time
    return date.toLocaleTimeString("no-NO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffDays === 1) {
    // Yesterday
    return "Yesterday";
  } else if (diffDays < 7) {
    // This week - show day name
    return date.toLocaleDateString("no-NO", { weekday: "short" });
  } else {
    // Older - show date
    return date.toLocaleDateString("no-NO", {
      month: "short",
      day: "numeric",
    });
  }
};

// Utility function to group reactions by emoji
export const groupReactionsByEmoji = (
  reactions: MessageReaction[]
): { [emoji: string]: string[] } => {
  const grouped: { [emoji: string]: string[] } = {};

  reactions.forEach((reaction) => {
    if (!grouped[reaction.emoji]) {
      grouped[reaction.emoji] = [];
    }
    grouped[reaction.emoji].push(reaction.user_id);
  });

  return grouped;
};
