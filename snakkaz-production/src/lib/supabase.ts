import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://wqpoozpbceucynsojmbk.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA0MzgwNDcsImV4cCI6MjAzNjAxNDA0N30.Gx8V9_YVgVnkRGa1oJzjX2eGHzJH4yKXOu2u9IK6pJU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          website: string | null;
          subscription_tier: string | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          subscription_tier?: string | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          subscription_tier?: string | null;
        };
      };
      user_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: string;
          active: boolean;
          created_at: string;
          expires_at: string | null;
          stripe_subscription_id: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan: string;
          active?: boolean;
          created_at?: string;
          expires_at?: string | null;
          stripe_subscription_id?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan?: string;
          active?: boolean;
          created_at?: string;
          expires_at?: string | null;
          stripe_subscription_id?: string | null;
        };
      };
      chat_rooms: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
          created_by: string;
          is_private: boolean;
          max_members: number | null;
          premium_only: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
          created_by: string;
          is_private?: boolean;
          max_members?: number | null;
          premium_only?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          created_by?: string;
          is_private?: boolean;
          max_members?: number | null;
          premium_only?: boolean;
        };
      };
      messages: {
        Row: {
          id: string;
          room_id: string;
          user_id: string;
          content: string;
          created_at: string;
          message_type: string;
          file_url: string | null;
          is_encrypted: boolean;
        };
        Insert: {
          id?: string;
          room_id: string;
          user_id: string;
          content: string;
          created_at?: string;
          message_type?: string;
          file_url?: string | null;
          is_encrypted?: boolean;
        };
        Update: {
          id?: string;
          room_id?: string;
          user_id?: string;
          content?: string;
          created_at?: string;
          message_type?: string;
          file_url?: string | null;
          is_encrypted?: boolean;
        };
      };
    };
  };
}
