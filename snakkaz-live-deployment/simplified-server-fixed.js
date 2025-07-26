const express = require('express');
const cors = require('cors');
const { createServer } = require('http');

// Create a simple Express app
const app = express();

// Basic middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

// Serve static files from the current directory
app.use(express.static('.'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check endpoint (alternative path)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    cors: 'enabled',
    server: 'SnakkaZ MCP Server'
  });
});

// Basic chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('💬 Chat request:', message);

    const responses = [
      "That's beautiful! The Glass Liquid design makes everything feel so smooth ✨",
      "Amazing message! Our CloudMCP-inspired interface is perfect for this conversation 🎨",
      "Love how the backdrop filters create that premium Apple-like experience! 💎",
      "The liquid animations really bring this chat to life! 🌊",
      "Glass morphism + premium UX = perfection! Thanks for using SnakkaZ 🚀"
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    res.json({
      response: randomResponse,
      timestamp: new Date().toISOString(),
      processed: true,
      server: 'MCP Glass Liquid Simplified'
    });

  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process chat message'
    });
  }
});

// Add a route to serve the index.html
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: '.' });
});

// Start the server
const PORT = process.env.PORT || 3000;
const server = createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 SnakkaZ Simplified Server running on port ${PORT}`);
  console.log(`🌐 Visit: http://localhost:${PORT} or https://mcp.snakkaz.com`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`🏥 Health check API: http://localhost:${PORT}/api/health`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
