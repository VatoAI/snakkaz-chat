import { supabase } from "../lib/supabase-singleton";
import { RealtimeChannel } from "@supabase/supabase-js";

export interface Message {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  message_type:
    | "text"
    | "image"
    | "file"
    | "voice"
    | "video"
    | "location"
    | "contact"
    | "product";
  file_url?: string;
  file_name?: string;
  reply_to?: string;
  is_pinned: boolean;
  is_deleted: boolean;
  metadata?: any;
  created_at: string;
  updated_at: string;
  // Joined data
  profiles?: {
    id: string;
    username: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  avatar_url?: string;
  group_type: "group" | "channel" | "supergroup";
  member_limit: number;
  is_private: boolean;
  invite_link?: string;
  created_at: string;
  member_count?: number;
  online_count?: number;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: "owner" | "admin" | "member";
  joined_at: string;
  last_seen_at: string;
  is_online: boolean;
  profiles?: {
    id: string;
    username: string;
    full_name?: string;
    avatar_url?: string;
    status: "online" | "offline" | "away" | "busy";
  };
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

class RealTimeChatService {
  private channels: Map<string, RealtimeChannel> = new Map();
  private messageCallbacks: Map<string, (message: Message) => void> = new Map();
  private memberCallbacks: Map<string, (members: GroupMember[]) => void> =
    new Map();
  private reactionCallbacks: Map<string, (reaction: MessageReaction) => void> =
    new Map();

  // ===============================================
  // GROUP MANAGEMENT
  // ===============================================

  async getGroups(): Promise<Group[]> {
    try {
      const { data, error } = await supabase
        .from("groups")
        .select(
          `
          *,
          group_members!inner(count),
          group_members!online_members(count)
        `
        )
        .eq("group_members.online_members.is_online", true);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching groups:", error);
      return [];
    }
  }

  async createGroup(
    name: string,
    description?: string,
    groupType: "group" | "channel" | "supergroup" = "group"
  ): Promise<Group | null> {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("groups")
        .insert([
          {
            name,
            description,
            group_type: groupType,
            created_by: user.data.user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Add creator as owner
      await this.joinGroup(data.id, "owner");

      return data;
    } catch (error) {
      console.error("Error creating group:", error);
      return null;
    }
  }

  async joinGroup(
    groupId: string,
    role: "owner" | "admin" | "member" = "member"
  ): Promise<boolean> {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error("Not authenticated");

      const { error } = await supabase.from("group_members").insert([
        {
          group_id: groupId,
          user_id: user.data.user.id,
          role,
          is_online: true,
        },
      ]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error joining group:", error);
      return false;
    }
  }

  async getGroupMembers(groupId: string): Promise<GroupMember[]> {
    try {
      const { data, error } = await supabase
        .from("group_members")
        .select(
          `
          *,
          profiles(id, username, full_name, avatar_url, status)
        `
        )
        .eq("group_id", groupId)
        .order("is_online", { ascending: false })
        .order("last_seen_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching group members:", error);
      return [];
    }
  }

  // ===============================================
  // MESSAGE MANAGEMENT
  // ===============================================

  async getMessages(
    groupId: string,
    limit: number = 50,
    before?: string
  ): Promise<Message[]> {
    try {
      let query = supabase
        .from("messages")
        .select(
          `
          *,
          profiles(id, username, full_name, avatar_url)
        `
        )
        .eq("group_id", groupId)
        .eq("is_deleted", false)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (before) {
        query = query.lt("created_at", before);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []).reverse(); // Reverse to show oldest first
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  }

  async sendMessage(
    groupId: string,
    content: string,
    messageType: "text" | "image" | "file" | "voice" = "text",
    replyTo?: string,
    fileUrl?: string,
    fileName?: string
  ): Promise<Message | null> {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("messages")
        .insert([
          {
            group_id: groupId,
            user_id: user.data.user.id,
            content,
            message_type: messageType,
            reply_to: replyTo,
            file_url: fileUrl,
            file_name: fileName,
          },
        ])
        .select(
          `
          *,
          profiles(id, username, full_name, avatar_url)
        `
        )
        .single();

      if (error) throw error;

      // Update user's message count
      await this.updateMessageCount(user.data.user.id);

      return data;
    } catch (error) {
      console.error("Error sending message:", error);
      return null;
    }
  }

  async editMessage(messageId: string, newContent: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("messages")
        .update({
          content: newContent,
          edit_count: supabase.sql`edit_count + 1`,
        })
        .eq("id", messageId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error editing message:", error);
      return false;
    }
  }

  async deleteMessage(messageId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("messages")
        .update({ is_deleted: true })
        .eq("id", messageId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting message:", error);
      return false;
    }
  }

  // ===============================================
  // REACTIONS
  // ===============================================

  async addReaction(messageId: string, emoji: string): Promise<boolean> {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error("Not authenticated");

      const { error } = await supabase.from("message_reactions").upsert([
        {
          message_id: messageId,
          user_id: user.data.user.id,
          emoji,
        },
      ]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error adding reaction:", error);
      return false;
    }
  }

  async removeReaction(messageId: string, emoji: string): Promise<boolean> {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("message_reactions")
        .delete()
        .eq("message_id", messageId)
        .eq("user_id", user.data.user.id)
        .eq("emoji", emoji);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error removing reaction:", error);
      return false;
    }
  }

  async getMessageReactions(
    messageId: string
  ): Promise<{ [emoji: string]: MessageReaction[] }> {
    try {
      const { data, error } = await supabase
        .from("message_reactions")
        .select("*")
        .eq("message_id", messageId);

      if (error) throw error;

      const grouped: { [emoji: string]: MessageReaction[] } = {};
      data?.forEach((reaction) => {
        if (!grouped[reaction.emoji]) {
          grouped[reaction.emoji] = [];
        }
        grouped[reaction.emoji].push(reaction);
      });

      return grouped;
    } catch (error) {
      console.error("Error fetching reactions:", error);
      return {};
    }
  }

  // ===============================================
  // REAL-TIME SUBSCRIPTIONS
  // ===============================================

  subscribeToGroup(
    groupId: string,
    onMessage: (message: Message) => void,
    onMemberUpdate?: (members: GroupMember[]) => void,
    onReaction?: (reaction: MessageReaction) => void
  ): () => void {
    const channelName = `group:${groupId}`;

    // Clean up existing channel
    this.unsubscribeFromGroup(groupId);

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
          // Fetch the complete message with profile data
          const { data } = await supabase
            .from("messages")
            .select(
              `
            *,
            profiles(id, username, full_name, avatar_url)
          `
            )
            .eq("id", payload.new.id)
            .single();

          if (data) {
            onMessage(data as Message);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "group_members",
          filter: `group_id=eq.${groupId}`,
        },
        async () => {
          if (onMemberUpdate) {
            const members = await this.getGroupMembers(groupId);
            onMemberUpdate(members);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "message_reactions",
        },
        (payload) => {
          if (onReaction) {
            onReaction(payload.new as MessageReaction);
          }
        }
      )
      .subscribe();

    this.channels.set(groupId, channel);
    this.messageCallbacks.set(groupId, onMessage);
    if (onMemberUpdate) this.memberCallbacks.set(groupId, onMemberUpdate);
    if (onReaction) this.reactionCallbacks.set(groupId, onReaction);

    return () => this.unsubscribeFromGroup(groupId);
  }

  unsubscribeFromGroup(groupId: string): void {
    const channel = this.channels.get(groupId);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(groupId);
      this.messageCallbacks.delete(groupId);
      this.memberCallbacks.delete(groupId);
      this.reactionCallbacks.delete(groupId);
    }
  }

  // ===============================================
  // PRESENCE & STATUS
  // ===============================================

  async updateOnlineStatus(isOnline: boolean): Promise<void> {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return;

      // Call the database function to update online status
      await supabase.rpc("update_user_online_status", {
        user_uuid: user.data.user.id,
        is_online_status: isOnline,
      });
    } catch (error) {
      console.error("Error updating online status:", error);
    }
  }

  async updateMessageCount(userId: string): Promise<void> {
    try {
      await supabase
        .from("profiles")
        .update({
          chat_messages_count: supabase.sql`chat_messages_count + 1`,
        })
        .eq("id", userId);
    } catch (error) {
      console.error("Error updating message count:", error);
    }
  }

  // ===============================================
  // CLEANUP
  // ===============================================

  cleanup(): void {
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
    this.messageCallbacks.clear();
    this.memberCallbacks.clear();
    this.reactionCallbacks.clear();
  }
}

// Export singleton instance
export const chatService = new RealTimeChatService();
export default chatService;
