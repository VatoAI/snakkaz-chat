export class PerformanceCache {
    constructor(ttl = 300000) { // 5 minutes default TTL
        this.cache = new Map();
        this.ttl = ttl;
        this.stats = {
            hits: 0,
            misses: 0,
            sets: 0,
            deletes: 0
        };
        
        // Cleanup expired entries every minute
        setInterval(() => this.cleanup(), 60000);
    }

    set(key, value, customTTL = null) {
        const expiresAt = Date.now() + (customTTL || this.ttl);
        this.cache.set(key, {
            value,
            expiresAt,
            createdAt: Date.now()
        });
        this.stats.sets++;
        console.log(`💾 Cache SET: ${key} (TTL: ${(customTTL || this.ttl) / 1000}s)`);
    }

    get(key) {
        const entry = this.cache.get(key);
        
        if (!entry) {
            this.stats.misses++;
            return null;
        }
        
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            this.stats.misses++;
            console.log(`🗑️ Cache EXPIRED: ${key}`);
            return null;
        }
        
        this.stats.hits++;
        console.log(`⚡ Cache HIT: ${key}`);
        return entry.value;
    }

    delete(key) {
        const deleted = this.cache.delete(key);
        if (deleted) {
            this.stats.deletes++;
            console.log(`🗑️ Cache DELETE: ${key}`);
        }
        return deleted;
    }

    has(key) {
        const entry = this.cache.get(key);
        if (!entry) return false;
        
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return false;
        }
        
        return true;
    }

    clear() {
        const size = this.cache.size;
        this.cache.clear();
        console.log(`🧹 Cache CLEARED: ${size} entries removed`);
    }

    cleanup() {
        const now = Date.now();
        let cleaned = 0;
        
        for (const [key, entry] of this.cache.entries()) {
            if (now > entry.expiresAt) {
                this.cache.delete(key);
                cleaned++;
            }
        }
        
        if (cleaned > 0) {
            console.log(`🧹 Cache CLEANUP: ${cleaned} expired entries removed`);
        }
    }

    getStats() {
        const hitRate = this.stats.hits + this.stats.misses > 0 
            ? (this.stats.hits / (this.stats.hits + this.stats.misses) * 100).toFixed(2)
            : 0;
            
        return {
            ...this.stats,
            hitRate: `${hitRate}%`,
            size: this.cache.size,
            memoryUsage: this.estimateMemoryUsage()
        };
    }

    estimateMemoryUsage() {
        let bytes = 0;
        for (const [key, entry] of this.cache.entries()) {
            bytes += key.length * 2; // Unicode characters are 2 bytes
            bytes += JSON.stringify(entry.value).length * 2;
            bytes += 16; // Overhead for timestamps
        }
        return `${(bytes / 1024).toFixed(2)} KB`;
    }
}

export class QueryOptimizer {
    constructor() {
        this.queryPatterns = new Map();
        this.popularQueries = new Map();
    }

    optimizeQuery(query) {
        // Track query patterns
        const pattern = this.extractPattern(query);
        this.queryPatterns.set(pattern, (this.queryPatterns.get(pattern) || 0) + 1);
        
        // Track popular queries
        const lowerQuery = query.toLowerCase().trim();
        this.popularQueries.set(lowerQuery, (this.popularQueries.get(lowerQuery) || 0) + 1);
        
        // Optimize based on patterns
        return {
            originalQuery: query,
            optimizedQuery: this.applyOptimizations(query),
            cacheKey: this.generateCacheKey(query),
            priority: this.calculatePriority(query)
        };
    }

    extractPattern(query) {
        // Extract query pattern for optimization
        return query
            .toLowerCase()
            .replace(/\d+/g, 'NUM')
            .replace(/[a-z]+/g, 'WORD')
            .replace(/\s+/g, ' ')
            .trim();
    }

    applyOptimizations(query) {
        let optimized = query.trim();
        
        // Remove redundant words
        const stopWords = ['the', 'is', 'at', 'which', 'on', 'and', 'a', 'an'];
        const words = optimized.split(' ');
        const filtered = words.filter(word => !stopWords.includes(word.toLowerCase()));
        
        if (filtered.length > 0) {
            optimized = filtered.join(' ');
        }
        
        // Normalize Norwegian characters
        optimized = optimized
            .replace(/[åÅ]/g, 'aa')
            .replace(/[øØ]/g, 'oe')
            .replace(/[æÆ]/g, 'ae');
            
        return optimized;
    }

