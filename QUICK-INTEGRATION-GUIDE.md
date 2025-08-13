# 🚀 Quick Integration Guide - SnakkaZ Chat

## Phase 1: Basic Integration (30 minutes)

### 1. Add Theme Provider to Your App Root

```tsx
// src/App.tsx or your root component
import React from "react";
import { ThemeProvider } from "./context/ThemeProvider";
import { PerformanceMonitorProvider } from "./hooks/usePerformanceMonitor";
import "./styles/cyberpunk-enhanced.css";

function App() {
  return (
    <ThemeProvider>
      <PerformanceMonitorProvider
        showDebugPanel={process.env.NODE_ENV === "development"}
        analyticsEndpoint="/api/analytics"
      >
        {/* Your existing app content */}
        <YourExistingApp />
      </PerformanceMonitorProvider>
    </ThemeProvider>
  );
}

export default App;
```

### 2. Create a Chat Page Component

```tsx
// src/pages/ChatPage.tsx
import React from "react";
import { ChatContainer } from "../containers/ChatContainer";

interface ChatPageProps {
  roomId?: string;
  userId?: string;
}

const ChatPage: React.FC<ChatPageProps> = ({
  roomId = "general",
  userId = "user-123",
}) => {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <ChatContainer
        roomId={roomId}
        userId={userId}
        websocketUrl={process.env.REACT_APP_WS_URL || "ws://localhost:3001"}
        onError={(error) => {
          console.error("Chat error:", error);
          // Handle errors (show toast, etc.)
        }}
      />
    </div>
  );
};

export default ChatPage;
```

### 3. Add to Your Router

```tsx
// If using React Router
import { Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/chat/:roomId" element={<ChatPage />} />
      {/* Your other routes */}
    </Routes>
  );
}
```

## Phase 2: Backend Integration (1-2 hours)

### 1. WebSocket Server Setup

```javascript
// Example Node.js WebSocket server
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 3001 });

wss.on("connection", (ws, req) => {
  const url = new URL(req.url, "http://localhost:3001");
  const roomId = url.searchParams.get("roomId");
  const userId = url.searchParams.get("userId");

  ws.roomId = roomId;
  ws.userId = userId;

  ws.on("message", (data) => {
    const message = JSON.parse(data);

    // Broadcast to all clients in the same room
    wss.clients.forEach((client) => {
      if (client.roomId === roomId && client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            ...message,
            timestamp: Date.now(),
            id: generateMessageId(),
          })
        );
      }
    });
  });
});
```

### 2. API Endpoints

```javascript
// Express.js example
app.post("/api/messages", async (req, res) => {
  const { roomId, userId, content, type } = req.body;

  const message = await saveMessage({
    roomId,
    userId,
    content,
    type,
    timestamp: Date.now(),
  });

  res.json(message);
});

app.get("/api/messages/:roomId", async (req, res) => {
  const { roomId } = req.params;
  const messages = await getMessages(roomId);
  res.json(messages);
});

// Performance analytics endpoint
app.post("/api/analytics", (req, res) => {
  console.log("Performance metric:", req.body);
  // Store in your analytics system
  res.status(200).send("OK");
});
```

## Phase 3: Production Optimization (2-3 hours)

### 1. Environment Configuration

```bash
# .env.production
REACT_APP_WS_URL=wss://your-domain.com/ws
REACT_APP_API_URL=https://your-domain.com/api
REACT_APP_ANALYTICS_ENABLED=true
```

### 2. Build Optimization

```javascript
// webpack.config.js or similar
module.exports = {
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
        chat: {
          test: /[\\/]src[\\/](components|containers)[\\/]chat[\\/]/,
          name: "chat",
          chunks: "all",
        },
      },
    },
  },
};
```

## Phase 4: Testing & Validation

### 1. Component Tests

```tsx
// src/components/chat/__tests__/ChatContainer.test.tsx
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "../../../context/ThemeProvider";
import { ChatContainer } from "../ChatContainer";

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

test("renders chat container", () => {
  renderWithTheme(<ChatContainer roomId="test" userId="user1" />);

  expect(screen.getByRole("textbox")).toBeInTheDocument();
});
```

### 2. Performance Testing

```tsx
// Use the performance monitor
import { trackPerformance } from "./utils/performanceMonitor";

// Initialize monitoring
trackPerformance.init("/api/analytics");

// Track custom events
trackPerformance.trackCustomEvent("chat-opened", performance.now());

// Validate performance budgets
trackPerformance.validateBudgets();
```

## 🎯 Launch Checklist

- [ ] Theme provider integrated ✅
- [ ] Chat components rendering ✅
- [ ] WebSocket connection working
- [ ] Message send/receive working
- [ ] Performance monitoring active
- [ ] Mobile responsive
- [ ] Accessibility tested
- [ ] Error handling implemented
- [ ] Production build optimized
- [ ] SSL/WSS configured
- [ ] Analytics tracking setup
- [ ] Load testing completed

## 🔧 Troubleshooting

### Common Issues:

1. **WebSocket Connection Fails**

   - Check CORS settings on server
   - Verify WSS certificate for production
   - Ensure firewall allows WebSocket connections

2. **Performance Issues**

   - Enable message virtualization for large chats
   - Check memory usage in performance monitor
   - Optimize glassmorphism effects for mobile

3. **Theme Not Applied**
   - Ensure ThemeProvider wraps your app
   - Check CSS import order
   - Verify design tokens are accessible

### Need Help?

- Check browser console for errors
- Use the development debug panel
- Monitor performance metrics
- Test on multiple devices/browsers

**Your SnakkaZ Chat is ready to launch! 🚀**
