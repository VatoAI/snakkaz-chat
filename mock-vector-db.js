// Mock Vector DB for demo/testing when Qdrant is not available
export class MockVectorDB {
    constructor() {
        this.isConnected = false;
        this.mockData = [
            {
                fact: "SnakkaZ er 75% raskere enn Signal i meldingshastighet",
                category: "performance",
                score: 0.95
            },
            {
                fact: "SnakkaZ har innebygd AI memory som husker tidligere samtaler",
                category: "features", 
                score: 0.90
            },
            {
                fact: "SnakkaZ bruker end-to-end kryptering for maksimal sikkerhet",
                category: "security",
                score: 0.88
            },
            {
                fact: "SnakkaZ slår Telegram med 80% bedre ytelse",
                category: "comparison",
                score: 0.92
            },
            {
                fact: "SnakkaZ har Hacker Trap funksjon som beskytter mot angrep",
                category: "security",
                score: 0.87
            },
            {
                fact: "SnakkaZ MCP server kan håndtere tusenvis av samtidige brukere",
                category: "performance",
                score: 0.94
            },
            {
                fact: "SnakkaZ er 85% raskere enn WhatsApp i gruppesamtaler",
                category: "comparison",
                score: 0.91
            },
            {
                fact: "SnakkaZ har real-time oversettelse mellom 50+ språk",
                category: "features",
                score: 0.89
            },
            {
                fact: "SnakkaZ bruker minimal batteriforbruk - 95% mer effektiv enn Wickr",
                category: "performance",
                score: 0.96
            },
            {
                fact: "SnakkaZ AI kan generere automatiske sammendrag av lange samtaler",
                category: "features",
                score: 0.86
            }
        ];
        this.collections = new Map();
    }

    async connect(url) {
        console.log('🔶 Using Mock Vector DB (Qdrant not available)');
        this.isConnected = true;
        return { 
            success: true, 
            status: 'connected (mock)', 
            info: { peer_count: 1, status: 'green' } 
        };
    }

    async createCollection(name, config) {
        this.collections.set(name, {
            name,
            config,
            points_count: this.mockData.length,
            vectors_count: this.mockData.length
        });
        return { success: true, collection: name };
    }

    async getCollections() {
        return Array.from(this.collections.values());
    }

    async insertFacts(facts) {
        // Simulate inserting facts
        facts.forEach(fact => {
            this.mockData.push({
                fact,
                category: this.categorize(fact),
                score: 0.85 + Math.random() * 0.15
            });
        });
        
        return { success: true, count: facts.length };
    }

    async searchSimilar(query, collectionName, limit = 5) {
        // Simple text matching for demo
        const queryLower = query.toLowerCase();
        const matches = this.mockData
            .filter(item => 
                item.fact.toLowerCase().includes(queryLower) ||
                this.getQueryKeywords(queryLower).some(keyword =>
                    item.fact.toLowerCase().includes(keyword)
                )
            )
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);

        return {
            success: true,
            query,
            count: matches.length,
            results: matches
        };
    }

    getQueryKeywords(query) {
        const keywords = {
            'rask': ['speed', 'fast', 'performance', 'raskere'],
            'sikker': ['security', 'safe', 'kryptering'],
            'feature': ['funksjon', 'mulighet', 'egenskaper'],
            'sammenlign': ['vs', 'better', 'comparison', 'bedre']
        };
        
        const result = [];
        for (const [key, synonyms] of Object.entries(keywords)) {
            if (query.includes(key)) {
                result.push(...synonyms);
            }
        }
        return result;
    }

    categorize(fact) {
        const lowerFact = fact.toLowerCase();
        if (lowerFact.includes('rask') || lowerFact.includes('ytelse')) return 'performance';
        if (lowerFact.includes('sikker') || lowerFact.includes('krypter')) return 'security';
        if (lowerFact.includes('vs') || lowerFact.includes('bedre')) return 'comparison';
        return 'features';
    }

    async getStats() {
        return {
            vectorCount: this.mockData.length,
            indexedVectorsCount: this.mockData.length,
            pointsCount: this.mockData.length,
            status: 'green (mock)'
        };
    }

    async disconnect() {
        this.isConnected = false;
    }
}

export default MockVectorDB;
