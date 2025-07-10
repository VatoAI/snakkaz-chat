/**
 * SnakkaZ Supabase Integration
 * Database operations and real-time features for SnakkaZ MCP Server
 */
import { SupabaseClient } from '@supabase/supabase-js';
import { SnakkaZUser, SnakkaZMessage, SnakkaZGroup, CommunityEvent } from '../types/index.js';
export declare const supabase: SupabaseClient;
/**
 * Initialize Supabase connection and verify database schema
 */
export declare function initializeSupabase(): Promise<{
    success: boolean;
    message: string;
    tables?: string[];
}>;
/**
 * User Management Operations
 */
export declare class SnakkaZUserService {
    /**
     * Get all users with optional filtering
     */
    static getUsers(filters?: {
        region?: string;
        role?: string;
        limit?: number;
    }): Promise<{
        users: SnakkaZUser[];
        error?: string;
    }>;
    /**
     * Get user by ID
     */
    static getUserById(userId: string): Promise<{
        user?: SnakkaZUser;
        error?: string;
    }>;
    /**
     * Create or update user
     */
    static upsertUser(user: Partial<SnakkaZUser>): Promise<{
        user?: SnakkaZUser;
        error?: string;
    }>;
    /**
     * Get Norwegian community statistics
     */
    static getCommunityStats(): Promise<{
        stats?: {
            totalUsers: number;
            activeUsers: number;
            usersByRegion: Record<string, number>;
            usersByRole: Record<string, number>;
        };
        error?: string;
    }>;
}
/**
 * Message Management Operations
 */
export declare class SnakkaZMessageService {
    /**
     * Get messages for a chat
     */
    static getMessages(chatId: string, options?: {
        limit?: number;
        before?: string;
        encrypted?: boolean;
    }): Promise<{
        messages: SnakkaZMessage[];
        error?: string;
    }>;
    /**
     * Create a new message
     */
    static createMessage(message: Omit<SnakkaZMessage, 'id' | 'timestamp'>): Promise<{
        message?: SnakkaZMessage;
        error?: string;
    }>;
    /**
     * Get message statistics
     */
    static getMessageStats(timeframe?: 'day' | 'week' | 'month'): Promise<{
        stats?: {
            totalMessages: number;
            encryptedMessages: number;
            messagesByType: Record<string, number>;
            messagesByRegion: Record<string, number>;
        };
        error?: string;
    }>;
}
/**
 * Group Management Operations
 */
export declare class SnakkaZGroupService {
    /**
     * Get all groups
     */
    static getGroups(filters?: {
        region?: string;
        isPrivate?: boolean;
        limit?: number;
    }): Promise<{
        groups: SnakkaZGroup[];
        error?: string;
    }>;
    /**
     * Create a new group
     */
    static createGroup(group: Omit<SnakkaZGroup, 'id' | 'createdAt' | 'memberCount'>): Promise<{
        group?: SnakkaZGroup;
        error?: string;
    }>;
}
/**
 * Community Events Management
 */
export declare class SnakkaZEventService {
    /**
     * Get upcoming events
     */
    static getUpcomingEvents(region?: string): Promise<{
        events: CommunityEvent[];
        error?: string;
    }>;
    /**
     * Create a new event
     */
    static createEvent(event: Omit<CommunityEvent, 'id'>): Promise<{
        event?: CommunityEvent;
        error?: string;
    }>;
}
/**
 * Real-time subscriptions for live updates
 */
export declare class SnakkaZRealtimeService {
    /**
     * Subscribe to message updates for a chat
     */
    static subscribeToMessages(chatId: string, callback: (message: SnakkaZMessage) => void): import("@supabase/supabase-js").RealtimeChannel;
    /**
     * Subscribe to user presence updates
     */
    static subscribeToUserPresence(callback: (user: SnakkaZUser) => void): import("@supabase/supabase-js").RealtimeChannel;
    /**
     * Subscribe to community events
     */
    static subscribeToCommunityEvents(callback: (event: CommunityEvent) => void): import("@supabase/supabase-js").RealtimeChannel;
}
/**
 * Health check for Supabase connection
 */
export declare function checkSupabaseHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    responseTime: number;
    details: {
        connection: boolean;
        authentication: boolean;
        database: boolean;
        realtime: boolean;
    };
}>;
//# sourceMappingURL=supabase.d.ts.map