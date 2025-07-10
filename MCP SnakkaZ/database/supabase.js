/**
 * Supabase Configuration and Database Manager
 *
 * Handles all database operations for SnakkaZ MCP Server
 *
 * @version 2.1.0
 * @author SnakkaZ Team
 */
import { createClient } from '@supabase/supabase-js';
// ========================================================================
// SUPABASE CONFIGURATION
// ========================================================================
const SUPABASE_URL = 'https://wqpoozpbceucynsojmbk.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8';
// JWT Secret for additional security
const JWT_SECRET = 'KcBgfjzAxA2SNyiszPYm92UXMGoJAXF35N/NLTN3K9JO7YsM4RFfiHvcTqocPzfCYM/48GrsvLiEqrKBEaS5eg==';
// ========================================================================
// SUPABASE DATABASE MANAGER
// ========================================================================
export class SupabaseManager {
    client;
    isInitialized = false;
    constructor() {
        this.client = createClient(SUPABASE_URL, SUPABASE_KEY);
    }
    async initialize() {
        try {
            // Test connection
            const { data, error } = await this.client
                .from('users')
                .select('count')
                .limit(1);
            if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist (expected in dev)
                console.warn('⚠️  Supabase connection warning:', error.message);
            }
            this.isInitialized = true;
            console.log('✅ Supabase connected successfully');
        }
        catch (error) {
            console.error('❌ Supabase initialization failed:', error);
            // Don't throw error, allow server to start in demo mode
        }
    }
    // ========================================================================
    // AUTHENTICATION METHODS
    // ========================================================================
    async authenticateUser(token) {
        try {
            const { data, error } = await this.client.auth.getUser(token);
            return { user: data.user, error };
        }
        catch (error) {
            return { user: null, error };
        }
    }
    async signUp(email, password) {
        const response = await this.client.auth.signUp({ email, password });
        return { user: response.data.user, error: response.error };
    }
    async signIn(email, password) {
        const response = await this.client.auth.signInWithPassword({ email, password });
        return { user: response.data.user, error: response.error };
    }
    // ========================================================================
    // NORWEGIAN TECH COMPANIES
    // ========================================================================
    async getTechCompanies(region, industry) {
        if (!this.isInitialized) {
            return this.getMockTechCompanies(region, industry);
        }
        try {
            let query = this.client
                .from('tech_companies')
                .select('*');
            if (region && region !== 'all') {
                query = query.eq('region', region);
            }
            if (industry) {
                query = query.contains('industry', [industry]);
            }
            const { data, error } = await query.limit(50);
            if (error) {
                console.error('Database error, falling back to mock data:', error);
                return this.getMockTechCompanies(region, industry);
            }
            return data || [];
        }
        catch (error) {
            console.error('Error fetching tech companies:', error);
            return this.getMockTechCompanies(region, industry);
        }
    }
    getMockTechCompanies(region, industry) {
        const companies = [
            {
                id: '1',
                name: 'Schibsted',
                description: 'Leading media and technology company in Norway',
                website: 'https://schibsted.com',
                region: 'oslo',
                industry: ['Media', 'Technology'],
                size: 'Large',
                founded_year: 1839,
                is_hiring: true,
                contact_info: { email: 'jobs@schibsted.com' }
            },
            {
                id: '2',
                name: 'Telenor',
                description: 'Major telecommunications company',
                website: 'https://telenor.com',
                region: 'oslo',
                industry: ['Telecommunications', 'Technology'],
                size: 'Large',
                founded_year: 1855,
                is_hiring: true,
                contact_info: { email: 'careers@telenor.com' }
            },
            {
                id: '3',
                name: 'Opera Software',
                description: 'Web browser and technology company',
                website: 'https://opera.com',
                region: 'oslo',
                industry: ['Software', 'Browser Technology'],
                size: 'Medium',
                founded_year: 1995,
                is_hiring: true,
                contact_info: { email: 'jobs@opera.com' }
            },
            {
                id: '4',
                name: 'Kahoot!',
                description: 'Learning platform and educational technology',
                website: 'https://kahoot.com',
                region: 'oslo',
                industry: ['EdTech', 'Software'],
                size: 'Medium',
                founded_year: 2012,
                is_hiring: true,
                contact_info: { email: 'jobs@kahoot.com' }
            },
            {
                id: '5',
                name: 'Equinor Digital',
                description: 'Digital solutions for energy sector',
                website: 'https://equinor.com',
                region: 'stavanger',
                industry: ['Energy', 'Technology'],
                size: 'Large',
                founded_year: 1972,
                is_hiring: true,
                contact_info: { email: 'careers@equinor.com' }
            },
            {
                id: '6',
                name: 'Variant',
                description: 'Consulting and software development',
                website: 'https://variant.no',
                region: 'trondheim',
                industry: ['Consulting', 'Software'],
                size: 'Small',
                founded_year: 2018,
                is_hiring: true,
                contact_info: { email: 'post@variant.no' }
            },
            {
                id: '7',
                name: 'Crayon',
                description: 'Global software asset management',
                website: 'https://crayon.com',
                region: 'oslo',
                industry: ['Software', 'Cloud'],
                size: 'Large',
                founded_year: 2002,
                is_hiring: true,
                contact_info: { email: 'careers@crayon.com' }
            },
            {
                id: '8',
                name: 'Otovo',
                description: 'Solar energy marketplace',
                website: 'https://otovo.com',
                region: 'oslo',
                industry: ['Energy', 'Marketplace'],
                size: 'Medium',
                founded_year: 2016,
                is_hiring: true,
                contact_info: { email: 'jobs@otovo.com' }
            }
        ];
        let filtered = companies;
        if (region && region !== 'all') {
            filtered = filtered.filter(c => c.region === region);
        }
        if (industry) {
            filtered = filtered.filter(c => c.industry.some(i => i.toLowerCase().includes(industry.toLowerCase())));
        }
        return filtered;
    }
    // ========================================================================
    // NORWEGIAN TECH EVENTS
    // ========================================================================
    async getTechEvents(region, upcoming = true) {
        if (!this.isInitialized) {
            return this.getMockTechEvents(region, upcoming);
        }
        try {
            let query = this.client
                .from('tech_events')
                .select('*');
            if (upcoming) {
                query = query.gte('event_date', new Date().toISOString());
            }
            if (region && region !== 'all') {
                query = query.eq('region', region);
            }
            const { data, error } = await query
                .order('event_date', { ascending: true })
                .limit(20);
            if (error) {
                console.error('Database error, falling back to mock data:', error);
                return this.getMockTechEvents(region, upcoming);
            }
            return data || [];
        }
        catch (error) {
            console.error('Error fetching tech events:', error);
            return this.getMockTechEvents(region, upcoming);
        }
    }
    getMockTechEvents(region, upcoming = true) {
        const events = [
            {
                id: '1',
                name: 'NDC Security',
                description: 'Premier security conference in Scandinavia',
                event_date: '2025-08-15T09:00:00Z',
                end_date: '2025-08-17T18:00:00Z',
                location: 'Oslo Spektrum',
                region: 'oslo',
                organizer: 'NDC Conferences',
                website: 'https://ndcsecurity.com',
                topics: ['Security', 'DevSecOps', 'Penetration Testing']
            },
            {
                id: '2',
                name: 'Booster Conference',
                description: 'Software conference focusing on people and technology',
                event_date: '2025-09-12T09:00:00Z',
                end_date: '2025-09-13T18:00:00Z',
                location: 'Bergen Børs',
                region: 'bergen',
                organizer: 'Booster',
                website: 'https://boosterconf.no',
                topics: ['Software Development', 'Agile', 'Innovation']
            },
            {
                id: '3',
                name: 'JavaZone',
                description: 'Norway\'s largest Java conference',
                event_date: '2025-09-10T09:00:00Z',
                end_date: '2025-09-11T18:00:00Z',
                location: 'Oslo Spektrum',
                region: 'oslo',
                organizer: 'JavaZone',
                website: 'https://javazone.no',
                topics: ['Java', 'JVM', 'Microservices']
            },
            {
                id: '4',
                name: 'Oslo AI Meetup',
                description: 'Monthly AI and machine learning meetup',
                event_date: '2025-07-20T18:00:00Z',
                end_date: '2025-07-20T21:00:00Z',
                location: 'Rebel Oslo',
                region: 'oslo',
                organizer: 'Oslo AI Community',
                website: 'https://meetup.com/oslo-ai',
                topics: ['AI', 'Machine Learning', 'Deep Learning']
            },
            {
                id: '5',
                name: 'Trondheim Developer Meetup',
                description: 'Local developer community meetup',
                event_date: '2025-07-25T18:00:00Z',
                end_date: '2025-07-25T21:00:00Z',
                location: 'NTNU Dragvoll',
                region: 'trondheim',
                organizer: 'Trondheim Developers',
                website: 'https://meetup.com/trondheim-dev',
                topics: ['Web Development', 'Mobile', 'Cloud']
            },
            {
                id: '6',
                name: 'React Oslo',
                description: 'React and frontend development meetup',
                event_date: '2025-08-05T18:00:00Z',
                end_date: '2025-08-05T21:00:00Z',
                location: 'Mesh Community',
                region: 'oslo',
                organizer: 'React Oslo',
                website: 'https://meetup.com/react-oslo',
                topics: ['React', 'Frontend', 'JavaScript']
            }
        ];
        let filtered = events;
        if (upcoming) {
            const now = new Date();
            filtered = filtered.filter(e => new Date(e.event_date) > now);
        }
        if (region && region !== 'all') {
            filtered = filtered.filter(e => e.region === region);
        }
        return filtered;
    }
    // ========================================================================
    // NORWEGIAN TECH JOBS
    // ========================================================================
    async getTechJobs(region, techStack, level) {
        if (!this.isInitialized) {
            return this.getMockTechJobs(region, techStack, level);
        }
        try {
            let query = this.client
                .from('tech_jobs')
                .select('*, tech_companies(name, website)');
            if (region && region !== 'all') {
                query = query.eq('region', region);
            }
            if (level && level !== 'all') {
                query = query.eq('experience_level', level);
            }
            if (techStack && techStack.length > 0) {
                query = query.overlaps('skills_required', techStack);
            }
            const { data, error } = await query
                .order('posted_date', { ascending: false })
                .limit(25);
            if (error) {
                console.error('Database error, falling back to mock data:', error);
                return this.getMockTechJobs(region, techStack, level);
            }
            return data || [];
        }
        catch (error) {
            console.error('Error fetching tech jobs:', error);
            return this.getMockTechJobs(region, techStack, level);
        }
    }
    getMockTechJobs(region, techStack, level) {
        const jobs = [
            {
                id: '1',
                title: 'Senior TypeScript Developer',
                company: { name: 'Oslo Tech AS', website: 'https://oslotech.no' },
                description: 'Join our team building next-gen web applications',
                location: 'Oslo',
                region: 'oslo',
                skills_required: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
                experience_level: 'senior',
                job_type: 'full-time',
                posted_date: '2025-07-01T10:00:00Z',
                application_url: 'https://oslotech.no/careers/senior-typescript-developer'
            },
            {
                id: '2',
                title: 'AI Engineer',
                company: { name: 'Trondheim AI Labs', website: 'https://trondheimai.no' },
                description: 'Work on cutting-edge AI and machine learning projects',
                location: 'Trondheim',
                region: 'trondheim',
                skills_required: ['Python', 'TensorFlow', 'PyTorch', 'Docker'],
                experience_level: 'senior',
                job_type: 'full-time',
                posted_date: '2025-07-02T10:00:00Z',
                application_url: 'https://trondheimai.no/careers/ai-engineer'
            },
            {
                id: '3',
                title: 'Full-stack Developer',
                company: { name: 'Bergen Startup', website: 'https://bergenstartup.no' },
                description: 'Great opportunity for junior developers to grow',
                location: 'Bergen',
                region: 'bergen',
                skills_required: ['JavaScript', 'Vue.js', 'Express', 'MongoDB'],
                experience_level: 'junior',
                job_type: 'full-time',
                posted_date: '2025-07-03T10:00:00Z',
                application_url: 'https://bergenstartup.no/careers/fullstack-developer'
            },
            {
                id: '4',
                title: 'DevOps Engineer',
                company: { name: 'Stavanger Energy Tech', website: 'https://stavangerenergytech.no' },
                description: 'Infrastructure and automation for energy sector',
                location: 'Stavanger',
                region: 'stavanger',
                skills_required: ['Kubernetes', 'AWS', 'Terraform', 'Python'],
                experience_level: 'senior',
                job_type: 'full-time',
                posted_date: '2025-07-04T10:00:00Z',
                application_url: 'https://stavangerenergytech.no/careers/devops-engineer'
            },
            {
                id: '5',
                title: 'Frontend Lead',
                company: { name: 'Oslo Fintech', website: 'https://oslofintech.no' },
                description: 'Lead frontend team in financial technology',
                location: 'Oslo',
                region: 'oslo',
                skills_required: ['React', 'TypeScript', 'GraphQL', 'Webpack'],
                experience_level: 'lead',
                job_type: 'full-time',
                posted_date: '2025-07-05T10:00:00Z',
                application_url: 'https://oslofintech.no/careers/frontend-lead'
            },
            {
                id: '6',
                title: 'Backend Developer',
                company: { name: 'Variant', website: 'https://variant.no' },
                description: 'Build scalable backend systems',
                location: 'Trondheim',
                region: 'trondheim',
                skills_required: ['Java', 'Spring', 'PostgreSQL', 'Redis'],
                experience_level: 'mid',
                job_type: 'full-time',
                posted_date: '2025-07-06T10:00:00Z',
                application_url: 'https://variant.no/careers/backend-developer'
            }
        ];
        let filtered = jobs;
        if (region && region !== 'all') {
            filtered = filtered.filter(j => j.region === region);
        }
        if (level && level !== 'all') {
            filtered = filtered.filter(j => j.experience_level === level);
        }
        if (techStack && techStack.length > 0) {
            filtered = filtered.filter(j => techStack.some(tech => j.skills_required.some(skill => skill.toLowerCase().includes(tech.toLowerCase()))));
        }
        return filtered;
    }
    // ========================================================================
    // CHAT FUNCTIONALITY
    // ========================================================================
    async saveMessage(message) {
        if (!this.isInitialized) {
            // Mock save in demo mode
            return {
                id: `msg_${Date.now()}`,
                ...message,
                created_at: new Date().toISOString()
            };
        }
        try {
            const { data, error } = await this.client
                .from('messages')
                .insert({
                ...message,
                created_at: new Date().toISOString()
            })
                .select()
                .single();
            if (error) {
                throw new Error(`Failed to save message: ${error.message}`);
            }
            return data;
        }
        catch (error) {
            console.error('Error saving message:', error);
            throw error;
        }
    }
    async getChatHistory(chatId, limit = 50) {
        if (!this.isInitialized) {
            return [];
        }
        try {
            const { data, error } = await this.client
                .from('messages')
                .select('*, users(full_name, email)')
                .eq('chat_id', chatId)
                .order('created_at', { ascending: false })
                .limit(limit);
            if (error) {
                throw new Error(`Failed to get chat history: ${error.message}`);
            }
            return data || [];
        }
        catch (error) {
            console.error('Error getting chat history:', error);
            return [];
        }
    }
    // ========================================================================
    // HEALTH CHECK
    // ========================================================================
    async healthCheck() {
        try {
            // Test database connection
            const { data: dbData, error: dbError } = await this.client
                .from('users')
                .select('count')
                .limit(1);
            // Test auth service
            const { data: authData, error: authError } = await this.client.auth.getSession();
            return {
                database: !dbError,
                auth: !authError,
                details: {
                    database: dbError ? dbError.message : 'OK',
                    auth: authError ? authError.message : 'OK',
                    initialized: this.isInitialized
                }
            };
        }
        catch (error) {
            return {
                database: false,
                auth: false,
                details: {
                    error: error instanceof Error ? error.message : 'Unknown error'
                }
            };
        }
    }
}
// ========================================================================
// EXPORT SINGLETON INSTANCE
// ========================================================================
export const supabaseManager = new SupabaseManager();
//# sourceMappingURL=supabase.js.map