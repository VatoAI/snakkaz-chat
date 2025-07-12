#!/usr/bin/env node
/**
 * SnakkaZ Infrastructure Integration Service
 *
 * Integrates the modernized MCP server with existing SnakkaZ infrastructure:
 * - cPanel API token management
 * - WebDAV file sharing (mcp.snakkaz.com)
 * - CalDAV/CardDAV services
 * - Domain management
 *
 * @version 1.0.0
 * @author SnakkaZ Team
 */
export interface InfrastructureStatus {
    webdav: {
        status: 'online' | 'offline' | 'error';
        domain: string;
        host: string;
        ip: string;
        ssl: boolean;
        port: number;
        lastChecked: string;
    };
    caldav: {
        status: 'online' | 'offline' | 'error';
        server: string;
        host: string;
        ip: string;
        port_secure: number;
        port_unsecure: number;
        calendars: number;
        contacts: number;
        lastChecked: string;
    };
    cpanel: {
        status: 'online' | 'offline' | 'error';
        host: string;
        ip: string;
        tokens: number;
        lastChecked: string;
    };
    domain: {
        status: 'active' | 'inactive' | 'error';
        domain: string;
        ip: string;
        documentRoot: string;
        ssl: boolean;
        lastChecked: string;
    };
}
export declare class InfrastructureService {
    private config;
    private apiTokens;
    constructor();
    private initializeService;
    /**
     * Get comprehensive infrastructure status
     */
    getInfrastructureStatus(): Promise<InfrastructureStatus>;
    /**
     * Manage cPanel API tokens
     */
    manageApiToken(action: 'create' | 'list' | 'revoke', tokenName?: string): Promise<any>;
    /**
     * Test WebDAV connection
     */
    testWebDavConnection(): Promise<{
        success: boolean;
        message: string;
        config: any;
    }>;
    /**
     * Test CalDAV/CardDAV connection
     */
    testCalDavConnection(): Promise<{
        success: boolean;
        message: string;
        details: any;
    }>;
    /**
     * Generate WebDAV shortcut script (Windows VBScript)
     */
    generateWebDavShortcut(): string;
    /**
     * Get infrastructure configuration for MCP tools
     */
    getInfrastructureConfig(): any;
    /**
     * Execute cPanel API call
     */
    executeCpanelApi(module: string, func: string, params?: Record<string, any>): Promise<any>;
    /**
     * Generate secure API token
     */
    private generateApiToken;
}
export declare const infrastructureService: InfrastructureService;
//# sourceMappingURL=infrastructure-integration.d.ts.map