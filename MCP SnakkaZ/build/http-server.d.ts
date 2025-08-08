#!/usr/bin/env node
/**
 * SnakkaZ MCP HTTP Server
 * Production-ready HTTP server for SnakkaZ Chat MCP integration
 */
declare class SnakkaZMCPHTTPServer {
    private app;
    private server;
    private io;
    private port;
    private startTime;
    private metrics;
    private servers;
    private connectedServers;
    constructor();
    private setupMiddleware;
    private setupRoutes;
    private setupWebSocket;
    private initializeMockServers;
    private handleServerControl;
    private processChatMessage;
    private simulateServerActivity;
    private updateSystemMetrics;
    start(): void;
    private shutdown;
}
export { SnakkaZMCPHTTPServer };
//# sourceMappingURL=http-server.d.ts.map