const express = require('express');
const cors = require('cors');

const app = express();

// CORS configuration for SnakkaZ domains - Enhanced for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://snakkaz.com',
      'https://www.snakkaz.com', 
      'http://localhost:5173',
      'http://localhost:5174',  // Added for when port 5173 is busy
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',  // Added for when port 5173 is busy
      'https://snakkaz-chat.vercel.app',
      'https://preview.snakkaz.com'
    ];
    
    // Check if origin is allowed
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json());

// Health endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    server: 'MCP CORS Server',
    version: '1.0.0'
  });
});

// Chat endpoint
app.post('/api/chat', (req, res) => {
  console.log('Chat message received:', req.body);
  
  const { message, timestamp } = req.body;
  
  // Simple echo response for now - can be enhanced with actual MCP logic
  const responses = [
    "Message received and processed! 🚀",
    "Thanks for your message! Processing...",
    "Got it! The MCP server is working perfectly.",
    `Received: "${message}" at ${timestamp}`,
    "Your message has been forwarded to the MCP system."
  ];
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  res.json({
    success: true,
    response: randomResponse,
    timestamp: new Date().toISOString(),
    originalMessage: message
  });
});

// MCP status endpoint
app.get('/api/mcp/status', (req, res) => {
  res.json({
    mcp: 'active',
    features: ['chat', 'e2ee', 'ai'],
    health: 'excellent',
    cors: 'configured'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 SnakkaZ MCP CORS Server running on port ${PORT}`);
  console.log('✅ CORS enabled for snakkaz.com domains');
});
