import '@testing-library/jest-dom';
import { WebRTCManager } from '../../utils/webrtc/webrtc-manager';

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
        const connection = new (global as any).RTCPeerConnection({});
        const dataChannel = connection.createDataChannel('data', {});
        return { connection, dataChannel };
      }),
      getPeerConnection: jest.fn().mockImplementation((peerId) => {
        const connection = new (global as any).RTCPeerConnection({});
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
    connectToPeer: jest.fn().mockImplementation(async (_peerId) => {
      const connection = new (global as any).RTCPeerConnection({});
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
    setupMessageCallback: jest.fn().mockImplementation((callback: any) => {
      return (message: any, peerId: any) => callback(message, peerId);
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
  let webRTCManager: any;

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
      // Override the isPeerReady method to return false initially, then true
      const isPeerReadySpy = jest.spyOn(webRTCManager.connectionStateManager, 'isPeerReady')
        .mockReturnValueOnce(false)  // First call returns false
        .mockReturnValueOnce(false)  // Second call still false
        .mockReturnValueOnce(true);  // Third call returns true after "reconnection"
      
      // Mock the connectToPeer method to simulate successful reconnection
      const connectToPeerSpy = jest.spyOn(webRTCManager, 'connectToPeer').mockResolvedValue(true);
      
      // Mock sendDirectMessage on messageHandler to avoid the actual sending
      const sendMessageSpy = jest.spyOn(webRTCManager.messageHandler, 'sendDirectMessage').mockResolvedValue(true);
      
      await webRTCManager.sendDirectMessage('peer-1', 'Hello after reconnect');
      
      expect(connectToPeerSpy).toHaveBeenCalled();
      expect(sendMessageSpy).toHaveBeenCalledWith('peer-1', 'Hello after reconnect');
    });
  });
});
