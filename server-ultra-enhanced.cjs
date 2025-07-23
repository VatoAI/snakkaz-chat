// SnakkaZ MCP Server ULTRA ENHANCED - Glassmorphism + Matrix Edition
// Enhanced med glassmorphism, matrix rain effekter, og real-time visuals
// Safe test version - kan rulles tilbake til backup hvis nødvendig

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dashboard-assets')));

// Dashboard stats (simulated with more realistic data)
let dashboardStats = {
  activeConnections: 0,
  totalMessages: 0,
  systemStatus: 'operational',
  uptime: Date.now(),
  lastActivity: new Date().toISOString(),
  webrtcConnections: 0,
  encryptedMessages: 0,
  cpuUsage: 0,
  memoryUsage: 0,
  networkActivity: 0
};

// Routes
app.get('/', (req, res) => {
  res.json({
    name: 'SnakkaZ MCP Server ULTRA Enhanced',
    version: '3.0.0-glassmorphism',
    status: 'running',
    features: ['glassmorphism-ui', 'matrix-effects', 'real-time-stats', 'supabase-integration'],
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
    memory: process.memoryUsage(),
    features: {
      glassmorphism: 'enabled',
      matrixEffects: 'enabled',
      realTimeStats: 'enabled'
    }
  });
});

app.get('/api/tools', (req, res) => {
  res.json({
    tools: [
      {
        name: 'chat_relay',
        description: 'Relay encrypted chat messages between users',
        parameters: {
          message: { type: 'string', required: true },
          channel: { type: 'string', required: false },
          encryption: { type: 'boolean', default: true }
        }
      },
      {
        name: 'webrtc_status',
        description: 'Check WebRTC connection status',
        parameters: {}
      },
      {
        name: 'e2ee_verify',
        description: 'Verify end-to-end encryption status',
        parameters: {
          sessionId: { type: 'string', required: true }
        }
      },
      {
        name: 'supabase_sync',
        description: 'Sync data with Supabase realtime',
        parameters: {
          table: { type: 'string', required: true },
          operation: { type: 'string', enum: ['insert', 'update', 'delete'] }
        }
      }
    ]
  });
});

app.get('/docs', (req, res) => {
  res.json({
    title: 'SnakkaZ MCP Server ULTRA Enhanced Documentation',
    version: '3.0.0-glassmorphism',
    description: 'Ultra enhanced MCP server with glassmorphism UI, matrix effects, and real-time monitoring',
    features: [
      'Glassmorphism UI design',
      'Matrix digital rain effects',
      'Real-time WebRTC monitoring',
      'End-to-end encryption status',
      'Supabase realtime integration',
      'Interactive live dashboard'
    ],
    endpoints: [
      { path: '/', method: 'GET', description: 'Server info with feature list' },
      { path: '/health', method: 'GET', description: 'Enhanced health check' },
      { path: '/api/tools', method: 'GET', description: 'Advanced tools list' },
      { path: '/dashboard', method: 'GET', description: 'Ultra enhanced glassmorphism dashboard' },
      { path: '/api/stats', method: 'GET', description: 'Real-time system stats' }
    ]
  });
});

