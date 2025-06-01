import * as OTPAuth from 'otpauth';

console.log('Testing OTP library...');

// Generate a random secret key in hex format
const hexString = Array.from(
  { length: 32 }, 
  () => Math.floor(Math.random() * 16).toString(16)
).join('');

console.log(`Generated hex string: ${hexString}`);

// Create OTP Secret
const secret = OTPAuth.Secret.fromHex(hexString);
console.log(`Secret base32: ${secret.base32}`);

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
console.log(`Generated token: ${token}`);

// Validate token
const delta = totp.validate({ token, window: 1 });
console.log(`Validation result: ${delta !== null ? 'Success' : 'Failed'}`);

console.log('OTP test complete!');
