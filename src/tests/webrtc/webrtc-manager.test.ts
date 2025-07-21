import '@testing-library/jest-dom';
import { WebRTCManager } from '../../utils/webrtc/webrtc-manager';

// Mock for RTCPeerConnection
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

// Mock for RTCDataChannel
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
    
    // For testing purposes, we'll just log the sent data
    console.log(`MockDataChannel sent: ${data}`);
    return true;
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
    generateKey: jest.fn().mockImplementation((algorithm, extractable, keyUsages) => {
      return Promise.resolve({
        publicKey: { type: 'mock-public-key' },
        privateKey: { type: 'mock-private-key' }
      });
    }),
    exportKey: jest.fn().mockResolvedValue({ key: 'mock-exported-key' }),
    importKey: jest.fn().mockResolvedValue({ key: 'mock-imported-key' }),
    encrypt: jest.fn().mockImplementation((algorithm, key, data) => {
      return Promise.resolve(new Uint8Array([1, 2, 3, 4]).buffer);
    }),
    decrypt: jest.fn().mockImplementation((algorithm, key, data) => {
      return Promise.resolve(new TextEncoder().encode('decrypted-message').buffer);
    }),
    sign: jest.fn().mockResolvedValue(new Uint8Array([5, 6, 7, 8]).buffer),
    verify: jest.fn().mockResolvedValue(true),
    deriveBits: jest.fn().mockResolvedValue(new Uint8Array([9, 10, 11, 12]).buffer),
    deriveKey: jest.fn().mockResolvedValue({ key: 'mock-derived-key' })
  },
  getRandomValues: jest.fn(array => {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  })
};

// Mock modules
jest.mock('../../utils/encryption', () => ({
  generateKeyPair: jest.fn().mockResolvedValue({
    publicKey: { key: 'mock-public-key' },
    privateKey: { key: 'mock-private-key' }
  }),
  encryptMessage: jest.fn().mockResolvedValue({
    encryptedContent: 'encrypted-message',
    key: 'encrypted-key',
    iv: 'iv-string'
  }),
  decryptMessage: jest.fn().mockResolvedValue('decrypted-message'),
  establishSecureConnection: jest.fn().mockResolvedValue('secure-connection-key')
}));

jest.mock('../../utils/webrtc/peer-manager', () => {
  return {
    PeerManager: jest.fn().mockImplementation(() => ({
      signalingService: {
        setupSignalingListener: jest.fn().mockReturnValue(() => {}),
        sendSignal: jest.fn().mockResolvedValue(true),
      },
      handleIncomingSignal: jest.fn().mockResolvedValue(true),
      createPeerConnection: jest.fn().mockImplementation((peerId) => {
        const connection = new MockRTCPeerConnection();
        const dataChannel = connection.createDataChannel('data', {});
        return { connection, dataChannel };
      }),
      getPeerConnection: jest.fn().mockImplementation((peerId) => {
        const connection = new MockRTCPeerConnection();
        const dataChannel = connection.createDataChannel('data', {});
        return { connection, dataChannel };
      }),
      removePeerConnection: jest.fn(),
      removeAllPeerConnections: jest.fn(),
    }))
  };
});

// Other mocked dependencies
jest.mock('../../utils/webrtc/connection-manager', () => ({
  ConnectionManager: jest.fn().mockImplementation(() => ({
    connectToPeer: jest.fn().mockImplementation(async (peerId) => {
      const connection = new MockRTCPeerConnection();
      connection._simulateConnectionEstablishment();
      const dataChannel = connection.createDataChannel('data', {});
      return { connection, dataChannel };
    }),
    disconnect: jest.fn(),
    disconnectAll: jest.fn(),
    getConnectionState: jest.fn().mockReturnValue('connected'),
    getDataChannelState: jest.fn().mockReturnValue('open'),
  }))
}));

