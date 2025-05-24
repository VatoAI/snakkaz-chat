import * as OTPAuth from 'otpauth';

describe('OTP Verification', () => {
  test('should correctly generate and validate OTP tokens', () => {
    // Generate a random secret key in hex format
    const hexString = Array.from(
      { length: 32 }, 
      () => Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    // Create OTP Secret
    const secret = OTPAuth.Secret.fromHex(hexString);
    
    // Create TOTP object
    const totp = new OTPAuth.TOTP({
      issuer: 'Snakkaz',
      label: 'test@example.com',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secret
    });
    
    // Generate token
    const token = totp.generate();
    
    // Token should be 6 digits
    expect(token).toMatch(/^\d{6}$/);
    
    // Validate token
    const delta = totp.validate({ token, window: 1 });
    expect(delta).not.toBeNull();
  });
  
  test('should reject invalid tokens', () => {
    // Create OTP Secret
    const secret = OTPAuth.Secret.fromHex('0123456789abcdef0123456789abcdef');
    
    // Create TOTP object
    const totp = new OTPAuth.TOTP({
      issuer: 'Snakkaz',
      label: 'test@example.com',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secret
    });
    
    // Validate an obviously wrong token
    const delta = totp.validate({ token: '000000', window: 1 });
    
    // Should likely be null for an invalid token
    expect(delta).toBeNull();
  });
});
