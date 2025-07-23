/**
 * SnakkaZ - Memory Model Context Protocol (MCP)
 * Lagrer og henter kontekstuell informasjon på tvers av økter
 * Gir personalisert AI-opplevelse til brukere
 * Created: 2025-07-22
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wqpoozpbceucynsojmbk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8';

class MemoryContextSystem {
    constructor() {
        this.supabase = createClient(supabaseUrl, supabaseKey);
        this.userContext = new Map();
        this.conversationHistory = new Map();
        this.preferences = new Map();
        this.behaviorPatterns = new Map();
        
        console.log('🧠 Memory Context Protocol: Initializing...');
    }

    /**
     * MEMORY CONTEXT PROTOCOL - HVORDAN DET FUNGERER:
     * 
     * 1. KONVERSASJON MINNE:
     *    - Lagrer alle samtaler bruker har hatt
     *    - Husker emner, preferanser, stil
     *    - Fortsetter naturlig der sist samtale sluttet
     * 
     * 2. BRUKER PROFIL MINNE:
     *    - Lærer brukerens interesser over tid
     *    - Husker hva de liker/ikke liker
     *    - Tilpasser AI-svar basert på historie
     * 
     * 3. KONTEKSTUELL INTELLIGENS:
     *    - Forstår sammenheng mellom meldinger
     *    - Kan referere til tidligere samtaler
     *    - Bygger langvarige relasjoner
     */

    // Lagre konversasjonskontext
    async storeConversationContext(userId, context) {
        try {
            const contextData = {
                user_id: userId,
                conversation_id: context.conversationId,
                message_content: context.message,
                context_type: context.type || 'chat',
                topics: context.topics || [],
                sentiment: context.sentiment || 'neutral',
                preferences_detected: context.preferences || {},
                timestamp: new Date().toISOString(),
                session_id: context.sessionId
            };

            const { data, error } = await this.supabase
                .from('user_memory_context')
                .insert([contextData])
                .select();

            if (error) throw error;

            // Oppdater lokal cache
            if (!this.conversationHistory.has(userId)) {
                this.conversationHistory.set(userId, []);
            }
            this.conversationHistory.get(userId).push(contextData);

            console.log(`🧠 Context stored for user ${userId}`);
            return data[0];
        } catch (error) {
            console.error('❌ Failed to store context:', error);
            return null;
        }
    }

    // Hent brukers konversasjonshistorie
    async getUserContext(userId, limit = 50) {
        try {
            const { data, error } = await this.supabase
                .from('user_memory_context')
                .select('*')
                .eq('user_id', userId)
                .order('timestamp', { ascending: false })
                .limit(limit);

            if (error) throw error;

            // Oppdater lokal cache
            this.conversationHistory.set(userId, data);
            
            return this.analyzeUserContext(data);
        } catch (error) {
            console.error('❌ Failed to get user context:', error);
            return null;
        }
    }

    // Analyser brukerens mønster og preferanser
    analyzeUserContext(contextData) {
        const analysis = {
            totalMessages: contextData.length,
            topics: this.extractTopTopics(contextData),
            sentimentPattern: this.analyzeSentiment(contextData),
            preferredCommunicationStyle: this.analyzeStyle(contextData),
            activeHours: this.analyzeActiveHours(contextData),
            interests: this.extractInterests(contextData),
            aiPersonality: this.recommendAIPersonality(contextData)
        };

        return analysis;
    }

    extractTopTopics(data) {
        const topicCount = {};
        data.forEach(item => {
            if (item.topics) {
                item.topics.forEach(topic => {
                    topicCount[topic] = (topicCount[topic] || 0) + 1;
                });
            }
        });

        return Object.entries(topicCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([topic, count]) => ({ topic, count }));
    }

    analyzeSentiment(data) {
        const sentiments = data.map(item => item.sentiment);
        const positive = sentiments.filter(s => s === 'positive').length;
        const neutral = sentiments.filter(s => s === 'neutral').length;
        const negative = sentiments.filter(s => s === 'negative').length;
        
        return {
            positive: (positive / sentiments.length * 100).toFixed(1),
            neutral: (neutral / sentiments.length * 100).toFixed(1),
            negative: (negative / sentiments.length * 100).toFixed(1),
            dominantMood: positive > neutral && positive > negative ? 'positive' :
                         negative > neutral ? 'negative' : 'neutral'
        };
    }

    analyzeStyle(data) {
        // Analyser kommunikasjonsstil basert på meldingslengde, ordbruk etc.
        const avgMessageLength = data.reduce((sum, item) => 
            sum + (item.message_content?.length || 0), 0) / data.length;

        return {
            messageLength: avgMessageLength < 50 ? 'kort' : 
                          avgMessageLength < 150 ? 'medium' : 'lang',
            preferredStyle: avgMessageLength < 50 ? 'direkte' : 
                           avgMessageLength < 150 ? 'balansert' : 'detaljert'
        };
    }

    analyzeActiveHours(data) {
        const hours = data.map(item => new Date(item.timestamp).getHours());
        const hourCount = {};
        hours.forEach(hour => {
            hourCount[hour] = (hourCount[hour] || 0) + 1;
        });

        const mostActiveHour = Object.entries(hourCount)
            .sort(([,a], [,b]) => b - a)[0];

        return {
            mostActiveHour: mostActiveHour ? parseInt(mostActiveHour[0]) : null,
            pattern: this.categorizeTimePattern(hourCount)
        };
    }

    categorizeTimePattern(hourCount) {
        const morning = Object.keys(hourCount).filter(h => h >= 6 && h < 12).length;
        const afternoon = Object.keys(hourCount).filter(h => h >= 12 && h < 18).length;
        const evening = Object.keys(hourCount).filter(h => h >= 18 && h < 24).length;
        const night = Object.keys(hourCount).filter(h => h >= 0 && h < 6).length;

        if (morning >= afternoon && morning >= evening && morning >= night) return 'morgenperson';
        if (afternoon >= evening && afternoon >= night) return 'dagtid';
        if (evening >= night) return 'kveldsperson';
        return 'nattaktiv';
    }

    extractInterests(data) {
        // AI-basert interesseekstraksjon fra samtalehistorie
        const interests = [];
        
        data.forEach(item => {
            if (item.preferences_detected) {
                Object.keys(item.preferences_detected).forEach(pref => {
                    if (!interests.includes(pref)) {
                        interests.push(pref);
                    }
                });
            }
        });

        return interests;
    }

    recommendAIPersonality(contextData) {
        const analysis = this.analyzeSentiment(contextData);
        const style = this.analyzeStyle(contextData);
        
        if (analysis.dominantMood === 'positive' && style.preferredStyle === 'direkte') {
            return {
                personality: 'energisk-støttende',
                traits: ['entusiastisk', 'direkte', 'oppmuntrende'],
                responseStyle: 'Kort, positiv, med emojis'
            };
        } else if (analysis.dominantMood === 'neutral' && style.preferredStyle === 'detaljert') {
            return {
                personality: 'analytisk-hjelpsom',
                traits: ['grundig', 'tålmodig', 'informativ'],
                responseStyle: 'Detaljerte forklaringer med eksempler'
            };
        } else {
            return {
                personality: 'balansert-vennlig',
                traits: ['empatisk', 'fleksibel', 'tilpasningsdyktig'],
                responseStyle: 'Tilpasset til brukers behov'
            };
        }
    }

    // Generer AI-respons basert på brukers context
    async generateContextualResponse(userId, currentMessage) {
        try {
            const userContext = await this.getUserContext(userId);
            
            if (!userContext) {
                return this.generateDefaultResponse(currentMessage);
            }

            const aiPersonality = userContext.aiPersonality;
            const recentTopics = userContext.topics.slice(0, 3);
            
            const contextualPrompt = {
                message: currentMessage,
                userPersonality: aiPersonality,
                recentTopics: recentTopics,
                communicationStyle: userContext.preferredCommunicationStyle,
                mood: userContext.sentimentPattern.dominantMood,
                responseGuidelines: this.getResponseGuidelines(aiPersonality)
            };

            console.log('🤖 Generating contextual AI response...');
            return await this.callAI(contextualPrompt);
        } catch (error) {
            console.error('❌ Context generation failed:', error);
            return this.generateDefaultResponse(currentMessage);
        }
    }

    getResponseGuidelines(personality) {
        const guidelines = {
            'energisk-støttende': [
                'Bruk entusiastiske uttrykk',
                'Hold svar korte og direkte',
                'Inkluder relevante emojis',
                'Fokuserr på løsninger'
            ],
            'analytisk-hjelpsom': [
                'Gi detaljerte forklaringer',
                'Bruk eksempler og analogier',
                'Strukturer svar logisk',
                'Tilby flere alternativer'
            ],
            'balansert-vennlig': [
                'Tilpass tone til brukers humør',
                'Vær empatisk og forstående',
                'Balancer detaljer med klarhet',
                'Spør oppfølgingsspørsmål'
            ]
        };

        return guidelines[personality.personality] || guidelines['balansert-vennlig'];
    }

    async callAI(promptData) {
        // Her vil vi integrere med en AI-tjeneste som OpenAI, Claude, etc.
        // For nå returnerer vi en mock response
        return {
            response: `Basert på din historikk som en ${promptData.userPersonality.personality} person, her er mitt svar...`,
            confidence: 0.85,
            personalityMatch: true
        };
    }

    generateDefaultResponse(message) {
        return {
            response: "Hei! Jeg lærer fortsatt å kjenne deg. Jo mer vi snakker, desto bedre kan jeg hjelpe deg!",
            confidence: 0.5,
            personalityMatch: false
        };
    }

    // Oppdater brukerpreferanser
    async updateUserPreferences(userId, preferences) {
        try {
            const { data, error } = await this.supabase
                .from('user_preferences')
                .upsert([{
                    user_id: userId,
                    preferences: preferences,
                    updated_at: new Date().toISOString()
                }])
                .select();

            if (error) throw error;

            this.preferences.set(userId, preferences);
            console.log(`✅ Preferences updated for user ${userId}`);
            return data[0];
        } catch (error) {
            console.error('❌ Failed to update preferences:', error);
            return null;
        }
    }

    // Få personaliserte anbefalinger
    async getPersonalizedRecommendations(userId) {
        const context = await this.getUserContext(userId);
        
        if (!context) return [];

        const recommendations = [];

        // Basert på interesser
        context.interests.forEach(interest => {
            recommendations.push({
                type: 'feature',
                title: `Utforsk ${interest}`,
                description: `Basert på din interesse for ${interest}`,
                priority: 'medium'
            });
        });

        // Basert på bruksmønster
        if (context.activeHours.pattern === 'kveldsperson') {
            recommendations.push({
                type: 'setting',
                title: 'Aktivér mørk modus',
                description: 'Perfekt for dine kveldstimer',
                priority: 'high'
            });
        }

        return recommendations;
    }
}

// Eksporter system
const memoryContext = new MemoryContextSystem();
window.memoryContext = memoryContext;

console.log('🧠 SnakkaZ Memory Context Protocol loaded and ready');
export default memoryContext;
