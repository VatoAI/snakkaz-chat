const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { execSync } = require('child_process');

/**
 * SnakkaZ Deployment Package Creator
 * Creates separate ZIP files for different deployment targets
 */

console.log('📦 SnakkaZ Deployment Package Creator\n');

// Ensure dist exists
if (!fs.existsSync('dist')) {
  console.log('🔨 Building production version...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed\n');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Create deployments directory
const deploymentsDir = './deployments';
if (!fs.existsSync(deploymentsDir)) {
  fs.mkdirSync(deploymentsDir);
}

async function createZip(name, description, files, options = {}) {
  return new Promise((resolve, reject) => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const zipName = `${name}-${timestamp}.zip`;
    const zipPath = path.join(deploymentsDir, zipName);
    
    console.log(`📦 Creating ${description}...`);
    
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    output.on('close', () => {
      const size = (archive.pointer() / 1024 / 1024).toFixed(2);
      console.log(`   ✅ ${zipName} (${size}MB)\n`);
      resolve(zipPath);
    });

    archive.on('error', (err) => {
      console.error(`   ❌ Error creating ${zipName}:`, err);
      reject(err);
    });

    archive.pipe(output);

    // Add files to archive
    files.forEach(file => {
      if (file.type === 'file') {
        archive.file(file.source, { name: file.dest });
      } else if (file.type === 'directory') {
        archive.directory(file.source, file.dest);
      }
    });

    // Add deployment instructions
    if (options.instructions) {
      archive.append(options.instructions, { name: 'DEPLOYMENT-INSTRUCTIONS.md' });
    }

    archive.finalize();
  });
}

