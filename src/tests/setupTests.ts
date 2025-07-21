import '@testing-library/jest-dom';

// Mock window.matchMedia which is not available in test environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock RTCPeerConnection
class MockRTCPeerConnection {
  constructor() {
    this.localDescription = null;
    this.remoteDescription = null;
    this.connectionState = 'new';
    this.iceConnectionState = 'new';
    this.iceGatheringState = 'new';
    this.onicecandidate = null;
    this.onconnectionstatechange = null;
    this.ondatachannel = null;
    this.createDataChannel = jest.fn().mockReturnValue({
      readyState: 'open',
      send: jest.fn(),
      close: jest.fn(),
      onmessage: null,
      onopen: null,
      onclose: null,
    });
    this.createOffer = jest.fn().mockResolvedValue({ type: 'offer', sdp: 'mock-sdp-offer' });
    this.createAnswer = jest.fn().mockResolvedValue({ type: 'answer', sdp: 'mock-sdp-answer' });
    this.setLocalDescription = jest.fn().mockResolvedValue(undefined);
    this.setRemoteDescription = jest.fn().mockResolvedValue(undefined);
    this.addIceCandidate = jest.fn().mockResolvedValue(undefined);
    this.close = jest.fn();
  }
}

// Mock WebCrypto for secure connection tests
const mockCrypto = {
  subtle: {
    generateKey: jest.fn().mockResolvedValue({
      publicKey: { key: 'mock-public-key' },
      privateKey: { key: 'mock-private-key' },
    }),
    exportKey: jest.fn().mockResolvedValue({ key: 'mock-exported-key' }),
    importKey: jest.fn().mockResolvedValue({ key: 'mock-imported-key' }),
    encrypt: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4]).buffer),
    decrypt: jest.fn().mockImplementation(() => {
      return Promise.resolve(new TextEncoder().encode('decrypted-message').buffer);
    }),
    deriveBits: jest.fn().mockResolvedValue(new Uint8Array([9, 10, 11, 12]).buffer),
    deriveKey: jest.fn().mockResolvedValue({ key: 'mock-derived-key' }),
    sign: jest.fn().mockResolvedValue(new Uint8Array([5, 6, 7, 8]).buffer),
    verify: jest.fn().mockResolvedValue(true),
  },
  getRandomValues: jest.fn(array => {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  }),
};

// Install the mocks
global.RTCPeerConnection = MockRTCPeerConnection;
global.crypto = { ...global.crypto, ...mockCrypto };
