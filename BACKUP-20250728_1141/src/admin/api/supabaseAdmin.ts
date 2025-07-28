/**
 * Supabase Integration for MCP Admin Dashboard
 * 
 * Handles authentication, database operations, and real-time subscriptions
 * using Supabase as the backend service
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://wqpoozpbceucynsojmbk.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8';

// Database types
export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string;
          username: string;
          email: string;
          role: 'admin' | 'super_admin';
          permissions: string[];
          two_factor_enabled: boolean;
          two_factor_secret: string | null;
          last_login: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          email: string;
          role?: 'admin' | 'super_admin';
          permissions?: string[];
          two_factor_enabled?: boolean;
          two_factor_secret?: string | null;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string;
          role?: 'admin' | 'super_admin';
          permissions?: string[];
          two_factor_enabled?: boolean;
          two_factor_secret?: string | null;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          email: string | null;
          avatar_url: string | null;
          public_key: string;
          is_online: boolean;
          last_seen: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          display_name: string;
          email?: string | null;
          avatar_url?: string | null;
          public_key: string;
          is_online?: boolean;
          last_seen?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string;
          email?: string | null;
          avatar_url?: string | null;
          public_key?: string;
          is_online?: boolean;
          last_seen?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      chats: {
        Row: {
          id: string;
          name: string;
          type: 'GROUP' | 'DIRECT';
          participant_ids: string[];
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: 'GROUP' | 'DIRECT';
          participant_ids: string[];
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: 'GROUP' | 'DIRECT';
          participant_ids?: string[];
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          chat_id: string;
          sender_id: string;
          content: string;
          is_encrypted: boolean;
          attachments: any[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          chat_id: string;
          sender_id: string;
          content: string;
          is_encrypted?: boolean;
          attachments?: any[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          chat_id?: string;
          sender_id?: string;
          content?: string;
          is_encrypted?: boolean;
          attachments?: any[];
          created_at?: string;
          updated_at?: string;
        };
      };
      email_templates: {
        Row: {
          id: string;
          name: string;
          subject: string;
          body: string;
          variables: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          subject: string;
          body: string;
          variables?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          subject?: string;
          body?: string;
          variables?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      email_logs: {
        Row: {
          id: string;
          template_id: string;
          to_email: string;
          subject: string;
          status: 'sent' | 'delivered' | 'failed' | 'bounced';
          error_message: string | null;
          sent_at: string;
          delivered_at: string | null;
        };
        Insert: {
          id?: string;
          template_id: string;
          to_email: string;
          subject: string;
          status?: 'sent' | 'delivered' | 'failed' | 'bounced';
          error_message?: string | null;
          sent_at?: string;
          delivered_at?: string | null;
        };
        Update: {
          id?: string;
          template_id?: string;
          to_email?: string;
          subject?: string;
          status?: 'sent' | 'delivered' | 'failed' | 'bounced';
          error_message?: string | null;
          sent_at?: string;
          delivered_at?: string | null;
        };
      };
      system_metrics: {
        Row: {
          id: string;
          metric_type: string;
          value: number;
          metadata: any;
          recorded_at: string;
        };
        Insert: {
          id?: string;
          metric_type: string;
          value: number;
          metadata?: any;
          recorded_at?: string;
        };
        Update: {
          id?: string;
          metric_type?: string;
          value?: number;
          metadata?: any;
          recorded_at?: string;
        };
      };
    };
  };
}

class SupabaseAdminClient {
  private supabase: SupabaseClient<Database>;
  
  constructor() {
    this.supabase = createClient<Database>(supabaseUrl, supabaseKey);
  }
  
  // Authentication
  async signInWithPassword(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Check if user is admin
    const { data: adminUser, error: adminError } = await this.supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (adminError || !adminUser) {
      await this.supabase.auth.signOut();
      throw new Error('Unauthorized: Not an admin user');
    }
    
    return { user: data.user, adminUser };
  }
  
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }
  
  async getCurrentUser() {
    const { data: { user }, error } = await this.supabase.auth.getUser();
    if (error) throw error;
    return user;
  }
  
  // User Management
  async getUsers(page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;
    
    const { data, error, count } = await this.supabase
      .from('users')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return { users: data, total: count || 0 };
  }
  
  async getUser(userId: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }
  
  async createUser(userData: Database['public']['Tables']['users']['Insert']) {
    const { data, error } = await this.supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  async updateUser(userId: string, updates: Database['public']['Tables']['users']['Update']) {
    const { data, error } = await this.supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  async deleteUser(userId: string) {
    const { error } = await this.supabase
      .from('users')
      .delete()
      .eq('id', userId);
    
    if (error) throw error;
  }
  
  // Chat Management
  async getChats(page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;
    
    const { data, error, count } = await this.supabase
      .from('chats')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return { chats: data, total: count || 0 };
  }
  
  async getChat(chatId: string) {
    const { data, error } = await this.supabase
      .from('chats')
      .select('*')
      .eq('id', chatId)
      .single();
    
    if (error) throw error;
    return data;
  }
  
  async getChatMessages(chatId: string, page: number = 1, limit: number = 50) {
    const offset = (page - 1) * limit;
    
    const { data, error, count } = await this.supabase
      .from('messages')
      .select('*', { count: 'exact' })
      .eq('chat_id', chatId)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return { messages: data, total: count || 0 };
  }
  
  async createChat(chatData: Database['public']['Tables']['chats']['Insert']) {
    const { data, error } = await this.supabase
      .from('chats')
      .insert(chatData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  async deleteChat(chatId: string) {
    // First delete all messages in the chat
    await this.supabase
      .from('messages')
      .delete()
      .eq('chat_id', chatId);
    
    // Then delete the chat
    const { error } = await this.supabase
      .from('chats')
      .delete()
      .eq('id', chatId);
    
    if (error) throw error;
  }
  
  // Email Management
  async getEmailTemplates() {
    const { data, error } = await this.supabase
      .from('email_templates')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
  
  async getEmailTemplate(templateId: string) {
    const { data, error } = await this.supabase
      .from('email_templates')
      .select('*')
      .eq('id', templateId)
      .single();
    
    if (error) throw error;
    return data;
  }
  
  async createEmailTemplate(templateData: Database['public']['Tables']['email_templates']['Insert']) {
    const { data, error } = await this.supabase
      .from('email_templates')
      .insert(templateData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  async updateEmailTemplate(templateId: string, updates: Database['public']['Tables']['email_templates']['Update']) {
    const { data, error } = await this.supabase
      .from('email_templates')
      .update(updates)
      .eq('id', templateId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  async deleteEmailTemplate(templateId: string) {
    const { error } = await this.supabase
      .from('email_templates')
      .delete()
      .eq('id', templateId);
    
    if (error) throw error;
  }
  
  async getEmailLogs(page: number = 1, limit: number = 50) {
    const offset = (page - 1) * limit;
    
    const { data, error, count } = await this.supabase
      .from('email_logs')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('sent_at', { ascending: false });
    
    if (error) throw error;
    
    return { logs: data, total: count || 0 };
  }
  
  async logEmail(emailData: Database['public']['Tables']['email_logs']['Insert']) {
    const { data, error } = await this.supabase
      .from('email_logs')
      .insert(emailData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  // System Metrics
  async getSystemMetrics(hours: number = 24) {
    const startTime = new Date();
    startTime.setHours(startTime.getHours() - hours);
    
    const { data, error } = await this.supabase
      .from('system_metrics')
      .select('*')
      .gte('recorded_at', startTime.toISOString())
      .order('recorded_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
  
  async recordMetric(metricData: Database['public']['Tables']['system_metrics']['Insert']) {
    const { data, error } = await this.supabase
      .from('system_metrics')
      .insert(metricData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  // Real-time subscriptions
  subscribeToUsers(callback: (payload: any) => void) {
    return this.supabase
      .channel('users')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'users' }, 
        callback
      )
      .subscribe();
  }
  
  subscribeToChats(callback: (payload: any) => void) {
    return this.supabase
      .channel('chats')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'chats' }, 
        callback
      )
      .subscribe();
  }
  
  subscribeToMessages(callback: (payload: any) => void) {
    return this.supabase
      .channel('messages')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'messages' }, 
        callback
      )
      .subscribe();
  }
  
  subscribeToSystemMetrics(callback: (payload: any) => void) {
    return this.supabase
      .channel('system_metrics')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'system_metrics' }, 
        callback
      )
      .subscribe();
  }
  
  // Cleanup subscriptions
  unsubscribe(subscription: any) {
    return this.supabase.removeChannel(subscription);
  }
  
  // Get Supabase client for direct access
  getClient() {
    return this.supabase;
  }
}

// Export singleton instance
export const supabaseAdmin = new SupabaseAdminClient();
export default supabaseAdmin;
