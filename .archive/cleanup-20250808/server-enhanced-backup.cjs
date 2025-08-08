// BACKUP av server-enhanced.js før ultra visual upgrade
// Skapt: 2025-01-28
// Dette er en sikker backup før vi implementerer glassmorphism + matrix effekter

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dashboard-assets')));

// Dashboard stats (simulated)
let dashboardStats = {
  activeConnections: 0,
  totalMessages: 0,
  systemStatus: 'operational',
  uptime: Date.now(),
  lastActivity: new Date().toISOString()
};

// Routes
app.get('/', (req, res) => {
  res.json({
    name: 'SnakkaZ MCP Server Enhanced',
    version: '2.0.0',
    status: 'running',
    endpoints: {
      dashboard: '/dashboard',
      health: '/health',
      api: '/api/tools',
      docs: '/docs',
      stats: '/api/stats'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

app.get('/api/tools', (req, res) => {
  res.json({
    tools: [
      {
        name: 'chat_relay',
        description: 'Relay chat messages between users',
        parameters: {
          message: { type: 'string', required: true },
          channel: { type: 'string', required: false }
        }
      },
      {
        name: 'status_check',
        description: 'Check system status',
        parameters: {}
      }
    ]
  });
});

app.get('/docs', (req, res) => {
  res.json({
    title: 'SnakkaZ MCP Server Documentation',
    version: '2.0.0',
    description: 'Enhanced MCP server with real-time dashboard',
    endpoints: [
      { path: '/', method: 'GET', description: 'Server info' },
      { path: '/health', method: 'GET', description: 'Health check' },
      { path: '/api/tools', method: 'GET', description: 'Available tools' },
      { path: '/dashboard', method: 'GET', description: 'Live dashboard' },
      { path: '/api/stats', method: 'GET', description: 'Real-time stats' }
    ]
  });
});

app.get('/api/stats', (req, res) => {
  // Update stats
  dashboardStats.activeConnections = Math.floor(Math.random() * 10) + 1;
  dashboardStats.totalMessages = dashboardStats.totalMessages + Math.floor(Math.random() * 5);
  dashboardStats.lastActivity = new Date().toISOString();
  
  res.json(dashboardStats);
});

app.get('/dashboard', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SnakkaZ MCP Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
            color: white;
            overflow: hidden;
            height: 100vh;
        }
        
        .dashboard {
            padding: 20px;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            background: linear-gradient(45deg, #00ff88, #00ccff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            flex: 1;
        }
        
        .stat-card {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: transform 0.3s ease;
        }
        
        .stat-card:hover {
            transform: translateY(-5px);
        }
        
        .stat-value {
            font-size: 2rem;
            font-weight: bold;
            color: #00ff88;
            margin-bottom: 5px;
        }
        
        .stat-label {
            font-size: 1rem;
            opacity: 0.8;
        }
        
        .status-indicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #00ff88;
            display: inline-block;
            margin-right: 8px;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 0.9rem;
            opacity: 0.7;
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="header">
            <h1>SnakkaZ MCP Dashboard</h1>
            <p>Real-time System Monitoring</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value" id="connections">-</div>
                <div class="stat-label">Active Connections</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-value" id="messages">-</div>
                <div class="stat-label">Total Messages</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-value">
                    <span class="status-indicator"></span>
                    <span id="status">-</span>
                </div>
                <div class="stat-label">System Status</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-value" id="uptime">-</div>
                <div class="stat-label">Uptime</div>
            </div>
        </div>
        
        <div class="footer">
            <p>Last Updated: <span id="lastUpdate">-</span></p>
        </div>
    </div>
    
    <script>
        function updateStats() {
            fetch('/api/stats')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('connections').textContent = data.activeConnections;
                    document.getElementById('messages').textContent = data.totalMessages;
                    document.getElementById('status').textContent = data.systemStatus;
                    
                    const uptime = Math.floor((Date.now() - data.uptime) / 1000);
                    const hours = Math.floor(uptime / 3600);
                    const minutes = Math.floor((uptime % 3600) / 60);
                    document.getElementById('uptime').textContent = \`\${hours}h \${minutes}m\`;
                    
                    document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString();
                })
                .catch(error => {
                    console.error('Error fetching stats:', error);
                });
        }
        
        // Update every 2 seconds
        updateStats();
        setInterval(updateStats, 2000);
    </script>
</body>
</html>
  `);
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 SnakkaZ MCP Server Enhanced running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
});
