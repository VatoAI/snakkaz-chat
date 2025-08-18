/**
 * SnakkazMobile - ULTRA OPTIMIZED MOBILE ENGINE
 * Mobile-first, Battery efficient, Lightning fast
 * Slår WhatsApp, Snapchat, Signal, Telegram på mobil!
 */

class SnakkazMobileEngine {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isLowPower = this.detectLowPowerMode();
        this.connection = this.detectConnectionType();
        
        // Mobile-optimized configuration
        this.mobileConfig = {
            MAX_WORKERS: this.isMobile ? 2 : 4, // Battery conscious
            MESSAGE_BATCH_SIZE: this.connection === 'slow' ? 20 : 50,
            CACHE_SIZE: this.isMobile ? 1000 : 5000,
            PREFETCH_COUNT: this.connection === 'slow' ? 20 : 100,
            COMPRESSION_LEVEL: this.isMobile ? 6 : 9,
            BACKGROUND_SYNC_INTERVAL: this.isLowPower ? 30000 : 10000
        };
        
        // Mobile-specific optimizations
        this.touchOptimizations = {
            fastClick: true,
            preventZoom: true,
            optimizeScrolling: true,
            reduceAnimations: this.isLowPower
        };
        
        // Battery and performance monitoring
        this.batteryLevel = 1;
        this.cpuUsage = 0;
        this.memoryUsage = 0;
        
