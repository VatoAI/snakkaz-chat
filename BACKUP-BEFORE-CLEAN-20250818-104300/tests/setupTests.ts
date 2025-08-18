import '@testing-library/jest-dom';

// Extended timeout for integration tests
jest.setTimeout(30000);

// Mock DOM APIs and environment setup
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Comprehensive WebRTC mocks
const mockRTCPeerConnection = jest.fn().mockImplementation(() => ({
  createOffer: jest.fn().mockResolvedValue({}),
  createAnswer: jest.fn().mockResolvedValue({}),
  setLocalDescription: jest.fn().mockResolvedValue(undefined),
  setRemoteDescription: jest.fn().mockResolvedValue(undefined),
  addIceCandidate: jest.fn().mockResolvedValue(undefined),
  getStats: jest.fn().mockResolvedValue(new Map()),
  close: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  onicecandidate: null,
  ondatachannel: null,
  onnegotiationneeded: null,
  onconnectionstatechange: null,
  onicegatheringstatechange: null,
  onsignalingstatechange: null,
  connectionState: 'new',
  iceConnectionState: 'new',
  iceGatheringState: 'new',
  signalingState: 'stable',
  localDescription: null,
  remoteDescription: null,
}));

// Add static method for generateCertificate
Object.defineProperty(mockRTCPeerConnection, 'generateCertificate', {
  value: jest.fn().mockResolvedValue({}),
  writable: true
});

// Install RTCPeerConnection mock
(global as any).RTCPeerConnection = mockRTCPeerConnection;
(window as any).RTCPeerConnection = mockRTCPeerConnection;

// WebCrypto API mocks for encrypted communications
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: jest.fn().mockImplementation((arr: any) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    }),
    randomUUID: jest.fn().mockReturnValue('test-uuid-123'),
    subtle: {
      generateKey: jest.fn().mockResolvedValue({}),
      exportKey: jest.fn().mockResolvedValue(new ArrayBuffer(32)),
      importKey: jest.fn().mockResolvedValue({}),
      encrypt: jest.fn().mockResolvedValue(new ArrayBuffer(16)),
      decrypt: jest.fn().mockResolvedValue(new ArrayBuffer(16)),
      deriveBits: jest.fn().mockResolvedValue(new ArrayBuffer(32)),
      deriveKey: jest.fn().mockResolvedValue({}),
      sign: jest.fn().mockResolvedValue(new ArrayBuffer(64)),
      verify: jest.fn().mockResolvedValue(true),
      digest: jest.fn().mockResolvedValue(new ArrayBuffer(32)),
    }
  },
  writable: true
});

// Install the same on window for browser environment
Object.defineProperty(window, 'crypto', {
  value: global.crypto,
  writable: true
});

