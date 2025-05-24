const { electrumConnector } = require('../src/server/payments/electrumConnector');
const { bitcoinElectrumAdapter } = require('../src/server/payments/bitcoinElectrumAdapter');

// Mock dependencies
jest.mock('../src/lib/supabaseClient', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    data: null,
    error: null,
  }
}));

// Mock net module
jest.mock('net', () => {
  const mockSocket = {
    connect: jest.fn((port, host, cb) => {
      setTimeout(cb, 10);
      return mockSocket;
    }),
    write: jest.fn(),
    on: jest.fn(),
    destroy: jest.fn()
  };
  
  return {
    Socket: jest.fn(() => mockSocket)
  };
});

// Mock fs module
jest.mock('fs', () => ({
  existsSync: jest.fn(() => true),
  mkdirSync: jest.fn(),
  readFileSync: jest.fn(() => JSON.stringify({ 'test-tx': { txid: 'test-tx' } })),
  writeFileSync: jest.fn()
}));

describe('Electrum Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset Electrum connector
    electrumConnector.client = null;
    electrumConnector.isConnected = false;
    electrumConnector.requestCounter = 0;
    electrumConnector.pendingRequests = new Map();
  });

  describe('ElectrumConnector', () => {
    test('should connect to Electrum server', async () => {
      const net = require('net');
      const mockSocket = net.Socket();
      
      await electrumConnector.connect();
      
      expect(mockSocket.connect).toHaveBeenCalled();
      expect(mockSocket.on).toHaveBeenCalledWith('data', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('error', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('close', expect.any(Function));
      expect(electrumConnector.isConnected).toBe(true);
    });

    test('should send request to Electrum server', async () => {
      const net = require('net');
      const mockSocket = net.Socket();
      
      // Mock socket write to resolve request
      mockSocket.write.mockImplementation((data) => {
        const request = JSON.parse(data);
        const { id, method } = request;
        
        setTimeout(() => {
          const responseHandler = electrumConnector._handleResponse.bind(electrumConnector);
          const response = JSON.stringify({
            id,
            result: method === 'getbalance' ? { confirmed: 100000, unconfirmed: 50000 } : 'success'
          });
          
          responseHandler(Buffer.from(response));
        }, 10);
        
        return true;
      });
      
      await electrumConnector.connect();
      const result = await electrumConnector.sendRequest('getbalance');
      
      expect(mockSocket.write).toHaveBeenCalled();
      expect(result).toEqual({ confirmed: 100000, unconfirmed: 50000 });
    });
    
    test('should handle connection errors', async () => {
      const net = require('net');
      const mockSocket = net.Socket();
      
      // Mock connection to fail
      mockSocket.connect.mockImplementation((port, host, cb) => {
        setTimeout(() => {
          const errorHandler = mockSocket.on.mock.calls.find(call => call[0] === 'error')[1];
          errorHandler(new Error('Connection failed'));
        }, 10);
        return mockSocket;
      });
      
      await expect(electrumConnector.connect()).rejects.toThrow();
      expect(electrumConnector.isConnected).toBe(false);
    });
  });

  describe('BitcoinElectrumAdapter', () => {
    test('should create payment request', async () => {
      // Setup mocks
      const electrumConnector = require('../src/server/payments/electrumConnector').electrumConnector;
      electrumConnector.createPaymentRequest = jest.fn().mockResolvedValue({
        address: 'bc1qtest',
        btcAmount: 0.001,
        paymentRef: 'test-ref'
      });
      
      const { supabase } = require('../src/lib/supabaseClient');
      supabase.insert.mockReturnThis();
      supabase.error = null;
      
      const result = await bitcoinElectrumAdapter.createPaymentRequest({
        userId: 'user-123',
        amount: 100,
        currency: 'NOK',
        productId: 'premium',
        id: 'payment-123'
      });
      
      expect(result).toEqual({
        bitcoin_address: 'bc1qtest',
        btc_amount: 0.001,
        payment_reference: 'test-ref'
      });
      expect(electrumConnector.createPaymentRequest).toHaveBeenCalled();
    });
    
    test('should check blockchain for payment', async () => {
      const electrumConnector = require('../src/server/payments/electrumConnector').electrumConnector;
      electrumConnector.checkPayment = jest.fn().mockResolvedValue({
        received: true,
        confirmed: true,
        amount: 100000 // 0.001 BTC in satoshis
      });
      
      const result = await bitcoinElectrumAdapter.checkBlockchainForPayment({
        bitcoin_address: 'bc1qtest',
        id: 'payment-123'
      });
      
      expect(result).toEqual({
        txid: expect.any(String),
        amount: 0.001,
        confirmations: expect.any(Number),
        blockHeight: expect.any(Number),
        timestamp: expect.any(Number)
      });
      expect(electrumConnector.checkPayment).toHaveBeenCalledWith('bc1qtest');
    });
  });
});