        this.initializeMobileOptimizations();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    detectLowPowerMode() {
        // iOS Low Power Mode detection
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                this.batteryLevel = battery.level;
                return battery.level < 0.2; // Low battery = low power mode
            });
        }
        return false;
    }

    detectConnectionType() {
        if ('connection' in navigator) {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            const effectiveType = connection.effectiveType;
            
            if (effectiveType === 'slow-2g' || effectiveType === '2g') {
                return 'slow';
            } else if (effectiveType === '3g') {
                return 'medium';
            } else {
                return 'fast';
            }
        }
        return 'unknown';
    }

    async initializeMobileOptimizations() {
        console.log('📱 SnakkaZ Mobile Engine: Initializing mobile optimizations...');
        
        // 1. Setup touch optimizations
        this.setupTouchOptimizations();
        
        // 2. Setup battery-conscious workers
        await this.setupMobileWorkers();
        
        // 3. Setup adaptive compression
        this.setupAdaptiveCompression();
        
        // 4. Setup background sync
        this.setupBackgroundSync();
        
        // 5. Setup memory management
        this.setupMemoryManagement();
        
        // 6. Setup network optimization
        this.setupNetworkOptimization();
        
        console.log(`📱 Mobile Engine Ready: ${this.isMobile ? 'Mobile' : 'Desktop'} mode`);
        console.log(`🔋 Battery conscious: ${this.isLowPower ? 'Yes' : 'No'}`);
        console.log(`📶 Connection: ${this.connection}`);
    }

    setupTouchOptimizations() {
        if (!this.isMobile) return;
        
        // Remove 300ms click delay
        document.addEventListener('touchstart', () => {}, { passive: true });
        
        // Optimize scrolling
        const style = document.createElement('style');
        style.textContent = `
            * {
                -webkit-overflow-scrolling: touch;
                touch-action: manipulation;
            }
            
            .snakkaz-chat-container {
                will-change: transform;
                backface-visibility: hidden;
                perspective: 1000px;
            }
            
            .snakkaz-message {
                contain: layout style paint;
                transform: translateZ(0);
            }
        `;
        document.head.appendChild(style);
        
        // Prevent zoom on input focus
        const viewport = document.querySelector('meta[name=viewport]');
        if (viewport) {
            viewport.setAttribute('content', 
                'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
            );
        }
        
        console.log('👆 Touch optimizations applied');
    }

    async setupMobileWorkers() {
        const workerCount = this.mobileConfig.MAX_WORKERS;
        
        const mobileWorkerCode = `
            class MobileWorker {
                constructor() {
                    this.messageBuffer = [];
                    this.compressionLevel = 6; // Battery friendly
                }
                
                // Lightweight compression for mobile
                compressMessageMobile(message) {
                    const jsonStr = JSON.stringify(message);
                    
                    // Simple run-length encoding for speed and battery
                    let compressed = '';
                    let count = 1;
                    let prev = jsonStr[0];
                    
                    for (let i = 1; i < jsonStr.length; i++) {
                        if (jsonStr[i] === prev && count < 9) {
                            count++;
                        } else {
                            compressed += count > 1 ? count + prev : prev;
                            prev = jsonStr[i];
                            count = 1;
                        }
                    }
                    compressed += count > 1 ? count + prev : prev;
                    
                    return {
                        data: btoa(compressed),
                        originalSize: jsonStr.length,
                        compressedSize: compressed.length,
                        compressionRatio: compressed.length / jsonStr.length,
                        method: 'mobile-rle'
                    };
                }
                
                // Battery-conscious batch processing
                processMobileBatch(messages) {
                    const processed = [];
                    const startTime = performance.now();
                    
                    // Process in smaller chunks to avoid blocking UI
                    const chunkSize = 10;
                    for (let i = 0; i < messages.length; i += chunkSize) {
                        const chunk = messages.slice(i, i + chunkSize);
                        
                        for (const message of chunk) {
                            const compressed = this.compressMessageMobile(message);
                            processed.push({
                                ...message,
                                compressed: compressed.data,
                                metadata: {
                                    originalSize: compressed.originalSize,
                                    compressedSize: compressed.compressedSize,
                                    ratio: compressed.compressionRatio,
                                    method: compressed.method,
                                    processTime: performance.now() - startTime
                                }
                            });
                        }
                        
                        // Yield to main thread every chunk (mobile friendly)
                        if (i + chunkSize < messages.length) {
                            await new Promise(resolve => setTimeout(resolve, 1));
                        }
                    }
                    
                    return processed;
                }
            }
            
            const mobileWorker = new MobileWorker();
            
            self.onmessage = async function(e) {
                const { type, data, id } = e.data;
                
                switch(type) {
                    case 'PROCESS_MOBILE_BATCH':
                        const processed = await mobileWorker.processMobileBatch(data);
                        self.postMessage({ type: 'MOBILE_BATCH_PROCESSED', data: processed, id });
                        break;
                        
                    case 'COMPRESS_MOBILE':
                        const compressed = mobileWorker.compressMessageMobile(data);
                        self.postMessage({ type: 'MOBILE_COMPRESSED', data: compressed, id });
                        break;
                }
            };
        `;
        
        const blob = new Blob([mobileWorkerCode], { type: 'application/javascript' });
        const workerUrl = URL.createObjectURL(blob);
        
        this.mobileWorkers = [];
        for (let i = 0; i < workerCount; i++) {
            const worker = new Worker(workerUrl);
            worker.id = i;
            worker.busy = false;
            worker.onmessage = (e) => this.handleMobileWorkerMessage(e);
            this.mobileWorkers.push(worker);
        }
        
        console.log(`📱 Created ${workerCount} battery-conscious mobile workers`);
    }

    setupAdaptiveCompression() {
        // Adjust compression based on battery and connection
        this.getOptimalCompression = () => {
            if (this.isLowPower) return 3; // Minimal compression
            if (this.connection === 'slow') return 9; // Max compression
            if (this.connection === 'medium') return 6; // Balanced
            return 7; // Good default
        };
        
        // Monitor and adapt
        setInterval(() => {
            const newLevel = this.getOptimalCompression();
            if (newLevel !== this.mobileConfig.COMPRESSION_LEVEL) {
                this.mobileConfig.COMPRESSION_LEVEL = newLevel;
                console.log(`📱 Compression adapted to level ${newLevel}`);
            }
        }, 30000);
    }

    setupBackgroundSync() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw-snakkaz-mobile.js').then(registration => {
                console.log('📱 Background sync service worker registered');
                
                // Setup background sync for offline messages
                if ('sync' in registration) {
                    return registration.sync.register('snakkaz-background-sync');
                }
            });
        }
        
        // Fallback: interval-based sync
        setInterval(() => {
            if (document.hidden && !this.isLowPower) {
                this.performBackgroundSync();
            }
        }, this.mobileConfig.BACKGROUND_SYNC_INTERVAL);
    }

    setupMemoryManagement() {
        // Monitor memory usage
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                this.memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
                
                // Clear caches if memory usage is high
                if (this.memoryUsage > 0.8) {
                    this.clearExcessiveCache();
                    console.log('📱 Memory cleanup performed');
                }
            }, 15000);
        }
        
        // Cleanup on page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                setTimeout(() => {
                    if (document.hidden) {
                        this.performMemoryCleanup();
                    }
                }, 5000);
            }
        });
    }

    setupNetworkOptimization() {
        // Adaptive polling based on connection
        this.getPollingInterval = () => {
            if (this.connection === 'slow') return 5000;
            if (this.connection === 'medium') return 2000;
            return 1000;
        };
        
        // Network state monitoring
        if ('connection' in navigator) {
            const connection = navigator.connection;
            connection.addEventListener('change', () => {
                this.connection = this.detectConnectionType();
                this.adaptToNetwork();
                console.log(`📱 Network adapted to ${this.connection}`);
            });
        }
        
        // Request batching for slow connections
        this.requestQueue = [];
        this.processRequestQueue();
    }

    adaptToNetwork() {
        // Adjust configuration based on network
        if (this.connection === 'slow') {
            this.mobileConfig.MESSAGE_BATCH_SIZE = 10;
            this.mobileConfig.PREFETCH_COUNT = 10;
        } else if (this.connection === 'medium') {
            this.mobileConfig.MESSAGE_BATCH_SIZE = 30;
            this.mobileConfig.PREFETCH_COUNT = 50;
        } else {
            this.mobileConfig.MESSAGE_BATCH_SIZE = 50;
            this.mobileConfig.PREFETCH_COUNT = 100;
        }
    }

    async sendMessageMobile(roomId, content, type = 'text') {
        const messageId = `mobile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const startTime = performance.now();
        
        try {
            // Immediate optimistic update
            const optimisticMessage = {
                id: messageId,
                content,
                type,
                room_id: roomId,
                user_id: 'current_user',
                created_at: new Date().toISOString(),
                status: 'sending',
                timestamp: Date.now(),
                mobile: true
            };
            
            // Instant UI update
            this.broadcastMobileMessage(optimisticMessage);
            
            // Background processing with mobile worker
            const worker = this.getAvailableMobileWorker();
            if (worker) {
                worker.busy = true;
                worker.postMessage({
                    type: 'PROCESS_MOBILE_BATCH',
                    data: [optimisticMessage],
                    id: messageId
                });
            }
            
            const endTime = performance.now();
            console.log(`📱 Mobile message sent in ${(endTime - startTime).toFixed(2)}ms`);
            
            return optimisticMessage;
        } catch (error) {
            console.error('📱 Mobile send failed:', error);
            throw error;
        }
    }

    getAvailableMobileWorker() {
        return this.mobileWorkers.find(worker => !worker.busy) || this.mobileWorkers[0];
    }

    handleMobileWorkerMessage(event) {
        const { type, data, id } = event.data;
        const worker = event.target;
        
        worker.busy = false;
        
        switch(type) {
            case 'MOBILE_BATCH_PROCESSED':
                this.handleMobileProcessedBatch(data, id);
                break;
            case 'MOBILE_COMPRESSED':
                this.handleMobileCompressed(data, id);
                break;
        }
    }

    async handleMobileProcessedBatch(messages, batchId) {
        try {
            // Send with network optimization
            if (this.connection === 'slow') {
                // Send one at a time for slow connections
                for (const message of messages) {
                    await this.sendSingleMessage(message);
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            } else {
                // Batch send for faster connections
                await this.sendBatchMessages(messages);
            }
            
            // Update UI
            messages.forEach(msg => {
                this.broadcastMobileMessage({
                    ...msg,
                    status: 'sent'
                });
            });
            
        } catch (error) {
            console.error('📱 Mobile batch send failed:', error);
            
            // Retry logic for mobile
            this.retryMobileBatch(messages);
        }
    }

    broadcastMobileMessage(message) {
        // Optimized for mobile performance
        window.dispatchEvent(new CustomEvent('snakkaz-mobile-message', {
            detail: message
        }));
    }

    performMemoryCleanup() {
        // Clear old caches
        this.clearExcessiveCache();
        
        // Force garbage collection hint
        if ('gc' in window) {
            window.gc();
        }
        
        console.log('📱 Mobile memory cleanup completed');
    }

    clearExcessiveCache() {
        // Keep only recent messages in cache
        const recentThreshold = Date.now() - 300000; // 5 minutes
        
        if (window.SnakkazSpeedEngine) {
            const cache = window.SnakkazSpeedEngine.messageCache;
            for (const [key, value] of cache.entries()) {
                if (value.timestamp < recentThreshold) {
                    cache.delete(key);
                }
            }
        }
    }

    async performBackgroundSync() {
        // Sync pending messages in background
        const pendingMessages = this.getPendingMessages();
        
        if (pendingMessages.length > 0) {
            console.log(`📱 Background sync: ${pendingMessages.length} messages`);
            
            for (const message of pendingMessages) {
                await this.sendMessageMobile(message.room_id, message.content, message.type);
            }
        }
    }

    processRequestQueue() {
        setInterval(() => {
            if (this.requestQueue.length > 0) {
                const batchSize = this.connection === 'slow' ? 1 : 3;
                const batch = this.requestQueue.splice(0, batchSize);
                
                batch.forEach(request => {
                    request();
                });
            }
        }, this.getPollingInterval());
    }

    // Public API for mobile operations
    async sendMessage(roomId, content, type) {
        return this.sendMessageMobile(roomId, content, type);
    }

    getMobileMetrics() {
        return {
            isMobile: this.isMobile,
            isLowPower: this.isLowPower,
            connection: this.connection,
            batteryLevel: this.batteryLevel,
            memoryUsage: this.memoryUsage,
            config: this.mobileConfig
        };
    }

    // Helper methods
    getPendingMessages() {
        // Get messages that failed to send
        return JSON.parse(localStorage.getItem('snakkaz-pending-messages') || '[]');
    }

    async sendSingleMessage(message) {
        if (window.SnakkazSpeedEngine && window.SnakkazSpeedEngine.supabase) {
            const { error } = await window.SnakkazSpeedEngine.supabase
                .from('messages')
                .insert(message);
            
            if (error) throw error;
        }
    }

    async sendBatchMessages(messages) {
        if (window.SnakkazSpeedEngine && window.SnakkazSpeedEngine.supabase) {
            const { error } = await window.SnakkazSpeedEngine.supabase
                .from('messages')
                .insert(messages);
            
            if (error) throw error;
        }
    }

    retryMobileBatch(messages) {
        // Add to retry queue
        const pending = this.getPendingMessages();
        pending.push(...messages);
        localStorage.setItem('snakkaz-pending-messages', JSON.stringify(pending));
        
        // Retry after delay
        setTimeout(() => {
            this.performBackgroundSync();
        }, 5000);
    }
}

// Initialize mobile engine
const snakkazMobileEngine = new SnakkazMobileEngine();
window.SnakkazMobileEngine = snakkazMobileEngine;

console.log('📱 SnakkaZ Mobile Engine loaded!');
console.log('💪 Optimized for mobile performance and battery life!');

export default snakkazMobileEngine;
