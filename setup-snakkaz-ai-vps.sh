#!/bin/bash

# 🌊 SnakkaZ AI VPS Server Setup Script
# Deploy AI models på external VPS for SnakkaZ

set -e

echo "🌊 ======================================================
       SnakkaZ AI VPS Server Setup
       Setting up Norwegian AI models on VPS
======================================================="

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Check if running as root or with sudo
if [[ $EUID -eq 0 ]]; then
   log_warning "Running as root. This is generally not recommended for production."
fi

# System info
log_info "Checking system specifications..."
echo "OS: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'=' -f2 | tr -d '\"')"
echo "RAM: $(free -h | awk '/^Mem:/ {print $2}')"
echo "CPU: $(nproc) cores"
echo "Disk: $(df -h / | awk 'NR==2 {print $4}') available"

# Check minimum requirements
TOTAL_RAM=$(free -m | awk '/^Mem:/ {print $2}')
if [ "$TOTAL_RAM" -lt 7000 ]; then
    log_error "Insufficient RAM: ${TOTAL_RAM}MB. Minimum 8GB required for AI models."
    log_warning "Continue anyway? (y/N)"
    read -r continue_setup
    if [[ ! "$continue_setup" =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Update system
log_info "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages
log_info "Installing essential packages..."
sudo apt install -y curl wget git nginx nodejs npm ufw htop

# Configure firewall
log_info "Configuring firewall..."
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3001  # AI API port
sudo ufw allow 11434 # Ollama port

# Install Ollama
log_info "Installing Ollama..."
if ! command -v ollama &> /dev/null; then
    curl -fsSL https://ollama.com/install.sh | sh
    log_success "Ollama installed!"
else
    log_success "Ollama already installed"
fi

# Start Ollama service
log_info "Starting Ollama service..."
sudo systemctl enable ollama || true
sudo systemctl start ollama

# Wait for Ollama to start
log_info "Waiting for Ollama to start..."
sleep 5

# Check Ollama status
if curl -f http://localhost:11434/api/tags >/dev/null 2>&1; then
    log_success "Ollama is running!"
else
    log_error "Ollama failed to start"
    exit 1
fi

# Install AI models for Norwegian support
log_info "Installing SnakkaZ AI models..."

# Essential Norwegian chat model
log_info "📥 Installing Llama 3.2 3B (Norwegian chat)..."
if ollama pull llama3.2:3b; then
    log_success "Llama 3.2 3B installed!"
else
    log_error "Failed to install Llama 3.2 3B"
fi

# Embeddings for search
log_info "📥 Installing Nomic Embed Text (search)..."
if ollama pull nomic-embed-text; then
    log_success "Nomic Embed Text installed!"
else
    log_error "Failed to install Nomic Embed Text"
fi

# Optional: Code assistance
read -p "🤔 Install CodeLlama 7B for code assistance? (y/N): " install_code
if [[ "$install_code" =~ ^[Yy]$ ]]; then
    log_info "📥 Installing CodeLlama 7B..."
    if ollama pull codellama:7b; then
        log_success "CodeLlama 7B installed!"
    else
        log_warning "Failed to install CodeLlama 7B"
    fi
fi

# Create SnakkaZ AI API server
log_info "Setting up SnakkaZ AI API server..."

# Create project directory
sudo mkdir -p /opt/snakkaz-ai
sudo chown $(whoami):$(whoami) /opt/snakkaz-ai
cd /opt/snakkaz-ai

# Create package.json
cat > package.json << 'EOF'
{
  "name": "snakkaz-ai-server",
  "version": "1.0.0",
  "description": "SnakkaZ AI API Server for Norwegian chat",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5"
  }
}
EOF

# Install dependencies
npm install

# Create AI server
cat > server.js << 'EOF'
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [
    'https://snakkaz.com',
    'https://www.snakkaz.com',
    'http://localhost:4000',  // Development
    'http://localhost:3000'   // Development
  ]
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'SnakkaZ AI Server',
    timestamp: new Date().toISOString(),
    models: 'ollama'
  });
});

// Norwegian AI chat endpoint
app.post('/api/chat/norwegian', async (req, res) => {
  try {
    const { message, model = 'llama3.2:3b' } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Call Ollama API
    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: message,
        system: `Du er SnakkaZ AI, en norsk chat-assistent. 
Du skal alltid svare på norsk, være hjelpsom og vennlig. 
Du forstår norsk kultur og kan ha naturlige samtaler på norsk.
Bruk moderne norsk språk og vær personlig i kommunikasjonen.`,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          num_ctx: 4096
        }
      })
    });

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama API error: ${ollamaResponse.status}`);
    }

    const data = await ollamaResponse.json();
    
    res.json({
      response: data.response,
      model,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'AI service temporarily unavailable',
      details: error.message 
    });
  }
});

// Code generation endpoint
app.post('/api/code/generate', async (req, res) => {
  try {
    const { prompt, language = 'typescript', model = 'codellama:7b' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const systemPrompt = `You are a skilled ${language} developer. 
Generate clean, well-documented code following best practices.
Include comments in Norwegian when appropriate.
Focus on TypeScript/React patterns for SnakkaZ chat application.`;

    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        system: systemPrompt,
        stream: false,
        options: {
          temperature: 0.3,
          top_p: 0.8,
          num_ctx: 8192
        }
      })
    });

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama API error: ${ollamaResponse.status}`);
    }

    const data = await ollamaResponse.json();
    
    res.json({
      code: data.response,
      language,
      model,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Code generation error:', error);
    res.status(500).json({ 
      error: 'Code generation service temporarily unavailable',
      details: error.message 
    });
  }
});

