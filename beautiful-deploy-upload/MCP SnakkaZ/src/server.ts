#!/usr/bin/env node

/**
 * SnakkaZ MCP Server
 * Model Context Protocol server for SnakkaZ Chat platform
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

class SnakkaZMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "snakkaz-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "get_chat_status",
            description: "Get the current status of SnakkaZ chat system",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          {
            name: "send_message",
            description: "Send a message through SnakkaZ chat",
            inputSchema: {
              type: "object",
              properties: {
                recipient: {
                  type: "string",
                  description: "The recipient of the message",
                },
                message: {
                  type: "string",
                  description: "The message content",
                },
              },
              required: ["recipient", "message"],
            },
          },
          {
            name: "get_user_info",
            description: "Get information about a SnakkaZ user",
            inputSchema: {
              type: "object",
              properties: {
                username: {
                  type: "string",
                  description: "The username to look up",
                },
              },
              required: ["username"],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "get_chat_status":
            return await this.getChatStatus();
          
          case "send_message":
            if (!args) throw new Error("Missing arguments for send_message");
            return await this.sendMessage(String(args.recipient), String(args.message));
          
          case "get_user_info":
            if (!args) throw new Error("Missing arguments for get_user_info");
            return await this.getUserInfo(String(args.username));

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Error executing tool ${name}: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    });
  }

  private async getChatStatus() {
    // TODO: Implement actual chat status check
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            status: "online",
            active_users: 150,
            total_messages_today: 2450,
            server_health: "excellent",
            last_updated: new Date().toISOString()
          }, null, 2)
        }
      ]
    };
  }

  private async sendMessage(recipient: string, message: string) {
    // TODO: Implement actual message sending
    return {
      content: [
        {
          type: "text",
          text: `Message sent to ${recipient}: "${message}"`
        }
      ]
    };
  }

  private async getUserInfo(username: string) {
    // TODO: Implement actual user lookup
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            username: username,
            status: "online",
            trust_level: "verified",
            member_since: "2024-01-15",
            last_seen: new Date().toISOString()
          }, null, 2)
        }
      ]
    };
  }

  private setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("SnakkaZ MCP Server running on stdio");
  }
}

// Start the server
const server = new SnakkaZMCPServer();
server.start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
