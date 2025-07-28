#!/bin/bash

echo "🛠️ SNAKKAZ STRUCTURE FIX - SYSTEMATISK LØSNING"
echo "==============================================="

# STEG 1: LAG CLEAN WORKSPACE STRUKTUR
echo "📁 Lager ren mappestruktur..."

# Hovedmappe blir BARE for konfigurering
cd /workspaces/snakkaz-chat

# STEG 2: SETT OPP TESTSPRITE SOM HOVEDAPP
echo "🚀 Setter opp TestSprite som hovedapp..."

cd testsprite-new

# Fjern gamle konflikter
echo "  → Rydder cache..."
rm -rf node_modules/.vite 2>/dev/null
rm -rf dist 2>/dev/null

# STEG 3: FIX PACKAGE.JSON FOR CLEAN START
echo "  → Oppdaterer package.json..."
cat > package.json << 'EOF'
{
  "name": "snakkaz-testsprite",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port 4000 --host 0.0.0.0",
    "build": "tsc && vite build",
    "preview": "vite preview --port 4000",
    "clean": "rm -rf node_modules/.vite dist"
  },
  "dependencies": {
    "@testsprite/testsprite-mcp": "^1.0.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@types/react-router-dom": "^6.6.0",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.6.3",
    "vite": "^5.4.11"
  }
}
EOF

# STEG 4: CLEAN VITE CONFIG
echo "  → Lager ren vite.config.ts..."
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,
    host: '0.0.0.0',
    strictPort: true
  },
  root: '.',
  base: '/',
  build: {
    outDir: 'dist'
  }
})
EOF

# STEG 5: REINSTALL CLEAN
echo "  → Reinstallerer dependencies..."
rm -rf node_modules
npm install

echo ""
echo "✅ STRUKTUR FIKSET!"
echo "==================="
echo ""
echo "🎯 NESTE STEG:"
echo "1. cd /workspaces/snakkaz-chat/testsprite-new"
echo "2. npm run dev"
echo "3. Åpne http://localhost:4000"
echo ""
echo "🔧 TestSprite API Endpoint:"
echo "   http://localhost:4000/api/testsprite"
echo ""
echo "📋 SnakkaZ API Struktur:"
echo "   - Frontend: TestSprite-new på port 4000"
echo "   - Backend: TestSprite MCP integrert"
echo "   - Design: Norwegian Aurora CSS"
