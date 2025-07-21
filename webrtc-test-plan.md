# Jest-based WebRTC Chat Test Suite for SnakkaZ Chat

## Overview

This document outlines a comprehensive testing plan for the WebRTC-based chat functionality in the SnakkaZ Chat application. Since there is no Cypress setup for end-to-end testing, we'll use Jest and mock the WebRTC APIs to test the functionality.

## Testing Approach

1. Unit Tests: Test individual components and functions of the WebRTC implementation
2. Integration Tests: Test the interaction between WebRTC and chat components
3. Mock Tests: Use mocks to simulate WebRTC connections
4. Manual Tests: Provide a checklist for manual testing

## WebRTC Testing Challenges

- WebRTC requires real browser environments with access to specific APIs
- P2P connections require multiple instances/browsers
- Network connectivity impacts test reliability
- STUN/TURN server dependencies

## Test Plan

### 1. Unit Tests for WebRTC Components

#### WebRTC Manager Tests

- Test initialization with valid user ID
- Test key pair generation
- Test connection state management
- Test reconnection logic

#### Message Handler Tests

- Test message sending
- Test message receiving
- Test encryption/decryption of messages
- Test retry mechanisms

#### Connection Management Tests

- Test peer connection establishment
- Test data channel creation
- Test connection state transitions
- Test disconnection functionality

### 2. Integration Tests

#### Chat-to-WebRTC Integration

- Test message flow from UI to WebRTC layer
- Test displaying received messages from WebRTC layer
- Test connection status indicators in UI
- Test fallback mechanisms

#### WebRTC Fallback Tests

- Test detection of connection failures
- Test automatic fallback to server mode
- Test reconnection attempts
- Test message delivery reliability

### 3. Mock Implementation

```javascript
// Mock RTCPeerConnection implementation
class MockRTCPeerConnection {
  constructor(config) {
    this.config = config;
    this.localDescription = null;
    this.remoteDescription = null;
    this.connectionState = 'new';
    this.iceConnectionState = 'new';
    this.iceGatheringState = 'new';
    this.onicecandidate = null;
    this.onconnectionstatechange = null;
    this.ondatachannel = null;
    this._channels = new Map();
  }

  createDataChannel(label, options) {
    const channel = new MockRTCDataChannel(label, options);
    this._channels.set(label, channel);
    return channel;
  }

  async createOffer() {
    return {
      type: 'offer',
      sdp: 'mock-sdp-offer'
    };
  }

  async createAnswer() {
    return {
      type: 'answer',
      sdp: 'mock-sdp-answer'
    };
  }

  async setLocalDescription(description) {
    this.localDescription = description;
    // Simulate ICE candidate gathering
    setTimeout(() => {
      if (this.onicecandidate) {
        this.onicecandidate({ candidate: { candidate: 'mock-ice-candidate' } });
        // Signal end of candidates
        this.onicecandidate({ candidate: null });
      }
    }, 50);
    return Promise.resolve();
  }

  async setRemoteDescription(description) {
    this.remoteDescription = description;
    if (description.type === 'offer' && this.ondatachannel) {
      const channel = new MockRTCDataChannel('data', {});
      setTimeout(() => {
        this.ondatachannel({ channel });
      }, 50);
    }
    return Promise.resolve();
  }

  addIceCandidate(candidate) {
    // Simulate successful ICE candidate addition
    return Promise.resolve();
  }

  _updateConnectionState(state) {
    this.connectionState = state;
    if (this.onconnectionstatechange) {
      this.onconnectionstatechange();
    }
  }

  // Simulate connection establishment
  _simulateConnectionEstablishment() {
    const states = ['connecting', 'connected'];
    let index = 0;
    const interval = setInterval(() => {
      this._updateConnectionState(states[index]);
      index++;
      if (index >= states.length) {
        clearInterval(interval);
      }
    }, 100);
  }
}

class MockRTCDataChannel {
  constructor(label, options) {
    this.label = label;
    this.options = options;
    this.readyState = 'connecting';
    this.onopen = null;
    this.onmessage = null;
    this.onclose = null;
    this.onerror = null;
    
    // Simulate channel opening after a short delay
    setTimeout(() => this._setReadyState('open'), 100);
  }

  send(data) {
    if (this.readyState !== 'open') {
      throw new Error('Data channel is not open');
    }
    
    // Echo the message back (for testing)
    setTimeout(() => {
      if (this.onmessage && this.readyState === 'open') {
        this.onmessage({ data });
      }
    }, 50);
  }

  close() {
    this._setReadyState('closing');
    setTimeout(() => this._setReadyState('closed'), 50);
  }

  _setReadyState(state) {
    this.readyState = state;
    const eventHandlers = {
      'open': this.onopen,
      'closing': null,
      'closed': this.onclose
    };
    
    const handler = eventHandlers[state];
    if (handler) {
      handler();
    }
  }
}

// Mock for crypto functionality
const mockCrypto = {
  subtle: {
    generateKey: jest.fn().mockResolvedValue({
      publicKey: 'mock-public-key',
      privateKey: 'mock-private-key'
    }),
    exportKey: jest.fn().mockResolvedValue('mock-exported-key'),
    encrypt: jest.fn().mockResolvedValue(new ArrayBuffer(10)),
    decrypt: jest.fn().mockImplementation((algorithm, key, data) => {
      return Promise.resolve(new TextEncoder().encode('decrypted-message').buffer);
    })
  },
  getRandomValues: jest.fn(array => array)
};
```

