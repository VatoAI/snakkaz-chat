-- SnakkaZ Vector Memory Database Schema
-- Requires pgvector extension for Supabase

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Vector memories table for storing conversation memories with embeddings
CREATE TABLE IF NOT EXISTS vector_memories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    conversation_id VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1536), -- OpenAI embedding dimension
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversation contexts table for storing conversation summaries and context
CREATE TABLE IF NOT EXISTS conversation_contexts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    conversation_id VARCHAR(255) NOT NULL,
    summary TEXT,
    key_topics TEXT[] DEFAULT '{}',
    user_preferences JSONB DEFAULT '{}',
    conversation_style VARCHAR(50) DEFAULT 'standard',
    last_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, conversation_id)
);

-- User memory profiles for storing long-term user patterns
CREATE TABLE IF NOT EXISTS user_memory_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    preferences JSONB DEFAULT '{}',
    topics_of_interest TEXT[] DEFAULT '{}',
    communication_style VARCHAR(50) DEFAULT 'standard',
    memory_highlights TEXT[] DEFAULT '{}',
    interaction_patterns JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_vector_memories_user_id ON vector_memories(user_id);
CREATE INDEX IF NOT EXISTS idx_vector_memories_conversation_id ON vector_memories(conversation_id);
CREATE INDEX IF NOT EXISTS idx_vector_memories_created_at ON vector_memories(created_at);
CREATE INDEX IF NOT EXISTS idx_vector_memories_importance ON vector_memories USING GIN ((metadata->'importance_score'));

-- Vector similarity index (HNSW for better performance)
CREATE INDEX IF NOT EXISTS idx_vector_memories_embedding ON vector_memories 
USING hnsw (embedding vector_cosine_ops);

-- Conversation contexts indexes
CREATE INDEX IF NOT EXISTS idx_conversation_contexts_user_id ON conversation_contexts(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_contexts_last_interaction ON conversation_contexts(last_interaction);

-- User memory profiles index
CREATE INDEX IF NOT EXISTS idx_user_memory_profiles_user_id ON user_memory_profiles(user_id);

-- RLS (Row Level Security) policies
ALTER TABLE vector_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_memory_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for vector_memories
CREATE POLICY "Users can only access their own memories" ON vector_memories
    FOR ALL USING (auth.uid() = user_id);

-- Policies for conversation_contexts  
CREATE POLICY "Users can only access their own contexts" ON conversation_contexts
    FOR ALL USING (auth.uid() = user_id);

-- Policies for user_memory_profiles
CREATE POLICY "Users can only access their own profiles" ON user_memory_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Function to search memories using vector similarity
CREATE OR REPLACE FUNCTION search_memories(
    query_embedding vector(1536),
    user_id UUID,
    similarity_threshold FLOAT DEFAULT 0.7,
    match_count INT DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    conversation_id VARCHAR(255),
    content TEXT,
    metadata JSONB,
    similarity FLOAT,
    created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL STABLE
AS $$
    SELECT 
        vm.id,
        vm.conversation_id,
        vm.content,
        vm.metadata,
        1 - (vm.embedding <=> query_embedding) AS similarity,
        vm.created_at
    FROM vector_memories vm
    WHERE 
        vm.user_id = search_memories.user_id
        AND 1 - (vm.embedding <=> query_embedding) > similarity_threshold
    ORDER BY vm.embedding <=> query_embedding
    LIMIT match_count;
$$;

-- Function to get conversation summary
CREATE OR REPLACE FUNCTION get_conversation_summary(
    p_user_id UUID,
    p_conversation_id VARCHAR(255)
)
RETURNS TABLE (
    summary TEXT,
    key_topics TEXT[],
    message_count BIGINT,
    avg_importance FLOAT
)
LANGUAGE SQL STABLE
AS $$
    SELECT 
        cc.summary,
        cc.key_topics,
        COUNT(vm.id) as message_count,
        AVG((vm.metadata->>'importance_score')::FLOAT) as avg_importance
    FROM conversation_contexts cc
    LEFT JOIN vector_memories vm ON vm.user_id = cc.user_id AND vm.conversation_id = cc.conversation_id
    WHERE 
        cc.user_id = p_user_id 
        AND cc.conversation_id = p_conversation_id
    GROUP BY cc.summary, cc.key_topics;
$$;

-- Function to update user memory profile
CREATE OR REPLACE FUNCTION update_user_memory_profile(
    p_user_id UUID
)
RETURNS VOID
LANGUAGE PLPGSQL
AS $$
DECLARE
    user_topics TEXT[];
    user_style VARCHAR(50);
    user_prefs JSONB;
BEGIN
    -- Calculate aggregated user data from conversations
    SELECT 
        array_agg(DISTINCT topic) FILTER (WHERE topic IS NOT NULL),
        mode() WITHIN GROUP (ORDER BY conversation_style) FILTER (WHERE conversation_style IS NOT NULL),
        jsonb_object_agg(key, value) FILTER (WHERE key IS NOT NULL)
    INTO user_topics, user_style, user_prefs
    FROM (
        SELECT 
            unnest(key_topics) as topic,
            conversation_style,
            jsonb_each_text(user_preferences) as (key, value)
        FROM conversation_contexts 
        WHERE user_id = p_user_id
    ) t;
    
    -- Upsert user memory profile
    INSERT INTO user_memory_profiles (
        user_id, 
        topics_of_interest, 
        communication_style, 
        preferences,
        updated_at
    )
    VALUES (
        p_user_id,
        COALESCE(user_topics, '{}'),
        COALESCE(user_style, 'standard'),
        COALESCE(user_prefs, '{}'),
        NOW()
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET
        topics_of_interest = EXCLUDED.topics_of_interest,
        communication_style = EXCLUDED.communication_style,
        preferences = EXCLUDED.preferences,
        updated_at = NOW();
END;
$$;

-- Trigger to automatically update user profiles when contexts change
CREATE OR REPLACE FUNCTION trigger_update_user_profile()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
    PERFORM update_user_memory_profile(NEW.user_id);
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_user_profile_trigger
    AFTER INSERT OR UPDATE ON conversation_contexts
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_user_profile();

-- Function to cleanup old memories
CREATE OR REPLACE FUNCTION cleanup_old_memories(
    days_to_keep INT DEFAULT 90,
    min_importance_score FLOAT DEFAULT 0.3
)
RETURNS INT
LANGUAGE PLPGSQL
AS $$
DECLARE
    deleted_count INT;
BEGIN
    DELETE FROM vector_memories 
    WHERE 
        created_at < NOW() - (days_to_keep || ' days')::INTERVAL
        AND (metadata->>'importance_score')::FLOAT < min_importance_score;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;

-- Comments
COMMENT ON TABLE vector_memories IS 'Stores conversation memories with vector embeddings for semantic search';
COMMENT ON TABLE conversation_contexts IS 'Stores conversation summaries and contextual information';
COMMENT ON TABLE user_memory_profiles IS 'Stores aggregated user patterns and preferences';
COMMENT ON FUNCTION search_memories IS 'Searches memories using vector similarity';
COMMENT ON FUNCTION cleanup_old_memories IS 'Cleans up old, low-importance memories';