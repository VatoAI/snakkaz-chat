```
🏠 SnakkaZ App
├── 🌐 MCPWebRTCProvider (React Context)
│   ├── 🎮 Integrated Communication Controller
│   │   ├── 📱 WebRTC (PeerJS) - Direkte P2P
│   │   └── 📡 MCP Server - Server-mediated
│   └── 🔄 Automatisk Fallback System
│
├── 📄 Pages (Login, Chat, Admin)
│   └── 🪝 useMCPWebRTC() hook
│
└── 🛡️ Error Boundary (Norwegian Aurora Design)

Kommunikasjonsflyt:
1. 🎯 Prøv WebRTC først (direkte peer-to-peer)
2. 📡 Fall tilbake til MCP server hvis WebRTC feiler
3. 📊 Samle statistikk og overvåk tilkobling
4. 🔄 Automatisk gjenoppretting ved feil
```