### 4. Example Test Cases

```javascript
describe('WebRTCManager', () => {
  let webRTCManager;
  let originalRTCPeerConnection;
  let originalCrypto;

  beforeAll(() => {
    // Save original implementations
    originalRTCPeerConnection = global.RTCPeerConnection;
    originalCrypto = global.crypto;
    
    // Install mocks
    global.RTCPeerConnection = MockRTCPeerConnection;
    global.crypto = mockCrypto;
  });

  afterAll(() => {
    // Restore original implementations
    global.RTCPeerConnection = originalRTCPeerConnection;
    global.crypto = originalCrypto;
  });

  beforeEach(() => {
    webRTCManager = new WebRTCManager('test-user-id');
  });

  test('should initialize with a user ID', () => {
    expect(webRTCManager).toBeDefined();
  });

  test('should connect to a peer', async () => {
    const result = await webRTCManager.connectToPeer('peer-1', { key: 'mock-peer-public-key' });
    expect(result).toBeDefined();
  });

  test('should send a message to a peer', async () => {
    // First connect to the peer
    await webRTCManager.connectToPeer('peer-1', { key: 'mock-peer-public-key' });
    
    // Then send a message
    const message = 'Hello, peer!';
    const result = await webRTCManager.sendMessage('peer-1', message);
    expect(result).toBeTruthy();
  });

  test('should handle messages from peers', async () => {
    const messageHandler = jest.fn();
    webRTCManager.onMessage(messageHandler);
    
    // Simulate receiving a message
    await webRTCManager.connectToPeer('peer-1', { key: 'mock-peer-public-key' });
    
    // Find the data channel and simulate message
    const peerConnection = webRTCManager.peerManager.getPeerConnection('peer-1').connection;
    const dataChannel = peerConnection._channels.get('data');
    
    dataChannel.onmessage({ data: 'incoming message' });
    
    expect(messageHandler).toHaveBeenCalledWith('incoming message', 'peer-1');
  });

  test('should attempt to reconnect when connection fails', async () => {
    // Mock failed connection
    jest.spyOn(webRTCManager, 'isPeerReady').mockReturnValue(false);
    
    // Spy on reconnection attempt
    const reconnectSpy = jest.spyOn(webRTCManager, 'attemptReconnect');
    
    try {
      await webRTCManager.sendMessage('peer-1', 'This should trigger reconnect');
    } catch (error) {
      // Expect error but reconnect attempt should be made
    }
    
    expect(reconnectSpy).toHaveBeenCalledWith('peer-1');
  });
});
```

### 5. Manual Testing Checklist

For comprehensive testing, manual verification is essential:

1. **Basic Connectivity**
   - Open two browser windows/tabs with the application
   - Log in as different users
   - Initiate chat between users
   - Verify connection establishment
   - Send and receive messages

2. **Connection Resilience**
   - Test message sending during temporary network disruptions
   - Test automatic reconnection when network is restored
   - Test behavior when one peer closes the browser and reopens

3. **Fallback Mechanism**
   - Block WebRTC connections (via firewall or browser settings)
   - Verify chat falls back to server-relay mode
   - Confirm messages are still delivered

4. **Security Testing**
   - Verify message encryption (check browser console for encrypted content)
   - Test secure key exchange
   - Verify end-to-end encryption by inspecting server logs (should see only encrypted data)

5. **Performance Testing**
   - Test with high message volume
   - Test with large messages
   - Measure connection establishment time

### 6. Test Implementation Steps

1. Create a mock RTCPeerConnection class
2. Create a mock crypto API
3. Create jest tests for WebRTCManager
4. Create integration tests with mocked connections
5. Develop a manual testing script

### Conclusion

This test plan provides a comprehensive approach to testing the WebRTC functionality in the SnakkaZ Chat application. By implementing the unit tests, integration tests, and following the manual testing guidelines, we can ensure that the WebRTC-based chat functionality works correctly and reliably.
