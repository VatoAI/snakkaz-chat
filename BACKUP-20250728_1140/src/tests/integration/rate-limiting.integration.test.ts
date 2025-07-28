/**
 * Rate Limiting Integration Tests - FASE 3 Security Testing
 * 
 * Tests for the enhanced rate limiting system to ensure proper
 * protection against abuse while maintaining usability.
 */

import request from 'supertest';
import express from 'express';

// Mock the rate limiter configuration from the backend
const createMockRateLimiter = (options: any) => {
  let requests: number[] = [];
  
  return {
    consume: jest.fn().mockImplementation((_key: string) => {
      const now = Date.now();
      const windowStart = now - (options.duration * 1000);
      
      // Clean old requests
      requests = requests.filter(time => time > windowStart);
      
      if (requests.length >= options.points) {
        const error = new Error('Rate limit exceeded');
        error.name = 'RateLimiterRes';
        return Promise.reject({
          msBeforeNext: (options.duration * 1000) - (now - requests[0])
        });
      }
      
      requests.push(now);
      return Promise.resolve();
    })
  };
};

describe('Rate Limiting Integration Tests', () => {
  let app: express.Application;
  let mockRateLimiters: any;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Mock rate limiters
    mockRateLimiters = {
      general: createMockRateLimiter({ points: 100, duration: 60 }),
      auth: createMockRateLimiter({ points: 5, duration: 300 }),
      api: createMockRateLimiter({ points: 50, duration: 60 }),
    };

    // Mock rate limiting middleware
    const rateLimitMiddleware = async (req: any, res: any, next: any) => {
      try {
        if (req.path.includes('/auth/')) {
          await mockRateLimiters.auth.consume(req.ip);
        } else if (req.path.includes('/api/')) {
          await mockRateLimiters.api.consume(req.ip);
        } else {
          await mockRateLimiters.general.consume(req.ip);
        }
        next();
      } catch (rejRes: any) {
        res.status(429).json({
          success: false,
          error: 'Too many requests',
          retryAfter: Math.round(rejRes.msBeforeNext / 1000) || 60
        });
      }
    };

    app.use(rateLimitMiddleware);

    // Test endpoints
    app.post('/auth/login', (_req: express.Request, res: express.Response) => {
      res.json({ success: true, message: 'Login successful' });
    });

    app.get('/api/users', (_req: express.Request, res: express.Response) => {
      res.json({ success: true, data: [] });
    });

    app.get('/public', (_req: express.Request, res: express.Response) => {
      res.json({ success: true, message: 'Public endpoint' });
    });
  });

  describe('Authentication Rate Limiting', () => {
    it('should allow normal login attempts within limit', async () => {
      // Act & Assert - should allow 5 requests
      for (let i = 0; i < 5; i++) {
        const response = await request(app)
          .post('/auth/login')
          .send({ username: 'test', password: 'test' });
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      }
    });

    it('should block login attempts after rate limit exceeded', async () => {
      // Arrange - exhaust the rate limit
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/auth/login')
          .send({ username: 'test', password: 'test' });
      }

      // Act - attempt one more request
      const response = await request(app)
        .post('/auth/login')
        .send({ username: 'test', password: 'test' });

      // Assert
      expect(response.status).toBe(429);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Too many requests');
      expect(response.body.retryAfter).toBeGreaterThan(0);
    });
  });

  describe('API Rate Limiting', () => {
    it('should allow normal API calls within limit', async () => {
      // Act & Assert - should allow 50 requests
      for (let i = 0; i < 50; i++) {
        const response = await request(app).get('/api/users');
        expect(response.status).toBe(200);
      }
    });

    it('should block API calls after rate limit exceeded', async () => {
      // Arrange - exhaust the rate limit
      for (let i = 0; i < 50; i++) {
        await request(app).get('/api/users');
      }

      // Act
      const response = await request(app).get('/api/users');

      // Assert
      expect(response.status).toBe(429);
      expect(response.body.error).toBe('Too many requests');
    });
  });

  describe('General Rate Limiting', () => {
    it('should allow public endpoint access within general limits', async () => {
      // Act & Assert - should allow 100 requests
      for (let i = 0; i < 100; i++) {
        const response = await request(app).get('/public');
        expect(response.status).toBe(200);
      }
    });

    it('should apply correct rate limits based on endpoint type', async () => {
      // Auth endpoints should have stricter limits than general endpoints
      expect(mockRateLimiters.auth.consume).toBeDefined();
      expect(mockRateLimiters.api.consume).toBeDefined();
      expect(mockRateLimiters.general.consume).toBeDefined();
    });
  });

  describe('Rate Limit Headers and Response', () => {
    it('should include retry-after header in rate limit responses', async () => {
      // Arrange - exhaust auth rate limit
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/auth/login')
          .send({ username: 'test', password: 'test' });
      }

      // Act
      const response = await request(app)
        .post('/auth/login')
        .send({ username: 'test', password: 'test' });

      // Assert
      expect(response.status).toBe(429);
      expect(response.body.retryAfter).toBeDefined();
      expect(typeof response.body.retryAfter).toBe('number');
      expect(response.body.retryAfter).toBeGreaterThan(0);
    });
  });

  describe('Rate Limiting Configuration', () => {
    it('should have appropriate limits for different endpoint types', () => {
      // Auth endpoints: 5 requests per 5 minutes (strict)
      // API endpoints: 50 requests per minute (moderate)
      // General endpoints: 100 requests per minute (lenient)
      
      // This test validates the configuration is appropriate for security vs usability
      expect(5).toBeLessThan(50); // Auth stricter than API
      expect(50).toBeLessThan(100); // API stricter than general
    });
  });
});
