/**
 * SnakkaZ Chat System Types
 * TypeScript type definitions for the SnakkaZ MCP Server
 */
export interface SnakkaZUser {
    id: string;
    username: string;
    role: 'admin' | 'moderator' | 'premium' | 'standard';
    region: 'oslo' | 'bergen' | 'trondheim' | 'stavanger' | 'other';
    joinedAt: string;
    lastActive: string;
}
export interface SnakkaZMessage {
    id: string;
    chatId: string;
    senderId: string;
    content: string;
    encrypted: boolean;
    timestamp: string;
    chatType: 'global' | 'private' | 'group';
    metadata?: MessageMetadata;
}
export interface MessageMetadata {
    edited?: boolean;
    editedAt?: string;
    pinned?: boolean;
    pinnedBy?: string;
    reactions?: Reaction[];
    replyTo?: string;
}
export interface Reaction {
    emoji: string;
    userId: string;
    timestamp: string;
}
export interface SnakkaZGroup {
    id: string;
    name: string;
    description: string;
    memberCount: number;
    region: string;
    topics: string[];
    createdAt: string;
    isPrivate: boolean;
}
export interface DeploymentStatus {
    id: string;
    status: 'pending' | 'running' | 'success' | 'failed';
    type: 'normal' | 'emergency' | 'hotfix';
    startedAt: string;
    completedAt?: string;
    deployedBy: string;
    commitSha: string;
    branch: string;
}
export interface SystemHealth {
    component: string;
    status: 'healthy' | 'degraded' | 'unhealthy';
    lastCheck: string;
    responseTime?: number;
    uptime?: string;
    details?: Record<string, unknown>;
}
export interface NorwegianTechCommunity {
    totalMembers: number;
    activeMembers: number;
    groups: SnakkaZGroup[];
    events: CommunityEvent[];
    engagement: {
        dailyActive: number;
        weeklyActive: number;
        monthlyActive: number;
    };
}
export interface CommunityEvent {
    id: string;
    name: string;
    description: string;
    date: string;
    location: string;
    attendees: number;
    maxAttendees?: number;
    organizer: string;
    tags: string[];
}
export interface DecryptedMessage {
    id: string;
    sender_id: string;
    recipient_id?: string;
    chat_id?: string;
    content: string;
    timestamp: string;
    message_type: 'text' | 'image' | 'file' | 'emoji';
    metadata?: {
        ip?: string;
        user_agent?: string;
        encryption_level?: string;
        [key: string]: any;
    };
}
//# sourceMappingURL=index.d.ts.map