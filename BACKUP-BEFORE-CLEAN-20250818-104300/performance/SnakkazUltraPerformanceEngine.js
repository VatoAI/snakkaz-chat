/**
 * SnakkaZ Ultra-Performance Engine
 * Signal-Inspired Optimizations + Our Own Innovations
 * Goal: Slå Signal, Telegram, WhatsApp, Snapchat, Wickr!
 * Created: 2025-07-22
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wqpoozpbceucynsojmbk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8';

class SnakkazUltraPerformanceEngine {
    constructor() {
        this.supabase = createClient(supabaseUrl, supabaseKey);
        this.messageQueue = new Map();
        this.batchProcessor = new Map();
        this.connectionPool = new Map();
        this.performanceMetrics = new Map();
        this.optimizations = new Set();
        
        console.log('🚀 SnakkaZ Ultra-Performance Engine: Initializing...');
        this.initializeOptimizations();
    }

    /**
     * PERFORMANCE OPTIMIZATIONS INSPIRED BY BEST PRACTICES:
     * 
     * 1. MESSAGE BATCHING (from Signal)
     * 2. CONNECTION POOLING (better than Telegram)
     * 3. LAZY LOADING (better than WhatsApp)
     * 4. PREDICTIVE CACHING (our innovation)
     * 5. ADAPTIVE COMPRESSION (our secret weapon)
     * 6. REAL-TIME OPTIMIZATION (better than Snapchat)
     * 7. MOBILE-FIRST ARCHITECTURE (optimized for 90% mobile usage)
     */

    async initializeOptimizations() {
        // Signal-inspired message batching
        await this.setupMessageBatching();
        
        // Our innovation: Predictive message loading
        await this.setupPredictiveLoading();
        
        // Better than Telegram: Smart connection pooling
        await this.setupConnectionPooling();
        
        // Mobile-first optimizations
        await this.setupMobileOptimizations();
        
        // Real-time performance monitoring
        await this.setupPerformanceMonitoring();
        
        console.log('✅ Ultra-Performance Engine ready to dominate competitors!');
    }

    // OPTIMIZATION 1: MESSAGE BATCHING (Signal-inspired but better)
    async setupMessageBatching() {
        this.messageBatcher = {
            batches: new Map(),
            batchSize: 50, // Optimal batch size
            batchTimeout: 16, // 60fps = 16ms intervals
            
            add: (conversationId, message) => {
                if (!this.messageBatcher.batches.has(conversationId)) {
                    this.messageBatcher.batches.set(conversationId, []);
                    
                    // Auto-flush after timeout
                    setTimeout(() => {
                        this.flushMessageBatch(conversationId);
                    }, this.messageBatcher.batchTimeout);
                }
                
                const batch = this.messageBatcher.batches.get(conversationId);
                batch.push(message);
                
                // Flush if batch is full
                if (batch.length >= this.messageBatcher.batchSize) {
                    this.flushMessageBatch(conversationId);
                }
            }
        };
        
        console.log('📦 Message batching system activated');
    }

    async flushMessageBatch(conversationId) {
        const batch = this.messageBatcher.batches.get(conversationId);
        if (!batch || batch.length === 0) return;
        
        const startTime = performance.now();
        
        try {
            // Batch insert to Supabase (much faster than individual inserts)
            const { data, error } = await this.supabase
                .from('messages')
                .insert(batch)
                .select();
                
            if (error) throw error;
            
            // Update UI in batch (React batch update pattern from Signal)
            if (window.React && window.React.unstable_batchedUpdates) {
                window.React.unstable_batchedUpdates(() => {
                    batch.forEach(message => {
                        this.updateUIForMessage(message);
                    });
                });
            }
            
            const duration = performance.now() - startTime;
            this.recordPerformanceMetric('message_batch_flush', duration);
            
            console.log(`⚡ Batched ${batch.length} messages in ${duration.toFixed(2)}ms`);
        } catch (error) {
            console.error('❌ Batch flush failed:', error);
        } finally {
            this.messageBatcher.batches.delete(conversationId);
        }
    }

    // OPTIMIZATION 2: PREDICTIVE LOADING (Our Innovation!)
    async setupPredictiveLoading() {
        this.predictiveLoader = {
            userPatterns: new Map(),
            preloadedConversations: new Map(),
            
            // Analyser brukerens mønster
            analyzeUserPattern: (userId, action) => {
                if (!this.predictiveLoader.userPatterns.has(userId)) {
                    this.predictiveLoader.userPatterns.set(userId, {
                        commonConversations: new Map(),
                        timePatterns: new Map(),
                        lastActions: []
                    });
                }
                
                const pattern = this.predictiveLoader.userPatterns.get(userId);
                pattern.lastActions.push({
                    action,
                    timestamp: Date.now(),
                    hour: new Date().getHours()
                });
                
                // Keep only last 100 actions
                if (pattern.lastActions.length > 100) {
                    pattern.lastActions = pattern.lastActions.slice(-100);
                }
                
                // Predict next conversation
                this.predictNextConversation(userId);
            },
            
            // Forutsier neste samtale basert på mønster
            predictNextConversation: (userId) => {
                const pattern = this.predictiveLoader.userPatterns.get(userId);
                if (!pattern) return;
                
                // Finn mest sannsynlige neste samtale
                const recentConversations = pattern.lastActions
                    .filter(a => a.action.type === 'open_conversation')
                    .slice(-10)
                    .map(a => a.action.conversationId);
                
                const conversationCounts = {};
                recentConversations.forEach(id => {
                    conversationCounts[id] = (conversationCounts[id] || 0) + 1;
                });
                
                const mostLikely = Object.entries(conversationCounts)
                    .sort(([,a], [,b]) => b - a)[0];
                
                if (mostLikely) {
                    this.preloadConversation(mostLikely[0]);
                }
            }
        };
        
        console.log('🔮 Predictive loading system activated');
    }

    async preloadConversation(conversationId) {
        if (this.predictiveLoader.preloadedConversations.has(conversationId)) {
            return; // Already preloaded
        }
        
        const startTime = performance.now();
        
        try {
            // Preload recent messages
            const { data: messages } = await this.supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: false })
                .limit(50);
            
            // Preload user profiles
            const userIds = [...new Set(messages?.map(m => m.user_id) || [])];
            const { data: profiles } = await this.supabase
                .from('users')
                .select('id, username, avatar_url, status')
                .in('id', userIds);
            
            // Cache in memory
            this.predictiveLoader.preloadedConversations.set(conversationId, {
                messages: messages || [],
                profiles: profiles || [],
                preloadedAt: Date.now()
            });
            
            const duration = performance.now() - startTime;
            this.recordPerformanceMetric('conversation_preload', duration);
            
            console.log(`🚀 Preloaded conversation ${conversationId} in ${duration.toFixed(2)}ms`);
        } catch (error) {
            console.error('❌ Preload failed:', error);
        }
    }

    // OPTIMIZATION 3: SMART CONNECTION POOLING (Better than Telegram)
    async setupConnectionPooling() {
        this.connectionPool = {
            pools: new Map(),
            maxConnections: 10,
            connectionTimeout: 30000, // 30 seconds
            
            getConnection: async (type) => {
                if (!this.connectionPool.pools.has(type)) {
                    this.connectionPool.pools.set(type, []);
                }
                
                const pool = this.connectionPool.pools.get(type);
                
                // Find available connection
                const available = pool.find(conn => !conn.inUse && !conn.expired);
                if (available) {
                    available.inUse = true;
                    available.lastUsed = Date.now();
                    return available;
                }
                
                // Create new connection if under limit
                if (pool.length < this.connectionPool.maxConnections) {
                    const newConnection = await this.createConnection(type);
                    pool.push(newConnection);
                    return newConnection;
                }
                
                // Wait for available connection
                return await this.waitForConnection(type);
            },
            
            releaseConnection: (connection) => {
                connection.inUse = false;
                connection.lastUsed = Date.now();
            }
        };
        
        // Cleanup expired connections
        setInterval(() => {
            this.cleanupExpiredConnections();
        }, 10000);
        
        console.log('🔌 Smart connection pooling activated');
    }

    async createConnection(type) {
        const connection = {
            id: Math.random().toString(36).substr(2, 9),
            type: type,
            createdAt: Date.now(),
            lastUsed: Date.now(),
            inUse: true,
            expired: false
        };
        
        if (type === 'websocket') {
            connection.socket = new WebSocket(this.getWebSocketUrl());
            connection.socket.onopen = () => {
                console.log(`🔗 WebSocket connection ${connection.id} opened`);
            };
        }
        
        return connection;
    }

    // OPTIMIZATION 4: MOBILE-FIRST OPTIMIZATIONS (90% mobile usage!)
    async setupMobileOptimizations() {
        // Detect mobile device
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isSlowConnection = navigator.connection && navigator.connection.effectiveType === '2g';
        
        if (isMobile) {
            // Mobile-specific optimizations
            this.mobileOptimizations = {
                // Reduce image quality on mobile
                imageQuality: isSlowConnection ? 0.6 : 0.8,
                
                // Aggressive caching for mobile
                cacheSize: isSlowConnection ? 50 : 100,
                
                // Lazy load images
                lazyLoadImages: true,
                
                // Reduce animation complexity
                reducedAnimations: isSlowConnection,
                
                // Optimize for touch
                touchOptimized: true,
                
                // Background sync for offline
                backgroundSync: true
            };
            
            // Register service worker for background sync
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/snakkaz-sw.js');
            }
            
            console.log('📱 Mobile optimizations activated');
        }
    }

    // OPTIMIZATION 5: REAL-TIME PERFORMANCE MONITORING
    async setupPerformanceMonitoring() {
        this.performanceMonitor = {
            metrics: new Map(),
            alerts: new Map(),
            
            // Real-time FPS monitoring
            fpsCounter: {
                frames: 0,
                lastTime: performance.now(),
                fps: 60,
                
                update: () => {
                    this.performanceMonitor.fpsCounter.frames++;
                    const now = performance.now();
                    const delta = now - this.performanceMonitor.fpsCounter.lastTime;
                    
                    if (delta >= 1000) {
                        this.performanceMonitor.fpsCounter.fps = 
                            Math.round((this.performanceMonitor.fpsCounter.frames * 1000) / delta);
                        this.performanceMonitor.fpsCounter.frames = 0;
                        this.performanceMonitor.fpsCounter.lastTime = now;
                        
                        // Alert if FPS drops below 30
                        if (this.performanceMonitor.fpsCounter.fps < 30) {
                            this.triggerPerformanceAlert('low_fps', this.performanceMonitor.fpsCounter.fps);
                        }
                    }
                }
            },
            
            // Memory usage monitoring
            memoryMonitor: {
                check: () => {
                    if (performance.memory) {
                        const memUsage = {
                            used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                            total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                            limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
                        };
                        
                        this.recordPerformanceMetric('memory_usage', memUsage);
                        
                        // Alert if memory usage is too high
                        if (memUsage.used / memUsage.limit > 0.8) {
                            this.triggerPerformanceAlert('high_memory', memUsage);
                        }
                        
                        return memUsage;
                    }
                }
            }
        };
        
        // Start monitoring
        this.startPerformanceMonitoring();
        console.log('📊 Real-time performance monitoring activated');
    }

    startPerformanceMonitoring() {
        // FPS monitoring
        const fpsLoop = () => {
            this.performanceMonitor.fpsCounter.update();
            requestAnimationFrame(fpsLoop);
        };
        requestAnimationFrame(fpsLoop);
        
        // Memory monitoring every 5 seconds
        setInterval(() => {
            this.performanceMonitor.memoryMonitor.check();
        }, 5000);
        
        // Network monitoring
        if (navigator.connection) {
            navigator.connection.addEventListener('change', () => {
                this.recordPerformanceMetric('network_change', {
                    effectiveType: navigator.connection.effectiveType,
                    downlink: navigator.connection.downlink,
                    rtt: navigator.connection.rtt
                });
            });
        }
    }

    recordPerformanceMetric(name, value) {
        if (!this.performanceMetrics.has(name)) {
            this.performanceMetrics.set(name, []);
        }
        
        const metrics = this.performanceMetrics.get(name);
        metrics.push({
            value: value,
            timestamp: Date.now()
        });
        
        // Keep only last 100 metrics
        if (metrics.length > 100) {
            metrics.shift();
        }
    }

    triggerPerformanceAlert(type, data) {
        console.warn(`⚠️ Performance Alert [${type}]:`, data);
        
        // Auto-optimization based on alert
        switch (type) {
            case 'low_fps':
                this.enablePerformanceMode();
                break;
            case 'high_memory':
                this.triggerMemoryCleanup();
                break;
            case 'slow_network':
                this.enableLowBandwidthMode();
                break;
        }
    }

    enablePerformanceMode() {
        console.log('🔧 Enabling performance mode...');
        
        // Reduce visual effects
        document.body.classList.add('performance-mode');
        
        // Reduce animation frame rate
        this.animationFrameRate = 30;
        
        // Aggressive message batching
        this.messageBatcher.batchTimeout = 50; // Slower batching
        
        // Reduce image quality
        this.imageQuality = 0.5;
        
        console.log('✅ Performance mode enabled');
    }

    triggerMemoryCleanup() {
        console.log('🧹 Triggering memory cleanup...');
        
        // Clear old cached conversations
        for (const [id, data] of this.predictiveLoader.preloadedConversations) {
            if (Date.now() - data.preloadedAt > 300000) { // 5 minutes
                this.predictiveLoader.preloadedConversations.delete(id);
            }
        }
        
        // Clear old performance metrics
        for (const [name, metrics] of this.performanceMetrics) {
            if (metrics.length > 50) {
                this.performanceMetrics.set(name, metrics.slice(-50));
            }
        }
        
        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }
        
        console.log('✅ Memory cleanup completed');
    }

    // OPTIMIZATION 6: ADAPTIVE MESSAGE COMPRESSION
    async compressMessage(message) {
        const messageSize = new Blob([JSON.stringify(message)]).size;
        
        // Different compression strategies based on message size
        if (messageSize > 10000) { // Large messages
            return await this.heavyCompression(message);
        } else if (messageSize > 1000) { // Medium messages
            return await this.mediumCompression(message);
        } else { // Small messages
            return message; // No compression needed
        }
    }

    async heavyCompression(message) {
        // Use advanced compression for large messages
        if (window.CompressionStream) {
            const stream = new CompressionStream('gzip');
            const writer = stream.writable.getWriter();
            const reader = stream.readable.getReader();
            
            writer.write(new TextEncoder().encode(JSON.stringify(message)));
            writer.close();
            
            const compressed = await reader.read();
            return {
                ...message,
                compressed: true,
                compressionType: 'gzip',
                data: compressed.value
            };
        }
        
        return message;
    }

    // PUBLIC API METHODS
    async sendMessage(conversationId, messageData) {
        const startTime = performance.now();
        
        try {
            // Compress if needed
            const compressedMessage = await this.compressMessage(messageData);
            
            // Add to batch instead of sending immediately
            this.messageBatcher.add(conversationId, {
                ...compressedMessage,
                conversation_id: conversationId,
                timestamp: new Date().toISOString()
            });
            
            // Record user pattern for predictive loading
            if (window.memoryContext && window.memoryContext.predictiveLoader) {
                window.memoryContext.predictiveLoader.analyzeUserPattern(
                    messageData.user_id,
                    { type: 'send_message', conversationId }
                );
            }
            
            const duration = performance.now() - startTime;
            this.recordPerformanceMetric('message_send', duration);
            
            console.log(`⚡ Message queued in ${duration.toFixed(2)}ms`);
            return { success: true, queued: true };
        } catch (error) {
            console.error('❌ Message send failed:', error);
            return { success: false, error: error.message };
        }
    }

    async openConversation(conversationId) {
        const startTime = performance.now();
        
        // Check if conversation is preloaded
        const preloaded = this.predictiveLoader.preloadedConversations.get(conversationId);
        
        if (preloaded) {
            console.log(`🚀 Using preloaded conversation data (instant load!)`);
            const duration = performance.now() - startTime;
            this.recordPerformanceMetric('conversation_open_preloaded', duration);
            return preloaded;
        } else {
            // Load conversation normally
            const { data: messages } = await this.supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: false })
                .limit(50);
            
            const duration = performance.now() - startTime;
            this.recordPerformanceMetric('conversation_open_normal', duration);
            console.log(`📥 Conversation loaded in ${duration.toFixed(2)}ms`);
            
            return { messages: messages || [], profiles: [] };
        }
    }

    // PERFORMANCE ANALYTICS
    getPerformanceReport() {
        const report = {
            currentFPS: this.performanceMonitor?.fpsCounter?.fps || 0,
            memoryUsage: this.performanceMonitor?.memoryMonitor?.check() || {},
            optimizationsActive: Array.from(this.optimizations),
            metrics: {}
        };
        
        // Calculate average metrics
        for (const [name, metrics] of this.performanceMetrics) {
            const values = metrics.map(m => typeof m.value === 'number' ? m.value : 0);
            report.metrics[name] = {
                average: values.reduce((sum, val) => sum + val, 0) / values.length,
                min: Math.min(...values),
                max: Math.max(...values),
                count: values.length
            };
        }
        
        return report;
    }

    updateUIForMessage(message) {
        // Efficient UI update without triggering full re-render
        const event = new CustomEvent('snakkaz-message-update', {
            detail: { message }
        });
        window.dispatchEvent(event);
    }

    getWebSocketUrl() {
        return `wss://wqpoozpbceucynsojmbk.supabase.co/realtime/v1/websocket?apikey=${supabaseKey}`;
    }

    cleanupExpiredConnections() {
        for (const [type, pool] of this.connectionPool.pools) {
            const expired = pool.filter(conn => 
                Date.now() - conn.lastUsed > this.connectionPool.connectionTimeout
            );
            
            expired.forEach(conn => {
                conn.expired = true;
                if (conn.socket) {
                    conn.socket.close();
                }
            });
            
            this.connectionPool.pools.set(type, 
                pool.filter(conn => !conn.expired)
            );
        }
    }
}

// Initialize the ultra-performance engine
const ultraPerformance = new SnakkazUltraPerformanceEngine();
window.ultraPerformance = ultraPerformance;

console.log('🚀 SnakkaZ Ultra-Performance Engine loaded - Ready to dominate the competition!');
export default ultraPerformance;
