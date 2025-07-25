# SnakkaZ Chat Testing Guide

This guide provides instructions for testing the core features of SnakkaZ Chat, with a focus on verifying the end-to-end encryption, WebRTC communication, MCP AI Memory System, and performance monitoring.

## Prerequisites

- Node.js 18+ installed
- npm 8+ installed
- Supabase account (for backend services)
- Chrome or Firefox browser (latest version)

## Database Setup

Before testing, ensure your Supabase database has the correct schema:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Import and run the `supabase-schema.sql` file from the project root
4. Verify that the following tables are created:
   - `profiles`
   - `chat_rooms` (not `rooms`)
   - `room_participants`
   - `messages`
   - `beta_invites`
   - `mcp_connections`

### Database Schema Troubleshooting

If you encounter errors related to missing tables (like `relation "public.rooms" does not exist` or `relation "public.mcp_connections" does not exist`), you can fix them with our automated script:

```bash
# Set your Supabase credentials
export SUPABASE_URL="your-project-url"
export SUPABASE_SERVICE_KEY="your-service-role-key"

# Run the fix script
./scripts/fix-database-schema.sh
```

This script will:
- Create the `chat_rooms` table if it doesn't exist
- Create the `mcp_connections` table if it doesn't exist
- Copy data from `rooms` to `chat_rooms` if applicable

## 1. Testing End-to-End Encryption (E2EE)

### 1.1 Setting Up E2EE Test

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open two browser windows and navigate to `http://localhost:5173` in both

3. Log in with two different accounts (user1 and user2)

### 1.2 Verifying Private Message Encryption

1. In user1's window, create a private chat with user2
2. Send a message from user1 to user2
3. Verify the following:
   - Check the browser console for encryption logs: `[E2EE] Message encrypted successfully`
   - Observe the padlock icon next to messages, indicating encryption
   - Use the encryption details panel to view encryption metadata

### 1.3 Testing Group Encryption

1. Create a group with both users
2. Send messages in the group
3. Verify group key rotation works:
   - Send message: `#rotate-keys` to trigger manual key rotation
   - Check console logs for: `[E2EE] Group keys rotated successfully`
   - Confirm all users receive the updated keys

### 1.4 Encryption Metrics

1. Navigate to Settings > Security
2. Review encryption metrics:
   - Key age
   - Encryption latency
   - Number of successful encryptions/decryptions

## 2. Testing WebRTC Communication

### 2.1 Direct Peer Connection

1. Ensure both users are connected to the same room
2. Check browser console for WebRTC connection logs:
   ```
   [WebRTC] Peer connection established
   [WebRTC] Using direct peer-to-peer connection
   ```
3. Send messages and verify the minimal latency

### 2.2 Fallback Mechanism

1. Simulate WebRTC failure:
   - In developer tools, go to Network tab
   - Block WebRTC connections by adding a block for `*.local`
   - Or use Settings > Advanced > WebRTC testing > "Simulate connection failure"
2. Verify fallback to Supabase Realtime:
   ```
   [WebRTC] Fallback activated: Using Supabase Realtime
   ```
3. Confirm messages still arrive, albeit with potentially increased latency

### 2.3 Connection Statistics

1. Navigate to Settings > Network
2. Review WebRTC statistics:
   - Connection type (direct/fallback)
   - Data transfer rate
   - Latency metrics
   - Packet loss (if any)

## 3. Testing MCP AI Memory System

### 3.1 Basic Memory Storage

1. Send a series of messages containing factual information:
   ```
   "The capital of France is Paris"
   "The sky is blue because of Rayleigh scattering"
   ```
2. Wait 10-15 seconds for memory processing

### 3.2 Context-Aware Responses

1. Ask the AI about previously mentioned facts:
   ```
   "What is the capital of France?"
   "Why is the sky blue?"
   ```
2. Verify AI responds with contextual information from stored memories
3. Check the console logs for memory retrieval:
   ```
   [MCP] Retrieved 3 memories for context generation
   ```

### 3.3 Memory Encryption

1. Navigate to Settings > AI & Privacy
2. Enable memory encryption if not already enabled
3. Add new information with encryption on
4. Verify in the browser console:
   ```
   [MCP] Memory stored with encryption
   ```

## 4. Testing Performance Monitoring

### 4.1 Real-Time Metrics

1. Navigate to Settings > System > Performance
2. Observe the real-time metrics dashboard:
   - Message latency
   - Encryption/decryption times
   - Memory usage
   - Network statistics

### 4.2 Health Status

1. Check the system health indicator in the app header
2. Simulate heavy load:
   - Send multiple messages in rapid succession
   - Upload a large file
3. Verify the health status updates accordingly

### 4.3 Alerts and Notifications

1. Simulate performance issues:
   - Navigate to Settings > Developer > Testing
   - Enable "Simulate high latency"
2. Verify alert notifications appear:
   ```
   "Performance alert: High message latency detected"
   ```

## 5. Integration Testing

### 5.1 Full System Test

1. Create a new group chat with encrypted memories
2. Send regular messages and observe WebRTC connections
3. Ask AI questions that require context from previous messages
4. Monitor the performance metrics during these operations
5. Verify all systems work harmoniously:
   ```
   [SnakkaZ] All systems operational: E2EE, WebRTC, MCP, Monitoring
   ```

### 5.2 GitHub Copilot MCP Integration

1. Deploy an MCP server with CloudMCP.run
2. Connect to the MCP server in Settings > MCP Integration
3. Test Copilot commands:
   - `@snakkaz_chat_status`
   - `@snakkaz_send_message`
   - `@snakkaz_room_analytics`

## Troubleshooting

### Common Issues

1. **Encryption Key Errors**
   - Reset user keys in Settings > Security > Reset Keys
   - Check console for detailed error messages

2. **WebRTC Connection Failures**
   - Ensure your network allows WebRTC connections
   - Check if both users are on compatible browsers
   - Verify TURN/STUN server configuration

3. **MCP Memory System Issues**
   - Ensure Qdrant service is running (if self-hosted)
   - Check MCP connection status in Settings > AI
   - Verify memory encryption keys are properly initialized

4. **Performance Monitoring Alerts**
   - Review alert thresholds in Settings > System > Alerts
   - Check if alerts are due to network conditions or actual system issues
   - Use the performance debug tool to generate detailed reports

## Reporting Issues

When reporting issues, please include:

1. Browser and version
2. Operating system
3. Relevant console logs
4. Steps to reproduce
5. Expected vs. actual behavior

Submit issues via GitHub or the in-app feedback tool.
