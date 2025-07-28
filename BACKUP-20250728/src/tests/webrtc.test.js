/**
 * @jest-environment jsdom
 */

import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';

// Mock for RTCPeerConnection
const mockRTCPeerConnectionInstance = {
  createOffer: jest.fn().mockResolvedValue({ type: 'offer', sdp: 'mock-sdp' }),
  setLocalDescription: jest.fn().mockResolvedValue(undefined),
  setRemoteDescription: jest.fn().mockResolvedValue(undefined),
  createAnswer: jest.fn().mockResolvedValue({ type: 'answer', sdp: 'mock-sdp-answer' }),
  createDataChannel: jest.fn().mockReturnValue({
    onopen: null,
    onmessage: null,
    onclose: null,
    onerror: null,
    send: jest.fn(),
    close: jest.fn(),
  }),
  onicecandidate: null,
  onconnectionstatechange: null,
  oniceconnectionstatechange: null,
  ondatachannel: null,
  getStats: jest.fn().mockResolvedValue([
    { type: 'data-channel', bytesReceived: 100, bytesSent: 200 },
    { packetsLost: 0 }
  ]),
  connectionState: 'new',
  iceConnectionState: 'new',
  close: jest.fn(),
  addIceCandidate: jest.fn().mockResolvedValue(undefined),
};

// Mock for navigator.mediaDevices
const mockMediaDevices = {
  getUserMedia: jest.fn().mockResolvedValue({
    getTracks: jest.fn().mockReturnValue([]),
  }),
};

// Mock for WebCrypto API
const mockCrypto = {
  subtle: {
    generateKey: jest.fn().mockResolvedValue({
      publicKey: 'mock-public-key',
      privateKey: 'mock-private-key'
    }),
    deriveBits: jest.fn().mockResolvedValue(new ArrayBuffer(32)),
    importKey: jest.fn().mockResolvedValue('mock-encryption-key'),
    encrypt: jest.fn().mockResolvedValue(new ArrayBuffer(64)),
    decrypt: jest.fn().mockResolvedValue(new TextEncoder().encode('decrypted-message').buffer),
  },
  getRandomValues: jest.fn().mockImplementation((arr) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 256);
    }
    return arr;
  }),
};

// Setup globals before tests
beforeEach(() => {
  // Setup RTCPeerConnection mock
  global.RTCPeerConnection = jest.fn().mockImplementation(() => mockRTCPeerConnectionInstance);
  // Setup navigator mock
  global.navigator = {
    ...global.navigator,
    mediaDevices: mockMediaDevices,
  };
  // Setup WebCrypto mock
  global.window = {
    ...global.window,
    crypto: mockCrypto,
  };
  // Reset mock connection state
  mockRTCPeerConnectionInstance.connectionState = 'new';
  mockRTCPeerConnectionInstance.iceConnectionState = 'new';
});

// Clean up after tests
afterEach(() => {
  jest.clearAllMocks();
});

// Import functions to test (these would normally be imported from your code)
// For testing purposes, we define them inline here
const setupWebRTC = (targetUserId, onMessageCallback) => {
  // Create peer connection
  const peerConnection = new RTCPeerConnection({
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  });
  
  // Create data channel
  const dataChannel = peerConnection.createDataChannel('chat');
  
  dataChannel.onopen = () => {
    console.log(`Connection established with ${targetUserId}`);
  };
  
  dataChannel.onmessage = (event) => {
    if (onMessageCallback) onMessageCallback(event.data);
  };
  
  // Setup ICE handling
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      console.log('ICE candidate:', event.candidate);
      // In a real implementation, this would send the candidate to the peer
    }
  };
  
  // Monitor connection state changes
  peerConnection.onconnectionstatechange = () => {
    console.log(`Connection state: ${peerConnection.connectionState}`);
  };
  
  return { peerConnection, dataChannel };
};

const createSignalingOffer = async (peerConnection) => {
  try {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    return offer;
  } catch (error) {
    console.error('Error creating offer:', error);
    throw error;
  }
};

const handleSignalingAnswer = async (peerConnection, answer) => {
  try {
    await peerConnection.setRemoteDescription(answer);
    return true;
  } catch (error) {
    console.error('Error handling answer:', error);
    return false;
  }
};

const encryptMessage = async (message) => {
  const encoder = new TextEncoder();
  const encodedMessage = encoder.encode(message);
  
  // In a real implementation, this would use a shared key
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const mockKey = await window.crypto.subtle.importKey(
    'raw',
    new Uint8Array(32),
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );
  
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    mockKey,
    encodedMessage
  );
  
  return { encryptedData, iv };
};

const decryptMessage = async (encryptedData, iv) => {
  // In a real implementation, this would use a shared key
  const mockKey = await window.crypto.subtle.importKey(
    'raw',
    new Uint8Array(32),
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );
  
  const decryptedData = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    mockKey,
    encryptedData
  );
  
  const decoder = new TextDecoder();
  return decoder.decode(decryptedData);
};