jest.mock('../../utils/webrtc/message-handler', () => ({
  MessageHandler: jest.fn().mockImplementation(() => ({
    setupMessageCallback: jest.fn().mockImplementation((callback) => {
      return (message, peerId) => callback(message, peerId);
    }),
    sendMessage: jest.fn().mockResolvedValue(true),
    sendDirectMessage: jest.fn().mockResolvedValue(true),
  }))
}));

jest.mock('../../utils/webrtc/reconnection-manager', () => ({
  ReconnectionManager: jest.fn().mockImplementation(() => ({
    attemptReconnect: jest.fn().mockResolvedValue(true),
  }))
}));

jest.mock('../../utils/webrtc/connection-state-manager', () => ({
  ConnectionStateManager: jest.fn().mockImplementation(() => ({
    isPeerReady: jest.fn().mockReturnValue(true),
    ensurePeerReady: jest.fn().mockResolvedValue(true),
  }))
}));

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
    jest.clearAllMocks();
    webRTCManager = new WebRTCManager('test-user-id');
  });

  describe('Basic Functionality', () => {
    test('should initialize with a user ID', () => {
      expect(webRTCManager).toBeDefined();
    });

    test('should provide a public key', () => {
      const publicKey = webRTCManager.getPublicKey();
      expect(publicKey).toBeDefined();
    });
  });

  describe('Peer Connections', () => {
    test('should connect to a peer', async () => {
      const result = await webRTCManager.connectToPeer('peer-1', { key: 'mock-peer-public-key' });
      expect(result).toBeDefined();
    });

    test('should disconnect from a peer', () => {
      webRTCManager.disconnect('peer-1');
      // Expectation is that the function executes without error
      expect(true).toBeTruthy();
    });

    test('should disconnect from all peers', () => {
      webRTCManager.disconnectAll();
      // Expectation is that the function executes without error
      expect(true).toBeTruthy();
    });

    test('should get connection state', () => {
      const state = webRTCManager.getConnectionState('peer-1');
      expect(state).toBe('connected');
    });

    test('should get data channel state', () => {
      const state = webRTCManager.getDataChannelState('peer-1');
      expect(state).toBe('open');
    });
  });

  describe('Messaging', () => {
    test('should send a message to a peer', async () => {
      const result = await webRTCManager.sendMessage('peer-1', 'Hello, peer!');
      expect(result).toBeTruthy();
    });

    test('should send a direct message to a peer', async () => {
      const result = await webRTCManager.sendDirectMessage('peer-1', 'Hello, peer!');
      expect(result).toBeTruthy();
    });

    test('should register message callback', () => {
      const callback = jest.fn();
      webRTCManager.onMessage(callback);
      
      // Validate the callback was registered (cannot easily test the actual call)
      expect(webRTCManager.onMessageCallback).toBeDefined();
    });

    test('should send typing indicator', async () => {
      const result = await webRTCManager.sendTypingIndicator('peer-1', true);
      expect(result).toBeTruthy();
    });
  });

  describe('Connection Management', () => {
    test('should attempt to reconnect', async () => {
      const result = await webRTCManager.attemptReconnect('peer-1');
      expect(result).toBeTruthy();
    });

    test('should check if peer is ready', () => {
      const result = webRTCManager.isPeerReady('peer-1');
      expect(result).toBeTruthy();
    });

    test('should ensure peer is ready', async () => {
      const result = await webRTCManager.ensurePeerReady('peer-1');
      expect(result).toBeTruthy();
    });
  });

  // Fallback and Error Handling would need special mocks to test properly
  describe('Fallback and Error Handling', () => {
    test('should attempt reconnection when sending to disconnected peer', async () => {
      // Override the isPeerReady method to return false
      jest.spyOn(webRTCManager.connectionStateManager, 'isPeerReady').mockReturnValue(false);
      
      // Mock the attemptReconnect method
      const reconnectSpy = jest.spyOn(webRTCManager, 'attemptReconnect');
      
      await webRTCManager.sendDirectMessage('peer-1', 'Hello after reconnect');
      
      expect(reconnectSpy).toHaveBeenCalled();
    });
  });
});
