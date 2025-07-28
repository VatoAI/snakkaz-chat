// Comprehensive Security Configuration

export interface SecurityConfig {
  auth: {
    jwtSecret: string;
    jwtExpiresIn: string;
    bcryptRounds: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
    skipSuccessfulRequests: boolean;
  };
  cors: {
    origin: string[];
    credentials: boolean;
    methods: string[];
  };
  headers: {
    contentSecurityPolicy: string;
    xFrameOptions: string;
    xContentTypeOptions: string;
  };
  encryption: {
    algorithm: string;
    keyLength: number;
  };
}

export const securityConfig: SecurityConfig = {
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5'),
    lockoutDuration: parseInt(process.env.LOCKOUT_DURATION || '900000') // 15 minutes
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    skipSuccessfulRequests: false
  },
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://snakkaz.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  },
  headers: {
    contentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
    xFrameOptions: 'DENY',
    xContentTypeOptions: 'nosniff'
  },
  encryption: {
    algorithm: 'aes-256-gcm',
    keyLength: 32
  }
};

// Security validation functions
export const validateEnvironment = (): string[] => {
  const issues: string[] = [];
  
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    issues.push('JWT_SECRET is missing or too short (minimum 32 characters)');
  }
  
  if (!process.env.DATABASE_URL) {
    issues.push('DATABASE_URL is not configured');
  }
  
  if (process.env.NODE_ENV === 'production' && !process.env.SUPABASE_URL?.startsWith('https://')) {
    issues.push('SUPABASE_URL should use HTTPS in production');
  }
  
  return issues;
};
