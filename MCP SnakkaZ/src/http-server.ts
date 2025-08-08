#!/usr/bin/env node

/**
 * SnakkaZ MCP HTTP Server
 * Production-ready HTTP server for SnakkaZ Chat MCP integration
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

interface MCPServerStatus {
  id: string;
  name: string;
  status: "online" | "offline" | "error";
  uptime: number;
  requests: number;
  errors: number;
  lastActivity: Date;
  version: string;
  tools: MCPTool[];
}

interface MCPTool {
  name: string;
  description: string;
  usage: number;
  lastUsed: Date;
  enabled: boolean;
}

interface MCPMetrics {
  totalRequests: number;
  averageResponseTime: number;
  activeConnections: number;
  errorRate: number;
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
}

class SnakkaZMCPHTTPServer {
  private app: express.Application;
  private server: any;
  private io!: SocketIOServer; // Will be initialized in setupWebSocket
  private port: number;
  private startTime: Date;
  private metrics: MCPMetrics;
  private servers: Map<string, MCPServerStatus>;
  private connectedServers: MCPServerStatus[];

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.MCP_HTTP_PORT || "3001");
    this.startTime = new Date();
    this.servers = new Map();
    this.connectedServers = [];
    this.metrics = {
      totalRequests: 0,
      averageResponseTime: 0,
      activeConnections: 0,
      errorRate: 0,
      uptime: 0,
      memoryUsage: 0,
      cpuUsage: 0,
    };

    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
    this.initializeMockServers();
  }

  private setupMiddleware() {
    // Security middleware
    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            connectSrc: ["'self'", "ws:", "wss:"],
          },
        },
      })
    );

    // CORS configuration
    this.app.use(
      cors({
        origin:
          process.env.NODE_ENV === "production"
            ? ["https://snakkaz.com", "https://www.snakkaz.com"]
            : ["http://localhost:5173", "http://127.0.0.1:5173"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      })
    );

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: {
        error: "Too many requests from this IP",
        retryAfter: "15 minutes",
      },
    });
    this.app.use("/api/", limiter);

    // Body parsing
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging and metrics
    this.app.use((req, res, next) => {
      const start = Date.now();
      this.metrics.totalRequests++;

      res.on("finish", () => {
        const duration = Date.now() - start;
        this.metrics.averageResponseTime =
          (this.metrics.averageResponseTime + duration) / 2;

        if (res.statusCode >= 400) {
          this.metrics.errorRate++;
        }
      });

      next();
    });
  }

  private setupRoutes() {
    // Health check endpoint
    this.app.get("/api/health", (req, res) => {
      const uptime = Date.now() - this.startTime.getTime();
      res.json({
        status: "healthy",
        uptime: Math.floor(uptime / 1000),
        timestamp: new Date().toISOString(),
        version: "2.1.0",
        service: "snakkaz-mcp-server",
      });
    });

    // Server status endpoint
    this.app.get("/api/servers", (req, res) => {
      const serversArray = Array.from(this.servers.values());
      res.json({
        servers: serversArray,
        count: serversArray.length,
        online: serversArray.filter((s) => s.status === "online").length,
      });
    });

    // Metrics endpoint
    this.app.get("/api/metrics", (req, res) => {
      this.updateSystemMetrics();
      res.json({
        ...this.metrics,
        uptime: Math.floor((Date.now() - this.startTime.getTime()) / 1000),
        timestamp: new Date().toISOString(),
      });
    });

    // Individual server status
    this.app.get("/api/servers/:id", (req, res) => {
      const server = this.servers.get(req.params.id);
      if (!server) {
        return res.status(404).json({ error: "Server not found" });
      }
      res.json(server);
    });

    // Server control endpoints
    this.app.post("/api/servers/:id/start", (req, res) => {
      const server = this.servers.get(req.params.id);
      if (!server) {
        return res.status(404).json({ error: "Server not found" });
      }

      server.status = "online";
      server.lastActivity = new Date();
      this.servers.set(req.params.id, server);

      // Broadcast update via WebSocket
      this.io.emit("serverUpdate", server);

      res.json({ message: "Server started", server });
    });

    this.app.post("/api/servers/:id/stop", (req, res) => {
      const server = this.servers.get(req.params.id);
      if (!server) {
        return res.status(404).json({ error: "Server not found" });
      }

      server.status = "offline";
      this.servers.set(req.params.id, server);

      // Broadcast update via WebSocket
      this.io.emit("serverUpdate", server);

      res.json({ message: "Server stopped", server });
    });

    this.app.post("/api/servers/:id/restart", (req, res) => {
      const server = this.servers.get(req.params.id);
      if (!server) {
        return res.status(404).json({ error: "Server not found" });
      }

      server.status = "online";
      server.uptime = 0;
      server.lastActivity = new Date();
      this.servers.set(req.params.id, server);

      // Broadcast update via WebSocket
      this.io.emit("serverUpdate", server);

      res.json({ message: "Server restarted", server });
    });

    // Chat integration endpoints
    this.app.post("/api/chat", (req, res) => {
      const { message, userId, roomId } = req.body;

      if (!message || !userId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Process chat message through MCP
      const response = this.processChatMessage(message, userId, roomId);

      res.json({
        success: true,
        response,
        timestamp: new Date().toISOString(),
      });
    });

    // Tools endpoint
    this.app.get("/api/tools", (req, res) => {
      const allTools = Array.from(this.servers.values()).flatMap(
        (server) => server.tools
      );

      res.json({
        tools: allTools,
        count: allTools.length,
        enabled: allTools.filter((t) => t.enabled).length,
      });
    });

    // Error handling
    this.app.use((err: any, req: any, res: any, next: any) => {
      console.error("Server error:", err);
      res.status(500).json({
        error: "Internal server error",
        message:
          process.env.NODE_ENV === "development"
            ? err.message
            : "Something went wrong",
      });
    });

    // 404 handler
    this.app.use("*", (req, res) => {
      res.status(404).json({
        error: "Not found",
        path: req.originalUrl,
      });
    });
  }

  private setupWebSocket() {
    this.server = createServer(this.app);
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin:
          process.env.NODE_ENV === "production"
            ? ["https://snakkaz.com", "https://www.snakkaz.com"]
            : ["http://localhost:5173", "http://127.0.0.1:5173"],
        credentials: true,
      },
    });

    this.io.on("connection", (socket: Socket) => {
      console.log("🔌 Client connected to MCP control panel");

      // Send initial server status
      socket.emit("serverStatus", {
        status: "online",
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        servers: this.connectedServers,
      });

      // Handle server control commands
      socket.on("serverControl", (data: any) => {
        this.handleServerControl(data.serverId, data.action, socket);
      });

      socket.on("disconnect", () => {
        console.log("🔌 Client disconnected from MCP control panel");
      });
    });

    // Broadcast metrics every 5 seconds
    setInterval(() => {
      this.updateSystemMetrics();
      this.io.emit("metrics", this.metrics);
    }, 5000);
  }

  private initializeMockServers() {
    // Initialize mock MCP servers for demonstration
    const mockServers: MCPServerStatus[] = [
      {
        id: "snakkaz-main",
        name: "SnakkaZ Main MCP",
        status: "online",
        uptime: 86400,
        requests: Math.floor(Math.random() * 2000) + 1000,
        errors: Math.floor(Math.random() * 5),
        lastActivity: new Date(),
        version: "2.1.0",
        tools: [
          {
            name: "chat_manager",
            description: "Manages chat operations and routing",
            usage: Math.floor(Math.random() * 1000) + 500,
            lastUsed: new Date(),
            enabled: true,
          },
          {
            name: "user_lookup",
            description: "User information and status lookup",
            usage: Math.floor(Math.random() * 500) + 100,
            lastUsed: new Date(Date.now() - 300000),
            enabled: true,
          },
        ],
      },
      {
        id: "snakkaz-ai",
        name: "SnakkaZ AI Assistant",
        status: "online",
        uptime: 43200,
        requests: Math.floor(Math.random() * 1000) + 500,
        errors: 0,
        lastActivity: new Date(Date.now() - 60000),
        version: "1.8.3",
        tools: [
          {
            name: "ai_response",
            description: "AI-powered chat responses",
            usage: Math.floor(Math.random() * 800) + 200,
            lastUsed: new Date(Date.now() - 60000),
            enabled: true,
          },
        ],
      },
      {
        id: "snakkaz-security",
        name: "SnakkaZ Security",
        status: "online",
        uptime: 86400,
        requests: Math.floor(Math.random() * 3000) + 1500,
        errors: 1,
        lastActivity: new Date(),
        version: "3.0.1",
        tools: [
          {
            name: "threat_detection",
            description: "Real-time threat detection",
            usage: Math.floor(Math.random() * 1500) + 800,
            lastUsed: new Date(),
            enabled: true,
          },
        ],
      },
    ];

    mockServers.forEach((server) => {
      this.servers.set(server.id, server);
    });

    // Simulate ongoing activity
    setInterval(() => {
      this.simulateServerActivity();
    }, 10000);
  }

  private handleServerControl(serverId: string, action: string, socket: any) {
    const server = this.servers.get(serverId);
    if (!server) {
      socket.emit("error", { message: "Server not found" });
      return;
    }

    switch (action) {
      case "start":
        server.status = "online";
        server.lastActivity = new Date();
        break;
      case "stop":
        server.status = "offline";
        break;
      case "restart":
        server.status = "online";
        server.uptime = 0;
        server.lastActivity = new Date();
        break;
    }

    this.servers.set(serverId, server);
    this.io.emit("serverUpdate", server);
  }

  private processChatMessage(message: string, userId: string, roomId?: string) {
    // Mock MCP chat processing
    const responses = [
      "Melding mottatt og behandlet av SnakkaZ MCP",
      "AI-assistenten har analysert meldingen din",
      "Sikkerhetssystemet har verifisert meldingen",
      "Meldingen er kryptert og sendt til mottakeren",
    ];

    return {
      processed: true,
      response: responses[Math.floor(Math.random() * responses.length)],
      mcpVersion: "2.1.0",
      processingTime: Math.random() * 100 + 50,
    };
  }

  private simulateServerActivity() {
    this.servers.forEach((server, id) => {
      if (server.status === "online") {
        // Simulate requests
        server.requests += Math.floor(Math.random() * 10) + 1;
        server.uptime += 10;

        // Occasionally update last activity
        if (Math.random() > 0.7) {
          server.lastActivity = new Date();
        }

        // Simulate tool usage
        server.tools.forEach((tool) => {
          if (Math.random() > 0.8) {
            tool.usage += Math.floor(Math.random() * 3) + 1;
            tool.lastUsed = new Date();
          }
        });

        this.servers.set(id, server);
      }
    });
  }

  private updateSystemMetrics() {
    const process_memory = process.memoryUsage();
    this.metrics.memoryUsage = Math.round(
      process_memory.heapUsed / 1024 / 1024
    );
    this.metrics.cpuUsage = Math.random() * 30 + 10; // Mock CPU usage
    this.metrics.uptime = Math.floor(
      (Date.now() - this.startTime.getTime()) / 1000
    );
  }

  public start() {
    this.server.listen(this.port, () => {
      console.log(`🚀 SnakkaZ MCP HTTP Server running on port ${this.port}`);
      console.log(`📊 Dashboard: http://localhost:${this.port}/api/health`);
      console.log(`🔗 WebSocket: ws://localhost:${this.port}`);
      console.log(`🛡️ Environment: ${process.env.NODE_ENV || "development"}`);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => this.shutdown());
    process.on("SIGINT", () => this.shutdown());
  }

  private shutdown() {
    console.log("🛑 Shutting down SnakkaZ MCP Server...");
    this.server.close(() => {
      console.log("✅ Server shutdown complete");
      process.exit(0);
    });
  }
}

// Start the server
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new SnakkaZMCPHTTPServer();
  server.start();
}

export { SnakkaZMCPHTTPServer };
