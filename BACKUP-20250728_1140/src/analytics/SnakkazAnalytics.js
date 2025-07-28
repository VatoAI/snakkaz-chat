/**
 * SnakkaZ Beta - Advanced Analytics & Security Monitor
 * Tracks user behavior, performance, security events, and feedback
 * Created: 2025-07-22
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wqpoozpbceucynsojmbk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8';

class SnakkazAnalytics {
    constructor() {
        this.supabase = createClient(supabaseUrl, supabaseKey);
        this.sessionStart = Date.now();
        this.userAgent = navigator.userAgent;
        this.sessionId = this.generateSessionId();
        this.userId = null;
        
        // Initialize tracking
        this.initializeTracking();
    }

    generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    async initializeTracking() {
        console.log('🔍 SnakkaZ Analytics: Initializing tracking...');
        
        // Track page load
        await this.trackEvent('page_load', {
            url: window.location.href,
            userAgent: this.userAgent,
            screen: `${screen.width}x${screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });

        // Monitor performance
        this.monitorPerformance();
        
        // Listen for errors
        this.setupErrorTracking();
        
        // Track user interactions
        this.setupInteractionTracking();
        
        // Monitor suspicious activity
        this.setupSecurityMonitoring();
    }

    async trackEvent(eventType, data = {}) {
        try {
            const eventData = {
                session_id: this.sessionId,
                user_id: this.userId,
                event_type: eventType,
                event_data: {
                    ...data,
                    timestamp: new Date().toISOString(),
                    url: window.location.href
                },
                user_agent: this.userAgent,
                created_at: new Date().toISOString()
            };

            // Store in local storage as backup
            this.storeEventLocally(eventData);

            // Send to Supabase
            const { error } = await this.supabase
                .from('analytics_events')
                .insert([eventData]);

            if (error) {
                console.warn('Analytics error:', error);
            }
        } catch (error) {
            console.warn('Failed to track event:', error);
        }
    }

    storeEventLocally(eventData) {
        try {
            const stored = JSON.parse(localStorage.getItem('snakkaz_analytics') || '[]');
            stored.push(eventData);
            
            // Keep only last 100 events locally
            if (stored.length > 100) {
                stored.splice(0, stored.length - 100);
            }
            
            localStorage.setItem('snakkaz_analytics', JSON.stringify(stored));
        } catch (error) {
            console.warn('Failed to store event locally:', error);
        }
    }

    monitorPerformance() {
        // Track Core Web Vitals
        if ('web-vital' in window) {
            import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
                getCLS((metric) => this.trackEvent('web_vital', { name: 'CLS', value: metric.value }));
                getFID((metric) => this.trackEvent('web_vital', { name: 'FID', value: metric.value }));
                getFCP((metric) => this.trackEvent('web_vital', { name: 'FCP', value: metric.value }));
                getLCP((metric) => this.trackEvent('web_vital', { name: 'LCP', value: metric.value }));
                getTTFB((metric) => this.trackEvent('web_vital', { name: 'TTFB', value: metric.value }));
            });
        }

        // Track custom performance metrics
        setTimeout(() => {
            this.trackEvent('performance_snapshot', {
                loadTime: Date.now() - this.sessionStart,
                memoryUsage: performance.memory ? {
                    used: performance.memory.usedJSHeapSize,
                    total: performance.memory.totalJSHeapSize,
                    limit: performance.memory.jsHeapSizeLimit
                } : null,
                connection: navigator.connection ? {
                    effectiveType: navigator.connection.effectiveType,
                    downlink: navigator.connection.downlink,
                    rtt: navigator.connection.rtt
                } : null
            });
        }, 5000);
    }

    setupErrorTracking() {
        window.addEventListener('error', (event) => {
            this.trackEvent('javascript_error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error ? event.error.stack : null,
                severity: 'error'
            });
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.trackEvent('promise_rejection', {
                reason: event.reason,
                severity: 'error'
            });
        });
    }

    setupInteractionTracking() {
        // Track clicks
        document.addEventListener('click', (event) => {
            if (this.shouldTrackElement(event.target)) {
                this.trackEvent('user_click', {
                    element: event.target.tagName,
                    className: event.target.className,
                    id: event.target.id,
                    text: event.target.textContent?.substring(0, 100)
                });
            }
        });

        // Track form submissions
        document.addEventListener('submit', (event) => {
            this.trackEvent('form_submit', {
                formId: event.target.id,
                formAction: event.target.action,
                formMethod: event.target.method
            });
        });

        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
                maxScroll = scrollPercent;
                this.trackEvent('scroll_depth', { depth: scrollPercent });
            }
        });
    }

    setupSecurityMonitoring() {
        // Monitor for potential bot behavior
        let clickCount = 0;
        let rapidClicks = 0;
        
        document.addEventListener('click', () => {
            clickCount++;
            
            // Detect rapid clicking (potential bot)
            setTimeout(() => {
                if (clickCount > 10) {
                    rapidClicks++;
                    this.trackEvent('suspicious_activity', {
                        type: 'rapid_clicking',
                        clickCount: clickCount,
                        timeWindow: '1000ms'
                    });
                }
                clickCount = 0;
            }, 1000);
        });

        // Monitor console access (potential hacking attempt)
        let devtools = false;
        setInterval(() => {
            if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
                if (!devtools) {
                    devtools = true;
                    this.trackEvent('suspicious_activity', {
                        type: 'devtools_opened',
                        windowSize: `${window.outerWidth}x${window.outerHeight}`,
                        innerSize: `${window.innerWidth}x${window.innerHeight}`
                    });
                }
            } else {
                devtools = false;
            }
        }, 500);

        // Monitor for paste events (potential script injection)
        document.addEventListener('paste', (event) => {
            const pastedData = event.clipboardData.getData('text');
            if (pastedData.includes('<script>') || pastedData.includes('javascript:')) {
                this.trackEvent('suspicious_activity', {
                    type: 'suspicious_paste',
                    dataLength: pastedData.length,
                    containsScript: true
                });
            }
        });
    }

    shouldTrackElement(element) {
        // Don't track every single click, only important elements
        const trackableElements = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'];
        return trackableElements.includes(element.tagName) || 
               element.classList.contains('trackable') ||
               element.dataset.track;
    }

    // User registration tracking
    async trackUserRegistration(userId, userData) {
        this.userId = userId;
        await this.trackEvent('user_registration', {
            userId: userId,
            registrationMethod: userData.method || 'email',
            hasAvatar: !!userData.avatar,
            username: userData.username
        });
    }

    // Marketplace activity tracking
    async trackProductListing(productData) {
        await this.trackEvent('product_listed', {
            category: productData.category,
            hasImages: productData.images?.length || 0,
            priceRange: this.getPriceRange(productData.price),
            location: productData.location
        });
    }

    async trackProductView(productId, productData) {
        await this.trackEvent('product_viewed', {
            productId: productId,
            category: productData.category,
            sellerTrustScore: productData.sellerTrustScore,
            viewDuration: 0 // Will be updated when user leaves
        });
    }

    async trackGroupActivity(groupId, activity) {
        await this.trackEvent('group_activity', {
            groupId: groupId,
            activityType: activity.type,
            participantCount: activity.participantCount,
            isPrivate: activity.isPrivate
        });
    }

    getPriceRange(price) {
        if (price < 100) return 'under_100';
        if (price < 500) return '100_500';
        if (price < 1000) return '500_1000';
        if (price < 5000) return '1000_5000';
        return 'over_5000';
    }

    // Feedback system
    async submitFeedback(feedback) {
        await this.trackEvent('user_feedback', {
            rating: feedback.rating,
            category: feedback.category,
            message: feedback.message,
            page: window.location.pathname
        });

        // Also store in dedicated feedback table
        const { error } = await this.supabase
            .from('user_feedback')
            .insert([{
                session_id: this.sessionId,
                user_id: this.userId,
                rating: feedback.rating,
                category: feedback.category,
                message: feedback.message,
                page: window.location.pathname,
                created_at: new Date().toISOString()
            }]);

        if (error) {
            console.warn('Failed to submit feedback:', error);
            return false;
        }

        return true;
    }

    // Get analytics dashboard data
    async getAnalyticsDashboard() {
        try {
            const { data: events, error } = await this.supabase
                .from('analytics_events')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(1000);

            if (error) throw error;

            return this.processAnalyticsData(events);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
            return null;
        }
    }

    processAnalyticsData(events) {
        const stats = {
            totalEvents: events.length,
            uniqueSessions: new Set(events.map(e => e.session_id)).size,
            eventTypes: {},
            performanceMetrics: [],
            errors: [],
            suspiciousActivity: []
        };

        events.forEach(event => {
            // Count event types
            stats.eventTypes[event.event_type] = (stats.eventTypes[event.event_type] || 0) + 1;

            // Collect performance metrics
            if (event.event_type === 'web_vital' || event.event_type === 'performance_snapshot') {
                stats.performanceMetrics.push(event);
            }

            // Collect errors
            if (event.event_type === 'javascript_error' || event.event_type === 'promise_rejection') {
                stats.errors.push(event);
            }

            // Collect suspicious activity
            if (event.event_type === 'suspicious_activity') {
                stats.suspiciousActivity.push(event);
            }
        });

        return stats;
    }

    // Session management
    setUserId(userId) {
        this.userId = userId;
        this.trackEvent('user_identified', { userId: userId });
    }

    endSession() {
        this.trackEvent('session_end', {
            sessionDuration: Date.now() - this.sessionStart,
            pageViews: this.pageViews || 1
        });
    }
}

// Initialize analytics
const analytics = new SnakkazAnalytics();

// Make it globally available
window.SnakkazAnalytics = analytics;

export default analytics;