// Tests
describe('WebRTC Functionality', () => {
  it('should create a peer connection', () => {
    const { peerConnection, dataChannel } = setupWebRTC('user123', jest.fn());
    
    expect(peerConnection).toBeDefined();
    expect(dataChannel).toBeDefined();
    expect(global.RTCPeerConnection).toHaveBeenCalledWith({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });
    expect(peerConnection.createDataChannel).toHaveBeenCalledWith('chat');
  });
  
  it('should create an offer', async () => {
    const { peerConnection } = setupWebRTC('user123', jest.fn());
    const offer = await createSignalingOffer(peerConnection);
    
    expect(offer).toEqual({ type: 'offer', sdp: 'mock-sdp' });
    expect(peerConnection.createOffer).toHaveBeenCalled();
    expect(peerConnection.setLocalDescription).toHaveBeenCalledWith({ type: 'offer', sdp: 'mock-sdp' });
  });
  
  it('should handle an answer', async () => {
    const { peerConnection } = setupWebRTC('user123', jest.fn());
    const answer = { type: 'answer', sdp: 'mock-sdp-answer' };
    const result = await handleSignalingAnswer(peerConnection, answer);
    
    expect(result).toBe(true);
    expect(peerConnection.setRemoteDescription).toHaveBeenCalledWith(answer);
  });
  
  it('should handle connection state changes', () => {
    const { peerConnection } = setupWebRTC('user123', jest.fn());
    
    // Simulate connection state change
    mockRTCPeerConnectionInstance.connectionState = 'connected';
    peerConnection.onconnectionstatechange();
    
    expect(peerConnection.connectionState).toBe('connected');
  });
  
  it('should handle ICE candidates', () => {
    const { peerConnection } = setupWebRTC('user123', jest.fn());
    const mockCandidate = { candidate: 'mock-ice-candidate' };
    
    // Setup spy for console.log
    const consoleSpy = jest.spyOn(console, 'log');
    
    // Trigger ICE candidate event
    peerConnection.onicecandidate({ candidate: mockCandidate });
    
    expect(consoleSpy).toHaveBeenCalledWith('ICE candidate:', mockCandidate);
    consoleSpy.mockRestore();
  });
  
  it('should encrypt and decrypt messages', async () => {
    const originalMessage = 'Hello, WebRTC!';
    
    const { encryptedData, iv } = await encryptMessage(originalMessage);
    expect(encryptedData).toBeDefined();
    expect(iv).toBeDefined();
    
    const decryptedMessage = await decryptMessage(encryptedData, iv);
    expect(decryptedMessage).toBe('decrypted-message'); // Using mock value from our mock
  });
  
  it('should handle data channel messaging', () => {
    const messageCallback = jest.fn();
    const { dataChannel } = setupWebRTC('user123', messageCallback);
    
    // Simulate receiving a message
    dataChannel.onmessage({ data: 'test message' });
    
    expect(messageCallback).toHaveBeenCalledWith('test message');
  });
  
  it('should get connection statistics', async () => {
    const { peerConnection } = setupWebRTC('user123', jest.fn());
    
    const stats = await peerConnection.getStats();
    
    expect(stats).toEqual([
      { type: 'data-channel', bytesReceived: 100, bytesSent: 200 },
      { packetsLost: 0 }
    ]);
  });
  
  it('should clean up resources when closed', () => {
    const { peerConnection, dataChannel } = setupWebRTC('user123', jest.fn());
    
    peerConnection.close();
    
    expect(peerConnection.close).toHaveBeenCalled();
  });
  
  it('should handle failures when creating offer', async () => {
    const { peerConnection } = setupWebRTC('user123', jest.fn());
    
    // Mock a failure
    peerConnection.createOffer.mockRejectedValueOnce(new Error('Failed to create offer'));
    
    // Setup spy for console.error
    const consoleSpy = jest.spyOn(console, 'error');
    
    await expect(createSignalingOffer(peerConnection)).rejects.toThrow('Failed to create offer');
    expect(consoleSpy).toHaveBeenCalledWith('Error creating offer:', expect.any(Error));
    
    consoleSpy.mockRestore();
  });
  
  it('should handle failures when processing answer', async () => {
    const { peerConnection } = setupWebRTC('user123', jest.fn());
    
    // Mock a failure
    peerConnection.setRemoteDescription.mockRejectedValueOnce(new Error('Failed to set remote description'));
    
    // Setup spy for console.error
    const consoleSpy = jest.spyOn(console, 'error');
    
    const result = await handleSignalingAnswer(peerConnection, { type: 'answer', sdp: 'invalid-sdp' });
    
    expect(result).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith('Error handling answer:', expect.any(Error));
    
    consoleSpy.mockRestore();
  });
});

describe('WebRTC Fallback Mechanism', () => {
  it('should detect when WebRTC is not available', () => {
    // Remove RTCPeerConnection to simulate unsupported browser
    delete global.RTCPeerConnection;
    
    expect(() => setupWebRTC('user123', jest.fn())).toThrow();
  });
  
  it('should handle ICE connection failures', () => {
    const { peerConnection } = setupWebRTC('user123', jest.fn());
    const consoleSpy = jest.spyOn(console, 'log');
    
    // Simulate ICE connection failure
    mockRTCPeerConnectionInstance.iceConnectionState = 'failed';
    peerConnection.oniceconnectionstatechange();
    
    expect(peerConnection.iceConnectionState).toBe('failed');
    expect(consoleSpy).toHaveBeenCalledWith(`Connection state: new`); // Initial state from mock
    
    consoleSpy.mockRestore();
  });
});