async function main() {
  try {
    
    // 1. Frontend Web App (public_html for snakkaz.com)
    await createZip(
      'snakkaz-webapp',
      'Frontend Web App for public_html',
      [
        { type: 'directory', source: 'dist/', dest: '' },
        { type: 'file', source: '.env.production.template', dest: '.env.production' },
        { type: 'file', source: 'SENTRY-SETUP-GUIDE.md', dest: 'SENTRY-SETUP-GUIDE.md' }
      ],
      {
        instructions: `# SnakkaZ Web App Deployment

## Target: cPanel File Manager > public_html (snakkaz.com/www.snakkaz.com)

### Steps:
1. Extract all files to public_html directory
2. Edit .env.production with your Sentry DSN
3. Ensure file permissions are correct (644 for files, 755 for directories)
4. Test at https://snakkaz.com

### Files included:
- Complete built React application
- Optimized assets (CSS, JS, images)
- PWA manifest and service worker
- Environment configuration template

### Domain Setup:
- Primary: https://snakkaz.com
- WWW: https://www.snakkaz.com (should redirect or serve same content)

### Important:
- Make sure .htaccess is configured for SPA routing
- Enable gzip compression in cPanel
- Set up SSL certificate if not already done`
      }
    );

    // 2. MCP Server (mcp.snakkaz.com)
    await createZip(
      'snakkaz-mcp-server',
      'MCP Server for mcp.snakkaz.com',
      [
        { type: 'directory', source: 'mcp-deployment/', dest: '' },
        { type: 'file', source: '.env.production.template', dest: '.env' }
      ],
      {
        instructions: `# SnakkaZ MCP Server Deployment

## Target: mcp.snakkaz.com root directory

### Steps:
1. Upload all files to mcp.snakkaz.com root directory 
2. Access cPanel Terminal for mcp.snakkaz.com
3. Run: source /home/snakqsqe/nodevenv/mcp.snakkaz.com/19/bin/activate
4. Run: cd /home/snakqsqe/mcp.snakkaz.com
5. Run: npm install
6. Edit .env with your email credentials and Sentry DSN
7. Test server: npm test
8. Start server: npm start

### Files included:
- Enhanced MCP server with CORS support
- Security middleware (Helmet, rate limiting)
- Norwegian language responses
- WebRTC and AI endpoints
- Comprehensive test suite
- Package.json with dependencies

### Server Features:
- /api/health - Health check
- /api/chat - Chat processing
- /api/mcp/status - MCP status
- /api/webrtc/signal - WebRTC signaling
- /api/ai/process - AI processing

### Production Notes:
- Server runs on port 3000 by default
- Enable in cPanel Node.js app
- Monitor logs for errors
- Set up automatic restart on crashes`
      }
    );

    // 3. Database Schema
    await createZip(
      'snakkaz-database',
      'Database Schema and Migrations',
      [
        { type: 'file', source: 'database/message-reactions-schema.sql', dest: 'message-reactions-schema.sql' },
        { type: 'file', source: 'database-extensions-fase2.sql', dest: 'database-extensions.sql' },
        { type: 'directory', source: 'database/', dest: 'database/' }
      ],
      {
        instructions: `# SnakkaZ Database Schema

## Target: Supabase Database

### Steps:
1. Log into Supabase dashboard
2. Go to SQL Editor
3. Run message-reactions-schema.sql first
4. Run database-extensions.sql second
5. Verify tables are created correctly

### Schema includes:
- message_reactions table with RLS policies
- custom_emojis table for Norwegian emojis
- Performance indexes and materialized views
- Real-time subscription functions
- Popular emoji tracking
- Default Norwegian system emojis

### Features:
- Row Level Security (RLS) enabled
- Real-time updates via Supabase subscriptions
- Optimized for performance with indexes
- Support for Unicode and custom emojis
- Usage tracking and analytics

### Verification:
After running scripts, check that these tables exist:
- message_reactions
- custom_emojis
- message_reaction_counts (materialized view)

Test with: SELECT * FROM custom_emojis WHERE is_system = true;`
      }
    );

    // 4. Complete Development Package
    await createZip(
      'snakkaz-complete',
      'Complete SnakkaZ Development Package',
      [
        { type: 'directory', source: 'src/', dest: 'src/' },
        { type: 'directory', source: 'public/', dest: 'public/' },
        { type: 'directory', source: 'database/', dest: 'database/' },
        { type: 'directory', source: 'mcp-deployment/', dest: 'mcp-deployment/' },
        { type: 'directory', source: 'scripts/', dest: 'scripts/' },
        { type: 'file', source: 'package.json', dest: 'package.json' },
        { type: 'file', source: 'package-lock.json', dest: 'package-lock.json' },
        { type: 'file', source: 'vite.config.ts', dest: 'vite.config.ts' },
        { type: 'file', source: 'tsconfig.json', dest: 'tsconfig.json' },
        { type: 'file', source: 'tailwind.config.js', dest: 'tailwind.config.js' },
        { type: 'file', source: '.env.production.template', dest: '.env.production.template' },
        { type: 'file', source: '.env.email.template', dest: '.env.email.template' },
        { type: 'file', source: 'SENTRY-SETUP-GUIDE.md', dest: 'SENTRY-SETUP-GUIDE.md' },
        { type: 'file', source: 'README.md', dest: 'README.md' }
      ],
      {
        instructions: `# SnakkaZ Complete Development Package

## Contents:
This package contains the complete SnakkaZ source code and all deployment files.

### For Development:
1. Extract to development directory
2. Run: npm install
3. Copy .env.production.template to .env.local
4. Configure environment variables
5. Run: npm run dev

### For Production:
1. Run: npm run build
2. Deploy dist/ to web server
3. Deploy mcp-deployment/ to MCP server
4. Run database migrations
5. Configure environment variables

### Key Features Included:
- ✅ Complete React + TypeScript frontend
- ✅ Message reactions system with Norwegian emojis
- ✅ Enhanced MCP server with security
- ✅ Email system with SMTP configuration
- ✅ Sentry error monitoring setup
- ✅ E2EE chat functionality
- ✅ WebRTC P2P communication
- ✅ Supabase database integration
- ✅ Production-optimized build system

### Directory Structure:
- src/ - React application source code
- mcp-deployment/ - MCP server files
- database/ - SQL schema and migrations
- scripts/ - Deployment and test scripts
- public/ - Static assets

### Documentation:
- SENTRY-SETUP-GUIDE.md - Error monitoring setup
- .env templates - Environment configuration
- README.md - Complete project documentation`
      }
    );

    console.log('🎉 All deployment packages created successfully!\n');
    
    console.log('📁 Deployment packages location: ./deployments/');
    console.log('\n📋 Package Summary:');
    console.log('   📦 snakkaz-webapp-* → Upload to public_html');
    console.log('   📦 snakkaz-mcp-server-* → Upload to mcp.snakkaz.com');
    console.log('   📦 snakkaz-database-* → Run on Supabase');
    console.log('   📦 snakkaz-complete-* → Full source code');
    
    console.log('\n🚀 SnakkaZ is ready for production deployment!');
    console.log('\n💡 Next steps:');
    console.log('   1. Set up Sentry project (see SENTRY-SETUP-GUIDE.md)');
    console.log('   2. Upload webapp package to cPanel public_html');
    console.log('   3. Upload MCP server to mcp.snakkaz.com');
    console.log('   4. Run database migrations on Supabase');
    console.log('   5. Test live deployment');
    console.log('   6. Launch SnakkaZ Beta! 🎊');

  } catch (error) {
    console.error('❌ Error creating deployment packages:', error);
    process.exit(1);
  }
}

main();