// List available models
app.get('/api/models', async (req, res) => {
  try {
    const ollamaResponse = await fetch('http://localhost:11434/api/tags');
    
    if (!ollamaResponse.ok) {
      throw new Error(`Ollama API error: ${ollamaResponse.status}`);
    }

    const data = await ollamaResponse.json();
    res.json({
      models: data.models || [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Models list error:', error);
    res.status(500).json({ 
      error: 'Unable to list models',
      details: error.message 
    });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌊 SnakkaZ AI Server running on port ${PORT}`);
  console.log(`🤖 Norwegian AI chat: POST /api/chat/norwegian`);
  console.log(`💻 Code generation: POST /api/code/generate`);
  console.log(`📋 Health check: GET /api/health`);
});
EOF

# Create systemd service
log_info "Creating systemd service..."
sudo tee /etc/systemd/system/snakkaz-ai.service > /dev/null << 'EOF'
[Unit]
Description=SnakkaZ AI Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/snakkaz-ai
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3001

[Install]
WantedBy=multi-user.target
EOF

# Set permissions
sudo chown -R www-data:www-data /opt/snakkaz-ai

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable snakkaz-ai
sudo systemctl start snakkaz-ai

# Wait for service to start
sleep 3

# Check service status
if sudo systemctl is-active --quiet snakkaz-ai; then
    log_success "SnakkaZ AI service is running!"
else
    log_error "SnakkaZ AI service failed to start"
    sudo systemctl status snakkaz-ai
fi

# Configure Nginx reverse proxy
log_info "Configuring Nginx reverse proxy..."

# Check if domain was provided
read -p "🌐 Enter your domain for AI server (e.g., ai.snakkaz.com): " AI_DOMAIN
if [[ -z "$AI_DOMAIN" ]]; then
    AI_DOMAIN="localhost"
    log_warning "No domain provided. Using localhost for testing."
fi

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/snakkaz-ai > /dev/null << EOF
server {
    listen 80;
    server_name ${AI_DOMAIN};
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # API endpoints
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    # Direct Ollama access (optional, for debugging)
    location /ollama/ {
        proxy_pass http://localhost:11434/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Health check
    location /health {
        return 200 'SnakkaZ AI Server OK';
        add_header Content-Type text/plain;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/snakkaz-ai /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Install SSL certificate if domain is not localhost
if [[ "$AI_DOMAIN" != "localhost" ]]; then
    log_info "Installing SSL certificate..."
    sudo apt install -y certbot python3-certbot-nginx
    
    log_warning "Setting up SSL certificate for ${AI_DOMAIN}"
    log_info "Make sure your domain points to this server's IP address!"
    read -p "Continue with SSL setup? (y/N): " setup_ssl
    
    if [[ "$setup_ssl" =~ ^[Yy]$ ]]; then
        sudo certbot --nginx -d "$AI_DOMAIN" --non-interactive --agree-tos --email admin@snakkaz.com || true
    fi
fi

# Test the API
log_info "Testing SnakkaZ AI API..."
sleep 2

# Health check
if curl -f http://localhost:3001/api/health >/dev/null 2>&1; then
    log_success "API health check passed!"
else
    log_warning "API health check failed. Check service status."
fi

# Test Norwegian chat
log_info "Testing Norwegian AI chat..."
TEST_RESPONSE=$(curl -s -X POST http://localhost:3001/api/chat/norwegian \
  -H "Content-Type: application/json" \
  -d '{"message":"Hei! Kan du hjelpe meg?"}' | grep -o '"response":"[^"]*"' | cut -d'"' -f4)

if [[ -n "$TEST_RESPONSE" ]]; then
    log_success "Norwegian AI chat is working!"
    echo "🤖 AI Response: $TEST_RESPONSE"
else
    log_warning "Norwegian AI chat test failed. Check Ollama status."
fi

# Display final information
echo
echo "🌊 ================================================="
log_success "SnakkaZ AI VPS Server Setup Complete!"
echo "================================================="
echo
echo "📊 Installed Services:"
echo "   • Ollama AI Engine: http://localhost:11434"
echo "   • SnakkaZ AI API: http://localhost:3001"
echo "   • Nginx Reverse Proxy: http://${AI_DOMAIN}"
echo
echo "🤖 Installed Models:"
ollama list
echo
echo "🔧 API Endpoints:"
echo "   • Health: GET /api/health"
echo "   • Norwegian Chat: POST /api/chat/norwegian"
echo "   • Code Generation: POST /api/code/generate"
echo "   • List Models: GET /api/models"
echo
echo "📋 Management Commands:"
echo "   • Service status: sudo systemctl status snakkaz-ai"
echo "   • View logs: sudo journalctl -u snakkaz-ai -f"
echo "   • Restart service: sudo systemctl restart snakkaz-ai"
echo "   • List AI models: ollama list"
echo
echo "🌐 Frontend Integration:"
echo "   Update your SnakkaZ .env.local:"
echo "   VITE_AI_SERVER_URL=https://${AI_DOMAIN}"
echo
log_success "SnakkaZ AI is ready for Norwegian conversations! 🇳🇴🤖"
