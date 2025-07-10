/**
 * Database Types for SnakkaZ MCP Server
 *
 * Auto-generated and manually maintained types for Supabase database
 */
export type Json = string | number | boolean | null | {
    [key: string]: Json | undefined;
} | Json[];
export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string;
                    email: string;
                    full_name: string;
                    created_at: string;
                    updated_at: string;
                    region: string | null;
                    tech_groups: string[] | null;
                    profile_data: Json | null;
                };
                Insert: {
                    id?: string;
                    email: string;
                    full_name: string;
                    created_at?: string;
                    updated_at?: string;
                    region?: string | null;
                    tech_groups?: string[] | null;
                    profile_data?: Json | null;
                };
                Update: {
                    id?: string;
                    email?: string;
                    full_name?: string;
                    created_at?: string;
                    updated_at?: string;
                    region?: string | null;
                    tech_groups?: string[] | null;
                    profile_data?: Json | null;
                };
            };
            chats: {
                Row: {
                    id: string;
                    name: string;
                    created_at: string;
                    updated_at: string;
                    is_group: boolean;
                    metadata: Json | null;
                };
                Insert: {
                    id?: string;
                    name: string;
                    created_at?: string;
                    updated_at?: string;
                    is_group?: boolean;
                    metadata?: Json | null;
                };
                Update: {
                    id?: string;
                    name?: string;
                    created_at?: string;
                    updated_at?: string;
                    is_group?: boolean;
                    metadata?: Json | null;
                };
            };
            messages: {
                Row: {
                    id: string;
                    chat_id: string;
                    user_id: string;
                    content: string;
                    encrypted: boolean;
                    created_at: string;
                    metadata: Json | null;
                };
                Insert: {
                    id?: string;
                    chat_id: string;
                    user_id: string;
                    content: string;
                    encrypted?: boolean;
                    created_at?: string;
                    metadata?: Json | null;
                };
                Update: {
                    id?: string;
                    chat_id?: string;
                    user_id?: string;
                    content?: string;
                    encrypted?: boolean;
                    created_at?: string;
                    metadata?: Json | null;
                };
            };
            chat_participants: {
                Row: {
                    chat_id: string;
                    user_id: string;
                    joined_at: string;
                    role: string;
                };
                Insert: {
                    chat_id: string;
                    user_id: string;
                    joined_at?: string;
                    role?: string;
                };
                Update: {
                    chat_id?: string;
                    user_id?: string;
                    joined_at?: string;
                    role?: string;
                };
            };
            tech_companies: {
                Row: {
                    id: string;
                    name: string;
                    description: string | null;
                    website: string | null;
                    region: string | null;
                    industry: string[] | null;
                    founded_year: number | null;
                    size: string | null;
                    contact_info: Json | null;
                    created_at: string;
                    is_hiring: boolean;
                };
                Insert: {
                    id?: string;
                    name: string;
                    description?: string | null;
                    website?: string | null;
                    region?: string | null;
                    industry?: string[] | null;
                    founded_year?: number | null;
                    size?: string | null;
                    contact_info?: Json | null;
                    created_at?: string;
                    is_hiring?: boolean;
                };
                Update: {
                    id?: string;
                    name?: string;
                    description?: string | null;
                    website?: string | null;
                    region?: string | null;
                    industry?: string[] | null;
                    founded_year?: number | null;
                    size?: string | null;
                    contact_info?: Json | null;
                    created_at?: string;
                    is_hiring?: boolean;
                };
            };
            tech_events: {
                Row: {
                    id: string;
                    name: string;
                    description: string | null;
                    event_date: string;
                    end_date: string | null;
                    location: string | null;
                    region: string | null;
                    organizer: string | null;
                    website: string | null;
                    topics: string[] | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    description?: string | null;
                    event_date: string;
                    end_date?: string | null;
                    location?: string | null;
                    region?: string | null;
                    organizer?: string | null;
                    website?: string | null;
                    topics?: string[] | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    description?: string | null;
                    event_date?: string;
                    end_date?: string | null;
                    location?: string | null;
                    region?: string | null;
                    organizer?: string | null;
                    website?: string | null;
                    topics?: string[] | null;
                    created_at?: string;
                };
            };
            tech_jobs: {
                Row: {
                    id: string;
                    title: string;
                    company_id: string | null;
                    description: string | null;
                    location: string | null;
                    region: string | null;
                    skills_required: string[] | null;
                    experience_level: string | null;
                    job_type: string | null;
                    posted_date: string;
                    application_url: string | null;
                    salary_range: string | null;
                };
                Insert: {
                    id?: string;
                    title: string;
                    company_id?: string | null;
                    description?: string | null;
                    location?: string | null;
                    region?: string | null;
                    skills_required?: string[] | null;
                    experience_level?: string | null;
                    job_type?: string | null;
                    posted_date?: string;
                    application_url?: string | null;
                    salary_range?: string | null;
                };
                Update: {
                    id?: string;
                    title?: string;
                    company_id?: string | null;
                    description?: string | null;
                    location?: string | null;
                    region?: string | null;
                    skills_required?: string[] | null;
                    experience_level?: string | null;
                    job_type?: string | null;
                    posted_date?: string;
                    application_url?: string | null;
                    salary_range?: string | null;
                };
            };
            security_logs: {
                Row: {
                    id: string;
                    activity_type: string;
                    user_id: string | null;
                    details: Json | null;
                    timestamp: string;
                    security_level: string;
                };
                Insert: {
                    id?: string;
                    activity_type: string;
                    user_id?: string | null;
                    details?: Json | null;
                    timestamp?: string;
                    security_level?: string;
                };
                Update: {
                    id?: string;
                    activity_type?: string;
                    user_id?: string | null;
                    details?: Json | null;
                    timestamp?: string;
                    security_level?: string;
                };
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
}
export type TechCompany = Database['public']['Tables']['tech_companies']['Row'];
export type TechEvent = Database['public']['Tables']['tech_events']['Row'];
export type TechJob = Database['public']['Tables']['tech_jobs']['Row'];
export type User = Database['public']['Tables']['users']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
export type Chat = Database['public']['Tables']['chats']['Row'];
export type SecurityLog = Database['public']['Tables']['security_logs']['Row'];
export declare enum Region {
    OSLO = "oslo",
    BERGEN = "bergen",
    TRONDHEIM = "trondheim",
    STAVANGER = "stavanger",
    ALL = "all"
}
export declare enum ExperienceLevel {
    JUNIOR = "junior",
    MID = "mid",
    SENIOR = "senior",
    LEAD = "lead",
    ALL = "all"
}
export declare enum JobType {
    FULL_TIME = "full-time",
    PART_TIME = "part-time",
    CONTRACT = "contract",
    INTERNSHIP = "internship",
    REMOTE = "remote"
}
export declare enum CompanySize {
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large",
    ALL = "all"
}
//# sourceMappingURL=database.types.d.ts.map