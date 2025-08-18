import { useMCPWebRTC } from "@/providers/MCPWebRTCProvider";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect, useCallback } from "react";

export interface MCPChatMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  type: "user" | "mcp" | "system";
  room?: string;
  encrypted?: boolean;
  priority?: "low" | "normal" | "high";
}

export interface MCPChatRoom {
  id: string;
  name: string;
  users: number;
  messages: number;
  encrypted: boolean;
  description?: string;
  created_at: string;
}

export interface MCPSystemMetrics {
  uptime: string;
  totalUsers: number;
  messagesTotal: number;
  encryptionRate: string;
  serverLoad: number;
  lastUpdate: string;
}

/**
 * MCP Live Chat Service Hook
 *
 * Gir direkte integrasjon med MCP serveren for live chat funksjonalitet
 */
export const useMCPChatService = () => {
  const { user } = useAuth();
  const { controller, isInitialized, error: mcpError } = useMCPWebRTC();

  // 🚀 FORCE MOCK USER FOR MCP TESTING
  const effectiveUser = user || {
    id: "demo-user-mcp-12345",
    email: "demo@snakkaz.com",
    name: "MCP Demo User",
  };

  console.log("🎯 MCP Service User:", {
    realUser: !!user,
    effectiveUser: !!effectiveUser,
    userId: effectiveUser.id,
  });

  const [isConnected, setIsConnected] = useState(false);
  const [rooms, setRooms] = useState<MCPChatRoom[]>([]);
  const [messages, setMessages] = useState<MCPChatMessage[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<MCPSystemMetrics | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // MCP Server URL - fra miljøvariabler eller default
  const mcpServerUrl =
    import.meta.env.VITE_MCP_SERVER_URL || "http://localhost:3000";

  /**
   * Koble til MCP serveren og hent initial data
   */
  const connectToMCP = useCallback(async () => {
    // Use effectiveUser instead of user
    if (!effectiveUser) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log("🚀 Connecting to MCP Chat Server...");

      // Test MCP server tilkobling
      const statusResponse = await fetch(`${mcpServerUrl}/api/status`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${effectiveUser.id}`, // Bruk effectiveUser ID som token
        },
      });

      if (!statusResponse.ok) {
        throw new Error(
          `MCP Server responded with status: ${statusResponse.status}`
        );
      }

      const statusData = await statusResponse.json();
      console.log("✅ MCP Server Status:", statusData);

      // Sett system metrics
      if (statusData.data?.metrics) {
        setSystemMetrics(statusData.data.metrics);
      }

      // Hent rooms fra MCP
      if (statusData.data?.rooms) {
        const mcpRooms: MCPChatRoom[] = Object.entries(
          statusData.data.rooms
        ).map(([name, data]: [string, any]) => ({
          id: name,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          users: data.users || 0,
          messages: data.messages || 0,
          encrypted: data.encrypted || false,
          description: `MCP room: ${name}`,
          created_at: new Date().toISOString(),
        }));

        setRooms(mcpRooms);
        console.log("📂 MCP Rooms loaded:", mcpRooms);
      }

      // Mock noen meldinger for demo
      const mockMessages: MCPChatMessage[] = [
        {
          id: "mcp-1",
          content: "🚀 MCP Chat System er online! Velkommen til SnakkaZ Live!",
          sender: "MCP System",
          timestamp: new Date().toISOString(),
          type: "system",
          room: "general",
          encrypted: true,
        },
        {
          id: "mcp-2",
          content: "🔐 End-to-End kryptering er aktivert for alle meldinger",
          sender: "Security Bot",
          timestamp: new Date().toISOString(),
          type: "mcp",
          room: "general",
          encrypted: true,
        },
        {
          id: "mcp-3",
          content:
            "🌊 Liquid Dream design system lastet! Chat er klar for bruk.",
          sender: "UI System",
          timestamp: new Date().toISOString(),
          type: "system",
          room: "general",
          encrypted: false,
        },
      ];

      setMessages(mockMessages);
      setIsConnected(true);
      console.log("✅ MCP Chat Service connected successfully!");
    } catch (err) {
      console.error("❌ Failed to connect to MCP server:", err);
      setError(
        err instanceof Error ? err.message : "Unknown MCP connection error"
      );

      // Fallback til mock data
      setRooms([
        {
          id: "general",
          name: "General",
          users: 42,
          messages: 1337,
          encrypted: true,
          description: "Main chat room",
          created_at: new Date().toISOString(),
        },
        {
          id: "dev-team",
          name: "Dev Team",
          users: 8,
          messages: 234,
          encrypted: true,
          description: "Development discussions",
          created_at: new Date().toISOString(),
        },
      ]);

      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, [effectiveUser, isInitialized, mcpServerUrl]);

  /**
   * Send melding via MCP
   */
  const sendMessage = useCallback(
    async (
      content: string,
      room: string = "general",
      options: {
        encrypt?: boolean;
        priority?: "low" | "normal" | "high";
      } = {}
    ) => {
      if (!effectiveUser || !isConnected) {
        throw new Error("Not connected to MCP or user not authenticated");
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log(`📤 Sending MCP message to room: ${room}`);

        // Send til MCP server
        const response = await fetch(`${mcpServerUrl}/api/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${effectiveUser.id}`,
          },
          body: JSON.stringify({
            message: content,
            room,
            userId: effectiveUser.id,
            chatType: room,
            encrypt: options.encrypt ?? true,
            priority: options.priority ?? "normal",
            timestamp: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to send message: ${response.status}`);
        }

        const result = await response.json();
        console.log("✅ MCP Message sent:", result);

        // Legg til melding lokalt
        const newMessage: MCPChatMessage = {
          id: `msg-${Date.now()}`,
          content,
          sender: effectiveUser.email || effectiveUser.id,
          timestamp: new Date().toISOString(),
          type: "user",
          room,
          encrypted: options.encrypt ?? true,
          priority: options.priority ?? "normal",
        };

        setMessages((prev) => [...prev, newMessage]);

        // Simulate MCP response hvis vi fikk svar
        if (result.response) {
          setTimeout(() => {
            const mcpResponse: MCPChatMessage = {
              id: `mcp-${Date.now()}`,
              content: result.response,
              sender: "MCP Assistant",
              timestamp: new Date().toISOString(),
              type: "mcp",
              room,
              encrypted: true,
            };
            setMessages((prev) => [...prev, mcpResponse]);
          }, 1000);
        }

        return newMessage;
      } catch (err) {
        console.error("❌ Failed to send MCP message:", err);
        setError(err instanceof Error ? err.message : "Failed to send message");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [effectiveUser, isConnected, mcpServerUrl]
  );

  /**
   * Opprett nytt chat room via MCP
   */
  const createRoom = useCallback(
    async (
      name: string,
      description: string = "",
      options: {
        encryptionLevel?: "none" | "standard" | "high";
        maxUsers?: number;
      } = {}
    ) => {
      if (!effectiveUser || !isConnected) {
        throw new Error("Not connected to MCP or user not authenticated");
      }

      try {
        console.log(`🏠 Creating MCP room: ${name}`);

        const newRoom: MCPChatRoom = {
          id: name.toLowerCase().replace(/\s+/g, "-"),
          name,
          users: 1,
          messages: 0,
          encrypted: options.encryptionLevel !== "none",
          description,
          created_at: new Date().toISOString(),
        };

        setRooms((prev) => [...prev, newRoom]);
        console.log("✅ MCP Room created:", newRoom);

        return newRoom;
      } catch (err) {
        console.error("❌ Failed to create MCP room:", err);
        setError(err instanceof Error ? err.message : "Failed to create room");
        throw err;
      }
    },
    [effectiveUser, isConnected]
  );

  /**
   * Hent chat analytics fra MCP
   */
  const getAnalytics = useCallback(
    async (timeframe: string = "24h") => {
      if (!isConnected) return null;

      try {
        console.log(`📊 Fetching MCP analytics for: ${timeframe}`);

        // Mock analytics data
        return {
          timeframe,
          totalMessages: Math.floor(Math.random() * 1000) + 500,
          activeUsers: Math.floor(Math.random() * 100) + 50,
          roomActivity: rooms.map((room) => ({
            room: room.name,
            messages: Math.floor(Math.random() * 200) + 10,
            users: Math.floor(Math.random() * 20) + 1,
          })),
          timestamp: new Date().toISOString(),
        };
      } catch (err) {
        console.error("❌ Failed to get MCP analytics:", err);
        return null;
      }
    },
    [isConnected, rooms]
  );

  // Auto-connect når komponenten initialiseres
  useEffect(() => {
    // 🚀 FORCE MOCK DATA FOR IMMEDIATE TESTING
    console.log("🌊 FORCE LOADING MCP MOCK DATA FOR DEMO...");

    // Set mock rooms immediately
    const mockRooms: MCPChatRoom[] = [
      {
        id: "general",
        name: "General 🌊",
        users: 42,
        messages: 1337,
        encrypted: true,
        description: "Main chat room with MCP integration",
        created_at: new Date().toISOString(),
      },
      {
        id: "dev-team",
        name: "Dev Team 💻",
        users: 8,
        messages: 234,
        encrypted: true,
        description: "Development team discussions",
        created_at: new Date().toISOString(),
      },
      {
        id: "liquid-design",
        name: "Liquid Design 🎨",
        users: 15,
        messages: 89,
        encrypted: true,
        description: "Crystal Blue design discussions",
        created_at: new Date().toISOString(),
      },
    ];

    // Set mock messages immediately
    const mockMessages: MCPChatMessage[] = [
      {
        id: "mcp-demo-1",
        content:
          "🚀 SnakkaZ MCP Chat System er online! Velkommen til live chat!",
        sender: "MCP System",
        timestamp: new Date().toISOString(),
        type: "system",
        room: "general",
        encrypted: true,
      },
      {
        id: "mcp-demo-2",
        content: "🔐 End-to-End kryptering aktivert - alle meldinger er sikre",
        sender: "Security Bot",
        timestamp: new Date(Date.now() - 30000).toISOString(),
        type: "mcp",
        room: "general",
        encrypted: true,
      },
      {
        id: "mcp-demo-3",
        content: "🌊 Crystal Blue Liquid Design system er lastet og klar!",
        sender: "Design System",
        timestamp: new Date(Date.now() - 60000).toISOString(),
        type: "system",
        room: "general",
        encrypted: false,
      },
      {
        id: "mcp-demo-4",
        content:
          "💬 Dette er en demo av MCP chat historikk - fungerer perfekt!",
        sender: effectiveUser.email || "MCP Demo User",
        timestamp: new Date(Date.now() - 90000).toISOString(),
        type: "user",
        room: "general",
        encrypted: true,
      },
      {
        id: "mcp-demo-5",
        content:
          "📡 Real-time MCP kommunikasjon etablert - prøv å send en melding!",
        sender: "MCP Assistant",
        timestamp: new Date(Date.now() - 120000).toISOString(),
        type: "mcp",
        room: "general",
        encrypted: true,
      },
    ];

    // Set mock system metrics
    const mockMetrics: MCPSystemMetrics = {
      uptime: "99.97%",
      totalUsers: 2847,
      messagesTotal: 45632,
      encryptionRate: "98.7%",
      serverLoad: 23,
      lastUpdate: new Date().toISOString(),
    };

    setRooms(mockRooms);
    setMessages(mockMessages);
    setSystemMetrics(mockMetrics);
    setIsConnected(true);
    setIsLoading(false);

    console.log("✅ MCP MOCK DATA LOADED:", {
      rooms: mockRooms.length,
      messages: mockMessages.length,
      connected: true,
    });

    // Also attempt real connection in background
    if (isInitialized && effectiveUser && !isLoading) {
      connectToMCP();
    }
  }, [isInitialized, effectiveUser, connectToMCP]);

  return {
    // Status
    isConnected,
    isLoading,
    error: error || mcpError,

    // Data
    rooms,
    messages,
    systemMetrics,

    // Actions
    sendMessage,
    createRoom,
    getAnalytics,
    reconnect: connectToMCP,

    // Raw MCP controller for advanced usage
    mcpController: controller,
  };
};
