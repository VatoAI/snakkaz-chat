/**
 * MCP Admin Backend Server
 * 
 * Express.js server with Socket.IO for real-time updates
 * Handles authentication, user management, and system monitoring
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('rate-limiter-flexible');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const winston = require('winston');
require('dotenv').config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["https://mcp.snakkaz.com", "https://snakkaz.com"],
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console()
  ]
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: ["https://mcp.snakkaz.com", "https://snakkaz.com"],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const rateLimiter = new rateLimit.RateLimiterMemory({
  keyGenerator: (req) => req.ip,
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
});

// Rate limiting middleware
app.use(async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (rejRes) {
    res.status(429).json({
      success: false,
      error: 'Too many requests',
      message: 'Rate limit exceeded'
    });
  }
});

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SnakkazMCP2025Secret');
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Token verification failed:', error);
    return res.status(403).json({
      success: false,
      error: 'Invalid token'
    });
  }
};

// Demo data storage (replace with actual database)
const demoUsers = [
  {
    id: 'admin-1',
    username: 'admin',
    password: '$2a$10$W9.NwaP.cAw/h5CbD2wliuQCO8PhPM3K5gNQ5cyya86ZnyFbzboam', // password: SnakkazMCP2025!
    role: 'super_admin',
    permissions: ['all'],
    lastLogin: new Date(),
    twoFactorEnabled: false, // Disabled for demo
    twoFactorSecret: speakeasy.generateSecret({
      name: 'Snakkaz MCP',
      issuer: 'Snakkaz'
    }).base32
  }
];

const demoMetrics = {
  users: {
    total: 1247,
    active: 892,
    new: 47
  },
  chats: {
    total: 15682,
    active: 324,
    messagesPerDay: 8943
  },
  system: {
    uptime: 99.8,
    memory: 67.2,
    cpu: 34.5,
    errors: 3
  },
  email: {
    sent: 2341,
    delivered: 2287,
    failed: 54,
    openRate: 68.4
  }
};

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'MCP Admin API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password, twoFactorCode } = req.body;

    // Find user
    const user = demoUsers.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check 2FA if enabled
    if (user.twoFactorEnabled) {
      if (!twoFactorCode) {
        return res.status(200).json({
          success: false,
          requiresTwoFactor: true,
          message: 'Two-factor authentication required'
        });
      }

      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: twoFactorCode,
        window: 1
      });

      if (!verified) {
        return res.status(401).json({
          success: false,
          error: 'Invalid two-factor code'
        });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'SnakkazMCP2025Secret',
      { expiresIn: '8h' }
    );

    // Update last login
    user.lastLogin = new Date();

    logger.info(`User ${username} logged in successfully`);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          permissions: user.permissions,
          lastLogin: user.lastLogin,
          twoFactorEnabled: user.twoFactorEnabled
        },
        token,
        expiresIn: '8h'
      }
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// System metrics endpoint
app.get('/api/metrics', authenticateToken, (req, res) => {
  try {
    // Add some variation to make it feel live
    const liveMetrics = {
      ...demoMetrics,
      users: {
        ...demoMetrics.users,
        active: demoMetrics.users.active + Math.floor(Math.random() * 10) - 5
      },
      chats: {
        ...demoMetrics.chats,
        active: demoMetrics.chats.active + Math.floor(Math.random() * 20) - 10
      },
      system: {
        ...demoMetrics.system,
        memory: Math.max(50, Math.min(90, demoMetrics.system.memory + Math.random() * 10 - 5)),
        cpu: Math.max(10, Math.min(80, demoMetrics.system.cpu + Math.random() * 15 - 7))
      }
    };

    res.json({
      success: true,
      data: liveMetrics
    });
  } catch (error) {
    logger.error('Metrics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch metrics'
    });
  }
});

// Users management endpoints
app.get('/api/users', authenticateToken, (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    // Demo user data
    const demoUsersList = Array.from({ length: 50 }, (_, i) => ({
      id: `user-${i + 1}`,
      username: `user${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: i < 5 ? 'admin' : 'user',
      status: Math.random() > 0.2 ? 'active' : 'inactive',
      lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
    }));

    // Filter by search
    const filteredUsers = demoUsersList.filter(user => 
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        users: paginatedUsers,
        pagination: {
          page,
          limit,
          total: filteredUsers.length,
          pages: Math.ceil(filteredUsers.length / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Users fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
});

// Chat management endpoints
app.get('/api/chats', authenticateToken, (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Demo chat data
    const demoChats = Array.from({ length: 100 }, (_, i) => ({
      id: `chat-${i + 1}`,
      title: `Chat session ${i + 1}`,
      participants: Math.floor(Math.random() * 5) + 2,
      messages: Math.floor(Math.random() * 200) + 10,
      status: Math.random() > 0.3 ? 'active' : 'ended',
      startTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      lastActivity: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
    }));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedChats = demoChats.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        chats: paginatedChats,
        pagination: {
          page,
          limit,
          total: demoChats.length,
          pages: Math.ceil(demoChats.length / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Chats fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch chats'
    });
  }
});

// Email management endpoints
app.get('/api/emails', authenticateToken, (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Demo email data
    const demoEmails = Array.from({ length: 50 }, (_, i) => ({
      id: `email-${i + 1}`,
      subject: `Email ${i + 1}: Important notification`,
      recipient: `user${i + 1}@example.com`,
      status: ['sent', 'delivered', 'opened', 'failed'][Math.floor(Math.random() * 4)],
      type: ['welcome', 'notification', 'marketing', 'support'][Math.floor(Math.random() * 4)],
      sentAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      openedAt: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 29 * 24 * 60 * 60 * 1000) : null
    }));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEmails = demoEmails.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        emails: paginatedEmails,
        pagination: {
          page,
          limit,
          total: demoEmails.length,
          pages: Math.ceil(demoEmails.length / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Emails fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch emails'
    });
  }
});

// System alerts endpoint
app.get('/api/alerts', authenticateToken, (req, res) => {
  try {
    const demoAlerts = [
      {
        id: 'alert-1',
        type: 'warning',
        title: 'High CPU usage detected',
        message: 'System CPU usage is at 85%',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        acknowledged: false
      },
      {
        id: 'alert-2',
        type: 'info',
        title: 'New user registration',
        message: '5 new users registered in the last hour',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        acknowledged: false
      },
      {
        id: 'alert-3',
        type: 'error',
        title: 'Email delivery failed',
        message: '3 emails failed to deliver',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        acknowledged: true
      }
    ];

    res.json({
      success: true,
      data: demoAlerts
    });
  } catch (error) {
    logger.error('Alerts fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch alerts'
    });
  }
});

// Socket.IO real-time updates
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  // Join admin room
  socket.join('admin');

  // Send real-time metrics every 5 seconds
  const metricsInterval = setInterval(() => {
    const liveMetrics = {
      ...demoMetrics,
      users: {
        ...demoMetrics.users,
        active: demoMetrics.users.active + Math.floor(Math.random() * 10) - 5
      },
      chats: {
        ...demoMetrics.chats,
        active: demoMetrics.chats.active + Math.floor(Math.random() * 20) - 10
      },
      system: {
        ...demoMetrics.system,
        memory: Math.max(50, Math.min(90, demoMetrics.system.memory + Math.random() * 10 - 5)),
        cpu: Math.max(10, Math.min(80, demoMetrics.system.cpu + Math.random() * 15 - 7))
      }
    };

    socket.emit('metrics-update', liveMetrics);
  }, 5000);

  // Send random alerts
  const alertsInterval = setInterval(() => {
    if (Math.random() < 0.1) { // 10% chance of alert
      const alertTypes = ['info', 'warning', 'error'];
      const alertMessages = [
        'New user registered',
        'High system load detected',
        'Email delivery issue',
        'Chat session started',
        'System backup completed'
      ];

      const alert = {
        id: `alert-${Date.now()}`,
        type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
        title: alertMessages[Math.floor(Math.random() * alertMessages.length)],
        message: 'System notification',
        timestamp: new Date(),
        acknowledged: false
      };

      socket.emit('new-alert', alert);
    }
  }, 10000);

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
    clearInterval(metricsInterval);
    clearInterval(alertsInterval);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  logger.info(`MCP Admin Backend running on port ${PORT}`);
  console.log(`🚀 MCP Admin Backend API ready at http://localhost:${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
