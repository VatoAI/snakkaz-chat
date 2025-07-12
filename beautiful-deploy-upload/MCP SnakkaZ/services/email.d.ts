/**
 * SnakkaZ Email Service
 *
 * Secure email integration for the SnakkaZ MCP server
 * Supports IMAP/SMTP with encrypted connections
 */
import { z } from "zod";
export declare const EmailConfigSchema: z.ZodObject<{
    host: z.ZodString;
    port: z.ZodNumber;
    secure: z.ZodBoolean;
    auth: z.ZodObject<{
        user: z.ZodString;
        pass: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        user: string;
        pass: string;
    }, {
        user: string;
        pass: string;
    }>;
}, "strip", z.ZodTypeAny, {
    port: number;
    host: string;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}, {
    port: number;
    host: string;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}>;
export type EmailConfig = z.infer<typeof EmailConfigSchema>;
export declare const EmailMessageSchema: z.ZodObject<{
    from: z.ZodString;
    to: z.ZodString;
    subject: z.ZodString;
    text: z.ZodOptional<z.ZodString>;
    html: z.ZodOptional<z.ZodString>;
    priority: z.ZodOptional<z.ZodEnum<["high", "normal", "low"]>>;
}, "strip", z.ZodTypeAny, {
    from: string;
    to: string;
    subject: string;
    text?: string | undefined;
    html?: string | undefined;
    priority?: "high" | "normal" | "low" | undefined;
}, {
    from: string;
    to: string;
    subject: string;
    text?: string | undefined;
    html?: string | undefined;
    priority?: "high" | "normal" | "low" | undefined;
}>;
export type EmailMessage = z.infer<typeof EmailMessageSchema>;
export interface EmailAccountStatus {
    address: string;
    storageUsed: string;
    storageLimit: string;
    storagePercentage: number;
    isActive: boolean;
    canReceive: boolean;
    canSend: boolean;
    lastAccessed?: Date;
}
/**
 * SnakkaZ Email Service
 * Handles secure email operations for the platform
 */
export declare class SnakkaZEmailService {
    private config;
    constructor();
    private initializeConfig;
    /**
     * Check if email service is configured
     */
    isConfigured(): boolean;
    /**
     * Get email account status
     */
    getAccountStatus(): Promise<EmailAccountStatus>;
    /**
     * Send email
     */
    sendEmail(message: EmailMessage): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    /**
     * Get inbox messages (summary)
     */
    getInboxSummary(limit?: number): Promise<any[]>;
    /**
     * Check email connectivity
     */
    testConnection(): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Get email statistics
     */
    getEmailStats(): Promise<{
        totalMessages: number;
        unreadMessages: number;
        storageUsed: string;
        storagePercentage: number;
        lastActivity: Date;
    }>;
    /**
     * Configure email security settings
     */
    updateSecuritySettings(settings: {
        enableTLS?: boolean;
        requireAuth?: boolean;
        allowPlusAddressing?: boolean;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
export declare const emailService: SnakkaZEmailService;
//# sourceMappingURL=email.d.ts.map