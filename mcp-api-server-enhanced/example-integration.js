// Example: Third-party MCP server integrating with SnakkaZ
// This shows how other MCP servers can connect to SnakkaZ MCP API

const axios = require("axios");

class SnakkaZMCPClient {
  constructor(apiKey, baseUrl = "https://mcp.snakkaz.com/api") {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.headers = {
      "X-API-Key": apiKey,
      "Content-Type": "application/json",
    };
  }

  // Test connection to SnakkaZ MCP
  async testConnection() {
    try {
      const response = await axios.get(`${this.baseUrl}/mcp/status`, {
        headers: this.headers,
      });

      console.log("✅ Connected to SnakkaZ MCP:");
      console.log(`   Status: ${response.data.status}`);
      console.log(`   Version: ${response.data.version}`);
      console.log(`   Your API Key: ${response.data.api_key_info.name}`);
      console.log(
        `   Permissions: ${response.data.api_key_info.permissions.join(", ")}`
      );

      return true;
    } catch (error) {
      console.error("❌ Failed to connect to SnakkaZ MCP:", error.message);
      return false;
    }
  }

  // Get available tools
  async getAvailableTools() {
    try {
      const response = await axios.get(`${this.baseUrl}/mcp/tools`, {
        headers: this.headers,
      });

      console.log(`🛠️ Available tools (${response.data.count}):`);
      response.data.tools.forEach((tool) => {
        console.log(`   - ${tool.name}: ${tool.description}`);
      });

      return response.data.tools;
    } catch (error) {
      console.error("❌ Failed to get tools:", error.message);
      return [];
    }
  }

  // Send message through SnakkaZ MCP
  async sendMessage(message, userId, context = {}) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/mcp/chat`,
        {
          message,
          userId,
          context,
          metadata: {
            source: "third-party-mcp",
            timestamp: new Date().toISOString(),
          },
        },
        { headers: this.headers }
      );

      console.log("💬 Message sent successfully:");
      console.log(`   Response: ${response.data.response.message}`);
      console.log(`   Processing time: ${response.data.processing_time_ms}ms`);

      return response.data;
    } catch (error) {
      console.error("❌ Failed to send message:", error.message);
      throw error;
    }
  }

  // Monitor SnakkaZ MCP status
  async monitorStatus(intervalMs = 30000) {
    console.log(
      `🔍 Starting SnakkaZ MCP monitoring (every ${intervalMs / 1000}s)`
    );

    setInterval(async () => {
      try {
        const response = await axios.get(`${this.baseUrl}/mcp/status`, {
          headers: this.headers,
        });

        console.log(`📊 [${new Date().toISOString()}] SnakkaZ MCP Status:`);
        console.log(
          `   Active connections: ${response.data.connections.active}`
        );
        console.log(
          `   Requests/min: ${response.data.performance.requests_per_minute}`
        );
        console.log(
          `   Success rate: ${response.data.performance.success_rate}`
        );
      } catch (error) {
        console.error(
          `❌ [${new Date().toISOString()}] Status check failed:`,
          error.message
        );
      }
    }, intervalMs);
  }
}

// Example usage
async function main() {
  // Replace with your actual API key from SnakkaZ admin
  const apiKey = "sk_snakkaz_your_api_key_here";
  const snakkaz = new SnakkaZMCPClient(apiKey);

  console.log("🚀 Third-party MCP integration with SnakkaZ");
  console.log("===============================================");

  // Test connection
  const isConnected = await snakkaz.testConnection();
  if (!isConnected) {
    console.log("❌ Cannot connect to SnakkaZ MCP. Check your API key.");
    return;
  }

  // Get available tools
  await snakkaz.getAvailableTools();

  // Send test messages
  console.log("\n💬 Sending test messages:");

  try {
    await snakkaz.sendMessage(
      "Hei SnakkaZ! Dette er en test fra ekstern MCP server.",
      "external-user-123",
      { source: "third-party-test" }
    );

    await snakkaz.sendMessage(
      "Kan du hjelpe meg med integrasjon?",
      "external-user-123",
      { topic: "integration-help" }
    );

    await snakkaz.sendMessage(
      "Takk for hjelpen! MCP integration fungerer perfekt.",
      "external-user-123",
      { status: "success" }
    );
  } catch (error) {
    console.error("Failed to send test messages:", error);
  }

  // Start monitoring (uncomment to enable)
  // await snakkaz.monitorStatus(60000); // Monitor every minute

  console.log("\n✅ Integration test completed!");
  console.log("🎉 Your MCP server can now communicate with SnakkaZ!");
}

// Run the example
if (require.main === module) {
  main().catch(console.error);
}

module.exports = SnakkaZMCPClient;
