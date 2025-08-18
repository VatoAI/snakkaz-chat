import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { securityConfig } from '../security-config';

export interface LoginAttempt {
  email: string;
  attempts: number;
  lastAttempt: Date;
  lockedUntil?: Date;
}

class AuthSecurity {
  private loginAttempts = new Map<string, LoginAttempt>();

  async hashPassword(password: string): Promise<string> {
    // Validate password strength
    if (!this.isPasswordStrong(password)) {
      throw new Error('Password does not meet security requirements');
    }
    
    return await bcrypt.hash(password, securityConfig.auth.bcryptRounds);
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  generateJWT(payload: object): string {
    return jwt.sign(payload, securityConfig.auth.jwtSecret, {
      expiresIn: securityConfig.auth.jwtExpiresIn
    });
  }

  verifyJWT(token: string): any {
    try {
      return jwt.verify(token, securityConfig.auth.jwtSecret);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  isPasswordStrong(password: string): boolean {
    // Password requirements:
    // - At least 8 characters
    // - Contains uppercase and lowercase letters
    // - Contains at least one number
    // - Contains at least one special character
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  }

  checkLoginAttempts(email: string): boolean {
    const attempt = this.loginAttempts.get(email);
    
    if (!attempt) return true;
    
    // Check if account is locked
    if (attempt.lockedUntil && attempt.lockedUntil > new Date()) {
      return false;
    }
    
    // Reset if lockout period has passed
    if (attempt.lockedUntil && attempt.lockedUntil <= new Date()) {
      this.loginAttempts.delete(email);
      return true;
    }
    
    return attempt.attempts < securityConfig.auth.maxLoginAttempts;
  }

  recordFailedLogin(email: string): void {
    const now = new Date();
    const attempt = this.loginAttempts.get(email) || {
      email,
      attempts: 0,
      lastAttempt: now
    };

    attempt.attempts++;
    attempt.lastAttempt = now;

    // Lock account if max attempts reached
    if (attempt.attempts >= securityConfig.auth.maxLoginAttempts) {
      attempt.lockedUntil = new Date(now.getTime() + securityConfig.auth.lockoutDuration);
    }

    this.loginAttempts.set(email, attempt);
  }

  recordSuccessfulLogin(email: string): void {
    this.loginAttempts.delete(email);
  }

  sanitizeInput(input: string): string {
    return input
      .replace(/[<>\"']/g, '') // Remove potentially dangerous characters
      .trim()
      .substring(0, 1000); // Limit length
  }
}

export const authSecurity = new AuthSecurity();