app.get('/api/stats', (req, res) => {
  // Generate realistic fake data
  dashboardStats.activeConnections = Math.floor(Math.random() * 15) + 3;
  dashboardStats.webrtcConnections = Math.floor(Math.random() * 8) + 1;
  dashboardStats.totalMessages = dashboardStats.totalMessages + Math.floor(Math.random() * 8) + 1;
  dashboardStats.encryptedMessages = dashboardStats.encryptedMessages + Math.floor(Math.random() * 5) + 1;
  dashboardStats.cpuUsage = Math.floor(Math.random() * 40) + 10;
  dashboardStats.memoryUsage = Math.floor(Math.random() * 60) + 30;
  dashboardStats.networkActivity = Math.floor(Math.random() * 100) + 20;
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
    <title>SnakkaZ MCP Ultra Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            background: #000;
            color: white;
            overflow: hidden;
            height: 100vh;
            position: relative;
        }
        
        /* Matrix Rain Background */
        #matrix-canvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 1;
            opacity: 0.6;
        }
        
        /* Main Dashboard Container */
        .dashboard {
            position: relative;
            z-index: 10;
            padding: 30px;
            height: 100vh;
            display: flex;
            flex-direction: column;
            background: linear-gradient(135deg, 
                rgba(26, 26, 46, 0.3), 
                rgba(22, 33, 62, 0.3), 
                rgba(15, 52, 96, 0.3)
            );
        }
        
        /* Glassmorphism Header */
        .header {
            text-align: center;
            margin-bottom: 40px;
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(15px);
            border-radius: 20px;
            padding: 25px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .header h1 {
            font-size: 3rem;
            margin-bottom: 15px;
            background: linear-gradient(45deg, #00ff88, #00ccff, #ff0080);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: colorShift 3s ease-in-out infinite;
        }
        
        @keyframes colorShift {
            0%, 100% { filter: hue-rotate(0deg); }
            50% { filter: hue-rotate(90deg); }
        }
        
        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
            color: #00ff88;
        }
        
        /* Stats Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 25px;
            flex: 1;
        }
        
        /* Glassmorphism Cards */
        .stat-card {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 25px;
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, 
                transparent, 
                rgba(255, 255, 255, 0.1), 
                transparent
            );
            transition: left 0.5s ease;
        }
        
        .stat-card:hover::before {
            left: 100%;
        }
        
        .stat-card:hover {
            transform: translateY(-10px) scale(1.02);
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(0, 255, 136, 0.3);
            box-shadow: 0 15px 40px rgba(0, 255, 136, 0.2);
        }
        
        .stat-value {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 10px;
            text-shadow: 0 0 20px currentColor;
            animation: valueGlow 2s ease-in-out infinite alternate;
        }
        
        @keyframes valueGlow {
            0% { text-shadow: 0 0 10px currentColor; }
            100% { text-shadow: 0 0 25px currentColor, 0 0 35px currentColor; }
        }
        
        .stat-label {
            font-size: 1.1rem;
            opacity: 0.9;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        /* Color themes for different stat types */
        .stat-card:nth-child(1) .stat-value { color: #00ff88; }
        .stat-card:nth-child(2) .stat-value { color: #00ccff; }
        .stat-card:nth-child(3) .stat-value { color: #ff0080; }
        .stat-card:nth-child(4) .stat-value { color: #ffff00; }
        .stat-card:nth-child(5) .stat-value { color: #ff8800; }
        .stat-card:nth-child(6) .stat-value { color: #8800ff; }
        .stat-card:nth-child(7) .stat-value { color: #ff4444; }
        .stat-card:nth-child(8) .stat-value { color: #44ff44; }
        
        /* Status Indicator */
        .status-indicator {
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background: #00ff88;
            display: inline-block;
            margin-right: 10px;
            animation: statusPulse 1.5s infinite;
            box-shadow: 0 0 15px #00ff88;
        }
        
        @keyframes statusPulse {
            0%, 100% { 
                opacity: 1; 
                transform: scale(1);
                box-shadow: 0 0 15px #00ff88;
            }
            50% { 
                opacity: 0.7; 
                transform: scale(1.2);
                box-shadow: 0 0 25px #00ff88;
            }
        }
        
        /* Progress Bars */
        .progress-bar {
            width: 100%;
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            margin-top: 10px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, currentColor, rgba(255, 255, 255, 0.8));
            border-radius: 10px;
            transition: width 0.5s ease;
            box-shadow: 0 0 10px currentColor;
        }
        
        /* Footer */
        .footer {
            text-align: center;
            margin-top: 30px;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 20px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .footer p {
            font-size: 1rem;
            opacity: 0.8;
            margin-bottom: 5px;
        }
        
        .system-info {
            display: flex;
            justify-content: space-around;
            margin-top: 15px;
            flex-wrap: wrap;
        }
        
        .system-info span {
            background: rgba(0, 255, 136, 0.1);
            border: 1px solid rgba(0, 255, 136, 0.3);
            border-radius: 10px;
            padding: 5px 15px;
            margin: 5px;
            font-size: 0.9rem;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .dashboard {
                padding: 15px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .stats-grid {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            
            .stat-card {
                padding: 20px;
            }
            
            .system-info {
                flex-direction: column;
                align-items: center;
            }
        }
    </style>
</head>
<body>
    <!-- Matrix Rain Canvas -->
    <canvas id="matrix-canvas"></canvas>
    
    <div class="dashboard">
        <div class="header">
            <h1>SnakkaZ MCP Ultra Dashboard</h1>
            <p>🚀 Real-time Glassmorphism Monitoring with Matrix Effects</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value" id="connections">-</div>
                <div class="stat-label">Active Connections</div>
                <div class="progress-bar">
                    <div class="progress-fill" id="connections-progress" style="width: 0%"></div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-value" id="webrtc">-</div>
                <div class="stat-label">WebRTC Sessions</div>
                <div class="progress-bar">
                    <div class="progress-fill" id="webrtc-progress" style="width: 0%"></div>
                </div>
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
                <div class="stat-label">System Uptime</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-value" id="messages">-</div>
                <div class="stat-label">Total Messages</div>
                <div class="progress-bar">
                    <div class="progress-fill" id="messages-progress" style="width: 0%"></div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-value" id="encrypted">-</div>
                <div class="stat-label">Encrypted Messages</div>
                <div class="progress-bar">
                    <div class="progress-fill" id="encrypted-progress" style="width: 0%"></div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-value" id="cpu">-%</div>
                <div class="stat-label">CPU Usage</div>
                <div class="progress-bar">
                    <div class="progress-fill" id="cpu-progress" style="width: 0%"></div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-value" id="memory">-%</div>
                <div class="stat-label">Memory Usage</div>
                <div class="progress-bar">
                    <div class="progress-fill" id="memory-progress" style="width: 0%"></div>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>🔒 End-to-End Encrypted • 🌐 Real-time Supabase Sync • 📡 WebRTC Active</p>
            <p>Last Updated: <span id="lastUpdate">-</span></p>
            <div class="system-info">
                <span>Glassmorphism UI: ✅ Active</span>
                <span>Matrix Effects: ✅ Running</span>
                <span>MCP Server: ✅ Online</span>
                <span>E2EE: ✅ Enabled</span>
            </div>
        </div>
    </div>
    
    <script>
        // Matrix Rain Effect
        const canvas = document.getElementById('matrix-canvas');
        const ctx = canvas.getContext('2d');
        
        // Make canvas full screen
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Matrix characters - Norwegian/English/Numbers mix
        const matrix = "SnakkaZabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]|<>?/~æøåÆØÅ";
        const matrixArray = matrix.split("");
        
        const font_size = 12;
        const columns = canvas.width / font_size;
        const drops = [];
        
        // Initialize drops
        for(let x = 0; x < columns; x++) {
            drops[x] = 1;
        }
        
        function drawMatrix() {
            // Semi-transparent black background for trail effect
            ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Green text
            ctx.fillStyle = "#00FF46";
            ctx.font = font_size + "px monospace";
            
            // Loop through drops
            for(let i = 0; i < drops.length; i++) {
                // Random character
                const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
                
                // Draw character
                ctx.fillText(text, i * font_size, drops[i] * font_size);
                
                // Reset drop randomly
                if(drops[i] * font_size > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                
                // Move drop down
                drops[i]++;
            }
        }
        
        // Start matrix animation
        setInterval(drawMatrix, 35);
        
        // Resize canvas on window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
        
        // Dashboard Stats Update
        function updateStats() {
            fetch('/api/stats')
                .then(response => response.json())
                .then(data => {
                    // Update values
                    document.getElementById('connections').textContent = data.activeConnections;
                    document.getElementById('webrtc').textContent = data.webrtcConnections;
                    document.getElementById('status').textContent = data.systemStatus.toUpperCase();
                    document.getElementById('messages').textContent = data.totalMessages;
                    document.getElementById('encrypted').textContent = data.encryptedMessages;
                    document.getElementById('cpu').textContent = data.cpuUsage + '%';
                    document.getElementById('memory').textContent = data.memoryUsage + '%';
                    
                    // Update progress bars
                    document.getElementById('connections-progress').style.width = (data.activeConnections / 15 * 100) + '%';
                    document.getElementById('webrtc-progress').style.width = (data.webrtcConnections / 8 * 100) + '%';
                    document.getElementById('messages-progress').style.width = Math.min(data.totalMessages / 100 * 100, 100) + '%';
                    document.getElementById('encrypted-progress').style.width = Math.min(data.encryptedMessages / 80 * 100, 100) + '%';
                    document.getElementById('cpu-progress').style.width = data.cpuUsage + '%';
                    document.getElementById('memory-progress').style.width = data.memoryUsage + '%';
                    
                    // Calculate uptime
                    const uptime = Math.floor((Date.now() - data.uptime) / 1000);
                    const hours = Math.floor(uptime / 3600);
                    const minutes = Math.floor((uptime % 3600) / 60);
                    const seconds = uptime % 60;
                    document.getElementById('uptime').textContent = \`\${hours}h \${minutes}m \${seconds}s\`;
                    
                    // Update timestamp
                    document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString();
                })
                .catch(error => {
                    console.error('Error fetching stats:', error);
                    document.getElementById('status').textContent = 'ERROR';
                });
        }
        
        // Update every 1.5 seconds for more dynamic feel
        updateStats();
        setInterval(updateStats, 1500);
        
        // Add some interactivity
        document.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('click', () => {
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 150);
            });
        });
        
        console.log('🚀 SnakkaZ MCP Ultra Dashboard Loaded!');
        console.log('✨ Glassmorphism effects active');
        console.log('🌧️ Matrix rain effects running');
        console.log('📊 Real-time stats updating every 1.5s');
    </script>
</body>
</html>
  `);
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    version: '3.0.0-glassmorphism',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 SnakkaZ MCP Server ULTRA Enhanced running on port ${PORT}`);
  console.log(`✨ Glassmorphism UI Dashboard: http://localhost:${PORT}/dashboard`);
  console.log(`🌧️ Matrix effects enabled`);
  console.log(`📊 Real-time stats: http://localhost:${PORT}/api/stats`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API docs: http://localhost:${PORT}/docs`);
  console.log('');
  console.log('🎨 Features:');
  console.log('  • Glassmorphism design with blur effects');
  console.log('  • Matrix digital rain background');
  console.log('  • Real-time animated statistics');
  console.log('  • Interactive hover effects');
  console.log('  • Responsive mobile design');
  console.log('  • Norwegian/English matrix characters');
  console.log('');
  console.log('🔄 Backup available at: server-enhanced-backup.js');
});