    generateCacheKey(query) {
        const normalized = query.toLowerCase().trim().replace(/\s+/g, '_');
        return `query_${Buffer.from(normalized).toString('base64').slice(0, 20)}`;
    }

    calculatePriority(query) {
        const frequency = this.popularQueries.get(query.toLowerCase().trim()) || 0;
        const length = query.length;
        
        // Higher priority for popular, concise queries
        return Math.max(1, Math.floor(frequency / length * 100));
    }

    getPopularQueries(limit = 10) {
        return Array.from(this.popularQueries.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([query, count]) => ({ query, count }));
    }
}

export class PerformanceMonitor {
    constructor() {
        this.metrics = {
            requests: 0,
            errors: 0,
            totalResponseTime: 0,
            slowQueries: [],
            memorySnapshots: []
        };
        
        this.thresholds = {
            slowQueryMs: 1000,
            highMemoryMB: 100
        };
        
        // Take memory snapshots every 30 seconds
        setInterval(() => this.takeMemorySnapshot(), 30000);
    }

    startRequest() {
        return {
            startTime: Date.now(),
            memoryBefore: process.memoryUsage()
        };
    }

    endRequest(requestData, error = null) {
        const endTime = Date.now();
        const responseTime = endTime - requestData.startTime;
        const memoryAfter = process.memoryUsage();
        
        this.metrics.requests++;
        this.metrics.totalResponseTime += responseTime;
        
        if (error) {
            this.metrics.errors++;
        }
        
        // Track slow queries
        if (responseTime > this.thresholds.slowQueryMs) {
            this.metrics.slowQueries.push({
                timestamp: endTime,
                responseTime,
                memoryDelta: memoryAfter.heapUsed - requestData.memoryBefore.heapUsed,
                error: error?.message
            });
            
            // Keep only last 50 slow queries
            if (this.metrics.slowQueries.length > 50) {
                this.metrics.slowQueries.shift();
            }
        }
        
        return {
            responseTime,
            memoryUsed: memoryAfter.heapUsed - requestData.memoryBefore.heapUsed,
            success: !error
        };
    }

    takeMemorySnapshot() {
        const memory = process.memoryUsage();
        this.metrics.memorySnapshots.push({
            timestamp: Date.now(),
            ...memory
        });
        
        // Keep only last 100 snapshots (50 minutes)
        if (this.metrics.memorySnapshots.length > 100) {
            this.metrics.memorySnapshots.shift();
        }
        
        // Alert on high memory usage
        const memoryMB = memory.heapUsed / 1024 / 1024;
        if (memoryMB > this.thresholds.highMemoryMB) {
            console.log(`⚠️ High memory usage: ${memoryMB.toFixed(2)} MB`);
        }
    }

    getStats() {
        const avgResponseTime = this.metrics.requests > 0 
            ? this.metrics.totalResponseTime / this.metrics.requests 
            : 0;
            
        const errorRate = this.metrics.requests > 0 
            ? (this.metrics.errors / this.metrics.requests * 100).toFixed(2)
            : 0;

        const latestMemory = this.metrics.memorySnapshots[this.metrics.memorySnapshots.length - 1];
        
        return {
            requests: this.metrics.requests,
            errors: this.metrics.errors,
            errorRate: `${errorRate}%`,
            avgResponseTime: `${avgResponseTime.toFixed(2)}ms`,
            slowQueries: this.metrics.slowQueries.length,
            memoryUsage: latestMemory ? {
                heapUsed: `${(latestMemory.heapUsed / 1024 / 1024).toFixed(2)} MB`,
                heapTotal: `${(latestMemory.heapTotal / 1024 / 1024).toFixed(2)} MB`,
                external: `${(latestMemory.external / 1024 / 1024).toFixed(2)} MB`
            } : null,
            uptime: `${(process.uptime() / 60).toFixed(2)} minutes`
        };
    }

    getSlowQueries(limit = 10) {
        return this.metrics.slowQueries
            .sort((a, b) => b.responseTime - a.responseTime)
            .slice(0, limit);
    }
}

export default {
    PerformanceCache,
    QueryOptimizer,
    PerformanceMonitor
};
