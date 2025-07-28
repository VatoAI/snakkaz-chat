import { createClient } from '@supabase/supabase-js';

// Supabase configuration for SnakkaZ V2
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wqpoozpbceucynsojmbk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzNzkzNDUsImV4cCI6MjAzNjk1NTM0NX0.eiPZIswUlAoQIg-j4M0K2YH8K8Xl_8-Wa_3lv7UQNzQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 50
    }
  }
});

// Database types for SnakkaZ V2
export interface User {
  id: string;
  email: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  last_seen: string;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'direct';
  created_by: string;
  emoji?: string;
  participant_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  content: string;
  user_id: string;
  room_id: string;
  type: 'text' | 'image' | 'file' | 'system';
  metadata?: Record<string, any>;
  edited_at?: string;
  created_at: string;
  user?: User;
  reactions?: MessageReaction[];
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

export interface RoomMembership {
  id: string;
  room_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'moderator' | 'member';
  joined_at: string;
  last_read_at?: string;
}

// Auth helpers
export const getCurrentUser = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session?.user || null;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
};

export const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Real-time chat functions
export const subscribeToRoom = (roomId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`room:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`
      },
      callback
    )
    .subscribe();
};

export const subscribeToUserStatus = (callback: (payload: any) => void) => {
  return supabase
    .channel('user_status')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'users'
      },
      callback
    )
    .subscribe();
};

// Message functions
export const sendMessage = async (roomId: string, content: string, type: 'text' | 'image' | 'file' = 'text') => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('messages')
    .insert({
      content,
      room_id: roomId,
      user_id: user.id,
      type
    })
    .select(`
      *,
      user:users(*)
    `)
    .single();

  if (error) throw error;
  return data;
};

export const getMessages = async (roomId: string, limit = 50, offset = 0) => {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      user:users(*),
      reactions:message_reactions(*)
    `)
    .eq('room_id', roomId)
    .order('created_at', { ascending: false })
    .limit(limit)
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data?.reverse() || [];
};

// Room functions
export const getRooms = async () => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('room_memberships')
    .select(`
      room:rooms(*)
    `)
    .eq('user_id', user.id);

  if (error) throw error;
  return data?.map(item => item.room).filter(Boolean) || [];
};

export const joinRoom = async (roomId: string) => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('room_memberships')
    .insert({
      room_id: roomId,
      user_id: user.id,
      role: 'member'
    });

  if (error) throw error;
  return data;
};

// User functions
export const updateUserStatus = async (status: 'online' | 'away' | 'busy' | 'offline') => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('users')
    .update({ 
      status,
      last_seen: new Date().toISOString()
    })
    .eq('id', user.id);

  if (error) throw error;
  return data;
};

export const getOnlineUsers = async (roomId?: string) => {
  let query = supabase
    .from('users')
    .select('*')
    .in('status', ['online', 'away', 'busy']);

  if (roomId) {
    query = query.in('id', 
      supabase
        .from('room_memberships')
        .select('user_id')
        .eq('room_id', roomId)
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export default supabase;