/**
 * Supabase Configuration and Database Manager
 *
 * Handles all database operations for SnakkaZ MCP Server
 *
 * @version 2.1.0
 * @author SnakkaZ Team
 */
export declare class SupabaseManager {
    private client;
    private isInitialized;
    constructor();
    initialize(): Promise<void>;
    authenticateUser(token: string): Promise<{
        user: any;
        error: any;
    }>;
    signUp(email: string, password: string): Promise<{
        user: any;
        error: any;
    }>;
    signIn(email: string, password: string): Promise<{
        user: any;
        error: any;
    }>;
    getTechCompanies(region?: string, industry?: string): Promise<any[]>;
    private getMockTechCompanies;
    getTechEvents(region?: string, upcoming?: boolean): Promise<any[]>;
    private getMockTechEvents;
    getTechJobs(region?: string, techStack?: string[], level?: string): Promise<any[]>;
    private getMockTechJobs;
    saveMessage(message: {
        chat_id: string;
        user_id: string;
        content: string;
        encrypted: boolean;
        metadata?: Record<string, any>;
    }): Promise<any>;
    getChatHistory(chatId: string, limit?: number): Promise<any[]>;
    healthCheck(): Promise<{
        database: boolean;
        auth: boolean;
        details: any;
    }>;
}
export declare const supabaseManager: SupabaseManager;
//# sourceMappingURL=supabase.d.ts.map