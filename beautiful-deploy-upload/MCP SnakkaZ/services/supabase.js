/**
 * SnakkaZ Supabase Integration
 * Database operations and real-time features for SnakkaZ MCP Server
 */
import { createClient } from '@supabase/supabase-js';
// Supabase configuration
const SUPABASE_URL = 'https://wqpoozpbceucynsojmbk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8';
// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
/**
 * Initialize Supabase connection and verify database schema
 */
export async function initializeSupabase() {
    try {
        // Test connection by fetching schema info
        const { data, error } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public');
        if (error) {
            return {
                success: false,
                message: `Supabase connection failed: ${error.message}`
            };
        }
        const tables = data?.map(t => t.table_name) || [];
        return {
            success: true,
            message: `Supabase connected successfully. Found ${tables.length} tables.`,
            tables
        };
    }
    catch (error) {
        return {
            success: false,
            message: `Supabase initialization error: ${error}`
        };
    }
}
/**
 * User Management Operations
 */
export class SnakkaZUserService {
    /**
     * Get all users with optional filtering
     */
    static async getUsers(filters) {
        try {
            let query = supabase
                .from('users')
                .select('*')
                .order('lastActive', { ascending: false });
            if (filters?.region) {
                query = query.eq('region', filters.region);
            }
            if (filters?.role) {
                query = query.eq('role', filters.role);
            }
            if (filters?.limit) {
                query = query.limit(filters.limit);
            }
            const { data, error } = await query;
            if (error) {
                return { users: [], error: error.message };
            }
            return { users: data || [] };
        }
        catch (error) {
            return { users: [], error: `Failed to fetch users: ${error}` };
        }
    }
    /**
     * Get user by ID
     */
    static async getUserById(userId) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();
            if (error) {
                return { error: error.message };
            }
            return { user: data };
        }
        catch (error) {
            return { error: `Failed to fetch user: ${error}` };
        }
    }
    /**
     * Create or update user
     */
    static async upsertUser(user) {
        try {
            const { data, error } = await supabase
                .from('users')
                .upsert(user)
                .select()
                .single();
            if (error) {
                return { error: error.message };
            }
            return { user: data };
        }
        catch (error) {
            return { error: `Failed to upsert user: ${error}` };
        }
    }
    /**
     * Get Norwegian community statistics
     */
    static async getCommunityStats() {
        try {
            // Get total users
            const { count: totalUsers, error: totalError } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true });
            if (totalError) {
                return { error: totalError.message };
            }
            // Get active users (last 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const { count: activeUsers, error: activeError } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true })
                .gte('lastActive', thirtyDaysAgo.toISOString());
            if (activeError) {
                return { error: activeError.message };
            }
            // Get users by region
            const { data: regionData, error: regionError } = await supabase
                .from('users')
                .select('region')
                .not('region', 'is', null);
            if (regionError) {
                return { error: regionError.message };
            }
            const usersByRegion = regionData.reduce((acc, user) => {
                acc[user.region] = (acc[user.region] || 0) + 1;
                return acc;
            }, {});
            // Get users by role
            const { data: roleData, error: roleError } = await supabase
                .from('users')
                .select('role')
                .not('role', 'is', null);
            if (roleError) {
                return { error: roleError.message };
            }
            const usersByRole = roleData.reduce((acc, user) => {
                acc[user.role] = (acc[user.role] || 0) + 1;
                return acc;
            }, {});
            return {
                stats: {
                    totalUsers: totalUsers || 0,
                    activeUsers: activeUsers || 0,
                    usersByRegion,
                    usersByRole
                }
            };
        }
        catch (error) {
            return { error: `Failed to get community stats: ${error}` };
        }
    }
}
/**
 * Message Management Operations
 */
export class SnakkaZMessageService {
    /**
     * Get messages for a chat
     */
    static async getMessages(chatId, options) {
        try {
            let query = supabase
                .from('messages')
                .select(`
          *,
          sender:users(id, username, role, region)
        `)
                .eq('chatId', chatId)
                .order('timestamp', { ascending: false });
            if (options?.limit) {
                query = query.limit(options.limit);
            }
            if (options?.before) {
                query = query.lt('timestamp', options.before);
            }
            if (options?.encrypted !== undefined) {
                query = query.eq('encrypted', options.encrypted);
            }
            const { data, error } = await query;
            if (error) {
                return { messages: [], error: error.message };
            }
            return { messages: data || [] };
        }
        catch (error) {
            return { messages: [], error: `Failed to fetch messages: ${error}` };
        }
    }
    /**
     * Create a new message
     */
    static async createMessage(message) {
        try {
            const newMessage = {
                ...message,
                id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                timestamp: new Date().toISOString()
            };
            const { data, error } = await supabase
                .from('messages')
                .insert(newMessage)
                .select()
                .single();
            if (error) {
                return { error: error.message };
            }
            return { message: data };
        }
        catch (error) {
            return { error: `Failed to create message: ${error}` };
        }
    }
    /**
     * Get message statistics
     */
    static async getMessageStats(timeframe = 'week') {
        try {
            const now = new Date();
            const since = new Date();
            switch (timeframe) {
                case 'day':
                    since.setDate(since.getDate() - 1);
                    break;
                case 'week':
                    since.setDate(since.getDate() - 7);
                    break;
                case 'month':
                    since.setMonth(since.getMonth() - 1);
                    break;
            }
            // Get total messages
            const { count: totalMessages, error: totalError } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .gte('timestamp', since.toISOString());
            if (totalError) {
                return { error: totalError.message };
            }
            // Get encrypted messages
            const { count: encryptedMessages, error: encryptedError } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .gte('timestamp', since.toISOString())
                .eq('encrypted', true);
            if (encryptedError) {
                return { error: encryptedError.message };
            }
            // Get messages by type
            const { data: typeData, error: typeError } = await supabase
                .from('messages')
                .select('chatType')
                .gte('timestamp', since.toISOString());
            if (typeError) {
                return { error: typeError.message };
            }
            const messagesByType = typeData.reduce((acc, msg) => {
                acc[msg.chatType] = (acc[msg.chatType] || 0) + 1;
                return acc;
            }, {});
            // Get messages by region (based on sender)
            const { data: regionData, error: regionError } = await supabase
                .from('messages')
                .select(`
          chatType,
          users!inner(region)
        `)
                .gte('timestamp', since.toISOString());
            if (regionError) {
                return { error: regionError.message };
            }
            const messagesByRegion = regionData.reduce((acc, msg) => {
                const region = msg.users?.region || 'unknown';
                acc[region] = (acc[region] || 0) + 1;
                return acc;
            }, {});
            return {
                stats: {
                    totalMessages: totalMessages || 0,
                    encryptedMessages: encryptedMessages || 0,
                    messagesByType,
                    messagesByRegion
                }
            };
        }
        catch (error) {
            return { error: `Failed to get message stats: ${error}` };
        }
    }
}
/**
 * Group Management Operations
 */
