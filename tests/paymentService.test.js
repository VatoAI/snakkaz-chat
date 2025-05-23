const { paymentService } = require('../src/server/paymentService');
const { supabase } = require('../src/lib/supabaseClient');

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

// Mock nodemailer
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockImplementation(() => ({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' })
  }))
}));

describe('PaymentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mocked supabase responses
    supabase.data = null;
    supabase.error = null;
  });

  describe('createPaymentRequest', () => {
    test('should successfully create a payment request', async () => {
      // Mock supabase response
      const mockPayment = {
        id: 'test-payment-id',
        bitcoin_address: 'bc1qtest',
        btc_amount: 0.001,
        status: 'pending',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
      
      supabase.data = { ...mockPayment };
      supabase.from.mockReturnThis();
      supabase.insert.mockReturnThis();
      supabase.select.mockReturnThis();
      supabase.single.mockResolvedValue({ data: mockPayment, error: null });
      
      // Mock generatePaymentAddress
      paymentService.generatePaymentAddress = jest.fn().mockResolvedValue('bc1qtest');
      
      // Mock convertToBitcoin
      paymentService.convertToBitcoin = jest.fn().mockResolvedValue(0.001);

      // Create payment request
      const result = await paymentService.createPaymentRequest({
        user_id: 'user-123',
        amount: 100,
        currency: 'NOK',
        product_type: 'subscription',
        product_id: 'plan-premium'
      });

      // Assertions
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.payment).toEqual(mockPayment);
      expect(paymentService.generatePaymentAddress).toHaveBeenCalled();
      expect(paymentService.convertToBitcoin).toHaveBeenCalledWith(100, 'NOK');
    });

    test('should handle payment creation errors', async () => {
      // Mock error response
      supabase.insert.mockReturnThis();
      supabase.single.mockResolvedValue({ data: null, error: { message: 'Database error' } });
      
      // Mock methods
      paymentService.generatePaymentAddress = jest.fn().mockResolvedValue('bc1qtest');
      paymentService.convertToBitcoin = jest.fn().mockResolvedValue(0.001);

      // Create payment request
      const result = await paymentService.createPaymentRequest({
        user_id: 'user-123',
        amount: 100,
        currency: 'NOK',
        product_type: 'subscription',
        product_id: 'plan-premium'
      });

      // Assertions
      expect(result).toBeDefined();
      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });
  });

  describe('checkPaymentStatus', () => {
    test('should detect confirmed payments', async () => {
      // Mock supabase response for payment
      const mockPayment = {
        id: 'test-payment-id',
        bitcoin_address: 'bc1qtest',
        btc_amount: 0.001,
        status: 'pending',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
      
      supabase.from.mockReturnThis();
      supabase.select.mockReturnThis();
      supabase.eq.mockReturnThis();
      supabase.single.mockResolvedValue({ data: mockPayment, error: null });
      
      // Mock blockchain response
      paymentService.checkBlockchainForPayment = jest.fn().mockResolvedValue({
        txid: 'test-tx-id',
        amount: 0.001,
        confirmations: 4,
        blockHeight: 700500,
        timestamp: Date.now()
      });
      
      // Mock update payment status
      paymentService.updatePaymentStatus = jest.fn().mockResolvedValue({
        success: true,
        payment: { ...mockPayment, status: 'confirmed', transaction_id: 'test-tx-id' }
      });

      // Check payment status
      const result = await paymentService.checkPaymentStatus('test-payment-id');

      // Assertions
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.payment.status).toBe('confirmed');
      expect(paymentService.checkBlockchainForPayment).toHaveBeenCalled();
      expect(paymentService.updatePaymentStatus).toHaveBeenCalled();
    });

    test('should handle expired payments', async () => {
      // Mock expired payment
      const mockPayment = {
        id: 'test-payment-id',
        bitcoin_address: 'bc1qtest',
        btc_amount: 0.001,
        status: 'pending',
        created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        expires_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      };
      
      supabase.from.mockReturnThis();
      supabase.select.mockReturnThis();
      supabase.eq.mockReturnThis();
      supabase.single.mockResolvedValue({ data: mockPayment, error: null });
      
      // No blockchain transaction
      paymentService.checkBlockchainForPayment = jest.fn().mockResolvedValue(null);
      
      // Mock update payment status
      paymentService.updatePaymentStatus = jest.fn().mockResolvedValue({
        success: true,
        payment: { ...mockPayment, status: 'failed' }
      });

      // Check payment status
      const result = await paymentService.checkPaymentStatus('test-payment-id');

      // Assertions
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.payment.status).toBe('failed');
      expect(paymentService.updatePaymentStatus).toHaveBeenCalledWith('test-payment-id', 'failed');
    });
  });

  describe('verifyPayment', () => {
    test('should verify payment with admin notes', async () => {
      // Mock admin verification
      paymentService.updatePaymentStatus = jest.fn().mockResolvedValue({
        success: true,
        payment: {
          id: 'test-payment-id',
          status: 'completed',
          admin_notes: 'Manually verified'
        }
      });

      // Verify payment
      const result = await paymentService.verifyPayment({
        payment_id: 'test-payment-id',
        admin_id: 'admin-123',
        new_status: 'completed',
        admin_notes: 'Manually verified',
        ip_address: '127.0.0.1'
      });

      // Assertions
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(paymentService.updatePaymentStatus).toHaveBeenCalled();
    });
  });
});
