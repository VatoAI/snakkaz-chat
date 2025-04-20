export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      domain_health: {
        Row: {
          checked_at: string
          domain: string
          id: string
          response_time: number | null
          status: string
          uptime_percentage: number | null
        }
        Insert: {
          checked_at?: string
          domain: string
          id?: string
          response_time?: number | null
          status: string
          uptime_percentage?: number | null
        }
        Update: {
          checked_at?: string
          domain?: string
          id?: string
          response_time?: number | null
          status?: string
          uptime_percentage?: number | null
        }
        Relationships: []
      }
      friendships: {
        Row: {
          created_at: string
          friend_id: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          friend_id: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          friend_id?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      github_events: {
        Row: {
          author: string | null
          branch: string | null
          commit_id: string | null
          commit_message: string | null
          created_at: string
          id: string
          payload: Json | null
          repository: string | null
          type: string
        }
        Insert: {
          author?: string | null
          branch?: string | null
          commit_id?: string | null
          commit_message?: string | null
          created_at?: string
          id?: string
          payload?: Json | null
          repository?: string | null
          type: string
        }
        Update: {
          author?: string | null
          branch?: string | null
          commit_id?: string | null
          commit_message?: string | null
          created_at?: string
          id?: string
          payload?: Json | null
          repository?: string | null
          type?: string
        }
        Relationships: []
      }
      health: {
        Row: {
          id: string
          last_checked: string
          status: string
        }
        Insert: {
          id?: string
          last_checked?: string
          status?: string
        }
        Update: {
          id?: string
          last_checked?: string
          status?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string
          deleted_at: string | null
          edited_at: string | null
          encrypted_content: string
          encryption_key: string | null
          ephemeral_ttl: number | null
          group_id: boolean | null
          id: string
          is_deleted: boolean | null
          is_delivered: boolean | null
          is_edited: boolean | null
          iv: string | null
          media_type: string | null
          media_url: string | null
          read_at: string | null
          receiver_id: string | null
          sender_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          edited_at?: string | null
          encrypted_content: string
          encryption_key?: string | null
          ephemeral_ttl?: number | null
          group_id?: boolean | null
          id?: string
          is_deleted?: boolean | null
          is_delivered?: boolean | null
          is_edited?: boolean | null
          iv?: string | null
          media_type?: string | null
          media_url?: string | null
          read_at?: string | null
          receiver_id?: string | null
          sender_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          edited_at?: string | null
          encrypted_content?: string
          encryption_key?: string | null
          ephemeral_ttl?: number | null
          group_id?: boolean | null
          id?: string
          is_deleted?: boolean | null
          is_delivered?: boolean | null
          is_edited?: boolean | null
          iv?: string | null
          media_type?: string | null
          media_url?: string | null
          read_at?: string | null
          receiver_id?: string | null
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      signaling: {
        Row: {
          created_at: string
          id: string
          receiver_id: string
          sender_id: string
          signal_data: Json
        }
        Insert: {
          created_at?: string
          id?: string
          receiver_id: string
          sender_id: string
          signal_data: Json
        }
        Update: {
          created_at?: string
          id?: string
          receiver_id?: string
          sender_id?: string
          signal_data?: Json
        }
        Relationships: []
      }
      sync_events: {
        Row: {
          completed_at: string | null
          error_message: string | null
          id: string
          metadata: Json | null
          started_at: string
          status: string
          sync_type: string
        }
        Insert: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          started_at?: string
          status: string
          sync_type: string
        }
        Update: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          started_at?: string
          status?: string
          sync_type?: string
        }
        Relationships: []
      }
      user_presence: {
        Row: {
          id: string
          last_seen: string
          status: Database["public"]["Enums"]["user_status"]
          user_id: string
        }
        Insert: {
          id?: string
          last_seen?: string
          status?: Database["public"]["Enums"]["user_status"]
          user_id: string
        }
        Update: {
          id?: string
          last_seen?: string
          status?: Database["public"]["Enums"]["user_status"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_media_encryption_columns: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      check_and_add_columns: {
        Args: { p_table_name: string; column_names: string[] }
        Returns: undefined
      }
      mark_message_as_deleted: {
        Args: { message_id: string; user_id: string }
        Returns: undefined
      }
      mark_message_as_read: {
        Args: { message_id: string }
        Returns: undefined
      }
    }
    Enums: {
      user_status: "online" | "busy" | "brb"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_status: ["online", "busy", "brb"],
    },
  },
} as const
