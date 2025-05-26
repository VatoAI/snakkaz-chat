export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          display_name: string | null
          avatar_url: string | null
          online_status: string | null
          last_seen: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          display_name?: string | null
          avatar_url?: string | null
          online_status?: string | null
          last_seen?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          display_name?: string | null
          avatar_url?: string | null
          online_status?: string | null
          last_seen?: string | null
        }
      }
      chats: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          name: string | null
          creator_id: string
          is_group: boolean
          is_encrypted: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string | null
          name?: string | null
          creator_id: string
          is_group?: boolean
          is_encrypted?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          name?: string | null
          creator_id?: string
          is_group?: boolean
          is_encrypted?: boolean
        }
      }
      messages: {
        Row: {
          id: string
          created_at: string
          chat_id: string
          sender_id: string
          content: string
          is_encrypted: boolean
          attachment_url: string | null
          attachment_type: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          chat_id: string
          sender_id: string
          content: string
          is_encrypted?: boolean
          attachment_url?: string | null
          attachment_type?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          chat_id?: string
          sender_id?: string
          content?: string
          is_encrypted?: boolean
          attachment_url?: string | null
          attachment_type?: string | null
        }
      }
      chat_participants: {
        Row: {
          id: string
          chat_id: string
          user_id: string
          created_at: string
          is_admin: boolean
        }
        Insert: {
          id?: string
          chat_id: string
          user_id: string
          created_at?: string
          is_admin?: boolean
        }
        Update: {
          id?: string
          chat_id?: string
          user_id?: string
          created_at?: string
          is_admin?: boolean
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          status: string
          created_at: string
          updated_at: string | null
          current_period_end: string | null
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          status: string
          created_at?: string
          updated_at?: string | null
          current_period_end?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          status?: string
          created_at?: string
          updated_at?: string | null
          current_period_end?: string | null
        }
      }
      subscription_plans: {
        Row: {
          id: string
          name: string
          price: number
          interval: string
          features: Json
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          interval: string
          features: Json
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          interval?: string
          features?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}