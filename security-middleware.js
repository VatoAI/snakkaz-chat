import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';

dotenv.config();

// Security Configuration
export const securityConfig = {
    jwtSecret: process.env.JWT_SECRET || 'snakkaz_fallback_secret',
    apiKey: process.env.API_KEY || 'snakkaz_fallback_api_key',
    adminPassword: process.env.ADMIN_PASSWORD || 'SnakkaZ_Admin_Default',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    maxPayloadSize: process.env.MAX_PAYLOAD_SIZE || '10mb'
};

// Rate Limiting Middleware
export const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
    return rateLimit({
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || windowMs,
        max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || max,
        message: {
            error: 'Too many requests from this IP',
            retryAfter: Math.ceil(windowMs / 1000),
            code: 'RATE_LIMIT_EXCEEDED'
        },
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
            console.log(`🚫 Rate limit exceeded for IP: ${req.ip}`);
            res.status(429).json({
                error: 'Too many requests',
                message: 'Please slow down your requests',
                retryAfter: Math.ceil(windowMs / 1000)
            });
        }
    });
};

// JWT Authentication Middleware
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ 
            error: 'Access token required',
            code: 'TOKEN_MISSING' 
        });
    }

    jwt.verify(token, securityConfig.jwtSecret, (err, user) => {
        if (err) {
            console.log('🔴 Invalid token attempt:', err.message);
            return res.status(403).json({ 
                error: 'Invalid or expired token',
                code: 'TOKEN_INVALID' 
            });
        }
        req.user = user;
        next();
    });
};

// API Key Authentication Middleware
export const authenticateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;

    if (!apiKey) {
        return res.status(401).json({ 
            error: 'API key required',
            code: 'API_KEY_MISSING' 
        });
    }

    if (apiKey !== securityConfig.apiKey) {
        console.log('🔴 Invalid API key attempt:', apiKey);
        return res.status(403).json({ 
            error: 'Invalid API key',
            code: 'API_KEY_INVALID' 
        });
    }

    next();
};

// Input Validation Schemas
export const validationSchemas = {
    knowledgeSearch: [
        body('query')
            .trim()
            .isLength({ min: 1, max: 500 })
            .withMessage('Query must be between 1 and 500 characters')
            .escape(),
        body('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100')
    ],
    
    knowledgeLoad: [
        body('facts')
            .isArray({ min: 1, max: 50 })
            .withMessage('Facts must be an array with 1-50 items'),
        body('facts.*')
            .trim()
            .isLength({ min: 10, max: 1000 })
            .withMessage('Each fact must be between 10 and 1000 characters')
            .escape()
    ],

    adminAuth: [
        body('password')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters'),
        body('username')
            .trim()
            .isLength({ min: 3, max: 50 })
            .withMessage('Username must be between 3 and 50 characters')
            .isAlphanumeric()
            .withMessage('Username must contain only letters and numbers')
    ]
};

// Validation Error Handler
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('🔴 Validation failed:', errors.array());
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array(),
            code: 'VALIDATION_ERROR'
        });
    }
    next();
};

// Generate JWT Token
export const generateToken = (payload, expiresIn = '24h') => {
    return jwt.sign(payload, securityConfig.jwtSecret, { expiresIn });
};

// Helmet Security Configuration
export const helmetConfig = {
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "http://localhost:3003", "http://localhost:6333"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"]
        }
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
};

// Admin Authentication
export const authenticateAdmin = async (req, res, next) => {
    const { username, password } = req.body;
    
    // Simple admin check (in production, use proper user database)
    if (username === 'admin' && password === securityConfig.adminPassword) {
        const token = generateToken({ 
            username, 
            role: 'admin',
            permissions: ['read', 'write', 'admin']
        });
        
        req.adminToken = token;
        next();
    } else {
        console.log('🔴 Failed admin login attempt:', username);
        return res.status(401).json({ 
            error: 'Invalid admin credentials',
            code: 'ADMIN_AUTH_FAILED' 
        });
    }
};

// Error Handling Middleware
export const errorHandler = (err, req, res, next) => {
    console.error('🔴 Unhandled error:', err);
    
    // JWT specific errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Invalid token',
            code: 'TOKEN_MALFORMED'
        });
    }
    
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'Token expired',
            code: 'TOKEN_EXPIRED'
        });
    }
    
    // Rate limiting errors
    if (err.type === 'entity.too.large') {
        return res.status(413).json({
            error: 'Payload too large',
            code: 'PAYLOAD_TOO_LARGE'
        });
    }
    
    // Generic server error
    res.status(500).json({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
};

// Security Headers Middleware
export const securityHeaders = (req, res, next) => {
    res.setHeader('X-Powered-By', 'SnakkaZ MCP Brain');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
};

export default {
    securityConfig,
    createRateLimiter,
    authenticateToken,
    authenticateApiKey,
    validationSchemas,
    handleValidationErrors,
    generateToken,
    helmetConfig,
    authenticateAdmin,
    errorHandler,
    securityHeaders
};
