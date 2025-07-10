/**
 * SnakkaZ MCP Server - Shared Tools Module
 *
 * This module exports all MCP tool handlers for use by both
 * the CLI server (index.ts) and HTTP server (server.ts)
 *
 * @version 2.1.0
 * @author SnakkaZ Team
 */
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
export declare const TOOL_SCHEMAS: ({
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            query: {
                type: string;
                description: string;
            };
            region: {
                type: string;
                enum: string[];
                description: string;
                default: string;
            };
            upcoming?: never;
            level?: never;
            action?: never;
            chatId?: never;
            message?: never;
            includePerformance?: never;
            includeFeatures?: never;
            language?: never;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            query: {
                type: string;
                description: string;
            };
            region: {
                type: string;
                enum: string[];
                description: string;
                default: string;
            };
            upcoming: {
                type: string;
                description: string;
                default: boolean;
            };
            level?: never;
            action?: never;
            chatId?: never;
            message?: never;
            includePerformance?: never;
            includeFeatures?: never;
            language?: never;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            query: {
                type: string;
                description: string;
            };
            region: {
                type: string;
                enum: string[];
                description: string;
                default: string;
            };
            level: {
                type: string;
                enum: string[];
                description: string;
                default: string;
            };
            upcoming?: never;
            action?: never;
            chatId?: never;
            message?: never;
            includePerformance?: never;
            includeFeatures?: never;
            language?: never;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            action: {
                type: string;
                enum: string[];
                description: string;
            };
            chatId: {
                type: string;
                description: string;
            };
            message: {
                type: string;
                description: string;
            };
            query?: never;
            region?: never;
            upcoming?: never;
            level?: never;
            includePerformance?: never;
            includeFeatures?: never;
            language?: never;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            includePerformance: {
                type: string;
                description: string;
                default: boolean;
            };
            includeFeatures: {
                type: string;
                description: string;
                default: boolean;
            };
            language: {
                type: string;
                enum: string[];
                description: string;
                default: string;
            };
            query?: never;
            region?: never;
            upcoming?: never;
            level?: never;
            action?: never;
            chatId?: never;
            message?: never;
        };
        required?: never;
    };
})[];
export declare function handleNorwegianTechCompanies(args: any): Promise<CallToolResult>;
export declare function handleNorwegianTechEvents(args: any): Promise<CallToolResult>;
export declare function handleNorwegianTechJobs(args: any): Promise<CallToolResult>;
export declare function handleEncryptedMessages(args: any): Promise<CallToolResult>;
export declare function handleServerStatus(args: any): Promise<CallToolResult>;
export declare function handleToolCall(toolName: string, args: any): Promise<CallToolResult>;
//# sourceMappingURL=index.d.ts.map