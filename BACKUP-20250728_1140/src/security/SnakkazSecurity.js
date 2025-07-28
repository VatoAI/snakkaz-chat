/**
 * SnakkaZ Beta - Advanced Security & Anti-Spam System
 * Protects against bots, spam, suspicious users, and hacking attempts
 * Created: 2025-07-22
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wqpoozpbceucynsojmbk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8';

class SnakkazSecurity {
    constructor() {
        this.supabase = createClient(supabaseUrl, supabaseKey);
        this.sessionId = this.generateSessionId();
        this.suspiciousScore = 0;
        this.botScore = 0;
        this.lastActivity = Date.now();
        
        // Rate limiting storage
        this.rateLimits = new Map();
        
        // Spam detection patterns
        this.spamPatterns = [
            /\b(viagra|casino|lottery|winner|congratulations)\b/i,
            /\b(click here|buy now|limited time|act now)\b/i,
            /\b(make money|work from home|guaranteed)\b/i,
            /[A-Z]{10,}/, // Too many caps
            /(.)\1{5,}/, // Repeated characters
            /\$\d+|\d+\$/, // Money amounts
        ];
        
        this.initializeSecurity();
    }

    generateSessionId() {
        return 'sec_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    async initializeSecurity() {
        console.log('🛡️ SnakkaZ Security: Initializing protection systems...');
        
        // Start monitoring
        this.startBehaviorAnalysis();
        this.setupRateLimiting();
        this.monitorNetworkRequests();
        this.setupCaptchaSystem();
        
        // Check if user is on blacklist
        await this.checkUserStatus();
    }

    // === BOT DETECTION ===
    startBehaviorAnalysis() {
        let mouseMovements = 0;
        let keystrokes = 0;
        let clickPattern = [];
        let startTime = Date.now();

        // Monitor mouse movements (humans have irregular patterns)
        document.addEventListener('mousemove', (event) => {
            mouseMovements++;
            this.lastActivity = Date.now();
            
            // Check for robotic straight-line movements
            if (this.lastMouseEvent) {
                const deltaX = Math.abs(event.clientX - this.lastMouseEvent.clientX);
                const deltaY = Math.abs(event.clientY - this.lastMouseEvent.clientY);
                
                if (deltaX === 0 || deltaY === 0) {
                    this.botScore += 0.1; // Straight lines are suspicious
                }
            }
            this.lastMouseEvent = event;
        });

        // Monitor keyboard activity (humans have irregular timing)
        document.addEventListener('keydown', (event) => {
            keystrokes++;
            this.lastActivity = Date.now();
            
            if (this.lastKeyEvent) {
                const timeDiff = Date.now() - this.lastKeyEvent;
                if (timeDiff < 50 || timeDiff > 2000) {
                    this.botScore += 0.1; // Too fast or too slow
                }
            }
            this.lastKeyEvent = Date.now();
        });

        // Monitor click patterns (bots often click too regularly)
        document.addEventListener('click', (event) => {
            const now = Date.now();
            clickPattern.push(now);
            
            // Keep only last 10 clicks
            if (clickPattern.length > 10) {
                clickPattern.shift();
            }
            
            // Check for regular intervals (bot behavior)
            if (clickPattern.length >= 5) {
                const intervals = [];
                for (let i = 1; i < clickPattern.length; i++) {
                    intervals.push(clickPattern[i] - clickPattern[i-1]);
                }
                
                const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
                const variance = intervals.reduce((a, b) => a + Math.pow(b - avgInterval, 2), 0) / intervals.length;
                
                if (variance < 100) { // Very regular clicking
                    this.botScore += 0.5;
                    this.flagSuspiciousActivity('regular_clicking', { variance, avgInterval });
                }
            }
        });

        // Analyze behavior every 30 seconds
        setInterval(() => {
            const timeElapsed = (Date.now() - startTime) / 1000;
            const activityScore = this.calculateActivityScore(mouseMovements, keystrokes, timeElapsed);
            
            if (activityScore > 0.7) {
                this.botScore += 0.3;
                this.flagSuspiciousActivity('high_activity_score', { score: activityScore });
            }
            
            // Reset counters
            mouseMovements = 0;
            keystrokes = 0;
            startTime = Date.now();
        }, 30000);
    }

    calculateActivityScore(mouseMovements, keystrokes, timeElapsed) {
        const mouseRate = mouseMovements / timeElapsed;
        const keystrokeRate = keystrokes / timeElapsed;
        
        // Humans typically have 1-10 mouse movements per second
        // and 0.5-5 keystrokes per second during active use
        let score = 0;
        
        if (mouseRate > 20) score += 0.3; // Too many mouse movements
        if (keystrokeRate > 10) score += 0.3; // Too many keystrokes
        if (mouseRate === 0 && timeElapsed > 10) score += 0.2; // No mouse movement
        if (keystrokeRate === 0 && timeElapsed > 30) score += 0.1; // No typing
        
        return Math.min(score, 1);
    }

    // === SPAM DETECTION ===
    analyzeTextForSpam(text) {
        let spamScore = 0;
        const reasons = [];

        // Check against spam patterns
        this.spamPatterns.forEach((pattern, index) => {
            if (pattern.test(text)) {
                spamScore += 0.2;
                reasons.push(`Pattern ${index + 1} matched`);
            }
        });

        // Check for excessive repetition
        const words = text.toLowerCase().split(/\s+/);
        const wordCounts = {};
        words.forEach(word => {
            wordCounts[word] = (wordCounts[word] || 0) + 1;
        });

        const maxRepeats = Math.max(...Object.values(wordCounts));
        if (maxRepeats > 3) {
            spamScore += 0.1 * (maxRepeats - 3);
            reasons.push('Excessive word repetition');
        }

        // Check for excessive punctuation or caps
        const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
        if (capsRatio > 0.5) {
            spamScore += 0.2;
            reasons.push('Too many capital letters');
        }

        const punctuationRatio = (text.match(/[!?.,;:]/g) || []).length / text.length;
        if (punctuationRatio > 0.3) {
            spamScore += 0.1;
            reasons.push('Excessive punctuation');
        }

        // Check for URLs
        if (text.match(/https?:\/\/|www\./)) {
            spamScore += 0.1;
            reasons.push('Contains URLs');
        }

        return {
            isSpam: spamScore > 0.5,
            score: Math.min(spamScore, 1),
            reasons: reasons
        };
    }

    // === RATE LIMITING ===
    setupRateLimiting() {
        this.rateLimits.set('message', { count: 0, resetTime: Date.now() + 60000, limit: 10 });
        this.rateLimits.set('product', { count: 0, resetTime: Date.now() + 300000, limit: 5 });
        this.rateLimits.set('group_create', { count: 0, resetTime: Date.now() + 600000, limit: 3 });
        this.rateLimits.set('login', { count: 0, resetTime: Date.now() + 300000, limit: 5 });
    }

    checkRateLimit(action) {
        const limit = this.rateLimits.get(action);
        if (!limit) return { allowed: true };

        const now = Date.now();
        
        // Reset if time window has passed
        if (now > limit.resetTime) {
            limit.count = 0;
            limit.resetTime = now + (action === 'message' ? 60000 : 
                                   action === 'product' ? 300000 : 
                                   action === 'group_create' ? 600000 : 300000);
        }

        if (limit.count >= limit.limit) {
            this.flagSuspiciousActivity('rate_limit_exceeded', { action, count: limit.count });
            return { 
                allowed: false, 
                message: `Rate limit exceeded for ${action}. Try again in ${Math.ceil((limit.resetTime - now) / 1000)} seconds.`
            };
        }

        limit.count++;
        return { allowed: true };
    }

    // === NETWORK MONITORING ===
    monitorNetworkRequests() {
        const originalFetch = window.fetch;
        const requestCounts = new Map();

        window.fetch = async function(...args) {
            const url = args[0];
            const now = Date.now();
            
            // Count requests per minute
            const minute = Math.floor(now / 60000);
            const count = requestCounts.get(minute) || 0;
            requestCounts.set(minute, count + 1);

            // Flag excessive requests
            if (count > 100) {
                this.flagSuspiciousActivity('excessive_requests', { count, minute });
            }

            return originalFetch.apply(this, args);
        }.bind(this);
    }

    // === CAPTCHA SYSTEM ===
    setupCaptchaSystem() {
        this.captchaChallenge = null;
        this.captchaSolved = false;
    }

    generateCaptcha() {
        const operations = ['+', '-', '*'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        let num1, num2, answer;
        
        switch(operation) {
            case '+':
                num1 = Math.floor(Math.random() * 50) + 1;
                num2 = Math.floor(Math.random() * 50) + 1;
                answer = num1 + num2;
                break;
            case '-':
                num1 = Math.floor(Math.random() * 50) + 25;
                num2 = Math.floor(Math.random() * 25) + 1;
                answer = num1 - num2;
                break;
            case '*':
                num1 = Math.floor(Math.random() * 10) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
                answer = num1 * num2;
                break;
        }

        this.captchaChallenge = {
            question: `${num1} ${operation} ${num2} = ?`,
            answer: answer,
            timestamp: Date.now()
        };

        return this.captchaChallenge.question;
    }

    verifyCaptcha(userAnswer) {
        if (!this.captchaChallenge) return false;
        
        const isCorrect = parseInt(userAnswer) === this.captchaChallenge.answer;
        const timeTaken = Date.now() - this.captchaChallenge.timestamp;
        
        if (isCorrect) {
            this.captchaSolved = true;
            
            // Flag if solved too quickly (potential bot)
            if (timeTaken < 2000) {
                this.botScore += 0.3;
                this.flagSuspiciousActivity('captcha_solved_too_fast', { timeTaken });
            }
        } else {
            this.botScore += 0.1;
        }

        this.captchaChallenge = null;
        return isCorrect;
    }

    // === USER VERIFICATION ===
    async checkUserStatus() {
        try {
            const { data, error } = await this.supabase
                .from('user_security_status')
                .select('*')
                .eq('session_id', this.sessionId)
                .single();

            if (data) {
                this.suspiciousScore = data.suspicious_score || 0;
                this.botScore = data.bot_score || 0;
            }
        } catch (error) {
            // User not in system yet, that's fine
        }
    }

    async updateUserSecurityStatus(userId = null) {
        const status = {
            session_id: this.sessionId,
            user_id: userId,
            suspicious_score: this.suspiciousScore,
            bot_score: this.botScore,
            last_activity: new Date().toISOString(),
            is_blocked: this.isBlocked(),
            updated_at: new Date().toISOString()
        };

        const { error } = await this.supabase
            .from('user_security_status')
            .upsert([status], { onConflict: 'session_id' });

        if (error) {
            console.warn('Failed to update security status:', error);
        }
    }

    // === SUSPICIOUS ACTIVITY FLAGGING ===
    async flagSuspiciousActivity(type, data = {}) {
        this.suspiciousScore += 0.1;
        
        const flag = {
            session_id: this.sessionId,
            activity_type: type,
            activity_data: data,
            suspicious_score: this.suspiciousScore,
            bot_score: this.botScore,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            ip_address: await this.getClientIP()
        };

        const { error } = await this.supabase
            .from('suspicious_activity')
            .insert([flag]);

        if (error) {
            console.warn('Failed to flag suspicious activity:', error);
        }

        // Auto-block if score is too high
        if (this.suspiciousScore > 0.8 || this.botScore > 0.7) {
            await this.blockUser();
        }
    }

    async getClientIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return 'unknown';
        }
    }

    // === BLOCKING SYSTEM ===
    isBlocked() {
        return this.suspiciousScore > 0.8 || this.botScore > 0.7;
    }

    async blockUser() {
        if (this.isBlocked()) {
            // Store block reason
            await this.supabase
                .from('blocked_users')
                .insert([{
                    session_id: this.sessionId,
                    reason: 'Automated security block',
                    suspicious_score: this.suspiciousScore,
                    bot_score: this.botScore,
                    blocked_at: new Date().toISOString()
                }]);

            // Redirect to blocked page
            window.location.href = '/blocked.html';
        }
    }

    // === PUBLIC API ===
    async validateMessage(message) {
        const rateCheck = this.checkRateLimit('message');
        if (!rateCheck.allowed) {
            return { valid: false, reason: rateCheck.message };
        }

        const spamCheck = this.analyzeTextForSpam(message);
        if (spamCheck.isSpam) {
            await this.flagSuspiciousActivity('spam_message', spamCheck);
            return { valid: false, reason: 'Message flagged as spam' };
        }

        return { valid: true };
    }

    async validateProduct(productData) {
        const rateCheck = this.checkRateLimit('product');
        if (!rateCheck.allowed) {
            return { valid: false, reason: rateCheck.message };
        }

        // Check product description for spam
        const spamCheck = this.analyzeTextForSpam(productData.description || '');
        if (spamCheck.isSpam) {
            await this.flagSuspiciousActivity('spam_product', spamCheck);
            return { valid: false, reason: 'Product description flagged as spam' };
        }

        return { valid: true };
    }

    requiresCaptcha() {
        return this.suspiciousScore > 0.3 || this.botScore > 0.4 || !this.captchaSolved;
    }

    getSecurityScore() {
        return {
            suspicious: this.suspiciousScore,
            bot: this.botScore,
            blocked: this.isBlocked(),
            needsCaptcha: this.requiresCaptcha()
        };
    }
}

// Initialize security system
const security = new SnakkazSecurity();

// Make it globally available
window.SnakkazSecurity = security;

export default security;