export class SnakkaZGroupService {
    /**
     * Get all groups
     */
    static async getGroups(filters) {
        try {
            let query = supabase
                .from('groups')
                .select('*')
                .order('memberCount', { ascending: false });
            if (filters?.region) {
                query = query.eq('region', filters.region);
            }
            if (filters?.isPrivate !== undefined) {
                query = query.eq('isPrivate', filters.isPrivate);
            }
            if (filters?.limit) {
                query = query.limit(filters.limit);
            }
            const { data, error } = await query;
            if (error) {
                return { groups: [], error: error.message };
            }
            return { groups: data || [] };
        }
        catch (error) {
            return { groups: [], error: `Failed to fetch groups: ${error}` };
        }
    }
    /**
     * Create a new group
     */
    static async createGroup(group) {
        try {
            const newGroup = {
                ...group,
                id: `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                createdAt: new Date().toISOString(),
                memberCount: 0
            };
            const { data, error } = await supabase
                .from('groups')
                .insert(newGroup)
                .select()
                .single();
            if (error) {
                return { error: error.message };
            }
            return { group: data };
        }
        catch (error) {
            return { error: `Failed to create group: ${error}` };
        }
    }
}
/**
 * Community Events Management
 */
export class SnakkaZEventService {
    /**
     * Get upcoming events
     */
    static async getUpcomingEvents(region) {
        try {
            let query = supabase
                .from('events')
                .select('*')
                .gte('date', new Date().toISOString())
                .order('date', { ascending: true });
            if (region) {
                query = query.eq('location', region);
            }
            const { data, error } = await query;
            if (error) {
                return { events: [], error: error.message };
            }
            return { events: data || [] };
        }
        catch (error) {
            return { events: [], error: `Failed to fetch events: ${error}` };
        }
    }
    /**
     * Create a new event
     */
    static async createEvent(event) {
        try {
            const newEvent = {
                ...event,
                id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            };
            const { data, error } = await supabase
                .from('events')
                .insert(newEvent)
                .select()
                .single();
            if (error) {
                return { error: error.message };
            }
            return { event: data };
        }
        catch (error) {
            return { error: `Failed to create event: ${error}` };
        }
    }
}
/**
 * Real-time subscriptions for live updates
 */
export class SnakkaZRealtimeService {
    /**
     * Subscribe to message updates for a chat
     */
    static subscribeToMessages(chatId, callback) {
        return supabase
            .channel(`messages:${chatId}`)
            .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `chatId=eq.${chatId}`
        }, (payload) => {
            callback(payload.new);
        })
            .subscribe();
    }
    /**
     * Subscribe to user presence updates
     */
    static subscribeToUserPresence(callback) {
        return supabase
            .channel('user-presence')
            .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'users',
            filter: 'lastActive=gte.now()'
        }, (payload) => {
            callback(payload.new);
        })
            .subscribe();
    }
    /**
     * Subscribe to community events
     */
    static subscribeToCommunityEvents(callback) {
        return supabase
            .channel('community-events')
            .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'events'
        }, (payload) => {
            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                callback(payload.new);
            }
        })
            .subscribe();
    }
}
/**
 * Health check for Supabase connection
 */
export async function checkSupabaseHealth() {
    const startTime = Date.now();
    const details = {
        connection: false,
        authentication: false,
        database: false,
        realtime: false
    };
    try {
        // Test basic connection
        const { data: connectionTest, error: connectionError } = await supabase
            .from('users')
            .select('count', { count: 'exact', head: true })
            .limit(1);
        details.connection = !connectionError;
        // Test authentication (anonymous)
        const { data: authData, error: authError } = await supabase.auth.getSession();
        details.authentication = !authError;
        // Test database operations
        details.database = details.connection;
        // Test realtime connection
        const channel = supabase.channel('health-check');
        details.realtime = channel.state === 'joined' || channel.state === 'joining';
        channel.unsubscribe();
        const responseTime = Date.now() - startTime;
        const healthyCount = Object.values(details).filter(Boolean).length;
        let status;
        if (healthyCount === 4) {
            status = 'healthy';
        }
        else if (healthyCount >= 2) {
            status = 'degraded';
        }
        else {
            status = 'unhealthy';
        }
        return {
            status,
            responseTime,
            details
        };
    }
    catch (error) {
        return {
            status: 'unhealthy',
            responseTime: Date.now() - startTime,
            details
        };
    }
}
//# sourceMappingURL=supabase.js.map