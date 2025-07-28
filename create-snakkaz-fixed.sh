#!/bin/bash

echo "🚀 SNAKKAZ FINAL FIX - NYE MAPPE LØSNING"
echo "======================================="

# STEG 1: LAG EN HELT NY MAPPE
echo "📁 Lager helt ny snakkaz-fixed mappe..."

cd /workspaces/snakkaz-chat

# Fjern eventuell gammel versjon
rm -rf snakkaz-fixed 2>/dev/null

# Lag ny mappe
mkdir snakkaz-fixed
cd snakkaz-fixed

# STEG 2: INITIALISER VITE + REACT FRA SCRATCH
echo "🔧 Initialiserer Vite + React..."
npm create vite@latest . -- --template react-ts

# STEG 3: INSTALLER DEPENDENCIES
echo "📦 Installerer dependencies..."
npm install
npm install @testsprite/testsprite-mcp@^0.0.9 react-router-dom

# STEG 4: OPPDATER PACKAGE.JSON MED RIKTIGE SCRIPTS
echo "⚙️ Konfigurerer scripts..."
cat > package.json << 'EOF'
{
  "name": "snakkaz-fixed",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port 4000 --host 0.0.0.0",
    "build": "tsc && vite build",
    "preview": "vite preview --port 4000"
  },
  "dependencies": {
    "@testsprite/testsprite-mcp": "^0.0.9",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.6.3",
    "vite": "^5.4.11"
  }
}
EOF

# STEG 5: KOPIER NORWEGIAN AURORA DESIGN
echo "🎨 Kopierer Norwegian Aurora design..."
cp ../testsprite-new/src/NorwegianAurora.css ./src/
cp ../testsprite-new/src/App.tsx ./src/

echo ""
echo "✅ SNAKKAZ-FIXED KLAR!"
echo "======================"
echo ""
echo "🎯 NESTE STEG:"
echo "1. cd /workspaces/snakkaz-chat/snakkaz-fixed"
echo "2. npm install"
echo "3. npm run dev"
echo "4. Åpne http://localhost:4000"
echo ""
echo "🌊 Design: Norwegian Aurora"
echo "🧪 Testing: TestSprite MCP"
echo "⚡ Port: 4000 (garantert riktig!)"
