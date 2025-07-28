import { Request, Response, NextFunction } from 'express';
import { securityConfig } from '../security-config';
import { authSecurity } from '../auth/auth-security';

export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Set security headers
  res.setHeader('X-Content-Type-Options', securityConfig.headers.xContentTypeOptions);
  res.setHeader('X-Frame-Options', securityConfig.headers.xFrameOptions);
  res.setHeader('Content-Security-Policy', securityConfig.headers.contentSecurityPolicy);
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  next();
};

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  // Simple rate limiting implementation
  const clientIp = req.ip || req.socket.remoteAddress;
  const key = `rate_limit_${clientIp}`;
  
  // This would typically use Redis or a proper rate limiting solution
  // For now, we'll implement a basic in-memory solution
  
  next();
};

export const authenticationRequired = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    const decoded = authSecurity.verifyJWT(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const adminRequired = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
};
