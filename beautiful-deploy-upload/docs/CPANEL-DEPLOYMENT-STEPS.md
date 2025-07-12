# SNAKKAZ MCP SERVER - CPANEL DEPLOYMENT GUIDE
**Step-by-Step Instructions for Manual Upload via cPanel File Manager**

## Prerequisites ✅
- cPanel File Manager is open (as shown in your screenshot)
- DNS for mcp.snakkaz.com is configured ✅
- Deployment package is ready at `/tmp/mcp-cpanel-deploy` ✅

## Step 1: Upload Files to cPanel

### 1.1 Access the deployment files
The deployment files are located in `/tmp/mcp-cpanel-deploy` with these files:
- `app.py` (14KB) - Main FastAPI application
- `passenger_wsgi.py` (651 bytes) - cPanel Python app entry point
- `.htaccess` (569 bytes) - Web server configuration
- `requirements.txt` (122 bytes) - Python dependencies
- `init_schema.sql` (4.6KB) - Database schema
- `startup.txt` (500 bytes) - Setup instructions

### 1.2 Manual File Upload Steps:
1. **In cPanel File Manager** (which you have open):
   - Navigate to `public_html`
   - Confirm the `mcp.snakkaz.com` folder exists (as shown in your screenshot)
   - Double-click to enter the `mcp.snakkaz.com` folder

2. **Upload the files**:
   - Click "Upload" button in File Manager
   - Select all files from the local deployment package
   - Or use the automated upload script if FTP access is available

## Step 2: Create Python Application in cPanel

### 2.1 Access Python Selector:
1. **In cPanel Dashboard**:
   - Go to "Software" section
   - Click "Python Selector" or "Setup Python App"

### 2.2 Create New Python App:
1. **Application Settings**:
   - **Python Version**: 3.9 or higher
   - **Application Root**: `mcp.snakkaz.com`
   - **Application URL**: `mcp.snakkaz.com`
   - **Application Startup File**: `passenger_wsgi.py`
   - **Application Entry Point**: `app`

2. **Environment Variables** (Add these):
   ```
   DATABASE_URL=postgresql://postgres.your-project.supabase.co:5432/postgres?user=postgres&password=your-password&sslmode=require
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   MCP_MODE=production
   ```

## Step 3: Install Python Dependencies

### 3.1 Access Python App Terminal:
1. In Python Selector, find your app
2. Click "Terminal" or use the command line interface
3. Navigate to your app directory

### 3.2 Install Requirements:
```bash
cd ~/public_html/mcp.snakkaz.com
pip install -r requirements.txt
```

Expected packages to install:
- fastapi
- uvicorn
- psycopg2-binary (or psycopg2)
- python-dotenv

## Step 4: Database Setup

### 4.1 Supabase Configuration:
1. **In Supabase Dashboard**:
   - Go to your project
   - Navigate to SQL Editor
   - Execute the contents of `init_schema.sql`

2. **Verify Tables Created**:
   - Check that `memories` table exists
   - Verify the schema matches your requirements

## Step 5: Test the Deployment

### 5.1 Health Check:
Test the health endpoint:
```bash
curl https://mcp.snakkaz.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-06-29T18:03:18.123456",
  "mode": "production"
}
```

### 5.2 API Endpoints Test:
```bash
# Test memories endpoint
curl https://mcp.snakkaz.com/memories

# Test stats endpoint
curl https://mcp.snakkaz.com/stats
```

## Step 6: Troubleshooting

### 6.1 Common Issues:
1. **500 Internal Server Error**:
   - Check Python app logs in cPanel
   - Verify environment variables are set
   - Ensure all requirements are installed

2. **Database Connection Errors**:
   - Verify Supabase credentials in environment variables
   - Check if database schema is properly initialized
   - Test database connection manually

3. **Import Errors**:
   - Ensure all packages in requirements.txt are installed
   - Check Python version compatibility

### 6.2 Log Locations:
- Python app logs: Available in cPanel Python Selector
- Web server logs: cPanel > Metrics > Error Logs
- Application logs: Check `~/logs/` directory

## Step 7: Production Optimization

### 7.1 Performance Settings:
1. **In .htaccess** (already configured):
   - Passenger settings optimized
   - Proper MIME types set
   - CORS headers configured

2. **Environment Tuning**:
   - Set appropriate worker processes
   - Configure memory limits if needed

### 7.2 Security Verification:
1. **HTTPS**: Ensure SSL is working
2. **CORS**: Verify frontend can access API
3. **Rate Limiting**: Monitor for abuse

## Expected Final Result:
- ✅ https://mcp.snakkaz.com/health returns healthy status
- ✅ https://mcp.snakkaz.com/memories accepts POST requests
- ✅ Frontend can connect to MCP server
- ✅ Database operations work correctly

## Support Files:
All deployment files are ready in `/tmp/mcp-cpanel-deploy/`
- Detailed setup instructions in `startup.txt`
- Database initialization in `init_schema.sql`
- Ready-to-upload Python application

---
**Next Steps**: After successful deployment, update frontend configuration to use the live MCP server and test the full integration.
