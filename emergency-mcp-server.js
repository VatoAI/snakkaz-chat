// Emergency MCP Test Server for SnakkaZ
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// CORS for alle domener
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

console.log("🚀 Emergency MCP Test Server starting...");

// Mock MCP data
const mockData = {
  rooms: {
    general: { users: 42, messages: 1337, encrypted: true },
    "dev-team": { users: 8, messages: 234, encrypted: true },
    random: { users: 23, messages: 567, encrypted: false },
  },
  metrics: {
    uptime: "99.97%",
    totalUsers: 2847,
    messagesTotal: 45632,
    encryptionRate: "98.7%",
    serverLoad: 25,
    lastUpdate: new Date().toISOString(),
  },
};

// MCP Status endpoint
app.get("/api/status", (req, res) => {
  console.log("📊 MCP Status requested");
  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    data: mockData,
  });
});

// MCP Chat endpoint
app.post("/api/chat", (req, res) => {
  const { message, room, userId } = req.body;
  console.log(`💬 MCP Chat: "${message}" from ${userId} in ${room}`);

  const responses = [
    `🚀 MCP mottok din melding: "${message}"`,
    "✅ SnakkaZ MCP Chat er aktiv!",
    "🔐 Melding kryptert og videresendt",
    "🌊 Liquid Dream MCP fungerer perfekt!",
    "📡 Real-time MCP kommunikasjon etablert",
  ];

  const randomResponse =
    responses[Math.floor(Math.random() * responses.length)];

  res.json({
    success: true,
    response: randomResponse,
    timestamp: new Date().toISOString(),
    originalMessage: message,
    room,
    userId,
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    service: "SnakkaZ Emergency MCP Test Server",
    status: "🚀 ACTIVE",
    endpoints: {
      status: "/api/status",
      chat: "/api/chat (POST)",
      health: "/health",
    },
    timestamp: new Date().toISOString(),
    version: "1.0.0-beta",
    design: "🌊 Liquid Glass Theme",
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "Emergency MCP Test Server",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`✅ Emergency MCP Test Server running on port ${PORT}`);
  console.log(`🌐 Access: http://localhost:${PORT}`);
  console.log(`📊 Status: http://localhost:${PORT}/api/status`);
});