// Notification API mock for real-time features
Object.defineProperty(global, 'Notification', {
  value: jest.fn().mockImplementation((title: string, options?: NotificationOptions) => ({
    title,
    body: options?.body || '',
    icon: options?.icon || '',
    onclick: null,
    onclose: null,
    onerror: null,
    onshow: null,
    close: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
  writable: true
});
Object.defineProperty(Notification, 'permission', {
  value: 'granted',
  writable: true
});
Object.defineProperty(Notification, 'requestPermission', {
  value: jest.fn().mockResolvedValue('granted'),
  writable: true
});

// Install on window as well
Object.defineProperty(window, 'Notification', {
  value: global.Notification,
  writable: true
});

// Mock WebSocket to prevent real network connections during tests
class MockWebSocket {
  url: string;
  readyState: number = 0; // CONNECTING
  onopen: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;

  constructor(url: string) {
    this.url = url;
    // Simulate immediate connection failure to prevent hanging
    setTimeout(() => {
      this.readyState = 3; // CLOSED
      if (this.onerror) {
        this.onerror(new Event('error'));
      }
      if (this.onclose) {
        this.onclose(new CloseEvent('close', { code: 1006, reason: 'Test mock connection failed' }));
      }
    }, 0);
  }

  send(_data: string | ArrayBufferLike | Blob | ArrayBufferView) {
    // Mock send - do nothing
  }

  close(code?: number, reason?: string) {
    this.readyState = 3; // CLOSED
    if (this.onclose) {
      this.onclose(new CloseEvent('close', { code: code || 1000, reason: reason || 'Normal closure' }));
    }
  }

  addEventListener(_type: string, _listener: EventListener) {
    // Mock event listener
  }

  removeEventListener(_type: string, _listener: EventListener) {
    // Mock event listener removal
  }
}

// Install WebSocket mock
(global as any).WebSocket = MockWebSocket;
(window as any).WebSocket = MockWebSocket;

// Mock RTCPeerConnection with proper TypeScript interface
class MockRTCPeerConnection implements Partial<RTCPeerConnection> {
  localDescription: RTCSessionDescription | null = null;
  remoteDescription: RTCSessionDescription | null = null;
  connectionState: RTCPeerConnectionState = 'new';
  iceConnectionState: RTCIceConnectionState = 'new';
  iceGatheringState: RTCIceGatheringState = 'new';
  onicecandidate: ((event: RTCPeerConnectionIceEvent) => void) | null = null;
  onconnectionstatechange: ((event: Event) => void) | null = null;
  ondatachannel: ((event: RTCDataChannelEvent) => void) | null = null;
  
  createDataChannel = jest.fn().mockReturnValue({
    readyState: 'open',
    send: jest.fn(),
    close: jest.fn(),
    onmessage: null,
    onopen: null,
    onclose: null,
  });
  
  createOffer = jest.fn().mockResolvedValue({ type: 'offer', sdp: 'mock-sdp-offer' });
  createAnswer = jest.fn().mockResolvedValue({ type: 'answer', sdp: 'mock-sdp-answer' });
  setLocalDescription = jest.fn().mockResolvedValue(undefined);
  setRemoteDescription = jest.fn().mockResolvedValue(undefined);
  addIceCandidate = jest.fn().mockResolvedValue(undefined);
  close = jest.fn();
  
  // Static method required by RTCPeerConnection interface
  static generateCertificate = jest.fn().mockResolvedValue({} as RTCCertificate);

  constructor(_configuration?: RTCConfiguration) {
    // Constructor can be empty for mock
  }
}

// Mock WebCrypto for secure connection tests
const mockCrypto = {
  subtle: {
    generateKey: jest.fn().mockImplementation((algorithm: any) => {
      if (algorithm.name === 'ECDH') {
        return Promise.resolve({
          publicKey: { type: 'public', algorithm, extractable: true } as any,
          privateKey: { type: 'private', algorithm, extractable: true } as any,
        });
      } else if (algorithm.name === 'AES-GCM') {
        return Promise.resolve({ type: 'secret', algorithm, extractable: true } as any);
      }
      return Promise.resolve({
        publicKey: { type: 'public', algorithm, extractable: true } as any,
        privateKey: { type: 'private', algorithm, extractable: true } as any,
      });
    }),
    exportKey: jest.fn().mockImplementation((format: string, key: any) => {
      if (format === 'jwk') {
        return Promise.resolve({
          kty: 'EC',
          crv: 'P-256',
          x: `mock-x-coordinate-${Math.random().toString(36).substr(2, 9)}`,
          y: `mock-y-coordinate-${Math.random().toString(36).substr(2, 9)}`,
          d: key.type === 'private' ? `mock-private-value-${Math.random().toString(36).substr(2, 9)}` : undefined,
          use: 'enc',
          key_ops: ['deriveKey', 'deriveBits'],
        } as JsonWebKey);
      }
      return Promise.resolve({ key: 'mock-exported-key' });
    }),
    importKey: jest.fn().mockResolvedValue({ key: 'mock-imported-key' } as any),
    encrypt: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4]).buffer),
    decrypt: jest.fn().mockImplementation(() => {
      return Promise.resolve(new TextEncoder().encode('decrypted-message').buffer);
    }),
    deriveBits: jest.fn().mockResolvedValue(new Uint8Array([9, 10, 11, 12]).buffer),
    deriveKey: jest.fn().mockResolvedValue({ key: 'mock-derived-key' } as any),
    sign: jest.fn().mockResolvedValue(new Uint8Array([5, 6, 7, 8]).buffer),
    verify: jest.fn().mockResolvedValue(true),
    digest: jest.fn().mockResolvedValue(new Uint8Array([13, 14, 15, 16]).buffer),
    unwrapKey: jest.fn().mockResolvedValue({ key: 'mock-unwrapped-key' } as any),
    wrapKey: jest.fn().mockResolvedValue(new Uint8Array([17, 18, 19, 20]).buffer),
  },
  getRandomValues: jest.fn((array: any) => {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  }),
  randomUUID: jest.fn(() => 'mock-uuid-1234-5678-9012-3456'),
};

// Install the mocks with type assertions
(global as any).RTCPeerConnection = MockRTCPeerConnection;
(global as any).crypto = { ...global.crypto, ...mockCrypto };

// Also mock window.crypto for browser-style access
Object.defineProperty(window, 'crypto', {
  writable: true,
  value: mockCrypto,
});

// Mock Notification API for jsdom environment
Object.defineProperty(global, 'Notification', {
  value: class MockNotification {
    static permission = 'default';
    static requestPermission = jest.fn().mockResolvedValue('granted');
    
    constructor(_title: string, _options?: NotificationOptions) {
      // Mock notification constructor
    }
    
    close = jest.fn();
    addEventListener = jest.fn();
    removeEventListener = jest.fn();
  },
  writable: true
});
