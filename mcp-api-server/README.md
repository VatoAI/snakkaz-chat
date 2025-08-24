# SnakkaZ MCP API Server

## 🚀 Setup Instructions for mcp.snakkaz.com

### 1. Upload to Server

```bash
# Upload files to server
scp -r mcp-api-server/ user@mcp.snakkaz.com:/var/www/mcp-api/
```

### 2. Install Dependencies

```bash
cd /var/www/mcp-api/
npm install
```

### 3. Start with PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start the API server
pm2 start server.js --name snakkaz-mcp-api

# Save PM2 configuration
pm2 save
pm2 startup
```

### 4. Nginx Configuration

Create `/etc/nginx/sites-available/mcp.snakkaz.com`:

```nginx
server {
    listen 80;
    server_name mcp.snakkaz.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name mcp.snakkaz.com;

    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;

    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        return 404;
    }
}
```

### 5. API Endpoints

#### Health Check

```
GET https://mcp.snakkaz.com/api/health
```

#### Beta Signup

```
POST https://mcp.snakkaz.com/api/beta-signup
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Tech Corp",
    "timestamp": "2025-08-19T21:00:00.000Z",
    "source": "snakkaz.com-landing",
    "type": "prototype-beta-signup"
}
```

#### Stats (Protected)

```
GET https://mcp.snakkaz.com/api/stats
X-API-Key: snakkaz-admin-2025
```

#### Export Data (Protected)

```
GET https://mcp.snakkaz.com/api/export
X-API-Key: snakkaz-admin-2025
```

### 6. Environment Variables (Optional)

Create `.env` file:

```
PORT=3000
ADMIN_API_KEY=your-secure-admin-key-here
NODE_ENV=production
```

### 7. Test the Setup

```bash
# Test health endpoint
curl https://mcp.snakkaz.com/api/health

# Test signup
curl -X POST https://mcp.snakkaz.com/api/beta-signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'
```

## 📊 Data Storage

- Beta signups stored in `beta-signups.json`
- Automatic backup recommended
- In production, consider using PostgreSQL or MongoDB

## 🔒 Security Features

- CORS protection
- Input validation
- Rate limiting (can be added with express-rate-limit)
- API key protection for admin endpoints

## 📈 Monitoring

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs snakkaz-mcp-api

# Restart if needed
pm2 restart snakkaz-mcp-api
```
