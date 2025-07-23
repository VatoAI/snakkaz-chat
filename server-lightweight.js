#!/usr/bin/env node

/**
 * SnakkaZ MCP Server - Lightweight Version for Shared Hosting
 * Optimized for Namecheap Stellar Plus
 */

const http = require('http');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DOMAIN = process.env.DOMAIN || 'mcp.snakkaz.com';

// Simple logging without heavy dependencies
function log(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
}

// Health check response
function healthCheck() {
    return {
        status: 'healthy',
        version: '2.1.0-lightweight',
        domain: DOMAIN,
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'production',
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString()
    };
}

// MCP Tools Response
function getTools() {
    return {
        tools: [
            {
                name: "snakkaz_chat",
                description: "SnakkaZ Chat API endpoint",
                version: "2.1.0"
            },
            {
                name: "health_check", 
                description: "Server health monitoring",
                version: "2.1.0"
            }
        ],
        server: "snakkaz-mcp-lightweight",
        domain: DOMAIN
    };
}

// Simple router
function handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Content-Type', 'application/json');

    // Handle OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    log(`${req.method} ${path} - ${req.headers['user-agent'] || 'Unknown'}`);

    try {
        switch (path) {
            case '/':
                res.writeHead(200);
                res.end(JSON.stringify({
                    message: "🇳🇴 SnakkaZ MCP Server - Lightweight Edition",
                    version: "2.1.0-lightweight",
                    domain: DOMAIN,
                    status: "running",
                    endpoints: ["/health", "/api/tools", "/docs"],
                    timestamp: new Date().toISOString()
                }, null, 2));
                break;

            case '/health':
                res.writeHead(200);
                res.end(JSON.stringify(healthCheck(), null, 2));
                break;

            case '/api/tools':
                res.writeHead(200);
                res.end(JSON.stringify(getTools(), null, 2));
                break;

            case '/docs':
                res.writeHead(200);
                res.end(JSON.stringify({
                    title: "SnakkaZ MCP Server API Documentation",
                    version: "2.1.0-lightweight",
                    endpoints: {
                        "/": "Server information",
                        "/health": "Health check endpoint",
                        "/api/tools": "Available MCP tools",
                        "/docs": "This documentation"
                    },
                    examples: {
                        health_check: `curl https://${DOMAIN}/health`,
                        tools_list: `curl https://${DOMAIN}/api/tools`
                    }
                }, null, 2));
                break;

            default:
                res.writeHead(404);
                res.end(JSON.stringify({
                    error: "Not Found",
                    message: `Path '${path}' not found`,
                    available_endpoints: ["/", "/health", "/api/tools", "/docs"]
                }, null, 2));
        }
    } catch (error) {
        log(`Error handling ${path}: ${error.message}`);
        res.writeHead(500);
        res.end(JSON.stringify({
            error: "Internal Server Error",
            message: error.message
        }, null, 2));
    }
}

// Create server
const server = http.createServer(handleRequest);

// Error handling
server.on('error', (error) => {
    log(`Server error: ${error.message}`);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        log('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    log('SIGINT received, shutting down gracefully');
    server.close(() => {
        log('Server closed');
        process.exit(0);
    });
});

// Start server
server.listen(PORT, () => {
    log(`🇳🇴 SnakkaZ MCP Server v2.1.0-lightweight started`);
    log(`📍 Running on https://${DOMAIN}:${PORT}`);
    log(`🌐 Environment: ${process.env.NODE_ENV || 'production'}`);
    log(`💾 Memory usage: ${JSON.stringify(process.memoryUsage())}`);
    log(`✅ Server ready to accept connections`);
});

// Keep process alive
setInterval(() => {
    // Heartbeat every 30 seconds
}, 30000);
