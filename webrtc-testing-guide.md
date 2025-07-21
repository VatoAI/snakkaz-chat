# SnakkaZ WebRTC Testing Guide

This document provides a comprehensive guide for testing the WebRTC functionality in the SnakkaZ Chat application. WebRTC enables real-time peer-to-peer communication, allowing for direct messaging between users without going through a server.

## Testing Approach

We use multiple testing methods to ensure robust WebRTC functionality:

1. **Unit Tests**: Using Jest to test WebRTC components in isolation
2. **Integration Tests**: Testing how WebRTC interacts with other parts of the application
3. **Browser Tests**: Manual testing in a browser environment to verify actual WebRTC connections
4. **Fallback Testing**: Verifying that the application falls back to server communication when WebRTC fails

## Prerequisites

- Node.js and npm installed
- Modern web browser (Chrome, Firefox, or Edge recommended)
- Basic understanding of WebRTC concepts

## Running the Tests

### Automated Unit Tests

Run the Jest unit tests with:

```bash
# From the project root
npm test src/tests/webrtc/webrtc-manager.test.ts
```

This will test the WebRTCManager class and related functionality using mocks for the RTCPeerConnection API.

### Browser-based Tests

We provide a browser-based testing tool that allows you to test WebRTC functionality directly:

```bash
# From the project root
./src/tests/run-webrtc-tests.sh
```

This script will:
1. Run the Jest unit tests
2. Open the browser-based WebRTC test in your default browser

Alternatively, you can manually open `src/tests/webrtc-browser-test.html` in your web browser.

## Browser Test Usage

The browser test page contains multiple sections:

### 1. WebRTC System Tests
- Tests basic WebRTC API availability
- Checks ICE server connectivity
- Tests a complete connection cycle

### 2. Connection Test
- Enter user IDs and establish connections
- Monitor connection status

### 3. Message Test
- Send and receive messages over the WebRTC connection
- Send direct encrypted messages

### 4. Security Test
- Test encryption functionality
- Verify secure connection establishment

### 5. Fallback Test
- Test reconnection after connection loss
- Simulate server fallback when WebRTC fails

## Complete Testing Procedure

For thorough testing of WebRTC functionality, follow these steps:

1. **Run the Unit Tests**
   ```
   npm test src/tests/webrtc/webrtc-manager.test.ts
   ```

2. **Run the Browser Test in Two Different Browsers**
   - Open `src/tests/webrtc-browser-test.html` in two different browser windows
   - In each window:
     - Enter a unique User ID
     - Enter the other window's User ID as the Peer ID
     - Initialize the connection in both windows
     - Connect to the peer in both windows
     - Verify that the connection status shows "Connected"

3. **Test Basic Messaging**
   - Type a message in one window and click "Send Message"
   - Verify that the message appears in the other window's message log
   - Repeat from the other window

4. **Test Encrypted Messaging**
   - Type a message in one window and click "Send E2E Encrypted Message"
   - Verify that the message appears encrypted in the other window

5. **Test Connection Resilience**
   - Click "Test Reconnection" in one window
   - Verify that the connection is re-established

6. **Test Server Fallback**
   - Click "Test Server Fallback" in one window
   - This simulates the fallback mechanism that would occur in production

## WebRTC Components in the Application

The main WebRTC components in the SnakkaZ Chat application are:

- `WebRTCManager`: Core class managing WebRTC connections
- `PeerManager`: Manages peer connections and signaling
- `ConnectionManager`: Handles connection establishment and state
- `MessageHandler`: Processes message sending and receiving
- `ReconnectionManager`: Manages reconnection attempts
- `ConnectionStateManager`: Tracks connection states

## Common Issues and Troubleshooting

1. **ICE Connection Failures**
   - Cause: Firewalls, NATs, or network restrictions
   - Solution: Ensure STUN/TURN servers are accessible; check firewall settings

2. **Data Channel Not Opening**
   - Cause: Negotiation issues or browser incompatibilities
   - Solution: Verify that both peers support data channels; check browser console for errors

3. **Message Encryption Failures**
   - Cause: WebCrypto API issues or key exchange problems
   - Solution: Ensure browser supports required crypto algorithms; check key exchange process

4. **Connection State Issues**
   - Cause: Network instability or browser differences
   - Solution: Implement robust reconnection logic; test across multiple browsers

5. **Server Fallback Not Working**
   - Cause: Detection logic issues or server unavailability
   - Solution: Verify fallback detection logic; ensure server is operational

## Conclusion

The WebRTC implementation in SnakkaZ Chat provides secure, peer-to-peer messaging with fallback to server communication when needed. The provided testing tools allow thorough verification of this functionality. Regular testing across different browsers and network conditions is recommended to ensure a reliable user experience.
