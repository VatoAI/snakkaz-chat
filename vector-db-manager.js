import { QdrantClient } from '@qdrant/js-client-rest';
import MockVectorDB from './mock-vector-db.js';

export class VectorDBManager {
    constructor() {
        this.client = null;
        this.isConnected = false;
        this.collections = new Map();
        this.useMock = false;
        this.mockDB = null;
    }

    async connect(url = 'http://localhost:6333') {
        try {
            // Try real Qdrant first
            this.client = new QdrantClient({ url });
            const health = await this.client.getClusterInfo();
            console.log('🟢 Qdrant connected:', health);
            
            this.isConnected = true;
            this.useMock = false;
            return { success: true, status: 'connected', info: health };
        } catch (error) {
            console.log('🔴 Real Qdrant failed, using Mock Vector DB');
            
            // Fallback to mock
            this.mockDB = new MockVectorDB();
            const result = await this.mockDB.connect(url);
            this.isConnected = result.success;
            this.useMock = true;
            return result;
        }
    }

    async createCollection(name = 'snakkaz_knowledge', vectorSize = 384) {
        if (!this.isConnected) {
            throw new Error('Not connected to Vector DB');
        }

        if (this.useMock) {
            return await this.mockDB.createCollection(name, { size: vectorSize, distance: 'Cosine' });
        }

        try {
            await this.client.createCollection(name, {
                vectors: {
                    size: vectorSize,
                    distance: 'Cosine'
                }
            });
            
            this.collections.set(name, { size: vectorSize, distance: 'Cosine' });
            console.log(`✅ Collection '${name}' created`);
            return { success: true, collection: name };
        } catch (error) {
            if (error.message.includes('already exists')) {
                console.log(`ℹ️ Collection '${name}' already exists`);
                return { success: true, collection: name, existing: true };
            }
            throw error;
        }
    }

    async getCollections() {
        if (!this.isConnected) return [];
        
        if (this.useMock) {
            return await this.mockDB.getCollections();
        }
        
        try {
            const response = await this.client.getCollections();
            return response.collections || [];
        } catch (error) {
            console.error('Error fetching collections:', error);
            return [];
        }
    }

    async insertFacts(facts, collectionName = 'snakkaz_knowledge') {
        if (!this.isConnected) {
            throw new Error('Not connected to Vector DB');
        }

        if (this.useMock) {
            return await this.mockDB.insertFacts(facts);
        }

        try {
            const points = facts.map((fact, index) => ({
                id: Date.now() + index,
                vector: this.generateEmbedding(fact),
                payload: { 
                    fact, 
                    type: 'knowledge',
                    timestamp: new Date().toISOString(),
                    category: this.categorize(fact)
                }
            }));

            await this.client.upsert(collectionName, {
                wait: true,
                points
            });

            console.log(`✅ Inserted ${facts.length} facts into ${collectionName}`);
            return { success: true, count: facts.length };
        } catch (error) {
            console.error('Error inserting facts:', error);
            throw error;
        }
    }

    async searchSimilar(query, collectionName = 'snakkaz_knowledge', limit = 5) {
        if (!this.isConnected) {
            throw new Error('Not connected to Vector DB');
        }

        if (this.useMock) {
            return await this.mockDB.searchSimilar(query, collectionName, limit);
        }

        try {
            const queryVector = this.generateEmbedding(query);
            
            const results = await this.client.search(collectionName, {
                vector: queryVector,
                limit,
                with_payload: true,
                score_threshold: 0.7
            });

            console.log(`🔍 Found ${results.length} similar results for: "${query}"`);
            return {
                success: true,
                query,
                count: results.length,
                results: results.map(result => ({
                    score: result.score,
                    fact: result.payload.fact,
                    category: result.payload.category,
                    timestamp: result.payload.timestamp
                }))
            };
        } catch (error) {
            console.error('Error searching:', error);
            throw error;
        }
    }

    // Simple embedding generation (in production, use actual models)
    generateEmbedding(text) {
        // Simple hash-based embedding for demo
        const words = text.toLowerCase().split(' ');
        const embedding = new Array(384).fill(0);
        
        words.forEach((word, i) => {
            const hash = this.simpleHash(word);
            embedding[hash % 384] += 1;
        });
        
        // Normalize
        const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
        return embedding.map(val => magnitude > 0 ? val / magnitude : 0);
    }

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 32-bit integer
        }
        return Math.abs(hash);
    }

    categorize(fact) {
        const categories = {
            performance: ['fast', 'speed', 'quick', 'rask', 'ytelse'],
            security: ['secure', 'safety', 'sikker', 'krypter'],
            features: ['feature', 'function', 'funksjon', 'mulighet'],
            comparison: ['better', 'vs', 'compared', 'bedre', 'sammenlignet']
        };

        const lowerFact = fact.toLowerCase();
        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => lowerFact.includes(keyword))) {
                return category;
            }
        }
        return 'general';
    }

    async getStats(collectionName = 'snakkaz_knowledge') {
        if (!this.isConnected) return null;

        if (this.useMock) {
            return await this.mockDB.getStats();
        }

        try {
            const info = await this.client.getCollection(collectionName);
            return {
                vectorCount: info.vectors_count || 0,
                indexedVectorsCount: info.indexed_vectors_count || 0,
                pointsCount: info.points_count || 0,
                status: info.status
            };
        } catch (error) {
            console.error('Error getting collection stats:', error);
            return null;
        }
    }

    async disconnect() {
        this.isConnected = false;
        if (this.useMock && this.mockDB) {
            await this.mockDB.disconnect();
        }
        this.client = null;
        this.mockDB = null;
        this.collections.clear();
        console.log('🔌 Disconnected from Vector DB');
    }
}

export default VectorDBManager;
